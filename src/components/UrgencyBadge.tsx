import type { UrgencyCategory } from "../types";

const badgeStyles: Record<UrgencyCategory, string> = {
  overdue: "bg-red-50 text-red-700 ring-red-200",
  today: "bg-amber-50 text-amber-800 ring-amber-200",
  soon: "bg-blue-50 text-blue-700 ring-blue-200",
  upcoming: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  future: "bg-slate-100 text-slate-700 ring-slate-200",
  completed: "bg-green-50 text-green-700 ring-green-200",
  "no-date": "bg-zinc-100 text-zinc-700 ring-zinc-200"
};

const labels: Record<UrgencyCategory, string> = {
  overdue: "Overdue",
  today: "Due Today",
  soon: "Due Soon",
  upcoming: "Upcoming",
  future: "Future",
  completed: "Completed",
  "no-date": "No Date"
};

export function UrgencyBadge({ category }: { category: UrgencyCategory }) {
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold ring-1 ${badgeStyles[category]}`}>
      {labels[category]}
    </span>
  );
}
