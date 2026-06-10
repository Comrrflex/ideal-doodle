import OpenAI from "openai";

const OPENAI_API_KEY_ERROR = "OPENAI_API_KEY_MISSING";

export const DEFAULT_MODEL = process.env.OPENAI_MODEL || "gpt-5.4";

export function isOpenAIConfigured() {
  return Boolean(process.env.OPENAI_API_KEY);
}

export function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error(OPENAI_API_KEY_ERROR);
  }

  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
}

export function isMissingOpenAIKey(error: unknown) {
  return error instanceof Error && error.message === OPENAI_API_KEY_ERROR;
}
