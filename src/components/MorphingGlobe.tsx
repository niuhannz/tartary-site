'use client';

import { useRef, useMemo, useEffect, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Html, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import type { WorldDefinition } from '@/data/worlds';

const SPHERE_RADIUS = 2;
const FLAT_SCALE = 1.4; // Flat disc radius relative to sphere

// ─── Utilities ──────────────────────────────────────────

function latLngToSphere(lat: number, lng: number): THREE.Vector3 {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lng + 180) * Math.PI) / 180;
  return new THREE.Vector3(
    -SPHERE_RADIUS * Math.sin(phi) * Math.cos(theta),
    SPHERE_RADIUS * Math.cos(phi),
    SPHERE_RADIUS * Math.sin(phi) * Math.sin(theta)
  );
}

function latLngToFlat(lat: number, lng: number): THREE.Vector3 {
  const latRad = (lat * Math.PI) / 180;
  const lngRad = (lng * Math.PI) / 180;
  const r = ((Math.PI / 2 - latRad) / Math.PI) * SPHERE_RADIUS * FLAT_SCALE;
  return new THREE.Vector3(r * Math.sin(lngRad), 0, -r * Math.cos(lngRad));
}

// ─── Atmosphere Glow ────────────────────────────────────

function Atmosphere({ color, morphRef }: { color: string; morphRef: React.MutableRefObject<number> }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.ShaderMaterial;
      mat.opacity = 1 - morphRef.current;
    }
  });

  return (
    <Sphere ref={meshRef} args={[2.08, 64, 64]}>
      <shaderMaterial
        transparent
        side={THREE.BackSide}
        uniforms={{ glowColor: { value: new THREE.Color(color) } }}
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

// ─── Morphing Mesh ──────────────────────────────────────

function MorphingMesh({
  textureUrl,
  morphRef,
}: {
  textureUrl: string;
  morphRef: React.MutableRefObject<number>;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    new THREE.TextureLoader().load(textureUrl, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 4;
      setTexture(tex);
    });
  }, [textureUrl]);

  const geometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(SPHERE_RADIUS, 128, 64);
    const uv = geo.attributes.uv;
    const count = geo.attributes.position.count;
    const flatPos = new Float32Array(count * 3);
    const flatNorm = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const u = uv.getX(i);
      const v = uv.getY(i);
      // Three.js SphereGeometry: uv.y=1 at top (north pole), uv.y=0 at bottom (south pole)
      const lat = v * 180 - 90; // -90° to +90°
      const lng = u * 360 - 180; // -180° to +180°
      const latRad = (lat * Math.PI) / 180;
      const lngRad = (lng * Math.PI) / 180;
      const r = ((Math.PI / 2 - latRad) / Math.PI) * SPHERE_RADIUS * FLAT_SCALE;

      flatPos[i * 3] = r * Math.sin(lngRad);
      flatPos[i * 3 + 1] = 0;
      flatPos[i * 3 + 2] = -r * Math.cos(lngRad);
      // Flat normals: all point up
      flatNorm[i * 3] = 0;
      flatNorm[i * 3 + 1] = 1;
      flatNorm[i * 3 + 2] = 0;
    }

    geo.morphAttributes.position = [new THREE.Float32BufferAttribute(flatPos, 3)];
    geo.morphAttributes.normal = [new THREE.Float32BufferAttribute(flatNorm, 3)];
    return geo;
  }, []);

  useFrame(() => {
    if (meshRef.current?.morphTargetInfluences) {
      meshRef.current.morphTargetInfluences[0] = morphRef.current;
    }
  });

  if (!texture) return null;

  return (
    <mesh ref={meshRef} geometry={geometry} morphTargetInfluences={[0]}>
      <meshStandardMaterial
        map={texture}
        side={THREE.DoubleSide}
        roughness={0.85}
        metalness={0.05}
      />
    </mesh>
  );
}

// ─── Location Dot ───────────────────────────────────────

const TYPE_COLORS: Record<string, string> = {
  capital: '#ffd700',
  city: '#c0c0c0',
  landmark: '#00d4ff',
  conflict: '#ff4444',
};

function LocationDot({
  spherePos,
  flatPos,
  morphRef,
  name,
  color,
  isCapital,
}: {
  spherePos: THREE.Vector3;
  flatPos: THREE.Vector3;
  morphRef: React.MutableRefObject<number>;
  name: string;
  color: string;
  isCapital: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ camera }) => {
    if (!groupRef.current) return;
    const t = morphRef.current;
    groupRef.current.position.lerpVectors(spherePos, flatPos, t);

    // Backface culling on sphere: hide dots on far side
    if (t < 0.5) {
      const normal = groupRef.current.position.clone().normalize();
      const toCamera = camera.position.clone().sub(groupRef.current.position).normalize();
      groupRef.current.visible = normal.dot(toCamera) > -0.1;
    } else {
      groupRef.current.visible = true;
    }
  });

  return (
    <group ref={groupRef}>
      <Html center distanceFactor={7} style={{ pointerEvents: 'none' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pointerEvents: 'auto',
          }}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
        >
          {(isCapital || hovered) && (
            <span
              style={{
                fontSize: '8px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color,
                fontFamily: 'var(--font-mono)',
                background: 'rgba(10,10,10,0.85)',
                border: `1px solid ${color}25`,
                padding: '1px 5px',
                borderRadius: '3px',
                whiteSpace: 'nowrap',
                marginBottom: '3px',
              }}
            >
              {name}
            </span>
          )}
          <div
            style={{
              width: '5px',
              height: '5px',
              borderRadius: '50%',
              backgroundColor: color,
              boxShadow: `0 0 6px ${color}80`,
            }}
          />
        </div>
      </Html>
    </group>
  );
}

// ─── All Location Markers ───────────────────────────────

function LocationMarkers({
  world,
  morphRef,
}: {
  world: WorldDefinition;
  morphRef: React.MutableRefObject<number>;
}) {
  return (
    <>
      {world.keyLocations.map((loc) => (
        <LocationDot
          key={`${world.id}-${loc.name}`}
          spherePos={latLngToSphere(loc.lat, loc.lng)}
          flatPos={latLngToFlat(loc.lat, loc.lng)}
          morphRef={morphRef}
          name={loc.name}
          color={TYPE_COLORS[loc.type] || '#ffffff'}
          isCapital={loc.type === 'capital'}
        />
      ))}
    </>
  );
}

// ─── Camera + Controls Controller ───────────────────────

function CameraController({
  morphRef,
  targetFlat,
  controlsRef,
}: {
  morphRef: React.MutableRefObject<number>;
  targetFlat: boolean;
  controlsRef: React.MutableRefObject<any>;
}) {
  const { camera } = useThree();

  useFrame(() => {
    if (!controlsRef.current) return;
    const controls = controlsRef.current;
    const t = morphRef.current;

    // Smoothly constrain polar angle based on morph
    const maxPolar = THREE.MathUtils.lerp(Math.PI, 0.25, t);
    controls.maxPolarAngle = maxPolar;

    // Push camera toward top-down when unfolding
    if (targetFlat && controls.getPolarAngle() > 0.35) {
      controls.setPolarAngle(
        THREE.MathUtils.lerp(controls.getPolarAngle(), 0.2, 0.06)
      );
    }

    // Push camera to nice perspective angle when folding back
    if (!targetFlat && t < 0.2 && controls.getPolarAngle() < 0.5) {
      controls.setPolarAngle(
        THREE.MathUtils.lerp(controls.getPolarAngle(), Math.PI / 3, 0.04)
      );
    }

    // Adjust camera distance
    const targetDist = THREE.MathUtils.lerp(5.2, 6.5, t);
    const currentDist = camera.position.length();
    if (Math.abs(currentDist - targetDist) > 0.05) {
      const newDist = THREE.MathUtils.lerp(currentDist, targetDist, 0.04);
      camera.position.normalize().multiplyScalar(newDist);
    }

    // Enable/disable pan based on mode
    controls.enablePan = t > 0.8;
  });

  return null;
}

// ─── Scene ──────────────────────────────────────────────

function Scene({
  world,
  isFlat,
  onToggle,
  onReady,
}: {
  world: WorldDefinition;
  isFlat: boolean;
  onToggle: () => void;
  onReady?: () => void;
}) {
  const controlsRef = useRef<any>(null);
  const morphRef = useRef(0);
  const pointerDownRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const lastClickTime = useRef(0);
  const readyFired = useRef(false);

  // Fire onReady once
  useEffect(() => {
    if (!readyFired.current) {
      readyFired.current = true;
      onReady?.();
    }
  }, [onReady]);

  // Animate morph toward target
  useFrame(() => {
    const target = isFlat ? 1 : 0;
    const diff = target - morphRef.current;
    if (Math.abs(diff) > 0.001) {
      morphRef.current += diff * 0.045;
    } else {
      morphRef.current = target;
    }
  });

  // Click/double-click detection on mesh
  const handlePointerDown = useCallback((e: any) => {
    e.stopPropagation();
    pointerDownRef.current = { x: e.clientX, y: e.clientY, time: Date.now() };
  }, []);

  const handlePointerUp = useCallback(
    (e: any) => {
      e.stopPropagation();
      if (!pointerDownRef.current) return;
      const dx = e.clientX - pointerDownRef.current.x;
      const dy = e.clientY - pointerDownRef.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      pointerDownRef.current = null;
      if (dist > 8) return; // was a drag

      const now = Date.now();
      if (now - lastClickTime.current < 350) {
        // Double-click → fold back to globe
        lastClickTime.current = 0;
        if (isFlat) onToggle();
      } else {
        lastClickTime.current = now;
        setTimeout(() => {
          if (lastClickTime.current === now) {
            // Single click → unfold to flat
            if (!isFlat) onToggle();
          }
        }, 350);
      }
    },
    [isFlat, onToggle]
  );

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 3, 5]} intensity={0.9} />
      <pointLight position={[-3, -2, -4]} intensity={0.25} color={world.accentColor} />

      <Stars radius={60} depth={60} count={3000} factor={4} fade speed={0.5} />

      <group onPointerDown={handlePointerDown} onPointerUp={handlePointerUp}>
        <MorphingMesh textureUrl={world.texturePath} morphRef={morphRef} />
      </group>

      <Atmosphere color={world.accentColor} morphRef={morphRef} />
      <LocationMarkers world={world} morphRef={morphRef} />

      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.08}
        autoRotate={!isFlat}
        autoRotateSpeed={0.4}
        minDistance={2.5}
        maxDistance={12}
        rotateSpeed={0.5}
      />

      <CameraController
        morphRef={morphRef}
        targetFlat={isFlat}
        controlsRef={controlsRef}
      />
    </>
  );
}

// ─── Main Export ────────────────────────────────────────

export default function MorphingGlobe({
  world,
  isFlat,
  onToggle,
  onReady,
}: {
  world: WorldDefinition;
  isFlat: boolean;
  onToggle: () => void;
  onReady?: () => void;
}) {
  return (
    <Canvas
      camera={{ position: [0, 2.5, 4.5], fov: 45, near: 0.1, far: 200 }}
      style={{ width: '100%', height: '100%', background: 'transparent' }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      dpr={[1, 2]}
    >
      <Scene world={world} isFlat={isFlat} onToggle={onToggle} onReady={onReady} />
    </Canvas>
  );
}
