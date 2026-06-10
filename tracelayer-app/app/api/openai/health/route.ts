import { NextResponse } from "next/server";
import { DEFAULT_MODEL, isOpenAIConfigured } from "@/lib/openai";

export async function GET() {
  return NextResponse.json({
    configured: isOpenAIConfigured(),
    model: DEFAULT_MODEL,
    provider: "openai",
    api: "responses"
  });
}
