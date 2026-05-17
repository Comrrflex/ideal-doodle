"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function GenerateButton({ projectId }: { projectId: string }) {
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
    <div className="row">
      <button className="button" onClick={generate} disabled={loading}>
        {loading ? "Gerando..." : "Gerar decisão"}
      </button>
      {error ? <span style={{ color: "#ff9eb0" }}>{error}</span> : null}
    </div>
  );
}
