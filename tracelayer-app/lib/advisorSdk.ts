import { promises as fs } from "fs";
import path from "path";
import { z } from "zod";
import { DEFAULT_MODEL, getOpenAIClient } from "@/lib/openai";

const allowedExtensions = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".json",
  ".md",
  ".prisma",
  ".yml",
  ".yaml",
  ".tf",
  ".tfvars"
]);

const severitySchema = z.enum(["low", "medium", "high", "critical"]);
const categorySchema = z.enum([
  "logic",
  "conformity",
  "security",
  "architecture",
  "maintainability"
]);
const confidenceSchema = z.enum(["low", "medium", "high"]);

const lineReferenceSchema = z.object({
  start: z.number().int().min(1),
  end: z.number().int().min(1)
});

const findingSchema = z.object({
  title: z.string().min(1),
  severity: severitySchema,
  category: categorySchema,
  file_path: z.string().min(1),
  lines: lineReferenceSchema,
  evidence: z.string().min(1),
  why_it_matters: z.string().min(1),
  recommendation: z.string().min(1),
  confidence: confidenceSchema,
  source: z.enum(["llm", "static_rule"])
});

export const advisorReviewSchema = z.object({
  repo_label: z.string().min(1),
  focus: z.string().min(1),
  overview: z.string().min(1),
  findings: z.array(findingSchema),
  next_actions: z.array(z.string().min(1)).max(8)
});

export type AdvisorFinding = z.infer<typeof findingSchema>;
export type AdvisorReviewResult = z.infer<typeof advisorReviewSchema>;

export type AdvisorReviewInput = {
  targets: string[];
  focus?: string;
  maxFiles?: number;
  maxCharsPerFile?: number;
  repoLabel?: string;
};

type LoadedFile = {
  absolutePath: string;
  displayPath: string;
  content: string;
  lineCount: number;
  truncated: boolean;
};

type StaticRuleFinding = Omit<AdvisorFinding, "source">;

const responseFormatSchema = {
  type: "object",
  properties: {
    repo_label: { type: "string" },
    focus: { type: "string" },
    overview: { type: "string" },
    findings: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          severity: {
            type: "string",
            enum: ["low", "medium", "high", "critical"]
          },
          category: {
            type: "string",
            enum: ["logic", "conformity", "security", "architecture", "maintainability"]
          },
          file_path: { type: "string" },
          lines: {
            type: "object",
            properties: {
              start: { type: "integer" },
              end: { type: "integer" }
            },
            required: ["start", "end"],
            additionalProperties: false
          },
          evidence: { type: "string" },
          why_it_matters: { type: "string" },
          recommendation: { type: "string" },
          confidence: { type: "string", enum: ["low", "medium", "high"] },
          source: { type: "string", enum: ["llm"] }
        },
        required: [
          "title",
          "severity",
          "category",
          "file_path",
          "lines",
          "evidence",
          "why_it_matters",
          "recommendation",
          "confidence",
          "source"
        ],
        additionalProperties: false
      }
    },
    next_actions: {
      type: "array",
      items: { type: "string" }
    }
  },
  required: ["repo_label", "focus", "overview", "findings", "next_actions"],
  additionalProperties: false
};

function normalizeLineReference(start: number, end: number) {
  return {
    start: Math.max(1, start),
    end: Math.max(Math.max(1, start), end)
  };
}

function indexToLine(content: string, index: number) {
  return content.slice(0, index).split("\n").length;
}

function buildRootCandidates() {
  const appRoot = path.resolve(process.cwd());
  const repoRoot = path.resolve(appRoot, "..");
  return Array.from(new Set([appRoot, repoRoot]));
}

function isWithinRoot(absolutePath: string, root: string) {
  const relative = path.relative(root, absolutePath);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

async function pathExists(targetPath: string) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function resolveTargetPath(rawTarget: string, roots: string[]) {
  const normalizedTarget = rawTarget.trim();

  if (!normalizedTarget) {
    throw new Error("Target vazio não é permitido.");
  }

  if (path.isAbsolute(normalizedTarget)) {
    const absoluteTarget = path.resolve(normalizedTarget);

    if (!roots.some((root) => isWithinRoot(absoluteTarget, root))) {
      throw new Error(`Target fora das raízes permitidas: ${rawTarget}`);
    }

    if (!(await pathExists(absoluteTarget))) {
      throw new Error(`Target não encontrado: ${rawTarget}`);
    }

    return absoluteTarget;
  }

  for (const root of roots) {
    const candidate = path.resolve(root, normalizedTarget);
    if (isWithinRoot(candidate, root) && (await pathExists(candidate))) {
      return candidate;
    }
  }

  throw new Error(`Target não encontrado: ${rawTarget}`);
}

async function collectDirectoryFiles(
  absoluteDirectory: string,
  roots: string[],
  maxFiles: number
) {
  const collected: string[] = [];
  const queue = [absoluteDirectory];

  while (queue.length > 0 && collected.length < maxFiles) {
    const current = queue.shift();
    if (!current) continue;

    const entries = await fs.readdir(current, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.name.startsWith(".")) continue;

      const absoluteEntry = path.join(current, entry.name);
      if (!roots.some((root) => isWithinRoot(absoluteEntry, root))) continue;

      if (entry.isDirectory()) {
        queue.push(absoluteEntry);
        continue;
      }

      if (!entry.isFile()) continue;

      const extension = path.extname(entry.name).toLowerCase();
      if (!allowedExtensions.has(extension)) continue;

      collected.push(absoluteEntry);

      if (collected.length >= maxFiles) {
        break;
      }
    }
  }

  return collected;
}

function truncateContentByLines(content: string, maxCharsPerFile: number) {
  if (content.length <= maxCharsPerFile) {
    return { content, truncated: false, lineCount: content.split("\n").length };
  }

  const lines = content.split("\n");
  const collected: string[] = [];
  let used = 0;

  for (const line of lines) {
    const next = collected.length === 0 ? line.length : line.length + 1;
    if (used + next > maxCharsPerFile) {
      break;
    }
    collected.push(line);
    used += next;
  }

  return {
    content: collected.join("\n"),
    truncated: true,
    lineCount: collected.length
  };
}

function addLineNumbers(content: string) {
  return content
    .split("\n")
    .map((line, index) => `${String(index + 1).padStart(4, " ")} | ${line}`)
    .join("\n");
}

function buildStaticFindings(file: LoadedFile): StaticRuleFinding[] {
  const findings: StaticRuleFinding[] = [];

  const addFinding = (finding: StaticRuleFinding) => {
    findings.push({
      ...finding,
      lines: normalizeLineReference(finding.lines.start, finding.lines.end)
    });
  };

  const evalIndex = file.content.search(/\beval\s*\(|\bnew Function\s*\(/);
  if (evalIndex >= 0) {
    const line = indexToLine(file.content, evalIndex);
    addFinding({
      title: "Execução dinâmica de código",
      severity: "critical",
      category: "security",
      file_path: file.displayPath,
      lines: { start: line, end: line },
      evidence: "O arquivo usa eval/new Function, padrão que amplia risco de execução arbitrária.",
      why_it_matters: "Isso cria uma superfície séria para injeção e comportamento imprevisível.",
      recommendation: "Remova a execução dinâmica e substitua por mapeamento explícito ou parser seguro.",
      confidence: "high"
    });
  }

  const todoIndex = file.content.search(/\b(TODO|FIXME)\b/);
  if (todoIndex >= 0) {
    const line = indexToLine(file.content, todoIndex);
    addFinding({
      title: "Ponto pendente marcado no código",
      severity: "low",
      category: "maintainability",
      file_path: file.displayPath,
      lines: { start: line, end: line },
      evidence: "O arquivo contém TODO/FIXME em uma área que pode ocultar dívida técnica ou decisão em aberto.",
      why_it_matters: "Pendências em áreas críticas podem virar falhas silenciosas ou comportamento inconsistente.",
      recommendation: "Transforme o comentário em issue rastreável ou resolva antes de ampliar o uso da rotina.",
      confidence: "medium"
    });
  }

  const routeLooksProtected =
    /(^|\/)app\/api\//.test(file.displayPath) &&
    file.displayPath.endsWith("/route.ts") &&
    !/\/api\/(login|logout|openai\/health)\//.test(file.displayPath);

  const dbIndex = file.content.indexOf("db.");
  if (routeLooksProtected && dbIndex >= 0 && !file.content.includes("requireSession(")) {
    const line = indexToLine(file.content, dbIndex);
    addFinding({
      title: "Rota de API toca banco sem guarda explícita de sessão",
      severity: "high",
      category: "conformity",
      file_path: file.displayPath,
      lines: { start: line, end: line },
      evidence: "A rota usa db.* mas não mostra requireSession() antes da operação.",
      why_it_matters: "Isso pode expor leitura ou escrita sem autenticação e comprometer governança do produto.",
      recommendation: "Exija autenticação/autorização explícita ou documente por que a rota deve ser pública.",
      confidence: "medium"
    });
  }

  const envCompareIndex = file.content.search(
    /ADMIN_PASSWORD|ADMIN_EMAIL|===\s*process\.env\.[A-Z0-9_]+/
  );
  if (envCompareIndex >= 0 && file.displayPath.endsWith("auth.ts")) {
    const line = indexToLine(file.content, envCompareIndex);
    addFinding({
      title: "Autenticação simples baseada em comparação direta",
      severity: "medium",
      category: "security",
      file_path: file.displayPath,
      lines: { start: line, end: line },
      evidence: "A autenticação compara credenciais diretas de ambiente sem camada de identidade ou rotação.",
      why_it_matters: "Isso é aceitável em MVPs, mas é frágil para auditoria, revogação e rastreabilidade por usuário.",
      recommendation: "Evolua para identidade por usuário, hashing de senha e trilha de acesso por conta.",
      confidence: "high"
    });
  }

  return findings;
}

async function loadFiles(input: AdvisorReviewInput) {
  const roots = buildRootCandidates();
  const maxFiles = input.maxFiles ?? 8;
  const maxCharsPerFile = input.maxCharsPerFile ?? 10000;
  const absoluteFiles = new Set<string>();

  for (const target of input.targets) {
    const absoluteTarget = await resolveTargetPath(target, roots);
    const stat = await fs.stat(absoluteTarget);

    if (stat.isDirectory()) {
      const files = await collectDirectoryFiles(absoluteTarget, roots, maxFiles - absoluteFiles.size);
      for (const file of files) {
        absoluteFiles.add(file);
      }
      continue;
    }

    absoluteFiles.add(absoluteTarget);

    if (absoluteFiles.size >= maxFiles) {
      break;
    }
  }

  const loadedFiles: LoadedFile[] = [];

  for (const absolutePath of Array.from(absoluteFiles).slice(0, maxFiles)) {
    const rawContent = await fs.readFile(absolutePath, "utf8");
    const root = roots.find((candidateRoot) => isWithinRoot(absolutePath, candidateRoot)) ?? process.cwd();
    const truncated = truncateContentByLines(rawContent, maxCharsPerFile);

    loadedFiles.push({
      absolutePath,
      displayPath: path.relative(root, absolutePath).split(path.sep).join("/"),
      content: truncated.content,
      lineCount: truncated.lineCount,
      truncated: truncated.truncated
    });
  }

  if (loadedFiles.length === 0) {
    throw new Error("Nenhum arquivo compatível foi encontrado nos targets informados.");
  }

  return loadedFiles;
}

function deduplicateFindings(findings: AdvisorFinding[]) {
  const registry = new Map<string, AdvisorFinding>();

  for (const finding of findings) {
    const key = [
      finding.file_path,
      finding.title.trim().toLowerCase(),
      finding.lines.start,
      finding.lines.end
    ].join("::");

    const existing = registry.get(key);
    if (!existing) {
      registry.set(key, finding);
      continue;
    }

    const severityOrder = {
      low: 1,
      medium: 2,
      high: 3,
      critical: 4
    };

    if (severityOrder[finding.severity] > severityOrder[existing.severity]) {
      registry.set(key, finding);
    }
  }

  return Array.from(registry.values());
}

export class AdvisorSDK {
  constructor(
    private readonly config: {
      model?: string;
      repoLabel?: string;
    } = {}
  ) {}

  async reviewFiles(input: AdvisorReviewInput): Promise<AdvisorReviewResult> {
    const loadedFiles = await loadFiles(input);
    const staticFindings = loadedFiles.flatMap((file) =>
      buildStaticFindings(file).map((finding) => ({
        ...finding,
        source: "static_rule" as const
      }))
    );

    const repoLabel = input.repoLabel ?? this.config.repoLabel ?? path.basename(path.resolve(process.cwd(), ".."));
    const focus =
      input.focus?.trim() ||
      "Detectar erros de lógica, lacunas de conformidade, autorização frágil, riscos de auditabilidade e conselhos de correção.";

    const filePayload = loadedFiles
      .map((file) => {
        const truncationNote = file.truncated
          ? `\n[trecho truncado após ${file.lineCount} linhas para caber no orçamento de contexto]`
          : "";

        return [
          `FILE: ${file.displayPath}`,
          "```",
          addLineNumbers(file.content),
          "```",
          truncationNote
        ]
          .filter(Boolean)
          .join("\n");
      })
      .join("\n\n");

    const staticSummary =
      staticFindings.length > 0
        ? JSON.stringify(staticFindings, null, 2)
        : "[]";

    const openai = getOpenAIClient();
    const response = await openai.responses.create({
      model: this.config.model ?? DEFAULT_MODEL,
      store: false,
      input: [
        {
          role: "system",
          content: `
Você é o TraceLayer Advisor SDK.

Sua função é revisar arquivos de código e configuração procurando:
- erros de lógica silenciosos;
- lacunas de conformidade e governança;
- autorização/autenticação ausente ou frágil;
- riscos de segurança;
- inconsistências de validação;
- riscos de auditabilidade e manutenção.

Regras obrigatórias:
- Use apenas evidências presentes nos arquivos fornecidos.
- Não invente comportamento não visível.
- Se a evidência for fraca, reduza a confiança ou omita o finding.
- Prefira poucos achados de alto valor a uma lista genérica.
- Cada finding precisa citar arquivo, linhas e evidência concreta.
- O campo source deve ser sempre "llm" para findings gerados por você.
- Considere os sinais estáticos como pistas, não como verdade absoluta.
          `.trim()
        },
        {
          role: "user",
          content: `
Repositório: ${repoLabel}
Foco da revisão: ${focus}

Sinais estáticos já detectados:
${staticSummary}

Arquivos para revisão:
${filePayload}
          `.trim()
        }
      ],
      text: {
        format: {
          type: "json_schema",
          name: "advisor_review_output",
          strict: true,
          schema: responseFormatSchema
        }
      }
    });

    const parsed = advisorReviewSchema.parse(
      JSON.parse(response.output_text) as AdvisorReviewResult
    );

    const findings = deduplicateFindings([
      ...staticFindings,
      ...parsed.findings
    ]);

    return advisorReviewSchema.parse({
      ...parsed,
      repo_label: repoLabel,
      focus,
      findings
    });
  }
}
