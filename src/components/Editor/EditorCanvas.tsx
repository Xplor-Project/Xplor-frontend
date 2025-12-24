import { useEffect, useMemo, useState,useRef } from "react";
import { useThree } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import { OrbitControls, TransformControls } from "@react-three/drei";
import * as THREE from "three";
import type { SceneObject } from "../../types/scene";

interface EditorCanvasProps {
  objects: SceneObject[];
  onSelect: (id: string | null) => void;
  selectedId: string | null;
  setObjectsRef?: (arr: SceneObject[]) => void;
  onTransform?: () => void;
  gridWidth?: number;
  gridLength?: number;
  gridHeight?: number;
  hasRoom?: boolean;
  initialFocusId?: string;
}

const EditorCanvas: React.FC<EditorCanvasProps> = ({
  objects,
  onSelect,
  selectedId,
  setObjectsRef,
  onTransform,
  gridWidth = 10,
  gridLength = 10,
  gridHeight = 2.8,
  hasRoom = false,
  initialFocusId,
}) => {
  const { gl, camera } = useThree();
  // If we have a room (or initialFocusId), compute its bounding box and set camera to look at center
  useEffect(() => {
    const focusObj =
      objects.find((o) => o.id === (initialFocusId || "")) ||
      objects.find((o) => o.name === "Room");
    if (!focusObj) return;

    const box = new THREE.Box3().setFromObject(focusObj.object3d);
    const center = new THREE.Vector3();
    box.getCenter(center);
    const size = new THREE.Vector3();
    box.getSize(size);

    // Position camera at center + a distance based on largest dimension
    const maxDim = Math.max(size.x, size.y, size.z, 1);
    const distance = maxDim * 1.2 + 2;
    const offset = new THREE.Vector3(distance, distance * 0.6, distance);
    camera.position.copy(center.clone().add(offset));
    camera.lookAt(center);
    // Ensure the renderer updates the camera matrix
    camera.updateProjectionMatrix?.();
  }, [objects, initialFocusId, camera]);

  // Use gridWidth and gridLength for grid size
  const gridBounds = {
    min: new THREE.Vector3(-gridWidth / 2, 0, -gridLength / 2),
    max: new THREE.Vector3(gridWidth / 2, gridHeight, gridLength / 2),
  };

  const selectedObject = useMemo(
    () => objects.find((o) => o.id === selectedId),
    [objects, selectedId]
  );

  // Keep external ref updated
  useEffect(() => {
    if (setObjectsRef) setObjectsRef(objects);
  }, [objects, setObjectsRef]);

  // Local state: whether a transform control is active (dragging)
  const [isTransforming, setIsTransforming] = useState(false);
  const lastValidPosRef = useRef<Map<string, THREE.Vector3>>(new Map());
  useEffect(() => {
  const so = objects.find(o => o.id === selectedId);
  if (so) {
    lastValidPosRef.current.set(so.id, so.object3d.position.clone());
  }
}, [selectedId, objects]);

  // Pointer selection
  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      const pointer = new THREE.Vector2(x, y);
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(pointer, camera);

      const targetObjects = objects.map((o) => o.object3d);
      const intersects = raycaster.intersectObjects(targetObjects, true);

      if (intersects.length > 0) {
        let cur: any = intersects[0].object;

        while (cur && cur.parent) {
          const foundDirect = objects.find(
            (o) => o.object3d === cur || cur?.uuid === o.object3d.uuid
          );
          if (foundDirect) {
            onSelect(foundDirect.id);
            return;
          }
          cur = cur.parent;
        }

        // Fallback, though the loop above should handle most cases
        const found = objects.find(
          (o) =>
            o.object3d === intersects[0].object ||
            intersects[0].object?.uuid === o.object3d.uuid
        );
        if (found) {
          onSelect(found.id);
          return;
        }
      }

      onSelect(null);
    };

    gl.domElement.addEventListener("pointerdown", handlePointerDown);
    return () =>
      gl.domElement.removeEventListener("pointerdown", handlePointerDown);
  }, [gl, camera, objects, onSelect]);

  // Transform handler with strict boundary enforcement
  const handleTransform = () => {
  if (!selectedObject) return;

  const obj = selectedObject.object3d;

  // 1) Clamp to grid bounds (your code)
  const box = new THREE.Box3().setFromObject(obj);
  const size = new THREE.Vector3();
  box.getSize(size);

  const halfSizeX = size.x / 2;
  const halfSizeY = size.y / 2;
  const halfSizeZ = size.z / 2;

  const minX = gridBounds.min.x + halfSizeX;
  const maxX = gridBounds.max.x - halfSizeX;
  const minY = gridBounds.min.y + halfSizeY;
  const maxY = gridBounds.max.y - halfSizeY;
  const minZ = gridBounds.min.z + halfSizeZ;
  const maxZ = gridBounds.max.z - halfSizeZ;

  obj.position.x = THREE.MathUtils.clamp(obj.position.x, minX, maxX);
  obj.position.y = THREE.MathUtils.clamp(obj.position.y, minY, maxY);
  obj.position.z = THREE.MathUtils.clamp(obj.position.z, minZ, maxZ);

  // 2) Collision check vs every other non-Room object
  const movedBox = new THREE.Box3().setFromObject(obj);
  const colliders = objects.filter(
    (o) => o.id !== selectedObject.id && o.name !== "Room"
  );

  let overlaps = false;
  for (const other of colliders) {
    const otherBox = new THREE.Box3().setFromObject(other.object3d);
    if (movedBox.intersectsBox(otherBox)) {
      overlaps = true;
      break;
    }
  }

  if (overlaps) {
    // 3) Revert to last valid position
    const last = lastValidPosRef.current.get(selectedObject.id);
    if (last) obj.position.copy(last);
    // optional: force controls to update their gizmo
    obj.updateMatrixWorld(true);
  } else {
    // 4) No overlap: remember this as last valid
    lastValidPosRef.current.set(selectedObject.id, obj.position.clone());
  }

  onTransform?.();
};


  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />

      {/* CORRECTED GRID: Single helper scaled to match grid dimensions. If there's a room, make grid subtler. */}
      <gridHelper
        args={
          // size, divisions, centerLineColor, gridColor
          hasRoom
            ? [Math.max(gridWidth, gridLength), 10, 0x2b2b2b, 0x222222]
            : [10, 10]
        }
        scale={[gridWidth / 10, 1, gridLength / 10]}
        position={[0, 0, 0]}
      />

      {/* Allow orbiting unless the user is actively transforming an object */}
      <OrbitControls makeDefault enabled={!isTransforming} />

      {objects.map((o) => {
        const isSelected = o.id === selectedId;

        const primitive = (
          <primitive
            key={o.id}
            object={o.object3d}
            onClick={(e: ThreeEvent<MouseEvent>) => {
              e.stopPropagation();
              onSelect(o.id);
            }}
          />
        );

        return isSelected ? (
          <TransformControls
            key={o.id}
            object={o.object3d}
            // When user starts interacting with the transform, disable orbiting
            onMouseDown={(e?: THREE.Event) => {
              setIsTransforming(true);
              (
                e as unknown as { stopPropagation?: () => void }
              )?.stopPropagation?.();
            }}
            // When mouse is released, re-enable orbiting
            onMouseUp={() => setIsTransforming(false)}
            onChange={handleTransform}
          >
            {primitive}
          </TransformControls>
        ) : (
          primitive
        );
      })}
    </>
  );
};

export default EditorCanvas;
