import { FileSpreadsheet } from "lucide-react";

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed border-line bg-white p-8 text-center">
      <FileSpreadsheet className="h-9 w-9 text-slate-400" aria-hidden="true" />
      <h3 className="mt-3 text-base font-semibold text-ink">{title}</h3>
      <p className="mt-1 max-w-md text-sm leading-6 text-slate-500">{body}</p>
    </div>
  );
}
