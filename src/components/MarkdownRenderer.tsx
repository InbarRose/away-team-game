import React from 'react';
import { SemanticText } from './SemanticText';

function renderInlineFormatting(text: string): React.ReactNode {
  // Split by **bold** and `code` first, then pass plain text segments to SemanticText
  const tokens = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
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

    if (trimmed === '---') {
      elements.push(
        <hr
          key={`hr-${i}`}
          style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', margin: '1.5rem 0' }}
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

    // Blockquote
    if (trimmed.startsWith('>')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ''));
        i++;
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
      const listItems: string[] = [];
      while (i < lines.length && /^\s*(\*|-|\d+\.)\s+/.test(lines[i])) {
        listItems.push(lines[i].replace(/^\s*(\*|-|\d+\.)\s+/, '').trim());
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} style={{ paddingLeft: '1.35rem', margin: '0.65rem 0' }}>
          {listItems.map((li, lIdx) => (
            <li key={lIdx} style={{ marginBottom: '0.35rem' }}>
              {renderInlineFormatting(li)}
            </li>
          ))}
        </ul>
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
