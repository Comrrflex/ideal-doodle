# TraceLayer

Decision Trace Engine for Governance, Auditability, and Operational Memory.

Transforme decisões em ativos auditáveis.

TraceLayer converte contexto disperso em decisões estruturadas, revisáveis e reproduzíveis. Em vez de apenas gerar respostas, o sistema cria uma trilha completa de raciocínio e execução que pode ser auditada, validada e reutilizada.

---

## The Problem

A maioria das decisões empresariais acontece em:

- reuniões sem registro adequado;
- mensagens dispersas;
- documentos desconectados;
- critérios não documentados;
- execução sem rastreabilidade.

O resultado é perda de contexto, retrabalho, baixa governança e dificuldade para justificar decisões.

---

## The Solution

TraceLayer transforma informações não estruturadas em uma trilha de decisão organizada.

### Output gerado

✅ Confirmed Facts

✅ Information Gaps

✅ Hypotheses

✅ Decision Criteria

✅ Recommended Decision

✅ Execution Plan

✅ Auditable Trail

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

---

## Decision Lifecycle

O TraceLayer torna visível todo o ciclo de decisão:

1. Briefing
2. Fact Extraction
3. Hypotheses
4. Criteria
5. Decision
6. Execution Plan
7. Audit Trail

---

## Example

### Input

```text
Should we launch the MVP now or wait two more weeks?
```

### Output

```json
{
  "facts": [],
  "hypotheses": [],
  "criteria": [],
  "recommendation": {},
  "executionPlan": {},
  "auditTrail": {}
}
```

Exemplos completos:

- `examples/decision-trace-demo.json`
- `schemas/decision-output.json`

---

## Project Structure

```text
decision-engine.ts          rule-based decision flow
case-classifier.ts          case classification
event-extractor.ts          event extraction
legal-basis.ts              legal and normative inference
validation.ts               input/output validation

schemas/
examples/
docs/

marketing-saas-mvp/
```

---

## SaaS Dashboard

O dashboard demonstra visualmente os componentes principais da trilha de decisão.

Recursos atuais:

- Decision Trace Visualization
- Structured Outputs
- Governance Layer
- OpenAI Integration
- Audit-Oriented Workflow

---

## Local Development

### Requirements

- Node.js
- npm
- Prisma

### Installation

```bash
cd marketing-saas-mvp

npm install

npx prisma generate

npm run dev
```

---

## Environment Variables

```env
DATABASE_URL="file:./dev.db"

SESSION_SECRET="replace-me"

ADMIN_EMAIL="admin@example.com"

ADMIN_PASSWORD="replace-me"

OPENAI_API_KEY="sk-..."

OPENAI_MODEL="gpt-5.4"
```

Utilize:

```text
marketing-saas-mvp/.env.example
```

como modelo local.

---

## Health Check

Endpoint:

```text
/api/openai/health
```

Verifica se o provedor OpenAI está configurado corretamente sem realizar chamadas ao modelo.

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

## Product Roadmap

### Phase 1

- Decision Trace Engine
- Structured Outputs
- SaaS Dashboard MVP
- OpenAI Integration

### Phase 2

- Multi-Tenant SaaS
- Role-Based Access Control
- Versioned Audit Trails
- Persistent Decision History

### Phase 3

- Enterprise Connectors
- Compliance Packs
- Marketplace Integrations
- Decision Intelligence Analytics

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

---

## Vision

Organizations already have data.

Organizations already have AI.

What they lack is traceability.

TraceLayer creates the missing layer between reasoning and accountability.

---

## License

MIT
