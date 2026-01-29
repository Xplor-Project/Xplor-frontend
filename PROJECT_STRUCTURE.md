# Xplor Frontend - Project Structure

A clean, organized overview of the project's folder hierarchy.

```
Xplor-frontend/
├── .git/                           # Git repository
├── .gitignore                      # Git ignore rules
├── dist/                           # Production build output
├── node_modules/                   # NPM dependencies
├── public/                         # Static public assets
├── src/                            # Source code
│   ├── App.tsx                     # Main app component
│   ├── App.css                     # Main app styles
│   ├── main.tsx                    # Application entry point
│   ├── index.css                   # Global styles
│   ├── vite-env.d.ts              # Vite environment types
│   │
│   ├── assets/                     # Static assets
│   │   └── react.svg              # React logo
│   │
│   ├── components/                 # Reusable React components
│   │   ├── Dashboard/             # Dashboard page components
│   │   │   ├── AnimatedBackground.tsx
│   │   │   ├── CloseIcon.tsx
│   │   │   ├── CreateProjectModal.tsx
│   │   │   └── ProjectCard.tsx
│   │   ├── Editor/                # 3D Editor UI components
│   │   │   ├── AssetList.tsx
│   │   │   ├── EditorCanvas.tsx   # Main 3D canvas
│   │   │   ├── LightsFromObjects.tsx
│   │   │   ├── Model.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── PropertiesPanel.tsx # Object properties editor
│   │   │   ├── SceneList.tsx      # Scene hierarchy
│   │   │   ├── Toolbar.tsx        # Editor toolbar
│   │   │   └── TransformControlWrapper.tsx
│   │   └── Login/                 # Login page components
│   │       └── VirtualKeyboard.tsx
│   │
│   ├── editor/                     # 3D Editor logic & utilities
│   │   ├── index.ts               # Editor exports
│   │   │
│   │   ├── actions/               # Scene manipulation actions
│   │   │   ├── index.ts
│   │   │   ├── addObjects.tsx
│   │   │   ├── deleteObjects.tsx
│   │   │   └── updateObjects.tsx
│   │   │
│   │   ├── export/                # 3D model export functionality
│   │   │   ├── index.ts
│   │   │   ├── exportGLB.tsx
│   │   │   └── exportGLTF.tsx
│   │   │
│   │   ├── import/                # 3D model import functionality
│   │   │   ├── index.ts
│   │   │   ├── importFromFile.tsx
│   │   │   ├── importFromUrl.tsx
│   │   │   └── applyTexture.tsx
│   │   │
│   │   ├── lights/                # Lighting management
│   │   │   ├── index.ts
│   │   │   ├── createLight.tsx
│   │   │   └── updateLight.tsx
│   │   │
│   │   ├── state/                 # State management hooks
│   │   │   ├── index.ts
│   │   │   ├── useSceneState.tsx  # Scene state hook
│   │   │   ├── useHistory.tsx     # Undo/redo history
│   │   │   └── useKeyboardShortcuts.tsx
│   │   │
│   │   └── utils/                 # Editor utility functions
│   │       ├── index.ts
│   │       ├── cloneScene.tsx
│   │       ├── disposeTextures.tsx
│   │       ├── groundObject.tsx
│   │       └── traverseMeshes.tsx
│   │
│   ├── pages/                      # Page components (routes)
│   │   ├── AuthCallback.tsx
│   │   ├── Callback.tsx
│   │   ├── Dashboard.tsx           # Project dashboard
│   │   ├── Editor.tsx              # Main 3D editor page
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── NotFound.tsx            # 404 page
│   │   ├── Profile.tsx
│   │   └── Upload.tsx
│   │
│   ├── types/                      # TypeScript type definitions
│   │   ├── collision.ts            # Collision detection types
│   │   └── scene.ts                # 3D scene types
│   │
│   └── utils/                      # General utility functions
│       ├── api.ts                  # API client utilities
│       └── recentProjects.ts       # Recent projects management
│
├── Configuration Files
│   ├── index.html                  # HTML entry point
│   ├── package.json                # NPM dependencies & scripts
│   ├── package-lock.json           # Locked dependency versions
│   ├── tsconfig.json               # TypeScript base config
│   ├── tsconfig.app.json           # TypeScript app config
│   ├── tsconfig.node.json          # TypeScript Node config
│   ├── vite.config.ts              # Vite build configuration
│   ├── eslint.config.js            # ESLint rules
│   ├── vercel.json                 # Vercel deployment config
│   └── README.md                   # Project documentation
```

## Directory Overview

### `/src`

Main source code directory containing all TypeScript/React components and logic.

### `/src/components`

Reusable React components organized by feature/page:

- **Dashboard**: Components for the project management dashboard
- **Editor**: UI components for the 3D editor interface
- **Login**: Authentication-related components

### `/src/editor`

3D editor-specific logic and utilities:

- **actions**: Scene manipulation (add, delete, update objects)
- **export**: Model export formats (GLB, GLTF)
- **import**: Model import and texture application
- **lights**: Lighting system management
- **state**: React hooks for state management
- **utils**: Helper functions for scene operations

### `/src/pages`

Page-level components corresponding to different routes in the application.

### `/src/types`

TypeScript type definitions for collision detection and 3D scene data structures.

### `/src/utils`

General utility functions for API communication and project management.

## Architecture Notes

- **Component-based**: UI organized in reusable, feature-specific components
- **3D Editor logic isolated**: `editor/` folder contains all 3D manipulation logic
- **State management**: Custom React hooks in `state/` folder
- **Type-safe**: Full TypeScript support with organized type definitions
- **Modular imports**: Each folder has an `index.ts` for clean exports
