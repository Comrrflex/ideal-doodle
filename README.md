# TraceLayer

TraceLayer transforma um briefing, problema ou contexto incompleto em uma **decisão recomendada, justificável e auditável**.

Em vez de responder como um chat genérico, o sistema organiza:

- fatos confirmados;
- lacunas de informação;
- hipóteses;
- critérios de decisão;
- alternativas consideradas;
- riscos e impactos;
- recomendação principal;
- plano de execução;
- trilha auditável.

O produto não vende apenas "IA". Ele entrega **menos decisão improvisada, mais clareza, memória operacional e governança**.

## O que o cliente vê

O cliente apresenta um problema real, por exemplo:

> Devemos lançar agora, adiar o lançamento ou reduzir o escopo do MVP?

O TraceLayer analisa o briefing e apresenta uma saída estruturada como esta:

### Decisão recomendada

**Lançar um piloto controlado com escopo reduzido antes do lançamento completo.**

### Por que esta é a melhor opção agora

- a proposta de valor já pode ser testada;
- ainda existem lacunas sobre retenção e custo operacional;
- um lançamento completo aumentaria o risco financeiro;
- um piloto produz evidência real sem comprometer toda a operação.

### O que precisa acontecer em seguida

1. definir o grupo inicial de clientes;
2. limitar o piloto a uma funcionalidade principal;
3. estabelecer métricas de sucesso;
4. revisar os resultados antes de ampliar o lançamento.

### Nível de confiança e limites

O sistema também informa quais dados sustentam a recomendação, quais pontos continuam incertos e quais condições poderiam mudar a decisão.

A recomendação é um **instrumento de apoio à decisão**. A aprovação final continua sob responsabilidade das pessoas e organizações competentes.

[Veja um exemplo completo de decisão para cliente](examples/client-decision-example.md).

## Como funciona

1. O cliente descreve o problema, objetivo e contexto.
2. O TraceLayer separa fatos, hipóteses e lacunas.
3. O sistema define os critérios relevantes para a decisão.
4. As alternativas são comparadas com riscos, impactos e evidências.
5. O cliente recebe uma recomendação principal e um plano de execução.
6. Toda a lógica fica registrada para revisão posterior.

## Casos de uso

TraceLayer pode apoiar decisões como:

- lançar, adiar ou reduzir o escopo de um produto;
- aprovar ou revisar uma proposta;
- escolher entre fornecedores ou parceiros;
- priorizar projetos e investimentos;
- decidir se um processo está pronto para avançar;
- registrar a justificativa de uma decisão de gestão.

## Piloto para futuros clientes

Um piloto começa com uma decisão delimitada e relevante para a organização.

O cliente fornece:

- pergunta de decisão;
- contexto e objetivo;
- fatos conhecidos;
- restrições;
- alternativas já consideradas;
- documentos ou referências relevantes, quando aplicável.

O TraceLayer entrega:

- resumo executivo;
- decisão recomendada;
- justificativa;
- alternativas comparadas;
- riscos e incertezas;
- informações que ainda precisam ser confirmadas;
- plano de ação;
- trilha de raciocínio auditável.

[Consulte o formato proposto para um piloto](docs/client-pilot.md).

## Onde está o app

App canônico deste repositório:

- `tracelayer-app/`

Cópia antiga mantida separada apenas para revisão ou remoção futura:

- `archive/legacy-legal-engine/`

Para executar o produto, entre em `tracelayer-app/`.

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

## Variáveis de ambiente

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
4. Clique em `Gerar decisão`.
5. Revise a recomendação e a trilha no projeto.

Health check da configuração OpenAI:

```bash
curl http://localhost:3000/api/openai/health
```

## O que o app entrega hoje

O app canônico já cobre o fluxo principal:

- login local;
- criação de projetos;
- persistência com Prisma + SQLite;
- geração estruturada com OpenAI Responses API;
- visualização da trilha decisória no dashboard;
- histórico de execuções por projeto.

## Estrutura do repositório

- `tracelayer-app/` — app Next.js principal
- `docs/` — posicionamento, produto e piloto
- `examples/` — exemplos de saída
- `schemas/` — schemas compartilhados de decisão
- `archive/legacy-legal-engine/` — bloco legado arquivado

## Stack

- Next.js App Router
- TypeScript
- Prisma
- SQLite
- OpenAI Responses API

## Tese do produto

TraceLayer existe para tratar decisão como ativo operacional.

Isso significa:

- separar fato de inferência;
- explicitar o que falta;
- justificar recomendações;
- registrar a trilha para revisão;
- reduzir a perda de contexto entre pessoas e etapas.

## Limites

TraceLayer não substitui aprovação executiva, parecer jurídico, avaliação regulatória ou responsabilidade profissional. Ele estrutura o problema, apresenta uma recomendação fundamentada e torna visíveis os riscos, pressupostos e limites usados na análise.

## Próximos passos naturais

- exportação de relatório;
- versionamento de decisões;
- logs e tracing mais fortes;
- governança por conta ou workspace;
- conectores e memória institucional;
- interface de solicitação de piloto.