import React from "react";
import Scene from "./Scene";

function Background3D() {
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
      <Scene />
    </div>
  );
}

export default Background3D;
