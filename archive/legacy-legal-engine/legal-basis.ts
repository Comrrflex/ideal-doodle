import type { CaseType, LegalBasisResult } from "./types";

type ProjectLike = {
  legalContext?: string | null;
  summary?: string | null;
  evidence?: string | null;
  factualContext?: string | null;
};

const NORM_GROUPS: Record<CaseType, string[]> = {
  RH: ["Lei Estadual nº 5.427/2009"],
  fiscal: [
    "Lei nº 2.657/1996",
    "Lei Complementar nº 87/1996",
    "CTN",
    "Convênios ICMS aplicáveis"
  ],
  judicial: [
    "Lei Estadual nº 5.427/2009",
    "Constituição Federal, art. 5º, LXXVIII",
    "Lei nº 12.016/2009"
  ],
  omissao: [
    "Lei Estadual nº 5.427/2009",
    "Decreto nº 2.473/1979",
    "Constituição Federal, art. 5º, LXXVIII"
  ],
  outro: ["Lei Estadual nº 5.427/2009"]
};

export function getLegalBasis(caseType: CaseType, project: ProjectLike): LegalBasisResult {
  const blob = [project.legalContext, project.summary, project.evidence, project.factualContext]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const citedNorms: string[] = [];

  if (blob.includes("5.427/2009")) citedNorms.push("Lei Estadual nº 5.427/2009");
  if (blob.includes("2.473/1979")) citedNorms.push("Decreto nº 2.473/1979");
  if (blob.includes("2.657/96") || blob.includes("2.657/1996")) citedNorms.push("Lei nº 2.657/1996");
  if (blob.includes("87/96") || blob.includes("87/1996")) citedNorms.push("Lei Complementar nº 87/1996");
  if (blob.includes("ctn")) citedNorms.push("CTN");
  if (blob.includes("12.016/09") || blob.includes("12.016/2009")) citedNorms.push("Lei nº 12.016/2009");
  if (blob.includes("convênio icms") || blob.includes("convenio icms")) citedNorms.push("Convênios ICMS aplicáveis");

  const probableNorms = NORM_GROUPS[caseType];
  const reasons = [
    "Normas citadas foram extraídas do contexto informado.",
    "Normas prováveis foram sugeridas a partir da classe do processo."
  ];

  return {
    citedNorms: dedupe(citedNorms),
    probableNorms: dedupe(probableNorms),
    reasons
  };
}

function dedupe(values: string[]): string[] {
  return [...new Set(values)];
}
