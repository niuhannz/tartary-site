'use client';

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function SpinningBox() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta;
      ref.current.rotation.y += delta * 0.5;
    }
  });
  return (
    <mesh ref={ref}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="orange" emissive="orange" emissiveIntensity={0.5} />
    </mesh>
  );
}

function DebugScene() {
  useFrame(({ gl, scene, camera }) => {
    // Force render every frame and log once
    gl.render(scene, camera);
  });
  return null;
}

export default function TartaryWorld() {
  const [info, setInfo] = useState('waiting...');

  return (
    <div className="relative w-full h-screen bg-red-900 overflow-hidden">
      <Canvas
        gl={{
          antialias: true,
          alpha: false,
          preserveDrawingBuffer: true,
          powerPreference: 'high-performance',
        }}
        camera={{ position: [0, 0, 5], fov: 75 }}
        onCreated={({ gl, scene, camera }) => {
          gl.setClearColor('#ff0000', 1);
          setInfo(`Created! Renderer: ${gl.getContext().getParameter(gl.getContext().RENDERER)}, Scene children: ${scene.children.length}`);
          console.log('[R3F] Created', gl, scene, camera);
          console.log('[R3F] Canvas size:', gl.domElement.width, gl.domElement.height);
          console.log('[R3F] Is WebGL context lost?', gl.getContext().isContextLost());
        }}
      >
        <color attach="background" args={['#0000ff']} />
        <ambientLight intensity={1} />
        <directionalLight position={[5, 5, 5]} intensity={2} />
        <SpinningBox />
        <DebugScene />
      </Canvas>

      <div className="absolute top-4 left-4 z-50 text-white text-sm font-mono bg-black/80 p-3 rounded max-w-lg">
        <p>R3F Test v3</p>
        <p>Background should be BLUE, box should be ORANGE</p>
        <p>If you see RED, canvas is transparent</p>
        <p>Info: {info}</p>
      </div>
    </div>
  );
}
