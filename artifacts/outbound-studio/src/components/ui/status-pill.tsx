import { FC } from "react";
import { cn } from "@/lib/utils";

interface StatusPillProps {
  status: string;
  className?: string;
}

export const StatusPill: FC<StatusPillProps> = ({ status, className }) => {
  const getColors = (s: string) => {
    switch (s.toLowerCase()) {
      case "running":
        return "bg-accent/10 text-accent border border-accent/20";
      case "completed":
      case "won":
        return "bg-[#3d3a39] text-white border border-[#3d3a39]";
      case "failed":
      case "lost":
        return "bg-destructive/10 text-destructive border border-destructive/20";
      case "prospected":
      case "paused":
        return "bg-muted text-secondary-foreground border border-border";
      default:
        return "bg-muted text-foreground border border-border";
    }
  };

  return (
    <span className={cn(
      "px-2.5 py-1 rounded-sm font-mono text-[10px] uppercase tracking-wider inline-block",
      getColors(status),
      className
    )}>
      {status.replace(/_/g, " ")}
    </span>
  );
};
