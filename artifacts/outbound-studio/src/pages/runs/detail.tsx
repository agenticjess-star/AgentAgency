import { FC } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useGetRun } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { ArrowLeft, ExternalLink, Terminal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusPill } from "@/components/ui/status-pill";

const AGENT_STAGES = [
  "prospector", "strategist", "builder", "auditor", "packager", "persona_tester", "outreach",
];

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
              className={`pipeline-node w-8 h-8 text-[10px] ${
                done ? "completed" : active ? "active" : ""
              }`}
              title={stage.replace(/_/g, " ")}
            >
              {String(i + 1).padStart(2, "0")}
            </div>
            {i < AGENT_STAGES.length - 1 && (
              <div className={`w-6 h-px ${done ? "bg-emerald-500/40" : "bg-border"}`} />
            )}
          </div>
        );
      })}
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

        {/* Agent progress bar */}
        <div className="border border-border bg-card px-5 py-4">
          <div className="mono-label mb-3">Agent Progress</div>
          <AgentProgress currentAgent={run.currentAgent} status={run.status} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Main — terminal + email */}
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

            {run.emailDraft && (
              <div className="border border-border bg-card">
                <div className="px-5 py-3.5 border-b border-border">
                  <span className="mono-label">Generated Outreach Asset</span>
                </div>
                <div className="p-5 text-[13px] leading-relaxed whitespace-pre-wrap font-sans text-foreground">
                  {run.emailDraft}
                </div>
              </div>
            )}
          </div>

          {/* Side — artifacts */}
          <div className="space-y-4">
            <div className="border border-border bg-card">
              <div className="px-5 py-3.5 border-b border-border">
                <span className="mono-label">Artifacts</span>
              </div>
              <div className="p-5 space-y-5">
                {run.auditScore != null && (
                  <div>
                    <div className="mono-label mb-2">Audit Score</div>
                    <div className="flex items-end gap-2">
                      <span
                        className={`text-[42px] font-mono leading-none tabular-nums ${
                          run.auditScore >= 80 ? "text-emerald-500" :
                          run.auditScore >= 60 ? "text-amber-500" : "text-red-500"
                        }`}
                      >
                        {run.auditScore}
                      </span>
                      <span className="text-secondary-foreground font-mono text-sm mb-1">/100</span>
                    </div>
                    <div className="w-full bg-muted h-1 mt-3">
                      <div
                        className={`h-1 transition-all ${
                          run.auditScore >= 80 ? "bg-emerald-500" :
                          run.auditScore >= 60 ? "bg-amber-500" : "bg-red-500"
                        }`}
                        style={{ width: `${run.auditScore}%` }}
                      />
                    </div>
                  </div>
                )}

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
