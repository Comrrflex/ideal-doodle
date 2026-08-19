import Link from "next/link";

export default function HomePage() {
  return (
    <main className="page">
      <div className="container hero">
        <div className="hero-panel">
          <span className="badge">Decision trace engine</span>
          <h1>Reduza decisões ruins com briefing, critérios, decisão, plano e auditoria.</h1>
          <p>
            A Força transforma contexto solto em uma saída institucional:
            fatos separados de hipóteses, critérios explícitos, plano executável
            e trilha auditável para revisão.
          </p>
          <div className="row" style={{ marginTop: 20 }}>
            <Link href="/login" className="button">Entrar</Link>
            <Link href="/dashboard" className="button secondary">Ver dashboard</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
