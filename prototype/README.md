# Wait Simulator

An unnecessarily advanced waiting experience.

## Development

Requires Node.js 22 or newer. No package dependencies or API keys are required.

```powershell
node server.cjs
```

Open http://127.0.0.1:5173. Saving files in `dist/` reloads the browser automatically. Stop with Ctrl+C. If npm is available, `npm run dev` runs the same server.

To change the port in PowerShell, set `$env:PORT = '5174'` before starting.

## Validation

```powershell
node scripts/check.cjs
```

Checks JavaScript syntax, local HTML asset references, and JSON configuration. `npm run check` is equivalent when npm is available.

## Files

- `dist/index.html`: page layout and metadata.
- `dist/style.css`: responsive theme and animations.
- `dist/app.js`: scenarios, timers, scoring, achievements, and storage.
- `server.cjs`: local development server and live reload.
- `scripts/check.cjs`: source validation.
- `.openai/hosting.json`: existing Sites identity and static directory.

`dist/` contains authored source, not generated output. Keep it tracked in Git. No build step is required. Live reload is injected only by the development server and is not included in published assets.

## Storage

The browser stores sessions and achievements under `wait-simulator-v1` in localStorage. Local and hosted URLs have separate data. No database or account setup is needed. Google Fonts is optional; system fonts work offline.

## Manual smoke check

1. Choose a scenario and start waiting.
2. Check again; inspect the feed and patience score.
3. Refresh; confirm the session continues.
4. Finish or give up; inspect the report and statistics.
5. Check mobile layout, keyboard controls, and reduced-motion mode.

## Publishing

The private site is https://wait-simulator-sixseven.dear-clove-2073.chatgpt.site. Local changes do not publish automatically. Reuse the existing Sites project identity for updates. Never commit credentials.
