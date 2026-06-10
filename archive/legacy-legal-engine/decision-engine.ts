import type { DecisionContext, DecisionResult } from "./types";

function hasEvent(context: DecisionContext, eventType: string): boolean {
  return context.events.some((event) => event.eventType === eventType);
}

function hasGap(context: DecisionContext): boolean {
  return context.gaps.length > 0;
}

export function decideFlow(context: DecisionContext): DecisionResult {
  const criteria: string[] = [];
  const reasons: string[] = [];

  if (hasGap(context)) {
    criteria.push("Existem lacunas de informação relevantes.");
    reasons.push("O contexto contém lacunas que exigem cautela decisória.");
  }

  if (context.caseType === "RH") {
    const hasDecision = hasEvent(context, "decisao");
    const hasScience = hasEvent(context, "ciencia");
    const hasClosure = hasEvent(context, "encerramento");

    if (hasClosure) {
      return {
        suggestedAct: "arquivamento",
        confidence: "alta",
        criteria: ["Há sinal de encerramento/arquivamento já praticado."],
        requiresHumanReview: true,
        blocksMeritDecision: false,
        reasons: ["Caso funcional aparentemente concluído."]
      };
    }

    if (hasDecision && hasScience && !hasGap(context)) {
      return {
        suggestedAct: "arquivamento",
        confidence: "alta",
        criteria: ["Há decisão e ciência do interessado.", "Não há lacuna crítica identificada."],
        requiresHumanReview: true,
        blocksMeritDecision: false,
        reasons: ["Fluxo funcional compatível com encerramento do processo."]
      };
    }

    return {
      suggestedAct: "diligencia",
      confidence: "media",
      criteria: [...criteria, "Faltam marcos suficientes para encerramento seguro."],
      requiresHumanReview: true,
      blocksMeritDecision: true,
      reasons: [...reasons, "O processo funcional não demonstra claramente decisão + ciência."]
    };
  }

  if (context.caseType === "fiscal") {
    const hasAuto = hasEvent(context, "auto_infracao");
    const hasIntimation = hasEvent(context, "intimacao");
    const hasImpugnation = hasEvent(context, "impugnacao");

    if (hasAuto && hasIntimation && !hasImpugnation && !hasGap(context)) {
      return {
        suggestedAct: "encaminhamento",
        confidence: "alta",
        criteria: [
          "Há auto de infração.",
          "Há sinal de intimação.",
          "Não há sinal de impugnação no contexto informado."
        ],
        requiresHumanReview: true,
        blocksMeritDecision: false,
        reasons: [
          "Fluxo fiscal compatível com revelia/manutenção, sujeito à confirmação humana."
        ]
      };
    }

    if (hasImpugnation) {
      return {
        suggestedAct: "encaminhamento",
        confidence: "media",
        criteria: ["Há sinal de impugnação/defesa."],
        requiresHumanReview: true,
        blocksMeritDecision: true,
        reasons: ["Não é seguro tratar como revelia automática."]
      };
    }

    return {
      suggestedAct: "diligencia",
      confidence: "media",
      criteria: [...criteria, "Faltam marcos mínimos para conclusão fiscal segura."],
      requiresHumanReview: true,
      blocksMeritDecision: true,
      reasons: [...reasons, "Contexto fiscal insuficiente para fechamento."]
    };
  }

  if (context.caseType === "judicial") {
    const hasOrder = hasEvent(context, "ordem_judicial");

    if (hasOrder) {
      return {
        suggestedAct: "cumprimento",
        confidence: "alta",
        criteria: ["Há sinal de ordem judicial ou liminar."],
        requiresHumanReview: true,
        blocksMeritDecision: false,
        reasons: ["Prioridade máxima para cumprimento da determinação judicial."]
      };
    }

    return {
      suggestedAct: "encaminhamento",
      confidence: "media",
      criteria: [...criteria, "Caso judicial sem ordem claramente identificada."],
      requiresHumanReview: true,
      blocksMeritDecision: true,
      reasons: [...reasons, "Necessária conferência do conteúdo judicial."]
    };
  }

  if (context.caseType === "omissao") {
    return {
      suggestedAct: "encaminhamento",
      confidence: hasGap(context) ? "media" : "alta",
      criteria: [
        "Caso classificado como omissão administrativa.",
        "Necessidade de priorização para decisão conclusiva."
      ],
      requiresHumanReview: true,
      blocksMeritDecision: false,
      reasons: ["Fluxo compatível com saneamento prioritário ou decisão pendente."]
    };
  }

  return {
    suggestedAct: "diligencia",
    confidence: "baixa",
    criteria: ["Tipo de caso não identificado com segurança."],
    requiresHumanReview: true,
    blocksMeritDecision: true,
    reasons: ["Não há base suficiente para ato mais específico."]
  };
}
