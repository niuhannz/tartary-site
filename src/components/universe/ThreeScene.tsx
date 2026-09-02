"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import type { UniverseMarker } from "@/lib/siteContent";

/* ═══════════════════════════════════════════════════════════════════
   ThreeScene — sandbox universe shelf with real heightmap terrain.
   Each diorama is a noise-displaced heightmap (mountains/plains/marsh/
   coast/city) with elevation-based vertex colors and proper water.
   No custom GLSL; no over-bright glow.
   ═══════════════════════════════════════════════════════════════════ */

interface ThreeSceneProps {
  markers: UniverseMarker[];
  focusId: string | null;
  onSelect: (m: UniverseMarker) => void;
  onHover: (m: UniverseMarker | null, x: number, y: number) => void;
}

const CAMERA_DEFAULT = new THREE.Vector3(0, 7.5, 11.5);
const CAMERA_LOOK_DEFAULT = new THREE.Vector3(0, -0.3, 0);

const KIND_GLOW: Record<UniverseMarker["kind"], string> = {
  world: "#FF6600",
  character: "#b9d0ff",
  story: "#e7c77a",
};

/* ── noise (value noise + fbm) ─────────────────────────────────── */
function hash2(x: number, y: number): number {
  let n = (x * 1597 + y * 31337) | 0;
  n = (n ^ (n >> 13)) * 1597334677;
  n = (n ^ (n >> 16)) >>> 0;
  return n / 4294967295;
}
const smooth01 = (t: number) => t * t * (3 - 2 * t);
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
function valueNoise2(x: number, y: number): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const a = hash2(xi, yi);
  const b = hash2(xi + 1, yi);
  const c = hash2(xi, yi + 1);
  const d = hash2(xi + 1, yi + 1);
  const u = smooth01(xf);
  const v = smooth01(yf);
  return mix(mix(a, b, u), mix(c, d, u), v);
}
function fbm2(x: number, y: number, oct = 5): number {
  let v = 0;
  let a = 0.5;
  let fx = x;
  let fy = y;
  for (let i = 0; i < oct; i++) {
    v += a * valueNoise2(fx, fy);
    fx = fx * 2.03 + 1.7;
    fy = fy * 2.03 + 9.2;
    a *= 0.5;
  }
  return v;
}
function seedFromId(id: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < id.length; i++) {
    h = (h ^ id.charCodeAt(i)) >>> 0;
    h = (h * 16777619) >>> 0;
  }
  return (((h % 100000) + 100000) % 100000) / 100000; // [0,1)
}

/* winding river centerline (horizontal, flows along local X, winds in local Y) */
function riverCenterY(x: number, size: number, seed: number): number {
  const f1 = 1.8 / size;
  const f2 = 4.3 / size;
  const f3 = 9.5 / size;
  return (
    Math.sin(f1 * x + seed * 40.0) * size * 0.3 +
    Math.sin(f2 * x + seed * 61.0) * size * 0.11 +
    Math.sin(f3 * x + seed * 87.0) * size * 0.045
  );
}

/* ── canvas label texture ── */
function makeLabelTexture(text: string, glowColor: string): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const fontPx = text.length > 16 ? 58 : text.length > 11 ? 70 : 84;
  ctx.font = `600 ${fontPx}px "Syne", "Inter", sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.shadowColor = glowColor;
  ctx.shadowBlur = 18;
  ctx.fillStyle = "#ece4d2";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#ffffff";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearFilter;
  return tex;
}

/* ── river ribbon: flat water strip following riverCenterY ── */
function buildRiverRibbon(
  size: number,
  seed: number,
  water: THREE.Color,
  level: number,
  width: number
): THREE.Mesh {
  const half = size * 0.88;
  const n = 48;
  const positions = new Float32Array((n + 1) * 2 * 3);
  const indices: number[] = [];
  for (let i = 0; i <= n; i++) {
    const x = -half + (i / n) * 2 * half;
    const cy = riverCenterY(x, size, seed);
    const d = 0.0001;
    const ty = (riverCenterY(x + d, size, seed) - cy) / d;
    const len = Math.hypot(1, ty);
    const nx = -ty / len;
    const ny = 1 / len;
    const j = i * 6;
    positions[j] = x + nx * width;
    positions[j + 1] = cy + ny * width;
    positions[j + 2] = level;
    positions[j + 3] = x - nx * width;
    positions[j + 4] = cy - ny * width;
    positions[j + 5] = level;
    if (i < n) {
      const a = i * 2;
      const b = i * 2 + 1;
      const c = i * 2 + 2;
      const dd = i * 2 + 3;
      indices.push(a, c, b, b, c, dd);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  const mat = new THREE.MeshStandardMaterial({
    color: water,
    roughness: 0.06,
    metalness: 0.55,
    transparent: true,
    opacity: 0.92,
    emissive: water,
    emissiveIntensity: 0.08,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2;
  return mesh;
}

/* ── terrain builder: real heightmap with vertex colors ── */
function buildTerrain(
  marker: UniverseMarker,
  size: number,
  base: THREE.Color,
  ridge: THREE.Color,
  glow: THREE.Color,
  water: THREE.Color
): THREE.Group {
  const g = new THREE.Group();
  const { terrain } = marker;
  const seed = seedFromId(marker.id); // [0,1)
  const ox = seed * 100;
  const oy = seed * 173;

  const seg = 56;
  const half = size * 0.88; // terrain radius (within plinth r = 0.95*size)
  const plane = new THREE.PlaneGeometry(half * 2, half * 2, seg, seg);
  const pos = plane.attributes.position as THREE.BufferAttribute;
  const colors = new Float32Array(pos.count * 3);
  const v = new THREE.Vector3();
  const c = new THREE.Color();
  const snow = new THREE.Color(0xe8eef4);
  const sand = new THREE.Color(0xc2a877);
  const grass = new THREE.Color(0x3a5a3a);
  const deepWater = new THREE.Color(0x06141a);
  const riverWater = new THREE.Color(0x2a6a75); // teal river water for mountains / plains

  /* per-terrain params */
  type TerrainCfg = {
    amp: number;
    freq: number;
    flat: boolean;
    water: boolean;
    contrast: number;
    dome: number;
    tilt?: number;
    river?: { width: number; level: number };
  };
  const cfg: TerrainCfg = (() => {
    switch (terrain) {
      case "mountains":
        return {
          amp: size * 0.72,
          freq: 1.25,
          flat: true,
          water: false,
          contrast: 1.35,
          dome: 0.35,
          river: { width: size * 0.06, level: -size * 0.055 },
        };
      case "plains":
        return {
          amp: size * 0.1,
          freq: 0.9,
          flat: false,
          water: false,
          contrast: 1.0,
          dome: 0.0,
          river: { width: size * 0.09, level: -size * 0.02 },
        };
      case "marsh":
        return { amp: size * 0.05, freq: 1.1, flat: false, water: true, contrast: 1.0, dome: 0.0 };
      case "coast":
        return {
          amp: size * 0.26,
          freq: 1.0,
          flat: true,
          water: true,
          contrast: 1.1,
          dome: 0.0,
          tilt: 0.42,
        };
      case "city":
        return { amp: size * 0.02, freq: 0.8, flat: false, water: false, contrast: 1.0, dome: 0.0 };
    }
  })();

  /* displace + color per vertex */
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const lx = v.x;
    const ly = v.y; // plane is in XY (will be rotated)
    const r = Math.sqrt(lx * lx + ly * ly);
    const rNorm = r / half;

    // radial mask: taper to 0 at the edge (rounded island, sits on plinth)
    const mask = 1 - smooth01(Math.min(1, Math.max(0, (rNorm - 0.82) / 0.18)));
    // base dome (mountains rise in center)
    const dome = (cfg.dome ?? 0) * (1 - rNorm) * (1 - rNorm);

    // coast: left side high, right side low
    const tilt = cfg.tilt ? lx / half : 0; // -1..1
    const tiltBias = (cfg.tilt ?? 0) * tilt * size;

    let h = fbm2((lx + ox) * cfg.freq, (ly + oy) * cfg.freq);
    // contrast curve
    h = Math.pow(h, cfg.contrast);
    // ridge enhancement for mountains
    if (terrain === "mountains") {
      const r2 = 1 - Math.abs(2 * h - 1);
      h = r2 * 0.55 + h * 0.45;
    }
    let disp = h * cfg.amp * mask + dome * size + tiltBias;
    // coast: clamp so right side is at/below water level
    if (terrain === "coast") {
      const waterLevel = -size * 0.08;
      if (tilt > 0.05) disp = Math.min(disp, waterLevel + (tilt - 0.05) * size * 0.15);
    }
    // city: keep very flat
    if (terrain === "city") disp *= 0.6;

    // carve the winding river channel into mountains / plains
    if (cfg.river) {
      const cy = riverCenterY(lx, size, seed);
      const distRiver = Math.abs(ly - cy);
      const rim = cfg.river.width * 1.8;
      if (distRiver < rim) {
        const t = THREE.MathUtils.clamp(distRiver / rim, 0, 1);
        const floor = cfg.river.level - size * 0.014; // slightly below the water plane
        const valley = mix(floor, disp, smooth01(t));
        disp = Math.min(disp, valley);
      }
    }

    pos.setZ(i, disp);

    /* color by elevation + position */
    const heightT = (disp + Math.abs(cfg.tilt ? size * cfg.tilt : 0)) / Math.max(0.001, cfg.amp + size);
    const hN = THREE.MathUtils.clamp(heightT, 0, 1);

    if (terrain === "mountains") {
      // base rock -> ridge -> snow
      c.copy(base).multiplyScalar(0.6);
      c.lerp(ridge, smooth01(hN * 1.15));
      if (hN > 0.62) c.lerp(snow, Math.min(1, (hN - 0.62) / 0.35));
    } else if (terrain === "plains") {
      c.copy(base).lerp(grass, 0.5 + hN * 0.5);
      c.lerp(ridge, hN * 0.3);
    } else if (terrain === "marsh") {
      c.copy(base).lerp(grass, 0.3);
    } else if (terrain === "coast") {
      if (disp < -size * 0.04) c.copy(water);
      else if (disp < size * 0.02) c.lerpColors(sand, grass, (disp + size * 0.04) / (size * 0.06));
      else c.copy(grass).lerp(ridge, Math.min(1, (disp - size * 0.02) / (size * 0.2)));
    } else {
      // city ground
      c.copy(base).lerp(ridge, 0.25);
    }
    // river: tint the submerged channel floor toward water
    if (cfg.river && disp < cfg.river.level) {
      c.lerp(riverWater, 0.6);
    }

    // edge tint toward plinth dark
    c.lerp(new THREE.Color(0x0a0908), Math.max(0, (rNorm - 0.7) / 0.3) * 0.7);

    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  plane.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  plane.computeVertexNormals();

  const mat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.92,
    metalness: 0.05,
    flatShading: cfg.flat,
    emissive: ridge,
    emissiveIntensity: 0.025,
  });
  const terrainMesh = new THREE.Mesh(plane, mat);
  terrainMesh.rotation.x = -Math.PI / 2; // lie flat in XZ
  g.add(terrainMesh);

  /* winding river (mountains / plains) */
  if (cfg.river) {
    g.add(buildRiverRibbon(size, seed, riverWater, cfg.river.level, cfg.river.width));
  }

  /* water plane for marsh / coast */
  if (cfg.water) {
    const waterMat = new THREE.MeshStandardMaterial({
      color: water,
      roughness: 0.08,
      metalness: 0.55,
      transparent: true,
      opacity: 0.9,
      emissive: water,
      emissiveIntensity: 0.08,
    });
    if (terrain === "marsh") {
      // a winding water body following the lowest noise
      const wr = size * 0.55;
      const waterDisc = new THREE.Mesh(
        new THREE.CylinderGeometry(wr, wr, size * 0.02, 48),
        waterMat
      );
      waterDisc.position.set(
        Math.cos(seed * 6.28) * size * 0.05,
        -size * 0.02,
        Math.sin(seed * 6.28) * size * 0.05
      );
      g.add(waterDisc);
    } else {
      // coast: a sea on the +x (low) side
      const sea = new THREE.Mesh(
        new THREE.CylinderGeometry(size * 0.78, size * 0.78, size * 0.02, 56),
        waterMat
      );
      sea.position.set(size * 0.5, -size * 0.07, 0);
      g.add(sea);
      // a deeper patch
      const deep = new THREE.Mesh(
        new THREE.CylinderGeometry(size * 0.4, size * 0.4, size * 0.01, 40),
        new THREE.MeshStandardMaterial({
          color: deepWater,
          roughness: 0.1,
          metalness: 0.5,
          transparent: true,
          opacity: 0.7,
        })
      );
      deep.position.set(size * 0.65, -size * 0.085, 0);
      g.add(deep);
    }
  }

  /* reeds for marsh */
  if (terrain === "marsh") {
    const reedMat = new THREE.MeshStandardMaterial({
      color: ridge,
      roughness: 0.8,
      emissive: glow,
      emissiveIntensity: 0.05,
    });
    for (let i = 0; i < 11; i++) {
      const rh = size * (0.18 + ((i * 37) % 100) / 100 * 0.22);
      const reed = new THREE.Mesh(
        new THREE.CylinderGeometry(size * 0.007, size * 0.011, rh, 5),
        reedMat
      );
      const ang = (i / 11) * Math.PI * 2 + (seed % 1);
      const dist = size * (0.15 + ((i * 53) % 100) / 100 * 0.5);
      reed.position.set(Math.cos(ang) * dist, rh / 2 + size * 0.02, Math.sin(ang) * dist);
      reed.rotation.z = (((i * 17) % 20) - 10) / 100;
      reed.rotation.x = (((i * 23) % 20) - 10) / 100;
      g.add(reed);
    }
  }

  /* rocks for coast */
  if (terrain === "coast") {
    const rockMat = new THREE.MeshStandardMaterial({
      color: ridge,
      roughness: 0.85,
      emissive: glow,
      emissiveIntensity: 0.04,
      flatShading: true,
    });
    for (let i = 0; i < 5; i++) {
      const r = size * (0.06 + ((i * 41) % 100) / 100 * 0.08);
      const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(r, 0), rockMat);
      const ang = (i / 5) * Math.PI * 1.2 + seed;
      const dist = size * (0.25 + ((i * 29) % 100) / 100 * 0.45);
      rock.position.set(Math.cos(ang) * dist - size * 0.1, r * 0.5, Math.sin(ang) * dist);
      rock.rotation.set(((i * 7) % 10) / 10, ((i * 11) % 10) / 10, 0);
      g.add(rock);
    }
  }

  /* city towers */
  if (terrain === "city") {
    const towerMat = new THREE.MeshStandardMaterial({
      color: base,
      roughness: 0.6,
      metalness: 0.35,
      emissive: base,
      emissiveIntensity: 0.06,
    });
    const windowMat = new THREE.MeshStandardMaterial({
      color: ridge,
      emissive: glow,
      emissiveIntensity: 0.4,
      roughness: 0.4,
    });
    const towers = 9;
    for (let i = 0; i < towers; i++) {
      const h = size * (0.22 + ((i * 47) % 100) / 100 * 0.55);
      const w = size * (0.08 + ((i * 31) % 100) / 100 * 0.08);
      const tower = new THREE.Mesh(new THREE.BoxGeometry(w, h, w), towerMat);
      const ang = (i / towers) * Math.PI * 2 + (seed % 1) * 0.6;
      const dist = size * (0.12 + ((i * 19) % 100) / 100 * 0.5);
      tower.position.set(Math.cos(ang) * dist, h / 2, Math.sin(ang) * dist);
      tower.rotation.y = ((i * 13) % 10) / 10 * Math.PI;
      g.add(tower);
      if (i % 2 === 0) {
        const cap = new THREE.Mesh(
          new THREE.BoxGeometry(w * 0.5, size * 0.05, w * 0.5),
          windowMat
        );
        cap.position.y = h / 2 + size * 0.025;
        tower.add(cap);
      }
    }
  }

  return g;
}

/* ── build one diorama: pedestal + heightmap terrain + beacon + label + hit ── */
function buildDiorama(marker: UniverseMarker) {
  const { palette, size } = marker;
  const base = new THREE.Color(palette.base);
  const ridge = new THREE.Color(palette.ridge);
  const glow = new THREE.Color(palette.glow);
  const water = new THREE.Color(palette.water ?? palette.base);

  const group = new THREE.Group();
  group.position.set(marker.x, 0, marker.z);

  const plinthR = size * 0.95;
  const plinthH = size * 0.34;

  // pedestal
  const plinthMat = new THREE.MeshStandardMaterial({
    color: base,
    roughness: 0.85,
    metalness: 0.2,
    emissive: base,
    emissiveIntensity: 0.06,
  });
  const plinth = new THREE.Mesh(
    new THREE.CylinderGeometry(plinthR, plinthR * 0.9, plinthH, 48),
    plinthMat
  );
  plinth.position.y = -plinthH / 2;
  group.add(plinth);

  // heightmap terrain on top
  const terrainGroup = buildTerrain(marker, size, base, ridge, glow, water);
  group.add(terrainGroup);

  // subtle beacon ring beneath pedestal
  const beaconMat = new THREE.MeshBasicMaterial({
    color: glow,
    transparent: true,
    opacity: 0.28,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const beacon = new THREE.Mesh(
    new THREE.TorusGeometry(plinthR * 1.06, size * 0.028, 16, 64),
    beaconMat
  );
  beacon.rotation.x = Math.PI / 2;
  beacon.position.y = -plinthH - size * 0.06;
  group.add(beacon);

  // name label (no giant glow sprite — bloom will handle accent)
  const labelTex = makeLabelTexture(marker.name, `#${glow.getHexString()}`);
  const label = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: labelTex, transparent: true, depthWrite: false })
  );
  label.scale.set(size * 1.7, size * 1.7 * 0.26, 1);
  label.position.y = size * 0.7 + 0.7;
  group.add(label);

  // invisible hit cylinder (raycast)
  const hit = new THREE.Mesh(
    new THREE.CylinderGeometry(plinthR * 1.15, plinthR * 1.15, size * 1.9, 16),
    new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })
  );
  hit.position.y = size * 0.25;
  hit.userData.marker = marker;
  group.add(hit);

  group.userData = {
    marker,
    beacon,
    baseY: 0,
    phase: seedFromId(marker.id) * Math.PI * 2,
  };

  return { group, hit, beacon, label, labelTex, glow };
}

export default function ThreeScene({ markers, focusId, onSelect, onHover }: ThreeSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const ctrlRef = useRef<{
    flyTo: (id: string | null) => void;
  } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = null;
    // (no fog — the previous FogExp2 was darkening the lower shelf and creating a
    // harsh horizontal "cutoff" between bright islands and dark base)

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      200
    );
    camera.position.copy(CAMERA_DEFAULT);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.target.copy(CAMERA_LOOK_DEFAULT);
    controls.minDistance = 7;
    controls.maxDistance = 24;
    controls.minPolarAngle = 0.28;
    controls.maxPolarAngle = 1.38;
    controls.enablePan = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.4;
    controls.rotateSpeed = 0.6;
    controls.update();

    /* ── lights (calm, balanced — no over-bright key) ── */
    scene.add(new THREE.AmbientLight(0x8a96b0, 0.55));
    scene.add(new THREE.HemisphereLight(0x6b7a90, 0x1a1612, 0.45));
    const key = new THREE.DirectionalLight(0xfff2df, 1.25);
    key.position.set(6, 9, 5);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x5f86ff, 0.7);
    rim.position.set(-7, 3, -5);
    scene.add(rim);

    /* ── starfield ── */
    const starCount = 1400;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const v = new THREE.Vector3(
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1
      )
        .normalize()
        .multiplyScalar(40 + Math.random() * 45);
      starPos[i * 3] = v.x;
      starPos[i * 3 + 1] = v.y;
      starPos[i * 3 + 2] = v.z;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xbfc8e8,
      size: 0.08,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    /* ── display shelf (subtle, not competing with islands) ── */
    const shelfMat = new THREE.MeshStandardMaterial({
      color: 0x0c0a09,
      roughness: 0.9,
      metalness: 0.25,
      emissive: 0x0a0807,
      emissiveIntensity: 0.4,
    });
    const shelf = new THREE.Mesh(new THREE.CylinderGeometry(11, 11.6, 0.4, 72), shelfMat);
    shelf.position.y = -2.35;
    scene.add(shelf);

    const rimMat = new THREE.MeshBasicMaterial({
      color: 0x3a2f24,
      transparent: true,
      opacity: 0.32,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const rimRing = new THREE.Mesh(new THREE.TorusGeometry(11.0, 0.05, 12, 96), rimMat);
    rimRing.rotation.x = Math.PI / 2;
    rimRing.position.y = -2.14;
    scene.add(rimRing);

    /* ── dioramas ── */
    const dioramas: ReturnType<typeof buildDiorama>[] = [];
    const hitMeshes: THREE.Mesh[] = [];
    const labelTextures: THREE.CanvasTexture[] = [];

    markers.forEach((marker) => {
      const d = buildDiorama(marker);
      scene.add(d.group);
      dioramas.push(d);
      hitMeshes.push(d.hit);
      labelTextures.push(d.labelTex);
    });

    /* ── post-processing: bloom is now subtle, only the brightest accents bleed ── */
    let composer: EffectComposer | null = null;
    try {
      composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
      const bloom = new UnrealBloomPass(
        new THREE.Vector2(container.clientWidth, container.clientHeight),
        0.35, // strength (was 0.9)
        0.45, // radius
        0.72  // threshold (was 0.22) — only really hot pixels bloom
      );
      composer.addPass(bloom);
    } catch {
      composer = null;
    }

    /* ── interaction ── */
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let hovered: UniverseMarker | null = null;
    let flying = false;
    let flyTarget: { pos: THREE.Vector3; look: THREE.Vector3 } | null = null;

    const setHover = (m: UniverseMarker | null) => {
      if (hovered === m) return;
      hovered = m;
      dioramas.forEach((d) => {
        const isThis = d.group.userData.marker === m;
        (d.beacon.material as THREE.MeshBasicMaterial).opacity = isThis ? 0.7 : 0.28;
        d.beacon.scale.setScalar(isThis ? 1.2 : 1);
      });
      container.style.cursor = m ? "pointer" : "grab";
    };

    const flyTo = (id: string | null) => {
      if (!id) {
        flying = true;
        flyTarget = { pos: CAMERA_DEFAULT.clone(), look: CAMERA_LOOK_DEFAULT.clone() };
        controls.autoRotate = true;
        return;
      }
      const marker = markers.find((m) => m.id === id);
      if (!marker) return;
      const look = new THREE.Vector3(marker.x, marker.size * 0.25, marker.z);
      const offset = new THREE.Vector3(2.1, 2.3, 3.1)
        .normalize()
        .multiplyScalar(marker.size * 2.4 + 2.2);
      const pos = look.clone().add(offset);
      flying = true;
      flyTarget = { pos, look };
      controls.autoRotate = false;
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(hitMeshes, false);
      const m = hits.length > 0 ? (hits[0].object.userData.marker as UniverseMarker) : null;
      setHover(m);
      onHover(m, e.clientX, e.clientY);
    };

    const onPointerDown = (e: PointerEvent) => {
      if (flying) return;
      const rect = container.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(hitMeshes, false);
      if (hits.length > 0) {
        onSelect(hits[0].object.userData.marker as UniverseMarker);
      }
    };

    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      if (composer) composer.setSize(w, h);
    };

    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("resize", onResize);

    /* ── render loop ── */
    let raf = 0;
    const clock = new THREE.Clock();
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // gentle float + beacon pulse
      dioramas.forEach((d) => {
        const u = d.group.userData;
        d.group.position.y = u.baseY + Math.sin(t * 0.7 + u.phase) * 0.06;
        const pulse = 0.22 + Math.sin(t * 1.5 + u.phase) * 0.06;
        (d.beacon.material as THREE.MeshBasicMaterial).opacity =
          hovered === u.marker ? 0.7 : pulse;
      });

      if (flying && flyTarget) {
        camera.position.lerp(flyTarget.pos, 0.07);
        controls.target.lerp(flyTarget.look, 0.07);
        if (camera.position.distanceTo(flyTarget.pos) < 0.03) {
          flying = false;
          flyTarget = null;
        }
      }

      controls.update();
      if (composer) composer.render();
      else renderer.render(scene, camera);
    };
    animate();

    ctrlRef.current = { flyTo };

    /* ── cleanup ── */
    return () => {
      cancelAnimationFrame(raf);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("resize", onResize);
      controls.dispose();

      const disposeObj = (obj: THREE.Object3D) => {
        obj.traverse((child) => {
          if (child instanceof THREE.Mesh || child instanceof THREE.Sprite) {
            child.geometry?.dispose?.();
            const mat = child.material as THREE.Material | THREE.Material[];
            if (Array.isArray(mat)) mat.forEach((mm) => mm.dispose());
            else mat?.dispose?.();
          }
        });
      };
      dioramas.forEach((d) => disposeObj(d.group));
      disposeObj(stars);
      disposeObj(shelf);
      disposeObj(rimRing);
      starGeo.dispose();
      starMat.dispose();
      shelfMat.dispose();
      rimMat.dispose();
      labelTextures.forEach((tex) => tex.dispose());

      if (composer) composer.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [markers, onSelect, onHover]);

  useEffect(() => {
    ctrlRef.current?.flyTo(focusId);
  }, [focusId]);

  return <div ref={containerRef} className="absolute inset-0" />;
}
