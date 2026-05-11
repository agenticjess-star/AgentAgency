import { FC } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { 
  useGetPipelineSummary, 
  useGetPipelineActivity, 
  useGetVerticalBreakdown 
} from "@workspace/api-client-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Activity, Target, Trophy, DollarSign } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const StatCard = ({ title, value, icon: Icon, isLoading }: any) => (
  <div className="border border-border bg-card p-6 flex items-start justify-between">
    <div>
      <div className="text-secondary-foreground text-sm font-mono uppercase tracking-wider mb-2">{title}</div>
      {isLoading ? (
        <Skeleton className="h-8 w-24" />
      ) : (
        <div className="text-3xl font-mono">{value}</div>
      )}
    </div>
    <Icon className="w-5 h-5 text-accent" />
  </div>
);

const DashboardPage: FC = () => {
  const { data: summary, isLoading: summaryLoading } = useGetPipelineSummary();
  const { data: activity, isLoading: activityLoading } = useGetPipelineActivity();
  const { data: verticals, isLoading: verticalsLoading } = useGetVerticalBreakdown();

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <h1 className="heading-lg">Console</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard 
            title="Total Leads" 
            value={summary?.totalLeads ?? 0} 
            icon={Target}
            isLoading={summaryLoading}
          />
          <StatCard 
            title="Active Runs" 
            value={summary?.activeRuns ?? 0} 
            icon={Activity}
            isLoading={summaryLoading}
          />
          <StatCard 
            title="Won Deals" 
            value={summary?.wonDeals ?? 0} 
            icon={Trophy}
            isLoading={summaryLoading}
          />
          <StatCard 
            title="Pipeline Value" 
            value={`$${summary?.totalRevenue?.toLocaleString() ?? 0}`} 
            icon={DollarSign}
            isLoading={summaryLoading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 border border-border bg-card p-6">
            <h2 className="font-mono text-sm uppercase tracking-wider mb-6">Vertical Breakdown</h2>
            <div className="h-[300px] w-full">
              {verticalsLoading ? (
                <Skeleton className="w-full h-full" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={verticals ?? []} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                    <XAxis dataKey="vertical" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#b8b3b0' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#b8b3b0' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#020202', border: 'none', color: '#fafafa', borderRadius: 0, fontFamily: 'monospace', fontSize: 12 }}
                      itemStyle={{ color: '#ef6f2e' }}
                    />
                    <Bar dataKey="count" fill="#3d3a39" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="border border-border bg-card p-6 flex flex-col">
            <h2 className="font-mono text-sm uppercase tracking-wider mb-6">System Log</h2>
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
              {activityLoading ? (
                Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)
              ) : (
                activity?.map((log) => (
                  <div key={log.id} className="text-sm pb-4 border-b border-muted last:border-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-mono text-xs text-accent">{log.type}</span>
                      <span className="text-xs text-secondary-foreground">{new Date(log.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="font-medium">{log.businessName}</div>
                    <div className="text-secondary-foreground text-xs mt-1">{log.description}</div>
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
