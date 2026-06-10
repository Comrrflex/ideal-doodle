import type { CaseType, ClassificationResult } from "./types";

type ProjectLike = {
  caseType?: string | null;
  summary?: string | null;
  factualContext?: string | null;
  evidence?: string | null;
  legalContext?: string | null;
  requestedAction?: string | null;
};

function includesAny(text: string, terms: string[]): boolean {
  return terms.some((term) => text.includes(term));
}

export function classifyCase(project: ProjectLike): ClassificationResult {
  if (project.caseType && project.caseType.trim() !== "") {
    return {
      caseType: normalizeCaseType(project.caseType),
      confidence: "alta",
      reasons: ["Tipo de caso informado explicitamente pelo operador."]
    };
  }

  const blob = [
    project.summary,
    project.factualContext,
    project.evidence,
    project.legalContext,
    project.requestedAction
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const reasons: string[] = [];

  if (
    includesAny(blob, [
      "licença-prêmio",
      "licença prêmio",
      "servidor",
      "vida funcional",
      "assentamento",
      "rh"
    ])
  ) {
    reasons.push("Sinais funcionais/RH detectados no contexto.");
    return { caseType: "RH", confidence: "media", reasons };
  }

  if (
    includesAny(blob, [
      "auto de infração",
      "icms",
      "difal",
      "fecp",
      "impugnação",
      "revelia",
      "crédito tributário"
    ])
  ) {
    reasons.push("Sinais fiscais/tributários detectados no contexto.");
    return { caseType: "fiscal", confidence: "media", reasons };
  }

  if (
    includesAny(blob, [
      "mandado de segurança",
      "ordem judicial",
      "liminar",
      "autoridade coatora",
      "intimar",
      "tjrj",
      "vara de fazenda"
    ])
  ) {
    reasons.push("Sinais de cumprimento judicial detectados no contexto.");
    return { caseType: "judicial", confidence: "media", reasons };
  }

  if (
    includesAny(blob, [
      "sem decisão",
      "omissão administrativa",
      "prazo excedido",
      "prazo superado",
      "mora administrativa",
      "ausência de decisão"
    ])
  ) {
    reasons.push("Sinais de omissão administrativa detectados no contexto.");
    return { caseType: "omissao", confidence: "media", reasons };
  }

  return {
    caseType: "outro",
    confidence: "baixa",
    reasons: ["Não foi possível classificar o caso com confiança suficiente."]
  };
}

export function normalizeCaseType(value: string): CaseType {
  const text = value.trim().toLowerCase();

  if (["rh", "funcional"].includes(text)) return "RH";
  if (["fiscal", "tributario", "tributário"].includes(text)) return "fiscal";
  if (["judicial", "cumprimento judicial"].includes(text)) return "judicial";
  if (["omissao", "omissão", "omissão administrativa"].includes(text)) return "omissao";

  return "outro";
}
