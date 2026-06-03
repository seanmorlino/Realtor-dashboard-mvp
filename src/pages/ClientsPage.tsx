import { Users } from "lucide-react";
import type { Task } from "../types";

export function ClientsPage({ tasks }: { tasks: Task[] }) {
  const clients = Array.from(new Set(tasks.map((task) => task.clientName))).sort((a, b) => a.localeCompare(b));

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold tracking-normal text-ink">Clients</h2>
        <p className="text-sm text-slate-500">Placeholder view for the future client workspace.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {clients.map((client) => {
          const clientTasks = tasks.filter((task) => task.clientName === client);
          return (
            <article key={client} className="rounded-lg border border-line bg-paper p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="rounded-lg bg-slate-100 p-2 text-slate-600">
                  <Users className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-semibold text-ink">{client}</h3>
                  <p className="text-sm text-slate-500">{clientTasks.length} task{clientTasks.length === 1 ? "" : "s"}</p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
