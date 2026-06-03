import { Search, SlidersHorizontal } from "lucide-react";
import type { Task, TaskFilters, TaskSort } from "../types";
import { uniqueValues } from "../utils/tasks";

interface TaskFiltersProps {
  tasks: Task[];
  filters: TaskFilters;
  sort: TaskSort;
  onFiltersChange: (filters: TaskFilters) => void;
  onSortChange: (sort: TaskSort) => void;
}

const dueOptions = [
  ["all", "All dates"],
  ["overdue", "Overdue"],
  ["today", "Due today"],
  ["next7", "Next 7 days"],
  ["next30", "Next 30 days"],
  ["no-date", "No date"],
  ["completed", "Completed"]
];

export function TaskFiltersPanel({ tasks, filters, sort, onFiltersChange, onSortChange }: TaskFiltersProps) {
  const setFilter = (key: keyof TaskFilters, value: string) => onFiltersChange({ ...filters, [key]: value });

  return (
    <section className="rounded-lg border border-line bg-paper p-4 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
        <label className="flex min-w-56 flex-1 flex-col gap-1 text-sm font-medium text-slate-600">
          Search
          <span className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="h-10 w-full rounded-md border border-line bg-white pl-9 pr-3 text-sm text-ink outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              value={filters.search}
              onChange={(event) => setFilter("search", event.target.value)}
              placeholder="Client, task, address"
              type="search"
            />
          </span>
        </label>

        <FilterSelect label="Status" value={filters.status} onChange={(value) => setFilter("status", value)} options={uniqueValues(tasks, "status")} />
        <FilterSelect label="Priority" value={filters.priority} onChange={(value) => setFilter("priority", value)} options={uniqueValues(tasks, "priority")} />
        <FilterSelect
          label="Stage"
          value={filters.transactionStage}
          onChange={(value) => setFilter("transactionStage", value)}
          options={uniqueValues(tasks, "transactionStage")}
        />
        <FilterSelect label="Assigned" value={filters.assignedTo} onChange={(value) => setFilter("assignedTo", value)} options={uniqueValues(tasks, "assignedTo")} />

        <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
          Due
          <select
            className="h-10 rounded-md border border-line bg-white px-3 text-sm text-ink outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            value={filters.dueRange}
            onChange={(event) => setFilter("dueRange", event.target.value)}
          >
            {dueOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
          Sort
          <select
            className="h-10 rounded-md border border-line bg-white px-3 text-sm text-ink outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            value={`${sort.key}:${sort.direction}`}
            onChange={(event) => {
              const [key, direction] = event.target.value.split(":") as [TaskSort["key"], TaskSort["direction"]];
              onSortChange({ key, direction });
            }}
          >
            <option value="dueDate:asc">Due date</option>
            <option value="priority:asc">Priority</option>
            <option value="clientName:asc">Client name</option>
            <option value="transactionStage:asc">Stage</option>
          </select>
        </label>

        <button
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-line px-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          type="button"
          onClick={() =>
            onFiltersChange({
              status: "all",
              priority: "all",
              transactionStage: "all",
              assignedTo: "all",
              dueRange: "all",
              search: ""
            })
          }
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          Reset
        </button>
      </div>
    </section>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
      {label}
      <select
        className="h-10 min-w-36 rounded-md border border-line bg-white px-3 text-sm text-ink outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="all">All</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
