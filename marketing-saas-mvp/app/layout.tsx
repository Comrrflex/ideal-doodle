import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TraceLayer",
  description: "Engine de decisão estruturada com rastreabilidade, governança e plano executável."
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
