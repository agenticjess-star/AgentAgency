import { FC, useState, useRef, useEffect, FormEvent } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  useListSlackChannels,
  useGetSlackHistory,
  useSendSlackMessage,
} from "@workspace/api-client-react";
import type { SlackChannel } from "@workspace/api-client-react";
import {
  Hash, Lock, MessageSquare, RefreshCw, Send,
  Eye, BarChart3, Code2, CheckSquare, Package, Users, SendHorizontal,
  Wrench, FileInput, FileOutput, ChevronRight, Terminal, BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

/* ── Agent roster data ─────────────────────────────────────────────── */
const AGENT_ROSTER = [
  {
    n: "01",
    name: "Prospector",
    slug: "prospector",
    icon: Eye,
    role: "Identifies SMBs with weak or missing web presence across target verticals and geos. Scores leads by opportunity type and hands off the highest-potential targets.",
    input: "Vertical + geo config (e.g., power_washing in Houston, TX)",
    output: "Lead pack JSONL — businessName, domain, sector, contactEmail, contactPhone, opportunityTag",
    tools: ["Google Maps", "Exa", "Firecrawl"],
    opportunityTags: ["no_website", "weak_website", "outdated", "not_ai_citable"],
    systemPrompt: `You are the Prospector — an autonomous lead discovery agent for Outbound Studio.

Your task: find local service businesses in the target vertical and geo that have weak, outdated, or missing web presence.

For each target you identify:
1. Verify the business is real and operating (Google Maps, reviews)
2. Check their current website (if any) — score it quickly: does it load? Is it mobile-friendly? Is it AI-citable?
3. Assign an opportunityTag: no_website | weak_website | outdated | not_ai_citable
4. Extract contact info: owner name, email, phone from Maps, Exa, or the site itself

Return a ranked JSONL of leads, sorted by opportunity score (highest first). Only pass leads scoring 60+ to the Strategist.

Quality gate: do not pass a lead without a contactEmail or contactPhone. We cannot outreach without a way in.`,
    color: "text-blue-400",
    bg: "bg-blue-950/20",
    border: "border-blue-500/20",
  },
  {
    n: "02",
    name: "Strategist",
    slug: "strategist",
    icon: BarChart3,
    role: "Audits the target's existing web presence, maps the competitive landscape, and constructs a pitch strategy and site blueprint for the Builder.",
    input: "Lead JSON from Prospector — business name, domain, contact, opportunityTag",
    output: "Target dossier (dossier.md) + competitor comparison JSON + AEO gap inventory",
    tools: ["Firecrawl", "Exa", "Browserbase", "SEO Auditor skill"],
    systemPrompt: `You are the Strategist — a competitive intelligence and pitch architect for Outbound Studio.

Your task: given a prospected lead, build the full strategic context before any building begins.

Steps:
1. Full-site crawl of the target's existing site (use Firecrawl). Score it: AEO, technical SEO, mobile, trust signals.
2. Map the top 3 local competitors in the same vertical + geo. Score each the same way.
3. Identify the gap: what does the target's site fail at that competitors do well? What do ALL competitors fail at that we can leapfrog?
4. Extract brand voice from their reviews and any existing copy.
5. Build the target query list: 5-10 high-intent local searches the rebuilt site should rank/cite for.

Output dossier.md — this is the Builder's blueprint. Be specific. Vague briefs produce generic sites.

Quality gate: the dossier must include a competitor comparison table and a specific gap inventory. Without these, the Builder produces a generic site. Reject your own output if it is generic.`,
    color: "text-purple-400",
    bg: "bg-purple-950/20",
    border: "border-purple-500/20",
  },
  {
    n: "03",
    name: "Builder",
    slug: "builder",
    icon: Code2,
    role: "Generates a superior, AEO-optimized version of the target's site on spec. Deploys to Vercel. Never free-codes — uses templates, design systems, and component libraries.",
    input: "dossier.md + competitor_comparison.json from Strategist",
    output: "Live Vercel URL + GitHub repo + asset manifest (schema, llms.txt baked in)",
    tools: ["GitHub", "Vercel", "Cloudinary", "Pexels", "ElevenLabs"],
    systemPrompt: `You are the Builder — a production web developer for Outbound Studio.

Your task: build the best possible version of a local service business's website, based on the Strategist's dossier.

Rules:
- Never free-code from scratch. Use the template library and design system components.
- Every site ships with: LocalBusiness schema, Service schema per offering, FAQPage schema (min 5 Qs), BreadcrumbList, llms.txt, robots.txt allowing OAI-SearchBot and PerplexityBot, sitemap.xml
- Minimum 5 pages: Home, Services (one per service), About, Reviews, Contact
- Every page needs: unique title tag (50-65 chars), meta description (150-160 chars), H1 with primary keyword, local signals in copy
- Deploy to business-name.vercel.app before handing off

Quality gate: target AEO score > 85/100. If the Auditor returns a fail, fix the specific gaps — do not rebuild from scratch.`,
    color: "text-amber-400",
    bg: "bg-amber-950/20",
    border: "border-amber-500/20",
  },
  {
    n: "04",
    name: "Auditor",
    slug: "auditor",
    icon: CheckSquare,
    role: "Scores the built site against 40+ AEO and technical quality criteria. Enforces the quality gate — passes to Packager or returns a fix list to Builder.",
    input: "Site URL + dossier + competitor list from Builder",
    output: "Audit report with score (0-100) + pass/fail + specific fix list if failed",
    tools: ["Browserbase", "Exa", "Squirrelscan"],
    systemPrompt: `You are the Auditor — a quality gate enforcer for Outbound Studio.

Your task: objectively score the built site. No bias toward passing — a false pass wastes an outreach slot.

Scoring categories (40+ criteria):
- AEO (schema completeness, llms.txt, crawler allowlist) — 30% weight
- Technical SEO (meta tags, canonicals, sitemap, robots) — 20% weight
- Content quality (keyword placement, local signals, depth) — 20% weight
- Performance (LCP, CLS, INP via Browserbase) — 15% weight
- Mobile readiness — 10% weight
- Trust signals (NAP, reviews, credentials) — 5% weight

Pass threshold: 85/100 overall, no single category below 70.

If fail: return a ranked fix list with specific items (not categories). "Missing FAQPage schema" — not "schema incomplete". The Builder must be able to fix each item without guessing.

Also score the top 3 competitors from the dossier on the same rubric. Our site must beat the highest competitor score to pass.`,
    color: "text-red-400",
    bg: "bg-red-950/20",
    border: "border-red-500/20",
  },
  {
    n: "05",
    name: "Packager",
    slug: "packager",
    icon: Package,
    role: "Bundles the built site, audit report, and offer materials into a structured claim package — email draft, video walkthrough, price sheet, and 7-day urgency window.",
    input: "Site URL + audit report + contact info + brand voice from Auditor",
    output: "Claim email draft + video URL + offer PDF with 7-day window",
    tools: ["ElevenLabs", "Cloudinary", "Agent Mail", "Gumroad"],
    systemPrompt: `You are the Packager — a deal closer for Outbound Studio.

Your task: turn the built site into an irresistible claim offer.

Package components:
1. Email draft — BLUF format, subject: "[ACTION] Your new [service] site is ready to claim"
   - Audit score comparison (their current score vs our build)
   - Competitor gap (specific — not generic)
   - Live preview link
   - Price ($1,997 core / $2,497 premium)
   - 7-day claim window with hard expiry date
   - If no response in 7 days: "We'll offer it to [Competitor Name] instead"
2. Video walkthrough — 30-60 seconds, generated from HTML, no screen recording
3. Offer summary — 1-page PDF with scope, price, terms

The email must not sound like a template. Use the brand voice and specific details from the dossier. Every email is unique.

Pass to Persona Tester before sending anything.`,
    color: "text-emerald-400",
    bg: "bg-emerald-950/20",
    border: "border-emerald-500/20",
  },
  {
    n: "06",
    name: "Persona Tester",
    slug: "persona-tester",
    icon: Users,
    role: "Simulates 3 ICP personas against the claim offer to validate conversion likelihood before launch. Loops back to Packager with a fix list if confidence scores are insufficient.",
    input: "Email draft + offer package + target persona context from dossier",
    output: "Persona review — clarity, trust, confidence-to-reply scores + red flags + green-light / fix list",
    tools: ["Exa", "OpenRouter", "Gmail"],
    systemPrompt: `You are the Persona Tester — a pre-flight offer validator for Outbound Studio.

Your task: simulate 3 different ICP personas reading the claim offer. Assess each with brutal honesty.

Persona archetypes (adapt to the vertical):
1. The Skeptic — "Why would I trust a cold email offering to replace my site?"
2. The Busy Owner — "I have 3 minutes. Is this worth reading?"
3. The Price-Conscious — "What's the catch? How much is this really going to cost me?"

For each persona, score:
- Clarity (0-100): Do they immediately understand what they're being offered?
- Trust (0-100): Does the email feel credible or like spam?
- Confidence-to-reply (0-100): Would this persona click, reply, or call?

Green-light criteria: all three personas score 75+ on clarity and trust. At least two score 70+ on confidence-to-reply.

If failed: return a specific fix list for the Packager. "The price is too buried" — not "improve the offer". Be precise.`,
    color: "text-cyan-400",
    bg: "bg-cyan-950/20",
    border: "border-cyan-500/20",
  },
  {
    n: "07",
    name: "Outreach",
    slug: "outreach",
    icon: SendHorizontal,
    role: "Dispatches the personalized 7-day claim email sequence after operator approval. Manages the full cadence — initial send, follow-ups, and close-loop on day 8.",
    input: "Full package from Packager + Persona Tester green-light + operator approval",
    output: "Sent email confirmation + delivery status + follow-up schedule",
    tools: ["Gmail", "Agent Mail", "Klaviyo", "Telegram"],
    systemPrompt: `You are the Outreach agent — the final executor for Outbound Studio.

Your task: dispatch the claim sequence after the operator approves.

Sequence schedule:
- Day 1: Initial send — claim offer with preview link and audit score comparison
- Day 3: Gentle nudge — "Just checking you saw this" + one specific stat from the audit
- Day 5: Urgency reminder — "3 days left on your claim window"
- Day 7: Final notice — "Today is the last day to claim your site"
- Day 8: Close loop — "The window has closed. We're offering it elsewhere. Reach out if you'd like to discuss."

Rules:
- Never send Day 3+ follow-ups if the prospect has already replied
- Log all send events to the pipeline run record
- Notify the operator via Telegram on reply, open, or click events
- If unsubscribe or hard bounce: mark lead as recycled, do not re-contact

After the window closes: update lead status to won | lost | recycled based on outcome.`,
    color: "text-orange-400",
    bg: "bg-orange-950/20",
    border: "border-orange-500/20",
  },
];

/* ── Message panel ─────────────────────────────────────────────────── */
function MessageArea({ channel }: { channel: SlackChannel }) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [draft, setDraft] = useState("");

  const { data: messages = [], isLoading, isFetching, refetch } = useGetSlackHistory(channel.id);

  useEffect(() => {
    const id = setInterval(() => refetch(), 8000);
    return () => clearInterval(id);
  }, [refetch]);

  const { mutate: sendMsg, isPending: sending } = useSendSlackMessage();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend(e: FormEvent) {
    e.preventDefault();
    if (!draft.trim() || sending) return;
    const text = draft.trim();
    setDraft("");
    sendMsg({ data: { channelId: channel.id, text } }, { onSuccess: () => refetch() });
  }

  function formatTs(ts: string): string {
    const ms = parseFloat(ts) * 1000;
    return isNaN(ms) ? "" : new Date(ms).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
  }

  return (
    <div className="flex flex-col flex-1 min-w-0">
      <div className="h-11 px-4 border-b border-border flex items-center gap-2.5 shrink-0 bg-card">
        {channel.isPrivate ? <Lock className="w-3.5 h-3.5 text-secondary-foreground" /> : <Hash className="w-3.5 h-3.5 text-secondary-foreground" />}
        <span className="font-mono text-[11px] text-foreground uppercase tracking-wider">{channel.name}</span>
        {channel.memberCount != null && (
          <span className="font-mono text-[10px] text-secondary-foreground">· {channel.memberCount} members</span>
        )}
        <button onClick={() => refetch()} className="ml-auto text-secondary-foreground hover:text-foreground transition-colors" aria-label="Refresh">
          <RefreshCw className={cn("w-3.5 h-3.5", isFetching && "animate-spin")} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto bg-[#0a0a0a] p-4">
        {isLoading ? (
          <div className="flex items-center gap-2 text-[#555] font-mono text-[11px]">
            <RefreshCw className="w-3 h-3 animate-spin" /><span>Loading messages…</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="font-mono text-[11px] text-[#333] text-center pt-10">No messages yet — send the first one</div>
        ) : (
          <div className="space-y-1.5">
            {messages.map((msg) => (
              <div key={msg.ts} className="flex items-start gap-3 group">
                <span className="font-mono text-[10px] text-[#333] shrink-0 w-11 text-right pt-0.5 group-hover:text-[#555] transition-colors">{formatTs(msg.ts)}</span>
                <div className="flex-1 min-w-0">
                  {msg.userName && <span className="font-mono text-[10px] text-[#ea580c] uppercase tracking-wider mr-1.5">{msg.userName}:</span>}
                  <span className="font-mono text-[12px] text-[#c8c3bf] break-words leading-relaxed">{msg.text}</span>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="px-4 py-3 border-t border-border flex items-center gap-3 shrink-0 bg-card">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={`Message #${channel.name}…`}
          disabled={sending}
          className="flex-1 bg-background border border-border px-3 py-2 font-mono text-[12px] text-foreground placeholder:text-secondary-foreground/40 focus:outline-none focus:border-accent disabled:opacity-40 transition-colors"
        />
        <button type="submit" disabled={!draft.trim() || sending} className="p-2 border border-border text-secondary-foreground hover:border-accent hover:text-accent disabled:opacity-30 transition-colors" aria-label="Send message">
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}

/* ── Agent detail panel ─────────────────────────────────────────────── */
function AgentDetail({ agent }: { agent: typeof AGENT_ROSTER[0] }) {
  const [promptOpen, setPromptOpen] = useState(false);
  const Icon = agent.icon;

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <div className="px-6 py-5 border-b border-border bg-card">
        <div className="flex items-start gap-4">
          <div className={cn("w-12 h-12 border flex items-center justify-center shrink-0", agent.border, agent.bg)}>
            <span className={cn("font-mono text-[11px]", agent.color)}>{agent.n}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className={cn("font-mono text-[10px] uppercase tracking-widest mb-1", agent.color)}>Agent {agent.n}</div>
            <h2 className="font-mono text-[18px] uppercase tracking-wider text-foreground leading-tight">{agent.name}</h2>
            <p className="text-[13px] text-secondary-foreground leading-relaxed mt-2 max-w-2xl">{agent.role}</p>
          </div>
          <Link href={`/skills/${agent.slug}`}>
            <button className="shrink-0 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-secondary-foreground hover:text-accent border border-border hover:border-accent px-3 py-1.5 transition-colors">
              <BookOpen className="w-3 h-3" /> Skill Docs
            </button>
          </Link>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* I/O contracts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="border border-border bg-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <FileInput className="w-3.5 h-3.5 text-secondary-foreground" />
              <span className="mono-label">Input</span>
            </div>
            <p className="text-[13px] text-foreground leading-relaxed">{agent.input}</p>
          </div>
          <div className="border border-border bg-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <FileOutput className="w-3.5 h-3.5 text-secondary-foreground" />
              <span className="mono-label">Output</span>
            </div>
            <p className="text-[13px] text-foreground leading-relaxed">{agent.output}</p>
          </div>
        </div>

        {/* Tools */}
        <div className="border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Wrench className="w-3.5 h-3.5 text-secondary-foreground" />
            <span className="mono-label">Connected Tools</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {agent.tools.map((tool) => (
              <span key={tool} className="font-mono text-[10px] uppercase tracking-wider text-secondary-foreground border border-border px-2.5 py-1">
                {tool}
              </span>
            ))}
          </div>
        </div>

        {/* System prompt */}
        <div className="border border-border bg-card">
          <button
            onClick={() => setPromptOpen(!promptOpen)}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-secondary-foreground" />
              <span className="mono-label">System Prompt</span>
            </div>
            <ChevronRight className={cn("w-3.5 h-3.5 text-secondary-foreground transition-transform", promptOpen && "rotate-90")} />
          </button>
          {promptOpen && (
            <div className="border-t border-border">
              <pre className="terminal text-[11px] whitespace-pre-wrap overflow-x-auto p-5 leading-relaxed">
                <span className="t-dim">{"# System prompt starter — customize for your stack\n\n"}</span>
                {agent.systemPrompt}
              </pre>
            </div>
          )}
        </div>

        {/* Opportunity tags (Prospector only) */}
        {agent.opportunityTags && (
          <div className="border border-border bg-card p-4">
            <div className="mono-label mb-3">Opportunity Tags</div>
            <div className="grid grid-cols-2 gap-2">
              {agent.opportunityTags.map((tag) => (
                <div key={tag} className="font-mono text-[11px] text-foreground border border-border px-3 py-2">
                  <span className="text-accent mr-2">›</span>{tag}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Agent roster tab ───────────────────────────────────────────────── */
function AgentRoster() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const selected = AGENT_ROSTER[selectedIdx];

  return (
    <div className="flex border border-border overflow-hidden" style={{ height: "calc(100dvh - 200px)", minHeight: "420px" }}>
      {/* Agent list */}
      <aside className="w-48 shrink-0 border-r border-border flex flex-col bg-card">
        <div className="px-4 py-3 border-b border-border shrink-0">
          <span className="mono-label">7 Agents</span>
        </div>
        <div className="flex-1 overflow-y-auto">
          {AGENT_ROSTER.map((agent, idx) => {
            const Icon = agent.icon;
            const active = idx === selectedIdx;
            return (
              <button
                key={agent.n}
                onClick={() => setSelectedIdx(idx)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-4 py-3 text-left border-b border-border/30 transition-colors group",
                  active ? "bg-foreground/5 text-foreground" : "text-secondary-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <div className={cn("w-6 h-6 border flex items-center justify-center shrink-0 text-[9px] font-mono transition-colors", active ? agent.border : "border-border", active ? agent.bg : "")}>
                  <span className={cn(active ? agent.color : "text-secondary-foreground")}>{agent.n}</span>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-wider truncate">{agent.name}</span>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Detail panel */}
      <AgentDetail agent={selected} />
    </div>
  );
}

/* ── Slack messenger tab ────────────────────────────────────────────── */
function SlackMessenger() {
  const [channelId, setChannelId] = useState<string>("");
  const { data: channels = [], isLoading: channelsLoading } = useListSlackChannels();
  const selectedChannel = channels.find((c) => c.id === channelId) ?? null;

  return (
    <div className="flex border border-border overflow-hidden" style={{ height: "calc(100dvh - 200px)", minHeight: "420px" }}>
      {/* Channel list */}
      <aside className="w-48 md:w-60 shrink-0 border-r border-border flex flex-col bg-card">
        <div className="px-4 py-3 border-b border-border shrink-0">
          <span className="mono-label">Channels</span>
        </div>
        <div className="flex-1 overflow-y-auto">
          {channelsLoading ? (
            <div className="p-3 space-y-1.5">
              {Array(6).fill(0).map((_, i) => <div key={i} className="h-8 bg-muted animate-pulse" />)}
            </div>
          ) : channels.length === 0 ? (
            <p className="p-4 font-mono text-[11px] text-secondary-foreground">No channels found</p>
          ) : (
            channels.map((ch) => {
              const active = ch.id === channelId;
              return (
                <button
                  key={ch.id}
                  onClick={() => setChannelId(ch.id)}
                  className={cn(
                    "w-full flex items-center gap-2 px-4 py-2.5 text-left border-b border-border/30 transition-colors",
                    active ? "bg-accent/10 text-accent" : "text-secondary-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {ch.isPrivate ? <Lock className="w-3 h-3 shrink-0 opacity-60" /> : <Hash className="w-3 h-3 shrink-0 opacity-60" />}
                  <span className="font-mono text-[11px] uppercase tracking-wide truncate flex-1">{ch.name}</span>
                  {ch.memberCount != null && <span className="font-mono text-[9px] text-secondary-foreground/40 shrink-0">{ch.memberCount}</span>}
                </button>
              );
            })
          )}
        </div>
      </aside>

      {/* Message area */}
      {selectedChannel ? (
        <MessageArea key={selectedChannel.id} channel={selectedChannel} />
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center bg-[#0a0a0a] gap-3">
          <MessageSquare className="w-10 h-10 text-[#222]" />
          <span className="font-mono text-[11px] uppercase tracking-widest text-[#444]">Select a channel to start</span>
          <span className="font-mono text-[10px] text-[#2a2a2a] text-center max-w-xs px-4">
            Message any agent in your Slack workspace. Every platform that offers Slack is reachable from here.
          </span>
        </div>
      )}
    </div>
  );
}

/* ── Agents page ─────────────────────────────────────────────────────── */
const AgentsPage: FC = () => {
  const [tab, setTab] = useState<"roster" | "slack">("roster");

  return (
    <DashboardLayout>
      <div className="space-y-4">
        {/* Tab bar */}
        <div className="flex items-center gap-0 border-b border-border">
          <button
            onClick={() => setTab("roster")}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2.5 font-mono text-[10px] uppercase tracking-wider border-b-2 -mb-px transition-colors",
              tab === "roster"
                ? "border-accent text-foreground"
                : "border-transparent text-secondary-foreground hover:text-foreground"
            )}
          >
            <Users className="w-3.5 h-3.5" /> Agent Roster
          </button>
          <button
            onClick={() => setTab("slack")}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2.5 font-mono text-[10px] uppercase tracking-wider border-b-2 -mb-px transition-colors",
              tab === "slack"
                ? "border-accent text-foreground"
                : "border-transparent text-secondary-foreground hover:text-foreground"
            )}
          >
            <MessageSquare className="w-3.5 h-3.5" /> Slack Messenger
          </button>
        </div>

        {tab === "roster" ? <AgentRoster /> : <SlackMessenger />}
      </div>
    </DashboardLayout>
  );
};

export default AgentsPage;
