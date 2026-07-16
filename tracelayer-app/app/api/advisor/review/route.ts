import { NextResponse } from "next/server";
import { z } from "zod";
import { hasValidAdvisorApiToken, requireSession } from "@/lib/auth";
import { AdvisorSDK } from "@/lib/advisorSdk";
import { DEFAULT_MODEL, isMissingOpenAIKey } from "@/lib/openai";

const schema = z.object({
  targets: z.array(z.string().min(1)).min(1).max(12),
  focus: z.string().trim().min(1).max(2000).optional(),
  maxFiles: z.number().int().min(1).max(20).optional(),
  maxCharsPerFile: z.number().int().min(1000).max(20000).optional()
});

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    if (!hasValidAdvisorApiToken(req.headers.get("authorization"))) {
      await requireSession();
    }

    const body = schema.parse(await req.json());
    const advisor = new AdvisorSDK({
      model: process.env.ADVISOR_MODEL || DEFAULT_MODEL
    });

    const review = await advisor.reviewFiles(body);

    return NextResponse.json({
      success: true,
      review
    });
  } catch (error) {
    if (isMissingOpenAIKey(error)) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY não configurada no servidor." },
        { status: 500 }
      );
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Payload inválido.",
          details: error.flatten()
        },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }

    console.error(error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Erro ao revisar arquivos."
      },
      { status: 500 }
    );
  }
}
