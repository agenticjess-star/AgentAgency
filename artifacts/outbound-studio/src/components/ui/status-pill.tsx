import { FC } from "react";
import { cn } from "@/lib/utils";

interface StatusPillProps {
  status: string;
  className?: string;
}

const STATUS_MAP: Record<string, string> = {
  won: "bg-emerald-950/60 text-emerald-400 border-emerald-800/40",
  completed: "bg-emerald-950/60 text-emerald-400 border-emerald-800/40",
  running: "bg-amber-950/60 text-amber-400 border-amber-800/40",
  outreached: "bg-blue-950/60 text-blue-400 border-blue-800/40",
  built: "bg-violet-950/60 text-violet-400 border-violet-800/40",
  packaged: "bg-sky-950/60 text-sky-400 border-sky-800/40",
  audited: "bg-cyan-950/60 text-cyan-400 border-cyan-800/40",
  strategized: "bg-indigo-950/60 text-indigo-400 border-indigo-800/40",
  awaiting_approval: "bg-orange-950/60 text-orange-400 border-orange-800/40",
  failed: "bg-red-950/60 text-red-400 border-red-800/40",
  lost: "bg-red-950/60 text-red-400 border-red-800/40",
  recycled: "bg-zinc-800/60 text-zinc-400 border-zinc-700/40",
};

export const StatusPill: FC<StatusPillProps> = ({ status, className }) => {
  const key = status.toLowerCase();
  const colors = STATUS_MAP[key] ?? "bg-muted text-secondary-foreground border-border";

  return (
    <span
      className={cn(
        "inline-block px-2 py-0.5 border font-mono text-[10px] uppercase tracking-wider whitespace-nowrap",
        colors,
        className
      )}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
};
