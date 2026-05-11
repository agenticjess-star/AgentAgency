import { FC, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useGetRun } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { ArrowLeft, ExternalLink, Terminal, ChevronDown, ChevronUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusPill } from "@/components/ui/status-pill";
import { cn } from "@/lib/utils";

const AGENT_STAGES = [
  "prospector", "strategist", "builder", "auditor", "packager", "persona_tester", "outreach",
];
const STAGE_LABELS = ["01", "02", "03", "04", "05", "06", "07"];

function AgentProgress({ currentAgent, status }: { currentAgent: string; status: string }) {
  const currentIdx = AGENT_STAGES.indexOf(currentAgent.toLowerCase().replace(/ /g, "_"));
  const isDone = status === "completed" || status === "won";

  return (
    <div className="flex items-center gap-0 overflow-x-auto py-1">
      {AGENT_STAGES.map((stage, i) => {
        const done = isDone || i < currentIdx;
        const active = i === currentIdx && !isDone;
        return (
          <div key={stage} className="flex items-center shrink-0">
            <div
              className={cn(
                "w-9 h-9 flex flex-col items-center justify-center font-mono border transition-all",
                done
                  ? "border-emerald-500/40 bg-emerald-950/20 text-emerald-500"
                  : active
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border bg-background text-secondary-foreground/30"
              )}
              title={stage.replace(/_/g, " ")}
            >
              <span className="text-[10px]">{STAGE_LABELS[i]}</span>
            </div>
            {i < AGENT_STAGES.length - 1 && (
              <div className={cn("w-5 h-px shrink-0", done ? "bg-emerald-500/30" : "bg-border")} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── SVG Audit Ring ─────────────────────────────────────────────────── */
function AuditRing({ score }: { score: number }) {
  const radius = 34;
  const circ = 2 * Math.PI * radius;
  const dashOffset = circ - (score / 100) * circ;
  const color = score >= 80 ? "#4ade80" : score >= 60 ? "#f59e0b" : "#ef4444";

  return (
    <div className="relative w-[84px] h-[84px] shrink-0">
      <svg viewBox="0 0 80 80" className="w-full h-full" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="40" cy="40" r={radius} fill="none" strokeWidth="5" stroke="var(--muted)" />
        <circle
          cx="40" cy="40" r={radius}
          fill="none" strokeWidth="5"
          stroke={color}
          strokeDasharray={`${circ}`}
          strokeDashoffset={`${dashOffset}`}
          strokeLinecap="square"
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-lg tabular-nums leading-none" style={{ color }}>{score}</span>
        <span className="font-mono text-[9px] text-secondary-foreground uppercase mt-0.5">/100</span>
      </div>
    </div>
  );
}

/* ── Collapsible email panel ────────────────────────────────────────── */
function CollapsiblePanel({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border border-border bg-card">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-5 py-3.5 border-b border-border flex items-center justify-between hover:bg-muted/30 transition-colors"
      >
        <span className="mono-label">{title}</span>
        {open ? (
          <ChevronUp className="w-3.5 h-3.5 text-secondary-foreground" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-secondary-foreground" />
        )}
      </button>
      {open && children}
    </div>
  );
}

const RunDetailPage: FC = () => {
  const params = useParams();
  const id = parseInt(params.id || "0");
  const { data: run, isLoading } = useGetRun(id);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-5">
          <Skeleton className="w-36 h-4" />
          <Skeleton className="w-52 h-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Skeleton className="lg:col-span-2 h-[480px]" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!run) return null;

  return (
    <DashboardLayout>
      <div className="space-y-5">

        <div>
          <Link href="/runs" className="inline-flex items-center gap-1.5 font-mono text-[10px] text-secondary-foreground hover:text-foreground uppercase tracking-wider mb-4 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Runs
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-start gap-4 justify-between">
            <div>
              <h1 className="heading-lg mb-1.5">Sequence #{run.id}</h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[12px] text-secondary-foreground">
                <Link href={`/leads/${run.leadId}`} className="hover:text-accent transition-colors underline underline-offset-2">
                  {run.businessName || `Lead ${run.leadId}`}
                </Link>
                <span className="text-border hidden sm:inline">·</span>
                <span className="whitespace-nowrap">
                  {new Date(run.createdAt).toLocaleString("en-US", {
                    month: "short", day: "numeric", year: "numeric",
                    hour: "2-digit", minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <StatusPill status={run.status} />
              <div className="px-3 py-1.5 border border-border font-mono text-[10px] uppercase tracking-wider text-secondary-foreground bg-card whitespace-nowrap">
                Stage: <span className="text-foreground ml-1">{run.currentAgent.replace(/_/g, " ")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Agent progress strip */}
        <div className="border border-border bg-card px-5 py-4">
          <div className="mono-label mb-3">Agent Progress</div>
          <AgentProgress currentAgent={run.currentAgent} status={run.status} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Main: terminal + email */}
          <div className="lg:col-span-2 space-y-4">

            {/* Telemetry terminal */}
            <div className="border border-border overflow-hidden flex flex-col h-[420px]">
              <div className="px-5 py-3.5 border-b border-[#2a2a2a] bg-[#0d0d0d] flex items-center gap-2 shrink-0">
                <Terminal className="w-3.5 h-3.5 text-[#ea580c]" />
                <span className="font-mono text-[10px] text-[#666] uppercase tracking-wider">Agent Telemetry</span>
                <div className="ml-auto flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                </div>
              </div>
              <div className="flex-1 bg-[#0d0d0d] text-[#a8b0a0] p-5 font-mono text-[12px] overflow-auto whitespace-pre-wrap leading-[1.7]">
                {run.agentLogs || "> Sequence initialized...\n> Awaiting agent telemetry...\n> "}
              </div>
            </div>

            {/* Email draft — collapsible */}
            {run.emailDraft && (
              <CollapsiblePanel title="Generated Outreach Asset">
                <div className="p-5 text-[13px] leading-relaxed whitespace-pre-wrap font-sans text-foreground">
                  {run.emailDraft}
                </div>
              </CollapsiblePanel>
            )}
          </div>

          {/* Side: artifacts */}
          <div className="space-y-4">
            <div className="border border-border bg-card">
              <div className="px-5 py-3.5 border-b border-border">
                <span className="mono-label">Artifacts</span>
              </div>
              <div className="p-5 space-y-5">

                {/* Audit score as progress ring */}
                {run.auditScore != null && (
                  <div>
                    <div className="mono-label mb-3">Audit Score</div>
                    <div className="flex items-center gap-4">
                      <AuditRing score={run.auditScore} />
                      <div>
                        <div className={cn(
                          "font-mono text-[11px] uppercase tracking-wider",
                          run.auditScore >= 80 ? "text-emerald-500" :
                          run.auditScore >= 60 ? "text-amber-500" : "text-red-500"
                        )}>
                          {run.auditScore >= 80 ? "Passed" : run.auditScore >= 60 ? "Marginal" : "Failed"}
                        </div>
                        <div className="text-[12px] text-secondary-foreground mt-1">
                          {run.auditScore >= 70
                            ? "Ready for packaging"
                            : "Revision required"}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Live deployment */}
                <div>
                  <div className="mono-label mb-2">Live Deployment</div>
                  {run.siteUrl ? (
                    <a
                      href={run.siteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 p-3 border border-border bg-background font-mono text-[11px] text-secondary-foreground hover:border-accent hover:text-accent transition-colors group"
                    >
                      <span className="flex-1 truncate">{run.siteUrl}</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0 group-hover:text-accent" />
                    </a>
                  ) : (
                    <div className="p-3 border border-dashed border-border text-secondary-foreground font-mono text-[11px]">
                      Site artifact pending...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RunDetailPage;
