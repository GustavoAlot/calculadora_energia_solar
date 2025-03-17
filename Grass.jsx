import React from "react";
import { useGLTF } from "@react-three/drei";
import { Box3, Vector3 } from "three";

function Grass({ solarPanelPosition = [0, 0, 0] }) {
  const { scene } = useGLTF("/models/grass.glb");

  // Calcula a área do modelo inteiro para encontrar o centro
  const boundingBox = new Box3().setFromObject(scene);
  const center = new Vector3();
  boundingBox.getCenter(center);

  // 🔥 Alinhar o centro da grama com o centro do painel solar
  center.set(solarPanelPosition[0], solarPanelPosition[1], solarPanelPosition[2]);

  // Definir um raio de distância para manter os objetos principais
  const maxDistance = 7.5; // Ajuste esse valor conforme necessário

  scene.traverse((child) => {
    if (child.isMesh) {
      child.receiveShadow = true;
      const childBox = new Box3().setFromObject(child);
      const childCenter = new Vector3();
      childBox.getCenter(childCenter);
      const distance = childCenter.distanceTo(center);

      // Se o objeto estiver muito longe do centro ajustado, remover
      if (distance > maxDistance) {
        child.parent.remove(child);
      }
    }
  });
  return <primitive object={scene} position={[0, -1, 0]} scale={7} />;
}

export default Grass;
