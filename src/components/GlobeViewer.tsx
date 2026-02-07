'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sphere, useTexture, Stars } from '@react-three/drei';
import * as THREE from 'three';
import type { WorldDefinition } from '@/data/worlds';

// ─── Atmosphere Shader ────────────────────────────────
function Atmosphere({ color }: { color: string }) {
  return (
    <Sphere args={[2.08, 64, 64]}>
      <shaderMaterial
        transparent
        side={THREE.BackSide}
        uniforms={{
          glowColor: { value: new THREE.Color(color) },
        }}
        vertexShader={`
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 glowColor;
          varying vec3 vNormal;
          void main() {
            float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 4.0);
            gl_FragColor = vec4(glowColor, intensity * 0.4);
          }
        `}
      />
    </Sphere>
  );
}

// ─── Globe Mesh (clickable) ──────────────────────────
interface GlobeMeshProps {
  texturePath: string;
  accentColor: string;
  opacity: number;
  isTransitioning: boolean;
  onGlobeClick: () => void;
}

function GlobeMesh({ texturePath, accentColor, opacity, isTransitioning, onGlobeClick }: GlobeMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useTexture(texturePath);
  const pointerDown = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (texture) {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 4;
    }
  }, [texture]);

  useFrame((_, delta) => {
    if (meshRef.current && !isTransitioning) {
      meshRef.current.rotation.y += delta * 0.08;
    }
  });

  // Distinguish click from drag: only fire onClick if pointer barely moved
  const handlePointerDown = useCallback((e: any) => {
    pointerDown.current = { x: e.clientX ?? e.point?.x ?? 0, y: e.clientY ?? e.point?.y ?? 0 };
  }, []);

  const handlePointerUp = useCallback(
    (e: any) => {
      if (!pointerDown.current) return;
      const dx = (e.clientX ?? e.point?.x ?? 0) - pointerDown.current.x;
      const dy = (e.clientY ?? e.point?.y ?? 0) - pointerDown.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 5) {
        onGlobeClick();
      }
      pointerDown.current = null;
    },
    [onGlobeClick]
  );

  return (
    <group>
      <Sphere
        ref={meshRef}
        args={[2, 64, 64]}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <meshStandardMaterial
          map={texture}
          transparent
          opacity={opacity}
          roughness={0.8}
          metalness={0.1}
        />
      </Sphere>
      {opacity > 0.5 && <Atmosphere color={accentColor} />}
    </group>
  );
}

// ─── Scene Setup ──────────────────────────────────────
interface SceneProps {
  world: WorldDefinition;
  opacity: number;
  isTransitioning: boolean;
  onGlobeClick: () => void;
}

function Scene({ world, opacity, isTransitioning, onGlobeClick }: SceneProps) {
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 0, 5.5);
    camera.lookAt(0, 0, 0);
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  }, [world.id, camera]);

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 3, 5]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-5, -3, -5]} intensity={0.4} color={world.accentColor} />

      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />

      <GlobeMesh
        texturePath={world.texturePath}
        accentColor={world.accentColor}
        opacity={opacity}
        isTransitioning={isTransitioning}
        onGlobeClick={onGlobeClick}
      />

      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableZoom={true}
        minDistance={3.5}
        maxDistance={8}
        autoRotate={!isTransitioning}
        autoRotateSpeed={0.4}
        enableDamping
        dampingFactor={0.05}
      />
    </>
  );
}

// ─── Main GlobeViewer Component ───────────────────────
interface GlobeViewerProps {
  world: WorldDefinition;
  isTransitioning: boolean;
  globeOpacity: number;
  onReady?: () => void;
  onGlobeClick?: () => void;
}

export default function GlobeViewer({ world, isTransitioning, globeOpacity, onReady, onGlobeClick }: GlobeViewerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    onReady?.();
  }, [onReady]);

  const handleGlobeClick = useCallback(() => {
    if (!isTransitioning && onGlobeClick) {
      onGlobeClick();
    }
  }, [isTransitioning, onGlobeClick]);

  if (!mounted) return null;

  return (
    <Canvas
      camera={{ position: [0, 0, 5.5], fov: 45, near: 0.1, far: 1000 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ background: 'transparent', cursor: 'pointer' }}
      dpr={[1, 2]}
    >
      <Scene
        world={world}
        opacity={globeOpacity}
        isTransitioning={isTransitioning}
        onGlobeClick={handleGlobeClick}
      />
    </Canvas>
  );
}
