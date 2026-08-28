import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { Header } from "@/components/Header";
import { OpenAISetupCard } from "@/components/OpenAISetupCard";
import { isOpenAIConfigured } from "@/lib/openai";
import { formatDate } from "@/lib/utils";
import { GenerateButton } from "./GenerateButton";
import { ResultCard } from "@/components/ResultCard";
import { MarketingOutput } from "@/lib/types";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProjectDetailPage({ params }: PageProps) {
  const session = await getSession();
  if (!session) redirect("/login");
  const openAIConfigured = isOpenAIConfigured();

  const { id } = await params;
  const project = await db.project.findUnique({
    where: { id },
    include: {
      runs: { orderBy: { createdAt: "desc" } }
    }
  });

  if (!project) notFound();

  const latestRun = project.runs[0];
  let parsedOutput: MarketingOutput | null = null;

  try {
    parsedOutput = latestRun?.outputJson
      ? (JSON.parse(latestRun.outputJson) as MarketingOutput)
      : null;
  } catch {
    parsedOutput = null;
  }

  return (
    <main className="page">
      <div className="container">
        <Header />

        <div className="grid-2" style={{ alignItems: "start" }}>
          <div className="card">
            <div className="space-between">
              <div>
                <h1 style={{ marginTop: 0, marginBottom: 8 }}>{project.name}</h1>
                <div className="muted">
                  Criado em {formatDate(project.createdAt)}
                </div>
              </div>
              <GenerateButton projectId={project.id} openAIConfigured={openAIConfigured} />
            </div>
            {!openAIConfigured ? <OpenAISetupCard compact /> : null}

            <div className="grid" style={{ marginTop: 20 }}>
              <div>
                <div className="label">Contexto ou ativo decisório</div>
                <pre className="output">{project.product}</pre>
              </div>
              <div>
                <div className="label">Partes interessadas</div>
                <pre className="output">{project.audience}</pre>
              </div>
              <div>
                <div className="label">Objetivo</div>
                <pre className="output">{project.objective}</pre>
              </div>
              <div>
                <div className="label">Restrições ou recursos</div>
                <pre className="output">{project.offer || "Não informado"}</pre>
              </div>
              <div>
                <div className="label">Riscos e objeções</div>
                <pre className="output">{project.objections || "Não informado"}</pre>
              </div>
              <div>
                <div className="label">Fase</div>
                <pre className="output">{project.stage || "Não informado"}</pre>
              </div>
            </div>
          </div>

          <div className="grid">
            <div className="card">
              <h3 style={{ marginTop: 0 }}>Histórico</h3>
              <div className="grid">
                {project.runs.length === 0 ? (
                  <div className="muted">Nenhuma geração ainda.</div>
                ) : (
                  project.runs.map((run) => (
                    <div key={run.id} className="card" style={{ padding: 14 }}>
                      <div className="space-between">
                        <span className="badge">{run.model}</span>
                        <span className="muted">{formatDate(run.createdAt)}</span>
                      </div>
                      <div className="muted" style={{ marginTop: 10 }}>
                        Status: {run.status} • Response ID: {run.responseId || "n/a"}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          {parsedOutput ? (
            <ResultCard output={parsedOutput} />
          ) : latestRun?.outputText ? (
            <div className="card">
              <h3>Saída textual</h3>
              <pre className="output">{latestRun.outputText}</pre>
            </div>
          ) : (
            <div className="card">
              <strong>Pronto para gerar.</strong>
              <div className="muted" style={{ marginTop: 8 }}>
                Clique em “Gerar decisão” para criar briefing, fatos, hipóteses, critérios, plano e trilha.
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
