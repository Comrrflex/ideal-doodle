import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { Header } from "@/components/Header";
import { OpenAISetupCard } from "@/components/OpenAISetupCard";
import { isOpenAIConfigured } from "@/lib/openai";
import { formatDate } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const openAIConfigured = isOpenAIConfigured();

  const [projects, runsCount] = await Promise.all([
    db.project.findMany({
      orderBy: { createdAt: "desc" },
      include: { runs: { orderBy: { createdAt: "desc" }, take: 1 } }
    }),
    db.run.count()
  ]);

  return (
    <main className="page">
      <div className="container">
        <Header />
        {!openAIConfigured ? <OpenAISetupCard /> : null}

        <div className="grid-3" style={{ marginBottom: 16 }}>
          <div className="card">
            <div className="muted">Projetos</div>
            <div style={{ fontSize: 32, fontWeight: 700 }}>{projects.length}</div>
          </div>
          <div className="card">
            <div className="muted">Execuções</div>
            <div style={{ fontSize: 32, fontWeight: 700 }}>{runsCount}</div>
          </div>
          <div className="card">
            <div className="muted">Sessão</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{session.email}</div>
          </div>
        </div>

        <div className="space-between" style={{ marginBottom: 16 }}>
          <div>
            <h2 style={{ margin: 0 }}>Projetos</h2>
            <div className="muted">Crie o briefing e gere uma decisão rastreável.</div>
          </div>
          <Link href="/dashboard/new" className="button">
            Novo projeto
          </Link>
        </div>

        <div className="grid">
          {projects.length === 0 ? (
            <div className="card">
              <strong>Sem projetos ainda.</strong>
              <div className="muted" style={{ marginTop: 8 }}>
                Crie o primeiro caso para testar o fluxo de decisão.
              </div>
            </div>
          ) : (
            projects.map((project) => (
              <Link key={project.id} href={`/dashboard/project/${project.id}`} className="card">
                <div className="space-between">
                  <div>
                    <strong>{project.name}</strong>
                    <div className="muted" style={{ marginTop: 6 }}>
                      {project.channel || "Canal não informado"} • {formatDate(project.createdAt)}
                    </div>
                  </div>
                  <span className="badge">{project.runs.length} última geração</span>
                </div>
                <div className="muted" style={{ marginTop: 14 }}>
                  {project.objective}
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
