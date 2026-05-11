import { FC } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useListRuns } from "@workspace/api-client-react";
import { Link } from "wouter";
import { ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusPill } from "@/components/ui/status-pill";
import { Button } from "@/components/ui/button";

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

        <div className="border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left op-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Target</th>
                  <th>Status</th>
                  <th className="hidden md:table-cell">Stage</th>
                  <th className="hidden lg:table-cell">Audit</th>
                  <th className="text-right">Console</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i}>
                      <td><Skeleton className="h-4 w-24" /></td>
                      <td><Skeleton className="h-4 w-32" /></td>
                      <td><Skeleton className="h-5 w-20" /></td>
                      <td className="hidden md:table-cell"><Skeleton className="h-4 w-24" /></td>
                      <td className="hidden lg:table-cell"><Skeleton className="h-4 w-12" /></td>
                      <td />
                    </tr>
                  ))
                ) : runs?.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center font-mono text-xs text-secondary-foreground">
                      No sequences executed yet.
                    </td>
                  </tr>
                ) : (
                  runs?.map((run) => (
                    <tr key={run.id}>
                      <td className="font-mono text-[11px] text-secondary-foreground whitespace-nowrap">
                        {new Date(run.createdAt).toLocaleString("en-US", {
                          month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                        })}
                      </td>
                      <td>
                        <div className="font-medium text-[13px]">{run.businessName || `Lead #${run.leadId}`}</div>
                        <div className="font-mono text-[10px] text-secondary-foreground mt-0.5">#{run.id}</div>
                      </td>
                      <td><StatusPill status={run.status} /></td>
                      <td className="hidden md:table-cell font-mono text-[11px] text-secondary-foreground capitalize">
                        {run.currentAgent.replace(/_/g, " ")}
                      </td>
                      <td className="hidden lg:table-cell font-mono text-[12px]">
                        {run.auditScore != null ? (
                          <span className={run.auditScore >= 80 ? "text-emerald-600" : run.auditScore >= 60 ? "text-amber-600" : "text-red-600"}>
                            {run.auditScore}<span className="text-secondary-foreground text-[10px]">/100</span>
                          </span>
                        ) : (
                          <span className="text-secondary-foreground">—</span>
                        )}
                      </td>
                      <td className="text-right">
                        <Link href={`/runs/${run.id}`}>
                          <Button variant="ghost" size="sm" className="font-mono text-[10px] uppercase tracking-wider text-secondary-foreground hover:text-foreground h-7 px-2 gap-1">
                            Open <ChevronRight className="w-3 h-3" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RunsPage;
