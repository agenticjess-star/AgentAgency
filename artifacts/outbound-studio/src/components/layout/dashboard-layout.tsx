import { FC, ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { UserButton, useUser } from "@clerk/react";
import { useGetPipelineSummary } from "@workspace/api-client-react";
import {
  LayoutDashboard,
  Users,
  Activity,
  ChevronLeft,
  ChevronRight,
  Zap,
  Circle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: ReactNode;
}

const NAV_ITEMS = [
  { href: "/dashboard", label: "Console", icon: LayoutDashboard },
  { href: "/leads", label: "Leads", icon: Users },
  { href: "/runs", label: "Runs", icon: Activity },
];

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Console",
  "/leads": "Leads",
  "/runs": "Pipeline Runs",
};

function getPageTitle(location: string): string {
  for (const [prefix, title] of Object.entries(PAGE_TITLES)) {
    if (location.startsWith(prefix)) return title;
  }
  return "Outbound Studio";
}

export const DashboardLayout: FC<DashboardLayoutProps> = ({ children }) => {
  const [location] = useLocation();
  const { user } = useUser();
  const [collapsed, setCollapsed] = useState(false);
  const { data: summary } = useGetPipelineSummary();

  const activeRuns = summary?.activeRuns ?? 0;
  const pageTitle = getPageTitle(location);

  return (
    <div className="flex h-dvh bg-background overflow-hidden">
      {/* ── Desktop Sidebar ─────────────────────────────────────────── */}
      <aside
        className={cn(
          "hidden md:flex flex-col border-r border-border bg-card transition-all duration-200 shrink-0 relative",
          collapsed ? "w-14" : "w-[220px]"
        )}
      >
        {/* Logo */}
        <div className={cn("h-12 flex items-center border-b border-border px-4 shrink-0", collapsed && "justify-center px-0")}>
          {collapsed ? (
            <span className="font-mono text-base font-semibold text-accent tracking-tighter">OS</span>
          ) : (
            <span className="font-mono text-sm font-semibold tracking-tighter uppercase text-foreground">
              Outbound<span className="text-accent">Studio</span>
            </span>
          )}
        </div>

        {/* Active run indicator strip */}
        {!collapsed && activeRuns > 0 && (
          <div className="mx-3 mt-3 px-3 py-2 bg-accent/8 border border-accent/20 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shrink-0" />
            <span className="font-mono text-[10px] text-accent uppercase tracking-wider">
              {activeRuns} run{activeRuns > 1 ? "s" : ""} active
            </span>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-2 pt-3 space-y-0.5">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = location.startsWith(href);
            return (
              <Link key={href} href={href}>
                <div
                  className={cn(
                    "flex items-center gap-3 px-2.5 py-2 text-sm transition-colors cursor-pointer",
                    collapsed ? "justify-center" : "",
                    active
                      ? "bg-accent/10 text-accent"
                      : "text-secondary-foreground hover:bg-muted hover:text-foreground"
                  )}
                  title={collapsed ? label : undefined}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {!collapsed && (
                    <span className="font-mono text-[11px] uppercase tracking-wider">{label}</span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-14 w-6 h-6 bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors z-10"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="w-3 h-3 text-secondary-foreground" />
          ) : (
            <ChevronLeft className="w-3 h-3 text-secondary-foreground" />
          )}
        </button>
      </aside>

      {/* ── Main area ───────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* ── Global top status bar (all dashboard pages, all widths) ── */}
        <header className="h-12 border-b border-border bg-card flex items-center px-4 md:px-6 gap-3 shrink-0">
          {/* Mobile logo */}
          <span className="font-mono text-sm font-semibold tracking-tighter uppercase text-foreground md:hidden flex-1">
            Outbound<span className="text-accent">Studio</span>
          </span>

          {/* Desktop: page title */}
          <span className="hidden md:block font-mono text-[11px] uppercase tracking-wider text-foreground flex-1">
            {pageTitle}
          </span>

          {/* System state */}
          <div className="flex items-center gap-2 shrink-0">
            {activeRuns > 0 ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span className="font-mono text-[10px] text-accent uppercase tracking-wider hidden sm:block">
                  {activeRuns} active
                </span>
                <Zap className="w-3.5 h-3.5 text-accent sm:hidden" />
              </>
            ) : (
              <>
                <Circle className="w-2 h-2 text-emerald-500 fill-emerald-500" />
                <span className="font-mono text-[10px] text-secondary-foreground uppercase tracking-wider hidden md:block">
                  Idle
                </span>
              </>
            )}
          </div>

          {/* User avatar — always visible in top bar */}
          <UserButton />
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto pb-16 md:pb-0">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6">
            {children}
          </div>
        </main>
      </div>

      {/* ── Mobile Bottom Tab Bar ───────────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-card border-t border-border flex">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = location.startsWith(href);
          return (
            <Link key={href} href={href} className="flex-1">
              <div
                className={cn(
                  "flex flex-col items-center justify-center py-2 gap-1 transition-colors min-h-[56px]",
                  active ? "text-accent" : "text-secondary-foreground"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-mono text-[9px] uppercase tracking-wider">{label}</span>
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
