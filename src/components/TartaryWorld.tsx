'use client';

import { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrthographicCamera, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { useRouter } from 'next/navigation';

// ═══════════════════════════════════════════════════════════════════════
// MINIMAL TEST: Spinning box to verify R3F renders at all
// ═══════════════════════════════════════════════════════════════════════
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
      <meshStandardMaterial color="#c9a96e" emissive="#c9a96e" emissiveIntensity={0.3} metalness={0.5} roughness={0.3} />
    </mesh>
  );
}

export default function TartaryWorld() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    console.log('[TartaryWorld] Component mounted');
  }, []);

  if (!mounted) {
    return (
      <div className="relative w-full h-screen bg-[#020204] flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-[#020204] overflow-hidden">
      <Canvas
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
        }}
        onCreated={({ gl, scene, camera }) => {
          console.log('[R3F] Canvas created', { renderer: gl.info.render, sceneChildren: scene.children.length });
          gl.setClearColor('#1a0a2e');
        }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <SpinningBox />
      </Canvas>

      {/* Debug overlay */}
      <div className="absolute top-4 left-4 z-50 text-white text-xs font-mono bg-black/50 p-2 rounded">
        R3F Minimal Test — should see spinning gold cube
      </div>
    </div>
  );
}
