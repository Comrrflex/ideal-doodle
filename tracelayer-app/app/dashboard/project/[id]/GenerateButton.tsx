"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type GenerateButtonProps = {
  projectId: string;
  openAIConfigured: boolean;
};

export function GenerateButton({ projectId, openAIConfigured }: GenerateButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const openAiSetupHintId = `openai-setup-hint-${projectId}`;

  async function generate() {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao gerar.");
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="row">
        <button
          className="button"
          onClick={generate}
          disabled={loading || !openAIConfigured}
          aria-describedby={!openAIConfigured ? openAiSetupHintId : undefined}
        >
          {loading ? "Gerando..." : "Gerar decisão"}
        </button>
        {error ? <span style={{ color: "#ff9eb0" }}>{error}</span> : null}
      </div>
      {!openAIConfigured ? (
        <div id={openAiSetupHintId} className="muted" style={{ marginTop: 8 }}>
          Configure a variável <code>OPENAI_API_KEY</code> no servidor para habilitar este botão.
        </div>
      ) : null}
    </div>
  );
}
