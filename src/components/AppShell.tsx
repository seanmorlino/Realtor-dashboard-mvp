import {
  Building2,
  CheckSquare,
  Database,
  LayoutDashboard,
  Settings,
  Users
} from "lucide-react";
import type { AppPage, DataSource, UserSettings } from "../types";

interface AppShellProps {
  activePage: AppPage;
  settings: UserSettings;
  dataSource: DataSource;
  onNavigate: (page: AppPage) => void;
  children: React.ReactNode;
}

const navItems: { page: AppPage; label: string; icon: typeof LayoutDashboard }[] = [
  { page: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { page: "tasks", label: "Tasks", icon: CheckSquare },
  { page: "clients", label: "Clients", icon: Users },
  { page: "sources", label: "Data Sources", icon: Database },
  { page: "settings", label: "Settings", icon: Settings }
];

export function AppShell({ activePage, settings, dataSource, onNavigate, children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-mist text-ink">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-line bg-white px-4 py-5 lg:block">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-ink text-white">
            <Building2 className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold text-ink">{settings.businessName}</p>
            <p className="text-xs text-slate-500">Task command center</p>
          </div>
        </div>

        <nav className="mt-8 space-y-1">
          {navItems.map(({ page, label, icon: Icon }) => (
            <button
              key={page}
              className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-semibold transition ${
                activePage === page ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-ink"
              }`}
              type="button"
              onClick={() => onNavigate(page)}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-5 left-4 right-4 rounded-lg border border-line bg-slate-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-normal text-slate-500">Current source</p>
          <p className="mt-1 truncate text-sm font-semibold text-ink">{dataSource.name}</p>
          <p className="mt-1 text-xs text-slate-500">{dataSource.rowCount} rows loaded</p>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 border-b border-line bg-white/95 backdrop-blur">
          <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-8">
            <div>
              <p className="text-sm font-medium text-slate-500">Welcome back, {settings.userName}</p>
              <h1 className="text-xl font-semibold tracking-normal text-ink sm:text-2xl">Realtor task dashboard</h1>
            </div>
            <div className="flex gap-2 overflow-x-auto lg:hidden">
              {navItems.map(({ page, label, icon: Icon }) => (
                <button
                  key={page}
                  className={`inline-flex h-9 shrink-0 items-center gap-2 rounded-md px-3 text-sm font-semibold ${
                    activePage === page ? "bg-slate-900 text-white" : "border border-line bg-white text-slate-600"
                  }`}
                  type="button"
                  onClick={() => onNavigate(page)}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </header>

        <main className="px-4 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
