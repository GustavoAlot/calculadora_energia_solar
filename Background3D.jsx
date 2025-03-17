import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import Sun from "./Sun";
import SolarPanel from "./SolarPanel";
import Grass from "./Grass";
import Stars from "./Stars";

function Background3D() {
  const solarPanelPosition = [0, 0, 0];
  const [sunY, setSunY] = useState(50); // Estado para guardar a posição Y do sol

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
        background: "#000",
      }}
    >
      <Canvas
        camera={{ position: [-34.19, 18.69, -47.45], fov: 67 }}
        style={{ width: "100vw", height: "100vh" }}
        shadows
      >
        <ambientLight intensity={0.2} />
        <Grass solarPanelPosition={solarPanelPosition} />
        <SolarPanel />
        <Sun center={[0, 0, 0]} radius={70} speed={10} verticalOffset={40} setSunY={setSunY} />
         
        <Stars starCount={300} fadeSpeed={1} />


        <EffectComposer>
          <Bloom intensity={1.5} luminanceThreshold={0.7} luminanceSmoothing={0.2} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}

export default Background3D;
