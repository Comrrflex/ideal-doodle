import type { DecisionOutput } from "./types";

export function validateDecisionOutput(output: DecisionOutput): void {
  if (!output.analise.fatos_comprovados.length) {
    throw new Error("Saída inválida: sem fatos comprovados.");
  }

  if (!output.recomendacao.checklist_validacao_humana.length) {
    throw new Error("Saída inválida: sem checklist de validação humana.");
  }

  if (!output.fundamentacao.criterios_utilizados.length) {
    throw new Error("Saída inválida: sem critérios utilizados.");
  }

  if (!output.auditoria.regras_aplicadas.length) {
    throw new Error("Saída inválida: sem registro de regras aplicadas.");
  }
}

export function inferGapsFromProject(project: {
  summary?: string | null;
  factualContext?: string | null;
  evidence?: string | null;
  legalContext?: string | null;
}): string[] {
  const gaps: string[] = [];

  if (!project.summary?.trim()) gaps.push("Resumo do caso ausente.");
  if (!project.factualContext?.trim()) gaps.push("Contexto fático ausente.");
  if (!project.evidence?.trim()) gaps.push("Evidências/documentos-base ausentes.");
  if (!project.legalContext?.trim()) gaps.push("Base normativa não informada.");

  return gaps;
}
