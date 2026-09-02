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
/* tiny THREE.Color helpers (non-mutating) */
const shadeOf = (c: THREE.Color, f: number) => new THREE.Color(c.r * f, c.g * f, c.b * f);
const blendOf = (a: THREE.Color, b: THREE.Color, t: number) => new THREE.Color().lerpColors(a, b, t);
const hexOf = (c: THREE.Color) => `#${c.getHexString()}`;
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
/* moisture = low-frequency fbm used to drive forest vs dry-grass blending */
function moisture2(x: number, y: number, seed: number): number {
  return fbm2(x * 0.45 + seed * 23, y * 0.45 + seed * 41, 3);
}

/* seeded PRNG (mulberry32) — deterministic erosion per world */
function mulberry32(a: number): () => number {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* droplet-based hydraulic erosion — carves dendritic valleys into a heightmap.
   heights: Float32Array of size n*n (n = seg+1), row-major [y*n + x].
   Returns a NEW array (input untouched). */
function hydraulicErosion(
  heights: Float32Array,
  n: number,
  opts: {
    seed: number;
    iterations: number;
    inertia: number;
    capacity: number;
    minSlope: number;
    erodeRate: number;
    depositRate: number;
    evaporation: number;
    gravity: number;
    lifetime: number;
  }
): Float32Array {
  const h = new Float32Array(heights);
  const rand = mulberry32((opts.seed * 2654435761) >>> 0);

  const sample = (x: number, y: number) => {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const fx = x - xi;
    const fy = y - yi;
    const h00 = h[yi * n + xi];
    const h10 = h[yi * n + xi + 1];
    const h01 = h[(yi + 1) * n + xi];
    const h11 = h[(yi + 1) * n + xi + 1];
    return {
      height: (h00 * (1 - fx) + h10 * fx) * (1 - fy) + (h01 * (1 - fx) + h11 * fx) * fy,
      gx: (h10 - h00) * (1 - fy) + (h11 - h01) * fy,
      gy: (h01 - h00) * (1 - fx) + (h11 - h10) * fx,
      xi,
      yi,
      fx,
      fy,
    };
  };

  const deposit = (xi: number, yi: number, fx: number, fy: number, amt: number) => {
    h[yi * n + xi] += amt * (1 - fx) * (1 - fy);
    h[yi * n + xi + 1] += amt * fx * (1 - fy);
    h[(yi + 1) * n + xi] += amt * (1 - fx) * fy;
    h[(yi + 1) * n + xi + 1] += amt * fx * fy;
  };

  const last = n - 1;
  for (let i = 0; i < opts.iterations; i++) {
    let x = 1 + rand() * (n - 3);
    let y = 1 + rand() * (n - 3);
    let vx = 0;
    let vy = 0;
    let water = 1;
    let sediment = 0;
    let px = x;
    let py = y;

    for (let step = 0; step < opts.lifetime; step++) {
      const cur = sample(x, y);
      if (cur.xi < 1 || cur.xi >= last || cur.yi < 1 || cur.yi >= last) break;

      vx = vx * opts.inertia - cur.gx * opts.gravity;
      vy = vy * opts.inertia - cur.gy * opts.gravity;
      const speed = Math.hypot(vx, vy);
      if (speed < 0.01) break;

      const nx = vx / speed;
      const ny = vy / speed;
      const next = sample(x + nx, y + ny);
      if (next.xi < 1 || next.xi >= last || next.yi < 1 || next.yi >= last) break;

      const dh = cur.height - next.height; // >0 = flowing downhill
      const cap = Math.max(0.001, speed * water * opts.capacity);

      if (dh > 0) {
        if (sediment > cap) {
          const d = (sediment - cap) * opts.depositRate;
          sediment -= d;
          deposit(cur.xi, cur.yi, cur.fx, cur.fy, d);
        } else if (dh > opts.minSlope) {
          const e = Math.min(dh, cap - sediment) * opts.erodeRate;
          sediment += e;
          deposit(cur.xi, cur.yi, cur.fx, cur.fy, -e);
        }
      } else {
        const d = sediment * opts.depositRate;
        sediment -= d;
        deposit(cur.xi, cur.yi, cur.fx, cur.fy, d);
      }

      water *= 1 - opts.evaporation;
      px = x;
      py = y;
      x += nx;
      y += ny;
    }

    // conserve mass: deposit the droplet's remaining sediment at its final cell
    if (sediment > 0) {
      const xi = Math.floor(px);
      const yi = Math.floor(py);
      if (xi >= 0 && xi < last && yi >= 0 && yi < last) {
        deposit(xi, yi, 0.5, 0.5, sediment * 0.6);
      }
    }
  }

  return h;
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

/* ── procedural city street-grid texture (satellite urban fabric) ──
   Draws a Manhattan-style grid with concrete blocks, dark asphalt streets,
   occasional park/plaza blocks, and a couple of diagonal boulevards.
   Emissive map lights up the major avenues so the city reads at night. */
function makeCityTexture(
  seed: number,
  glow: THREE.Color,
  blockHex = "#4b4f57",
  streetHex = "#1d1f26"
): { map: THREE.CanvasTexture; emissiveMap: THREE.CanvasTexture } {
  const S = 512;
  const rand = mulberry32((seed * 2654435761) >>> 0);
  const cx = S / 2;
  const cy = S / 2;
  const R = S * 0.46;
  const darken = (hex: string, f: number) => {
    const n = parseInt(hex.slice(1), 16);
    const r = Math.min(255, Math.floor(((n >> 16) & 255) * f));
    const g = Math.min(255, Math.floor(((n >> 8) & 255) * f));
    const b = Math.min(255, Math.floor((n & 255) * f));
    return `rgb(${r},${g},${b})`;
  };

  const canvas = (): { c: HTMLCanvasElement; ctx: CanvasRenderingContext2D } => {
    const c = document.createElement("canvas");
    c.width = S;
    c.height = S;
    return { c, ctx: c.getContext("2d")! };
  };
  const col = canvas();
  const gl = canvas();

  const clip = (ctx: CanvasRenderingContext2D) => {
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.clip();
  };
  // soften the island rim: fade alpha to 0 toward the edge of the circle
  const fade = (ctx: CanvasRenderingContext2D) => {
    const g = ctx.createRadialGradient(cx, cy, R * 0.8, cx, cy, R);
    g.addColorStop(0, "rgba(0,0,0,1)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.globalCompositeOperation = "destination-in";
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, S, S);
    ctx.globalCompositeOperation = "source-over";
  };

  /* street line positions (minor grid, slightly jittered) */
  const minor = 24;
  const majorEvery = 5;
  const base: number[] = [];
  for (let p = -R; p <= R; p += minor) base.push(p);
  const xs = base.map((p) => p + (rand() - 0.5) * minor * 0.22);
  const ys = base.map((p) => p + (rand() - 0.5) * minor * 0.22);
  const majorXs = xs.filter((_, i) => i % majorEvery === 0);
  const majorYs = ys.filter((_, i) => i % majorEvery === 0);

  /* diagonal boulevards (shared between albedo & emissive passes) */
  const boulevards: { dx: number; dy: number; sx: number; sy: number }[] = [];
  for (let k = 0; k < 2; k++) {
    const a = rand() * Math.PI - Math.PI / 2;
    const off = (rand() - 0.5) * R * 0.8;
    const dx = Math.cos(a);
    const dy = Math.sin(a);
    boulevards.push({ dx, dy, sx: cx - dy * off, sy: cy + dx * off });
  }

  /* ── albedo: concrete blocks + dark streets ── */
  col.ctx.save();
  clip(col.ctx);
  col.ctx.fillStyle = blockHex;
  col.ctx.fillRect(0, 0, S, S);

  // rooftop grain — translucent speckles that keep the world tint underneath
  for (let gy = -R; gy < R; gy += 4) {
    for (let gx = -R; gx < R; gx += 4) {
      const t = rand();
      col.ctx.fillStyle =
        t < 0.5
          ? `rgba(255,255,255,${(0.03 + t * 0.12).toFixed(3)})`
          : `rgba(0,0,0,${(0.05 + (t - 0.5) * 0.28).toFixed(3)})`;
      col.ctx.fillRect(cx + gx, cy + gy, 3, 3);
    }
  }

  // occasional parks (green) & plazas (tan)
  for (let i = 0; i < xs.length - 1; i++) {
    for (let j = 0; j < ys.length - 1; j++) {
      if (rand() > 0.055) continue;
      col.ctx.fillStyle =
        rand() < 0.6 ? "rgba(56,82,50,0.85)" : "rgba(122,110,88,0.8)";
      col.ctx.fillRect(
        cx + xs[i],
        cy + ys[j],
        xs[i + 1] - xs[i],
        ys[j + 1] - ys[j]
      );
    }
  }

  // minor streets
  col.ctx.fillStyle = streetHex;
  for (const p of xs) col.ctx.fillRect(cx + p - 0.8, cy - R, 1.6, 2 * R);
  for (const p of ys) col.ctx.fillRect(cx - R, cy + p - 0.8, 2 * R, 1.6);

  // major avenues
  col.ctx.fillStyle = darken(streetHex, 0.8);
  for (const p of majorXs) col.ctx.fillRect(cx + p - 1.8, cy - R, 3.6, 2 * R);
  for (const p of majorYs) col.ctx.fillRect(cx - R, cy + p - 1.8, 2 * R, 3.6);

  // diagonal boulevards
  col.ctx.strokeStyle = darken(streetHex, 0.88);
  col.ctx.lineWidth = 5;
  for (const b of boulevards) {
    col.ctx.beginPath();
    col.ctx.moveTo(b.sx - b.dx * R * 1.5, b.sy - b.dy * R * 1.5);
    col.ctx.lineTo(b.sx + b.dx * R * 1.5, b.sy + b.dy * R * 1.5);
    col.ctx.stroke();
  }
  col.ctx.restore();
  fade(col.ctx);

  /* ── emissive: glowing avenues only ── */
  gl.ctx.save();
  clip(gl.ctx);
  gl.ctx.clearRect(0, 0, S, S);
  gl.ctx.fillStyle = "#ffffff";
  for (const p of majorXs) gl.ctx.fillRect(cx + p - 1.2, cy - R, 2.4, 2 * R);
  for (const p of majorYs) gl.ctx.fillRect(cx - R, cy + p - 1.2, 2 * R, 2.4);
  gl.ctx.strokeStyle = "#ffffff";
  gl.ctx.lineWidth = 3;
  for (const b of boulevards) {
    gl.ctx.beginPath();
    gl.ctx.moveTo(b.sx - b.dx * R * 1.5, b.sy - b.dy * R * 1.5);
    gl.ctx.lineTo(b.sx + b.dx * R * 1.5, b.sy + b.dy * R * 1.5);
    gl.ctx.stroke();
  }
  gl.ctx.restore();
  fade(gl.ctx);

  const map = new THREE.CanvasTexture(col.c);
  map.colorSpace = THREE.SRGBColorSpace;
  map.minFilter = THREE.LinearFilter;
  const emissiveMap = new THREE.CanvasTexture(gl.c);
  emissiveMap.colorSpace = THREE.SRGBColorSpace;
  emissiveMap.minFilter = THREE.LinearFilter;

  return { map, emissiveMap };
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
    roughness: 0.35,
    metalness: 0.05,
    transparent: true,
    opacity: 0.88,
    emissive: water,
    emissiveIntensity: 0.04,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2;
  return mesh;
}

/* ── smooth water-sheet textures (replace stacked colored discs) ── */
/* coast: horizontal gradient along U — transparent over land (left),
   then shoreline foam → shallow → deep open water; alpha fades at both rims */
function makeSeaSheetTexture(
  shoreHex: string,
  shallowHex: string,
  deepHex: string
): THREE.CanvasTexture {
  const S = 512;
  const c = document.createElement("canvas");
  c.width = S;
  c.height = S;
  const ctx = c.getContext("2d")!;
  const g = ctx.createLinearGradient(0, 0, S, 0);
  // horizontal color ramp: land → shoreline foam → shallow → deep open water
  g.addColorStop(0.0, "#000000");
  g.addColorStop(0.32, "#000000");
  g.addColorStop(0.4, shoreHex);
  g.addColorStop(0.52, shallowHex);
  g.addColorStop(0.72, deepHex);
  g.addColorStop(0.94, deepHex);
  g.addColorStop(1.0, deepHex);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, S, S);
  // bake alpha channel along U
  const ag = ctx.createLinearGradient(0, 0, S, 0);
  ag.addColorStop(0, "rgba(0,0,0,0)");
  ag.addColorStop(0.32, "rgba(0,0,0,0)");
  ag.addColorStop(0.4, "rgba(0,0,0,0.2)");
  ag.addColorStop(0.52, "rgba(0,0,0,0.9)");
  ag.addColorStop(0.72, "rgba(0,0,0,1)");
  ag.addColorStop(0.94, "rgba(0,0,0,1)");
  ag.addColorStop(1, "rgba(0,0,0,0)");
  ctx.globalCompositeOperation = "destination-in";
  ctx.fillStyle = ag;
  ctx.fillRect(0, 0, S, S);
  ctx.globalCompositeOperation = "source-over";
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearFilter;
  return tex;
}

/* marsh: radial lagoon — deep at the middle, murky-shallow + transparent at the rim */
function makeLagoonTexture(deepHex: string, shallowHex: string): THREE.CanvasTexture {
  const S = 512;
  const c = document.createElement("canvas");
  c.width = S;
  c.height = S;
  const ctx = c.getContext("2d")!;
  const r = S * 0.5;
  const g = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, r);
  g.addColorStop(0, deepHex);
  g.addColorStop(0.55, deepHex);
  g.addColorStop(0.8, shallowHex);
  g.addColorStop(0.95, shallowHex);
  g.addColorStop(1, shallowHex);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, S, S);
  // bake alpha: fully opaque core → transparent rim
  const ag = ctx.createRadialGradient(S / 2, S / 2, r * 0.55, S / 2, S / 2, r);
  ag.addColorStop(0, "rgba(0,0,0,1)");
  ag.addColorStop(0.85, "rgba(0,0,0,0.92)");
  ag.addColorStop(1, "rgba(0,0,0,0)");
  ctx.globalCompositeOperation = "destination-in";
  ctx.fillStyle = ag;
  ctx.fillRect(0, 0, S, S);
  ctx.globalCompositeOperation = "source-over";
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearFilter;
  return tex;
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
  const nrm = new THREE.Vector3();
  const c = new THREE.Color();
  // satellite-style palette: forest / grass / dry grass / rock / snow / river
  const snow = new THREE.Color(0xeef3f6);
  const grass = new THREE.Color(0x6a8a44);        // medium grass green
  const forest = new THREE.Color(0x2f4d2f);       // deep dark forest green
  const dryGrass = new THREE.Color(0xa8975a);     // tan / dry grass
  const rock = new THREE.Color(0x6c6356);         // warm grey-brown rock
  const riverWater = new THREE.Color(0x2a6a75);
  /* palette-identity tones — coast & marsh & city take their look from the
     marker's own palette so each world reads as one coherent satellite */
  // coast sea gradient (shoreline foam → shallow → deep) tinted by water/ridge
  const seaShore = blendOf(water, ridge, 0.85);
  const seaShallow = blendOf(water, ridge, 0.5);
  const seaDeep = shadeOf(water, 0.9);
  const landLow = shadeOf(ridge, 0.3);            // low dark soil
  const landHigh = shadeOf(ridge, 0.66);          // higher dry ground
  // marsh lagoon (deep palette water → minty shallow) + hummock vegetation
  const lagoonDeep = water.clone();
  const lagoonShallow = blendOf(water, ridge, 0.5);
  const hummockLo = blendOf(water, ridge, 0.3);
  const hummockHi = blendOf(water, ridge, 0.62);

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

  /* pass 1: base heightmap (river is carved AFTER erosion, so it stays clean) */
  const heights = new Float32Array(pos.count);
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

    heights[i] = disp;
  }

  /* hydraulic erosion — carve dendritic valleys into mountains / plains,
     and soften marsh hummocks + coast gullies (lighter touch) */
  let finalHeights: Float32Array = heights;
  if (
    terrain === "mountains" ||
    terrain === "plains" ||
    terrain === "marsh" ||
    terrain === "coast"
  ) {
    const gentle = terrain === "marsh" || terrain === "coast";
    const iters =
      terrain === "mountains" ? 9000 : terrain === "plains" ? 6000 : terrain === "marsh" ? 2600 : 3600;
    finalHeights = hydraulicErosion(heights, seg + 1, {
      seed,
      iterations: iters,
      inertia: 0.05,
      capacity: gentle ? 2.1 : 2.5,
      minSlope: 0.01,
      erodeRate: gentle ? 0.13 : 0.18,
      depositRate: 0.3,
      evaporation: 0.02,
      gravity: 4.0,
      lifetime: 35,
    });
    // keep the coast silhouette stable after erosion (right side stays below sea level)
    if (terrain === "coast") {
      const waterLevel = -size * 0.08;
      for (let i = 0; i < finalHeights.length; i++) {
        const tilt = pos.getX(i) / half;
        if (tilt > 0.05) {
          const cap = waterLevel + (tilt - 0.05) * size * 0.15;
          if (finalHeights[i] > cap) finalHeights[i] = cap;
        }
      }
    }
  }

  /* pass 2: write (possibly eroded) heights, then carve river on top */
  for (let i = 0; i < pos.count; i++) {
    pos.setZ(i, finalHeights[i]);
  }
  if (cfg.river) {
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const lx = v.x;
      const ly = v.y;
      const disp = pos.getZ(i);
      const cy = riverCenterY(lx, size, seed);
      const distRiver = Math.abs(ly - cy);
      const rim = cfg.river.width * 1.8;
      if (distRiver < rim) {
        const t = THREE.MathUtils.clamp(distRiver / rim, 0, 1);
        const floor = cfg.river.level - size * 0.014; // slightly below the water plane
        const valley = mix(floor, disp, smooth01(t));
        pos.setZ(i, Math.min(disp, valley));
      }
    }
  }

  /* compute normals AFTER all vertices are displaced so the second color pass can use slope */
  plane.computeVertexNormals();
  const normalAttr = plane.attributes.normal as THREE.BufferAttribute;

  /* color by (elevation, slope, moisture) — satellite-style biome mix */
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    nrm.fromBufferAttribute(normalAttr, i);
    const lx = v.x;
    const ly = v.y;
    const r = Math.sqrt(lx * lx + ly * ly);
    const rNorm = r / half;
    const slope = 1 - Math.min(1, Math.abs(nrm.y));           // 0 = flat, 1 = vertical
    const moist = moisture2(lx + ox, ly + oy, seed);           // 0..1
    const heightT = (v.z + Math.abs(cfg.tilt ? size * cfg.tilt : 0)) / Math.max(0.001, cfg.amp + size);
    const hN = THREE.MathUtils.clamp(heightT, 0, 1);

    if (terrain === "mountains") {
      // steep = rock, flat = grass/forest (driven by moisture)
      if (slope > 0.35) {
        c.copy(rock).lerp(ridge, smooth01((slope - 0.35) / 0.5));
      } else {
        c.copy(grass).lerp(forest, smooth01(moist) * 0.85);
        c.lerp(ridge, hN * 0.35); // higher up -> browner
      }
      // snow caps
      if (hN > 0.6) c.lerp(snow, smooth01((hN - 0.6) / 0.32));
    } else if (terrain === "plains") {
      // gentle grass/forest mix with tan low-lying patches
      c.copy(dryGrass).lerp(grass, smooth01(moist) * 0.9 + hN * 0.2);
      c.lerp(forest, Math.max(0, moist - 0.6) * 1.5);
      // lush green corridor hugging the river
      if (cfg.river) {
        const cyr = riverCenterY(lx, size, seed);
        const dRiv = Math.abs(ly - cyr);
        const corr = cfg.river.width * 4.5;
        if (dRiv < corr) c.lerp(grass, smooth01(1 - dRiv / corr) * 0.55);
      }
    } else if (terrain === "marsh") {
      // vegetated hummocks rising from the lagoon; muddy where steep
      c.copy(hummockLo).lerp(hummockHi, smooth01(moist));
      c.lerp(shadeOf(hummockLo, 0.55), slope * 0.6);
    } else if (terrain === "coast") {
      if (v.z < -size * 0.04) c.copy(seaDeep);
      else if (v.z < size * 0.02) {
        const tB = (v.z + size * 0.04) / (size * 0.06);
        c.lerpColors(seaShore, seaShallow, smooth01(tB));
      } else {
        const tt = Math.min(1, (v.z - size * 0.02) / (size * 0.16));
        c.copy(landLow).lerp(landHigh, smooth01(tt));
        c.lerp(ridge, slope * 0.5); // rocky faces catch the ridge light
      }
    } else {
      // city: asphalt ground toned to the world palette
      c.copy(base).lerp(ridge, 0.08);
    }
    // river: tint the submerged channel floor toward water
    if (cfg.river && v.z < cfg.river.level) {
      c.lerp(riverWater, 0.6);
    }

    // edge tint toward plinth dark
    c.lerp(new THREE.Color(0x0a0908), Math.max(0, (rNorm - 0.7) / 0.3) * 0.7);

    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  plane.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.95,
    metalness: 0.0,
    flatShading: cfg.flat,
    emissive: new THREE.Color(0x000000),
    emissiveIntensity: 0.0,
  });
  const terrainMesh = new THREE.Mesh(plane, mat);
  terrainMesh.rotation.x = -Math.PI / 2; // lie flat in XZ
  terrainMesh.castShadow = true;
  terrainMesh.receiveShadow = true;
  g.add(terrainMesh);

  /* winding river (mountains / plains) */
  if (cfg.river) {
    g.add(buildRiverRibbon(size, seed, riverWater, cfg.river.level, cfg.river.width));
  }

  /* water plane for marsh / coast — one smooth palette-tinted sheet */
  if (cfg.water) {
    if (terrain === "marsh") {
      // emerald lagoon: deep palette water, transparent rim; hummocks poke through
      const cx = Math.cos(seed * 6.28) * size * 0.05;
      const cz = Math.sin(seed * 6.28) * size * 0.05;
      const lagoonMat = new THREE.MeshStandardMaterial({
        map: makeLagoonTexture(hexOf(lagoonDeep), hexOf(lagoonShallow)),
        color: 0xffffff,
        roughness: 0.32,
        metalness: 0.0,
        transparent: true,
        depthWrite: false,
      });
      const lagoon = new THREE.Mesh(new THREE.CircleGeometry(size * 0.68, 56), lagoonMat);
      lagoon.rotation.x = -Math.PI / 2;
      lagoon.position.set(cx, size * 0.03, cz);
      g.add(lagoon);
    } else {
      // coast: smooth shoreline → deep-sea gradient (palette-tinted)
      const seaMat = new THREE.MeshStandardMaterial({
        map: makeSeaSheetTexture(hexOf(seaShore), hexOf(seaShallow), hexOf(seaDeep)),
        color: 0xffffff,
        roughness: 0.22,
        metalness: 0.0,
        transparent: true,
        depthWrite: false,
      });
      const sea = new THREE.Mesh(new THREE.CircleGeometry(size * 0.92, 72), seaMat);
      sea.rotation.x = -Math.PI / 2;
      sea.position.set(size * 0.3, -size * 0.052, 0);
      g.add(sea);
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
      rock.castShadow = true;
      rock.receiveShadow = true;
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
      tower.castShadow = true;
      tower.receiveShadow = true;
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

  /* satellite street-grid overlay (floats just above the flat ground) */
  if (terrain === "city") {
    // urban fabric tinted to the world palette (blocks = base→ridge lift, roads = darker base)
    const blockTint = blendOf(base, ridge, 0.34).getHexString();
    const streetTint = shadeOf(base, 0.6).getHexString();
    const { map, emissiveMap } = makeCityTexture(seed, glow, blockTint, streetTint);
    const streetMat = new THREE.MeshStandardMaterial({
      map,
      emissiveMap,
      emissive: glow,
      emissiveIntensity: 0.55,
      roughness: 0.9,
      metalness: 0.0,
      transparent: true,
      depthWrite: false,
    });
    const streets = new THREE.Mesh(
      new THREE.PlaneGeometry(half * 2, half * 2, 1, 1),
      streetMat
    );
    streets.rotation.x = -Math.PI / 2;
    streets.position.y = size * 0.026;
    g.add(streets);
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
  plinth.receiveShadow = true;
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
    renderer.toneMappingExposure = 1.18;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = null;
    // gentle atmospheric haze (low density, scene-matching color so no harsh cutoff)
    scene.fog = new THREE.FogExp2(0x141a26, 0.012);

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

    /* ── lights (Google-Earth-ish sun + sky fill + shadow casting) ── */
    scene.add(new THREE.AmbientLight(0x8a96b0, 0.8));
    scene.add(new THREE.HemisphereLight(0x90a4c8, 0x3a2c20, 1.0));
    const key = new THREE.DirectionalLight(0xfff2df, 1.5);
    key.position.set(3.5, 14, 4.0);   // more overhead → shorter, softer shadows
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.near = 0.5;
    key.shadow.camera.far = 40;
    key.shadow.camera.left = -13;
    key.shadow.camera.right = 13;
    key.shadow.camera.top = 13;
    key.shadow.camera.bottom = -13;
    key.shadow.bias = -0.0006;
    key.shadow.normalBias = 0.06;
    key.shadow.radius = 4.0;          // softer edges
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x6f8aff, 0.42);
    rim.position.set(-7, 3.5, -5);
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
