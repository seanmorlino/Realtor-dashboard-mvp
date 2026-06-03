# AGENTS.md

## Project overview

This project is Version 1 of a SaaS-ready dashboard for realtors.

The goal is to help real estate agents connect or upload spreadsheet-based task data and immediately see urgent tasks based on dates.

The long-term goal is to eventually sell this as a subscription product, but Version 1 should stay focused on proving the core workflow:

**Spreadsheet in -> urgent realtor tasks out.**

## Core tasks

Codex should prioritize the following tasks:

1. Build a clean realtor dashboard that reads task data from Excel files or public/published Google Sheets CSV links.
2. Classify tasks by urgency using due dates, status, and priority.
3. Pull urgent tasks to the foreground, especially overdue tasks, tasks due today, tasks due within 7 days, and high-priority upcoming tasks.
4. Provide filters and sorting for status, priority, due date, transaction stage, assigned person, and client.
5. Store loaded spreadsheet data and settings locally for Version 1.
6. Keep the code organized so authentication, subscriptions, CRM integrations, and AI features can be added later.

## Version 1 constraints

Do not build payment processing yet.

Do not build user authentication yet unless explicitly requested.

Do not build MLS integration.

Do not build full CRM functionality.

Do not build AI automation yet.

Do not add a backend unless it is clearly needed for the requested task.

Do not store private customer data on an external server in Version 1.

Do not assume private Google Sheets can be accessed. If a Google Sheet cannot be loaded, show a clear error explaining that the sheet must be shared publicly or published as a CSV for Version 1.

Do not overcomplicate the app. The first version should prove the dashboard concept with spreadsheet data.

## Expected stack

Use React, TypeScript, Vite, and Tailwind CSS unless the user asks for a different stack.

Use a client-side Excel parser such as SheetJS/xlsx.

Use localStorage for Version 1 persistence.

Keep components reusable and easy to upgrade later.

## Expected spreadsheet columns

The dashboard should work best with these columns:

- Client Name
- Property Address
- Task
- Due Date
- Status
- Priority
- Notes
- Transaction Stage
- Assigned To

Also support common variations:

- Client instead of Client Name
- Address instead of Property Address
- Deadline instead of Due Date
- Stage instead of Transaction Stage
- Owner or Agent instead of Assigned To

## Urgency rules

Classify incomplete tasks as:

- Overdue: due date is before today
- Due Today: due date is today
- Due Soon: due within the next 7 days
- Upcoming: due within the next 30 days

Treat these statuses as completed:

- complete
- completed
- done
- closed
- finished

Urgent tasks should be shown in this order:

1. Overdue
2. Due Today
3. Due Soon
4. High-priority upcoming tasks

## UI expectations

The interface should feel like a clean SaaS dashboard for real estate professionals.

Include:

- Sidebar navigation
- Dashboard summary cards
- Urgent Tasks panel
- Full task table
- Filters and sorting
- Data Sources page
- Settings page
- Demo data
- Clear empty states and error messages

## Suggested navigation

The app should include the following navigation sections:

- Dashboard
- Tasks
- Clients
- Data Sources
- Settings

For Version 1, Dashboard, Tasks, Data Sources, and Settings should function. The Clients page can be a placeholder unless the user requests otherwise.

## Data Sources page requirements

The Data Sources page should allow users to:

- Upload an Excel workbook
- Paste a Google Sheets link
- Paste a published CSV link
- See the currently loaded data source
- Refresh or reload the source
- View parsing errors
- See a short explanation of the expected spreadsheet format

## Settings page requirements

The Settings page should allow users to edit:

- Urgent task window, default 7 days
- Upcoming task window, default 30 days
- Business name
- User name

Store settings in localStorage for Version 1.

## Error handling requirements

Add helpful error states for:

- No data loaded
- Invalid spreadsheet format
- Missing due date column
- Invalid date values
- Private Google Sheet that cannot be accessed
- Empty workbook
- Unsupported file type
- Data source failed to refresh

Error messages should be understandable to a non-technical realtor.

## Code quality expectations

Use clear TypeScript types.

Create or maintain types for:

- Task
- DataSource
- DashboardMetrics
- UserSettings

Keep files organized into:

- components/
- pages/
- utils/
- hooks/
- types/
- data/

Prefer small, reusable components over large single-file pages.

Avoid hard-coding important business rules directly into UI components. Put urgency and parsing logic in utility files when possible.

## Testing and validation

After making changes, run the appropriate checks such as:

- pnpm install, if dependencies are missing
- pnpm dev, when needed
- pnpm build
- pnpm lint, if linting is configured

Fix broken imports, TypeScript errors, obvious runtime errors, and obvious UI issues before finishing.

## Completion standard

A task is not complete unless:

- The dashboard still loads.
- Demo data works.
- Uploaded Excel data can be parsed.
- Public or published Google Sheets CSV data can be loaded.
- Urgent tasks are correctly classified and displayed.
- Completed tasks do not appear as urgent.
- The app remains understandable to a non-technical realtor.

## Do not build yet

Unless the user specifically asks, do not build the following in Version 1:

- Stripe or subscription billing
- Full login/authentication
- MLS integration
- CRM integration
- Team permissions
- Automated emails or text reminders
- AI-generated task summaries
- Production database storage
- Complex admin dashboard

Focus on proving that spreadsheet-based realtor task data can be transformed into a useful daily dashboard.
