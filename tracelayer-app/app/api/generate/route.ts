import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { DEFAULT_MODEL, getOpenAIClient, isMissingOpenAIKey } from "@/lib/openai";
import { requireSession } from "@/lib/auth";
import { DecisionTraceOutput } from "@/lib/types";
import { validateAndStampDecisionTrace } from "@/lib/decisionTrace";

const schema = z.object({
  projectId: z.string().min(1)
});

const outputSchema = {
  type: "object",
  properties: {
    briefing: {
      type: "object",
      properties: {
        contexto: { type: "string" },
        objetivo: { type: "string" },
        restricoes: { type: "array", items: { type: "string" } },
        partes_interessadas: { type: "array", items: { type: "string" } }
      },
      required: ["contexto", "objetivo", "restricoes", "partes_interessadas"],
      additionalProperties: false
    },
    extracao_de_fatos: {
      type: "object",
      properties: {
        fatos_confirmados: { type: "array", items: { type: "string" } },
        evidencias_usadas: { type: "array", items: { type: "string" } },
        lacunas: { type: "array", items: { type: "string" } }
      },
      required: ["fatos_confirmados", "evidencias_usadas", "lacunas"],
      additionalProperties: false
    },
    hipoteses: {
      type: "array",
      items: {
        type: "object",
        properties: {
          hipotese: { type: "string" },
          confianca: { type: "string", enum: ["baixa", "media", "alta"] },
          como_validar: { type: "string" }
        },
        required: ["hipotese", "confianca", "como_validar"],
        additionalProperties: false
      }
    },
    criterios: {
      type: "array",
      items: {
        type: "object",
        properties: {
          criterio: { type: "string" },
          peso: { type: "string", enum: ["LOW", "MEDIUM", "HIGH"] },
          motivo: { type: "string" }
        },
        required: ["criterio", "peso", "motivo"],
        additionalProperties: false
      }
    },
    decisao: {
      type: "object",
      properties: {
        recomendacao: { type: "string" },
        tipo: { type: "string" },
        confianca: { type: "string", enum: ["baixa", "media", "alta"] },
        requer_aprovacao_humana: { type: "boolean" }
      },
      required: ["recomendacao", "tipo", "confianca", "requer_aprovacao_humana"],
      additionalProperties: false
    },
    plano: {
      type: "array",
      items: {
        type: "object",
        properties: {
          passo: { type: "string" },
          prioridade: { type: "string", enum: ["LOW", "MEDIUM", "HIGH"] },
          dono: { type: "string" },
          prazo_sugerido: { type: "string" }
        },
        required: ["passo", "prioridade", "dono", "prazo_sugerido"],
        additionalProperties: false
      }
    },
    trilha_auditavel: {
      type: "object",
      properties: {
        regras_aplicadas: { type: "array", items: { type: "string" } },
        riscos: { type: "array", items: { type: "string" } },
        versao_decisao: { type: "string" },
        hash_referencia: { type: "string" }
      },
      required: ["regras_aplicadas", "riscos", "versao_decisao", "hash_referencia"],
      additionalProperties: false
    },
  },
  required: [
    "briefing",
    "extracao_de_fatos",
    "hipoteses",
    "criterios",
    "decisao",
    "plano",
    "trilha_auditavel"
  ],
  additionalProperties: false
};

export async function POST(req: Request) {
  try {
    await requireSession();

    const body = schema.parse(await req.json());
    const project = await db.project.findUnique({
      where: { id: body.projectId }
    });

    if (!project) {
      return NextResponse.json({ error: "Projeto não encontrado." }, { status: 404 });
    }

    const systemPrompt = `
Você é A Força, um engine de decisão estruturada para organizações que precisam reduzir decisões ruins, preservar rastreabilidade e executar com governança.

Siga exatamente esta ordem de raciocínio e saída:
1. Briefing
2. Extração de fatos
3. Hipóteses
4. Critérios
5. Decisão
6. Plano
7. Trilha auditável

Regras obrigatórias:
- Não venda "IA"; venda redução de decisão ruim, rastreabilidade, governança e execução consistente
- Não invente dados, números, métricas, provas ou depoimentos
- Separe fatos confirmados, hipóteses e lacunas
- Se faltar prova, registre a lacuna e diga como validar
- Toda decisão deve declarar critérios, riscos, aprovação humana e plano executável
- A trilha auditável deve permitir revisar por que a decisão foi sugerida
- Use português do Brasil
- Seja direto, executivo e institucional
`;

    const userPrompt = `
Briefing bruto:
- Nome: ${project.name}
- Contexto/ativo decisório: ${project.product}
- Partes interessadas/público: ${project.audience}
- Objetivo: ${project.objective}
- Restrições/recursos: ${project.offer || "não informado"}
- Canal/superfície operacional: ${project.channel || "não informado"}
- Riscos/objeções: ${project.objections || "não informado"}
- Fase: ${project.stage || "não informado"}

Gere uma decisão estruturada para dashboard, sem inventar evidências.
`;

    const traceInput = {
      projectId: project.id,
      name: project.name,
      product: project.product,
      audience: project.audience,
      objective: project.objective,
      offer: project.offer,
      channel: project.channel,
      objections: project.objections,
      stage: project.stage
    };

    const openai = getOpenAIClient();

    const response = await openai.responses.create({
      model: DEFAULT_MODEL,
      input: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      text: {
        format: {
          type: "json_schema",
          name: "decision_trace_output",
          strict: true,
          schema: outputSchema
        }
      }
    });

    const content = response.output_text;
    const parsed = validateAndStampDecisionTrace(
      JSON.parse(content) as DecisionTraceOutput,
      traceInput
    );

    const run = await db.run.create({
      data: {
        projectId: project.id,
        inputJson: JSON.stringify(traceInput),
        outputJson: JSON.stringify(parsed),
        outputText: JSON.stringify(parsed),
        model: DEFAULT_MODEL,
        status: "completed",
        responseId: response.id
      }
    });

    return NextResponse.json({
      success: true,
      runId: run.id,
      responseId: response.id,
      output: parsed
    });
  } catch (error) {
    console.error(error);

    if (isMissingOpenAIKey(error)) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY não configurada no servidor." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error && error.message === "UNAUTHORIZED"
            ? "Não autenticado."
            : "Erro ao gerar resultado."
      },
      { status: error instanceof Error && error.message === "UNAUTHORIZED" ? 401 : 500 }
    );
  }
}
