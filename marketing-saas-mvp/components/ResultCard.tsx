import { MarketingOutput } from "@/lib/types";

function ListBlock({ items }: { items: string[] }) {
  return (
    <ul className="clean-list">
      {items.map((item, index) => (
        <li key={`${item}-${index}`}>{item}</li>
      ))}
    </ul>
  );
}

export function ResultCard({ output }: { output: MarketingOutput }) {
  return (
    <div className="grid">
      <div className="card section-card">
        <span className="eyebrow">01</span>
        <h3>Briefing</h3>
        <pre className="output">{output.briefing.contexto}</pre>
        <div className="meta-grid">
          <div>
            <div className="label">Objetivo</div>
            <pre className="output">{output.briefing.objetivo}</pre>
          </div>
          <div>
            <div className="label">Partes interessadas</div>
            <ListBlock items={output.briefing.partes_interessadas} />
          </div>
        </div>
      </div>

      <div className="card section-card">
        <span className="eyebrow">02</span>
        <h3>Extração de fatos</h3>
        <div className="meta-grid">
          <div>
            <div className="label">Fatos confirmados</div>
            <ListBlock items={output.extracao_de_fatos.fatos_confirmados} />
          </div>
          <div>
            <div className="label">Evidências usadas</div>
            <ListBlock items={output.extracao_de_fatos.evidencias_usadas} />
          </div>
          <div>
            <div className="label">Lacunas</div>
            <ListBlock items={output.extracao_de_fatos.lacunas} />
          </div>
        </div>
      </div>

      <div className="card section-card">
        <span className="eyebrow">03</span>
        <h3>Hipóteses</h3>
        <div className="grid">
          {output.hipoteses.map((item, index) => (
            <div className="row-line" key={`${item.hipotese}-${index}`}>
              <strong>{item.hipotese}</strong>
              <span className="badge">{item.confianca}</span>
              <span className="muted">{item.como_validar}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card section-card">
        <span className="eyebrow">04</span>
        <h3>Critérios</h3>
        <div className="grid">
          {output.criterios.map((item, index) => (
            <div className="row-line" key={`${item.criterio}-${index}`}>
              <strong>{item.criterio}</strong>
              <span className="badge">{item.peso}</span>
              <span className="muted">{item.motivo}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card section-card decision-card">
        <span className="eyebrow">05</span>
        <h3>Decisão</h3>
        <pre className="output">{output.decisao.recomendacao}</pre>
        <div className="row" style={{ marginTop: 12 }}>
          <span className="badge">{output.decisao.tipo}</span>
          <span className="badge">confiança {output.decisao.confianca}</span>
          <span className="badge">
            {output.decisao.requer_aprovacao_humana ? "aprovação humana requerida" : "sem aprovação adicional"}
          </span>
        </div>
      </div>

      <div className="card section-card">
        <span className="eyebrow">06</span>
        <h3>Plano</h3>
        <div className="grid">
          {output.plano.map((item, index) => (
            <div className="row-line" key={`${item.passo}-${index}`}>
              <strong>{item.passo}</strong>
              <span className="badge">{item.prioridade}</span>
              <span className="muted">{item.dono} · {item.prazo_sugerido}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card section-card">
        <span className="eyebrow">07</span>
        <h3>Trilha auditável</h3>
        <div className="meta-grid">
          <div>
            <div className="label">Regras aplicadas</div>
            <ListBlock items={output.trilha_auditavel.regras_aplicadas} />
          </div>
          <div>
            <div className="label">Riscos</div>
            <ListBlock items={output.trilha_auditavel.riscos} />
          </div>
        </div>
        <div className="row" style={{ marginTop: 12 }}>
          <span className="badge">{output.trilha_auditavel.versao_decisao}</span>
          <span className="badge">{output.trilha_auditavel.hash_referencia}</span>
        </div>
      </div>
    </div>
  );
}
