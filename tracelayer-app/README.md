# A Força Dashboard

This is the canonical application in this repository.

Prototype dashboard for structured decision traces.

It turns a raw briefing into:

- briefing;
- fact extraction;
- hypotheses;
- criteria;
- decision;
- execution plan;
- auditable trail.

## Stack

- Next.js App Router
- TypeScript
- Prisma
- SQLite
- OpenAI Responses API

## Setup

Create `.env.local` from the example file:

```bash
cp .env.example .env.local
```

Then fill in the server-side values:

```bash
DATABASE_URL="file:./dev.db"
OPENAI_API_KEY="sk-..."
OPENAI_MODEL="gpt-5.4"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="replace-me"
SESSION_SECRET="replace-me"
ADVISOR_API_TOKEN="replace-with-a-long-random-token"
```

Install and prepare:

```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
```

Check the OpenAI wiring without making a model call:

```bash
curl http://localhost:3000/api/openai/health
```

Open:

```bash
http://localhost:3000
```

## Use

1. Login with the configured admin.
2. Create a decision case.
3. Click **Gerar decisão**.
4. Review the trace in the dashboard.

## Advisor SDK MVP

The reusable SDK is in `lib/advisorSdk.ts` and is exposed as an authenticated HTTP API for repository-style reviews focused on logic and conformity issues. It uses the official OpenAI Node SDK and the Responses API with strict structured output.

Endpoint:

```text
POST /api/advisor/review
```

Example payload:

```json
{
  "targets": [
    "tracelayer-app/app/api",
    "tracelayer-app/lib/auth.ts"
  ],
  "focus": "Detectar lacunas de autenticação, riscos de governança e erros lógicos silenciosos.",
  "maxFiles": 6,
  "maxCharsPerFile": 8000
}
```

What it does:

- loads files from the repository/app workspace;
- applies a few static rules locally;
- sends the selected snippets to the OpenAI Responses API with structured output;
- returns findings with severity, category, evidence, lines, confidence, and recommendation.

The review engine can be reused by UI actions, background jobs, or deeper workflow orchestration.

Authenticate either with the dashboard session cookie or a server-side Bearer token. Set `ADVISOR_API_TOKEN` in `.env.local`, then call it from another system:

```bash
curl -X POST http://localhost:3000/api/advisor/review \
  -H "Authorization: Bearer $ADVISOR_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "targets": ["tracelayer-app/app/api", "tracelayer-app/lib/auth.ts"],
    "focus": "Revisar autenticação, governança e riscos lógicos.",
    "maxFiles": 6,
    "maxCharsPerFile": 8000
  }'
```

The API only accepts targets inside the application or repository roots, and it bounds the file count and content size sent to the model.

## Current Product Thesis

Do not sell "AI".

Sell:

- reduction of bad decisions;
- traceability;
- explicit criteria;
- consistent execution;
- operational memory;
- governance for review.

## Next Technical Hardening

- Shared schema module for app and engine;
- runtime validation before saving output;
- request/response tracing;
- decision version migrations;
- account-level logs;
- exportable audit reports.
