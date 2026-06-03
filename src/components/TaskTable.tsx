import { ArrowUpDown } from "lucide-react";
import type { Task, TaskSort, UserSettings } from "../types";
import { formatDate, formatRelativeDue } from "../utils/dates";
import { classifyTask } from "../utils/tasks";
import { EmptyState } from "./EmptyState";
import { PriorityBadge } from "./PriorityBadge";
import { UrgencyBadge } from "./UrgencyBadge";

interface TaskTableProps {
  tasks: Task[];
  settings: UserSettings;
  sort: TaskSort;
  onSortChange: (sort: TaskSort) => void;
}

const headers: { key: TaskSort["key"]; label: string }[] = [
  { key: "dueDate", label: "Due" },
  { key: "priority", label: "Priority" },
  { key: "clientName", label: "Client" },
  { key: "transactionStage", label: "Stage" }
];

export function TaskTable({ tasks, settings, sort, onSortChange }: TaskTableProps) {
  if (tasks.length === 0) {
    return <EmptyState title="No matching tasks" body="Adjust the filters or load a spreadsheet with active task rows." />;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-paper shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-line text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-normal text-slate-500">
            <tr>
              {headers.map((header) => (
                <th key={header.key} className="px-4 py-3">
                  <button
                    className="inline-flex items-center gap-1 hover:text-ink"
                    type="button"
                    onClick={() =>
                      onSortChange({
                        key: header.key,
                        direction: sort.key === header.key && sort.direction === "asc" ? "desc" : "asc"
                      })
                    }
                  >
                    {header.label}
                    <ArrowUpDown className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </th>
              ))}
              <th className="px-4 py-3">Task</th>
              <th className="px-4 py-3">Assigned</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {tasks.map((task) => {
              const category = classifyTask(task, settings);

              return (
                <tr key={task.id} className="align-top hover:bg-slate-50/70">
                  <td className="whitespace-nowrap px-4 py-4">
                    <div className="font-semibold text-ink">{formatDate(task.dueDate)}</div>
                    <div className="mt-1 text-xs text-slate-500">{formatRelativeDue(task.dueDate)}</div>
                  </td>
                  <td className="px-4 py-4">
                    <PriorityBadge priority={task.priority} />
                  </td>
                  <td className="min-w-48 px-4 py-4">
                    <div className="font-semibold text-ink">{task.clientName}</div>
                    <div className="mt-1 max-w-56 text-xs leading-5 text-slate-500">{task.propertyAddress}</div>
                  </td>
                  <td className="px-4 py-4 text-slate-700">{task.transactionStage}</td>
                  <td className="min-w-64 px-4 py-4">
                    <div className="font-semibold text-ink">{task.task}</div>
                    {task.notes ? <div className="mt-1 max-w-xl text-xs leading-5 text-slate-500">{task.notes}</div> : null}
                  </td>
                  <td className="px-4 py-4 text-slate-700">{task.assignedTo}</td>
                  <td className="space-y-2 px-4 py-4">
                    <UrgencyBadge category={category} />
                    <div className="text-xs font-medium text-slate-500">{task.status}</div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
