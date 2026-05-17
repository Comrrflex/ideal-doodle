# TraceLayer Dashboard

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

Create `.env`:

```bash
DATABASE_URL="file:./dev.db"
OPENAI_API_KEY="sk-..."
OPENAI_MODEL="gpt-5.4-mini"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="replace-me"
SESSION_SECRET="replace-me"
```

Install and prepare:

```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
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
