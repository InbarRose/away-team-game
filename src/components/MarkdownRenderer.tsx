import React, { useState } from 'react';
import { SemanticText } from './SemanticText';

/**
 * Normalizes lightweight inline LaTeX math notations found in rulebook markdown
 * into crisp Unicode / typographic symbols so no raw "$...$" strings leak into the UI.
 */
function normalizeMathNotation(raw: string): string {
  return raw
    .replace(/\\rightarrow/g, '→')
    .replace(/\\leftarrow/g, '←')
    .replace(/\\ge/g, '≥')
    .replace(/\\le/g, '≤')
    .replace(/\\sim/g, '~')
    .replace(/\\times/g, '×')
    .replace(/\\approx/g, '≈')
    .replace(/\\frac\{(\d+)\}\{(\d+)\}/g, '$1/$2')
    .replace(/\\mathbf\{([^}]+)\}/g, '**$1**')
    .replace(/\\text\{([^}]+)\}/g, '$1')
    .replace(/\\quad/g, '  ')
    .replace(/\$([^$]+)\$/g, (_, inner) => inner.trim());
}

function renderInlineFormatting(text: string): React.ReactNode {
  const normalized = normalizeMathNotation(text);
  // Split by **bold** and `code` first, then pass plain text segments to SemanticText
  const tokens = normalized.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return tokens.map((tok, i) => {
    if (tok.startsWith('**') && tok.endsWith('**')) {
      return (
        <strong key={i} style={{ color: '#f8fafc' }}>
          <SemanticText text={tok.slice(2, -2)} />
        </strong>
      );
    }
    if (tok.startsWith('`') && tok.endsWith('`')) {
      const inner = tok.slice(1, -1);
      return (
        <code
          key={i}
          style={{
            background: 'rgba(148, 163, 184, 0.14)',
            padding: '0.1rem 0.35rem',
            borderRadius: '4px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.84em',
            color: '#e2e8f0',
          }}
        >
          <SemanticText text={inner} />
        </code>
      );
    }
    return <SemanticText key={i} text={tok} />;
  });
}

const CALLOUT_CONFIG: Record<
  string,
  {
    label: string;
    icon: string;
    className: string;
    accentColor: string;
  }
> = {
  IMPORTANT: {
    label: 'GOLDEN RULE / IMPORTANT',
    icon: '⚖️',
    className: 'callout-important',
    accentColor: '#f59e0b',
  },
  TIP: {
    label: 'TACTICAL TIP & STRATEGY',
    icon: '💡',
    className: 'callout-tip',
    accentColor: '#10b981',
  },
  WARNING: {
    label: 'HAZARD & ACCOUNTABILITY ALERT',
    icon: '⚠️',
    className: 'callout-warning',
    accentColor: '#ef4444',
  },
  NOTE: {
    label: 'DESIGNER & RULES NOTE',
    icon: '📌',
    className: 'callout-note',
    accentColor: '#38bdf8',
  },
  EXAMPLE: {
    label: 'TABLETOP EXAMPLE OF PLAY',
    icon: '🎲',
    className: 'callout-example',
    accentColor: '#a855f7',
  },
  DIAGRAM: {
    label: 'RULEBOOK ILLUSTRATION & DIAGRAM PLACEHOLDER',
    icon: '📐',
    className: 'callout-diagram',
    accentColor: '#00e5ff',
  },
};

function DiagramCalloutBox({ lines }: { lines: string[] }) {
  const [copied, setCopied] = useState(false);
  const titleLine = lines[0] || 'Rulebook Diagram Placeholder';
  const bodyLines = lines.slice(1);
  const fullSpecText = lines.join(' ').replace(/\*\*/g, '');

  return (
    <div className="rulebook-callout callout-diagram">
      <div className="rulebook-callout-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>📐</span>
          <span>RULEBOOK ILLUSTRATION & SCHEMATIC BLUEPRINT</span>
        </div>
        <button
          type="button"
          className="vtt-btn"
          style={{ fontSize: '0.7rem', padding: '0.2rem 0.55rem' }}
          onClick={() => {
            if (typeof navigator !== 'undefined' && navigator.clipboard) {
              navigator.clipboard.writeText(fullSpecText);
              setCopied(true);
              setTimeout(() => setCopied(false), 1800);
            }
          }}
        >
          {copied ? '✓ Copied Art Spec' : '📋 Copy Diagram Prompt'}
        </button>
      </div>

      <div className="rulebook-diagram-frame">
        <div className="rulebook-diagram-wireframe">
          <svg
            viewBox="0 0 600 130"
            style={{ width: '100%', maxHeight: '115px', opacity: 0.85 }}
          >
            <defs>
              <pattern
                id="rbGrid"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 20 0 L 0 0 0 20"
                  fill="none"
                  stroke="rgba(0, 229, 255, 0.12)"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="600" height="130" fill="url(#rbGrid)" rx="6" />
            <rect
              x="16"
              y="18"
              width="150"
              height="94"
              rx="6"
              fill="rgba(15, 23, 42, 0.85)"
              stroke="#00e5ff"
              strokeDasharray="4 3"
            />
            <text
              x="91"
              y="58"
              textAnchor="middle"
              fill="#38bdf8"
              fontSize="11"
              fontFamily="monospace"
            >
              [ STEP 1: INPUT ]
            </text>
            <text
              x="91"
              y="76"
              textAnchor="middle"
              fill="#94a3b8"
              fontSize="9"
              fontFamily="monospace"
            >
              Squad / Vault / Focus
            </text>

            <path
              d="M 174 65 L 218 65"
              stroke="#00e5ff"
              strokeWidth="2"
               markerEnd="url(#arrow)"
            />

            <rect
              x="225"
              y="18"
              width="150"
              height="94"
              rx="6"
              fill="rgba(15, 23, 42, 0.85)"
              stroke="#f59e0b"
              strokeWidth="1.5"
            />
            <text
              x="300"
              y="58"
              textAnchor="middle"
              fill="#fbbf24"
              fontSize="11"
              fontFamily="monospace"
            >
              [ 6.0 DICE ENGINE ]
            </text>
            <text
              x="300"
              y="76"
              textAnchor="middle"
              fill="#94a3b8"
              fontSize="9"
              fontFamily="monospace"
            >
              3+ / 4+ / 5+ vs Backfire 1
            </text>

            <path d="M 382 65 L 426 65" stroke="#10b981" strokeWidth="2" />

            <rect
              x="434"
              y="18"
              width="150"
              height="94"
              rx="6"
              fill="rgba(15, 23, 42, 0.85)"
              stroke="#10b981"
              strokeDasharray="4 3"
            />
            <text
              x="509"
              y="58"
              textAnchor="middle"
              fill="#34d399"
              fontSize="11"
              fontFamily="monospace"
            >
              [ OUTCOME & MOM ]
            </text>
            <text
              x="509"
              y="76"
              textAnchor="middle"
              fill="#94a3b8"
              fontSize="9"
              fontFamily="monospace"
            >
              Clear / Trauma / [VP]
            </text>
          </svg>
        </div>

        <div style={{ marginTop: '0.55rem' }}>
          <div style={{ fontWeight: 700, color: '#f8fafc', marginBottom: '0.35rem' }}>
            {renderInlineFormatting(titleLine)}
          </div>
          {bodyLines.map((bl, idx) => (
            <div
              key={idx}
              style={{
                fontSize: '0.83rem',
                color: '#cbd5e1',
                marginTop: '0.25rem',
              }}
            >
              {renderInlineFormatting(bl.replace(/^\*\s+/, '• '))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function MarkdownRenderer({ content }: { content: string }) {
  if (!content) return null;
  const lines = content.replace(/\r\n/g, '\n').split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    // Fenced Code / Schematic Block (```text ... ```)
    if (trimmed.startsWith('```')) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      if (i < lines.length) i++; // skip closing ```
      elements.push(
        <pre key={`pre-${i}`} className="rulebook-flowchart-pre">
          <code>{codeLines.join('\n')}</code>
        </pre>
      );
      continue;
    }

    // Display Math Block ($$ ... $$)
    if (trimmed.startsWith('$$') && trimmed.endsWith('$$') && trimmed.length > 4) {
      const formula = normalizeMathNotation(trimmed.slice(2, -2));
      elements.push(
        <div key={`math-${i}`} className="rulebook-formula-banner">
          {renderInlineFormatting(formula)}
        </div>
      );
      i++;
      continue;
    }

    if (trimmed === '---') {
      elements.push(
        <hr
          key={`hr-${i}`}
          style={{
            border: 'none',
            borderTop: '1px solid var(--border-subtle)',
            margin: '1.5rem 0',
          }}
        />
      );
      i++;
      continue;
    }

    if (trimmed.startsWith('# ')) {
      elements.push(<h1 key={`h1-${i}`}>{renderInlineFormatting(trimmed.slice(2))}</h1>);
      i++;
      continue;
    }
    if (trimmed.startsWith('## ')) {
      elements.push(<h2 key={`h2-${i}`}>{renderInlineFormatting(trimmed.slice(3))}</h2>);
      i++;
      continue;
    }
    if (trimmed.startsWith('### ')) {
      elements.push(<h3 key={`h3-${i}`}>{renderInlineFormatting(trimmed.slice(4))}</h3>);
      i++;
      continue;
    }
    if (trimmed.startsWith('#### ')) {
      elements.push(<h4 key={`h4-${i}`}>{renderInlineFormatting(trimmed.slice(5))}</h4>);
      i++;
      continue;
    }

    // Markdown Table block
    if (trimmed.startsWith('|') && i + 1 < lines.length && lines[i + 1].trim().startsWith('|')) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i].trim());
        i++;
      }
      const parseRow = (rowStr: string) =>
        rowStr
          .replace(/^\|/, '')
          .replace(/\|$/, '')
          .split('|')
          .map((c) => c.trim());

      const headers = parseRow(tableLines[0]);
      const dataRows = tableLines.slice(2).map(parseRow);
      elements.push(
        <div key={`tbl-${i}`} style={{ overflowX: 'auto', margin: '1rem 0' }}>
          <table>
            <thead>
              <tr>
                {headers.map((h, hIdx) => (
                  <th key={hIdx}>{renderInlineFormatting(h)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataRows.map((row, rIdx) => (
                <tr key={rIdx}>
                  {row.map((cell, cIdx) => (
                    <td key={cIdx}>{renderInlineFormatting(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // Blockquote OR GitHub-Style Alert / Rulebook Callout (> [!IMPORTANT], > [!EXAMPLE], > [!DIAGRAM], etc.)
    if (trimmed.startsWith('>')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ''));
        i++;
      }

      const firstLine = (quoteLines[0] || '').trim();
      const alertMatch = firstLine.match(/^\[!(IMPORTANT|TIP|WARNING|NOTE|CAUTION|EXAMPLE|DIAGRAM)\]\s*(.*)$/i);

      if (alertMatch) {
        const rawType = alertMatch[1].toUpperCase();
        const typeKey = rawType === 'CAUTION' ? 'WARNING' : rawType;
        const cfg = CALLOUT_CONFIG[typeKey] || CALLOUT_CONFIG.NOTE;
        const remainderFirstLine = alertMatch[2] ? [alertMatch[2]] : [];
        const bodyLines = [...remainderFirstLine, ...quoteLines.slice(1)].filter(
          (l) => l.trim().length > 0
        );

        if (typeKey === 'DIAGRAM') {
          elements.push(<DiagramCalloutBox key={`diag-${i}`} lines={bodyLines} />);
          continue;
        }

        elements.push(
          <div key={`callout-${i}`} className={`rulebook-callout ${cfg.className}`}>
            <div className="rulebook-callout-header">
              <span>{cfg.icon}</span>
              <span>{cfg.label}</span>
            </div>
            <div className="rulebook-callout-body">
              {bodyLines.map((ql, qIdx) => (
                <div key={qIdx} style={{ marginBottom: qIdx < bodyLines.length - 1 ? '0.38rem' : 0 }}>
                  {renderInlineFormatting(ql)}
                </div>
              ))}
            </div>
          </div>
        );
        continue;
      }

      elements.push(
        <blockquote
          key={`bq-${i}`}
          style={{
            margin: '1rem 0',
            padding: '0.75rem 1rem',
            borderLeft: '3px solid var(--currency-effort)',
            background: 'rgba(0, 229, 255, 0.06)',
            borderRadius: '0 6px 6px 0',
          }}
        >
          {quoteLines.map((ql, qIdx) => (
            <div key={qIdx}>{renderInlineFormatting(ql)}</div>
          ))}
        </blockquote>
      );
      continue;
    }

    // Unordered or Ordered List
    if (/^(\*|-|\d+\.)\s+/.test(trimmed)) {
      const isOrdered = /^\d+\.\s+/.test(trimmed);
      const listItems: string[] = [];
      while (i < lines.length && /^\s*(\*|-|\d+\.)\s+/.test(lines[i])) {
        listItems.push(lines[i].replace(/^\s*(\*|-|\d+\.)\s+/, '').trim());
        i++;
      }
      const ListTag = isOrdered ? 'ol' : 'ul';
      elements.push(
        <ListTag key={`list-${i}`} style={{ paddingLeft: '1.4rem', margin: '0.65rem 0' }}>
          {listItems.map((li, lIdx) => (
            <li key={lIdx} style={{ marginBottom: '0.38rem' }}>
              {renderInlineFormatting(li)}
            </li>
          ))}
        </ListTag>
      );
      continue;
    }

    // Paragraph
    elements.push(
      <p key={`p-${i}`} style={{ margin: '0.65rem 0' }}>
        {renderInlineFormatting(trimmed)}
      </p>
    );
    i++;
  }

  return <div>{elements}</div>;
}
