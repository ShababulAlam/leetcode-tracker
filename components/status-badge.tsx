import { Status } from "@/lib/types";
import { cn } from "@/lib/utils";

const statusConfig: Record<Status, { label: string; dot: string; className: string }> = {
  todo: {
    label: "To Do",
    dot: "bg-slate-400",
    className: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800/50 dark:text-slate-300 dark:border-slate-700",
  },
  inprogress: {
    label: "In Progress",
    dot: "bg-blue-500",
    className: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800",
  },
  solved: {
    label: "Solved",
    dot: "bg-emerald-500",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800",
  },
  needs_review: {
    label: "Needs Review",
    dot: "bg-amber-500",
    className: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800",
  },
};

export function StatusBadge({ status }: { status: Status }) {
  const config = statusConfig[status];
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border",
      config.className
    )}>
      <span className={cn("h-1.5 w-1.5 rounded-full flex-shrink-0", config.dot)} />
      {config.label}
    </span>
  );
}
