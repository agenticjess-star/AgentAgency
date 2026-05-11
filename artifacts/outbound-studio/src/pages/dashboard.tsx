import { FC } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  useGetPipelineSummary,
  useGetPipelineActivity,
  useGetVerticalBreakdown,
} from "@workspace/api-client-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { Activity, Target, Trophy, DollarSign, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

function StatItem({ label, value, icon: Icon, isLoading, accent }: {
  label: string; value: string | number; icon: any; isLoading: boolean; accent?: boolean;
}) {
  return (
    <div className="status-band-item min-w-0">
      <div className="flex items-start justify-between mb-2">
        <span className="mono-label truncate mr-2">{label}</span>
        <Icon className={`w-3.5 h-3.5 shrink-0 ${accent ? "text-accent" : "text-secondary-foreground"}`} />
      </div>
      {isLoading ? (
        <Skeleton className="h-7 w-20 mt-1" />
      ) : (
        <div className={`text-2xl font-mono tabular-nums ${accent ? "text-accent" : "text-foreground"}`}>{value}</div>
      )}
    </div>
  );
}

function ConvRate({ total, won, isLoading }: { total: number; won: number; isLoading: boolean }) {
  const rate = total > 0 ? ((won / total) * 100).toFixed(1) : "0.0";
  return (
    <div className="status-band-item min-w-0">
      <div className="flex items-start justify-between mb-2">
        <span className="mono-label">Conversion</span>
        <TrendingUp className="w-3.5 h-3.5 text-secondary-foreground shrink-0" />
      </div>
      {isLoading ? (
        <Skeleton className="h-7 w-16 mt-1" />
      ) : (
        <div className="text-2xl font-mono tabular-nums text-foreground">
          {rate}<span className="text-base text-secondary-foreground ml-0.5">%</span>
        </div>
      )}
    </div>
  );
}

const DashboardPage: FC = () => {
  const { data: summary, isLoading: summaryLoading } = useGetPipelineSummary();
  const { data: activity, isLoading: activityLoading } = useGetPipelineActivity();
  const { data: verticals, isLoading: verticalsLoading } = useGetVerticalBreakdown();

  return (
    <DashboardLayout>
      <div className="space-y-5">

        <div className="flex items-start justify-between">
          <div>
            <h1 className="heading-lg">Console</h1>
            <p className="caption mt-0.5">Pipeline overview · real-time</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 border border-border bg-card">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-wider text-secondary-foreground">System Active</span>
          </div>
        </div>

        {/* Stats band */}
        <div className="status-band overflow-x-auto">
          <StatItem label="Total Leads" value={summary?.totalLeads ?? 0} icon={Target} isLoading={summaryLoading} />
          <StatItem label="Active Runs" value={summary?.activeRuns ?? 0} icon={Activity} isLoading={summaryLoading} accent />
          <StatItem label="Won Deals" value={summary?.wonDeals ?? 0} icon={Trophy} isLoading={summaryLoading} />
          <StatItem
            label="Pipeline Value"
            value={`$${(summary?.totalRevenue ?? 0).toLocaleString()}`}
            icon={DollarSign}
            isLoading={summaryLoading}
          />
          <div className="hidden lg:block">
            <ConvRate total={summary?.totalLeads ?? 0} won={summary?.wonDeals ?? 0} isLoading={summaryLoading} />
          </div>
        </div>

        {/* Charts + feed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 border border-border bg-card">
            <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
              <span className="mono-label">Vertical Breakdown</span>
              <span className="font-mono text-[10px] text-secondary-foreground">leads / category</span>
            </div>
            <div className="p-5 h-[260px]">
              {verticalsLoading ? (
                <Skeleton className="w-full h-full" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={verticals ?? []} margin={{ top: 4, right: 0, left: -24, bottom: 0 }} barSize={16}>
                    <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="#c8c3bf" opacity={0.4} />
                    <XAxis
                      dataKey="vertical" axisLine={false} tickLine={false}
                      tick={{ fontSize: 10, fill: "#9a9490", fontFamily: "JetBrains Mono, monospace", letterSpacing: 0.5 }}
                    />
                    <YAxis
                      axisLine={false} tickLine={false} allowDecimals={false}
                      tick={{ fontSize: 10, fill: "#9a9490", fontFamily: "JetBrains Mono, monospace" }}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#0a0a0a", border: "1px solid #282828", borderRadius: 0,
                        fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: "#f0eeeb",
                      }}
                      itemStyle={{ color: "#ea580c" }}
                      cursor={{ fill: "rgba(234,88,12,0.05)" }}
                    />
                    <Bar dataKey="count" fill="#ea580c" opacity={0.9} radius={[1, 1, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="border border-border bg-card flex flex-col" style={{ maxHeight: 340 }}>
            <div className="px-5 py-3.5 border-b border-border flex items-center justify-between shrink-0">
              <span className="mono-label">System Log</span>
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-border">
              {activityLoading ? (
                <div className="p-4 space-y-3">
                  {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
                </div>
              ) : (
                activity?.map((log) => (
                  <div key={log.id} className="px-5 py-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[10px] text-accent uppercase tracking-wider truncate mr-2">{log.type}</span>
                      <span className="font-mono text-[10px] text-secondary-foreground whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                    <div className="text-[13px] font-medium text-foreground truncate">{log.businessName}</div>
                    <div className="text-[11px] text-secondary-foreground mt-0.5 leading-snug line-clamp-2">{log.description}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
