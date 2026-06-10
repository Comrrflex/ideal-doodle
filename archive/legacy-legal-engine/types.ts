export type CaseType = "RH" | "fiscal" | "judicial" | "omissao" | "outro";

export type ConfidenceLevel = "baixa" | "media" | "alta";

export type SuggestedAct =
  | "deferimento"
  | "indeferimento"
  | "diligencia"
  | "arquivamento"
  | "cumprimento"
  | "encaminhamento";

export type ProcessEventType =
  | "protocolo"
  | "requerimento"
  | "parecer"
  | "despacho"
  | "decisao"
  | "ciencia"
  | "publicacao"
  | "encerramento"
  | "auto_infracao"
  | "intimacao"
  | "impugnacao"
  | "ordem_judicial"
  | "outro";

export type ProcessEvent = {
  eventType: ProcessEventType;
  description: string;
  confidence: ConfidenceLevel;
  source: string;
  eventDate?: string;
};

export type ClassificationResult = {
  caseType: CaseType;
  confidence: ConfidenceLevel;
  reasons: string[];
};

export type LegalBasisResult = {
  citedNorms: string[];
  probableNorms: string[];
  reasons: string[];
};

export type DecisionContext = {
  processNumber?: string | null;
  caseType: CaseType;
  currentPhase?: string | null;
  facts: string[];
  events: ProcessEvent[];
  legalBasis: string[];
  risks: string[];
  gaps: string[];
};

export type DecisionResult = {
  suggestedAct: SuggestedAct;
  confidence: ConfidenceLevel;
  criteria: string[];
  requiresHumanReview: boolean;
  blocksMeritDecision: boolean;
  reasons: string[];
};

export type DecisionOutput = {
  processo: {
    numero: string;
    tipo: string;
    unidade: string;
    interessado: string;
    fase_atual: string;
  };
  analise: {
    objetivo_da_analise: string;
    fatos_comprovados: string[];
    inferencias: string[];
    hipoteses: string[];
    lacunas_de_informacao: string[];
    documentos_chave: string[];
  };
  fundamentacao: {
    normas_aplicaveis: string[];
    criterios_utilizados: string[];
    riscos_identificados: string[];
  };
  recomendacao: {
    conclusao: string;
    tipo_de_ato: SuggestedAct;
    despacho_sugerido: string;
    proximos_passos: string[];
    checklist_validacao_humana: string[];
  };
  auditoria: {
    confianca_geral: ConfidenceLevel;
    base_documental_suficiente: boolean;
    regras_aplicadas: string[];
    observacoes: string;
  };
};
