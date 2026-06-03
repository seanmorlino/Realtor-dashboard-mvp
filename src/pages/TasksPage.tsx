import type { Task, TaskFilters, TaskSort, UserSettings } from "../types";
import { TaskFiltersPanel } from "../components/TaskFilters";
import { TaskTable } from "../components/TaskTable";
import { filterTasks, sortTasks } from "../utils/tasks";

interface TasksPageProps {
  tasks: Task[];
  settings: UserSettings;
  filters: TaskFilters;
  sort: TaskSort;
  onFiltersChange: (filters: TaskFilters) => void;
  onSortChange: (sort: TaskSort) => void;
}

export function TasksPage({ tasks, settings, filters, sort, onFiltersChange, onSortChange }: TasksPageProps) {
  const filtered = sortTasks(filterTasks(tasks, filters, settings), sort, settings);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-normal text-ink">Tasks</h2>
          <p className="text-sm text-slate-500">{filtered.length} of {tasks.length} tasks shown</p>
        </div>
      </div>
      <TaskFiltersPanel tasks={tasks} filters={filters} sort={sort} onFiltersChange={onFiltersChange} onSortChange={onSortChange} />
      <TaskTable tasks={filtered} settings={settings} sort={sort} onSortChange={onSortChange} />
    </div>
  );
}
