'use client';

import { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrthographicCamera, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { useRouter } from 'next/navigation';

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

    float gridSize = 40.0;
    vec2 grid = abs(fract(vUv * gridSize) - 0.5);
    float gridLine = min(grid.x, grid.y);
    float gridAlpha = 1.0 - smoothstep(0.0, 0.04, gridLine);

    vec2 majorGrid = abs(fract(vUv * 8.0) - 0.5);
    float majorLine = min(majorGrid.x, majorGrid.y);
    float majorAlpha = 1.0 - smoothstep(0.0, 0.02, majorLine);

    float scanY = fract(uTime * 0.06);
    float scan1 = 1.0 - smoothstep(0.0, 0.008, abs(vUv.y - scanY));
    float echo1 = 1.0 - smoothstep(0.0, 0.004, abs(vUv.y - scanY + 0.015));
    float echo2 = 1.0 - smoothstep(0.0, 0.003, abs(vUv.y - scanY + 0.030));

    float scanX = fract(uTime * 0.04 + 0.3);
    float scan2 = 1.0 - smoothstep(0.0, 0.006, abs(vUv.x - scanX));

    float fade = 1.0 - smoothstep(0.15, 0.5, dist);
    float outerGlow = smoothstep(0.48, 0.5, dist) * 0.02;

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
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useFrame((state) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08, 0]} receiveShadow>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#030303" metalness={0.95} roughness={0.4} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[80, 80]} />
        <shaderMaterial ref={matRef} vertexShader={groundVertexShader} fragmentShader={groundFragmentShader} uniforms={uniforms} transparent depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// MEGA BUILDING
// ═══════════════════════════════════════════════════════════════════════
function MegaBuilding({ geometry, position, scale, baseColor, neonColor, hovered, rotation }: {
  geometry: THREE.BufferGeometry; position: [number, number, number]; scale: [number, number, number];
  baseColor: string; neonColor: string; hovered: boolean; rotation?: [number, number, number];
}) {
  const ref = useRef<THREE.Mesh>(null!);
  const emissiveTarget = useRef(0.2);

  useFrame((_, delta) => {
    if (!ref.current) return;
    emissiveTarget.current = THREE.MathUtils.lerp(emissiveTarget.current, hovered ? 1.8 : 0.4, delta * 5);
    (ref.current.material as THREE.MeshStandardMaterial).emissiveIntensity = emissiveTarget.current;
  });

  return (
    <mesh ref={ref} geometry={geometry} position={position} scale={scale} rotation={rotation || [0, 0, 0]} castShadow receiveShadow>
      <meshStandardMaterial color={baseColor} metalness={0.7} roughness={0.3} emissive={neonColor} emissiveIntensity={0.5} />
    </mesh>
  );
}

function NeonStrip({ position, scale, color, hovered }: {
  position: [number, number, number]; scale: [number, number, number]; color: string; hovered: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (!ref.current) return;
    const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.3 + 0.7;
    (ref.current.material as THREE.MeshBasicMaterial).opacity = hovered ? pulse : 0.4;
  });
  return (
    <mesh ref={ref} position={position} scale={scale}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color={color} transparent opacity={0.4} />
    </mesh>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// DISTRICT ARCHITECTURES
// ═══════════════════════════════════════════════════════════════════════
const geoCache = {
  box: new THREE.BoxGeometry(1, 1, 1),
  cylinder: new THREE.CylinderGeometry(0.5, 0.5, 1, 24),
  cone: new THREE.ConeGeometry(0.5, 1, 6),
  dome: new THREE.SphereGeometry(0.5, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2),
  octahedron: new THREE.OctahedronGeometry(0.5, 0),
};

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
      <MegaBuilding geometry={geoCache.dome} position={[0, 0, 0]} scale={[3.2, 2.2, 3.2]} baseColor={c.baseColor} neonColor={c.neonColor} hovered={hovered} />
      <MegaBuilding geometry={geoCache.cylinder} position={[0, 2.8, 0]} scale={[0.15, 1.8, 0.15]} baseColor="#0a1628" neonColor={c.neonColor} hovered={hovered} />
      <mesh ref={ringRef} position={[0, 1.8, 0]}>
        <torusGeometry args={[2.0, 0.03, 8, 64]} />
        <meshBasicMaterial color={c.neonColor} transparent opacity={hovered ? 0.7 : 0.25} />
      </mesh>
      <MegaBuilding geometry={geoCache.octahedron} position={[1.8, 1.2, -1.0]} scale={[0.4, 2.6, 0.4]} baseColor="#0f1d30" neonColor={c.neonColor} hovered={hovered} />
      <MegaBuilding geometry={geoCache.octahedron} position={[-1.6, 0.9, 0.8]} scale={[0.35, 2.0, 0.35]} baseColor="#0f1d30" neonColor={c.neonColor} hovered={hovered} />
      <MegaBuilding geometry={geoCache.octahedron} position={[0.9, 0.8, 1.5]} scale={[0.3, 1.6, 0.3]} baseColor="#0f1d30" neonColor={c.neonColor} hovered={hovered} />
      <NeonStrip position={[0, 0.5, 1.6]} scale={[1.5, 0.04, 0.04]} color={c.neonColor} hovered={hovered} />
      <NeonStrip position={[0, 0.8, -1.5]} scale={[1.2, 0.04, 0.04]} color={c.neonColor} hovered={hovered} />
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.5, 1.65, 64]} />
        <meshBasicMaterial color={c.neonColor} transparent opacity={hovered ? 0.5 : 0.08} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function CinemaDistrict({ hovered }: { hovered: boolean }) {
  const beamRef = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (beamRef.current) {
      (beamRef.current.material as THREE.MeshBasicMaterial).opacity = hovered ? Math.sin(state.clock.elapsedTime * 8) * 0.15 + 0.35 : 0.05;
    }
  });
  const c = districts[1];
  return (
    <group>
      <MegaBuilding geometry={geoCache.box} position={[0, 1.0, 0]} scale={[3.0, 2.0, 0.6]} baseColor={c.baseColor} neonColor={c.neonColor} hovered={hovered} />
      <mesh position={[0, 1.0, 0.32]}><planeGeometry args={[2.6, 1.6]} /><meshBasicMaterial color={c.neonColor} transparent opacity={hovered ? 0.6 : 0.15} /></mesh>
      <MegaBuilding geometry={geoCache.box} position={[-1.8, 1.5, -0.5]} scale={[0.5, 3.0, 0.5]} baseColor="#1a0f00" neonColor={c.neonColor} hovered={hovered} />
      <MegaBuilding geometry={geoCache.box} position={[1.8, 1.5, -0.5]} scale={[0.5, 3.0, 0.5]} baseColor="#1a0f00" neonColor={c.neonColor} hovered={hovered} />
      <MegaBuilding geometry={geoCache.cone} position={[-1.8, 3.2, -0.5]} scale={[0.5, 0.6, 0.5]} baseColor="#1a0f00" neonColor={c.neonColor} hovered={hovered} />
      <MegaBuilding geometry={geoCache.cone} position={[1.8, 3.2, -0.5]} scale={[0.5, 0.6, 0.5]} baseColor="#1a0f00" neonColor={c.neonColor} hovered={hovered} />
      <mesh ref={beamRef} position={[0, 2.2, 0.6]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[1.5, 4, 16, 1, true]} /><meshBasicMaterial color={c.neonColor} transparent opacity={0.05} side={THREE.DoubleSide} />
      </mesh>
      <NeonStrip position={[0, 0.2, 0.32]} scale={[2.8, 0.06, 0.06]} color={c.neonColor} hovered={hovered} />
      <NeonStrip position={[0, 1.8, 0.32]} scale={[2.8, 0.06, 0.06]} color={c.neonColor} hovered={hovered} />
    </group>
  );
}

function GamesDistrict({ hovered }: { hovered: boolean }) {
  const c = districts[2];
  return (
    <group>
      <MegaBuilding geometry={geoCache.box} position={[0, 1.8, 0]} scale={[1.4, 3.6, 1.4]} baseColor={c.baseColor} neonColor={c.neonColor} hovered={hovered} />
      <MegaBuilding geometry={geoCache.box} position={[0, 3.8, 0]} scale={[1.8, 0.3, 1.8]} baseColor="#0a1f15" neonColor={c.neonColor} hovered={hovered} />
      <MegaBuilding geometry={geoCache.cylinder} position={[0.4, 4.3, 0.4]} scale={[0.08, 1.0, 0.08]} baseColor="#0a1f15" neonColor={c.neonColor} hovered={hovered} />
      <MegaBuilding geometry={geoCache.cylinder} position={[-0.4, 4.1, -0.4]} scale={[0.08, 0.7, 0.08]} baseColor="#0a1f15" neonColor={c.neonColor} hovered={hovered} />
      <MegaBuilding geometry={geoCache.box} position={[2.0, 0.8, 0.6]} scale={[0.8, 1.6, 0.8]} baseColor="#0d2419" neonColor={c.neonColor} hovered={hovered} />
      <MegaBuilding geometry={geoCache.box} position={[-1.6, 0.6, -0.8]} scale={[0.9, 1.2, 0.7]} baseColor="#0d2419" neonColor={c.neonColor} hovered={hovered} />
      <MegaBuilding geometry={geoCache.cylinder} position={[0, 0.08, 0]} scale={[2.8, 0.16, 2.8]} baseColor="#060e0a" neonColor={c.neonColor} hovered={hovered} />
      <NeonStrip position={[0.72, 1.8, 0]} scale={[0.05, 3.4, 0.05]} color={c.neonColor} hovered={hovered} />
      <NeonStrip position={[-0.72, 1.8, 0]} scale={[0.05, 3.4, 0.05]} color={c.neonColor} hovered={hovered} />
      <NeonStrip position={[0, 1.8, 0.72]} scale={[0.05, 3.4, 0.05]} color={c.neonColor} hovered={hovered} />
      <NeonStrip position={[0, 1.8, -0.72]} scale={[0.05, 3.4, 0.05]} color={c.neonColor} hovered={hovered} />
    </group>
  );
}

function PublishingDistrict({ hovered }: { hovered: boolean }) {
  const c = districts[3];
  return (
    <group>
      <MegaBuilding geometry={geoCache.box} position={[0, 0.4, 0]} scale={[2.8, 0.8, 1.6]} baseColor={c.baseColor} neonColor={c.neonColor} hovered={hovered} />
      <MegaBuilding geometry={geoCache.box} position={[0.2, 1.1, -0.1]} scale={[2.4, 0.6, 1.4]} baseColor="#1a0e35" neonColor={c.neonColor} hovered={hovered} />
      <MegaBuilding geometry={geoCache.box} position={[-0.15, 1.7, 0.1]} scale={[2.6, 0.5, 1.3]} baseColor="#1f1040" neonColor={c.neonColor} hovered={hovered} />
      <MegaBuilding geometry={geoCache.box} position={[0.1, 2.2, 0]} scale={[2.2, 0.4, 1.1]} baseColor="#240f45" neonColor={c.neonColor} hovered={hovered} />
      <MegaBuilding geometry={geoCache.box} position={[1.7, 1.5, 0]} scale={[0.15, 3.0, 0.8]} baseColor="#2a1350" neonColor={c.neonColor} hovered={hovered} />
      <mesh position={[1.7, 3.2, 0]}><sphereGeometry args={[0.15, 16, 8]} /><meshBasicMaterial color={c.neonColor} transparent opacity={hovered ? 0.9 : 0.3} /></mesh>
      <NeonStrip position={[-1.3, 0.82, 0]} scale={[0.06, 0.04, 1.4]} color={c.neonColor} hovered={hovered} />
      <NeonStrip position={[-1.1, 1.42, 0]} scale={[0.06, 0.04, 1.2]} color={c.neonColor} hovered={hovered} />
      <NeonStrip position={[0, 0.4, 0.82]} scale={[2.6, 0.04, 0.04]} color={c.neonColor} hovered={hovered} />
    </group>
  );
}

function ShopDistrict({ hovered }: { hovered: boolean }) {
  const c = districts[4];
  return (
    <group>
      <mesh position={[0, 1.6, 0]}>
        <torusGeometry args={[1.5, 0.2, 12, 24, Math.PI]} />
        <meshStandardMaterial color={c.baseColor} metalness={0.92} roughness={0.08} emissive={c.neonColor} emissiveIntensity={hovered ? 1.0 : 0.2} />
      </mesh>
      <MegaBuilding geometry={geoCache.box} position={[-1.5, 0.8, 0]} scale={[0.35, 1.6, 0.35]} baseColor="#1a1208" neonColor={c.neonColor} hovered={hovered} />
      <MegaBuilding geometry={geoCache.box} position={[1.5, 0.8, 0]} scale={[0.35, 1.6, 0.35]} baseColor="#1a1208" neonColor={c.neonColor} hovered={hovered} />
      <MegaBuilding geometry={geoCache.dome} position={[0, 0, -1.2]} scale={[2.2, 1.4, 2.2]} baseColor="#15100a" neonColor={c.neonColor} hovered={hovered} />
      <MegaBuilding geometry={geoCache.cylinder} position={[1.8, 0.9, -0.8]} scale={[0.4, 1.8, 0.4]} baseColor="#1a1208" neonColor={c.neonColor} hovered={hovered} />
      <MegaBuilding geometry={geoCache.cylinder} position={[-1.8, 0.7, -0.8]} scale={[0.4, 1.4, 0.4]} baseColor="#1a1208" neonColor={c.neonColor} hovered={hovered} />
      <mesh position={[-1.5, 1.8, 0]}><sphereGeometry args={[0.12, 12, 8]} /><meshBasicMaterial color="#ffd700" transparent opacity={hovered ? 0.9 : 0.4} /></mesh>
      <mesh position={[1.5, 1.8, 0]}><sphereGeometry args={[0.12, 12, 8]} /><meshBasicMaterial color="#ffd700" transparent opacity={hovered ? 0.9 : 0.4} /></mesh>
      <NeonStrip position={[0, 0.05, 0.2]} scale={[3.0, 0.05, 0.05]} color={c.neonColor} hovered={hovered} />
      <NeonStrip position={[0, 0.05, -0.2]} scale={[3.0, 0.05, 0.05]} color={c.neonColor} hovered={hovered} />
    </group>
  );
}

const DISTRICT_COMPONENTS: Record<string, React.FC<{ hovered: boolean }>> = {
  universe: UniverseDistrict, cinema: CinemaDistrict, games: GamesDistrict,
  publishing: PublishingDistrict, shop: ShopDistrict,
};

// ═══════════════════════════════════════════════════════════════════════
// DISTRICT GROUP
// ═══════════════════════════════════════════════════════════════════════
function DistrictGroup({ district, isHovered, onHover, onUnhover, onClick }: {
  district: District; isHovered: boolean; onHover: () => void; onUnhover: () => void; onClick: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const pulseRef = useRef<THREE.Mesh>(null!);
  const time = useRef(Math.random() * 100);
  const Arch = DISTRICT_COMPONENTS[district.id];

  useFrame((state, delta) => {
    time.current += delta;
    if (groupRef.current) groupRef.current.position.y = district.position[1] + Math.sin(time.current * 0.6) * 0.06;
    if (pulseRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * district.pulseSpeed * 2) * 0.15 + 0.35;
      (pulseRef.current.material as THREE.MeshBasicMaterial).opacity = isHovered ? pulse * 1.5 : pulse * 0.3;
      pulseRef.current.rotation.z = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={district.position}
      onPointerOver={(e) => { e.stopPropagation(); onHover(); document.body.style.cursor = 'pointer'; }}
      onPointerOut={(e) => { e.stopPropagation(); onUnhover(); document.body.style.cursor = 'default'; }}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
    >
      <mesh visible={false}><cylinderGeometry args={[3.2, 3.2, 5, 16]} /><meshBasicMaterial /></mesh>
      <Arch hovered={isHovered} />
      <mesh position={[0, -0.04, 0]} receiveShadow>
        <cylinderGeometry args={[3.2, 3.4, 0.08, 6]} />
        <meshStandardMaterial color="#080808" metalness={0.95} roughness={0.2} emissive={district.neonColor} emissiveIntensity={isHovered ? 0.35 : 0.04} />
      </mesh>
      <mesh ref={pulseRef} position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.0, 3.35, 6]} />
        <meshBasicMaterial color={district.neonColor} transparent opacity={0.1} side={THREE.DoubleSide} />
      </mesh>
      {isHovered && <pointLight position={[0, 5, 0]} color={district.neonColor} intensity={10} distance={14} decay={2} />}
      <Sparkles count={isHovered ? 50 : 10} scale={[6, 5, 6]} size={isHovered ? 3.5 : 1.2} speed={0.5} color={district.neonColor} opacity={isHovered ? 0.9 : 0.25} />
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// DATA STREAMS
// ═══════════════════════════════════════════════════════════════════════
function DataStream({ from, to, color, speed, count }: {
  from: [number, number, number]; to: [number, number, number]; color: string; speed: number; count: number;
}) {
  const ref = useRef<THREE.Points>(null!);
  const curve = useMemo(() => {
    const a = new THREE.Vector3(...from), b = new THREE.Vector3(...to);
    const mid = a.clone().add(b).multiplyScalar(0.5); mid.y = 2.0;
    return new THREE.QuadraticBezierCurve3(new THREE.Vector3(a.x, 0.3, a.z), mid, new THREE.Vector3(b.x, 0.3, b.z));
  }, [from, to]);
  const positions = useMemo(() => new Float32Array(count * 3), [count]);
  useFrame((state) => {
    if (!ref.current) return;
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    const t = state.clock.elapsedTime * speed;
    for (let i = 0; i < count; i++) {
      const pt = curve.getPointAt(((t * 0.15 + i / count) % 1 + 1) % 1);
      arr[i * 3] = pt.x; arr[i * 3 + 1] = pt.y; arr[i * 3 + 2] = pt.z;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });
  return (
    <points ref={ref}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
      <pointsMaterial size={0.12} color={color} transparent opacity={0.85} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// DATA DRONES
// ═══════════════════════════════════════════════════════════════════════
function DataDrone({ from, to, color, speed, offset }: {
  from: [number, number, number]; to: [number, number, number]; color: string; speed: number; offset: number;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  const curve = useMemo(() => {
    const a = new THREE.Vector3(...from), b = new THREE.Vector3(...to);
    const mid = a.clone().add(b).multiplyScalar(0.5); mid.y = 1.8;
    return new THREE.QuadraticBezierCurve3(new THREE.Vector3(a.x, 0.5, a.z), mid, new THREE.Vector3(b.x, 0.5, b.z));
  }, [from, to]);
  useFrame((state) => {
    if (!ref.current) return;
    const pt = curve.getPointAt(((state.clock.elapsedTime * speed * 0.12 + offset) % 1 + 1) % 1);
    ref.current.position.copy(pt);
    ref.current.position.y += Math.sin(state.clock.elapsedTime * 4 + offset * 20) * 0.08;
    ref.current.rotation.y = state.clock.elapsedTime * 3;
    ref.current.rotation.x = state.clock.elapsedTime * 2;
  });
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[0.07, 0]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} metalness={0.9} roughness={0.1} transparent opacity={0.9} />
    </mesh>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// PARTICLES
// ═══════════════════════════════════════════════════════════════════════
function DigitalSmog() {
  const count = 250;
  const ref = useRef<THREE.Points>(null!);
  const positions = useMemo(() => { const arr = new Float32Array(count * 3); for (let i = 0; i < count; i++) { arr[i*3]=(Math.random()-0.5)*50; arr[i*3+1]=Math.random()*1.2; arr[i*3+2]=(Math.random()-0.5)*50; } return arr; }, []);
  useFrame((state) => {
    if (!ref.current) return;
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) { arr[i*3] += Math.sin(t*0.08+i*0.5)*0.003; arr[i*3+2] += Math.cos(t*0.06+i*0.3)*0.003; }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });
  return (<points ref={ref}><bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry><pointsMaterial size={0.5} color="#0a0a1a" transparent opacity={0.12} sizeAttenuation depthWrite={false} /></points>);
}

function AmbientMotes() {
  const count = 150;
  const ref = useRef<THREE.Points>(null!);
  const positions = useMemo(() => { const arr = new Float32Array(count * 3); for (let i = 0; i < count; i++) { arr[i*3]=(Math.random()-0.5)*45; arr[i*3+1]=Math.random()*10+1; arr[i*3+2]=(Math.random()-0.5)*45; } return arr; }, []);
  useFrame((state) => {
    if (!ref.current) return;
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) { arr[i*3+1] += Math.sin(state.clock.elapsedTime*0.2+i)*0.002; if (arr[i*3+1]>12) arr[i*3+1]=1; }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });
  return (<points ref={ref}><bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry><pointsMaterial size={0.05} color="#c9a96e" transparent opacity={0.5} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} /></points>);
}

// ═══════════════════════════════════════════════════════════════════════
// CAMERA RIG
// ═══════════════════════════════════════════════════════════════════════
function CameraRig({ target }: { target: [number, number, number] | null }) {
  const { camera } = useThree();
  const defaultPos = useMemo(() => new THREE.Vector3(20, 18, 20), []);
  const defaultLookAt = useMemo(() => new THREE.Vector3(0, 0, 1.5), []);
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 1.5));
  const time = useRef(0);

  useFrame((_, delta) => {
    time.current += delta;
    const ox = Math.sin(time.current * 0.06) * 0.6, oz = Math.cos(time.current * 0.06) * 0.6;
    const tPos = target
      ? new THREE.Vector3(defaultPos.x + ox + target[0] * 0.06, defaultPos.y, defaultPos.z + oz + target[2] * 0.06)
      : new THREE.Vector3(defaultPos.x + ox, defaultPos.y, defaultPos.z + oz);
    const tLook = target ? new THREE.Vector3(target[0] * 0.3, 0.5, target[2] * 0.3 + 1.5) : defaultLookAt;
    camera.position.lerp(tPos, delta * 1.8);
    currentLookAt.current.lerp(tLook, delta * 1.8);
    camera.lookAt(currentLookAt.current);
  });
  return null;
}

// ═══════════════════════════════════════════════════════════════════════
// SCENE
// ═══════════════════════════════════════════════════════════════════════
function Scene({ hoveredDistrict, setHoveredDistrict, onDistrictClick }: {
  hoveredDistrict: string | null; setHoveredDistrict: (id: string | null) => void; onDistrictClick: (href: string) => void;
}) {
  return (
    <>
      <ambientLight intensity={0.4} color="#8a9ab8" />
      <directionalLight position={[15, 25, 12]} intensity={1.2} color="#fff8e8" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-far={70} shadow-camera-left={-25} shadow-camera-right={25} shadow-camera-top={25} shadow-camera-bottom={-25} />
      <directionalLight position={[-12, 18, -12]} intensity={0.4} color="#4a6fa5" />
      <directionalLight position={[0, 5, 20]} intensity={0.3} color="#c9a96e" />
      <pointLight position={[0, 10, 0]} intensity={2.0} color="#c9a96e" distance={30} decay={2} />
      {districts.map((d) => <pointLight key={`light-${d.id}`} position={[d.position[0], 3, d.position[2]]} intensity={hoveredDistrict === d.id ? 4 : 0.6} color={d.neonColor} distance={10} decay={2} />)}
      <fog attach="fog" args={['#020204', 40, 75]} />
      <ScanlineGround />
      {districts.map((d) => <DistrictGroup key={d.id} district={d} isHovered={hoveredDistrict === d.id} onHover={() => setHoveredDistrict(d.id)} onUnhover={() => setHoveredDistrict(null)} onClick={() => onDistrictClick(d.href)} />)}
      {CONNECTIONS.map(([from, to], i) => <DataStream key={`stream-${i}`} from={districts[from].position} to={districts[to].position} color={districts[from].neonColor} speed={0.8 + i * 0.15} count={6} />)}
      {CONNECTIONS.map(([from, to], i) => <DataDrone key={`drone-${i}`} from={districts[from].position} to={districts[to].position} color={districts[to].neonColor} speed={0.6 + i * 0.1} offset={i * 0.17} />)}
      <DigitalSmog />
      <AmbientMotes />
      <CameraRig target={hoveredDistrict ? districts.find((d) => d.id === hoveredDistrict)?.position || null : null} />
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// HUD OVERLAY
// ═══════════════════════════════════════════════════════════════════════
function HUDOverlay({ hoveredDistrict, onDistrictClick, isReady }: {
  hoveredDistrict: string | null; onDistrictClick: (href: string) => void; isReady: boolean;
}) {
  const active = districts.find((d) => d.id === hoveredDistrict);
  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      <div className="absolute top-6 left-6 w-6 h-6 border-l border-t border-gold/20 transition-opacity duration-1000" style={{ opacity: isReady ? 1 : 0, transitionDelay: '800ms' }} />
      <div className="absolute top-6 right-6 w-6 h-6 border-r border-t border-gold/20 transition-opacity duration-1000" style={{ opacity: isReady ? 1 : 0, transitionDelay: '800ms' }} />
      <div className="absolute bottom-6 left-6 w-6 h-6 border-l border-b border-gold/20 transition-opacity duration-1000" style={{ opacity: isReady ? 1 : 0, transitionDelay: '800ms' }} />
      <div className="absolute bottom-6 right-6 w-6 h-6 border-r border-b border-gold/20 transition-opacity duration-1000" style={{ opacity: isReady ? 1 : 0, transitionDelay: '800ms' }} />
      <div className="absolute top-10 left-10 transition-opacity duration-1000" style={{ opacity: isReady ? 1 : 0, transitionDelay: '1000ms' }}>
        <p className="text-[9px] tracking-[0.25em] uppercase text-ash/40" style={{ fontFamily: 'var(--font-mono)' }}>TARTARY CREATIVE STUDIO</p>
        <p className="text-[9px] tracking-[0.15em] uppercase text-ash/25 mt-0.5" style={{ fontFamily: 'var(--font-mono)' }}>SYSTEM ONLINE</p>
      </div>
      <div className="absolute bottom-10 left-10 transition-all duration-300 ease-out" style={{ opacity: active ? 1 : 0, transform: active ? 'translateY(0)' : 'translateY(8px)' }}>
        {active && (<>
          <p className="text-[10px] tracking-[0.2em] uppercase mb-1" style={{ fontFamily: 'var(--font-mono)', color: active.neonColor }}>{active.subtitle}</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{active.label}</h2>
          <button className="pointer-events-auto text-xs tracking-[0.15em] uppercase border px-4 py-2 transition-colors duration-200 hover:bg-white/10" style={{ fontFamily: 'var(--font-mono)', color: active.neonColor, borderColor: active.neonColor }} onClick={() => onDistrictClick(active.href)}>Enter District →</button>
        </>)}
      </div>
      <div className="absolute bottom-10 right-10 text-right transition-opacity duration-1000" style={{ opacity: isReady ? 1 : 0, transitionDelay: '1200ms' }}>
        <div className="flex flex-col gap-1.5 items-end">
          {districts.map((d) => (
            <button key={d.id} className="pointer-events-auto flex items-center gap-1.5 text-[9px] tracking-[0.15em] uppercase transition-all duration-200 hover:opacity-100" style={{ fontFamily: 'var(--font-mono)', color: hoveredDistrict === d.id ? d.neonColor : 'rgba(255,255,255,0.25)', opacity: hoveredDistrict === d.id ? 1 : 0.5 }} onClick={() => onDistrictClick(d.href)}>
              <span className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 transition-all duration-300" style={{ backgroundColor: hoveredDistrict === d.id ? d.neonColor : 'rgba(255,255,255,0.15)', boxShadow: hoveredDistrict === d.id ? `0 0 10px ${d.neonColor}` : 'none' }} />
              {d.id}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// LOADING SCREEN
// ═══════════════════════════════════════════════════════════════════════
function LoadingScreen({ isLoaded }: { isLoaded: boolean }) {
  const [barWidth, setBarWidth] = useState(0);
  useEffect(() => { const raf = requestAnimationFrame(() => setBarWidth(100)); return () => cancelAnimationFrame(raf); }, []);
  return (
    <div className="absolute inset-0 z-40 bg-[#020204] flex flex-col items-center justify-center transition-opacity duration-1000 ease-in-out" style={{ opacity: isLoaded ? 0 : 1, pointerEvents: isLoaded ? 'none' : 'auto' }}>
      <div className="text-center">
        <p className="text-2xl tracking-[0.4em] uppercase mb-8 logo-sheen" style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}>Tartary</p>
        <div className="w-48 h-[1px] bg-white/10 mx-auto relative overflow-hidden">
          <div className="absolute top-0 left-0 h-full bg-gold transition-all ease-in-out" style={{ width: `${barWidth}%`, transitionDuration: '2.2s' }} />
        </div>
        <p className="text-[10px] tracking-[0.25em] uppercase text-ash/40 mt-4" style={{ fontFamily: 'var(--font-mono)' }}>Initializing megacity</p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// KEY FIX: Canvas style uses position:absolute to ensure visibility.
// R3F's default wrapper uses position:relative which fails to composite
// the WebGL canvas visually in this Tailwind v4 / Next.js 16 context.
// ═══════════════════════════════════════════════════════════════════════
export default function TartaryWorld() {
  const router = useRouter();
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleDistrictClick = useCallback((href: string) => { router.push(href); }, [router]);

  return (
    <div className="relative w-full h-screen bg-[#020204] overflow-hidden">
      <Canvas
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        shadows
        dpr={[1, 1.5]}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => { gl.setClearColor('#020204'); }}
      >
        <OrthographicCamera makeDefault position={[20, 18, 20]} zoom={36} near={0.1} far={120} />
        <Scene hoveredDistrict={hoveredDistrict} setHoveredDistrict={setHoveredDistrict} onDistrictClick={handleDistrictClick} />
      </Canvas>
      <HUDOverlay hoveredDistrict={hoveredDistrict} onDistrictClick={handleDistrictClick} isReady={isLoaded} />
      <LoadingScreen isLoaded={isLoaded} />
      <div className="absolute inset-0 pointer-events-none z-[5]" style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(2,2,4,0.6) 100%)' }} />
      <div className="absolute top-0 left-0 right-0 h-28 pointer-events-none z-[5]" style={{ background: 'linear-gradient(to bottom, rgba(2,2,4,0.6) 0%, transparent 100%)' }} />
    </div>
  );
}
