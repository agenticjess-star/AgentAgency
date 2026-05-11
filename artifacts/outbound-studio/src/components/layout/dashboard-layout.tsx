import { FC, ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { UserButton, useUser } from "@clerk/react";
import { LayoutDashboard, Users, Activity } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout: FC<DashboardLayoutProps> = ({ children }) => {
  const [location] = useLocation();
  const { user } = useUser();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/leads", label: "Leads", icon: Users },
    { href: "/runs", label: "Runs", icon: Activity },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r border-border bg-card flex flex-col">
        <div className="p-6">
          <h1 className="font-mono text-xl font-bold tracking-tight text-foreground uppercase">
            Outbound<span className="text-accent">Studio</span>
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors cursor-pointer ${
                    isActive
                      ? "bg-accent/10 text-accent font-medium"
                      : "text-secondary-foreground hover:bg-muted"
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${isActive ? "text-accent" : "text-secondary-foreground"}`} />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border flex items-center gap-3">
          <UserButton />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground">{user?.firstName || "Operator"}</span>
            <span className="text-xs text-secondary-foreground font-mono">ID: {user?.id.slice(-6)}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
