type Props = {
  action: string;
  submitLabel?: string;
  defaults?: {
    name?: string;
    product?: string;
    audience?: string;
    objective?: string;
    offer?: string;
    channel?: string;
    objections?: string;
    stage?: string;
  };
};

export function ProjectForm({ action, submitLabel = "Salvar projeto", defaults }: Props) {
  return (
    <form className="card grid" action={action} method="post">
      <div className="grid-2">
        <div>
          <label className="label">Nome do projeto</label>
          <input className="input" name="name" defaultValue={defaults?.name} required />
        </div>
        <div>
          <label className="label">Canal</label>
          <input className="input" name="channel" defaultValue={defaults?.channel} placeholder="Instagram, LinkedIn, Email..." />
        </div>
      </div>

      <div>
        <label className="label">Contexto ou ativo decisório</label>
        <textarea className="textarea" name="product" defaultValue={defaults?.product} required />
      </div>

      <div>
        <label className="label">Partes interessadas</label>
        <textarea className="textarea" name="audience" defaultValue={defaults?.audience} required />
      </div>

      <div>
        <label className="label">Objetivo</label>
        <textarea className="textarea" name="objective" defaultValue={defaults?.objective} required />
      </div>

      <div>
        <label className="label">Restrições ou recursos</label>
        <textarea className="textarea" name="offer" defaultValue={defaults?.offer} />
      </div>

      <div>
        <label className="label">Riscos e objeções</label>
        <textarea className="textarea" name="objections" defaultValue={defaults?.objections} placeholder="risco operacional, evidência fraca, baixa adoção..." />
      </div>

      <div>
        <label className="label">Fase</label>
        <input className="input" name="stage" defaultValue={defaults?.stage} placeholder="triagem, validação, decisão, execução..." />
      </div>

      <button className="button" type="submit">{submitLabel}</button>
    </form>
  );
}
