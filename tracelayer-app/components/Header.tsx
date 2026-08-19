import Link from "next/link";

export function Header() {
  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <div className="space-between">
        <div>
          <strong>A Força</strong>
          <div className="muted" style={{ marginTop: 4 }}>
            Decisão estruturada + plano + trilha auditável
          </div>
        </div>
        <div className="row">
          <Link className="button secondary" href="/dashboard">
            Dashboard
          </Link>
          <form action="/api/logout" method="post">
            <button className="button danger" type="submit">
              Sair
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
