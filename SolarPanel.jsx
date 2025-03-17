import React from "react";
import { useGLTF } from "@react-three/drei";

function SolarPanel() {
  const { scene } = useGLTF("/models/painel-solar.glb");

  scene.traverse((obj) => {
    if (obj.isMesh) {
      obj.castShadow = true;  // Agora o painel lança sombras
    }
  });

  return <primitive object={scene} position={[0, 0, 0]} scale={1} />;
}

export default SolarPanel;
