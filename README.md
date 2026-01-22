# Xplor Frontend

Xplor Frontend is a React + TypeScript + Vite single-page application (SPA) that provides:

- A project dashboard experience
- A Three.js-based 3D scene editor (via React Three Fiber)
- Authentication entry points and callback handling

This repo is focused on the UI/editor experience. Backend integration points exist, but a few flows are currently stubbed or hard-coded.

---

## Tech Stack

- React (Vite)
- TypeScript
- React Router
- Tailwind CSS (via `@tailwindcss/vite`)
- three + `@react-three/fiber` + `@react-three/drei`
- ESLint

---

## Quick Start

### Prerequisites

- Node.js 18+ recommended (Node 20+ also works well)
- npm

### Install

```bash
npm install
```

### Run (development)

```bash
npm run dev
```

Vite prints the local URL (commonly `http://localhost:5173`).

### Build (production)

```bash
npm run build
```

This runs TypeScript project build (`tsc -b`) and then builds the Vite bundle into `dist/`.

### Preview the production build

```bash
npm run preview
```

---

## NPM Scripts

- `npm run dev` — start Vite dev server
- `npm run build` — typecheck + production build
- `npm run preview` — serve `dist/` locally
- `npm run lint` — run ESLint across the project

---

## Routes

Routes are defined in `src/App.tsx`.

| Route            | Page         | Notes                                                                              |
| ---------------- | ------------ | ---------------------------------------------------------------------------------- |
| `/`              | Home         | Entry/landing                                                                      |
| `/dashboard`     | Dashboard    | Uses mock recent projects (TODO: replace with API)                                 |
| `/login`         | Login        | Email/password is currently a placeholder; Google login redirects to a backend URL |
| `/auth/callback` | AuthCallback | Reads query params and stores tokens in `localStorage`                             |
| `/profile`       | Profile      | User profile page                                                                  |
| `/upload`        | Upload       | Placeholder                                                                        |
| `/editor`        | Editor       | 3D editor experience                                                               |
| `*`              | NotFound     | Catch-all                                                                          |

---

## 3D Editor (Overview)

The editor is implemented in `src/pages/Editor.tsx` and combines:

- UI panels (`src/components/Editor/*`)
- Editor engine functions (`src/editor/*`)
- Three.js rendering via `<Canvas />` from `@react-three/fiber`

### Core capabilities

- Add primitives: cube, sphere
- Add a scene light object
- Select objects in the scene and edit via a Properties panel:
  - Name
  - Transform (position / scale)
  - Material color
  - Texture assignment (for non-light objects)
  - Light intensity + emissive color (for light objects)
- Delete selected object (`Delete` / `Backspace`)
- Undo / redo history (`Ctrl/Cmd + Z`, `Ctrl/Cmd + Y`)
- Import models:
  - Local GLB/GLTF via file picker
  - From URL
  - Drag-and-drop a URL onto the canvas area
- Export:
  - GLTF export (direct)
  - GLB export (with filename modal)

### Keyboard shortcuts

Keyboard shortcut logic lives in `src/editor/state/useKeyboardShortcuts.tsx`:

- Undo: `Ctrl/Cmd + Z`
- Redo: `Ctrl/Cmd + Y`
- Delete: `Delete` or `Backspace`

Inputs and editable fields are ignored so shortcuts do not interfere while typing.

### Scene state & history

- `src/editor/state/useSceneState.tsx` maintains:
  - `objects` array (scene objects)
  - `selectedId`
  - `objectsRef` for “latest objects” (used for export / async operations)
- `src/editor/state/useHistory.tsx` snapshots the scene by deep-cloning objects (including `object3d` and animation clips). This helps prevent subtle Three.js mutation issues during undo/redo.

---

## Backend / API Integration Notes

This frontend currently includes a few backend touchpoints:

### Google OAuth redirect

`src/pages/Login.tsx` redirects the browser to:

- `http://localhost:8000/auth/login/google-oauth2/`

If your backend URL/port differs, update that value (or consider refactoring it to an env var).

### OAuth callback tokens

`src/pages/AuthCallback.tsx` reads the following query parameters:

- `access`
- `refresh`

It stores them in `localStorage` under the keys `access` and `refresh`.

### Authenticated fetch helper

`src/utils/api.ts` currently reads `access_token` from `localStorage` and sends it as a Bearer token.

Important: the token storage keys are not yet standardized (`access` vs `access_token`). If you start wiring authenticated API calls, standardize on one set of keys and update the helper + callback accordingly.

---

## Project Structure

High-level layout:

- `src/pages/` — route-level pages (Home, Login, Dashboard, Editor, …)
- `src/components/` — reusable UI components
  - `src/components/Editor/` — editor UI (toolbar, panels, canvas helpers)
  - `src/components/Dashboard/` — dashboard UI (cards, modal, background)
- `src/editor/` — editor “engine” (actions, import/export, lights, state hooks, utilities)
- `src/types/` — shared TypeScript types
- `src/utils/` — general utilities (API helper, recent projects)

### Folder structure

```text
Xplor-frontend/
├─ public/
├─ src/
│  ├─ assets/
│  ├─ components/
│  │  ├─ Dashboard/
│  │  ├─ Editor/
│  │  └─ Login/
│  ├─ editor/
│  │  ├─ actions/
│  │  ├─ export/
│  │  ├─ import/
│  │  ├─ lights/
│  │  ├─ state/
│  │  └─ utils/
│  ├─ pages/
│  ├─ types/
│  ├─ utils/
│  ├─ App.tsx
│  ├─ main.tsx
│  ├─ index.css
│  └─ vite-env.d.ts
├─ index.html
├─ vite.config.ts
├─ vercel.json
├─ eslint.config.js
├─ tsconfig.json
├─ tsconfig.app.json
├─ tsconfig.node.json
└─ package.json
```

---

## Deployment

### Vercel

This repo includes `vercel.json` configured as an SPA rewrite:

- All routes rewrite to `/index.html` so browser refreshes on nested routes work.

Suggested Vercel settings:

- Build command: `npm run build`
- Output directory: `dist`

---

## Troubleshooting

### Blank page on refresh (production)

If you host the SPA somewhere other than Vercel, make sure your host rewrites all routes to `index.html` (similar to the provided `vercel.json`).

### CORS / API errors

If you connect to a separate backend domain/port, ensure CORS is configured on the backend.

### Model import issues

- Prefer `.glb`/`.gltf` assets.
- If a model appears floating or offset, the importer uses a grounding step (`src/editor/utils/groundObject.tsx`) which may need adjustments per asset.

---

## Contributing

- Keep changes focused and incremental.
- Run `npm run lint` before opening a PR.
- If you add editor features, update this README’s “3D Editor” section so usage stays current.
