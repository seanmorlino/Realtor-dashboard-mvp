# Google Docs Setup

The dashboard can use Google Docs in two practical ways.

## Option 1: Published Text URLs

Use this when the docs can be published to the web.

1. In Google Docs, choose `File > Share > Publish to web`.
2. Publish the document.
3. Use the text output URL in `data/source-config.local.json`.

```json
{
  "sources": [
    {
      "id": "ops-brief",
      "name": "Operations Brief",
      "type": "publishedText",
      "url": "https://docs.google.com/document/d/e/PUBLISHED_DOC_ID/pub?output=txt"
    }
  ]
}
```

Then run:

```powershell
node server.mjs
```

The dashboard reads `/api/tasks`, and the server fetches and parses the docs.

## Option 2: JSON Endpoint

Use this when docs should stay private or when a separate process already reads them.

An Apps Script starter is included at `docs/apps-script-json-endpoint.js`.

Point the dashboard at any endpoint that returns:

```json
{
  "generatedAt": "2026-05-19T09:00:00-04:00",
  "sources": [
    {
      "id": "ops-brief",
      "name": "Operations Brief",
      "url": "https://docs.google.com/document/d/...",
      "lastUpdated": "2026-05-19T09:00:00-04:00",
      "status": "connected"
    }
  ],
  "tasks": [
    {
      "id": "ops-access-review",
      "title": "Renew vendor access review",
      "owner": "Sean",
      "area": "Operations",
      "dueDate": "2026-05-19",
      "status": "Open",
      "priority": "Critical",
      "sourceId": "ops-brief",
      "sourceName": "Operations Brief",
      "link": "https://docs.google.com/document/d/...",
      "notes": "Blocks onboarding."
    }
  ]
}
```

In the dashboard, open source settings and set the endpoint URL.

## Table Schema

Recommended document table:

```text
Task | Owner | Due | Status | Priority | Area | Notes | Link
```

Dates should be `YYYY-MM-DD` when possible. Other readable date formats are accepted by the browser, but ISO dates are more predictable.

Statuses recognized as complete:

```text
Done, Complete, Completed, Closed, Cancelled, Canceled
```

Statuses recognized as blocked:

```text
Blocked, Waiting, Stalled
```
