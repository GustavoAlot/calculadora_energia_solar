import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Stars({ starCount = 300, center = [0, 0, 0], verticalOffset = 50, speed = 5 }) {
  const starsRef = useRef();

  // Gera posições aleatórias para as estrelas
  const positions = useMemo(() => {
    const posArray = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const r = 200 + Math.random() * 100;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      posArray[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      posArray[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      posArray[i * 3 + 2] = r * Math.cos(phi);
    }
    return posArray;
  }, [starCount]);

  useFrame(({ clock }) => {
    // Usamos a mesma lógica do sol para definir o fade
    const time = clock.getElapsedTime() * (speed / 100);
    const angle = time % (Math.PI * 2);
    // Supondo que o sol tem uma trajetória definida como:
    const y = center[1] + verticalOffset * Math.sin(angle);
    const minY = -5;
    const maxY = verticalOffset;
    const fadeFactor = THREE.MathUtils.clamp((y - minY) / (maxY - minY), 0, 1);

    // Define um limiar para as estrelas aparecerem: elas só aparecem se fadeFactor for menor que 0.8
    const threshold = 0.6;
    const starOpacity = fadeFactor < threshold ? (threshold - fadeFactor) / threshold : 0;
    
    if (starsRef.current) {
      starsRef.current.material.opacity = starOpacity;
    }
  });

  return (
    <points ref={starsRef}>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        attach="material"
        size={1.5}
        color="white"
        transparent
        opacity={0}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default Stars;
