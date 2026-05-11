import { FC, useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight, ChevronRight, Zap, ExternalLink,
  Eye, BarChart3, Code2, CheckSquare, Package, Users, SendHorizontal,
} from "lucide-react";

/* ── Typewriter terminal ───────────────────────────────────────────── */
const TERM_LINES = [
  { text: "$ prospector --vertical=power_washing --geo='Houston, TX'", color: "#9aff6e" },
  { text: "  › scanning 1,284 local businesses...", color: "#555" },
  { text: "  › 4 weak-site targets identified", color: "#555" },
  { text: "  › handoff → strategist --lead=bnr-power-washing", color: "#555" },
  { text: "$ strategist --audit --build-pitch", color: "#9aff6e" },
  { text: "  › site audit score: 23/100 · no schema · no AEO", color: "#555" },
  { text: "  › building superior site on spec...", color: "#555" },
  { text: "$ builder --deploy --staging", color: "#9aff6e" },
  { text: "  › build complete. audit score: 94/100  [✓ PASS]", color: "#4ade80" },
  { text: "$ outreach --send --offer-window=7d", color: "#9aff6e" },
  { text: "  › claim offer dispatched → owner@bnrpw.com  [✓ SENT]", color: "#4ade80" },
];

function TypewriterTerminal() {
  const [visible, setVisible] = useState(0);
  const [cursor, setCursor] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const t = setInterval(() => setVisible(v => { if (v >= TERM_LINES.length) { clearInterval(t); return v; } return v + 1; }), 260);
    return () => clearInterval(t);
  }, [inView]);

  useEffect(() => {
    const b = setInterval(() => setCursor(v => !v), 530);
    return () => clearInterval(b);
  }, []);

  return (
    <div ref={ref} className="bg-[#0d0d0d] border border-[#222] p-5 overflow-auto max-h-64 font-mono text-[12px] leading-[1.75]">
      <div className="font-mono text-[10px] text-[#444] uppercase tracking-wider mb-3 border-b border-[#1a1a1a] pb-2 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#ea580c]" />
        OUTBOUND-STUDIO / LIVE SEQUENCE
      </div>
      {TERM_LINES.slice(0, visible).map((line, i) => (
        <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.1 }} style={{ color: line.color }}>
          {line.text}
        </motion.div>
      ))}
      {visible < TERM_LINES.length && (
        <span className="inline-block w-2 h-[14px] bg-[#ea580c] align-middle" style={{ opacity: cursor ? 1 : 0 }} />
      )}
    </div>
  );
}

/* ── Pipeline diagram ──────────────────────────────────────────────── */
const AGENTS = [
  { n: "01", name: "Prospector", icon: Eye },
  { n: "02", name: "Strategist", icon: BarChart3 },
  { n: "03", name: "Builder", icon: Code2 },
  { n: "04", name: "Auditor", icon: CheckSquare },
  { n: "05", name: "Packager", icon: Package },
  { n: "06", name: "Persona\nTester", icon: Users },
  { n: "07", name: "Outreach", icon: SendHorizontal },
];

const AGENT_DESCS = [
  "Identifies SMBs with weak or missing web presence across verticals and geos.",
  "Audits the target site and builds the competitive pitch strategy.",
  "Generates a superior version of their site, built on spec — no charge yet.",
  "Scores the built site against 40+ AEO criteria. Loops to Builder if below threshold.",
  "Bundles the site and offer assets into a ready-to-claim package.",
  "Runs 3 ICPs against the offer. Loops to Packager if conversion rate fails.",
  "Dispatches the personalized 7-day claim sequence to the business owner.",
];

function PipelineDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="w-full overflow-x-auto py-4">
      <div className="min-w-[760px] relative">
        {/* Feedback SVG overlay */}
        <svg className="absolute inset-0 pointer-events-none overflow-visible" width="100%" height="0" style={{ top: 0 }}>
          <defs>
            <marker id="ao" markerWidth="6" markerHeight="6" refX="5" refY="2.5" orient="auto">
              <path d="M0,0 L0,5 L6,2.5 z" fill="#ea580c" />
            </marker>
          </defs>
          {/* 04 → 03 feedback */}
          <motion.path
            initial={{ pathLength: 0, opacity: 0 }} animate={inView ? { pathLength: 1, opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 1.2 }}
            d="M 466,16 C 466,-20 328,-20 328,16"
            fill="none" stroke="#ea580c" strokeWidth="1" strokeDasharray="3 3" markerEnd="url(#ao)"
          />
          {/* 06 → 05 feedback */}
          <motion.path
            initial={{ pathLength: 0, opacity: 0 }} animate={inView ? { pathLength: 1, opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 1.5 }}
            d="M 686,16 C 686,-20 548,-20 548,16"
            fill="none" stroke="#ea580c" strokeWidth="1" strokeDasharray="3 3" markerEnd="url(#ao)"
          />
        </svg>

        <div className="flex items-center mt-8">
          {AGENTS.map((a, i) => (
            <div key={a.n} className="flex items-center flex-1">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className="flex flex-col items-center shrink-0"
              >
                <div className="w-11 h-11 border border-[#282828] bg-[#0d0d0d] flex flex-col items-center justify-center gap-0.5 hover:border-[#ea580c]/50 transition-colors group">
                  <span className="font-mono text-[9px] text-[#ea580c]">{a.n}</span>
                  <a.icon className="w-3.5 h-3.5 text-[#555] group-hover:text-[#ea580c]/70 transition-colors" />
                </div>
                <span className="font-mono text-[9px] text-[#444] mt-2 text-center whitespace-pre-line leading-tight uppercase tracking-wide">
                  {a.name}
                </span>
              </motion.div>
              {i < AGENTS.length - 1 && (
                <motion.div
                  initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}}
                  transition={{ duration: 0.25, delay: i * 0.1 + 0.2 }}
                  className="h-px bg-[#282828] flex-1 mx-1.5 origin-left"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Stat card ─────────────────────────────────────────────────────── */
function Stat({ value, label, source }: { value: string; label: string; source: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.45 }}
      className="border border-[#1e1e1e] bg-[#0a0a0a] p-6"
    >
      <div className="text-[42px] font-mono text-[#ea580c] leading-none mb-3">{value}</div>
      <div className="text-sm text-[#aaa] leading-snug mb-4">{label}</div>
      <div className="font-mono text-[10px] text-[#333] uppercase tracking-wider">{source}</div>
    </motion.div>
  );
}

/* ── Pricing tier ──────────────────────────────────────────────────── */
function Tier({ name, price, period, sub, features, cta, hot }: {
  name: string; price: string; period?: string; sub?: string; features: string[]; cta: string; hot?: boolean;
}) {
  return (
    <div className={`border p-8 flex flex-col gap-6 ${hot ? "border-[#ea580c] bg-[#0c0805]" : "border-[#1e1e1e] bg-[#080808]"}`}>
      {hot && <div className="font-mono text-[10px] text-[#ea580c] uppercase tracking-widest">Most popular</div>}
      <div>
        <div className="font-mono text-[10px] text-[#555] uppercase tracking-widest mb-3">{name}</div>
        <div className="flex items-end gap-2">
          <span className="text-[40px] font-mono text-[#f0eeeb] leading-none">{price}</span>
          {period && <span className="font-mono text-sm text-[#555] mb-1">{period}</span>}
        </div>
        {sub && <div className="font-mono text-[11px] text-[#ea580c] mt-1">{sub}</div>}
      </div>
      <ul className="space-y-2 flex-1">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-[13px] text-[#888]">
            <span className="text-[#ea580c] shrink-0 font-mono mt-0.5">›</span>{f}
          </li>
        ))}
      </ul>
      <Link href="/sign-up">
        <button className={`w-full py-3 font-mono text-[11px] uppercase tracking-wider transition-colors ${
          hot ? "bg-[#ea580c] text-white hover:bg-[#c2470a]" : "border border-[#282828] text-[#666] hover:border-[#ea580c] hover:text-[#ea580c]"
        }`}>
          {cta}
        </button>
      </Link>
    </div>
  );
}

/* ── Section label ─────────────────────────────────────────────────── */
const Tag = ({ s }: { s: string }) => (
  <div className="font-mono text-[11px] uppercase tracking-widest text-[#ea580c] mb-4">{s}</div>
);

/* ── Landing Page ──────────────────────────────────────────────────── */
const LandingPage: FC = () => (
  <div data-theme="dark" className="min-h-screen bg-[#000] text-[#f0eeeb]">

    {/* Nav */}
    <header className="fixed top-0 inset-x-0 z-50 border-b border-[#1a1a1a] bg-black/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <span className="font-mono text-sm font-semibold uppercase tracking-tighter select-none">
          Outbound<span className="text-[#ea580c]">Studio</span>
        </span>
        <nav className="hidden md:flex items-center gap-8">
          {[["#pipeline", "Pipeline"], ["#aeo", "Why AEO"], ["#pricing", "Pricing"]].map(([h, l]) => (
            <a key={h} href={h} className="font-mono text-[11px] text-[#555] hover:text-[#f0eeeb] uppercase tracking-wider transition-colors">{l}</a>
          ))}
          <Link href="/skills">
            <span className="font-mono text-[11px] text-[#555] hover:text-[#f0eeeb] uppercase tracking-wider transition-colors cursor-pointer">Skills</span>
          </Link>
        </nav>
        <Link href="/sign-in">
          <button className="font-mono text-[11px] uppercase tracking-wider border border-[#282828] px-4 py-2 hover:border-[#ea580c] hover:text-[#ea580c] transition-colors flex items-center gap-1.5">
            Access Console <ChevronRight className="w-3 h-3" />
          </button>
        </Link>
      </div>
    </header>

    {/* Hero */}
    <section className="pt-40 pb-24 px-6 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
        <div className="font-mono text-[11px] text-[#ea580c] uppercase tracking-widest mb-8 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c] animate-pulse" />
          AI-Native Outbound Sales Engine · 7-Agent Crew
        </div>
        <h1 className="display-xl mb-6 max-w-4xl">
          Build the site.<br />
          <span className="text-[#ea580c]">Close the deal.</span><br />
          Before they know.
        </h1>
        <p className="text-[#f0eeeb]/40 text-[15px] font-light max-w-xl mb-12 leading-relaxed">
          A 7-agent autonomous crew that finds SMBs with weak web presence, builds a superior version of
          their site on spec, and sends a personalized 7-day claim offer. Zero upfront cost to the prospect.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-20">
          <Link href="/sign-up">
            <button className="bg-[#ea580c] text-white font-mono text-[11px] uppercase tracking-wider px-8 py-4 hover:bg-[#c2470a] transition-colors flex items-center gap-2">
              Initialize Machine <Zap className="w-3.5 h-3.5" />
            </button>
          </Link>
          <a href="#pipeline">
            <button className="border border-[#282828] text-[#f0eeeb]/50 font-mono text-[11px] uppercase tracking-wider px-8 py-4 hover:border-[#444] hover:text-[#f0eeeb]/80 transition-colors flex items-center gap-2">
              See the Pipeline <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </a>
        </div>
        <TypewriterTerminal />
      </motion.div>
    </section>

    {/* Pipeline */}
    <section id="pipeline" className="py-24 border-t border-[#111]">
      <div className="max-w-7xl mx-auto px-6">
        <Tag s="01 — Agent Pipeline" />
        <h2 className="display-text mb-4">Seven agents. One loop.</h2>
        <p className="text-[#555] text-sm font-mono mb-16 max-w-lg">
          Structured handoff contracts. Feedback loops ensure quality gates before advancing.
        </p>
        <PipelineDiagram />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#111] mt-16 border border-[#111]">
          {AGENTS.map((a, i) => (
            <motion.div key={a.n}
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="bg-[#000] p-5 flex flex-col gap-2"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-[#ea580c] text-sm">{a.n}</span>
                <a.icon className="w-3.5 h-3.5 text-[#333]" />
              </div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-[#f0eeeb]">{a.name.replace("\n", " ")}</div>
              <p className="text-[#555] text-[12px] leading-relaxed">{AGENT_DESCS[i]}</p>
            </motion.div>
          ))}
          <div className="bg-[#000] p-5 hidden lg:block" />
        </div>
      </div>
    </section>

    {/* AEO */}
    <section id="aeo" className="py-24 border-t border-[#111]">
      <div className="max-w-7xl mx-auto px-6">
        <Tag s="02 — The AEO Thesis" />
        <h2 className="display-text mb-4 max-w-3xl">Google is losing.<br /><span className="text-[#ea580c]">AI search is winning.</span></h2>
        <p className="text-[#555] text-sm font-mono mb-16 max-w-xl leading-relaxed">
          Answer Engine Optimization is the new SEO. Businesses without structured data, clear entity pages, and
          machine-readable content won't be cited by ChatGPT or Perplexity. We build the site that gets cited.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <Stat value="900M+" label="Weekly active users on ChatGPT — more than many countries' total Google search volume" source="OpenAI · 2025" />
          <Stat value="37%" label="Of consumers now use AI assistants as their primary tool for local business discovery" source="BrightLocal · 2025" />
          <Stat value="−24%" label="Decline in Google organic clicks for local service businesses since AI Overview rollout" source="SparkToro · 2026" />
        </div>
        <div className="border border-[#1e1e1e] bg-[#080808] p-8">
          <div className="font-mono text-[10px] text-[#ea580c] uppercase tracking-widest mb-3">The opportunity</div>
          <p className="text-[#888] leading-relaxed max-w-3xl text-sm">
            90% of SMBs have no structured data markup, no AEO-optimized copy, and no machine-readable entity pages.
            When a ChatGPT user asks "best power washing company in Houston" — those businesses don't exist in the answer.
            Outbound Studio finds them, builds the site that does exist, and offers it to them before any competitor does.
          </p>
        </div>
      </div>
    </section>

    {/* Pricing */}
    <section id="pricing" className="py-24 border-t border-[#111]">
      <div className="max-w-7xl mx-auto px-6">
        <Tag s="03 — Pricing" />
        <h2 className="display-text mb-4">Pay for results.</h2>
        <p className="text-[#555] text-sm font-mono mb-16 max-w-md">No retainers. No seat fees. We succeed when you succeed.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Tier name="Starter" price="$297" period="/mo"
            features={["50 leads prospected/month","10 sites built on spec","5-email claim sequence","Basic AEO optimization","Email support"]}
            cta="Start free trial" />
          <Tier name="Operator" price="$897" period="/mo" sub="+ 15% of closed deal value" hot
            features={["250 leads prospected/month","50 sites built on spec","Full 7-day claim sequence","Advanced AEO + schema markup","Persona testing (3 ICPs/lead)","Priority support + Slack"]}
            cta="Access console" />
          <Tier name="Agency" price="Custom"
            features={["Unlimited leads","White-label output","Custom agent configs","API + webhook events","Dedicated success manager","SLA + compliance"]}
            cta="Book a call" />
        </div>
      </div>
    </section>

    {/* Capabilities card grid */}
    <section id="skills" className="py-24 border-t border-[#111]">
      <div className="max-w-7xl mx-auto px-6">
        <Tag s="04 — Capabilities" />
        <h2 className="display-text mb-4">Modular agent skills.</h2>
        <p className="text-[#555] text-sm font-mono mb-14 max-w-xl leading-relaxed">
          Each agent is powered by a discrete, composable skill module. All 19 skills are fully documented and publicly available.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#111] border border-[#111] mb-10">
          {[
            {
              label: "Hyper-Local Prospecting",
              desc: "Find SMBs with weak web presence in any city, metro, or custom radius. Multi-source scoring filters to the highest-opportunity targets.",
              tag: "discovery",
            },
            {
              label: "Competitive Intelligence",
              desc: "Map the local competitive landscape — page-one rankings, review scores, site quality — and identify the fastest path to category leadership.",
              tag: "strategy",
            },
            {
              label: "AEO-Optimized Build",
              desc: "Generate replacement sites with full LocalBusiness, Service, and FAQPage schema. Structured to win AI Overview and Perplexity citations.",
              tag: "build",
            },
            {
              label: "Technical SEO Audit",
              desc: "230+ rule scan covering crawl errors, Core Web Vitals, missing structured data, and indexing gaps. Produces a scored improvement brief.",
              tag: "audit",
            },
            {
              label: "Programmatic Pages at Scale",
              desc: "Stamp out location × service page variants from a single template. Each page gets its own JSON-LD, canonical URL, and optimized copy.",
              tag: "scale",
            },
            {
              label: "Personalized Claim Sequences",
              desc: "7-day email cadences written from the full context stack — audit score diff, competitor gap, and business-specific data. Zero boilerplate.",
              tag: "outreach",
            },
          ].map((cap) => (
            <div key={cap.label} className="bg-[#000] p-7 flex flex-col gap-3">
              <div className="font-mono text-[9px] uppercase tracking-widest text-[#ea580c]">{cap.tag}</div>
              <div className="font-mono text-[11px] uppercase tracking-wider text-[#f0eeeb]">{cap.label}</div>
              <p className="text-[#555] text-[12px] leading-relaxed flex-1">{cap.desc}</p>
            </div>
          ))}
        </div>

        <Link href="/skills">
          <button className="border border-[#282828] text-[#666] font-mono text-[11px] uppercase tracking-wider px-8 py-4 hover:border-[#ea580c] hover:text-[#ea580c] transition-colors flex items-center gap-2">
            Browse Full Skills Directory — 19 modules <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </Link>
      </div>
    </section>

    {/* Footer */}
    <footer className="border-t border-[#111] py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="font-mono text-sm font-semibold uppercase tracking-tighter mb-1">
            Outbound<span className="text-[#ea580c]">Studio</span>
          </div>
          <div className="font-mono text-[10px] text-[#333] uppercase tracking-wider">AI-Native Outbound Sales · v2.0</div>
        </div>
        <div className="flex gap-8">
          <Link href="/skills"><span className="font-mono text-[11px] text-[#444] uppercase tracking-wider hover:text-[#ea580c] cursor-pointer transition-colors">Skills</span></Link>
          <Link href="/sign-in"><span className="font-mono text-[11px] text-[#444] uppercase tracking-wider hover:text-[#ea580c] cursor-pointer transition-colors">Console</span></Link>
          <a href="#pipeline" className="font-mono text-[11px] text-[#444] uppercase tracking-wider hover:text-[#ea580c] transition-colors">Pipeline</a>
        </div>
        <div className="font-mono text-[10px] text-[#2a2a2a] uppercase">© 2026 Outbound Studio</div>
      </div>
    </footer>
  </div>
);

export default LandingPage;
