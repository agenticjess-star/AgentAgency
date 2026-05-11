import { FC, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  useGetPipelineSummary,
  useGetPipelineActivity,
  useGetVerticalBreakdown,
  useListRuns,
  PipelineRunStatus,
} from "@workspace/api-client-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  Activity,
  Target,
  Trophy,
  DollarSign,
  TrendingUp,
  ChevronRight,
  LucideIcon,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  BarChart3,
  List,
  ExternalLink,
  Play,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/* ── Types ──────────────────────────────────────────────────────────── */
type FilterKey = "all" | "running" | "awaiting_approval" | "completed" | "failed" | "paused";

const STAGES = [
  "prospector",
  "strategist",
  "builder",
  "auditor",
  "packager",
  "persona_tester",
  "outreach",
];
const STAGE_SHORT = ["P", "S", "B", "A", "K", "T", "O"];

/* ── Stat card ──────────────────────────────────────────────────────── */
function StatItem({
  label,
  value,
  icon: Icon,
  isLoading,
  accent,
  pulse,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  isLoading: boolean;
  accent?: boolean;
  pulse?: boolean;
}) {
  return (
    <div className="status-band-item min-w-0">
      <div className="flex items-start justify-between mb-2">
        <span className="mono-label truncate mr-2">{label}</span>
        <div className="flex items-center gap-1.5 shrink-0">
          {pulse && (
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          )}
          <Icon
            className={`w-3.5 h-3.5 ${accent ? "text-accent" : "text-secondary-foreground"}`}
          />
        </div>
      </div>
      {isLoading ? (
        <Skeleton className="h-8 w-20 mt-1" />
      ) : (
        <div
          className={`text-[28px] font-mono tabular-nums leading-none ${accent ? "text-accent" : "text-foreground"}`}
        >
          {value}
        </div>
      )}
    </div>
  );
}

/* ── Pipeline progress strip ────────────────────────────────────────── */
function PipelineStrip({
  currentAgent,
  status,
}: {
  currentAgent: string;
  status: string;
}) {
  const isDone = status === "completed" || status === "won";
  const isFailed = status === "failed";
  const currentIdx = STAGES.indexOf(
    currentAgent.toLowerCase().replace(/ /g, "_")
  );

  return (
    <div className="flex items-center gap-0">
      {STAGES.map((stage, i) => {
        const done = isDone || (i < currentIdx && !isFailed);
        const active = !isDone && !isFailed && i === currentIdx;
        const failed = isFailed && i === currentIdx;

        return (
          <div key={stage} className="flex items-center">
            <div
              title={stage.replace(/_/g, " ")}
              className={cn(
                "w-5 h-5 flex items-center justify-center font-mono text-[8px] border shrink-0 transition-all",
                done
                  ? "border-emerald-500/40 bg-emerald-950/20 text-emerald-500"
                  : active
                  ? "border-accent bg-accent/15 text-accent"
                  : failed
                  ? "border-red-500/40 bg-red-950/20 text-red-500"
                  : "border-border bg-background text-muted-foreground/30"
              )}
            >
              {STAGE_SHORT[i]}
            </div>
            {i < STAGES.length - 1 && (
              <div
                className={cn(
                  "w-1.5 h-px shrink-0",
                  done ? "bg-emerald-500/30" : isFailed && i < currentIdx ? "bg-red-500/20" : "bg-border"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Status config ──────────────────────────────────────────────────── */
const STATUS_CONFIG: Record<
  string,
  {
    label: string;
    color: string;
    bg: string;
    border: string;
    leftBar: string;
    icon: LucideIcon;
  }
> = {
  running: {
    label: "Running",
    color: "text-accent",
    bg: "bg-accent/[0.04]",
    border: "border-border",
    leftBar: "bg-accent",
    icon: Activity,
  },
  awaiting_approval: {
    label: "Pending",
    color: "text-amber-600",
    bg: "bg-amber-50/30",
    border: "border-border",
    leftBar: "bg-amber-400",
    icon: Clock,
  },
  paused: {
    label: "Paused",
    color: "text-amber-600",
    bg: "bg-amber-50/20",
    border: "border-border",
    leftBar: "bg-amber-400",
    icon: Clock,
  },
  completed: {
    label: "Done",
    color: "text-emerald-600",
    bg: "bg-emerald-50/20",
    border: "border-border",
    leftBar: "bg-emerald-500",
    icon: CheckCircle2,
  },
  failed: {
    label: "Failed",
    color: "text-red-500",
    bg: "bg-red-50/20",
    border: "border-border",
    leftBar: "bg-red-500",
    icon: XCircle,
  },
};

function getStatusConfig(status: string) {
  return STATUS_CONFIG[status] ?? STATUS_CONFIG.awaiting_approval;
}

/* ── Run card ───────────────────────────────────────────────────────── */
function RunCard({ run }: { run: any }) {
  const cfg = getStatusConfig(run.status);
  const StatusIcon = cfg.icon;
  const isActive = run.status === PipelineRunStatus.running;

  return (
    <Link href={`/runs/${run.id}`}>
      <div
        className={cn(
          "flex items-stretch border-b border-border cursor-pointer group transition-colors hover:bg-muted/30",
          cfg.bg
        )}
      >
        {/* Status bar on left */}
        <div className={cn("w-0.5 shrink-0", cfg.leftBar, isActive && "animate-pulse")} />

        <div className="flex-1 px-4 py-3.5 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2.5">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-[13px] truncate">
                  {run.businessName || `Lead #${run.leadId}`}
                </span>
                {/* Status badge */}
                <span
                  className={cn(
                    "flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 border",
                    cfg.color,
                    isActive ? "border-accent/40 bg-accent/8" : "border-border bg-background/60"
                  )}
                >
                  <StatusIcon className="w-2.5 h-2.5" />
                  {cfg.label}
                </span>
                {/* Audit score */}
                {run.auditScore != null && (
                  <span
                    className={cn(
                      "font-mono text-[10px] tabular-nums",
                      run.auditScore >= 80
                        ? "text-emerald-600"
                        : run.auditScore >= 60
                        ? "text-amber-500"
                        : "text-red-500"
                    )}
                  >
                    {run.auditScore}/100
                  </span>
                )}
              </div>
              <div className="font-mono text-[10px] text-secondary-foreground mt-0.5 flex items-center gap-2">
                <span>#{run.id}</span>
                <span className="text-border">·</span>
                <span>
                  {new Date(run.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <span className="text-border">·</span>
                <span className="capitalize">{run.currentAgent.replace(/_/g, " ")}</span>
              </div>
            </div>

            {/* Open console arrow */}
            <ChevronRight className="w-4 h-4 text-secondary-foreground shrink-0 mt-1 group-hover:text-foreground transition-colors" />
          </div>

          {/* Pipeline strip */}
          <PipelineStrip currentAgent={run.currentAgent} status={run.status} />
        </div>
      </div>
    </Link>
  );
}

/* ── Activity log item ──────────────────────────────────────────────── */
const TYPE_RAIL: Record<string, string> = {
  lead_created: "#ea580c",
  run_started: "#3b82f6",
  run_completed: "#4ade80",
  run_failed: "#ef4444",
  email_sent: "#a855f7",
  deal_won: "#4ade80",
};

/* ── Mission briefing strip ─────────────────────────────────────────── */
function MissionHeader({
  activeCount, failedCount, totalLeads, summaryLoading,
}: { activeCount: number; failedCount: number; totalLeads: number; summaryLoading: boolean }) {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });

  const systemStatus = failedCount > 0
    ? { label: `${failedCount} run${failedCount > 1 ? "s" : ""} failed`, color: "text-red-500", dot: "bg-red-500" }
    : activeCount > 0
    ? { label: `${activeCount} run${activeCount > 1 ? "s" : ""} active`, color: "text-accent", dot: "bg-accent animate-pulse" }
    : { label: "System idle", color: "text-emerald-600", dot: "bg-emerald-500" };

  return (
    <div className="flex items-center justify-between border border-border bg-card px-5 py-3">
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2">
          <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", systemStatus.dot)} />
          <span className={cn("font-mono text-[10px] uppercase tracking-widest", systemStatus.color)}>
            {systemStatus.label}
          </span>
        </div>
        <div className="w-px h-3 bg-border" />
        {!summaryLoading && (
          <span className="font-mono text-[10px] text-secondary-foreground uppercase tracking-wider">
            {totalLeads} total leads in system
          </span>
        )}
      </div>
      <div className="flex items-center gap-3">
        <span className="font-mono text-[10px] text-secondary-foreground uppercase tracking-wider hidden sm:block">
          {dateStr} · {timeStr}
        </span>
        <Link href="/leads">
          <button className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-secondary-foreground border border-border px-3 py-1.5 hover:border-foreground hover:text-foreground transition-colors">
            + Inject Lead
          </button>
        </Link>
      </div>
    </div>
  );
}

/* ── Dashboard ──────────────────────────────────────────────────────── */
const DashboardPage: FC = () => {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [view, setView] = useState<"pipeline" | "analytics">("pipeline");

  const { data: summary, isLoading: summaryLoading } = useGetPipelineSummary();
  const { data: activity, isLoading: activityLoading } = useGetPipelineActivity();
  const { data: verticals, isLoading: verticalsLoading } = useGetVerticalBreakdown();
  const { data: runs, isLoading: runsLoading } = useListRuns();

  /* Derived */
  const allRuns = runs ?? [];
  const failedRuns = allRuns.filter((r) => r.status === PipelineRunStatus.failed);
  const activeRuns = allRuns.filter((r) => r.status === PipelineRunStatus.running);
  const pendingRuns = allRuns.filter((r) => r.status === PipelineRunStatus.awaiting_approval || r.status === PipelineRunStatus.paused);

  const FILTERS: { key: FilterKey; label: string }[] = [
    { key: "all", label: "All" },
    { key: "running", label: "Running" },
    { key: "awaiting_approval", label: "Pending" },
    { key: "completed", label: "Done" },
    { key: "failed", label: "Failed" },
  ];

  const filteredRuns =
    filter === "all" ? allRuns : allRuns.filter((r) => r.status === filter);

  /* Conversion */
  const total = summary?.totalLeads ?? 0;
  const won = summary?.wonDeals ?? 0;
  const convRate = total > 0 ? ((won / total) * 100).toFixed(1) : "0.0";

  return (
    <DashboardLayout>
      <div className="space-y-5">

        {/* ── Mission header ───────────────────────────────────────────── */}
        <MissionHeader
          activeCount={activeRuns.length}
          failedCount={failedRuns.length}
          totalLeads={summary?.totalLeads ?? 0}
          summaryLoading={summaryLoading}
        />

        {/* ── Alert strip ─────────────────────────────────────────────── */}
        <AnimatePresence>
          {failedRuns.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="border border-red-300/50 bg-red-50/60 px-4 py-3 flex items-center gap-3"
            >
              <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
              <span className="font-mono text-[11px] uppercase tracking-wider text-red-600">
                {failedRuns.length} run{failedRuns.length > 1 ? "s" : ""} failed — review required
              </span>
              <button
                onClick={() => setFilter("failed")}
                className="ml-auto font-mono text-[10px] uppercase tracking-wider text-red-600 hover:text-red-700 border border-red-300/50 px-2.5 py-1 transition-colors hover:bg-red-50"
              >
                View →
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Stats band ──────────────────────────────────────────────── */}
        <div className="status-band overflow-x-auto">
          <StatItem
            label="Total Leads"
            value={summary?.totalLeads ?? 0}
            icon={Target}
            isLoading={summaryLoading}
          />
          <StatItem
            label="Active Runs"
            value={activeRuns.length}
            icon={Activity}
            isLoading={summaryLoading}
            accent
            pulse={activeRuns.length > 0}
          />
          <StatItem
            label="Won Deals"
            value={summary?.wonDeals ?? 0}
            icon={Trophy}
            isLoading={summaryLoading}
          />
          <StatItem
            label="Pipeline Value"
            value={`$${(summary?.totalRevenue ?? 0).toLocaleString()}`}
            icon={DollarSign}
            isLoading={summaryLoading}
          />
          <div className="status-band-item min-w-0 hidden lg:block">
            <div className="flex items-start justify-between mb-2">
              <span className="mono-label">Conversion</span>
              <TrendingUp className="w-3.5 h-3.5 text-secondary-foreground" />
            </div>
            {summaryLoading ? (
              <Skeleton className="h-8 w-16 mt-1" />
            ) : (
              <div className="text-[28px] font-mono tabular-nums leading-none">
                {convRate}
                <span className="text-base text-secondary-foreground ml-0.5">%</span>
              </div>
            )}
          </div>
        </div>

        {/* ── Main 2-col grid ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* ── Left: Pipeline / Analytics ──────────────────────────── */}
          <div className="lg:col-span-2 border border-border bg-card flex flex-col">
            {/* Section header + view toggle */}
            <div className="px-5 py-3.5 border-b border-border flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setView("pipeline")}
                  className={cn(
                    "flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider transition-colors",
                    view === "pipeline"
                      ? "text-foreground"
                      : "text-secondary-foreground hover:text-foreground"
                  )}
                >
                  <List className="w-3 h-3" />
                  Pipeline
                </button>
                <span className="text-border">|</span>
                <button
                  onClick={() => setView("analytics")}
                  className={cn(
                    "flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider transition-colors",
                    view === "analytics"
                      ? "text-foreground"
                      : "text-secondary-foreground hover:text-foreground"
                  )}
                >
                  <BarChart3 className="w-3 h-3" />
                  Analytics
                </button>
              </div>
              <Link href="/runs">
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-mono text-[10px] uppercase tracking-wider h-6 px-2 gap-1 text-secondary-foreground hover:text-foreground"
                >
                  All Runs <ChevronRight className="w-3 h-3" />
                </Button>
              </Link>
            </div>

            {/* ── Pipeline view ─────────────────────────────────────── */}
            {view === "pipeline" && (
              <>
                {/* Filter tabs */}
                <div className="px-4 py-2.5 border-b border-border flex items-center gap-1 overflow-x-auto shrink-0">
                  {FILTERS.map(({ key, label }) => {
                    const count =
                      key === "all"
                        ? allRuns.length
                        : allRuns.filter((r) => r.status === key).length;
                    return (
                      <button
                        key={key}
                        onClick={() => setFilter(key)}
                        className={cn(
                          "flex items-center gap-1.5 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider border transition-colors whitespace-nowrap shrink-0",
                          filter === key
                            ? "bg-foreground text-background border-foreground"
                            : "border-border text-secondary-foreground hover:border-foreground hover:text-foreground bg-background"
                        )}
                      >
                        {label}
                        {count > 0 && (
                          <span
                            className={cn(
                              "font-mono text-[9px] px-1 min-w-[16px] text-center",
                              filter === key
                                ? "bg-background/20 text-background"
                                : "bg-muted text-secondary-foreground"
                            )}
                          >
                            {count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Run cards */}
                <div className="flex-1 overflow-y-auto divide-y-0">
                  {runsLoading ? (
                    <div className="p-4 space-y-3">
                      {Array(4)
                        .fill(0)
                        .map((_, i) => (
                          <Skeleton key={i} className="h-20 w-full" />
                        ))}
                    </div>
                  ) : filteredRuns.length === 0 ? (
                    <div className="py-12 text-center">
                      <span className="font-mono text-[11px] text-secondary-foreground uppercase tracking-wider">
                        {filter === "all" ? "No pipeline runs yet" : `No ${filter} runs`}
                      </span>
                    </div>
                  ) : (
                    <AnimatePresence initial={false}>
                      {filteredRuns.map((run) => (
                        <motion.div
                          key={run.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                        >
                          <RunCard run={run} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  )}
                </div>
              </>
            )}

            {/* ── Analytics view ────────────────────────────────────── */}
            {view === "analytics" && (
              <div className="p-5 flex-1">
                <div className="mb-1 mono-label">Vertical Breakdown</div>
                <p className="font-mono text-[10px] text-secondary-foreground mb-4">
                  Leads per industry category
                </p>
                <div className="h-[300px]">
                  {verticalsLoading ? (
                    <Skeleton className="w-full h-full" />
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={verticals ?? []}
                        margin={{ top: 4, right: 0, left: -24, bottom: 0 }}
                        barSize={18}
                      >
                        <CartesianGrid
                          strokeDasharray="2 4"
                          vertical={false}
                          stroke="#c8c3bf"
                          opacity={0.4}
                        />
                        <XAxis
                          dataKey="vertical"
                          axisLine={false}
                          tickLine={false}
                          tick={{
                            fontSize: 10,
                            fill: "#9a9490",
                            fontFamily: "JetBrains Mono, monospace",
                            letterSpacing: 0.5,
                          }}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          allowDecimals={false}
                          tick={{
                            fontSize: 10,
                            fill: "#9a9490",
                            fontFamily: "JetBrains Mono, monospace",
                          }}
                        />
                        <Tooltip
                          contentStyle={{
                            background: "#0a0a0a",
                            border: "1px solid #282828",
                            borderRadius: 0,
                            fontFamily: "JetBrains Mono, monospace",
                            fontSize: 11,
                            color: "#f0eeeb",
                          }}
                          itemStyle={{ color: "#ea580c" }}
                          cursor={{ fill: "rgba(234,88,12,0.05)" }}
                        />
                        <Bar
                          dataKey="count"
                          fill="#ea580c"
                          opacity={0.9}
                          radius={[1, 1, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── Right column: Attention + Activity ──────────────────── */}
          <div className="flex flex-col gap-4">

            {/* Needs attention */}
            {(failedRuns.length > 0 || pendingRuns.length > 0) && (
              <div className="border border-border bg-card">
                <div className="px-4 py-3 border-b border-border flex items-center gap-2">
                  <AlertTriangle className="w-3 h-3 text-amber-500" />
                  <span className="mono-label">Needs Attention</span>
                </div>
                <div className="divide-y divide-border">
                  {[...failedRuns, ...pendingRuns].slice(0, 4).map((run) => {
                    const isFailed = run.status === PipelineRunStatus.failed;
                    return (
                      <Link key={run.id} href={`/runs/${run.id}`}>
                        <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors cursor-pointer group">
                          <div className={cn(
                            "w-1.5 h-1.5 rounded-full shrink-0",
                            isFailed ? "bg-red-500" : "bg-amber-400"
                          )} />
                          <div className="flex-1 min-w-0">
                            <div className="font-mono text-[11px] text-foreground truncate">
                              {run.businessName || `Lead #${run.leadId}`}
                            </div>
                            <div className="font-mono text-[9px] text-secondary-foreground uppercase tracking-wider mt-0.5">
                              {isFailed ? "Failed" : "Pending"} · {run.currentAgent.replace(/_/g, " ")}
                            </div>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-secondary-foreground group-hover:text-foreground transition-colors shrink-0" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quick actions */}
            <div className="border border-border bg-card">
              <div className="px-4 py-3 border-b border-border">
                <span className="mono-label">Quick Actions</span>
              </div>
              <div className="p-3 space-y-1.5">
                <Link href="/leads">
                  <div className="flex items-center gap-2.5 px-3 py-2.5 border border-border hover:border-foreground hover:bg-muted/30 transition-colors cursor-pointer group">
                    <Play className="w-3.5 h-3.5 text-accent shrink-0" />
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-wider text-foreground">
                        Inject Lead
                      </div>
                      <div className="font-mono text-[9px] text-secondary-foreground mt-0.5">
                        Add new target to pipeline
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-secondary-foreground ml-auto group-hover:text-foreground transition-colors" />
                  </div>
                </Link>
                <Link href="/agents">
                  <div className="flex items-center gap-2.5 px-3 py-2.5 border border-border hover:border-foreground hover:bg-muted/30 transition-colors cursor-pointer group">
                    <ExternalLink className="w-3.5 h-3.5 text-secondary-foreground shrink-0" />
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-wider text-foreground">
                        Agent Roster
                      </div>
                      <div className="font-mono text-[9px] text-secondary-foreground mt-0.5">
                        View system prompts &amp; I/O contracts
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-secondary-foreground ml-auto group-hover:text-foreground transition-colors" />
                  </div>
                </Link>
                <Link href="/skills">
                  <div className="flex items-center gap-2.5 px-3 py-2.5 border border-border hover:border-foreground hover:bg-muted/30 transition-colors cursor-pointer group">
                    <ExternalLink className="w-3.5 h-3.5 text-secondary-foreground shrink-0" />
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-wider text-foreground">
                        Skills Directory
                      </div>
                      <div className="font-mono text-[9px] text-secondary-foreground mt-0.5">
                        22 skill modules — full reference docs
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-secondary-foreground ml-auto group-hover:text-foreground transition-colors" />
                  </div>
                </Link>
              </div>
            </div>

            {/* Activity feed */}
            <div className="border border-border bg-card flex flex-col" style={{ minHeight: 200, maxHeight: 360 }}>
              <div className="px-4 py-3 border-b border-border flex items-center justify-between shrink-0">
                <span className="mono-label">System Log</span>
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              </div>
              <div className="flex-1 overflow-y-auto divide-y divide-border">
                {activityLoading ? (
                  <div className="p-4 space-y-3">
                    {Array(3).fill(0).map((_, i) => (
                      <Skeleton key={i} className="h-14 w-full" />
                    ))}
                  </div>
                ) : (
                  <AnimatePresence initial={false}>
                    {activity?.map((log) => {
                      const rail = TYPE_RAIL[log.type] ?? "#555";
                      return (
                        <motion.div
                          key={log.id}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="flex items-stretch"
                        >
                          <div
                            className="w-0.5 shrink-0"
                            style={{ backgroundColor: rail, opacity: 0.7 }}
                          />
                          <div className="flex-1 px-3.5 py-3 min-w-0">
                            <div className="flex items-center justify-between mb-1 gap-2">
                              <span
                                className="font-mono text-[9px] uppercase tracking-wider truncate"
                                style={{ color: rail }}
                              >
                                {log.type.replace(/_/g, " ")}
                              </span>
                              <span className="font-mono text-[9px] text-secondary-foreground whitespace-nowrap shrink-0">
                                {new Date(log.createdAt).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            </div>
                            <div className="text-[12px] font-medium text-foreground truncate">
                              {log.businessName}
                            </div>
                            <div className="text-[11px] text-secondary-foreground mt-0.5 leading-snug line-clamp-1">
                              {log.description}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
