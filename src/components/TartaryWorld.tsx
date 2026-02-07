'use client';

import { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  OrthographicCamera,
  Float,
  Text,
  Sparkles,
} from '@react-three/drei';
import * as THREE from 'three';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// ─────────────────────────── TYPES ───────────────────────────
interface District {
  id: string;
  label: string;
  subtitle: string;
  href: string;
  position: [number, number, number];
  color: string;
  emissive: string;
  buildings: BuildingConfig[];
}

interface BuildingConfig {
  type: 'tower' | 'dome' | 'slab' | 'pyramid' | 'cylinder' | 'crystal' | 'arch';
  pos: [number, number, number];
  scale: [number, number, number];
  color?: string;
}

// ─────────────────────────── DISTRICT DATA ───────────────────────────
const districts: District[] = [
  {
    id: 'universe',
    label: 'UNIVERSE',
    subtitle: 'Worlds & Characters',
    href: '/worlds',
    position: [0, 0, 0],
    color: '#1a3a5c',
    emissive: '#3b82f6',
    buildings: [
      { type: 'dome', pos: [0, 0, 0], scale: [1.8, 1.4, 1.8] },
      { type: 'crystal', pos: [1.6, 0, -0.8], scale: [0.4, 2.2, 0.4] },
      { type: 'crystal', pos: [-1.4, 0, 0.6], scale: [0.35, 1.8, 0.35] },
      { type: 'crystal', pos: [0.8, 0, 1.4], scale: [0.3, 1.5, 0.3] },
      { type: 'cylinder', pos: [-0.6, 0, -1.6], scale: [0.5, 0.8, 0.5] },
    ],
  },
  {
    id: 'cinema',
    label: 'CINEMA',
    subtitle: 'Film & Anime',
    href: '/cinema',
    position: [7, 0, -2],
    color: '#3d2200',
    emissive: '#d97706',
    buildings: [
      { type: 'slab', pos: [0, 0, 0], scale: [2.5, 1.6, 1.2] },
      { type: 'tower', pos: [-1.5, 0, -0.8], scale: [0.6, 2.8, 0.6] },
      { type: 'tower', pos: [1.5, 0, -0.8], scale: [0.6, 2.8, 0.6] },
      { type: 'slab', pos: [0, 1.6, 0], scale: [1.8, 0.3, 0.8] },
      { type: 'cylinder', pos: [0, 0, 1.2], scale: [0.4, 0.6, 0.4] },
    ],
  },
  {
    id: 'games',
    label: 'GAMES',
    subtitle: 'Interactive & Systems',
    href: '/games',
    position: [-7, 0, -2],
    color: '#0a2e1f',
    emissive: '#10b981',
    buildings: [
      { type: 'tower', pos: [0, 0, 0], scale: [1.2, 3.0, 1.2] },
      { type: 'pyramid', pos: [1.8, 0, 0.5], scale: [1.2, 1.5, 1.2] },
      { type: 'slab', pos: [-1.5, 0, -0.5], scale: [1.0, 0.8, 1.4] },
      { type: 'crystal', pos: [0.6, 0, -1.6], scale: [0.3, 2.0, 0.3] },
      { type: 'cylinder', pos: [-0.8, 0, 1.4], scale: [0.6, 1.2, 0.6] },
    ],
  },
  {
    id: 'publishing',
    label: 'PUBLISHING',
    subtitle: 'Books & Print',
    href: '/publishing',
    position: [4, 0, 5],
    color: '#1f0a3d',
    emissive: '#8b5cf6',
    buildings: [
      { type: 'slab', pos: [0, 0, 0], scale: [2.0, 2.0, 0.5] },
      { type: 'slab', pos: [0.3, 0, 0.4], scale: [1.6, 1.7, 0.4] },
      { type: 'slab', pos: [-0.3, 0, -0.4], scale: [1.8, 2.3, 0.4] },
      { type: 'tower', pos: [1.6, 0, 0.8], scale: [0.5, 1.4, 0.5] },
      { type: 'dome', pos: [-1.4, 0, 0.6], scale: [0.8, 0.6, 0.8] },
    ],
  },
  {
    id: 'shop',
    label: 'SHOP',
    subtitle: 'Store & Membership',
    href: '/shop',
    position: [-4, 0, 5],
    color: '#2a1a0a',
    emissive: '#c9a96e',
    buildings: [
      { type: 'arch', pos: [0, 0, 0], scale: [2.0, 2.0, 1.0] },
      { type: 'tower', pos: [1.4, 0, -0.6], scale: [0.5, 1.8, 0.5] },
      { type: 'tower', pos: [-1.4, 0, -0.6], scale: [0.5, 1.5, 0.5] },
      { type: 'dome', pos: [0, 0, 1.2], scale: [0.7, 0.5, 0.7] },
      { type: 'cylinder', pos: [0.8, 0, 1.0], scale: [0.3, 0.9, 0.3] },
    ],
  },
];

// ─────────────────────────── GROUND ───────────────────────────
function Ground() {
  const meshRef = useRef<THREE.Mesh>(null!);

  return (
    <group>
      {/* Main ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[60, 60, 80, 80]} />
        <meshStandardMaterial
          color="#080808"
          metalness={0.8}
          roughness={0.6}
          transparent
          opacity={0.95}
        />
      </mesh>

      {/* Grid lines */}
      <gridHelper
        args={[60, 60, '#c9a96e', '#1a1a1a']}
        position={[0, 0.01, 0]}
        material-transparent
        material-opacity={0.08}
      />

      {/* Inner glow circle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 1]}>
        <circleGeometry args={[14, 64]} />
        <meshStandardMaterial
          color="#c9a96e"
          transparent
          opacity={0.03}
          emissive="#c9a96e"
          emissiveIntensity={0.15}
        />
      </mesh>
    </group>
  );
}

// ─────────────────────────── BUILDING MESH ───────────────────────────
function Building({
  config,
  districtColor,
  districtEmissive,
  hovered,
}: {
  config: BuildingConfig;
  districtColor: string;
  districtEmissive: string;
  hovered: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  const baseColor = config.color || districtColor;
  const targetEmissiveIntensity = hovered ? 1.2 : 0.15;
  const currentEmissive = useRef(0.15);

  useFrame((_, delta) => {
    if (ref.current) {
      currentEmissive.current = THREE.MathUtils.lerp(
        currentEmissive.current,
        targetEmissiveIntensity,
        delta * 4
      );
      (ref.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        currentEmissive.current;
    }
  });

  const geometry = useMemo(() => {
    switch (config.type) {
      case 'tower':
        return new THREE.BoxGeometry(1, 1, 1);
      case 'dome':
        return new THREE.SphereGeometry(0.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
      case 'slab':
        return new THREE.BoxGeometry(1, 1, 1);
      case 'pyramid':
        return new THREE.ConeGeometry(0.5, 1, 4);
      case 'cylinder':
        return new THREE.CylinderGeometry(0.5, 0.5, 1, 16);
      case 'crystal':
        return new THREE.OctahedronGeometry(0.5, 0);
      case 'arch':
        return new THREE.TorusGeometry(0.5, 0.15, 8, 16, Math.PI);
      default:
        return new THREE.BoxGeometry(1, 1, 1);
    }
  }, [config.type]);

  const yOffset =
    config.type === 'dome'
      ? 0
      : config.type === 'arch'
      ? config.scale[1] * 0.5
      : config.type === 'crystal'
      ? config.scale[1] * 0.5
      : config.scale[1] * 0.5;

  return (
    <mesh
      ref={ref}
      geometry={geometry}
      position={[config.pos[0], yOffset + config.pos[1], config.pos[2]]}
      scale={config.scale}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial
        color={baseColor}
        metalness={0.6}
        roughness={0.25}
        emissive={districtEmissive}
        emissiveIntensity={0.15}
      />
    </mesh>
  );
}

// ─────────────────────────── DISTRICT GROUP ───────────────────────────
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
  const baseY = useRef(0);
  const time = useRef(Math.random() * 100);

  useFrame((_, delta) => {
    time.current += delta;
    if (groupRef.current) {
      // Gentle floating
      const float = Math.sin(time.current * 0.8) * 0.08;
      groupRef.current.position.y = district.position[1] + float;

      // Subtle rotation on hover
      const targetRotY = isHovered ? 0.04 : 0;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotY,
        delta * 3
      );
    }
  });

  return (
    <group
      ref={groupRef}
      position={district.position}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        onUnhover();
        document.body.style.cursor = 'default';
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {/* Invisible hit area */}
      <mesh visible={false}>
        <cylinderGeometry args={[3, 3, 4, 16]} />
        <meshBasicMaterial />
      </mesh>

      {/* Buildings */}
      {district.buildings.map((building, idx) => (
        <Building
          key={idx}
          config={building}
          districtColor={district.color}
          districtEmissive={district.emissive}
          hovered={isHovered}
        />
      ))}

      {/* Base platform */}
      <mesh position={[0, -0.02, 0]} receiveShadow>
        <cylinderGeometry args={[3, 3.2, 0.08, 32]} />
        <meshStandardMaterial
          color="#111"
          metalness={0.9}
          roughness={0.3}
          emissive={district.emissive}
          emissiveIntensity={isHovered ? 0.4 : 0.05}
        />
      </mesh>

      {/* Glow ring under platform */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.8, 3.3, 64]} />
        <meshBasicMaterial
          color={district.emissive}
          transparent
          opacity={isHovered ? 0.6 : 0.1}
        />
      </mesh>

      {/* Hover spotlight beam */}
      {isHovered && (
        <pointLight
          position={[0, 4, 0]}
          color={district.emissive}
          intensity={8}
          distance={12}
          decay={2}
        />
      )}

      {/* Floating label */}
      <Float speed={1.5} rotationIntensity={0} floatIntensity={0.3} floatingRange={[0, 0.15]}>
        <Text
          position={[0, 4.2, 0]}
          fontSize={0.55}
          color={isHovered ? '#ffffff' : '#c9a96e'}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.2}
          outlineWidth={0.02}
          outlineColor="#000000"
          fillOpacity={isHovered ? 1 : 0.7}
        >
          {district.label}
        </Text>
        <Text
          position={[0, 3.6, 0]}
          fontSize={0.25}
          color={isHovered ? district.emissive : '#666666'}
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
        count={isHovered ? 40 : 12}
        scale={[5, 4, 5]}
        size={isHovered ? 3 : 1.5}
        speed={0.4}
        color={district.emissive}
        opacity={isHovered ? 0.8 : 0.3}
      />
    </group>
  );
}

// ─────────────────────────── CONNECTING PATHS ───────────────────────────
function PathLine({ geometry }: { geometry: THREE.BufferGeometry }) {
  const ref = useRef<THREE.Line>(null!);

  useEffect(() => {
    if (ref.current) {
      ref.current.geometry = geometry;
    }
  }, [geometry]);

  return (
    <primitive
      ref={ref}
      object={new THREE.Line(
        geometry,
        new THREE.LineBasicMaterial({ color: '#c9a96e', transparent: true, opacity: 0.06 })
      )}
    />
  );
}

function Paths() {
  const geometries = useMemo(() => {
    const connections: [number, number][] = [
      [0, 1], // Universe -> Cinema
      [0, 2], // Universe -> Games
      [0, 3], // Universe -> Publishing
      [0, 4], // Universe -> Shop
      [1, 3], // Cinema -> Publishing
      [2, 4], // Games -> Shop
    ];

    return connections.map(([from, to]) => {
      const a = new THREE.Vector3(...districts[from].position);
      const b = new THREE.Vector3(...districts[to].position);
      const mid = a.clone().add(b).multiplyScalar(0.5);
      mid.y = -0.01;

      const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(a.x, 0.02, a.z),
        new THREE.Vector3(mid.x, 0.02, mid.z),
        new THREE.Vector3(b.x, 0.02, b.z)
      );

      return new THREE.BufferGeometry().setFromPoints(curve.getPoints(30));
    });
  }, []);

  return (
    <group>
      {geometries.map((geo, i) => (
        <PathLine key={i} geometry={geo} />
      ))}
    </group>
  );
}

// ─────────────────────────── AMBIENT PARTICLES ───────────────────────────
function AmbientParticles() {
  const count = 200;
  const ref = useRef<THREE.Points>(null!);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 40;
      arr[i * 3 + 1] = Math.random() * 8 + 0.5;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      const positions = ref.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        positions[i * 3 + 1] += Math.sin(state.clock.elapsedTime * 0.3 + i) * 0.002;
        // Wrap around
        if (positions[i * 3 + 1] > 10) positions[i * 3 + 1] = 0.5;
      }
      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#c9a96e"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
}

// ─────────────────────────── CAMERA RIG ───────────────────────────
function CameraRig({ target }: { target: [number, number, number] | null }) {
  const { camera } = useThree();
  const defaultPos = useMemo(() => new THREE.Vector3(18, 16, 18), []);
  const defaultLookAt = useMemo(() => new THREE.Vector3(0, 0, 1), []);
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 1));
  const time = useRef(0);

  useFrame((state, delta) => {
    time.current += delta;

    // Gentle orbit
    const orbitRadius = 0.8;
    const orbitSpeed = 0.08;
    const ox = Math.sin(time.current * orbitSpeed) * orbitRadius;
    const oz = Math.cos(time.current * orbitSpeed) * orbitRadius;

    // On hover: shift camera slightly toward district, mainly adjust look-at
    const targetPos = target
      ? new THREE.Vector3(
          defaultPos.x + ox + (target[0] - defaultPos.x) * 0.15,
          defaultPos.y,
          defaultPos.z + oz + (target[2] - defaultPos.z) * 0.15
        )
      : new THREE.Vector3(defaultPos.x + ox, defaultPos.y, defaultPos.z + oz);

    const targetLook = target
      ? new THREE.Vector3(target[0] * 0.6, 0.5, target[2] * 0.6 + 1)
      : defaultLookAt;

    camera.position.lerp(targetPos, delta * 2);
    currentLookAt.current.lerp(targetLook, delta * 2);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}

// ─────────────────────────── SCENE ───────────────────────────
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
      {/* Lighting */}
      <ambientLight intensity={0.15} color="#b8a88a" />
      <directionalLight
        position={[15, 20, 10]}
        intensity={0.8}
        color="#fff5e0"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={60}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <directionalLight position={[-10, 15, -10]} intensity={0.2} color="#6b8cce" />
      <pointLight position={[0, 8, 0]} intensity={2} color="#c9a96e" distance={25} decay={2} />

      {/* Fog */}
      <fog attach="fog" args={['#050505', 25, 55]} />

      {/* Ground */}
      <Ground />

      {/* Paths between districts */}
      <Paths />

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

      {/* Ambient particles */}
      <AmbientParticles />

      {/* Camera rig */}
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

// ─────────────────────────── HUD OVERLAY ───────────────────────────
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
                style={{ fontFamily: 'var(--font-mono)', color: district.emissive }}
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
                Enter
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
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
                  backgroundColor: hoveredDistrict === d.id ? d.emissive : 'rgba(255,255,255,0.15)',
                  boxShadow:
                    hoveredDistrict === d.id ? `0 0 8px ${d.emissive}` : 'none',
                }}
              />
              {d.id}
            </button>
          ))}
        </div>
      </div>

      {/* Scroll indicator (mobile) */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 md:hidden transition-opacity duration-1000"
        style={{ opacity: isReady ? 1 : 0, transitionDelay: '1500ms' }}
      >
        <div className="flex flex-col items-center gap-2 animate-bounce">
          <span
            className="text-[9px] tracking-[0.2em] uppercase text-ash/40"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
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

// ─────────────────────────── LOADING SCREEN ───────────────────────────
function LoadingScreen({ progress }: { progress: number }) {
  return (
    <motion.div
      className="absolute inset-0 z-30 bg-carbon flex flex-col items-center justify-center"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <p
          className="text-2xl tracking-[0.3em] uppercase mb-8 logo-sheen"
          style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}
        >
          Tartary
        </p>
        <div className="w-48 h-[1px] bg-white/10 mx-auto relative overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full bg-gold"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          />
        </div>
        <p
          className="text-[10px] tracking-[0.2em] uppercase text-ash/50 mt-4"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          Building world
        </p>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────── MAIN COMPONENT ───────────────────────────
export default function TartaryWorld() {
  const router = useRouter();
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoaded(true), 2200);
    return () => clearTimeout(timer);
  }, []);

  const handleDistrictClick = useCallback(
    (href: string) => {
      router.push(href);
    },
    [router]
  );

  return (
    <div className="relative w-full h-screen bg-carbon overflow-hidden">
      {/* Three.js Canvas */}
      <Canvas
        shadows
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor('#050505');
        }}
      >
        <OrthographicCamera
          makeDefault
          position={[18, 16, 18]}
          zoom={38}
          near={0.1}
          far={100}
        />
        <Scene
          hoveredDistrict={hoveredDistrict}
          setHoveredDistrict={setHoveredDistrict}
          onDistrictClick={handleDistrictClick}
        />
      </Canvas>

      {/* HUD Overlay */}
      <HUDOverlay
        hoveredDistrict={hoveredDistrict}
        onDistrictClick={handleDistrictClick}
        isReady={isLoaded}
      />

      {/* Loading screen */}
      <AnimatePresence>
        {!isLoaded && <LoadingScreen progress={loadProgress} />}
      </AnimatePresence>

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-[5]"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.4) 100%)',
        }}
      />

      {/* Top fade for nav blending */}
      <div
        className="absolute top-0 left-0 right-0 h-24 pointer-events-none z-[5]"
        style={{
          background: 'linear-gradient(to bottom, rgba(5,5,5,0.5) 0%, transparent 100%)',
        }}
      />
    </div>
  );
}
