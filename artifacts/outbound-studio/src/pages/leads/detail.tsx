import { FC } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useGetLead, useCreateRun, getGetLeadQueryKey, useListRuns } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/ui/status-pill";
import { ArrowLeft, Play, ExternalLink, User, Mail, Phone, Tag } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const LeadDetailPage: FC = () => {
  const params = useParams();
  const id = parseInt(params.id || "0");
  const qc = useQueryClient();

  const { data: lead, isLoading } = useGetLead(id);
  const { data: runs } = useListRuns();
  const leadRuns = runs?.filter((r) => r.leadId === id) ?? [];
  const createRun = useCreateRun();

  const handleStartRun = () => {
    createRun.mutate({ data: { leadId: id } }, {
      onSuccess: () => {
        toast.success("Pipeline sequence initiated");
        qc.invalidateQueries({ queryKey: getGetLeadQueryKey(id) });
      },
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-5">
          <Skeleton className="w-40 h-5" />
          <Skeleton className="w-64 h-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Skeleton className="lg:col-span-2 h-80" />
            <Skeleton className="h-48" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!lead) return null;

  return (
    <DashboardLayout>
      <div className="space-y-5">

        {/* Back + header */}
        <div>
          <Link href="/leads" className="inline-flex items-center gap-1.5 font-mono text-[10px] text-secondary-foreground hover:text-foreground uppercase tracking-wider mb-4 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Leads
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-start gap-4 justify-between">
            <div>
              <h1 className="heading-lg">{lead.businessName}</h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-secondary-foreground font-mono mt-1.5">
                <span>{lead.vertical}</span>
                <span className="hidden sm:inline text-border">·</span>
                <span>{lead.geo}</span>
                {lead.domain && (
                  <>
                    <span className="hidden sm:inline text-border">·</span>
                    <a href={`https://${lead.domain}`} target="_blank" rel="noreferrer"
                      className="flex items-center gap-1 hover:text-accent transition-colors">
                      {lead.domain} <ExternalLink className="w-3 h-3" />
                    </a>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <StatusPill status={lead.status} />
              <Button
                onClick={handleStartRun}
                disabled={createRun.isPending}
                className="bg-accent hover:bg-accent/90 text-white rounded-none font-mono text-[10px] uppercase tracking-wider gap-1.5"
              >
                <Play className="w-3.5 h-3.5" /> Execute Sequence
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left col */}
          <div className="lg:col-span-2 space-y-4">

            {/* Contact intel */}
            <div className="border border-border bg-card">
              <div className="px-5 py-3.5 border-b border-border">
                <span className="mono-label">Contact Intel</span>
              </div>
              <div className="p-5 grid grid-cols-2 gap-x-8 gap-y-4">
                {[
                  { icon: User, label: "Name", value: lead.contactName || "Unresolved" },
                  { icon: Mail, label: "Email", value: lead.contactEmail || "Unresolved" },
                  { icon: Phone, label: "Phone", value: lead.contactPhone || "Unresolved" },
                  { icon: Tag, label: "Opportunity", value: lead.opportunityTag.replace(/_/g, " "), accent: true },
                ].map(({ icon: Icon, label, value, accent }) => (
                  <div key={label}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <Icon className="w-3 h-3 text-secondary-foreground" />
                      <span className="mono-label">{label}</span>
                    </div>
                    <div className={`text-sm font-mono ${accent ? "text-accent" : "text-foreground"}`}>{value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pipeline runs */}
            <div className="border border-border bg-card">
              <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
                <span className="mono-label">Pipeline Runs</span>
                <span className="font-mono text-[10px] text-secondary-foreground">{leadRuns.length} sequences</span>
              </div>
              {leadRuns.length === 0 ? (
                <div className="py-10 text-center font-mono text-xs text-secondary-foreground">
                  No sequences executed.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left op-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Status</th>
                        <th className="hidden sm:table-cell">Stage</th>
                        <th className="text-right">Log</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leadRuns.map((run) => (
                        <tr key={run.id}>
                          <td className="font-mono text-[11px] text-secondary-foreground whitespace-nowrap">
                            {new Date(run.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" })}
                          </td>
                          <td><StatusPill status={run.status} /></td>
                          <td className="hidden sm:table-cell font-mono text-[11px] text-secondary-foreground capitalize">
                            {run.currentAgent.replace(/_/g, " ")}
                          </td>
                          <td className="text-right">
                            <Link href={`/runs/${run.id}`}>
                              <Button variant="ghost" size="sm" className="font-mono text-[10px] uppercase h-7 px-2">
                                Open
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Right col — metadata */}
          <div className="border border-border bg-card h-fit">
            <div className="px-5 py-3.5 border-b border-border">
              <span className="mono-label">Metadata</span>
            </div>
            <div className="p-5 space-y-3 font-mono text-[12px]">
              {[
                ["ID", String(lead.id)],
                ["Created", new Date(lead.createdAt).toLocaleDateString()],
                ["Opportunity", lead.opportunityTag.replace(/_/g, " ")],
                ["Site Artifact", lead.siteUrl ? "Generated" : "Pending"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 pb-3 border-b border-border last:border-0 last:pb-0">
                  <span className="text-secondary-foreground">{k}</span>
                  <span className="text-foreground text-right">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LeadDetailPage;
