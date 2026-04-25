/**
 * Regenerate `PERMISSIONS.X.validatedBy` arrays in src/index.ts by grepping
 * each pinned consumer's source for receiver patterns. Implements Doc A's
 * D-06 codegen spec.
 *
 * Pipeline:
 *   1. Read scripts/pinned-consumers.json. Skip any entry with tag: null —
 *      that consumer hasn't migrated to @rello-platform/permissions yet.
 *   2. For each pinned consumer: clone the repo at the pinned tag into a
 *      temp directory. (CI mode — local mode reads from a configured local
 *      checkout if available.)
 *   3. Grep the consumer's source for these receiver patterns and capture
 *      the PERMISSIONS.X key:
 *        - requireServiceBearer(req, { permission: PERMISSIONS.X.slug })
 *        - requireBearerOrSession(req, { permission: PERMISSIONS.X.slug })
 *        - validateEngineAuth(req, { ..., requiredPermission: PERMISSIONS.X.slug })
 *        - hasPermission(apiKey, PERMISSIONS.X.slug)
 *   4. Build a Map<PermissionKey, Set<PlatformSlug>>: each PERMISSIONS.X
 *      reference contributes the consumer's slug to its set.
 *   5. Sort + dedupe each set; write back into src/index.ts as
 *      `validatedBy: [...]`.
 *   6. Run `tsc --noEmit` to confirm the rewritten file is still
 *      type-correct.
 *
 * Safety:
 *   - Never edits the file outside the validatedBy arrays. Every other field
 *     (slug / label / description / grantedTo) is preserved verbatim.
 *   - `--dry-run` reports what would change without writing.
 *   - Empty result for a permission means NO consumer currently references
 *     it — the array becomes []. This is correct behavior; an entry with
 *     persistent empty validatedBy is a candidate for the orphan-prune
 *     phase of Doc A.
 *
 * Provenance:
 *   - Spec: PERMISSIONS-CANONICALIZATION.md (Doc A) — D-06 + Phase 1 §1.3
 *   - v0.1.0 bootstrap: pinned-consumers.json carries `tag: null` for every
 *     consumer because no consumer has yet migrated to @rello-platform/permissions.
 *     This script runs successfully against an empty pinned set (no work to do)
 *     and is exercised end-to-end starting in Doc A Phase 3.
 */

import { execFileSync } from "node:child_process";
import { mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

interface ConsumerEntry {
  slug: string;
  github: string;
  tag: string | null;
  localPath?: string;
  _note?: string;
}

interface PinnedConsumersConfig {
  comment_purpose?: string;
  comment_v0_1_0?: string;
  consumers: ConsumerEntry[];
}

const SCRIPT_DIR = resolve(fileURLToPath(import.meta.url), "..");
const REPO_ROOT = resolve(SCRIPT_DIR, "..");
const SRC_INDEX = join(REPO_ROOT, "src", "index.ts");
const CONFIG_PATH = join(SCRIPT_DIR, "pinned-consumers.json");

const RECEIVER_PATTERNS: readonly RegExp[] = [
  /requireServiceBearer\s*\([^)]*permission:\s*PERMISSIONS\.([A-Z][A-Z0-9_]*)\.slug/g,
  /requireBearerOrSession\s*\([^)]*permission:\s*PERMISSIONS\.([A-Z][A-Z0-9_]*)\.slug/g,
  /validateEngineAuth\s*\([^)]*requiredPermission:\s*PERMISSIONS\.([A-Z][A-Z0-9_]*)\.slug/g,
  /hasPermission\s*\([^)]*PERMISSIONS\.([A-Z][A-Z0-9_]*)\.slug/g,
];

const CODE_FILE_RE = /\.(ts|tsx|js|jsx|mjs|cjs)$/;

function listSourceFiles(rootDir: string): string[] {
  const out: string[] = [];
  const stack: string[] = [rootDir];
  while (stack.length > 0) {
    const dir = stack.pop()!;
    let entries: string[];
    try {
      entries = readdirSync(dir);
    } catch {
      continue;
    }
    for (const entry of entries) {
      if (
        entry === "node_modules" ||
        entry === "dist" ||
        entry === ".git" ||
        entry === ".next" ||
        entry === "build" ||
        entry === "coverage" ||
        entry.startsWith(".")
      ) {
        continue;
      }
      const full = join(dir, entry);
      let st;
      try {
        st = statSync(full);
      } catch {
        continue;
      }
      if (st.isDirectory()) {
        stack.push(full);
      } else if (st.isFile() && CODE_FILE_RE.test(entry)) {
        out.push(full);
      }
    }
  }
  return out;
}

function findReferencedKeys(consumerRoot: string): Set<string> {
  const found = new Set<string>();
  const files = listSourceFiles(consumerRoot);
  for (const file of files) {
    let text: string;
    try {
      text = readFileSync(file, "utf8");
    } catch {
      continue;
    }
    for (const pattern of RECEIVER_PATTERNS) {
      pattern.lastIndex = 0;
      let m: RegExpExecArray | null;
      while ((m = pattern.exec(text)) !== null) {
        found.add(m[1]);
      }
    }
  }
  return found;
}

function checkoutConsumer(entry: ConsumerEntry): string {
  if (entry.localPath) {
    const resolved = resolve(entry.localPath.replace(/^~/, process.env.HOME ?? "~"));
    if (!statSync(resolved).isDirectory()) {
      throw new Error(`Local path for ${entry.slug} is not a directory: ${resolved}`);
    }
    return resolved;
  }
  if (!entry.tag) {
    throw new Error(`Consumer ${entry.slug} has no tag pinned and no localPath`);
  }
  const tmpRoot = mkdtempSync(join(tmpdir(), `permissions-codegen-${entry.slug}-`));
  const cloneUrl = `https://github.com/${entry.github}.git`;
  execFileSync(
    "git",
    ["clone", "--depth=1", "--branch", entry.tag, cloneUrl, tmpRoot],
    { stdio: "inherit" },
  );
  return tmpRoot;
}

function rewriteValidatedBy(
  source: string,
  derived: Map<string, ReadonlyArray<string>>,
): { content: string; touchedKeys: number } {
  let touchedKeys = 0;
  const lines = source.split("\n");
  let currentKey: string | null = null;
  const keyHeader = /^\s{2}([A-Z][A-Z0-9_]*):\s*\{\s*$/;
  const validatedByLine = /^(\s+validatedBy:\s*)\[[^\]]*\]/;
  for (let i = 0; i < lines.length; i++) {
    const headerMatch = lines[i].match(keyHeader);
    if (headerMatch) {
      currentKey = headerMatch[1];
      continue;
    }
    if (currentKey === null) continue;
    const vbMatch = lines[i].match(validatedByLine);
    if (vbMatch) {
      const slugs = derived.get(currentKey) ?? [];
      const formatted =
        slugs.length === 0
          ? "[]"
          : `[${slugs.map((s) => `"${s}"`).join(", ")}]`;
      const next = `${vbMatch[1]}${formatted},`;
      if (lines[i].trim() !== next.trim()) {
        lines[i] = next;
        touchedKeys += 1;
      }
      currentKey = null;
    }
  }
  return { content: lines.join("\n"), touchedKeys };
}

function main(): void {
  const dryRun = process.argv.includes("--dry-run");

  const configRaw = readFileSync(CONFIG_PATH, "utf8");
  const config = JSON.parse(configRaw) as PinnedConsumersConfig;
  if (!Array.isArray(config.consumers)) {
    throw new Error(`Bad config shape at ${CONFIG_PATH}: missing consumers array`);
  }

  const pinned = config.consumers.filter((c) => c.tag !== null || c.localPath);
  if (pinned.length === 0) {
    console.log(
      "[regenerate-validatedby] No pinned consumers (every entry has tag: null and no localPath).\n" +
        "  v0.1.0 bootstrap state: this is expected. validatedBy values shipped in src/index.ts\n" +
        "  are inherited verbatim from @rello-platform/api-client@v1.10.1 and are correct\n" +
        "  semantic state for the bridge period. Codegen takes over starting in Doc A Phase 3\n" +
        "  when consumers re-target imports to @rello-platform/permissions.\n" +
        "[regenerate-validatedby] Exiting with no changes.",
    );
    return;
  }

  const derived = new Map<string, Set<string>>();
  for (const consumer of pinned) {
    let consumerRoot: string;
    let cleanup: (() => void) | null = null;
    try {
      consumerRoot = checkoutConsumer(consumer);
      if (!consumer.localPath) {
        cleanup = () => rmSync(consumerRoot, { recursive: true, force: true });
      }
      console.log(
        `[regenerate-validatedby] Scanning ${consumer.slug} at ${consumer.tag ?? consumer.localPath}`,
      );
      const keys = findReferencedKeys(consumerRoot);
      for (const key of keys) {
        if (!derived.has(key)) derived.set(key, new Set<string>());
        derived.get(key)!.add(consumer.slug);
      }
    } finally {
      cleanup?.();
    }
  }

  const sortedDerived = new Map<string, ReadonlyArray<string>>();
  for (const [key, slugs] of derived) {
    sortedDerived.set(key, [...slugs].sort());
  }

  const source = readFileSync(SRC_INDEX, "utf8");
  const { content, touchedKeys } = rewriteValidatedBy(source, sortedDerived);

  if (touchedKeys === 0) {
    console.log(
      "[regenerate-validatedby] No changes — every validatedBy array already matches grep results.",
    );
    return;
  }

  if (dryRun) {
    console.log(
      `[regenerate-validatedby] --dry-run: ${touchedKeys} validatedBy arrays would change.`,
    );
    return;
  }

  writeFileSync(SRC_INDEX, content, "utf8");
  console.log(
    `[regenerate-validatedby] Rewrote ${touchedKeys} validatedBy arrays in src/index.ts.`,
  );

  // Confirm the rewrite is type-valid.
  console.log("[regenerate-validatedby] Running tsc --noEmit ...");
  execFileSync("npx", ["tsc", "--noEmit"], { stdio: "inherit", cwd: REPO_ROOT });
  console.log("[regenerate-validatedby] tsc --noEmit clean.");
}

main();
