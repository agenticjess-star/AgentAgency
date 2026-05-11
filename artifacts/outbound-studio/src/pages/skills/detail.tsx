import { FC, useEffect, useState } from "react";
import { Link, useParams } from "wouter";
import { ArrowLeft, ExternalLink } from "lucide-react";

interface SkillMeta {
  slug: string;
  name: string;
  description: string;
  agent: string;
  tags: string[];
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderMarkdown(raw: string): string {
  const lines = raw.split("\n");
  const out: string[] = [];
  let inCode = false;
  let codeLines: string[] = [];
  let inTable = false;
  let tableRows: string[][] = [];

  const flushTable = () => {
    if (!tableRows.length) return;
    const [header, , ...body] = tableRows;
    const thCells = (header ?? []).map(
      (c) => `<th class="font-mono text-[10px] uppercase tracking-wider text-[#888] px-4 py-2 text-left border-b border-[#222]">${c}</th>`
    ).join("");
    const bodyRows = body.map((row) =>
      `<tr class="border-b border-[#111]">${row.map((c) => `<td class="px-4 py-2 text-[#666] text-[12px] font-mono">${c}</td>`).join("")}</tr>`
    ).join("");
    out.push(
      `<div class="overflow-x-auto my-6"><table class="w-full border border-[#1e1e1e] text-left"><thead><tr>${thCells}</tr></thead><tbody>${bodyRows}</tbody></table></div>`
    );
    tableRows = [];
    inTable = false;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Fenced code blocks
    if (line.startsWith("```")) {
      if (inCode) {
        out.push(
          `<pre class="bg-[#0d0d0d] border border-[#1e1e1e] p-4 my-4 overflow-x-auto font-mono text-[12px] text-[#a8b0a0] leading-relaxed whitespace-pre">${codeLines.join("\n")}</pre>`
        );
        codeLines = [];
        inCode = false;
      } else {
        if (inTable) flushTable();
        inCode = true;
      }
      continue;
    }
    if (inCode) { codeLines.push(escapeHtml(line)); continue; }

    // Tables
    if (line.startsWith("|")) {
      const cells = line.split("|").slice(1, -1).map((c) => c.trim());
      if (cells.every((c) => /^[-: ]+$/.test(c))) {
        // separator row — skip
      } else {
        tableRows.push(cells);
        inTable = true;
      }
      continue;
    }
    if (inTable) flushTable();

    const e = escapeHtml(line);

    if (/^# (.+)$/.test(e)) {
      out.push(e.replace(/^# (.+)$/, '<h1 class="text-3xl font-light tracking-tight text-[#f0eeeb] mb-6 mt-8">$1</h1>'));
    } else if (/^## (.+)$/.test(e)) {
      out.push(e.replace(/^## (.+)$/, '<h2 class="text-xl font-mono text-[#ea580c] uppercase tracking-wider mb-4 mt-10">$1</h2>'));
    } else if (/^### (.+)$/.test(e)) {
      out.push(e.replace(/^### (.+)$/, '<h3 class="text-base font-mono text-[#f0eeeb] uppercase tracking-wide mb-3 mt-8">$1</h3>'));
    } else if (/^#### (.+)$/.test(e)) {
      out.push(e.replace(/^#### (.+)$/, '<h4 class="font-mono text-[#aaa] uppercase tracking-wider text-sm mb-2 mt-6">$1</h4>'));
    } else if (/^- (.+)$/.test(e)) {
      out.push(e.replace(/^- (.+)$/, '<li class="flex gap-2 text-[#888] text-sm leading-relaxed mb-1"><span class="text-[#ea580c] shrink-0 mt-0.5">›</span><span>$1</span></li>'));
    } else if (/^(\d+)\. (.+)$/.test(e)) {
      out.push(e.replace(/^(\d+)\. (.+)$/, '<li class="flex gap-2 text-[#888] text-sm leading-relaxed mb-1"><span class="text-[#ea580c] font-mono text-[11px] shrink-0 mt-0.5">$1.</span><span>$2</span></li>'));
    } else if (e.trim() === "") {
      out.push('<div class="my-3"></div>');
    } else {
      const inline = e
        .replace(/\*\*(.+?)\*\*/g, '<strong class="text-[#f0eeeb] font-semibold">$1</strong>')
        .replace(/`(.+?)`/g, '<code class="font-mono text-[#ea580c] bg-[#1a1a1a] px-1.5 py-0.5 text-[11px]">$1</code>');
      out.push(`<p class="text-[#888] text-sm leading-relaxed mb-3">${inline}</p>`);
    }
  }

  if (inTable) flushTable();
  return out.join("\n");
}

const SkillDetailPage: FC = () => {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [meta, setMeta] = useState<SkillMeta | null>(null);
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setNotFound(false);

    const base = import.meta.env.BASE_URL;
    Promise.all([
      fetch(`${base}skills/index.json`).then((r) => r.json()),
      fetch(`${base}skills/${slug}.md`).then((r) => {
        if (!r.ok) throw new Error("not found");
        return r.text();
      }),
    ])
      .then(([index, mdText]: [SkillMeta[], string]) => {
        const found = index.find((s) => s.slug === slug);
        setMeta(found ?? null);
        setContent(mdText);
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, [slug]);

  return (
    <div data-theme="dark" className="min-h-screen bg-[#000] text-[#f0eeeb]">
      {/* Nav */}
      <header className="border-b border-[#1a1a1a] bg-black/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/">
            <span className="font-mono text-sm font-semibold uppercase tracking-tighter cursor-pointer">
              Outbound<span className="text-[#ea580c]">Studio</span>
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/skills">
              <span className="font-mono text-[11px] text-[#555] hover:text-[#f0eeeb] uppercase tracking-wider cursor-pointer transition-colors flex items-center gap-1">
                <ArrowLeft className="w-3 h-3" /> Skills
              </span>
            </Link>
            <Link href="/sign-in">
              <button className="font-mono text-[11px] uppercase tracking-wider border border-[#282828] px-4 py-2 hover:border-[#ea580c] hover:text-[#ea580c] transition-colors text-[#f0eeeb]">
                Console
              </button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-16">
        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-5 w-32 bg-[#1a1a1a]" />
            <div className="h-10 w-72 bg-[#1a1a1a]" />
            <div className="h-4 w-full bg-[#1a1a1a]" />
            <div className="h-4 w-3/4 bg-[#1a1a1a]" />
          </div>
        ) : notFound ? (
          <div className="text-center py-20">
            <div className="font-mono text-[#ea580c] text-[11px] uppercase tracking-widest mb-4">404</div>
            <h1 className="text-2xl font-light text-[#f0eeeb] mb-4">Skill not found</h1>
            <Link href="/skills">
              <span className="font-mono text-[11px] text-[#555] hover:text-[#ea580c] uppercase tracking-wider cursor-pointer transition-colors">
                ← Back to Skills Directory
              </span>
            </Link>
          </div>
        ) : (
          <>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 font-mono text-[11px] text-[#444] mb-10">
              <Link href="/skills">
                <span className="hover:text-[#ea580c] cursor-pointer transition-colors">Skills</span>
              </Link>
              <span>/</span>
              <span className="text-[#666]">{meta?.name ?? slug}</span>
            </div>

            {/* Header */}
            {meta && (
              <div className="mb-10 pb-8 border-b border-[#1a1a1a]">
                <div className="font-mono text-[11px] text-[#ea580c] uppercase tracking-widest mb-3">
                  {meta.agent}
                </div>
                <h1 className="text-4xl font-light tracking-tight mb-4">{meta.name}</h1>
                <p className="text-[#888] text-[15px] leading-relaxed mb-5 max-w-2xl">{meta.description}</p>
                <div className="flex flex-wrap gap-2">
                  {meta.tags.map((tag) => (
                    <span key={tag} className="font-mono text-[9px] uppercase tracking-wider text-[#444] border border-[#1e1e1e] px-2 py-0.5">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Markdown content */}
            <div
              className="prose-dark"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
            />
          </>
        )}
      </div>

      <footer className="border-t border-[#111] py-10 mt-20">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
          <div className="font-mono text-[10px] text-[#333] uppercase tracking-wider">
            Outbound Studio · Skills Reference
          </div>
          <Link href="/skills">
            <span className="font-mono text-[11px] text-[#444] hover:text-[#ea580c] cursor-pointer uppercase tracking-wider transition-colors flex items-center gap-1.5">
              <ExternalLink className="w-3 h-3" /> All Skills
            </span>
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default SkillDetailPage;
