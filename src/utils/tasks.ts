import type { DashboardMetrics, Task, TaskFilters, TaskSort, UrgencyCategory, UserSettings } from "../types";
import { dateDiffInDays, toDateOnly } from "./dates";
import { priorityRank } from "./parser";

const completeStatuses = new Set(["complete", "completed", "done", "closed", "finished"]);

export function isComplete(task: Task): boolean {
  return completeStatuses.has(task.status.trim().toLowerCase());
}

export function classifyTask(task: Task, settings: UserSettings, today = toDateOnly()): UrgencyCategory {
  if (isComplete(task)) return "completed";

  const diff = dateDiffInDays(task.dueDate, today);
  if (diff === null) return "no-date";
  if (diff < 0) return "overdue";
  if (diff === 0) return "today";
  if (diff <= settings.urgentWindowDays) return "soon";
  if (diff <= settings.upcomingWindowDays) return "upcoming";
  return "future";
}

export function calculateMetrics(tasks: Task[], settings: UserSettings): DashboardMetrics {
  return tasks.reduce<DashboardMetrics>(
    (metrics, task) => {
      const category = classifyTask(task, settings);

      if (category === "overdue") metrics.overdue += 1;
      if (category === "today") metrics.dueToday += 1;
      if (category === "soon") metrics.dueSoon += 1;
      if (category === "completed") metrics.completed += 1;
      if (!isComplete(task)) metrics.openTasks += 1;

      const diff = dateDiffInDays(task.dueDate);
      const closingText = `${task.task} ${task.transactionStage}`.toLowerCase();
      if (!isComplete(task) && diff !== null && diff >= 0 && diff <= settings.upcomingWindowDays && closingText.includes("closing")) {
        metrics.upcomingClosings += 1;
      }

      return metrics;
    },
    {
      overdue: 0,
      dueToday: 0,
      dueSoon: 0,
      upcomingClosings: 0,
      openTasks: 0,
      completed: 0
    }
  );
}

export function urgentTasks(tasks: Task[], settings: UserSettings): Task[] {
  return sortTasks(
    tasks.filter((task) => {
      const category = classifyTask(task, settings);
      const highPriorityUpcoming = category === "upcoming" && ["Critical", "High"].includes(task.priority);
      return ["overdue", "today", "soon"].includes(category) || highPriorityUpcoming;
    }),
    { key: "dueDate", direction: "asc" },
    settings
  );
}

export function filterTasks(tasks: Task[], filters: TaskFilters, settings: UserSettings): Task[] {
  const search = filters.search.trim().toLowerCase();

  return tasks.filter((task) => {
    if (filters.status !== "all" && task.status !== filters.status) return false;
    if (filters.priority !== "all" && task.priority !== filters.priority) return false;
    if (filters.transactionStage !== "all" && task.transactionStage !== filters.transactionStage) return false;
    if (filters.assignedTo !== "all" && task.assignedTo !== filters.assignedTo) return false;

    const category = classifyTask(task, settings);
    if (filters.dueRange !== "all") {
      if (filters.dueRange === "next7" && !["today", "soon"].includes(category)) return false;
      else if (filters.dueRange === "next30" && !["today", "soon", "upcoming"].includes(category)) return false;
      else if (filters.dueRange !== "next7" && filters.dueRange !== "next30" && filters.dueRange !== category) return false;
    }

    if (!search) return true;

    return [
      task.clientName,
      task.propertyAddress,
      task.task,
      task.status,
      task.priority,
      task.notes,
      task.transactionStage,
      task.assignedTo
    ]
      .join(" ")
      .toLowerCase()
      .includes(search);
  });
}

export function sortTasks(tasks: Task[], sort: TaskSort, settings: UserSettings): Task[] {
  return [...tasks].sort((a, b) => {
    const urgencyDelta = urgencyRank(classifyTask(a, settings)) - urgencyRank(classifyTask(b, settings));
    if (sort.key === "dueDate" && urgencyDelta !== 0) return urgencyDelta;

    let delta = 0;
    if (sort.key === "dueDate") {
      delta = dateValue(a.dueDate) - dateValue(b.dueDate);
    } else if (sort.key === "priority") {
      delta = priorityRank(a.priority) - priorityRank(b.priority);
    } else if (sort.key === "clientName") {
      delta = a.clientName.localeCompare(b.clientName);
    } else {
      delta = a.transactionStage.localeCompare(b.transactionStage);
    }

    if (delta === 0) {
      delta = priorityRank(a.priority) - priorityRank(b.priority);
    }

    return sort.direction === "asc" ? delta : -delta;
  });
}

export function uniqueValues(tasks: Task[], key: keyof Task): string[] {
  return Array.from(new Set(tasks.map((task) => String(task[key] || "").trim()).filter(Boolean))).sort((a, b) =>
    a.localeCompare(b)
  );
}

function dateValue(date: string | null): number {
  if (!date) return Number.MAX_SAFE_INTEGER;
  return new Date(`${date}T00:00:00`).getTime();
}

function urgencyRank(category: UrgencyCategory): number {
  const order: UrgencyCategory[] = ["overdue", "today", "soon", "upcoming", "future", "no-date", "completed"];
  return order.indexOf(category);
}
