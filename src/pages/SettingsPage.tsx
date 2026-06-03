import type { UserSettings } from "../types";

interface SettingsPageProps {
  settings: UserSettings;
  onSettingsChange: (settings: UserSettings) => void;
}

export function SettingsPage({ settings, onSettingsChange }: SettingsPageProps) {
  const update = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <div className="max-w-3xl space-y-4">
      <div>
        <h2 className="text-xl font-semibold tracking-normal text-ink">Settings</h2>
        <p className="text-sm text-slate-500">Preferences are saved in this browser.</p>
      </div>

      <section className="rounded-lg border border-line bg-paper p-4 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
            Business name
            <input
              className="h-11 rounded-md border border-line px-3 text-sm text-ink outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              value={settings.businessName}
              onChange={(event) => update("businessName", event.target.value)}
            />
          </label>

          <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
            User name
            <input
              className="h-11 rounded-md border border-line px-3 text-sm text-ink outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              value={settings.userName}
              onChange={(event) => update("userName", event.target.value)}
            />
          </label>

          <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
            Urgent task window
            <input
              className="h-11 rounded-md border border-line px-3 text-sm text-ink outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              min={1}
              max={30}
              type="number"
              value={settings.urgentWindowDays}
              onChange={(event) => update("urgentWindowDays", Number(event.target.value) || 7)}
            />
          </label>

          <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
            Upcoming task window
            <input
              className="h-11 rounded-md border border-line px-3 text-sm text-ink outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              min={7}
              max={120}
              type="number"
              value={settings.upcomingWindowDays}
              onChange={(event) => update("upcomingWindowDays", Number(event.target.value) || 30)}
            />
          </label>
        </div>
      </section>
    </div>
  );
}
