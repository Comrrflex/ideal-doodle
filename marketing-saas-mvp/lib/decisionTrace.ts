import { createHash } from "crypto";
import { z } from "zod";
import { DecisionTraceOutput } from "./types";

export const DECISION_TRACE_VERSION = "decision-output.v2";

const prioritySchema = z.enum(["LOW", "MEDIUM", "HIGH"]);
const confidenceSchema = z.enum(["baixa", "media", "alta"]);

export const decisionTraceSchema = z.object({
  briefing: z.object({
    contexto: z.string().min(1),
    objetivo: z.string().min(1),
    restricoes: z.array(z.string()),
    partes_interessadas: z.array(z.string())
  }),
  extracao_de_fatos: z.object({
    fatos_confirmados: z.array(z.string()).min(1),
    evidencias_usadas: z.array(z.string()),
    lacunas: z.array(z.string())
  }),
  hipoteses: z.array(
    z.object({
      hipotese: z.string().min(1),
      confianca: confidenceSchema,
      como_validar: z.string().min(1)
    })
  ),
  criterios: z.array(
    z.object({
      criterio: z.string().min(1),
      peso: prioritySchema,
      motivo: z.string().min(1)
    })
  ).min(1),
  decisao: z.object({
    recomendacao: z.string().min(1),
    tipo: z.string().min(1),
    confianca: confidenceSchema,
    requer_aprovacao_humana: z.boolean()
  }),
  plano: z.array(
    z.object({
      passo: z.string().min(1),
      prioridade: prioritySchema,
      dono: z.string().min(1),
      prazo_sugerido: z.string().min(1)
    })
  ).min(1),
  trilha_auditavel: z.object({
    regras_aplicadas: z.array(z.string()).min(1),
    riscos: z.array(z.string()),
    versao_decisao: z.string().min(1),
    hash_referencia: z.string().min(1)
  })
});

export function buildTraceReference(input: unknown, output: unknown) {
  const canonical = JSON.stringify({ input, output });
  return createHash("sha256").update(canonical).digest("hex").slice(0, 16);
}

export function validateAndStampDecisionTrace(
  output: DecisionTraceOutput,
  input: unknown
): DecisionTraceOutput {
  const parsed = decisionTraceSchema.parse(output);
  const stamped: DecisionTraceOutput = {
    ...parsed,
    trilha_auditavel: {
      ...parsed.trilha_auditavel,
      versao_decisao: DECISION_TRACE_VERSION,
      hash_referencia: buildTraceReference(input, parsed)
    }
  };

  return decisionTraceSchema.parse(stamped);
}
