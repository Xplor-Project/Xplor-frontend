import { useRef, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { GLTFLoader, GLTFExporter } from "three-stdlib";
import EditorCanvas from "../components/Editor/EditorCanvas";
import PropertiesPanel from "../components/Editor/PropertiesPanel";
import Toolbar from "../components/Editor/Toolbar";
import type {
  SceneObject,
  TransformAxis,
  TransformField,
} from "../types/scene";
import Navbar from "../components/Editor/Navbar";
import AssetList from "../components/Editor/AssetList";
import LightsFromObjects from "../components/Editor/LightsFromObjects";

// --- Utility ---
const generateId = () => Math.random().toString(36).slice(2, 9);

// --- Top-level Page Component ---
export default function EditorPage() {
  const location = useLocation();
  // Get grid dimensions from route state (fallback to defaults)
  // Use modal values if present, otherwise default to 20x20
  let gridWidth = 10;
  let gridLength = 10;
  let gridHeight = 2.8;
  if (location.state) {
    // Dashboard navigates with keys: gridWidth, gridLength, height
    if (location.state.gridWidth) gridWidth = Number(location.state.gridWidth);
    else if (location.state.width) gridWidth = Number(location.state.width);

    if (location.state.gridLength)
      gridLength = Number(location.state.gridLength);
    else if (location.state.length) gridLength = Number(location.state.length);

    if (location.state.height) gridHeight = Number(location.state.height);
  }
  const [objects, setObjects] = useState<SceneObject[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const objectsRef = useRef<SceneObject[]>(objects);
  const [history, setHistory] = useState<SceneObject[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isNavigating = useRef(false);

  // Save history snapshots when objects change
  useEffect(() => {
    if (isNavigating.current) {
      // Skip recording when undoing/redoing
      isNavigating.current = false;
      return;
    }

    setHistory((prev) => {
      const newHistory = [...prev.slice(0, historyIndex + 1), objects];
      return newHistory;
    });
    setHistoryIndex((prev) => prev + 1);
  }, [objects]);

  useEffect(() => {
    objectsRef.current = objects;
  }, [objects]);

  // --- Core Functions ---
  const handleFile = async (file: File | null) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    new GLTFLoader().load(
      url,
      (gltf: any) => {
        const root = gltf.scene.clone(true);
        let added = false;
        // If root is a group and has children, add each child as a separate object
        if (root.children && root.children.length > 0) {
          root.children.forEach((child: any) => {
            if (child.isMesh || child.isGroup) {
              child.traverse((sub: any) => {
                if (sub.isMesh) {
                  sub.castShadow = true;
                  sub.receiveShadow = true;
                }
              });
              setObjects((prev) => [
                ...prev,
                {
                  id: generateId(),
                  name: child.name || file.name,
                  object3d: child,
                },
              ]);
              added = true;
            }
          });
        }
        // If nothing was added, add the root itself
        if (!added) {
          root.traverse((child: any) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });
          setObjects((prev) => [
            ...prev,
            {
              id: generateId(),
              name: file.name,
              object3d: root,
            },
          ]);
        }
        URL.revokeObjectURL(url);
      },
      undefined,
      (err: any) => console.error("GLTF load error", err)
    );
  };

  const addObject = (mesh: THREE.Mesh) => {
    const newObj: SceneObject = {
      id: generateId(),
      name: mesh.name,
      object3d: mesh,
    };
    setObjects((p) => [...p, newObj]);
  };

  const addLight = () => {
  const geometry = new THREE.SphereGeometry(0.2, 16, 16);
  const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xffffee,
    emissiveIntensity: 2.5,
    roughness: 0.3,
    metalness: 0.0,
  });

  const bulb = new THREE.Mesh(geometry, material);
  bulb.name = "Light Bulb";
  bulb.position.set(0, 1.2, 0);

  // Mark as a light source for LightsFromObjects
  bulb.userData.isLight = true;
  bulb.userData.lightColor = 0xfff2cc;
  bulb.userData.intensity = 3;  // brighter than cube lamp earlier
  bulb.userData.distance = 7;
  bulb.userData.decay = 1.2;
  bulb.userData.offset = [0, 0, 0];

  const newObj: SceneObject = {
    id: generateId(),
    name: "Light",
    object3d: bulb,
  };

  setObjects((prev) => [...prev, newObj]);
};

  const addCube = () => {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({ color: 0x8aaaff });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = "Cube";
  mesh.position.set(Math.random() * 2 - 1, 0.5, Math.random() * 2 - 1);

  const newObj: SceneObject = {
    id: generateId(),
    name: "Cube",
    object3d: mesh,
  };

  setObjects((prev) => [...prev, newObj]);
};

  const addSphere = () => {
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: 0xff8aaf });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = "Sphere";
    mesh.position.set(Math.random() * 2 - 1, 0.5, Math.random() * 2 - 1);
    addObject(mesh);
  };


  const deleteSelected = () => {
    if (!selectedId) return;
    setObjects((prev) => prev.filter((o) => o.id !== selectedId));
    setSelectedId(null);
  };
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Delete") {
        deleteSelected();
      }
      if (event.ctrlKey && event.key === "z") {
        handleUndo();
      }
      if (event.ctrlKey && event.key === "y") {
        handleRedo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedId, historyIndex, history]);

  const exportGLTF = () => {
    const exporter = new GLTFExporter();
    const sceneToExport = new THREE.Scene();

    objectsRef.current.forEach((o) =>
      sceneToExport.add(o.object3d.clone(true))
    );

    exporter.parse(
      sceneToExport,
      (result) => {
        const output = JSON.stringify(result, null, 2);
        const blob = new Blob([output], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `scene-${Date.now()}.gltf`;
        link.click();
      },
      (error) => console.error("GLTF export error", error),
      { binary: false } // ✅ glTF JSON
    );
  };

  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFilename, setExportFilename] = useState("");

  const exportGLB = () => {
    setShowExportModal(true);
  };

  const handleExportModalClose = () => {
    setShowExportModal(false);
    setExportFilename("");
  };

  const handleExportModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const exporter = new GLTFExporter();
    const sceneToExport = new THREE.Scene();
    objectsRef.current.forEach((o) =>
      sceneToExport.add(o.object3d.clone(true))
    );
    exporter.parse(
      sceneToExport,
      (result) => {
        if (result instanceof ArrayBuffer) {
          const blob = new Blob([result], { type: "application/octet-stream" });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = `${exportFilename || "scene"}.glb`;
          link.click();
        }
      },
      (error) => console.error("GLB export error", error),
      { binary: true }
    );
    handleExportModalClose();
  };

  const saveToBackend = async () => {
    const exporter = new GLTFExporter();
    const sceneToExport = new THREE.Scene();
    objectsRef.current.forEach((o) =>
      sceneToExport.add(o.object3d.clone(true))
    );

    exporter.parse(
      sceneToExport,
      async (result) => {
        try {
          await fetch("/api/projects", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: "My Project", gltf: result }),
          });
          alert("Project saved! (Placeholder)");
        } catch (e) {
          console.error(e);
          alert("Save failed (check console).");
        }
      },
      (error) => console.error("Backend save error", error),
      { binary: false }
    );
  };

  const updateTransform = (
    id: string,
    field: TransformField,
    axis: TransformAxis,
    value: number
  ) => {
    setObjects((prev) =>
      prev.map((o) => {
        if (o.id === id) {
          const newObject3d = o.object3d.clone();
          newObject3d[field][axis] = value;
          return { ...o, object3d: newObject3d };
        }
        return o;
      })
    );
  };

  // Update object's display name and keep object3d.name in sync
  const updateObjectName = (id: string, name: string) => {
    setObjects((prev) =>
      prev.map((o) => {
        if (o.id === id) {
          const newObject3d = o.object3d.clone();
          newObject3d.name = name;
          return { ...o, name, object3d: newObject3d };
        }
        return o;
      })
    );
  };

  // Update object's material color. Will traverse meshes and set material.color where available.
  const updateObjectColor = (id: string, colorHex: string) => {
    setObjects((prev) =>
      prev.map((o) => {
        if (o.id === id) {
          const newObject3d = o.object3d.clone();
          newObject3d.traverse((child: any) => {
            if (child.isMesh && child.material) {
              try {
                if (Array.isArray(child.material)) {
                  child.material = child.material.map((mat: any) => {
                    const cloned = mat.clone
                      ? mat.clone()
                      : Object.assign(
                          Object.create(Object.getPrototypeOf(mat)),
                          mat
                        );
                    if (cloned.color) cloned.color = new THREE.Color(colorHex);
                    return cloned;
                  });
                } else {
                  const mat = child.material as any;
                  const cloned = mat.clone
                    ? mat.clone()
                    : Object.assign(
                        Object.create(Object.getPrototypeOf(mat)),
                        mat
                      );
                  if (cloned.color) cloned.color = new THREE.Color(colorHex);
                  child.material = cloned;
                }
              } catch (e) {
                // If cloning fails for some exotic material, try a best-effort assignment
                if (child.material && (child.material as any).color) {
                  (child.material as any).color = new THREE.Color(colorHex);
                }
              }
            }
          });
          return { ...o, object3d: newObject3d };
        }
        return o;
      })
    );
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      isNavigating.current = true;
      const prevIndex = historyIndex - 1;
      setObjects(history[prevIndex]);
      setHistoryIndex(prevIndex);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      isNavigating.current = true;
      const nextIndex = historyIndex + 1;
      setObjects(history[nextIndex]);
      setHistoryIndex(nextIndex);
    }
  };

  // --- Light Intensity Update ---
const updateLightIntensity = (id: string, intensity: number) => {
  setObjects((prev) =>
    prev.map((o) => {
      if (o.id === id) {
        const newObject3d = o.object3d.clone(true);

        newObject3d.userData = {
          ...(newObject3d.userData || {}),
          intensity,
        };

        return { ...o, object3d: newObject3d };
      }
      return o;
    })
  );
};

// --- Light Color Update ---
const updateLightColor = (id: string, hexColor: number) => {
  setObjects((prev) =>
    prev.map((o) => {
      if (o.id === id) {
        const newObject3d = o.object3d.clone(true);

        newObject3d.userData = {
          ...(newObject3d.userData || {}),
          lightColor: hexColor,
        };

        return { ...o, object3d: newObject3d };
      }
      return o;
    })
  );
};

// Update object's texture (diffuse map). If `file` is null it will remove any existing map.
  const updateObjectTexture = (id: string, file: File | null) => {
    if (!file) {
      // Remove texture maps synchronously
      setObjects((prev) =>
        prev.map((o) => {
          if (o.id === id) {
            const newObject3d = o.object3d.clone();
            newObject3d.traverse((child: any) => {
              if (child.isMesh && child.material) {
                if (Array.isArray(child.material)) {
                  child.material = child.material.map((mat: any) => {
                    const cloned = mat.clone
                      ? mat.clone()
                      : Object.assign(
                          Object.create(Object.getPrototypeOf(mat)),
                          mat
                        );
                    if (cloned.map) cloned.map = null;
                    cloned.needsUpdate = true;
                    return cloned;
                  });
                } else {
                  const mat = child.material as any;
                  const cloned = mat.clone
                    ? mat.clone()
                    : Object.assign(
                        Object.create(Object.getPrototypeOf(mat)),
                        mat
                      );
                  if (cloned.map) cloned.map = null;
                  cloned.needsUpdate = true;
                  child.material = cloned;
                }
              }
            });
            return { ...o, object3d: newObject3d };
          }
          return o;
        })
      );

      return;
    }

    const url = URL.createObjectURL(file);
    const loader = new THREE.TextureLoader();
    loader.load(
      url,
      (texture) => {
        setObjects((prev) =>
          prev.map((o) => {
            if (o.id === id) {
              const newObject3d = o.object3d.clone();
              newObject3d.traverse((child: any) => {
                if (child.isMesh && child.material) {
                  try {
                    if (Array.isArray(child.material)) {
                      child.material = child.material.map((mat: any) => {
                        const cloned = mat.clone
                          ? mat.clone()
                          : Object.assign(
                              Object.create(Object.getPrototypeOf(mat)),
                              mat
                            );
                        cloned.map = texture;
                        cloned.needsUpdate = true;
                        return cloned;
                      });
                    } else {
                      const mat = child.material as any;
                      const cloned = mat.clone
                        ? mat.clone()
                        : Object.assign(
                            Object.create(Object.getPrototypeOf(mat)),
                            mat
                          );
                      cloned.map = texture;
                      cloned.needsUpdate = true;
                      child.material = cloned;
                    }
                  } catch (e) {
                    // Best-effort fallback
                    if (child.material) {
                      (child.material as any).map = texture;
                      (child.material as any).needsUpdate = true;
                    }
                  }
                }
              });
              return { ...o, object3d: newObject3d };
            }
            return o;
          })
        );
        URL.revokeObjectURL(url);
      },
      undefined,
      (err) => {
        console.error("Texture load error", err);
        URL.revokeObjectURL(url);
      }
    );
  };

  const handleImportFromUrl = (url: string) => {
    console.log("handleImportFromUrl called");
    console.log("Loading model from URL:", url);
    new GLTFLoader().load(
      url,
      (gltf: any) => {
        console.log("GLTF loaded successfully:", gltf);
        const root = gltf.scene.clone(true);
        let added = false;
        // If root is a group and has children, add each child as a separate object
        if (root.children && root.children.length > 0) {
          console.log("Root has children, iterating through them.");
          root.children.forEach((child: any) => {
            if (child.isMesh || child.isGroup) {
              child.traverse((sub: any) => {
                if (sub.isMesh) {
                  sub.castShadow = true;
                  sub.receiveShadow = true;
                }
              });
              const newObject = {
                id: generateId(),
                name: child.name || "imported-model",
                object3d: child,
              };
              console.log("Adding new object:", newObject);
              setObjects((prev) => [...prev, newObject]);
              added = true;
            }
          });
        }
        // If nothing was added, add the root itself
        if (!added) {
          console.log("Root has no children or no meshes/groups were found, adding root itself.");
          root.traverse((child: any) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });
          const newObject = {
            id: generateId(),
            name: "imported-model",
            object3d: root,
          };
          console.log("Adding new object (root):", newObject);
          setObjects((prev) => [...prev, newObject]);
        }
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
      },
      (err: any) => console.error("GLTF load error", err)
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-700 text-white">
      <Navbar
        projectName="MY PROJECT"
        onSave={saveToBackend}
        onUndo={() => handleUndo()}
        onRedo={() => handleRedo()}
        onVrPreview={() => console.log("VR Preview")}
      />
      <div className="flex flex-1 min-h-0">
        <Toolbar
          addCube={addCube}
          addSphere={addSphere}
          addLight={addLight}
          handleFile={handleFile}
          deleteSelected={deleteSelected}
          exportGLTF={exportGLTF}
          exportGLB={exportGLB}
          saveToBackend={saveToBackend}
          selectedId={selectedId}
          onImportFromUrl={handleImportFromUrl}
        />
        {/* Export GLB Modal */}
        {showExportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-fadein">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl"
                onClick={handleExportModalClose}
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold mb-4 text-blue-400">
                Export GLB: Filename
              </h2>
              <form onSubmit={handleExportModalSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Filename
                  </label>
                  <input
                    type="text"
                    required
                    value={exportFilename}
                    onChange={(e) => setExportFilename(e.target.value)}
                    placeholder="Enter filename"
                    className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex gap-4 mt-6">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow"
                  >
                    Export
                  </button>
                  <button
                    type="button"
                    className="flex-1 px-4 py-2 rounded bg-gray-700 hover:bg-gray-800 text-white font-bold text-lg shadow"
                    onClick={handleExportModalClose}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        <div
          className="flex-1 relative"
          onDrop={(e) => {
            e.preventDefault();
            const url = e.dataTransfer.getData("text/plain");
            console.log(url);
            if (url) {
              handleImportFromUrl(url);
            }
          }}
          onDragOver={(e) => {
            e.preventDefault();
          }}
        >
          <Canvas
            shadows
            camera={{ position: [gridWidth, gridWidth, gridLength], fov: 50 }}
          >
            {/* ✅ FIX: Added lights and a grid helper */}
            <ambientLight intensity={0.7} />
            <directionalLight
              position={[10, 10, 5]}
              intensity={1.5}
              castShadow
            />
            <gridHelper args={[gridWidth, gridLength]} />

            <EditorCanvas
              objects={objects}
              onSelect={setSelectedId}
              selectedId={selectedId}
              gridWidth={gridWidth}
              gridLength={gridLength}
              gridHeight={gridHeight}
              hasRoom={objects.some((o) => o.name === "Room")}
              initialFocusId={objects.length === 1 ? objects[0].id : undefined}
            />
            <LightsFromObjects objects={objects} />
          </Canvas>
        </div>
        <div className="w-80 bg-gray-900 p-4 overflow-y-auto relative z-10">
          <h3 className="font-semibold">Scene Objects</h3>
          <div className="mt-2 space-y-2">
            {objects.map((o) => (
              <div
                key={o.id}
                className={`p-2 rounded border-2 cursor-pointer ${
                  o.id === selectedId
                    ? "bg-blue-800 border-blue-500"
                    : "bg-gray-800 border-gray-700 hover:border-gray-500"
                }`}
                onClick={() => setSelectedId(o.id)}
              >
                <div className="font-medium text-sm">{o.name}</div>
              </div>
            ))}
          </div>
          <PropertiesPanel
            objects={objects}
            selectedId={selectedId}
            updateTransform={updateTransform}
            updateObjectName={updateObjectName}
            updateObjectColor={updateObjectColor}
            updateLightIntensity={updateLightIntensity}
            updateLightColor={updateLightColor}
            updateObjectTexture={updateObjectTexture}
          />
        </div>
      </div>
    </div>
  );
}
