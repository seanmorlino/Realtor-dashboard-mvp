import { useEffect, useMemo, useState } from "react";
import { AppShell } from "./components/AppShell";
import { DashboardPage } from "./pages/DashboardPage";
import { TasksPage } from "./pages/TasksPage";
import { DataSourcesPage } from "./pages/DataSourcesPage";
import { SettingsPage } from "./pages/SettingsPage";
import { ClientsPage } from "./pages/ClientsPage";
import type { AppPage, AppStateSnapshot, TaskFilters, TaskSort, UserSettings } from "./types";
import { loadSettings, loadTasksSnapshot, saveSettings, saveTasksSnapshot } from "./utils/storage";

const defaultFilters: TaskFilters = {
  status: "all",
  priority: "all",
  transactionStage: "all",
  assignedTo: "all",
  dueRange: "all",
  search: ""
};

const defaultSort: TaskSort = {
  key: "dueDate",
  direction: "asc"
};

export default function App() {
  const [activePage, setActivePage] = useState<AppPage>("dashboard");
  const [snapshot, setSnapshot] = useState<AppStateSnapshot>(() => loadTasksSnapshot());
  const [settings, setSettings] = useState<UserSettings>(() => loadSettings());
  const [filters, setFilters] = useState<TaskFilters>(defaultFilters);
  const [sort, setSort] = useState<TaskSort>(defaultSort);

  useEffect(() => {
    saveTasksSnapshot(snapshot);
  }, [snapshot]);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const currentPage = useMemo(() => {
    if (activePage === "dashboard") {
      return <DashboardPage tasks={snapshot.tasks} settings={settings} sort={sort} onSortChange={setSort} />;
    }

    if (activePage === "tasks") {
      return (
        <TasksPage
          tasks={snapshot.tasks}
          settings={settings}
          filters={filters}
          sort={sort}
          onFiltersChange={setFilters}
          onSortChange={setSort}
        />
      );
    }

    if (activePage === "sources") {
      return <DataSourcesPage dataSource={snapshot.dataSource} onSnapshotLoaded={setSnapshot} />;
    }

    if (activePage === "settings") {
      return <SettingsPage settings={settings} onSettingsChange={setSettings} />;
    }

    return <ClientsPage tasks={snapshot.tasks} />;
  }, [activePage, filters, settings, snapshot, sort]);

  return (
    <AppShell activePage={activePage} settings={settings} dataSource={snapshot.dataSource} onNavigate={setActivePage}>
      {currentPage}
    </AppShell>
  );
}
