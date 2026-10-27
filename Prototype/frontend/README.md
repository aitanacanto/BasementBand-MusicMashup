# Basement Band · Frontend

React and TypeScript interface for the Music Mashup-241 project, built with Vite. It includes the welcome page, song selection, audio waveform players and a multitrack workspace.

## Local interface

```sh
npm ci
npm run dev
```

Run these commands in this folder. Open the URL printed by Vite, normally `http://localhost:5173`. The current frontend calls the backend at `http://localhost:50000`.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run build` | Produce the frontend bundle with Vite. |
| `npm run preview` | Preview a generated build locally. |
| `npx tsc --noEmit` | Run the separate TypeScript check; the original code currently reports diagnostics. |

The package still contains some dependencies inherited from Create React App, but its active scripts use Vite. The generic Create React App instructions have been replaced with this description of the actual scripts.

See the [project overview](../../README.md), [full setup guide](../../docs/SETUP.md) and [architecture](../../docs/ARCHITECTURE.md). The full audio workflow requires the backend and external tools; opening the interface alone does not validate audio processing.
