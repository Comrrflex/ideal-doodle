import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function LoginPage() {
  const session = await getSession();
  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="page">
      <div className="container" style={{ maxWidth: 520, paddingTop: 72 }}>
        <form className="card grid" action="/api/login" method="post">
          <div>
            <h1 style={{ marginTop: 0 }}>Entrar</h1>
            <p className="muted">
              Acesse o workspace de decisão estruturada e trilhas auditáveis.
            </p>
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" name="email" required />
          </div>
          <div>
            <label className="label">Senha</label>
            <input className="input" type="password" name="password" required />
          </div>
          <button className="button" type="submit">Entrar no dashboard</button>
        </form>
      </div>
    </main>
  );
}
