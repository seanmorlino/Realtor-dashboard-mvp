import { AlertTriangle, CalendarClock, CalendarDays, CheckCircle2 } from "lucide-react";
import type { Task, TaskSort, UserSettings } from "../types";
import { EmptyState } from "../components/EmptyState";
import { MetricCard } from "../components/MetricCard";
import { PriorityBadge } from "../components/PriorityBadge";
import { TaskTable } from "../components/TaskTable";
import { UrgencyBadge } from "../components/UrgencyBadge";
import { formatDate, formatRelativeDue } from "../utils/dates";
import { calculateMetrics, classifyTask, urgentTasks } from "../utils/tasks";

interface DashboardPageProps {
  tasks: Task[];
  settings: UserSettings;
  sort: TaskSort;
  onSortChange: (sort: TaskSort) => void;
}

export function DashboardPage({ tasks, settings, sort, onSortChange }: DashboardPageProps) {
  const metrics = calculateMetrics(tasks, settings);
  const urgent = urgentTasks(tasks, settings);
  const tableTasks = urgent.slice(0, 8);
  const hasNoData = tasks.length === 0;

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Overdue tasks" value={metrics.overdue} icon={AlertTriangle} tone="bg-red-50 text-red-700" />
        <MetricCard label="Due today" value={metrics.dueToday} icon={CalendarClock} tone="bg-amber-50 text-amber-700" />
        <MetricCard label={`Next ${settings.urgentWindowDays} days`} value={metrics.dueSoon} icon={CalendarDays} tone="bg-sky-50 text-sky-700" />
        <MetricCard label="Upcoming closings" value={metrics.upcomingClosings} icon={CheckCircle2} tone="bg-emerald-50 text-emerald-700" />
      </section>

      <section className="rounded-lg border border-line bg-paper p-4 shadow-panel">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-normal text-ink">Urgent Tasks</h2>
            <p className="mt-1 text-sm text-slate-500">{urgent.length} tasks need attention</p>
          </div>
          <div className="text-sm font-medium text-slate-500">{metrics.openTasks} open tasks</div>
        </div>

        <div className="mt-4 grid gap-3 xl:grid-cols-2">
          {hasNoData ? (
            <div className="xl:col-span-2">
              <EmptyState
                title="No task data loaded"
                body="Open Data Sources to upload an Excel workbook or load a public Google Sheets CSV link."
              />
            </div>
          ) : null}
          {!hasNoData && urgent.slice(0, 6).map((task) => {
            const category = classifyTask(task, settings);

            return (
              <article key={task.id} className="rounded-lg border border-line bg-white p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-ink">{task.task}</p>
                    <p className="mt-1 text-sm text-slate-500">{task.clientName}</p>
                  </div>
                  <UrgencyBadge category={category} />
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <PriorityBadge priority={task.priority} />
                  <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">{task.transactionStage}</span>
                  <span className="rounded-md bg-white px-2 py-1 text-xs font-semibold text-slate-500 ring-1 ring-line">{task.assignedTo}</span>
                </div>
                <div className="mt-3 flex flex-wrap justify-between gap-3 text-xs text-slate-500">
                  <span>{formatDate(task.dueDate)}</span>
                  <span>{formatRelativeDue(task.dueDate)}</span>
                </div>
              </article>
            );
          })}
          {!hasNoData && urgent.length === 0 ? (
            <div className="rounded-lg border border-dashed border-line bg-white p-8 text-center text-sm text-slate-500 xl:col-span-2">
              No urgent tasks right now.
            </div>
          ) : null}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-normal text-ink">Task Table</h2>
          <p className="text-sm text-slate-500">{hasNoData ? "Load a source to populate this table" : "Showing top priority rows"}</p>
        </div>
        <TaskTable tasks={tableTasks} settings={settings} sort={sort} onSortChange={onSortChange} />
      </section>
    </div>
  );
}
