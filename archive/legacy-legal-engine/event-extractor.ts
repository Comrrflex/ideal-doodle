import type { ConfidenceLevel, ProcessEvent, ProcessEventType } from "./types";

type ProjectLike = {
  summary?: string | null;
  factualContext?: string | null;
  evidence?: string | null;
};

type Rule = {
  eventType: ProcessEventType;
  terms: string[];
  description: string;
  confidence: ConfidenceLevel;
};

const RULES: Rule[] = [
  { eventType: "protocolo", terms: ["protocol", "protocolo"], description: "Há sinal de protocolo do feito.", confidence: "media" },
  { eventType: "requerimento", terms: ["requerimento", "pedido"], description: "Há sinal de requerimento/pedido administrativo.", confidence: "media" },
  { eventType: "parecer", terms: ["parecer", "manifestação técnica"], description: "Há sinal de parecer ou manifestação técnica.", confidence: "media" },
  { eventType: "despacho", terms: ["despacho"], description: "Há sinal de despacho administrativo.", confidence: "media" },
  { eventType: "decisao", terms: ["decisão", "defiro", "indefiro", "concedo", "julgo"], description: "Há sinal de decisão administrativa ou julgamento.", confidence: "media" },
  { eventType: "ciencia", terms: ["ciência", "ciente"], description: "Há sinal de ciência do interessado.", confidence: "media" },
  { eventType: "publicacao", terms: ["publicação", "publicado"], description: "Há sinal de publicação formal.", confidence: "media" },
  { eventType: "encerramento", terms: ["arquivamento", "encerramento"], description: "Há sinal de encerramento/arquivamento.", confidence: "media" },
  { eventType: "auto_infracao", terms: ["auto de infração"], description: "Há sinal de auto de infração.", confidence: "alta" },
  { eventType: "intimacao", terms: ["intimação", "intimado"], description: "Há sinal de intimação.", confidence: "media" },
  { eventType: "impugnacao", terms: ["impugnação", "defesa"], description: "Há sinal de impugnação/defesa.", confidence: "media" },
  { eventType: "ordem_judicial", terms: ["mandado de segurança", "liminar", "ordem judicial"], description: "Há sinal de ordem judicial.", confidence: "alta" }
];

export function extractEvents(project: ProjectLike): ProcessEvent[] {
  const blob = [project.summary, project.factualContext, project.evidence]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const events: ProcessEvent[] = [];

  for (const rule of RULES) {
    if (rule.terms.some((term) => blob.includes(term))) {
      events.push({
        eventType: rule.eventType,
        description: rule.description,
        confidence: rule.confidence,
        source: "contexto agregado do caso"
      });
    }
  }

  return dedupeEvents(events);
}

export function inferCurrentPhase(events: ProcessEvent[]): string {
  const eventTypes = new Set(events.map((e) => e.eventType));

  if (eventTypes.has("encerramento")) return "encerramento";
  if (eventTypes.has("ciencia") && eventTypes.has("decisao")) return "pós-decisão com ciência";
  if (eventTypes.has("decisao")) return "decisão";
  if (eventTypes.has("parecer")) return "instrução técnica";
  if (eventTypes.has("requerimento") || eventTypes.has("protocolo")) return "instrução inicial";

  return "fase não identificada";
}

function dedupeEvents(events: ProcessEvent[]): ProcessEvent[] {
  const seen = new Set<string>();
  return events.filter((event) => {
    const key = `${event.eventType}:${event.description}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
