"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OpenAISetupCard } from "@/components/OpenAISetupCard";

type GenerateButtonProps = {
  projectId: string;
  openAIConfigured: boolean;
};

export function GenerateButton({ projectId, openAIConfigured }: GenerateButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    <div className="row" style={{ alignItems: "flex-start" }}>
      <button
        className="button"
        onClick={generate}
        disabled={loading || !openAIConfigured}
        title={openAIConfigured ? undefined : "Configure OPENAI_API_KEY antes de gerar."}
      >
        {loading ? "Gerando..." : "Gerar decisão"}
      </button>
      {!openAIConfigured ? (
        <div style={{ minWidth: 280 }}>
          <OpenAISetupCard compact />
        </div>
      ) : null}
      {error ? <span style={{ color: "#ff9eb0" }}>{error}</span> : null}
    </div>
  );
}
