# TraceLayer

Decision infrastructure for teams that need traceability, governance, and consistent execution.

This repository is currently named `ideal-doodle`, but the product concept is stronger than the repo name. The product direction is **TraceLayer**: a structured decision engine that turns scattered context into a reviewable decision trace.

## What It Shows

TraceLayer makes the decision lifecycle visible:

```text
briefing
fact extraction
hypotheses
criteria
decision
plan
auditable trail
```

That is the product.

It does not sell "AI". It sells fewer bad decisions, clearer accountability, operational memory, and governance that survives review.

## Why It Matters

Most teams decide from:

- scattered context;
- undocumented assumptions;
- weak criteria;
- improvised execution;
- no audit trail.

TraceLayer creates a structured output that separates:

- confirmed facts;
- gaps;
- hypotheses;
- criteria;
- recommended decision;
- execution steps;
- rules, risks, and versioning.

## Demo Output

See:

- [examples/decision-trace-demo.json](examples/decision-trace-demo.json)
- [schemas/decision-output.json](schemas/decision-output.json)

The dashboard in `marketing-saas-mvp/` now renders the seven core blocks directly.

## App

```bash
cd marketing-saas-mvp
npm install
npx prisma generate
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

Use `marketing-saas-mvp/.env.example` as the local template. The health endpoint
`/api/openai/health` confirms whether the OpenAI provider is configured without
making a model call or exposing the API key.

## Structure

```text
decision-engine.ts          rule-based decision flow
case-classifier.ts          case classification
event-extractor.ts          event extraction
legal-basis.ts              legal/normative basis inference
validation.ts               output and input checks
schemas/decision-output.json
examples/decision-trace-demo.json
marketing-saas-mvp/         dashboard prototype
docs/positioning.md
```

## Product Direction

Priority 1: make the demo sell itself by showing the complete decision trace.

Priority 2: harden the engine with schemas, validation, logs, tracing, and versioning.

Priority 3: align identity with the enterprise value of the concept.

TraceLayer sits between AI tooling, operating systems, governance, and reasoning infrastructure. The opportunity is not another GPT wrapper; it is a decision middleware layer for B2B teams.
