# TraceLayer

Decision Trace Engine for Governance, Auditability, and Operational Memory.

Transforme decisoes em ativos auditaveis.

TraceLayer converte contexto disperso em decisoes estruturadas, revisaveis e reproduziveis. Em vez de apenas gerar respostas, o sistema cria uma trilha completa de raciocinio e execucao que pode ser auditada, validada e reutilizada.

Canonical app in this repository: `tracelayer-app/`

Archived copy kept only for review or later deletion: `archive/legacy-legal-engine/`

---

## The Problem

A maioria das decisoes empresariais acontece em:

- reunioes sem registro adequado;
- mensagens dispersas;
- documentos desconectados;
- criterios nao documentados;
- execucao sem rastreabilidade.

O resultado e perda de contexto, retrabalho, baixa governanca e dificuldade para justificar decisoes.

---

## The Solution

TraceLayer transforma informacoes nao estruturadas em uma trilha de decisao organizada.

### Output gerado

- Confirmed Facts
- Information Gaps
- Hypotheses
- Decision Criteria
- Recommended Decision
- Execution Plan
- Auditable Trail

That is the product.

---

## Current State

This repository had two branches of product logic drifting apart:

- a TraceLayer dashboard app for structured decision traces;
- an older legal/process engine prototype.

To make the repository easier to understand, the real product app stays in `tracelayer-app/` and the older copied partition has been isolated in `archive/legacy-legal-engine/`.

---

## Architecture

```text
User Input
    ↓
Fact Extraction
    ↓
Case Classification
    ↓
Hypothesis Generation
    ↓
Decision Engine
    ↓
Execution Plan
    ↓
Audit Trail
```

## Decision Lifecycle

TraceLayer makes the decision lifecycle visible:

1. Briefing
2. Fact Extraction
3. Hypotheses
4. Criteria
5. Decision
6. Execution Plan
7. Audit Trail

---

## Repository Map

- `tracelayer-app/` - canonical TraceLayer application and dashboard
- `docs/` - positioning and narrative for the canonical app
- `examples/` - shared demo outputs for the canonical app
- `schemas/` - shared decision-output schemas for the canonical app
- `archive/legacy-legal-engine/` - older copied legal/process engine, separated so it can be reviewed and deleted later if no longer needed

## Shared Assets

See:

- [examples/decision-trace-demo.json](examples/decision-trace-demo.json)
- [schemas/decision-output.json](schemas/decision-output.json)

The dashboard in `tracelayer-app/` renders the seven core decision blocks directly.

---

## App Setup

```bash
cd tracelayer-app
npm install
npx prisma generate
npx prisma db push
npm run dev
```

Required environment variables:

```bash
DATABASE_URL="file:./dev.db"
SESSION_SECRET="replace-me"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="replace-me"
OPENAI_API_KEY="sk-..."
OPENAI_MODEL="gpt-5.4"
```

Use `tracelayer-app/.env.example` as the template and `tracelayer-app/.env.local` for real local secrets. The health endpoint `/api/openai/health` confirms whether the OpenAI provider is configured without making a model call or exposing the API key.

---

## Deployment

Plataformas suportadas:

- Railway
- Render
- Docker
- Azure Container Apps

Fluxo geral:

```bash
npm install
npm run build
npm start
```

---

## Product Direction

Priority 1: make the canonical app sell itself by showing the complete decision trace.

Priority 2: harden the app with shared schemas, validation, logs, tracing, and versioning.

Priority 3: remove or permanently archive anything that confuses the product identity.

---

## Business Positioning

TraceLayer is not another AI assistant.

It is a Decision Middleware Platform that sits between:

- AI Models
- Business Processes
- Governance Requirements
- Audit Requirements

The goal is not generating answers.

The goal is generating accountable decisions.
