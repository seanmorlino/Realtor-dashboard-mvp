import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: number;
  tone: string;
  icon: LucideIcon;
}

export function MetricCard({ label, value, tone, icon: Icon }: MetricCardProps) {
  return (
    <section className="rounded-lg border border-line bg-paper p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-normal text-ink">{value}</p>
        </div>
        <span className={`rounded-lg p-2 ${tone}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
    </section>
  );
}
