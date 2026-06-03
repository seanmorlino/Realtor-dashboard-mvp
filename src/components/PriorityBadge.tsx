import type { Priority } from "../types";

const styles: Record<Priority, string> = {
  Critical: "bg-red-600 text-white",
  High: "bg-orange-100 text-orange-800",
  Medium: "bg-sky-100 text-sky-800",
  Low: "bg-slate-100 text-slate-700",
  Unspecified: "bg-zinc-100 text-zinc-600"
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return <span className={`inline-flex rounded-md px-2 py-1 text-xs font-semibold ${styles[priority]}`}>{priority}</span>;
}
