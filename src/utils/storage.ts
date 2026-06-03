import type { AppStateSnapshot, Task, UserSettings } from "../types";
import { demoDataSource, sampleTasks } from "../data/sampleTasks";

const TASKS_KEY = "realtorDashboard.tasks.v1";
const SETTINGS_KEY = "realtorDashboard.settings.v1";

export const defaultSettings: UserSettings = {
  urgentWindowDays: 7,
  upcomingWindowDays: 30,
  businessName: "Northstar Realty",
  userName: "Sean"
};

export function loadTasksSnapshot(): AppStateSnapshot {
  const stored = localStorage.getItem(TASKS_KEY);
  if (!stored) {
    return { tasks: sampleTasks, dataSource: demoDataSource };
  }

  try {
    const parsed = JSON.parse(stored) as AppStateSnapshot;
    if (!Array.isArray(parsed.tasks) || !parsed.dataSource) {
      throw new Error("Invalid stored task data");
    }
    return parsed;
  } catch {
    return { tasks: sampleTasks, dataSource: demoDataSource };
  }
}

export function saveTasksSnapshot(snapshot: AppStateSnapshot): void {
  localStorage.setItem(TASKS_KEY, JSON.stringify(snapshot));
}

export function restoreDemoData(): AppStateSnapshot {
  const snapshot = { tasks: sampleTasks, dataSource: demoDataSource };
  saveTasksSnapshot(snapshot);
  return snapshot;
}

export function loadSettings(): UserSettings {
  const stored = localStorage.getItem(SETTINGS_KEY);
  if (!stored) return defaultSettings;

  try {
    return { ...defaultSettings, ...(JSON.parse(stored) as Partial<UserSettings>) };
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(settings: UserSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function createSnapshot(tasks: Task[], source: AppStateSnapshot["dataSource"]): AppStateSnapshot {
  return { tasks, dataSource: source };
}
