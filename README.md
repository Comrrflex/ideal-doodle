# TraceLayer

TraceLayer e um app para transformar briefing solto em decisao estruturada, justificavel e auditavel.

Em vez de responder como um chat generico, ele organiza:

- fatos confirmados;
- lacunas de informacao;
- hipoteses;
- criterios de decisao;
- recomendacao;
- plano de execucao;
- trilha auditavel.

O produto nao vende "IA". Ele vende menos decisao improvisada, mais clareza, mais memoria operacional e mais governanca.

## Onde esta o app

App canonico deste repositorio:

- `tracelayer-app/`

Copia antiga mantida separada apenas para revisao ou remocao futura:

- `archive/legacy-legal-engine/`

Se voce quer rodar o produto, entre em `tracelayer-app/`.

## Quick Start

```bash
cd tracelayer-app
cp .env.example .env.local
npm install
npx prisma generate
npx prisma db push
npm run dev
```

Abra:

```text
http://localhost:3000
```

## Variaveis de ambiente

Template local:

```text
tracelayer-app/.env.example
```

Valores esperados:

```env
DATABASE_URL="file:./dev.db"
OPENAI_API_KEY="sk-..."
OPENAI_MODEL="gpt-5.4"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="replace-me"
SESSION_SECRET="replace-with-a-long-random-secret"
```

## Como usar

1. Entre com o admin configurado no `.env.local`.
2. Crie um projeto no dashboard.
3. Preencha o briefing do caso.
4. Clique em `Gerar decisao`.
5. Revise a trilha no projeto.

Health check da configuracao OpenAI:

```bash
curl http://localhost:3000/api/openai/health
```

## O que o app entrega

Hoje o app canonico ja cobre o fluxo principal:

- login local;
- criacao de projetos;
- persistencia com Prisma + SQLite;
- geracao estruturada com OpenAI Responses API;
- visualizacao de trilha decisoria no dashboard;
- historico de execucoes por projeto.

## Estrutura do repositorio

- `tracelayer-app/` - app Next.js principal
- `docs/` - posicionamento e narrativa do produto
- `examples/` - exemplos de saida
- `schemas/` - schemas compartilhados de decisao
- `archive/legacy-legal-engine/` - bloco legado arquivado

## Stack

- Next.js App Router
- TypeScript
- Prisma
- SQLite
- OpenAI Responses API

## Tese do produto

TraceLayer existe para tratar decisao como ativo operacional.

Isso significa:

- separar fato de inferencia;
- explicitar o que falta;
- justificar recomendacoes;
- registrar trilha para revisao;
- reduzir perda de contexto entre pessoas e etapas.

## Proximos passos naturais

- exportacao de relatorio;
- versionamento de decisoes;
- logs e tracing mais fortes;
- camadas de governanca por conta ou workspace;
- conectores e memoria institucional.
