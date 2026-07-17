type OpenAISetupCardProps = {
  compact?: boolean;
};

const OPENAI_SETUP_BORDER = "1px solid rgba(255, 158, 176, 0.35)";
const OPENAI_SETUP_BACKGROUND = "rgba(255, 158, 176, 0.08)";

export function OpenAISetupCard({ compact = false }: OpenAISetupCardProps) {
  return (
    <div
      className="card"
      style={{
        marginBottom: compact ? 0 : 16,
        border: OPENAI_SETUP_BORDER,
        background: OPENAI_SETUP_BACKGROUND
      }}
    >
      <div className="badge" style={{ marginBottom: 12 }}>
        OpenAI não configurado
      </div>
      <strong>Adicione a chave em OPENAI_API_KEY para liberar as gerações.</strong>
      <div className="muted" style={{ marginTop: 8 }}>
        Preencha <code>.env.local</code> com a variável <code>OPENAI_API_KEY</code>{" "}
        e reinicie o servidor caso ele já esteja em execução.
      </div>
    </div>
  );
}
