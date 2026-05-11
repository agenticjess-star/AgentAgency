import { FC } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useListRuns } from "@workspace/api-client-react";
import { Link } from "wouter";
import { ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusPill } from "@/components/ui/status-pill";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STAGES = ["prospector", "strategist", "builder", "auditor", "packager", "persona_tester", "outreach"];
const STAGE_LABELS = ["01", "02", "03", "04", "05", "06", "07"];

function MiniProgress({ currentAgent, status }: { currentAgent: string; status: string }) {
  const isDone = status === "completed" || status === "won";
  const currentIdx = STAGES.indexOf(currentAgent.toLowerCase().replace(/ /g, "_"));

  return (
    <div className="flex items-center gap-0">
      {STAGES.map((stage, i) => {
        const done = isDone || i < currentIdx;
        const active = !isDone && i === currentIdx;
        return (
          <div key={stage} className="flex items-center">
            <div
              className={cn(
                "w-6 h-6 flex items-center justify-center font-mono text-[9px] border shrink-0 transition-all",
                done
                  ? "border-emerald-500/40 bg-emerald-950/30 text-emerald-500"
                  : active
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border bg-background text-muted-foreground/40"
              )}
              title={stage.replace(/_/g, " ")}
            >
              {STAGE_LABELS[i]}
            </div>
            {i < STAGES.length - 1 && (
              <div className={cn("w-2 h-px shrink-0", done ? "bg-emerald-500/30" : "bg-border")} />
            )}
          </div>
        );
      })}
    </div>
  );
}

const RunsPage: FC = () => {
  const { data: runs, isLoading } = useListRuns();

  return (
    <DashboardLayout>
      <div className="space-y-5">

        <div className="flex items-start justify-between">
          <div>
            <h1 className="heading-lg">Pipeline Runs</h1>
            <p className="caption mt-0.5">{runs?.length ?? 0} sequences in log</p>
          </div>
        </div>

        {/* Timeline strip */}
        <div className="border border-border bg-card divide-y divide-border">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <Skeleton className="h-6 w-56" />
              </div>
            ))
          ) : !runs?.length ? (
            <div className="py-14 text-center font-mono text-xs text-secondary-foreground">
              No sequences executed yet.
            </div>
          ) : (
            runs.map((run) => (
              <div key={run.id} className="p-4 hover:bg-muted/20 transition-colors group">
                <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                  {/* Left: meta */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                      <span className="font-medium text-[13px] truncate max-w-[200px]">
                        {run.businessName || `Lead #${run.leadId}`}
                      </span>
                      <StatusPill status={run.status} />
                      {run.auditScore != null && (
                        <span className={cn(
                          "font-mono text-[10px] tabular-nums",
                          run.auditScore >= 80 ? "text-emerald-600" : run.auditScore >= 60 ? "text-amber-600" : "text-red-500"
                        )}>
                          {run.auditScore}/100
                        </span>
                      )}
                    </div>
                    <div className="font-mono text-[10px] text-secondary-foreground mb-3 flex items-center gap-3">
                      <span>#{run.id}</span>
                      <span className="text-border">·</span>
                      <span>
                        {new Date(run.createdAt).toLocaleString("en-US", {
                          month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                        })}
                      </span>
                    </div>
                    {/* Agent progress strip */}
                    <MiniProgress currentAgent={run.currentAgent} status={run.status} />
                    <div className="font-mono text-[10px] text-secondary-foreground mt-1.5 capitalize">
                      Current: <span className="text-foreground">{run.currentAgent.replace(/_/g, " ")}</span>
                    </div>
                  </div>

                  {/* Right: action */}
                  <div className="shrink-0 flex items-start pt-0.5">
                    <Link href={`/runs/${run.id}`}>
                      <Button variant="ghost" size="sm" className="font-mono text-[10px] uppercase tracking-wider text-secondary-foreground hover:text-foreground h-7 px-2 gap-1 group-hover:text-foreground">
                        Console <ChevronRight className="w-3 h-3" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RunsPage;
