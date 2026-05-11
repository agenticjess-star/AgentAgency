import { FC } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useGetRun } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { ArrowLeft, ExternalLink, Terminal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusPill } from "@/components/ui/status-pill";

const RunDetailPage: FC = () => {
  const params = useParams();
  const id = parseInt(params.id || "0");
  
  const { data: run, isLoading } = useGetRun(id);

  if (isLoading) {
    return (
      <DashboardLayout>
        <Skeleton className="w-48 h-8 mb-8" />
        <Skeleton className="w-full h-[500px]" />
      </DashboardLayout>
    );
  }

  if (!run) return null;

  return (
    <DashboardLayout>
      <div className="mb-6">
        <Link href="/runs" className="text-secondary-foreground hover:text-foreground font-mono text-xs uppercase flex items-center gap-2 inline-flex mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Execution Log
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="heading-lg mb-2">Sequence #{run.id}</h1>
            <div className="flex items-center gap-4 text-sm text-secondary-foreground font-mono">
              <Link href={`/leads/${run.leadId}`} className="hover:text-foreground underline underline-offset-2">
                Target: {run.businessName || `Lead ${run.leadId}`}
              </Link>
              <span>•</span>
              <span>{new Date(run.createdAt).toLocaleString()}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <StatusPill status={run.status} />
            <div className="px-3 py-1 border border-border bg-card font-mono text-xs uppercase">
              Stage: <span className="text-foreground ml-1">{run.currentAgent.replace(/_/g, " ")}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <div className="border border-border bg-card flex flex-col h-[500px]">
            <div className="p-4 border-b border-border font-mono text-sm uppercase tracking-wider text-secondary-foreground flex items-center gap-2 bg-[#1a1b26] text-gray-400">
              <Terminal className="w-4 h-4" /> Agent Telemetry
            </div>
            <div className="flex-1 bg-[#1a1b26] text-[#a9b1d6] p-4 font-mono text-sm overflow-auto whitespace-pre-wrap leading-relaxed">
              {run.agentLogs || "> Sequence initialized...\n> Awaiting agent telemetry..."}
            </div>
          </div>

          {run.emailDraft && (
            <div className="border border-border bg-card">
              <div className="p-4 border-b border-border font-mono text-sm uppercase tracking-wider text-secondary-foreground">
                Generated Outreach Asset
              </div>
              <div className="p-6 font-sans text-sm whitespace-pre-wrap">
                {run.emailDraft}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-8">
          <div className="border border-border bg-card">
            <div className="p-4 border-b border-border font-mono text-sm uppercase tracking-wider text-secondary-foreground">
              Artifacts
            </div>
            <div className="p-4 space-y-4">
              {run.siteUrl ? (
                <div>
                  <div className="text-xs font-mono text-secondary-foreground uppercase mb-2">Live Deployment</div>
                  <a href={run.siteUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-3 bg-muted/50 border border-border text-sm hover:border-accent hover:text-accent transition-colors">
                    {run.siteUrl} <ExternalLink className="w-4 h-4 ml-auto" />
                  </a>
                </div>
              ) : (
                <div className="text-sm text-secondary-foreground font-mono italic">
                  Site artifact pending...
                </div>
              )}

              {run.auditScore !== null && (
                <div className="pt-4 border-t border-border">
                  <div className="text-xs font-mono text-secondary-foreground uppercase mb-2">Audit Score</div>
                  <div className="text-3xl font-mono text-accent">
                    {run.auditScore}<span className="text-sm text-secondary-foreground">/100</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RunDetailPage;
