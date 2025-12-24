import * as THREE from "three";
import type { SceneObject } from "../../types/scene";

interface LightsFromObjectsProps {
  objects: SceneObject[];
}

export default function LightsFromObjects({ objects }: LightsFromObjectsProps) {
  const tmpCenter = new THREE.Vector3();
  const tmpBox = new THREE.Box3();

  return (
    <>
      {objects.map((o) => {
        const isLamp =
          /lamp|light/i.test(o.name) || o.object3d.userData?.isLight;
        if (!isLamp) return null;

        // Light properties (can be edited later through a UI)
        const color = o.object3d.userData?.lightColor ?? 0xfff2cc;
        const intensity = o.object3d.userData?.intensity ?? 2;
        const distance = o.object3d.userData?.distance ?? 6;
        const decay = o.object3d.userData?.decay ?? 1.5;
        const offset: [number, number, number] =
          o.object3d.userData?.offset ?? [0, 0.5, 0];

        // Position light at object center:
        tmpBox.setFromObject(o.object3d).getCenter(tmpCenter);
        const pos: [number, number, number] = [
          tmpCenter.x + offset[0],
          tmpCenter.y + offset[1],
          tmpCenter.z + offset[2],
        ];

        return (
          <pointLight
            key={`light-${o.id}`}
            position={pos}
            color={color}
            intensity={intensity}
            distance={distance}
            decay={decay}
            castShadow
          />
        );
      })}
    </>
  );
}
