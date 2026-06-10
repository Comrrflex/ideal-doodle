import { classifyCase } from "./case-classifier";
import { extractEvents, inferCurrentPhase } from "./event-extractor";
import { getLegalBasis } from "./legal-basis";
import { decideFlow } from "./decision-engine";
import { inferGapsFromProject } from "./validation";

type ProjectLike = {
  processNumber?: string | null;
  summary?: string | null;
  factualContext?: string | null;
  evidence?: string | null;
  legalContext?: string | null;
  risks?: string | null;
  caseType?: string | null;
};

export function buildDecisionContext(project: ProjectLike) {
  const classification = classifyCase(project);
  const events = extractEvents(project);
  const currentPhase = inferCurrentPhase(events);
  const legalBasis = getLegalBasis(classification.caseType, project);
  const gaps = inferGapsFromProject(project);
  const risks = project.risks ? [project.risks] : [];

  const context = {
    processNumber: project.processNumber ?? null,
    caseType: classification.caseType,
    currentPhase,
    facts: [project.summary, project.factualContext, project.evidence].filter(Boolean) as string[],
    events,
    legalBasis: [...legalBasis.citedNorms, ...legalBasis.probableNorms],
    risks,
    gaps
  };

  const decision = decideFlow(context);

  return {
    classification,
    events,
    currentPhase,
    legalBasis,
    context,
    decision
  };
}
