import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { Header } from "@/components/Header";
import { db } from "@/lib/db";

export default async function NewProjectPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  async function createProject(formData: FormData) {
    "use server";

    const name = String(formData.get("name") || "");
    const product = String(formData.get("product") || "");
    const audience = String(formData.get("audience") || "");
    const objective = String(formData.get("objective") || "");
    const offer = String(formData.get("offer") || "");
    const channel = String(formData.get("channel") || "");
    const objections = String(formData.get("objections") || "");
    const stage = String(formData.get("stage") || "");

    const project = await db.project.create({
      data: {
        name,
        product,
        audience,
        objective,
        offer,
        channel,
        objections,
        stage
      }
    });

    redirect(`/dashboard/project/${project.id}`);
  }

  return (
    <main className="page">
      <div className="container">
        <Header />
        <form className="card grid" action={createProject}>
          <div>
            <h1 style={{ marginTop: 0 }}>Novo projeto</h1>
            <p className="muted">
              Estruture o briefing decisório. Quanto melhor a entrada, mais auditável fica a saída.
            </p>
          </div>

          <div className="grid-2">
            <div>
              <label className="label">Nome do projeto</label>
              <input className="input" name="name" required />
            </div>
            <div>
              <label className="label">Canal</label>
              <input className="input" name="channel" placeholder="Instagram, LinkedIn, Email..." />
            </div>
          </div>

          <div>
            <label className="label">Contexto ou ativo decisório</label>
            <textarea className="textarea" name="product" required />
          </div>

          <div>
            <label className="label">Partes interessadas</label>
            <textarea className="textarea" name="audience" required />
          </div>

          <div>
            <label className="label">Objetivo</label>
            <textarea className="textarea" name="objective" required />
          </div>

          <div>
            <label className="label">Restrições ou recursos</label>
            <textarea className="textarea" name="offer" />
          </div>

          <div>
            <label className="label">Riscos e objeções</label>
            <textarea className="textarea" name="objections" placeholder="risco operacional, evidência fraca, baixa adoção..." />
          </div>

          <div>
            <label className="label">Fase</label>
            <input className="input" name="stage" placeholder="triagem, validação, decisão, execução..." />
          </div>

          <button className="button" type="submit">Salvar caso</button>
        </form>
      </div>
    </main>
  );
}
