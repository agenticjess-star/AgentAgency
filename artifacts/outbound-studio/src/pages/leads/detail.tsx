import { FC } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useGetLead, useUpdateLead, useCreateRun, getGetLeadQueryKey, useListRuns } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/ui/status-pill";
import { ArrowLeft, Play, ExternalLink } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const LeadDetailPage: FC = () => {
  const params = useParams();
  const id = parseInt(params.id || "0");
  const qc = useQueryClient();

  const { data: lead, isLoading } = useGetLead(id);
  const { data: runs } = useListRuns();
  
  const leadRuns = runs?.filter(r => r.leadId === id) || [];
  
  const createRun = useCreateRun();

  const handleStartRun = () => {
    createRun.mutate({ data: { leadId: id } }, {
      onSuccess: () => {
        toast.success("Pipeline sequence initiated");
        qc.invalidateQueries({ queryKey: getGetLeadQueryKey(id) });
        // Would also invalidate runs list
      }
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <Skeleton className="w-48 h-8 mb-8" />
        <div className="grid grid-cols-3 gap-6">
          <Skeleton className="col-span-2 h-96" />
          <Skeleton className="col-span-1 h-96" />
        </div>
      </DashboardLayout>
    );
  }

  if (!lead) return null;

  return (
    <DashboardLayout>
      <div className="mb-6">
        <Link href="/leads" className="text-secondary-foreground hover:text-foreground font-mono text-xs uppercase flex items-center gap-2 inline-flex mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Registry
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="heading-lg mb-2">{lead.businessName}</h1>
            <div className="flex items-center gap-4 text-sm text-secondary-foreground font-mono">
              <span>{lead.vertical}</span>
              <span>•</span>
              <span>{lead.geo}</span>
              {lead.domain && (
                <>
                  <span>•</span>
                  <a href={`https://${lead.domain}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-foreground">
                    {lead.domain} <ExternalLink className="w-3 h-3" />
                  </a>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <StatusPill status={lead.status} />
            <Button 
              onClick={handleStartRun} 
              disabled={createRun.isPending}
              className="bg-accent hover:bg-accent/90 text-white rounded-none font-mono uppercase text-xs tracking-wider"
            >
              <Play className="w-4 h-4 mr-2" /> Execute Sequence
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <div className="border border-border bg-card">
            <div className="p-4 border-b border-border font-mono text-sm uppercase tracking-wider text-secondary-foreground">
              Contact Intel
            </div>
            <div className="p-6 grid grid-cols-2 gap-6">
              <div>
                <div className="text-xs font-mono text-secondary-foreground uppercase mb-1">Name</div>
                <div className="text-sm">{lead.contactName || "Unresolved"}</div>
              </div>
              <div>
                <div className="text-xs font-mono text-secondary-foreground uppercase mb-1">Email</div>
                <div className="text-sm font-mono">{lead.contactEmail || "Unresolved"}</div>
              </div>
              <div>
                <div className="text-xs font-mono text-secondary-foreground uppercase mb-1">Phone</div>
                <div className="text-sm font-mono">{lead.contactPhone || "Unresolved"}</div>
              </div>
              <div>
                <div className="text-xs font-mono text-secondary-foreground uppercase mb-1">Opportunity</div>
                <div className="text-sm font-mono text-accent">{lead.opportunityTag.replace(/_/g, " ")}</div>
              </div>
            </div>
          </div>

          <div className="border border-border bg-card">
            <div className="p-4 border-b border-border font-mono text-sm uppercase tracking-wider text-secondary-foreground">
              Pipeline Runs
            </div>
            <div className="p-0">
              {leadRuns.length === 0 ? (
                <div className="p-8 text-center text-sm font-mono text-secondary-foreground">
                  No sequences executed.
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <tbody>
                    {leadRuns.map(run => (
                      <tr key={run.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                        <td className="p-4 font-mono text-xs text-secondary-foreground">
                          {new Date(run.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <StatusPill status={run.status} />
                        </td>
                        <td className="p-4 text-sm font-mono">
                          {run.currentAgent}
                        </td>
                        <td className="p-4 text-right">
                          <Link href={`/runs/${run.id}`}>
                            <Button variant="ghost" size="sm" className="font-mono text-xs uppercase">Log</Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        <div className="border border-border bg-card h-fit">
          <div className="p-4 border-b border-border font-mono text-sm uppercase tracking-wider text-secondary-foreground">
            Metadata
          </div>
          <div className="p-4 space-y-4 text-sm font-mono">
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-secondary-foreground">ID</span>
              <span>{lead.id}</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-secondary-foreground">Created</span>
              <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-secondary-foreground">Site URL</span>
              <span>{lead.siteUrl ? "Generated" : "Pending"}</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LeadDetailPage;
