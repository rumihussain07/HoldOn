# Wait Simulator

Local React + TypeScript project powered by Vite. Motion handles animation; Lucide provides icons.

## Run

Requires Node.js 22.12 or newer and pnpm.

```sh
pnpm install
pnpm dev
```

Open the URL printed in your terminal. Vite updates the page when you save a file.

```sh
pnpm check    # TypeScript checks
pnpm build    # Check types and produce dist/
pnpm preview  # Preview the production build
pnpm format   # Format source
```

On this machine, if pnpm is not on PATH, use the included PowerShell wrapper:

```powershell
.\dev.ps1
.\dev.ps1 build
.\dev.ps1 check
```

## Start coding

- `src/App.tsx`: main application component.
- `src/components/`: reusable UI components.
- `src/hooks/`: React hooks, such as a waiting timer.
- `src/lib/`: helpers and scenario data.
- `src/styles/global.css`: styles and theme.
- `src/assets/`: imported images and assets.
- `public/`: files served directly.
- `vite.config.ts`: development and build configuration.

The earlier static implementation is preserved in `prototype/` for reference. The starter does not use it. `dist/` is now generated build output; edit `src/` instead.

No backend, database, or API keys are needed to start. This setup is local; it does not change the published website. Commit the pnpm lockfile when updating dependencies.
