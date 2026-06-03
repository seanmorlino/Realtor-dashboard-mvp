export type Priority = "Critical" | "High" | "Medium" | "Low" | "Unspecified";

export type DataSourceType = "none" | "demo" | "excel" | "google-sheet" | "csv";

export type UrgencyCategory =
  | "overdue"
  | "today"
  | "soon"
  | "upcoming"
  | "future"
  | "completed"
  | "no-date";

export type AppPage = "dashboard" | "tasks" | "clients" | "sources" | "settings";

export type SortKey = "dueDate" | "priority" | "clientName" | "transactionStage";

export interface Task {
  id: string;
  clientName: string;
  propertyAddress: string;
  task: string;
  dueDate: string | null;
  status: string;
  priority: Priority;
  notes: string;
  transactionStage: string;
  assignedTo: string;
  sourceId: string;
  sourceName: string;
  importedAt: string;
}

export interface DataSource {
  id: string;
  type: DataSourceType;
  name: string;
  url?: string;
  loadedAt: string;
  rowCount: number;
  errors: string[];
}

export interface DashboardMetrics {
  overdue: number;
  dueToday: number;
  dueSoon: number;
  upcomingClosings: number;
  openTasks: number;
  completed: number;
}

export interface UserSettings {
  urgentWindowDays: number;
  upcomingWindowDays: number;
  businessName: string;
  userName: string;
}

export interface TaskFilters {
  status: string;
  priority: string;
  transactionStage: string;
  assignedTo: string;
  dueRange: string;
  search: string;
}

export interface TaskSort {
  key: SortKey;
  direction: "asc" | "desc";
}

export interface AppStateSnapshot {
  tasks: Task[];
  dataSource: DataSource;
}

export interface ParseResult {
  tasks: Task[];
  errors: string[];
  warnings: string[];
}
