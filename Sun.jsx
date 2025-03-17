import React, { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

function Sun({ 
  center = [0, 0, 0], 
  radius = 80, 
  speed = 5, 
  verticalOffset = 50 
}) {
  const { scene } = useGLTF("/models/sun.glb");
  const sunRef = useRef();
  const lightRef = useRef();
  const prevY = useRef(); // para detectar se o sol está descendo
  const { scene: threeScene } = useThree(); // para alterar o fundo

  // Configura o material do sol usando MeshStandardMaterial para suportar emissiveIntensity
  scene.traverse((child) => {
    if (child.isMesh) {
      child.material = new THREE.MeshStandardMaterial({
        color: "#FFFFCC",       // Cor padrão de dia (amarelado pálido)
        emissive: new THREE.Color("#FFD700"),    // Brilho suave de dia
        emissiveIntensity: 4,
        transparent: true,
        opacity: 1,
      });
    }
  });

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime() * (speed / 100);
    const angle = time % (Math.PI * 2); // Mantém um ciclo contínuo
    const centerVec = new THREE.Vector3(...center);
    const x = centerVec.x + radius * Math.cos(angle);
    const z = centerVec.z + radius * Math.sin(angle);
    const y = centerVec.y + verticalOffset * Math.sin(angle);
    
    // Atualiza a posição do sol
    if (sunRef.current) {
      sunRef.current.position.set(x, y, z);
    }
    
    if (lightRef.current) {
      lightRef.current.position.set(x, y, z);
      lightRef.current.target.position.set(centerVec.x, centerVec.y, centerVec.z);
      lightRef.current.target.updateMatrixWorld();

      // Define o fade com base na altura do sol
      const minY = -5; // altura em que o sol deve desaparecer
      const maxY = verticalOffset; // altura máxima do sol
      const fadeFactor = THREE.MathUtils.clamp((y - minY) / (maxY - minY), 0, 1);

      // Detecta se o sol está descendo (sunset)
      let descending = false;
      if (prevY.current !== undefined) {
        descending = y < prevY.current;
      }
      prevY.current = y;

      // Define as cores para dia e sunset
      const dayColor = new THREE.Color("#FFFFCC");    // Cor de dia (pálido)
      const sunsetColor = new THREE.Color("#FF6600");   // Cor de sunset (laranja vibrante)

      let newSunColor = dayColor.clone();
      if (descending && fadeFactor < 0.5) {
        // Quanto menor o fadeFactor, mais intenso o laranja
        const factor = 1 - fadeFactor * 2; // fadeFactor 0 => factor=1; 0.5 => factor=0
        newSunColor = dayColor.clone().lerp(sunsetColor, factor);
      }
      
      lightRef.current.color.copy(newSunColor);
      lightRef.current.intensity = 8 * fadeFactor;

      // Atualiza a opacidade do modelo do sol para o fade
      scene.traverse((child) => {
        if (child.isMesh) {
          child.material.opacity = fadeFactor;
        }
      });
      
      // Atualiza o fundo (céu) – transição suave para um azul escuro à noite
      const nightSky = new THREE.Color("#001122");  
      const daySky = new THREE.Color("#6FA3FF");
      let newSkyColor = daySky.clone().lerp(nightSky, 1 - fadeFactor);
      if (y < minY) {
        newSkyColor = nightSky;
      }
      threeScene.background = newSkyColor;
    }
  });

  return (
    <group ref={sunRef}>
      <primitive object={scene} scale={1.5} />
      <directionalLight
        ref={lightRef}
        intensity={8}
        color={"#FFD700"}
        castShadow
        shadow-mapSize-width={8192}
        shadow-mapSize-height={8192}
        shadow-camera-near={1}
        shadow-camera-far={200}
        shadow-camera-left={-100}
        shadow-camera-right={100}
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
        shadowBias={-0.002}
        shadowRadius={10}
      />
    </group>
  );
}

export default Sun;
