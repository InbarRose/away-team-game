#!/usr/bin/env node
/**
 * AWAY TEAM — Markdown & Rules Text Semantic Normalizer
 * -----------------------------------------------------
 * Normalizes currency, reward, tracker, focus, and slot notation across all 208
 * Markdown files under /game/ so that quantities and semantic badges stay unified
 * (e.g., `[+1 CR]`, `[2 EF]`, `[-1 PIP]`, `[3 LOY]`, `[+3 VP]`, `[+1 DOOM]`, `[Combat]`)
 * without broken nested backticks (`**+1 `[CR]`**`) or split number/unit formatting.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const GAME_DIR = path.join(ROOT_DIR, 'game');

function walkMdFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...walkMdFiles(full));
    else if (entry.isFile() && entry.name.endsWith('.md')) results.push(full);
  }
  return results.sort();
}

/**
 * Normalizes prose and rules text segments (both inside YAML string values and Markdown body).
 */
export function normalizeSemanticProse(input) {
  let s = input;

  // 1. Unwrap backticks that wrap a bracketed semantic token: `[Combat]` -> [Combat], `3 [CR]` -> 3 [CR]
  s = s.replace(
    /`([+-]?\d+(?:–\d+|\+)?\s*)?\[(Combat|Infiltrate|Intel|Operations|Negotiate|Survival|CR|EF|PIP|LOY|DOOM|MOM|VP|Head|Body|Legs|Pack|Hand L|Hand R|Hand|Consumable|Complex|Continuous Drop|No HQ|Facility|Urban|Covert|Space|Planet)\]`/g,
    (_, numPrefix, tok) => (numPrefix ? `${numPrefix}[${tok}]` : `[${tok}]`)
  );

  // 2. Fix nested bold+backtick patterns like **+3 `[VP]`** or **-1 `[CR]` discount**
  s = s.replace(
    /\*\*([^*`]*?)`\[([A-Za-z ]+)\]`([^*`]*?)\*\*/g,
    '**$1[$2]$3**'
  );

  // 3. Merge "[number] Credit(s) [CR]" or "[number] [CR]" -> "[number CR]"
  // Handle ranges or signed numbers like +1, -2, 2–3, 10+
  s = s.replace(
    /(?<![A-Za-z0-9_])([+-]?\d+(?:[–-]\d+|\+)?)\s+(?:additional\s+|bonus\s+|extra\s+)?(?:Credits?\s+)?\[CR\]/gi,
    '[$1 CR]'
  );
  s = s.replace(
    /(?<![A-Za-z0-9_])([+-]?\d+(?:[–-]\d+|\+)?)\s+Credits?(?!\s*\[CR\])\b/gi,
    '[$1 CR]'
  );
  s = s.replace(/\bCredits?\s+\[CR\]/g, '[CR]');

  // 4. Merge "[number] Effort [EF]" or "[number] [EF]" -> "[number EF]"
  s = s.replace(
    /(?<![A-Za-z0-9_])([+-]?\d+(?:[–-]\d+|\+)?)\s+(?:additional\s+|bonus\s+|extra\s+)?(?:Effort\s+)?\[EF\]/gi,
    '[$1 EF]'
  );
  s = s.replace(
    /(?<![A-Za-z0-9_])([+-]?\d+(?:[–-]\d+|\+)?)\s+Effort(?!\s*\[EF\])\b/gi,
    '[$1 EF]'
  );
  s = s.replace(/\bEffort\s+\[EF\]/g, '[EF]');

  // 5. Merge "[number] Political Influence (Power/Points) [PIP]" or "[number] [PIP]" -> "[number PIP]"
  s = s.replace(
    /(?<![A-Za-z0-9_])([+-]?\d+(?:[–-]\d+|\+)?)\s+(?:additional\s+|bonus\s+|extra\s+)?(?:Political Influence(?:\s+Power|\s+Points?)?\s+|PIP\s+)?\[PIP\]/gi,
    '[$1 PIP]'
  );
  s = s.replace(/\bPolitical Influence(?:\s+Power|\s+Points?)?\s+\[PIP\]/g, '[PIP]');

  // 6. Merge "[number] Loyalty (Points) [LOY]" or "[number] [LOY]" or "(1 LOY)" -> "[number LOY]"
  s = s.replace(
    /(?<![A-Za-z0-9_])([+-]?\d+(?:[–-]\d+|\+)?)\s+(?:additional\s+|bonus\s+|extra\s+)?(?:Loyalty(?:\s+Points?)?\s+)?\[LOY\]/gi,
    '[$1 LOY]'
  );
  s = s.replace(
    /\((\d+\+?)\s+LOY\)/g,
    '([$1 LOY])'
  );
  s = s.replace(
    /(?<![A-Za-z0-9_\[])([+-]?\d+\+?)\s+LOY\b(?!\])/g,
    '[$1 LOY]'
  );
  s = s.replace(/\bLoyalty(?:\s+Points?)?\s+\[LOY\]/g, '[LOY]');

  // 7. Merge "[number] Victory Points [VP]" or "[number] VPs" or "[number] [VP]" -> "[number VP]"
  s = s.replace(
    /(?<![A-Za-z0-9_])([+-]?\d+(?:[–-]\d+|\+)?)\s+(?:additional\s+|bonus\s+|extra\s+)?(?:Victory Points?\s+|VPs?\s+)?\[VP\]/gi,
    '[$1 VP]'
  );
  s = s.replace(
    /(?<![A-Za-z0-9_\[])([+-]?\d+)\s+(?:bonus\s+|extra\s+)?VPs?\b(?!\])/g,
    '[$1 VP]'
  );
  s = s.replace(/\bVictory Points?\s+\[VP\]/g, '[VP]');

  // 8. Merge "[number] Doom [DOOM]" or "[number] [DOOM]" -> "[number DOOM]"
  s = s.replace(
    /(?<![A-Za-z0-9_])([+-]?\d+(?:[–-]\d+|\+)?)\s+(?:additional\s+|extra\s+)?(?:Doom\s+)?\[DOOM\]/gi,
    '[$1 DOOM]'
  );
  s = s.replace(/\bDoom\s+\[DOOM\]/g, '[DOOM]');

  // 9. Merge "[number] Momentum [MOM]" or "[number] [MOM]" -> "[number MOM]"
  s = s.replace(
    /(?<![A-Za-z0-9_])([+-]?\d+(?:[–-]\d+|\+)?)\s+(?:additional\s+|bonus\s+|extra\s+)?(?:Momentum\s+)?\[MOM\]/gi,
    '[$1 MOM]'
  );
  s = s.replace(/\bOperational Momentum\s+\(\[MOM\]\)/g, 'Operational Momentum ([MOM])');

  // 10. Clean up any accidental double brackets like [[1 CR]] -> [1 CR]
  s = s.replace(/\[\[([^\]]+)\]\]/g, '[$1]');

  return s;
}

function processMarkdownFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const normalized = raw.replace(/\r\n/g, '\n');

  if (!normalized.startsWith('---\n')) {
    const updated = normalizeSemanticProse(normalized);
    if (updated !== normalized) {
      fs.writeFileSync(filePath, updated, 'utf8');
      return true;
    }
    return false;
  }

  const endMarker = normalized.indexOf('\n---\n', 4);
  if (endMarker === -1) return false;

  const frontmatter = normalized.slice(4, endMarker);
  const body = normalized.slice(endMarker + 5);

  // Only normalize descriptive prose fields in YAML frontmatter (rules_text, effect, trigger, summary, etc.)
  const updatedFrontmatter = frontmatter
    .split('\n')
    .map((line) => {
      if (
        /^\s*(rules_text|effect|trigger|summary|owner_benefit|shared_benefit|hazard_text|combat|intel_ops|other|condition|description|passive_effect|active_effect):/.test(
          line
        )
      ) {
        return normalizeSemanticProse(line);
      }
      return line;
    })
    .join('\n');

  const updatedBody = normalizeSemanticProse(body);
  const finalContent = `---\n${updatedFrontmatter}\n---\n${updatedBody}`;

  if (finalContent !== normalized) {
    fs.writeFileSync(filePath, finalContent, 'utf8');
    return true;
  }
  return false;
}

function main() {
  const files = walkMdFiles(GAME_DIR);
  let modifiedCount = 0;
  for (const f of files) {
    if (processMarkdownFile(f)) {
      modifiedCount++;
    }
  }
  console.log(`Normalized semantic notation in ${modifiedCount} / ${files.length} Markdown files.`);
}

main();
