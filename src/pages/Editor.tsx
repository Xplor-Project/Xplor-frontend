import { useState, Suspense, lazy } from "react";
import { Canvas } from "@react-three/fiber";
import { useLocation } from "react-router-dom";

/* ================== UI COMPONENTS ================== */
import Navbar from "../components/Editor/Navbar";
import Toolbar from "../components/Editor/Toolbar";
import PropertiesPanel from "../components/Editor/PropertiesPanel";
import LightsFromObjects from "../components/Editor/LightsFromObjects";

/* 🔥 Lazy load heavy 3D canvas */
const EditorCanvas = lazy(() => import("../components/Editor/EditorCanvas"));

/* ================== LIGHTWEIGHT EDITOR CORE ================== */
import {
  useSceneState,
  useHistory,
  useKeyboardShortcuts,
  createCube,
  createSphere,
  createSceneLight,
  deleteObject,
  updateTransform,
  updateObjectName,
  updateObjectColor,
} from "../editor";

/* =================================================== */

export default function EditorPage() {
  const location = useLocation();

  let gridWidth = 10;
  let gridLength = 10;
  let gridHeight = 2.8;

  if (location.state) {
    gridWidth = Number(location.state.gridWidth ?? location.state.width ?? 10);
    gridLength = Number(location.state.gridLength ?? location.state.length ?? 10);
    gridHeight = Number(location.state.height ?? 2.8);
  }

  /* ---------- Core Scene State ---------- */
  const scene = useSceneState();
  const history = useHistory(scene.objects, scene.setObjects);

  /* ---------- Keyboard Shortcuts ---------- */
  useKeyboardShortcuts({
    onUndo: history.undo,
    onRedo: history.redo,
    onDelete: () => {
      scene.setObjects((prev) => deleteObject(prev, scene.selectedId));
      scene.setSelectedId(null);
    },
  });

  /* ---------- Export Modal ---------- */
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFilename, setExportFilename] = useState("");

  /* ---------- Lazy Import Handlers ---------- */

  const handleFileImport = async (file: File | null) => {
    if (!file) return;
    const { importFromFile } = await import("../editor/import/importFromFile");
    const newObjects = await importFromFile(file);
    scene.setObjects((prev) => [...prev, ...newObjects]);
  };

  const handleUrlImport = async (url: string) => {
    const { importFromUrl } = await import("../editor/import/importFromUrl");
    const newObjects = await importFromUrl(url);
    scene.setObjects((prev) => [...prev, ...newObjects]);
  };

  const handleTextureUpdate = async (id: string, file: File | null) => {
    const { applyTexture } = await import("../editor/import/applyTexture");
    const updated = await applyTexture(scene.objects, id, file);
    scene.setObjects(updated);
  };

  const handleExportGLTF = async () => {
    const { exportGLTF } = await import("../editor/export/exportGLTF");
    exportGLTF(scene.objectsRef.current);
  };

  const handleExportGLB = async () => {
    const { exportGLB } = await import("../editor/export/exportGLB");
    exportGLB(scene.objectsRef.current, `${exportFilename || "scene"}.glb`);
    setShowExportModal(false);
    setExportFilename("");
  };

  /* =================================================== */

  return (
    <div className="flex flex-col h-screen bg-gray-700 text-white">
      <Navbar
        projectName="MY PROJECT"
        onSave={() => console.log("Save to backend")}
        onUndo={history.undo}
        onRedo={history.redo}
        onVrPreview={() => console.log("VR Preview")}
      />

      <div className="flex flex-1 min-h-0">
        <Toolbar
          addCube={() => scene.setObjects((prev) => [...prev, createCube()])}
          addSphere={() => scene.setObjects((prev) => [...prev, createSphere()])}
          addLight={() => scene.setObjects((prev) => [...prev, createSceneLight()])}
          handleFile={handleFileImport}
          deleteSelected={() => {
            scene.setObjects((prev) => deleteObject(prev, scene.selectedId));
            scene.setSelectedId(null);
          }}
          exportGLTF={handleExportGLTF}
          exportGLB={() => setShowExportModal(true)}
          saveToBackend={() => console.log("Save")}
          selectedId={scene.selectedId}
          onImportFromUrl={handleUrlImport}
        />

        {showExportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Export GLB</h2>
              <input
                value={exportFilename}
                onChange={(e) => setExportFilename(e.target.value)}
                className="w-full mb-4 p-2 rounded bg-gray-800"
                placeholder="filename"
              />
              <div className="flex gap-4">
                <button className="flex-1 bg-blue-600 p-2 rounded" onClick={handleExportGLB}>
                  Export
                </button>
                <button className="flex-1 bg-gray-700 p-2 rounded" onClick={() => setShowExportModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div
          className="flex-1 relative"
          onDrop={(e) => {
            e.preventDefault();
            const url = e.dataTransfer.getData("text/plain");
            if (url) handleUrlImport(url);
          }}
          onDragOver={(e) => e.preventDefault()}
        >
          <Canvas shadows camera={{ position: [gridWidth, gridWidth, gridLength], fov: 50 }}>
            <ambientLight intensity={0.7} />
            <directionalLight position={[10, 10, 5]} intensity={1.5} />
            <gridHelper args={[gridWidth, gridLength]} />

            <Suspense fallback={null}>
              <EditorCanvas
                objects={scene.objects}
                selectedId={scene.selectedId}
                onSelect={scene.setSelectedId}
                gridWidth={gridWidth}
                gridLength={gridLength}
                gridHeight={gridHeight}
                hasRoom={scene.objects.some((o) => o.name === "Room")}
                initialFocusId={scene.objects.length === 1 ? scene.objects[0].id : undefined}
              />
            </Suspense>

            <LightsFromObjects objects={scene.objects} />
          </Canvas>
        </div>

        <div className="w-80 bg-gray-900 p-4 overflow-y-auto">
          <PropertiesPanel
            objects={scene.objects}
            selectedId={scene.selectedId}
            updateTransform={(id, field, axis, value) =>
              scene.setObjects((prev) => updateTransform(prev, id, field, axis, value))
            }
            updateObjectName={(id, name) =>
              scene.setObjects((prev) => updateObjectName(prev, id, name))
            }
            updateObjectColor={(id, color) =>
              scene.setObjects((prev) => updateObjectColor(prev, id, color))
            }
            updateObjectTexture={handleTextureUpdate}
          />
        </div>
      </div>
    </div>
  );
}
