type OpenAISetupCardProps = {
  compact?: boolean;
};

export function OpenAISetupCard({ compact = false }: OpenAISetupCardProps) {
  return (
    <div
      className="card"
      style={{
        marginBottom: compact ? 0 : 16,
        border: "1px solid rgba(255, 158, 176, 0.35)",
        background: "rgba(255, 158, 176, 0.08)"
      }}
    >
      <div className="badge" style={{ marginBottom: 12 }}>
        OpenAI pendente
      </div>
      <strong>Adicione a chave em OPENAI_API_KEY para liberar as gerações.</strong>
      <div className="muted" style={{ marginTop: 8 }}>
        Preencha <code>.env.local</code> com a variável <code>OPENAI_API_KEY</code>{" "}
        e reinicie o servidor caso ele já esteja em execução.
      </div>
    </div>
  );
}
