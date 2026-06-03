# Realtor Command Center

A frontend Version 1 SaaS-ready dashboard for real estate agents. The app loads task data from Excel workbooks or public Google Sheets/CSV links, persists the data locally, and surfaces urgent realtor tasks by due date.

## Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- SheetJS/xlsx
- pnpm 11
- Node 20.11 or newer

## Features

- React, TypeScript, Vite, and Tailwind CSS frontend.
- Empty dashboard on first load so shared Vercel links are ready for fresh data testing.
- Demo realtor task data available from the Data Sources page.
- Excel workbook upload for `.xlsx` and `.xls` using SheetJS.
- Public Google Sheets and published CSV loading, including conversion of normal Google Sheets URLs to CSV export URLs when possible.
- Due-date urgency classification for overdue, due today, due soon, upcoming, completed, and no-date tasks.
- Dashboard metrics, urgent task panel, full task table, filters, sorting, and responsive sidebar navigation.
- Data source page with upload/link loading, source status, parsing errors, and expected column guidance.
- Delete the current source and reset tasks from the Data Sources page when you want a blank dashboard for fresh testing.
- Settings page for urgent/upcoming windows, business name, and user name.
- LocalStorage persistence for tasks, loaded source details, and settings.

## Expected Spreadsheet Columns

The parser works best with:

```text
Client Name | Property Address | Task | Due Date | Status | Priority | Notes | Transaction Stage | Assigned To
```

Common variations are accepted, including `Client`, `Address`, `Deadline`, `Stage`, `Owner`, and `Assignee`.

## Run Locally

This project uses pnpm for dependency management and scripts.

Use the Node version in `.node-version` when possible.

Install dependencies:

```powershell
pnpm install
```

Start the dev server:

```powershell
pnpm dev
```

Open the URL shown by Vite, usually `http://127.0.0.1:5173`.

Build and type-check:

```powershell
pnpm build
```

Preview the production build:

```powershell
pnpm preview
```

## Project Structure

```text
src/
  components/  Reusable dashboard UI
  data/        Demo realtor task data
  pages/       Dashboard, tasks, sources, settings, clients
  types/       Shared TypeScript models
  utils/       Date, parsing, storage, and urgency logic
```

GitHub Actions runs `pnpm install --frozen-lockfile` and `pnpm build` on pushes to `main` and pull requests.

## Deploy to Vercel

This repo includes `vercel.json` and `.vercelignore` for Vercel deployment.

Use these settings when importing the GitHub repo into Vercel:

- Framework Preset: `Vite`
- Install Command: `pnpm install --frozen-lockfile`
- Build Command: `pnpm build`
- Output Directory: `dist`

See [docs/vercel-deployment.md](docs/vercel-deployment.md) for the full upload checklist.

## Google Sheets Notes

Version 1 reads public or published CSV data only. Private spreadsheets will show an error until the sheet is shared publicly or published as CSV.

For a normal Google Sheets link, the app tries to convert:

```text
https://docs.google.com/spreadsheets/d/<sheet-id>/edit#gid=0
```

into:

```text
https://docs.google.com/spreadsheets/d/<sheet-id>/export?format=csv&gid=0
```

## Version 1 Boundaries

This build intentionally does not include MLS integration, payments, authentication, multi-user permissions, or AI automation. The code is organized so those can be added later without changing the core task import and urgency workflow.

## License

This project is proprietary and currently marked `UNLICENSED`.
