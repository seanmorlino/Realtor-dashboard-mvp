# Vercel Deployment Guide

Use this checklist to import the GitHub repo into Vercel.

## Vercel Project Settings

- Framework Preset: `Vite`
- Root Directory: repository root, unless this project lives inside a parent repo. If it does, set the root directory to `Command Center Dashboard`.
- Install Command: `pnpm install --frozen-lockfile`
- Build Command: `pnpm build`
- Output Directory: `dist`
- Environment Variables: none required for Version 1

These settings are also captured in `vercel.json` so Vercel can read them from the repo.

## Upload to GitHub

Commit and push these project files and folders:

- `.github/`
- `.gitignore`
- `.node-version`
- `.env.example`
- `.vercelignore`
- `AGENTS.md`
- `LICENSE`
- `README.md`
- `docs/`
- `index.html`
- `package.json`
- `pnpm-lock.yaml`
- `pnpm-workspace.yaml`
- `postcss.config.js`
- `src/`
- `tailwind.config.js`
- `tsconfig.json`
- `tsconfig.app.json`
- `vercel.json`

Optional legacy/local files currently in the folder can be kept in GitHub, but they are not required by the Vite/Vercel build:

- `app.js`
- `server.mjs`
- `styles.css`
- `data/`

## Do Not Upload

These are generated, local, or machine-specific files and should stay out of GitHub and Vercel:

- `node_modules/`
- `dist/`
- `.tools/`
- `.pnpm-store/`
- `dashboard-preview.png`
- `.env`
- log files
- coverage or test report folders

## Import on Vercel

1. Push the files above to GitHub.
2. In Vercel, choose Add New Project.
3. Import the GitHub repository.
4. Confirm the project settings listed above.
5. Deploy.

After deployment, Vercel will install dependencies with pnpm, run `pnpm build`, and serve the generated `dist` folder.
