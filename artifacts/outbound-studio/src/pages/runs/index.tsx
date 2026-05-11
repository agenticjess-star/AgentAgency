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
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="heading-lg">Pipeline Runs</h1>
        </div>

        <div className="border border-border bg-card">
          <div className="w-full overflow-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border font-mono text-xs uppercase text-secondary-foreground">
                  <th className="p-4 font-normal">Timestamp</th>
                  <th className="p-4 font-normal">Target</th>
                  <th className="p-4 font-normal">Status</th>
                  <th className="p-4 font-normal">Current Stage</th>
                  <th className="p-4 font-normal text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i} className="border-b border-border">
                      <td className="p-4"><Skeleton className="h-5 w-24" /></td>
                      <td className="p-4"><Skeleton className="h-5 w-32" /></td>
                      <td className="p-4"><Skeleton className="h-5 w-24" /></td>
                      <td className="p-4"><Skeleton className="h-5 w-24" /></td>
                      <td className="p-4"></td>
                    </tr>
                  ))
                ) : runs?.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-secondary-foreground font-mono text-sm">
                      No sequences executed.
                    </td>
                  </tr>
                ) : (
                  runs?.map(run => (
                    <tr key={run.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="p-4 font-mono text-xs text-secondary-foreground">
                        {new Date(run.createdAt).toLocaleString()}
                      </td>
                      <td className="p-4 font-medium text-sm">
                        {run.businessName || `Lead #${run.leadId}`}
                      </td>
                      <td className="p-4">
                        <StatusPill status={run.status} />
                      </td>
                      <td className="p-4 font-mono text-sm capitalize">
                        {run.currentAgent.replace(/_/g, " ")}
                      </td>
                      <td className="p-4 text-right">
                        <Link href={`/runs/${run.id}`}>
                          <Button variant="ghost" size="sm" className="font-mono text-xs uppercase text-secondary-foreground hover:text-foreground">
                            Console <ChevronRight className="w-3 h-3 ml-1" />
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
