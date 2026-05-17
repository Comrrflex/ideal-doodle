export type DecisionPriority = "LOW" | "MEDIUM" | "HIGH";

export type DecisionTraceOutput = {
  briefing: {
    contexto: string;
    objetivo: string;
    restricoes: string[];
    partes_interessadas: string[];
  };
  extracao_de_fatos: {
    fatos_confirmados: string[];
    evidencias_usadas: string[];
    lacunas: string[];
  };
  hipoteses: {
    hipotese: string;
    confianca: "baixa" | "media" | "alta";
    como_validar: string;
  }[];
  criterios: {
    criterio: string;
    peso: DecisionPriority;
    motivo: string;
  }[];
  decisao: {
    recomendacao: string;
    tipo: string;
    confianca: "baixa" | "media" | "alta";
    requer_aprovacao_humana: boolean;
  };
  plano: {
    passo: string;
    prioridade: DecisionPriority;
    dono: string;
    prazo_sugerido: string;
  }[];
  trilha_auditavel: {
    regras_aplicadas: string[];
    riscos: string[];
    versao_decisao: string;
    hash_referencia: string;
  };
};

export type MarketingOutput = DecisionTraceOutput;
