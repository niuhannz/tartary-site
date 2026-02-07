'use client';

import { useRef, useState, useCallback, useEffect, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrthographicCamera, Float, Text, Sparkles, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════
interface District {
  id: string;
  label: string;
  subtitle: string;
  href: string;
  position: [number, number, number];
  baseColor: string;
  neonColor: string;
  pulseSpeed: number;
}

// ═══════════════════════════════════════════════════════════════════════
// DISTRICT DATA — Five pillars of the TARTARY megacity
// ═══════════════════════════════════════════════════════════════════════
const districts: District[] = [
  {
    id: 'universe',
    label: 'UNIVERSE',
    subtitle: 'Worlds & Characters',
    href: '/worlds',
    position: [0, 0, 0],
    baseColor: '#0d1b2a',
    neonColor: '#3b82f6',
    pulseSpeed: 1.0,
  },
  {
    id: 'cinema',
    label: 'CINEMA',
    subtitle: 'Film & Anime',
    href: '/cinema',
    position: [7.5, 0, -2.5],
    baseColor: '#1a0f00',
    neonColor: '#f59e0b',
    pulseSpeed: 0.8,
  },
  {
    id: 'games',
    label: 'GAMES',
    subtitle: 'Interactive & Systems',
    href: '/games',
    position: [-7.5, 0, -2.5],
    baseColor: '#0a1f15',
    neonColor: '#10b981',
    pulseSpeed: 1.2,
  },
  {
    id: 'publishing',
    label: 'PUBLISHING',
    subtitle: 'Books & Print',
    href: '/publishing',
    position: [4.5, 0, 6],
    baseColor: '#140a2e',
    neonColor: '#8b5cf6',
    pulseSpeed: 0.7,
  },
  {
    id: 'shop',
    label: 'SHOP',
    subtitle: 'Store & Membership',
    href: '/shop',
    position: [-4.5, 0, 6],
    baseColor: '#1a1208',
    neonColor: '#c9a96e',
    pulseSpeed: 0.9,
  },
];

// Connection topology
const CONNECTIONS: [number, number][] = [
  [0, 1], [0, 2], [0, 3], [0, 4], [1, 3], [2, 4],
];

// ═══════════════════════════════════════════════════════════════════════
// SHADERS — Custom ground with scanning line
// ═══════════════════════════════════════════════════════════════════════
const groundVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const groundFragmentShader = /* glsl */ `
  precision highp float;
  uniform float uTime;
  varying vec2 vUv;

  void main() {
    vec2 cUv = vUv - 0.5;
    float dist = length(cUv);

    // Grid pattern
    float gridSize = 40.0;
    vec2 grid = abs(fract(vUv * gridSize) - 0.5);
    float gridLine = min(grid.x, grid.y);
    float gridAlpha = 1.0 - smoothstep(0.0, 0.04, gridLine);

    // Major grid overlay (every 5th line)
    vec2 majorGrid = abs(fract(vUv * 8.0) - 0.5);
    float majorLine = min(majorGrid.x, majorGrid.y);
    float majorAlpha = 1.0 - smoothstep(0.0, 0.02, majorLine);

    // Primary scanning line (horizontal sweep)
    float scanY = fract(uTime * 0.06);
    float scan1 = 1.0 - smoothstep(0.0, 0.008, abs(vUv.y - scanY));
    // Echo trails
    float echo1 = 1.0 - smoothstep(0.0, 0.004, abs(vUv.y - scanY + 0.015));
    float echo2 = 1.0 - smoothstep(0.0, 0.003, abs(vUv.y - scanY + 0.030));

    // Secondary scanning line (vertical, slower)
    float scanX = fract(uTime * 0.04 + 0.3);
    float scan2 = 1.0 - smoothstep(0.0, 0.006, abs(vUv.x - scanX));

    // Radial fade
    float fade = 1.0 - smoothstep(0.15, 0.5, dist);
    float outerGlow = smoothstep(0.48, 0.5, dist) * 0.02;

    // Colors
    vec3 goldDim = vec3(0.788, 0.663, 0.431) * 0.08;
    vec3 goldBright = vec3(0.788, 0.663, 0.431);

    vec3 color = goldDim * gridAlpha * fade;
    color += goldDim * majorAlpha * fade * 2.0;
    color += goldBright * scan1 * fade * 0.6;
    color += goldBright * echo1 * fade * 0.2;
    color += goldBright * echo2 * fade * 0.1;
    color += goldBright * scan2 * fade * 0.25;

    float alpha = gridAlpha * 0.05 * fade
                + majorAlpha * 0.08 * fade
                + scan1 * 0.25 * fade
                + echo1 * 0.08 * fade
                + echo2 * 0.04 * fade
                + scan2 * 0.12 * fade
                + outerGlow;

    gl_FragColor = vec4(color, alpha);
  }
`;

// ═══════════════════════════════════════════════════════════════════════
// SCANLINE GROUND
// ═══════════════════════════════════════════════════════════════════════
function ScanlineGround() {
  const matRef = useRef<THREE.ShaderMaterial>(null!);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
    }),
    []
  );

  useFrame((state) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <group>
      {/* Black floor base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08, 0]} receiveShadow>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#030303" metalness={0.95} roughness={0.4} />
      </mesh>
      {/* Scanline overlay */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[80, 80]} />
        <shaderMaterial
          ref={matRef}
          vertexShader={groundVertexShader}
          fragmentShader={groundFragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// MEGA BUILDING — Physical material megastructure element
// ═══════════════════════════════════════════════════════════════════════
function MegaBuilding({
  geometry,
  position,
  scale,
  baseColor,
  neonColor,
  hovered,
  rotation,
}: {
  geometry: THREE.BufferGeometry;
  position: [number, number, number];
  scale: [number, number, number];
  baseColor: string;
  neonColor: string;
  hovered: boolean;
  rotation?: [number, number, number];
}) {
  const ref = useRef<THREE.Mesh>(null!);
  const emissiveTarget = useRef(0.2);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const target = hovered ? 1.8 : 0.4;
    emissiveTarget.current = THREE.MathUtils.lerp(emissiveTarget.current, target, delta * 5);
    const mat = ref.current.material as THREE.MeshPhysicalMaterial;
    mat.emissiveIntensity = emissiveTarget.current;
  });

  return (
    <mesh
      ref={ref}
      geometry={geometry}
      position={position}
      scale={scale}
      rotation={rotation || [0, 0, 0]}
      castShadow
      receiveShadow
    >
      <meshPhysicalMaterial
        color={baseColor}
        metalness={0.7}
        roughness={0.15}
        emissive={neonColor}
        emissiveIntensity={0.4}
        clearcoat={0.4}
        clearcoatRoughness={0.15}
        envMapIntensity={1.0}
      />
    </mesh>
  );
}

// Neon strip — thin glowing accent line on a building
function NeonStrip({
  position,
  scale,
  color,
  hovered,
}: {
  position: [number, number, number];
  scale: [number, number, number];
  color: string;
  hovered: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (!ref.current) return;
    const mat = ref.current.material as THREE.MeshBasicMaterial;
    const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.3 + 0.7;
    mat.opacity = hovered ? pulse : 0.4;
  });

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color={color} transparent opacity={0.4} />
    </mesh>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// DISTRICT ARCHITECTURES — Unique megastructures per district
// ═══════════════════════════════════════════════════════════════════════

// Shared geometry cache
const geoCache = {
  box: new THREE.BoxGeometry(1, 1, 1),
  cylinder: new THREE.CylinderGeometry(0.5, 0.5, 1, 24),
  cone: new THREE.ConeGeometry(0.5, 1, 6),
  sphere: new THREE.SphereGeometry(0.5, 24, 16),
  dome: new THREE.SphereGeometry(0.5, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2),
  octahedron: new THREE.OctahedronGeometry(0.5, 0),
  icosahedron: new THREE.IcosahedronGeometry(0.5, 0),
  torus: new THREE.TorusGeometry(0.5, 0.08, 8, 32),
  ring: new THREE.RingGeometry(0.4, 0.5, 32),
};

// UNIVERSE — Observatory dome with orbiting crystal spires
function UniverseDistrict({ hovered }: { hovered: boolean }) {
  const ringRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      ringRef.current.rotation.x = Math.PI / 3 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  const c = districts[0];
  return (
    <group>
      {/* Main observatory dome */}
      <MegaBuilding geometry={geoCache.dome} position={[0, 0, 0]} scale={[3.2, 2.2, 3.2]} baseColor={c.baseColor} neonColor={c.neonColor} hovered={hovered} />
      {/* Antenna spire */}
      <MegaBuilding geometry={geoCache.cylinder} position={[0, 2.8, 0]} scale={[0.15, 1.8, 0.15]} baseColor="#0a1628" neonColor={c.neonColor} hovered={hovered} />
      {/* Orbiting holographic ring */}
      <mesh ref={ringRef} position={[0, 1.8, 0]}>
        <torusGeometry args={[2.0, 0.03, 8, 64]} />
        <meshBasicMaterial color={c.neonColor} transparent opacity={hovered ? 0.7 : 0.25} />
      </mesh>
      {/* Crystal spires */}
      <MegaBuilding geometry={geoCache.octahedron} position={[1.8, 1.2, -1.0]} scale={[0.4, 2.6, 0.4]} baseColor="#0f1d30" neonColor={c.neonColor} hovered={hovered} />
      <MegaBuilding geometry={geoCache.octahedron} position={[-1.6, 0.9, 0.8]} scale={[0.35, 2.0, 0.35]} baseColor="#0f1d30" neonColor={c.neonColor} hovered={hovered} />
      <MegaBuilding geometry={geoCache.octahedron} position={[0.9, 0.8, 1.5]} scale={[0.3, 1.6, 0.3]} baseColor="#0f1d30" neonColor={c.neonColor} hovered={hovered} />
      {/* Neon accent strips */}
      <NeonStrip position={[0, 0.5, 1.6]} scale={[1.5, 0.04, 0.04]} color={c.neonColor} hovered={hovered} />
      <NeonStrip position={[0, 0.8, -1.5]} scale={[1.2, 0.04, 0.04]} color={c.neonColor} hovered={hovered} />
      {/* Ground glow ring */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.5, 1.65, 64]} />
        <meshBasicMaterial color={c.neonColor} transparent opacity={hovered ? 0.5 : 0.08} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// CINEMA — Screen towers with projection beam
function CinemaDistrict({ hovered }: { hovered: boolean }) {
  const beamRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (beamRef.current) {
      const mat = beamRef.current.material as THREE.MeshBasicMaterial;
      const flicker = Math.sin(state.clock.elapsedTime * 8) * 0.15 + 0.35;
      mat.opacity = hovered ? flicker : 0.05;
    }
  });

  const c = districts[1];
  return (
    <group>
      {/* Main screen tower */}
      <MegaBuilding geometry={geoCache.box} position={[0, 1.0, 0]} scale={[3.0, 2.0, 0.6]} baseColor={c.baseColor} neonColor={c.neonColor} hovered={hovered} />
      {/* Screen surface (bright emissive face) */}
      <mesh position={[0, 1.0, 0.32]}>
        <planeGeometry args={[2.6, 1.6]} />
        <meshBasicMaterial color={c.neonColor} transparent opacity={hovered ? 0.6 : 0.15} />
      </mesh>
      {/* Twin projection towers */}
      <MegaBuilding geometry={geoCache.box} position={[-1.8, 1.5, -0.5]} scale={[0.5, 3.0, 0.5]} baseColor="#1a0f00" neonColor={c.neonColor} hovered={hovered} />
      <MegaBuilding geometry={geoCache.box} position={[1.8, 1.5, -0.5]} scale={[0.5, 3.0, 0.5]} baseColor="#1a0f00" neonColor={c.neonColor} hovered={hovered} />
      {/* Tower caps */}
      <MegaBuilding geometry={geoCache.cone} position={[-1.8, 3.2, -0.5]} scale={[0.5, 0.6, 0.5]} baseColor="#1a0f00" neonColor={c.neonColor} hovered={hovered} />
      <MegaBuilding geometry={geoCache.cone} position={[1.8, 3.2, -0.5]} scale={[0.5, 0.6, 0.5]} baseColor="#1a0f00" neonColor={c.neonColor} hovered={hovered} />
      {/* Projection beam */}
      <mesh ref={beamRef} position={[0, 2.2, 0.6]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[1.5, 4, 16, 1, true]} />
        <meshBasicMaterial color={c.neonColor} transparent opacity={0.05} side={THREE.DoubleSide} />
      </mesh>
      {/* Horizontal neon strips */}
      <NeonStrip position={[0, 0.2, 0.32]} scale={[2.8, 0.06, 0.06]} color={c.neonColor} hovered={hovered} />
      <NeonStrip position={[0, 1.8, 0.32]} scale={[2.8, 0.06, 0.06]} color={c.neonColor} hovered={hovered} />
      <NeonStrip position={[-1.8, 0.3, -0.2]} scale={[0.06, 0.06, 0.6]} color={c.neonColor} hovered={hovered} />
      <NeonStrip position={[1.8, 0.3, -0.2]} scale={[0.06, 0.06, 0.6]} color={c.neonColor} hovered={hovered} />
    </group>
  );
}

// GAMES — Circuit tower with data veins
function GamesDistrict({ hovered }: { hovered: boolean }) {
  const c = districts[2];
  return (
    <group>
      {/* Main circuit tower */}
      <MegaBuilding geometry={geoCache.box} position={[0, 1.8, 0]} scale={[1.4, 3.6, 1.4]} baseColor={c.baseColor} neonColor={c.neonColor} hovered={hovered} />
      {/* Tower crown */}
      <MegaBuilding geometry={geoCache.box} position={[0, 3.8, 0]} scale={[1.8, 0.3, 1.8]} baseColor="#0a1f15" neonColor={c.neonColor} hovered={hovered} />
      {/* Antenna array */}
      <MegaBuilding geometry={geoCache.cylinder} position={[0.4, 4.3, 0.4]} scale={[0.08, 1.0, 0.08]} baseColor="#0a1f15" neonColor={c.neonColor} hovered={hovered} />
      <MegaBuilding geometry={geoCache.cylinder} position={[-0.4, 4.1, -0.4]} scale={[0.08, 0.7, 0.08]} baseColor="#0a1f15" neonColor={c.neonColor} hovered={hovered} />
      {/* Satellite pylons */}
      <MegaBuilding geometry={geoCache.box} position={[2.0, 0.8, 0.6]} scale={[0.8, 1.6, 0.8]} baseColor="#0d2419" neonColor={c.neonColor} hovered={hovered} />
      <MegaBuilding geometry={geoCache.box} position={[-1.6, 0.6, -0.8]} scale={[0.9, 1.2, 0.7]} baseColor="#0d2419" neonColor={c.neonColor} hovered={hovered} />
      {/* Hexagonal base */}
      <MegaBuilding geometry={geoCache.cylinder} position={[0, 0.08, 0]} scale={[2.8, 0.16, 2.8]} baseColor="#060e0a" neonColor={c.neonColor} hovered={hovered} />
      {/* Data veins (vertical neon strips on main tower) */}
      <NeonStrip position={[0.72, 1.8, 0]} scale={[0.05, 3.4, 0.05]} color={c.neonColor} hovered={hovered} />
      <NeonStrip position={[-0.72, 1.8, 0]} scale={[0.05, 3.4, 0.05]} color={c.neonColor} hovered={hovered} />
      <NeonStrip position={[0, 1.8, 0.72]} scale={[0.05, 3.4, 0.05]} color={c.neonColor} hovered={hovered} />
      <NeonStrip position={[0, 1.8, -0.72]} scale={[0.05, 3.4, 0.05]} color={c.neonColor} hovered={hovered} />
      {/* Horizontal circuit lines */}
      <NeonStrip position={[0, 1.0, 0.72]} scale={[1.3, 0.04, 0.04]} color={c.neonColor} hovered={hovered} />
      <NeonStrip position={[0, 2.5, -0.72]} scale={[1.3, 0.04, 0.04]} color={c.neonColor} hovered={hovered} />
    </group>
  );
}

// PUBLISHING — Stacked library with bookmark tower
function PublishingDistrict({ hovered }: { hovered: boolean }) {
  const c = districts[3];
  return (
    <group>
      {/* Stacked book slabs */}
      <MegaBuilding geometry={geoCache.box} position={[0, 0.4, 0]} scale={[2.8, 0.8, 1.6]} baseColor={c.baseColor} neonColor={c.neonColor} hovered={hovered} />
      <MegaBuilding geometry={geoCache.box} position={[0.2, 1.1, -0.1]} scale={[2.4, 0.6, 1.4]} baseColor="#1a0e35" neonColor={c.neonColor} hovered={hovered} />
      <MegaBuilding geometry={geoCache.box} position={[-0.15, 1.7, 0.1]} scale={[2.6, 0.5, 1.3]} baseColor="#1f1040" neonColor={c.neonColor} hovered={hovered} />
      <MegaBuilding geometry={geoCache.box} position={[0.1, 2.2, 0]} scale={[2.2, 0.4, 1.1]} baseColor="#240f45" neonColor={c.neonColor} hovered={hovered} />
      {/* Bookmark tower (tall thin slab) */}
      <MegaBuilding geometry={geoCache.box} position={[1.7, 1.5, 0]} scale={[0.15, 3.0, 0.8]} baseColor="#2a1350" neonColor={c.neonColor} hovered={hovered} />
      {/* Reading light */}
      <mesh position={[1.7, 3.2, 0]}>
        <sphereGeometry args={[0.15, 16, 8]} />
        <meshBasicMaterial color={c.neonColor} transparent opacity={hovered ? 0.9 : 0.3} />
      </mesh>
      {/* Page glow strips between slabs */}
      <NeonStrip position={[-1.3, 0.82, 0]} scale={[0.06, 0.04, 1.4]} color={c.neonColor} hovered={hovered} />
      <NeonStrip position={[-1.1, 1.42, 0]} scale={[0.06, 0.04, 1.2]} color={c.neonColor} hovered={hovered} />
      <NeonStrip position={[-1.2, 1.96, 0]} scale={[0.06, 0.04, 1.1]} color={c.neonColor} hovered={hovered} />
      {/* Spine lines */}
      <NeonStrip position={[0, 0.4, 0.82]} scale={[2.6, 0.04, 0.04]} color={c.neonColor} hovered={hovered} />
    </group>
  );
}

// SHOP — Grand marketplace arch with golden lanterns
function ShopDistrict({ hovered }: { hovered: boolean }) {
  const c = districts[4];
  return (
    <group>
      {/* Grand arch */}
      <mesh position={[0, 1.6, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[1.5, 0.2, 12, 24, Math.PI]} />
        <meshPhysicalMaterial color={c.baseColor} metalness={0.92} roughness={0.08} emissive={c.neonColor} emissiveIntensity={hovered ? 1.0 : 0.2} clearcoat={0.4} clearcoatRoughness={0.15} />
      </mesh>
      {/* Arch pillars */}
      <MegaBuilding geometry={geoCache.box} position={[-1.5, 0.8, 0]} scale={[0.35, 1.6, 0.35]} baseColor="#1a1208" neonColor={c.neonColor} hovered={hovered} />
      <MegaBuilding geometry={geoCache.box} position={[1.5, 0.8, 0]} scale={[0.35, 1.6, 0.35]} baseColor="#1a1208" neonColor={c.neonColor} hovered={hovered} />
      {/* Market dome behind */}
      <MegaBuilding geometry={geoCache.dome} position={[0, 0, -1.2]} scale={[2.2, 1.4, 2.2]} baseColor="#15100a" neonColor={c.neonColor} hovered={hovered} />
      {/* Display towers */}
      <MegaBuilding geometry={geoCache.cylinder} position={[1.8, 0.9, -0.8]} scale={[0.4, 1.8, 0.4]} baseColor="#1a1208" neonColor={c.neonColor} hovered={hovered} />
      <MegaBuilding geometry={geoCache.cylinder} position={[-1.8, 0.7, -0.8]} scale={[0.4, 1.4, 0.4]} baseColor="#1a1208" neonColor={c.neonColor} hovered={hovered} />
      {/* Golden lanterns (glowing spheres) */}
      <mesh position={[-1.5, 1.8, 0]}>
        <sphereGeometry args={[0.12, 12, 8]} />
        <meshBasicMaterial color="#ffd700" transparent opacity={hovered ? 0.9 : 0.4} />
      </mesh>
      <mesh position={[1.5, 1.8, 0]}>
        <sphereGeometry args={[0.12, 12, 8]} />
        <meshBasicMaterial color="#ffd700" transparent opacity={hovered ? 0.9 : 0.4} />
      </mesh>
      {/* Arch neon trim */}
      <NeonStrip position={[0, 0.05, 0.2]} scale={[3.0, 0.05, 0.05]} color={c.neonColor} hovered={hovered} />
      <NeonStrip position={[0, 0.05, -0.2]} scale={[3.0, 0.05, 0.05]} color={c.neonColor} hovered={hovered} />
    </group>
  );
}

// District renderer
const DISTRICT_COMPONENTS: Record<string, React.FC<{ hovered: boolean }>> = {
  universe: UniverseDistrict,
  cinema: CinemaDistrict,
  games: GamesDistrict,
  publishing: PublishingDistrict,
  shop: ShopDistrict,
};

// ═══════════════════════════════════════════════════════════════════════
// DISTRICT GROUP — Wrapper with platform, label, pulse, hit area
// ═══════════════════════════════════════════════════════════════════════
function DistrictGroup({
  district,
  isHovered,
  onHover,
  onUnhover,
  onClick,
}: {
  district: District;
  isHovered: boolean;
  onHover: () => void;
  onUnhover: () => void;
  onClick: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const pulseRef = useRef<THREE.Mesh>(null!);
  const time = useRef(Math.random() * 100);
  const Arch = DISTRICT_COMPONENTS[district.id];

  useFrame((state, delta) => {
    time.current += delta;
    if (groupRef.current) {
      // Gentle float
      const float = Math.sin(time.current * 0.6) * 0.06;
      groupRef.current.position.y = district.position[1] + float;
    }
    // Neon pulse ring
    if (pulseRef.current) {
      const mat = pulseRef.current.material as THREE.MeshBasicMaterial;
      const pulse = Math.sin(state.clock.elapsedTime * district.pulseSpeed * 2) * 0.15 + 0.35;
      mat.opacity = isHovered ? pulse * 1.5 : pulse * 0.3;
      pulseRef.current.rotation.z = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <group
      ref={groupRef}
      position={district.position}
      onPointerOver={(e) => { e.stopPropagation(); onHover(); document.body.style.cursor = 'pointer'; }}
      onPointerOut={(e) => { e.stopPropagation(); onUnhover(); document.body.style.cursor = 'default'; }}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
    >
      {/* Invisible hit area */}
      <mesh visible={false}>
        <cylinderGeometry args={[3.2, 3.2, 5, 16]} />
        <meshBasicMaterial />
      </mesh>

      {/* District architecture */}
      <Arch hovered={isHovered} />

      {/* Base platform */}
      <mesh position={[0, -0.04, 0]} receiveShadow>
        <cylinderGeometry args={[3.2, 3.4, 0.08, 6]} />
        <meshPhysicalMaterial
          color="#080808"
          metalness={0.95}
          roughness={0.2}
          emissive={district.neonColor}
          emissiveIntensity={isHovered ? 0.35 : 0.04}
        />
      </mesh>

      {/* Neon pulse ring */}
      <mesh ref={pulseRef} position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.0, 3.35, 6]} />
        <meshBasicMaterial color={district.neonColor} transparent opacity={0.1} side={THREE.DoubleSide} />
      </mesh>

      {/* Hover spotlight */}
      {isHovered && (
        <pointLight position={[0, 5, 0]} color={district.neonColor} intensity={10} distance={14} decay={2} />
      )}

      {/* Floating label */}
      <Float speed={1.2} rotationIntensity={0} floatIntensity={0.2} floatingRange={[0, 0.1]}>
        <Text
          position={[0, 4.6, 0]}
          fontSize={0.55}
          color={isHovered ? '#ffffff' : '#c9a96e'}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.22}
          outlineWidth={0.025}
          outlineColor="#000000"
          fillOpacity={isHovered ? 1 : 0.6}
        >
          {district.label}
        </Text>
        <Text
          position={[0, 4.0, 0]}
          fontSize={0.22}
          color={isHovered ? district.neonColor : '#555555'}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.15}
          outlineWidth={0.01}
          outlineColor="#000000"
        >
          {district.subtitle}
        </Text>
      </Float>

      {/* District sparkles */}
      <Sparkles
        count={isHovered ? 50 : 10}
        scale={[6, 5, 6]}
        size={isHovered ? 3.5 : 1.2}
        speed={0.5}
        color={district.neonColor}
        opacity={isHovered ? 0.9 : 0.25}
      />
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// DATA STREAMS — Animated particles flowing along paths
// ═══════════════════════════════════════════════════════════════════════
function DataStream({
  from,
  to,
  color,
  speed,
  count,
}: {
  from: [number, number, number];
  to: [number, number, number];
  color: string;
  speed: number;
  count: number;
}) {
  const ref = useRef<THREE.Points>(null!);

  const curve = useMemo(() => {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const mid = a.clone().add(b).multiplyScalar(0.5);
    mid.y = 2.0; // Arc height
    return new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(a.x, 0.3, a.z),
      mid,
      new THREE.Vector3(b.x, 0.3, b.z)
    );
  }, [from, to]);

  const positions = useMemo(() => new Float32Array(count * 3), [count]);

  useFrame((state) => {
    if (!ref.current) return;
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    const t = state.clock.elapsedTime * speed;
    for (let i = 0; i < count; i++) {
      const progress = ((t * 0.15 + i / count) % 1 + 1) % 1;
      const pt = curve.getPointAt(progress);
      arr[i * 3] = pt.x;
      arr[i * 3 + 1] = pt.y;
      arr[i * 3 + 2] = pt.z;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        color={color}
        transparent
        opacity={0.85}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// DATA DRONES — Small floating objects traversing paths
// ═══════════════════════════════════════════════════════════════════════
function DataDrone({
  from,
  to,
  color,
  speed,
  offset,
}: {
  from: [number, number, number];
  to: [number, number, number];
  color: string;
  speed: number;
  offset: number;
}) {
  const ref = useRef<THREE.Mesh>(null!);

  const curve = useMemo(() => {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const mid = a.clone().add(b).multiplyScalar(0.5);
    mid.y = 1.8;
    return new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(a.x, 0.5, a.z),
      mid,
      new THREE.Vector3(b.x, 0.5, b.z)
    );
  }, [from, to]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = ((state.clock.elapsedTime * speed * 0.12 + offset) % 1 + 1) % 1;
    const pt = curve.getPointAt(t);
    ref.current.position.copy(pt);
    ref.current.position.y += Math.sin(state.clock.elapsedTime * 4 + offset * 20) * 0.08;
    ref.current.rotation.y = state.clock.elapsedTime * 3;
    ref.current.rotation.x = state.clock.elapsedTime * 2;
  });

  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[0.07, 0]} />
      <meshPhysicalMaterial
        color={color}
        emissive={color}
        emissiveIntensity={3}
        metalness={0.9}
        roughness={0.1}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// DIGITAL SMOG — Low-lying atmospheric particle cloud
// ═══════════════════════════════════════════════════════════════════════
function DigitalSmog() {
  const count = 250;
  const ref = useRef<THREE.Points>(null!);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 50;
      arr[i * 3 + 1] = Math.random() * 1.2;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      arr[i * 3] += Math.sin(t * 0.08 + i * 0.5) * 0.003;
      arr[i * 3 + 2] += Math.cos(t * 0.06 + i * 0.3) * 0.003;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.5}
        color="#0a0a1a"
        transparent
        opacity={0.12}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// AMBIENT MOTES — High-altitude floating particles
// ═══════════════════════════════════════════════════════════════════════
function AmbientMotes() {
  const count = 150;
  const ref = useRef<THREE.Points>(null!);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 45;
      arr[i * 3 + 1] = Math.random() * 10 + 1;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 45;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += Math.sin(state.clock.elapsedTime * 0.2 + i) * 0.002;
      if (arr[i * 3 + 1] > 12) arr[i * 3 + 1] = 1;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#c9a96e"
        transparent
        opacity={0.5}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// CAMERA RIG — Lazy follow with smooth damping
// ═══════════════════════════════════════════════════════════════════════
function CameraRig({ target }: { target: [number, number, number] | null }) {
  const { camera } = useThree();
  const defaultPos = useMemo(() => new THREE.Vector3(20, 18, 20), []);
  const defaultLookAt = useMemo(() => new THREE.Vector3(0, 0, 1.5), []);
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 1.5));
  const time = useRef(0);

  useFrame((_, delta) => {
    time.current += delta;

    // Very gentle orbit
    const ox = Math.sin(time.current * 0.06) * 0.6;
    const oz = Math.cos(time.current * 0.06) * 0.6;

    // Subtle lean toward hovered district (very gentle shift)
    const targetPos = target
      ? new THREE.Vector3(
          defaultPos.x + ox + (target[0]) * 0.06,
          defaultPos.y,
          defaultPos.z + oz + (target[2]) * 0.06
        )
      : new THREE.Vector3(defaultPos.x + ox, defaultPos.y, defaultPos.z + oz);

    const targetLook = target
      ? new THREE.Vector3(target[0] * 0.3, 0.5, target[2] * 0.3 + 1.5)
      : defaultLookAt;

    // Smooth damping (lazy follow)
    camera.position.lerp(targetPos, delta * 1.8);
    currentLookAt.current.lerp(targetLook, delta * 1.8);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}

// ═══════════════════════════════════════════════════════════════════════
// SCENE — Full megacity assembly
// ═══════════════════════════════════════════════════════════════════════
function Scene({
  hoveredDistrict,
  setHoveredDistrict,
  onDistrictClick,
}: {
  hoveredDistrict: string | null;
  setHoveredDistrict: (id: string | null) => void;
  onDistrictClick: (href: string) => void;
}) {
  return (
    <>
      {/* Environment map for metallic reflections */}
      <Environment preset="night" environmentIntensity={0.4} />

      {/* Lighting rig */}
      <ambientLight intensity={0.35} color="#8a9ab8" />
      <directionalLight
        position={[15, 25, 12]}
        intensity={1.0}
        color="#fff8e8"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={70}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
      />
      <directionalLight position={[-12, 18, -12]} intensity={0.3} color="#4a6fa5" />
      <pointLight position={[0, 10, 0]} intensity={2.0} color="#c9a96e" distance={30} decay={2} />

      {/* Per-district colored lights */}
      {districts.map((d) => (
        <pointLight
          key={`light-${d.id}`}
          position={[d.position[0], 3, d.position[2]]}
          intensity={hoveredDistrict === d.id ? 4 : 0.6}
          color={d.neonColor}
          distance={10}
          decay={2}
        />
      ))}

      {/* Atmospheric fog */}
      <fog attach="fog" args={['#020204', 40, 75]} />

      {/* Scanline ground */}
      <ScanlineGround />

      {/* Districts */}
      {districts.map((d) => (
        <DistrictGroup
          key={d.id}
          district={d}
          isHovered={hoveredDistrict === d.id}
          onHover={() => setHoveredDistrict(d.id)}
          onUnhover={() => setHoveredDistrict(null)}
          onClick={() => onDistrictClick(d.href)}
        />
      ))}

      {/* Data streams between districts */}
      {CONNECTIONS.map(([from, to], i) => (
        <DataStream
          key={`stream-${i}`}
          from={districts[from].position}
          to={districts[to].position}
          color={districts[from].neonColor}
          speed={0.8 + i * 0.15}
          count={6}
        />
      ))}

      {/* Data drones */}
      {CONNECTIONS.map(([from, to], i) => (
        <DataDrone
          key={`drone-${i}`}
          from={districts[from].position}
          to={districts[to].position}
          color={districts[to].neonColor}
          speed={0.6 + i * 0.1}
          offset={i * 0.17}
        />
      ))}

      {/* Digital smog */}
      <DigitalSmog />

      {/* Ambient motes */}
      <AmbientMotes />

      {/* Camera */}
      <CameraRig
        target={
          hoveredDistrict
            ? districts.find((d) => d.id === hoveredDistrict)?.position || null
            : null
        }
      />
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// HUD OVERLAY
// ═══════════════════════════════════════════════════════════════════════
function HUDOverlay({
  hoveredDistrict,
  onDistrictClick,
  isReady,
}: {
  hoveredDistrict: string | null;
  onDistrictClick: (href: string) => void;
  isReady: boolean;
}) {
  const district = hoveredDistrict ? districts.find((d) => d.id === hoveredDistrict) : null;

  return (
    <div className="absolute inset-0 pointer-events-none z-30">
      {/* Top-left title */}
      <div className="absolute top-28 left-8 md:left-12">
        <p
          className="text-[11px] tracking-[0.25em] uppercase text-gold/70 mb-3 transition-all duration-[800ms] ease-out"
          style={{
            fontFamily: 'var(--font-mono)',
            opacity: isReady ? 1 : 0,
            transform: isReady ? 'translateY(0)' : 'translateY(10px)',
            transitionDelay: '300ms',
          }}
        >
          Interactive Roadmap
        </p>
        <h1
          className="text-4xl sm:text-5xl lg:text-6xl font-light text-foreground leading-tight transition-all duration-[900ms] ease-out"
          style={{
            fontFamily: 'var(--font-heading)',
            opacity: isReady ? 1 : 0,
            transform: isReady ? 'translateY(0)' : 'translateY(20px)',
            transitionDelay: '500ms',
          }}
        >
          We Build
          <br />
          <span className="logo-sheen">Worlds</span>
        </h1>
      </div>

      {/* Bottom info bar */}
      <div className="absolute bottom-8 left-8 right-8 md:left-12 md:right-12 flex justify-between items-end">
        <div
          className="transition-opacity duration-[800ms] ease-out"
          style={{ opacity: isReady ? 1 : 0, transitionDelay: '800ms' }}
        >
          {district ? (
            <div className="pointer-events-auto">
              <p
                className="text-[10px] tracking-[0.2em] uppercase mb-1"
                style={{ fontFamily: 'var(--font-mono)', color: district.neonColor }}
              >
                {district.subtitle}
              </p>
              <p
                className="text-2xl sm:text-3xl font-light text-foreground mb-2"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {district.label}
              </p>
              <button
                onClick={() => onDistrictClick(district.href)}
                className="text-[11px] tracking-[0.15em] uppercase text-gold hover:text-gold-light transition-colors duration-200 flex items-center gap-2"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                Enter District
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          ) : (
            <p
              className="text-[11px] tracking-[0.15em] uppercase text-ash/60"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              Hover a district to explore
            </p>
          )}
        </div>

        {/* District navigation dots */}
        <div
          className="hidden md:flex items-center gap-6 transition-opacity duration-[800ms] ease-out"
          style={{ opacity: isReady ? 1 : 0, transitionDelay: '1000ms' }}
        >
          {districts.map((d) => (
            <button
              key={d.id}
              onClick={() => onDistrictClick(d.href)}
              className={`pointer-events-auto text-[10px] tracking-[0.15em] uppercase transition-all duration-300 ${
                hoveredDistrict === d.id ? 'text-foreground scale-110' : 'text-ash/50 hover:text-ash'
              }`}
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              <span
                className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 transition-all duration-300"
                style={{
                  backgroundColor: hoveredDistrict === d.id ? d.neonColor : 'rgba(255,255,255,0.15)',
                  boxShadow: hoveredDistrict === d.id ? `0 0 10px ${d.neonColor}` : 'none',
                }}
              />
              {d.id}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 md:hidden transition-opacity duration-1000"
        style={{ opacity: isReady ? 1 : 0, transitionDelay: '1500ms' }}
      >
        <div className="flex flex-col items-center gap-2 animate-bounce">
          <span className="text-[9px] tracking-[0.2em] uppercase text-ash/40" style={{ fontFamily: 'var(--font-mono)' }}>
            Scroll
          </span>
          <svg width="12" height="20" viewBox="0 0 12 20" fill="none" className="text-gold/40">
            <path d="M6 2v12M2 11l4 5 4-5" stroke="currentColor" strokeWidth="1" />
          </svg>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// LOADING SCREEN
// ═══════════════════════════════════════════════════════════════════════
function LoadingScreen() {
  return (
    <motion.div
      className="absolute inset-0 z-40 bg-[#020204] flex flex-col items-center justify-center"
      exit={{ opacity: 0 }}
      transition={{ duration: 1.0, ease: 'easeInOut' }}
    >
      <div className="text-center">
        <p
          className="text-2xl tracking-[0.4em] uppercase mb-8 logo-sheen"
          style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}
        >
          Tartary
        </p>
        <div className="w-48 h-[1px] bg-white/10 mx-auto relative overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full bg-gold"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2.2, ease: 'easeInOut' }}
          />
        </div>
        <p className="text-[10px] tracking-[0.25em] uppercase text-ash/40 mt-4" style={{ fontFamily: 'var(--font-mono)' }}>
          Initializing megacity
        </p>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════
export default function TartaryWorld() {
  const router = useRouter();
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleDistrictClick = useCallback(
    (href: string) => { router.push(href); },
    [router]
  );

  return (
    <div className="relative w-full h-screen bg-[#020204] overflow-hidden">
      {/* Three.js Canvas */}
      <Suspense fallback={null}>
        <Canvas
          shadows
          dpr={[1, 1.5]}
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.2,
            powerPreference: 'high-performance',
          }}
          onCreated={({ gl }) => {
            gl.setClearColor('#020204');
          }}
        >
          <OrthographicCamera
            makeDefault
            position={[20, 18, 20]}
            zoom={36}
            near={0.1}
            far={120}
          />
          <Scene
            hoveredDistrict={hoveredDistrict}
            setHoveredDistrict={setHoveredDistrict}
            onDistrictClick={handleDistrictClick}
          />
        </Canvas>
      </Suspense>

      {/* HUD Overlay */}
      <HUDOverlay
        hoveredDistrict={hoveredDistrict}
        onDistrictClick={handleDistrictClick}
        isReady={isLoaded}
      />

      {/* Loading screen */}
      <AnimatePresence>
        {!isLoaded && <LoadingScreen />}
      </AnimatePresence>

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-[5]"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(2,2,4,0.6) 100%)',
        }}
      />

      {/* Top fade for nav blend */}
      <div
        className="absolute top-0 left-0 right-0 h-28 pointer-events-none z-[5]"
        style={{
          background: 'linear-gradient(to bottom, rgba(2,2,4,0.6) 0%, transparent 100%)',
        }}
      />
    </div>
  );
}
