import React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";

interface BlogContentRendererProps {
  content: string;
}

export function slugifyHeading(text: string, index: number = 0): string {
  const cleaned = text
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\-_]+/gu, "-")
    .replace(/(^-|-$)/g, "");
  return cleaned || `section-${index}`;
}

export function parseHeadings(content: string): { id: string; text: string; level: number }[] {
  const lines = content.split("\n");
  const headings: { id: string; text: string; level: number }[] = [];
  let index = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("## ")) {
      const text = trimmed.replace(/^##\s+/, "");
      const id = slugifyHeading(text, index++);
      headings.push({ id, text, level: 2 });
    } else if (trimmed.startsWith("### ")) {
      const text = trimmed.replace(/^###\s+/, "");
      const id = slugifyHeading(text, index++);
      headings.push({ id, text, level: 3 });
    }
  }

  return headings;
}

export default function BlogContentRenderer({ content }: BlogContentRendererProps) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let index = 0;

  let inTable = false;
  let tableRows: string[] = [];

  const flushTable = () => {
    if (tableRows.length > 0) {
      const headerRow = tableRows[0];
      const dataRows = tableRows.slice(2); // Skip separator row

      const parseCells = (row: string) =>
        row
          .split("|")
          .map((c) => c.trim())
          .filter((_, i, arr) => i > 0 && i < arr.length - 1);

      const headers = parseCells(headerRow);

      elements.push(
        <div key={`table-${index++}`} className="my-8 overflow-x-auto rounded-2xl border border-white/10 bg-[#12141C]">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#181A24] border-b border-white/10 text-white font-bold">
              <tr>
                {headers.map((h, i) => (
                  <th key={i} className="py-3.5 px-4 sm:px-6">
                    {renderInlineText(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-[#9EA3B0]">
              {dataRows.map((row, rIdx) => {
                const cells = parseCells(row);
                return (
                  <tr key={rIdx} className="hover:bg-white/[0.02] transition">
                    {cells.map((cell, cIdx) => (
                      <td key={cIdx} className="py-3.5 px-4 sm:px-6 font-medium">
                        {renderInlineText(cell)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
      inTable = false;
    }
  };

  let inBlockquote = false;
  let blockquoteLines: string[] = [];

  const flushBlockquote = () => {
    if (blockquoteLines.length > 0) {
      elements.push(
        <div
          key={`quote-${index++}`}
          className="my-6 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-red-950/30 to-[#141620] border-l-4 border-l-[#E50000] border-y border-r border-white/10 shadow-lg space-y-2"
        >
          <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-red-500" />
            Key Insight / Pro Tip
          </div>
          <div className="text-sm sm:text-base text-white/90 leading-relaxed italic">
            {blockquoteLines.map((line, i) => (
              <p key={i}>{renderInlineText(line)}</p>
            ))}
          </div>
        </div>
      );
      blockquoteLines = [];
      inBlockquote = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // Handle Tables
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      flushBlockquote();
      inTable = true;
      tableRows.push(trimmed);
      continue;
    } else if (inTable) {
      flushTable();
    }

    // Handle Blockquotes
    if (trimmed.startsWith("> ")) {
      inBlockquote = true;
      blockquoteLines.push(trimmed.replace(/^>\s+/, ""));
      continue;
    } else if (inBlockquote) {
      flushBlockquote();
    }

    // Horizontal Rule
    if (trimmed === "---") {
      elements.push(<hr key={`hr-${index++}`} className="my-10 border-white/[0.08]" />);
      continue;
    }

    // Empty lines
    if (!trimmed) {
      continue;
    }

    // H2 Headings
    if (trimmed.startsWith("## ")) {
      const title = trimmed.replace(/^##\s+/, "");
      const id = slugifyHeading(title, index);
      elements.push(
        <h2
          key={`h2-${index++}`}
          id={id}
          className="scroll-mt-28 text-2xl sm:text-3xl font-extrabold text-white tracking-tight pt-6 pb-2 border-b border-white/[0.06] flex items-center gap-2.5"
        >
          <span className="w-2 h-6 rounded-full bg-[#E50000] shrink-0" />
          <span>{title}</span>
        </h2>
      );
      continue;
    }

    // H3 Headings
    if (trimmed.startsWith("### ")) {
      const title = trimmed.replace(/^###\s+/, "");
      const id = slugifyHeading(title, index);
      elements.push(
        <h3
          key={`h3-${index++}`}
          id={id}
          className="scroll-mt-28 text-lg sm:text-xl font-bold text-white tracking-tight pt-4 pb-1"
        >
          {title}
        </h3>
      );
      continue;
    }

    // Unordered List Items
    if (trimmed.startsWith("- ")) {
      const itemText = trimmed.replace(/^-\s+/, "");
      elements.push(
        <div key={`li-${index++}`} className="flex items-start gap-3 my-2 text-sm sm:text-base text-[#9EA3B0] leading-relaxed">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2.5 shrink-0" />
          <div>{renderInlineText(itemText)}</div>
        </div>
      );
      continue;
    }

    // Numbered List Items
    if (/^\d+\.\s+/.test(trimmed)) {
      const match = trimmed.match(/^(\d+)\.\s+(.*)$/);
      if (match) {
        const num = match[1];
        const itemText = match[2];
        elements.push(
          <div key={`nli-${index++}`} className="flex items-start gap-3 my-3 text-sm sm:text-base text-[#9EA3B0] leading-relaxed">
            <span className="w-6 h-6 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              {num}
            </span>
            <div>{renderInlineText(itemText)}</div>
          </div>
        );
        continue;
      }
    }

    // Standard Paragraph
    elements.push(
      <p key={`p-${index++}`} className="text-sm sm:text-base text-[#C2C6D2] leading-relaxed my-3 font-normal">
        {renderInlineText(trimmed)}
      </p>
    );
  }

  // Flush any trailing blocks
  flushTable();
  flushBlockquote();

  return <div className="space-y-2">{elements}</div>;
}

function renderInlineText(text: string): React.ReactNode {
  // Regex tokens: **bold**, `code`, [link](url)
  const regex = /(\*\*.*?\*\*|`.*?`|\[.*?\]\(.*?\))/g;
  const parts = text.split(regex);

  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="text-white font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={i} className="px-1.5 py-0.5 mx-0.5 text-xs font-mono rounded bg-white/10 text-red-400 border border-white/[0.08]">
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("[") && part.includes("](") && part.endsWith(")")) {
      const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
      if (linkMatch) {
        return (
          <Link
            key={i}
            href={linkMatch[2]}
            className="text-red-400 hover:text-red-300 underline underline-offset-4 font-medium transition"
          >
            {linkMatch[1]}
          </Link>
        );
      }
    }
    return part;
  });
}
