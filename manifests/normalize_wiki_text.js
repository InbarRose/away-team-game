#!/usr/bin/env node
/**
 * AWAY TEAM — Markdown & Rules Text Semantic Normalizer
 * -----------------------------------------------------
 * Normalizes currency, reward, tracker, focus, and slot notation across all 208
 * Markdown files under /game/ so that quantities and semantic badges stay unified
 * (e.g., `[+1 CR]`, `[2 EF]`, `[-1 PIP]`, `[3 LOY]`, `[+3 VP]`, `[+1 FAIL]`, `[Combat]`)
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
 * Normalizes prose and rules text segments (strictly on the current line; never cross newlines).
 */
export function normalizeSemanticProse(input) {
  let s = input;

  // 1. Unwrap backticks that wrap a bracketed semantic token: `[Combat]` -> [Combat], `3 [CR]` -> 3 [CR]
  s = s.replace(
    /`([+-]?\d+(?:–\d+|\+)?\s*)?\[(Combat|Infiltrate|Intel|Operations|Negotiate|Survival|CR|EF|PIP|LOY|FAIL|FAILURE|DOOM|MOM|VP|Head|Body|Legs|Pack|Hand L|Hand R|Hand|Consumable|Complex|Continuous Drop|No HQ|Facility|Urban|Covert|Space|Planet)\]`/g,
    (_, numPrefix, tok) => (numPrefix ? `${numPrefix}[${tok}]` : `[${tok}]`)
  );

  // 2. Fix nested bold+backtick patterns like **+3 `[VP]`** or **-1 `[CR]` discount**
  s = s.replace(
    /\*\*([^*`]*?)`\[([A-Za-z ]+)\]`([^*`]*?)\*\*/g,
    '**$1[$2]$3**'
  );

  // 3. Merge "[number] Credit(s) [CR]" or "[number] [CR]" -> "[number CR]"
  s = s.replace(
    /(?<![A-Za-z0-9_])([+-]?\d+(?:[–-]\d+|\+)?)[^\S\r\n]+(?:additional[^\S\r\n]+|bonus[^\S\r\n]+|extra[^\S\r\n]+)?(?:Credits?[^\S\r\n]+)?\[CR\]/gi,
    '[$1 CR]'
  );
  s = s.replace(
    /(?<![A-Za-z0-9_])([+-]?\d+(?:[–-]\d+|\+)?)[^\S\r\n]+Credits?(?![^\S\r\n]*:)(?![^\S\r\n]*\[CR\])\b/gi,
    '[$1 CR]'
  );
  s = s.replace(/\bCredits?[^\S\r\n]+\[CR\]/g, '[CR]');

  // 4. Merge "[number] Effort [EF]" or "[number] [EF]" -> "[number EF]"
  s = s.replace(
    /(?<![A-Za-z0-9_])([+-]?\d+(?:[–-]\d+|\+)?)[^\S\r\n]+(?:additional[^\S\r\n]+|bonus[^\S\r\n]+|extra[^\S\r\n]+)?(?:Effort[^\S\r\n]+)?\[EF\]/gi,
    '[$1 EF]'
  );
  s = s.replace(
    /(?<![A-Za-z0-9_])([+-]?\d+(?:[–-]\d+|\+)?)[^\S\r\n]+Effort(?![^\S\r\n]*:)(?![^\S\r\n]*\[EF\])\b/gi,
    '[$1 EF]'
  );
  s = s.replace(/\bEffort[^\S\r\n]+\[EF\]/g, '[EF]');

  // 5. Merge "[number] Political Influence (Power/Points) [PIP]" or "[number] [PIP]" -> "[number PIP]"
  s = s.replace(
    /(?<![A-Za-z0-9_])([+-]?\d+(?:[–-]\d+|\+)?)[^\S\r\n]+(?:additional[^\S\r\n]+|bonus[^\S\r\n]+|extra[^\S\r\n]+)?(?:Political Influence(?:[^\S\r\n]+(?:Power|Points?))?[^\S\r\n]+|PIP[^\S\r\n]+)?\[PIP\]/gi,
    '[$1 PIP]'
  );
  s = s.replace(/\bPolitical Influence(?:[^\S\r\n]+(?:Power|Points?))?[^\S\r\n]+\[PIP\]/g, '[PIP]');

  // 6. Merge "[number] Loyalty (Points) [LOY]" or "[number] [LOY]" or "(1 LOY)" -> "[number LOY]"
  s = s.replace(
    /(?<![A-Za-z0-9_])([+-]?\d+(?:[–-]\d+|\+)?)[^\S\r\n]+(?:additional[^\S\r\n]+|bonus[^\S\r\n]+|extra[^\S\r\n]+)?(?:Loyalty(?:[^\S\r\n]+Points?)?[^\S\r\n]+)?\[LOY\]/gi,
    '[$1 LOY]'
  );
  s = s.replace(
    /\((\d+\+?)[^\S\r\n]+LOY\)/g,
    '([$1 LOY])'
  );
  s = s.replace(
    /(?<![A-Za-z0-9_\[])([+-]?\d+\+?)[^\S\r\n]+LOY\b(?!\])(?![^\S\r\n]*:)/g,
    '[$1 LOY]'
  );
  s = s.replace(/\bLoyalty(?:[^\S\r\n]+Points?)?[^\S\r\n]+\[LOY\]/g, '[LOY]');

  // 7. Merge "[number] Victory Points [VP]" or "[number] VPs" or "[number] [VP]" -> "[number VP]"
  s = s.replace(
    /(?<![A-Za-z0-9_])([+-]?\d+(?:[–-]\d+|\+)?)[^\S\r\n]+(?:additional[^\S\r\n]+|bonus[^\S\r\n]+|extra[^\S\r\n]+)?(?:Victory Points?[^\S\r\n]+|VPs?[^\S\r\n]+)?\[VP\]/gi,
    '[$1 VP]'
  );
  s = s.replace(
    /(?<![A-Za-z0-9_\[])([+-]?\d+)[^\S\r\n]+(?:bonus[^\S\r\n]+|extra[^\S\r\n]+)?VPs?\b(?!\])(?![^\S\r\n]*:)/g,
    '[$1 VP]'
  );
  s = s.replace(/\bVictory Points?[^\S\r\n]+\[VP\]/g, '[VP]');

  // 8. Thematic Migration: [DOOM] -> [FAIL] (Mission Failure Tracker)
  s = s.replace(
    /(?<![A-Za-z0-9_])([+-]?\d+(?:[–-]\d+|\+)?)[^\S\r\n]+(?:additional[^\S\r\n]+|extra[^\S\r\n]+)?(?:Mission[^\S\r\n]+Failure|Failure|Doom)[^\S\r\n]*\[(?:FAIL|FAILURE|DOOM)\]/gi,
    '[$1 FAIL]'
  );
  s = s.replace(
    /(?<![A-Za-z0-9_])([+-]?\d+(?:[–-]\d+|\+)?)[^\S\r\n]+\[(?:FAIL|FAILURE|DOOM)\]/g,
    '[$1 FAIL]'
  );
  s = s.replace(/\[DOOM\]/g, '[FAIL]');
  s = s.replace(/\[FAILURE\]/g, '[FAIL]');
  s = s.replace(/\bDoom\s+Tracker\b/gi, 'Mission Failure Tracker');
  s = s.replace(/\bDoom\s+Clock\b/gi, 'Mission Failure Tracker');
  s = s.replace(/\bDoom\s+Track\b/gi, 'Mission Failure Track');
  s = s.replace(/\bMax(?:imum)?\s+Doom\b/gi, 'Maximum Failure Limit');

  // 9. Merge "[number] Momentum [MOM]" or "[number] [MOM]" -> "[number MOM]"
  s = s.replace(
    /(?<![A-Za-z0-9_])([+-]?\d+(?:[–-]\d+|\+)?)[^\S\r\n]+(?:additional[^\S\r\n]+|bonus[^\S\r\n]+|extra[^\S\r\n]+)?(?:Momentum[^\S\r\n]+)?\[MOM\]/gi,
    '[$1 MOM]'
  );
  s = s.replace(/\bOperational Momentum\s+\(\[MOM\]\)/g, 'Operational Momentum ([MOM])');

  // 10. Clean up accidental double brackets like [[1 CR]] -> [1 CR]
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

  const fmLines = frontmatter.split('\n');
  const updatedFmLines = fmLines.map((line) => {
    // If it's a numeric mapping like '  effort: 0' or 'credits: 0', NEVER touch it
    if (/^\s*[a-zA-Z0-9_-]+\s*:\s*-?\d+(\.\d+)?\s*$/.test(line)) {
      return line;
    }
    // Only normalize lines with quotes or brackets
    if (line.includes('"') || line.includes("'") || line.includes('[')) {
      return normalizeSemanticProse(line);
    }
    return line;
  });

  const updatedBody = normalizeSemanticProse(body);
  const fullUpdated = `---\n${updatedFmLines.join('\n')}\n---\n${updatedBody}`;
  if (fullUpdated !== normalized) {
    fs.writeFileSync(filePath, fullUpdated, 'utf8');
    return true;
  }
  return false;
}

function main() {
  const files = walkMdFiles(GAME_DIR);
  let changed = 0;
  for (const f of files) {
    if (processMarkdownFile(f)) {
      changed++;
    }
  }
  console.log(`Semantic normalization complete: inspected ${files.length} files, updated ${changed} files.`);
}

main();
