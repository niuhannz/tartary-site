'use client';

import { useEffect, useRef, useState } from 'react';
import type * as T from 'three';

// ═══════════════════════════════════════════════════════════════
// LEVIATHAN-IX HEAVY BATTLECRUISER
// Technical Illustration — Cross-Hatching on Cream Paper
// ═══════════════════════════════════════════════════════════════

// Cross-hatching vertex shader
const hatchVert = `
varying vec3 vNormal;
varying vec3 vWorldPos;
varying vec2 vScreenPos;
void main() {
  vNormal = normalize(normalMatrix * normal);
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorldPos = wp.xyz;
  vec4 cp = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  vScreenPos = cp.xy / cp.w * 0.5 + 0.5;
  gl_Position = cp;
}`;

// Cross-hatching fragment shader — ink on paper aesthetic
const hatchFrag = `
uniform vec3 lightDir;
uniform float hatchScale;
uniform vec3 inkColor;
uniform vec3 paperColor;
uniform float xrayAlpha;
varying vec3 vNormal;
varying vec3 vWorldPos;
varying vec2 vScreenPos;

float hatchLine(vec2 uv, float angle, float freq, float width) {
  float c = cos(angle), s = sin(angle);
  float v = uv.x * c + uv.y * s;
  return smoothstep(width, width * 0.3, abs(fract(v * freq) - 0.5));
}

void main() {
  float NdotL = dot(normalize(vNormal), normalize(lightDir));
  float shade = NdotL * 0.5 + 0.5;
  shade = 1.0 - shade;

  vec2 sp = vScreenPos * hatchScale;
  float h = 0.0;

  // Layer 1: 45 degrees — lightest shadows
  if (shade > 0.2) h += hatchLine(sp, 0.785, 18.0, 0.38) * min((shade - 0.2) * 2.0, 1.0);
  // Layer 2: -45 degrees — medium shadows (cross-hatch)
  if (shade > 0.4) h += hatchLine(sp, -0.785, 20.0, 0.35) * min((shade - 0.4) * 2.5, 1.0);
  // Layer 3: horizontal — darker areas
  if (shade > 0.55) h += hatchLine(sp, 0.0, 22.0, 0.32) * min((shade - 0.55) * 3.0, 1.0);
  // Layer 4: vertical — deepest shadow
  if (shade > 0.7) h += hatchLine(sp, 1.5708, 24.0, 0.30) * min((shade - 0.7) * 4.0, 1.0);

  h = clamp(h, 0.0, 1.0) * 0.85;
  vec3 col = mix(paperColor, inkColor, h);
  gl_FragColor = vec4(col, xrayAlpha);
}`;

export default function MechExploded() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    let cleanup: (() => void) | null = null;

    (async () => {
      const THREE = await import('three');
      const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js');

      // RENDERER — cream paper
      const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0xf0ebe0);
      container.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xf0ebe0);

      // CAMERA
      const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 300);
      camera.position.set(18, 12, 18);

      // CONTROLS
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.target.set(0, 0, 0);
      controls.minDistance = 6;
      controls.maxDistance = 60;

      // LIGHTING — directional for shader
      const lightDir = new THREE.Vector3(1.0, 1.5, 0.8).normalize();

      // Shared shader uniforms
      const sharedUniforms = {
        lightDir: { value: lightDir },
        hatchScale: { value: 8.0 },
        inkColor: { value: new THREE.Color(0x1a1a18) },
        paperColor: { value: new THREE.Color(0xf0ebe0) },
        xrayAlpha: { value: 1.0 },
      };

      // Cross-hatch material factory
      function hatchMat(tint?: number): T.ShaderMaterial {
        const u = {
          lightDir: sharedUniforms.lightDir,
          hatchScale: sharedUniforms.hatchScale,
          inkColor: tint !== undefined
            ? { value: new THREE.Color(tint) }
            : sharedUniforms.inkColor,
          paperColor: sharedUniforms.paperColor,
          xrayAlpha: sharedUniforms.xrayAlpha,
        };
        return new THREE.ShaderMaterial({
          vertexShader: hatchVert,
          fragmentShader: hatchFrag,
          uniforms: u,
          transparent: true,
          side: THREE.FrontSide,
        });
      }

      // Materials
      const matHull = hatchMat();
      const matDark = hatchMat(0x0d0d0c);
      const matAccent = hatchMat(0x2a2820);

      // Edge line material — dark ink
      const edgeMat = new THREE.LineBasicMaterial({ color: 0x1a1a18, transparent: true, opacity: 0.5 });
      const edgeMatStrong = new THREE.LineBasicMaterial({ color: 0x1a1a18, transparent: true, opacity: 0.85 });

      // ═══════════════════════════════════════════════════════════════
      // GEOMETRY CACHE
      // ═══════════════════════════════════════════════════════════════
      const _gc: Record<string, T.BufferGeometry> = {};
      function G(type: string, ...args: number[]): T.BufferGeometry {
        const k = type + args.join(',');
        if (!_gc[k]) {
          if (type === 'box') _gc[k] = new THREE.BoxGeometry(args[0], args[1], args[2]);
          else if (type === 'cyl') _gc[k] = new THREE.CylinderGeometry(args[0], args[1], args[2], args[3] || 16);
          else if (type === 'sphere') _gc[k] = new THREE.SphereGeometry(args[0], args[1] || 16, args[2] || 12);
          else if (type === 'cone') _gc[k] = new THREE.ConeGeometry(args[0], args[1], args[2] || 16);
          else if (type === 'oct') _gc[k] = new THREE.OctahedronGeometry(args[0], args[1] || 0);
          else if (type === 'torus') _gc[k] = new THREE.TorusGeometry(args[0], args[1], args[2] || 8, args[3] || 24);
        }
        return _gc[k];
      }

      // ═══════════════════════════════════════════════════════════════
      // PART SYSTEM
      // ═══════════════════════════════════════════════════════════════
      interface Part {
        group: T.Group;
        name: string;
        origin: T.Vector3;
        explodeDir: T.Vector3;
        explodeDist: number;
      }
      const parts: Part[] = [];

      function addPart(
        name: string, origin: T.Vector3, explodeDir: T.Vector3, explodeDist: number,
        buildFn: (g: T.Group) => void
      ) {
        const group = new THREE.Group();
        group.position.copy(origin);
        buildFn(group);
        // Add ink edge lines to every mesh
        const edgesArr: T.LineSegments[] = [];
        group.traverse((child) => {
          if ((child as T.Mesh).isMesh) {
            const mesh = child as T.Mesh;
            const edges = new THREE.EdgesGeometry(mesh.geometry, 15);
            const line = new THREE.LineSegments(edges, edgeMat.clone());
            line.position.copy(mesh.position);
            line.rotation.copy(mesh.rotation);
            line.scale.copy(mesh.scale);
            line.userData.isEdge = true;
            group.add(line);
            edgesArr.push(line);
          }
        });
        scene.add(group);
        parts.push({ group, name, origin: origin.clone(), explodeDir: explodeDir.clone().normalize(), explodeDist });
      }

      // Mesh helper
      function m(g: T.Group, geo: T.BufferGeometry, mat: T.Material, pos?: number[], rot?: number[], scl?: number | number[]): T.Mesh {
        const mesh = new THREE.Mesh(geo, mat);
        if (pos) mesh.position.set(pos[0], pos[1], pos[2]);
        if (rot) mesh.rotation.set(rot[0], rot[1], rot[2]);
        if (scl) { if (typeof scl === 'number') mesh.scale.setScalar(scl); else mesh.scale.set(scl[0], scl[1], scl[2]); }
        g.add(mesh);
        return mesh;
      }

      // Seeded random for deterministic greebling
      let _seed = 42;
      function srand() { _seed = (_seed * 16807 + 0) % 2147483647; return (_seed - 1) / 2147483646; }
      function srandRange(a: number, b: number) { return a + srand() * (b - a); }

      // Greeble helper — add small detail boxes to a surface
      function greeble(g: T.Group, mat: T.Material, cx: number, cy: number, cz: number, w: number, h: number, d: number, count: number, sizeMin: number, sizeMax: number) {
        for (let i = 0; i < count; i++) {
          const sx = srandRange(sizeMin, sizeMax);
          const sy = srandRange(sizeMin, sizeMax) * 0.5;
          const sz = srandRange(sizeMin, sizeMax);
          const px = cx + srandRange(-w/2, w/2);
          const py = cy + srandRange(-h/2, h/2);
          const pz = cz + srandRange(-d/2, d/2);
          m(g, G('box', sx, sy, sz), mat, [px, py, pz]);
        }
      }

      // Panel line helper — thin dark strips
      function panelLines(g: T.Group, axis: 'x' | 'y' | 'z', pos: number[], count: number, spacing: number, length: number, width: number) {
        for (let i = 0; i < count; i++) {
          const offset = (i - (count - 1) / 2) * spacing;
          const p = [...pos];
          if (axis === 'x') { p[0] += offset; m(g, G('box', width, 0.01, length), matDark, p); }
          else if (axis === 'y') { p[1] += offset; m(g, G('box', length, width, 0.01), matDark, p); }
          else { p[2] += offset; m(g, G('box', length, 0.01, width), matDark, p); }
        }
      }

      // ═══════════════════════════════════════════════════════════════
      // ENGINEERING DRAWING GRID — faint concentric circles + radials
      // ═══════════════════════════════════════════════════════════════
      const gridGroup = new THREE.Group();
      const gridMat = new THREE.LineBasicMaterial({ color: 0xc0b8a8, transparent: true, opacity: 0.25 });
      // Concentric circles
      for (let r = 3; r <= 24; r += 3) {
        const pts: T.Vector3[] = [];
        for (let a = 0; a <= 64; a++) {
          const th = (a / 64) * Math.PI * 2;
          pts.push(new THREE.Vector3(Math.cos(th) * r, -0.01, Math.sin(th) * r));
        }
        const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
        gridGroup.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(
          pts.reduce((acc: T.Vector3[], p, i) => { if (i > 0) { acc.push(pts[i-1], p); } return acc; }, [])
        ), gridMat));
      }
      // Radial lines
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        const pts = [new THREE.Vector3(0, -0.01, 0), new THREE.Vector3(Math.cos(a) * 24, -0.01, Math.sin(a) * 24)];
        gridGroup.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pts), gridMat));
      }
      scene.add(gridGroup);

      // ═══════════════════════════════════════════════════════════════
      // BUILD LEVIATHAN-IX — 25+ Component Groups
      // Ship oriented along Z axis (nose = +Z, engines = -Z)
      // ═══════════════════════════════════════════════════════════════

      // ── 1. MAIN HULL — CENTRAL FUSELAGE ──
      addPart('MAIN HULL — CENTRAL FUSELAGE', new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0), 0, (g) => {
        // Primary hull — elongated octagonal cross-section
        m(g, G('box', 2.0, 1.2, 8.0), matHull, [0, 0, 0]);
        // Chamfered top/bottom hull panels
        m(g, G('box', 1.6, 0.15, 7.5), matHull, [0, 0.68, 0]);
        m(g, G('box', 1.6, 0.15, 7.5), matHull, [0, -0.68, 0]);
        // Side hull thickening
        m(g, G('box', 0.15, 0.9, 7.5), matHull, [1.05, 0, 0]);
        m(g, G('box', 0.15, 0.9, 7.5), matHull, [-1.05, 0, 0]);
        // Spine ridge (dorsal)
        m(g, G('box', 0.3, 0.2, 6.5), matAccent, [0, 0.82, 0]);
        // Ventral keel
        m(g, G('box', 0.4, 0.15, 5.0), matAccent, [0, -0.78, 0.5]);
        // Hull panel lines — horizontal
        panelLines(g, 'z', [0, 0.76, 0], 5, 1.2, 0.02, 7.0);
        panelLines(g, 'z', [0, -0.76, 0], 5, 1.2, 0.02, 7.0);
        // Hull panel lines — side
        panelLines(g, 'y', [1.08, 0, 0], 6, 1.1, 0.02, 0.8);
        panelLines(g, 'y', [-1.08, 0, 0], 6, 1.1, 0.02, 0.8);
        // Surface greebles — dorsal
        greeble(g, matDark, 0, 0.82, 0, 1.2, 0.01, 5.5, 25, 0.04, 0.15);
        // Surface greebles — port/starboard
        greeble(g, matDark, 1.05, 0, 0, 0.01, 0.7, 5.5, 18, 0.03, 0.12);
        greeble(g, matDark, -1.05, 0, 0, 0.01, 0.7, 5.5, 18, 0.03, 0.12);
        // Rivet rows along panel seams
        for (let z = -3; z <= 3; z += 0.4) {
          m(g, G('sphere', 0.015, 4, 3), matDark, [0.95, 0.45, z]);
          m(g, G('sphere', 0.015, 4, 3), matDark, [-0.95, 0.45, z]);
        }
      });

      // ── 2. PROW — FORWARD HULL ──
      addPart('PROW — FORWARD HULL SECTION', new THREE.Vector3(0, 0, 5.5), new THREE.Vector3(0, 0, 2), 4, (g) => {
        // Tapered nose cone
        m(g, G('box', 1.6, 0.9, 2.5), matHull, [0, 0, 0]);
        m(g, G('box', 1.2, 0.7, 1.5), matHull, [0, 0, 1.5]);
        m(g, G('box', 0.6, 0.4, 1.0), matHull, [0, 0, 2.6]);
        m(g, G('cone', 0.25, 1.2, 8), matHull, [0, 0, 3.5], [Math.PI/2, 0, 0]);
        // Nose sensor array
        m(g, G('cyl', 0.08, 0.08, 0.6, 8), matDark, [0, 0, 4.1], [Math.PI/2, 0, 0]);
        m(g, G('sphere', 0.06, 6, 4), matAccent, [0, 0, 4.4]);
        // Forward viewport slits
        for (let i = -2; i <= 2; i++) {
          m(g, G('box', 0.08, 0.03, 0.35), matDark, [i * 0.25, 0.46, 1.0]);
        }
        // Armored shutters
        m(g, G('box', 1.0, 0.08, 0.4), matAccent, [0, 0.5, 0.5]);
        m(g, G('box', 0.8, 0.08, 0.3), matAccent, [0, 0.38, 1.6]);
        // Prow detail greebles
        greeble(g, matDark, 0, 0.46, 0, 1.0, 0.01, 2.0, 15, 0.03, 0.1);
        greeble(g, matDark, 0, -0.46, 0, 1.0, 0.01, 2.0, 12, 0.03, 0.08);
        // Chin sensor pods
        m(g, G('cyl', 0.1, 0.08, 0.4, 8), matDark, [0.3, -0.5, 1.5], [Math.PI/2, 0, 0]);
        m(g, G('cyl', 0.1, 0.08, 0.4, 8), matDark, [-0.3, -0.5, 1.5], [Math.PI/2, 0, 0]);
      });

      // ── 3. STERN — AFT HULL ──
      addPart('STERN — AFT HULL SECTION', new THREE.Vector3(0, 0, -5.5), new THREE.Vector3(0, 0, -2), 4, (g) => {
        m(g, G('box', 1.8, 1.0, 2.5), matHull, [0, 0, 0]);
        // Engine mounting plate
        m(g, G('box', 2.2, 1.4, 0.3), matAccent, [0, 0, -1.3]);
        // Exhaust shroud
        m(g, G('box', 1.5, 0.8, 0.5), matDark, [0, 0, -1.5]);
        // Coolant manifold
        for (let i = 0; i < 4; i++) {
          m(g, G('cyl', 0.06, 0.06, 1.8, 8), matDark, [srandRange(-0.6, 0.6), srandRange(-0.3, 0.3), 0.3]);
        }
        // Stern greebles
        greeble(g, matDark, 0, 0, 0, 1.4, 0.8, 2.0, 20, 0.03, 0.1);
        // Aft running lights
        m(g, G('sphere', 0.04, 6, 4), matDark, [0.7, 0.4, -1.3]);
        m(g, G('sphere', 0.04, 6, 4), matDark, [-0.7, 0.4, -1.3]);
      });

      // ── 4. BRIDGE TOWER ──
      addPart('BRIDGE — COMMAND TOWER', new THREE.Vector3(0, 1.2, 1.5), new THREE.Vector3(0, 2, 0.5), 4.5, (g) => {
        // Main bridge structure
        m(g, G('box', 1.2, 0.8, 1.5), matHull, [0, 0, 0]);
        m(g, G('box', 1.0, 0.4, 1.2), matHull, [0, 0.55, 0]);
        m(g, G('box', 0.7, 0.25, 0.8), matHull, [0, 0.9, 0.1]);
        // Viewport windows — horizontal slits
        for (let i = -3; i <= 3; i++) {
          m(g, G('box', 0.12, 0.02, 0.04), matDark, [i * 0.13, 0.72, 0.62]);
        }
        // Sensor mast
        m(g, G('cyl', 0.04, 0.03, 0.8, 6), matDark, [0, 1.3, 0]);
        m(g, G('sphere', 0.06, 6, 4), matAccent, [0, 1.72, 0]);
        // Antenna array
        m(g, G('cyl', 0.015, 0.015, 0.5, 4), matDark, [0.3, 1.15, -0.2]);
        m(g, G('cyl', 0.015, 0.015, 0.4, 4), matDark, [-0.25, 1.1, -0.1]);
        m(g, G('cyl', 0.015, 0.015, 0.6, 4), matDark, [0, 1.3, -0.4], [0.3, 0, 0]);
        // Bridge greebles
        greeble(g, matDark, 0, 0.5, 0, 0.9, 0.01, 1.2, 12, 0.02, 0.08);
        // Comms dish
        m(g, G('sphere', 0.15, 8, 6), matHull, [0.5, 0.9, -0.3], [0, 0, 0], [1, 0.3, 1]);
        m(g, G('cyl', 0.015, 0.015, 0.2, 4), matDark, [0.5, 1.05, -0.3]);
      });

      // ── 5. PORT ENGINE NACELLE ──
      addPart('PORT ENGINE — PRIMARY NACELLE', new THREE.Vector3(-2.5, -0.2, -3.0), new THREE.Vector3(-2.5, -0.5, -1.5), 5, (g) => {
        // Engine body
        m(g, G('cyl', 0.6, 0.5, 3.5, 12), matHull, [0, 0, 0], [Math.PI/2, 0, 0]);
        // Intake cowling
        m(g, G('cyl', 0.7, 0.65, 0.4, 12), matAccent, [0, 0, 1.6], [Math.PI/2, 0, 0]);
        // Exhaust bell
        m(g, G('cyl', 0.5, 0.7, 0.8, 12), matDark, [0, 0, -2.0], [Math.PI/2, 0, 0]);
        m(g, G('cyl', 0.45, 0.45, 0.1, 12), matAccent, [0, 0, -2.4], [Math.PI/2, 0, 0]);
        // Cooling fins
        for (let i = 0; i < 8; i++) {
          const a = (i / 8) * Math.PI * 2;
          m(g, G('box', 0.02, 0.12, 1.5), matDark, [Math.cos(a) * 0.55, Math.sin(a) * 0.55, -0.5], [0, 0, a]);
        }
        // Fuel lines
        m(g, G('cyl', 0.03, 0.03, 2.0, 6), matDark, [0.4, 0.3, 0], [Math.PI/2, 0, 0]);
        m(g, G('cyl', 0.03, 0.03, 2.0, 6), matDark, [-0.4, 0.3, 0], [Math.PI/2, 0, 0]);
        // Mounting pylon connection
        m(g, G('box', 0.8, 0.15, 0.6), matHull, [0.8, 0.3, 0.5]);
        greeble(g, matDark, 0, 0.5, 0, 0.6, 0.01, 2.5, 15, 0.02, 0.08);
      });

      // ── 6. STARBOARD ENGINE NACELLE ──
      addPart('STARBOARD ENGINE — PRIMARY NACELLE', new THREE.Vector3(2.5, -0.2, -3.0), new THREE.Vector3(2.5, -0.5, -1.5), 5, (g) => {
        m(g, G('cyl', 0.6, 0.5, 3.5, 12), matHull, [0, 0, 0], [Math.PI/2, 0, 0]);
        m(g, G('cyl', 0.7, 0.65, 0.4, 12), matAccent, [0, 0, 1.6], [Math.PI/2, 0, 0]);
        m(g, G('cyl', 0.5, 0.7, 0.8, 12), matDark, [0, 0, -2.0], [Math.PI/2, 0, 0]);
        m(g, G('cyl', 0.45, 0.45, 0.1, 12), matAccent, [0, 0, -2.4], [Math.PI/2, 0, 0]);
        for (let i = 0; i < 8; i++) {
          const a = (i / 8) * Math.PI * 2;
          m(g, G('box', 0.02, 0.12, 1.5), matDark, [Math.cos(a) * 0.55, Math.sin(a) * 0.55, -0.5], [0, 0, a]);
        }
        m(g, G('cyl', 0.03, 0.03, 2.0, 6), matDark, [0.4, 0.3, 0], [Math.PI/2, 0, 0]);
        m(g, G('cyl', 0.03, 0.03, 2.0, 6), matDark, [-0.4, 0.3, 0], [Math.PI/2, 0, 0]);
        m(g, G('box', 0.8, 0.15, 0.6), matHull, [-0.8, 0.3, 0.5]);
        greeble(g, matDark, 0, 0.5, 0, 0.6, 0.01, 2.5, 15, 0.02, 0.08);
      });

      // ── 7. PORT ENGINE PYLON ──
      addPart('PORT PYLON — ENGINE STRUT', new THREE.Vector3(-1.5, 0, -2.0), new THREE.Vector3(-1.5, -0.3, -0.8), 3, (g) => {
        m(g, G('box', 1.2, 0.2, 2.0), matHull, [0, 0, 0]);
        m(g, G('box', 1.0, 0.08, 1.8), matAccent, [0, 0.12, 0]);
        m(g, G('box', 0.08, 0.18, 1.6), matDark, [0.35, 0, 0]);
        m(g, G('box', 0.08, 0.18, 1.6), matDark, [-0.35, 0, 0]);
        greeble(g, matDark, 0, 0.12, 0, 0.9, 0.01, 1.5, 10, 0.02, 0.06);
        // Fuel conduits
        m(g, G('cyl', 0.025, 0.025, 1.8, 6), matDark, [0.5, -0.05, 0], [0, 0, 0]);
      });

      // ── 8. STARBOARD ENGINE PYLON ──
      addPart('STARBOARD PYLON — ENGINE STRUT', new THREE.Vector3(1.5, 0, -2.0), new THREE.Vector3(1.5, -0.3, -0.8), 3, (g) => {
        m(g, G('box', 1.2, 0.2, 2.0), matHull, [0, 0, 0]);
        m(g, G('box', 1.0, 0.08, 1.8), matAccent, [0, 0.12, 0]);
        m(g, G('box', 0.08, 0.18, 1.6), matDark, [0.35, 0, 0]);
        m(g, G('box', 0.08, 0.18, 1.6), matDark, [-0.35, 0, 0]);
        greeble(g, matDark, 0, 0.12, 0, 0.9, 0.01, 1.5, 10, 0.02, 0.06);
        m(g, G('cyl', 0.025, 0.025, 1.8, 6), matDark, [-0.5, -0.05, 0]);
      });

      // ── 9. DORSAL WEAPONS PLATFORM ──
      addPart('DORSAL — WEAPONS BATTERY', new THREE.Vector3(0, 1.0, -1.0), new THREE.Vector3(0, 2.5, 0), 4, (g) => {
        // Turret base
        m(g, G('cyl', 0.5, 0.6, 0.3, 12), matHull, [0, 0, 0]);
        // Turret housing
        m(g, G('box', 0.8, 0.4, 0.8), matHull, [0, 0.3, 0]);
        // Twin barrels
        m(g, G('cyl', 0.06, 0.05, 2.0, 8), matDark, [0.15, 0.35, 1.2], [Math.PI/2, 0, 0]);
        m(g, G('cyl', 0.06, 0.05, 2.0, 8), matDark, [-0.15, 0.35, 1.2], [Math.PI/2, 0, 0]);
        // Barrel shroud
        m(g, G('box', 0.5, 0.12, 0.4), matAccent, [0, 0.35, 0.5]);
        // Targeting optics
        m(g, G('sphere', 0.05, 6, 4), matDark, [0, 0.55, 0.25]);
        m(g, G('cyl', 0.02, 0.02, 0.15, 4), matDark, [0.35, 0.35, 0.2], [0, 0, Math.PI/2]);
        greeble(g, matDark, 0, 0.52, 0, 0.6, 0.01, 0.6, 8, 0.02, 0.06);
      });

      // ── 10. VENTRAL TORPEDO BAY ──
      addPart('VENTRAL — TORPEDO LAUNCH BAY', new THREE.Vector3(0, -0.9, 0.5), new THREE.Vector3(0, -2.5, 0), 4, (g) => {
        m(g, G('box', 1.4, 0.4, 2.0), matHull, [0, 0, 0]);
        // Torpedo tubes (6)
        for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) {
          m(g, G('cyl', 0.08, 0.08, 0.5, 8), matDark, [-0.3 + c * 0.3, -0.1 + r * 0.2, 1.1], [Math.PI/2, 0, 0]);
        }
        // Bay doors
        m(g, G('box', 1.2, 0.04, 0.8), matAccent, [0, -0.22, 0.6]);
        m(g, G('box', 1.2, 0.04, 0.8), matAccent, [0, -0.22, -0.2]);
        greeble(g, matDark, 0, -0.22, 0, 1.1, 0.01, 1.6, 12, 0.02, 0.07);
      });

      // ── 11. PORT WING ──
      addPart('PORT WING — WEAPON HARDPOINTS', new THREE.Vector3(-2.0, 0.1, 0), new THREE.Vector3(-3, 0, 0), 4.5, (g) => {
        // Wing spar
        m(g, G('box', 2.0, 0.12, 2.5), matHull, [0, 0, 0]);
        m(g, G('box', 1.8, 0.06, 2.3), matAccent, [0, 0.08, 0]);
        // Wing tip
        m(g, G('box', 0.5, 0.08, 1.5), matHull, [-0.9, 0, 0.3]);
        // Leading edge
        m(g, G('box', 1.8, 0.05, 0.1), matDark, [0, 0, 1.28]);
        // Weapon pylons
        m(g, G('box', 0.1, 0.25, 0.3), matDark, [-0.5, -0.15, 0.5]);
        m(g, G('box', 0.1, 0.25, 0.3), matDark, [0.3, -0.15, 0.5]);
        // Wing surface greebles
        greeble(g, matDark, -0.3, 0.08, 0, 1.5, 0.01, 2.0, 18, 0.02, 0.08);
        // Navigation light
        m(g, G('sphere', 0.03, 4, 3), matDark, [-1.0, 0.08, 1.0]);
      });

      // ── 12. STARBOARD WING ──
      addPart('STARBOARD WING — WEAPON HARDPOINTS', new THREE.Vector3(2.0, 0.1, 0), new THREE.Vector3(3, 0, 0), 4.5, (g) => {
        m(g, G('box', 2.0, 0.12, 2.5), matHull, [0, 0, 0]);
        m(g, G('box', 1.8, 0.06, 2.3), matAccent, [0, 0.08, 0]);
        m(g, G('box', 0.5, 0.08, 1.5), matHull, [0.9, 0, 0.3]);
        m(g, G('box', 1.8, 0.05, 0.1), matDark, [0, 0, 1.28]);
        m(g, G('box', 0.1, 0.25, 0.3), matDark, [0.5, -0.15, 0.5]);
        m(g, G('box', 0.1, 0.25, 0.3), matDark, [-0.3, -0.15, 0.5]);
        greeble(g, matDark, 0.3, 0.08, 0, 1.5, 0.01, 2.0, 18, 0.02, 0.08);
        m(g, G('sphere', 0.03, 4, 3), matDark, [1.0, 0.08, 1.0]);
      });

      // ── 13. PORT FORWARD CANNON ──
      addPart('PORT CANNON — HEAVY RAILGUN', new THREE.Vector3(-1.2, -0.3, 3.0), new THREE.Vector3(-1.5, -0.5, 2), 4, (g) => {
        // Barrel housing
        m(g, G('cyl', 0.12, 0.08, 3.0, 10), matHull, [0, 0, 0], [Math.PI/2, 0, 0]);
        // Coil accelerators
        for (let i = 0; i < 6; i++) {
          m(g, G('torus', 0.14, 0.02, 6, 12), matAccent, [0, 0, -1.0 + i * 0.4], [Math.PI/2, 0, 0]);
        }
        // Muzzle brake
        m(g, G('cyl', 0.15, 0.12, 0.2, 8), matDark, [0, 0, 1.6], [Math.PI/2, 0, 0]);
        // Mounting bracket
        m(g, G('box', 0.3, 0.2, 0.4), matAccent, [0, 0.15, -1.2]);
        // Power cable
        m(g, G('cyl', 0.02, 0.02, 2.5, 6), matDark, [0.1, 0.12, 0], [Math.PI/2, 0, 0]);
      });

      // ── 14. STARBOARD FORWARD CANNON ──
      addPart('STARBOARD CANNON — HEAVY RAILGUN', new THREE.Vector3(1.2, -0.3, 3.0), new THREE.Vector3(1.5, -0.5, 2), 4, (g) => {
        m(g, G('cyl', 0.12, 0.08, 3.0, 10), matHull, [0, 0, 0], [Math.PI/2, 0, 0]);
        for (let i = 0; i < 6; i++) {
          m(g, G('torus', 0.14, 0.02, 6, 12), matAccent, [0, 0, -1.0 + i * 0.4], [Math.PI/2, 0, 0]);
        }
        m(g, G('cyl', 0.15, 0.12, 0.2, 8), matDark, [0, 0, 1.6], [Math.PI/2, 0, 0]);
        m(g, G('box', 0.3, 0.2, 0.4), matAccent, [0, 0.15, -1.2]);
        m(g, G('cyl', 0.02, 0.02, 2.5, 6), matDark, [-0.1, 0.12, 0], [Math.PI/2, 0, 0]);
      });

      // ── 15. DORSAL FIN ──
      addPart('DORSAL FIN — SENSOR ARRAY', new THREE.Vector3(0, 1.5, -2.5), new THREE.Vector3(0, 2.5, -0.5), 3.5, (g) => {
        // Fin body — tall wedge
        m(g, G('box', 0.08, 1.5, 1.8), matHull, [0, 0, 0]);
        m(g, G('box', 0.06, 1.2, 1.5), matAccent, [0, 0.2, 0]);
        // Sensor strips
        for (let i = 0; i < 4; i++) {
          m(g, G('box', 0.1, 0.03, 0.3), matDark, [0, -0.4 + i * 0.4, 0.7]);
        }
        // Tip light
        m(g, G('sphere', 0.04, 6, 4), matDark, [0, 0.78, 0]);
        greeble(g, matDark, 0, 0, 0, 0.01, 1.2, 1.5, 10, 0.02, 0.06);
      });

      // ── 16. VENTRAL FIN ──
      addPart('VENTRAL FIN — STABILIZER', new THREE.Vector3(0, -1.2, -3.0), new THREE.Vector3(0, -2.5, -0.5), 3, (g) => {
        m(g, G('box', 0.06, 0.8, 1.2), matHull, [0, 0, 0]);
        m(g, G('box', 0.05, 0.6, 1.0), matAccent, [0, -0.12, 0]);
        m(g, G('sphere', 0.03, 4, 3), matDark, [0, -0.42, 0.5]);
        greeble(g, matDark, 0, -0.12, 0, 0.01, 0.5, 0.8, 6, 0.02, 0.05);
      });

      // ── 17. REACTOR MODULE ──
      addPart('REACTOR — FUSION CORE MODULE', new THREE.Vector3(0, 0, -2.5), new THREE.Vector3(0, 0, -2), 4.5, (g) => {
        // Reactor housing
        m(g, G('cyl', 0.5, 0.5, 1.2, 12), matHull, [0, 0, 0]);
        // Shielding rings
        for (let i = 0; i < 4; i++) {
          m(g, G('torus', 0.55, 0.03, 8, 16), matAccent, [0, -0.4 + i * 0.25, 0]);
        }
        // Coolant pipes
        for (let a = 0; a < 4; a++) {
          const th = (a / 4) * Math.PI * 2 + 0.4;
          m(g, G('cyl', 0.035, 0.035, 1.4, 6), matDark, [Math.cos(th) * 0.6, 0, Math.sin(th) * 0.6]);
        }
        // Warning markings
        for (let i = 0; i < 3; i++) {
          m(g, G('box', 0.08, 0.02, 0.08), matDark, [0, 0.62, -0.2 + i * 0.2]);
        }
        greeble(g, matDark, 0, 0, 0, 0.8, 0.8, 0.01, 10, 0.03, 0.08);
      });

      // ── 18. PORT MISSILE POD ──
      addPart('PORT MISSILES — LAUNCH CLUSTER', new THREE.Vector3(-1.8, 0.6, -0.5), new THREE.Vector3(-2, 1.5, 0), 3.5, (g) => {
        m(g, G('box', 0.6, 0.5, 1.0), matHull, [0, 0, 0]);
        // Missile tubes — 3x2
        for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) {
          m(g, G('cyl', 0.06, 0.06, 0.6, 8), matDark, [-0.15 + c * 0.15, -0.1 + r * 0.2, 0.6], [Math.PI/2, 0, 0]);
        }
        m(g, G('box', 0.5, 0.08, 0.9), matAccent, [0, 0.28, 0]);
        greeble(g, matDark, 0, 0.28, 0, 0.4, 0.01, 0.8, 6, 0.02, 0.05);
      });

      // ── 19. STARBOARD MISSILE POD ──
      addPart('STARBOARD MISSILES — LAUNCH CLUSTER', new THREE.Vector3(1.8, 0.6, -0.5), new THREE.Vector3(2, 1.5, 0), 3.5, (g) => {
        m(g, G('box', 0.6, 0.5, 1.0), matHull, [0, 0, 0]);
        for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) {
          m(g, G('cyl', 0.06, 0.06, 0.6, 8), matDark, [-0.15 + c * 0.15, -0.1 + r * 0.2, 0.6], [Math.PI/2, 0, 0]);
        }
        m(g, G('box', 0.5, 0.08, 0.9), matAccent, [0, 0.28, 0]);
        greeble(g, matDark, 0, 0.28, 0, 0.4, 0.01, 0.8, 6, 0.02, 0.05);
      });

      // ── 20. SHIELD GENERATOR ──
      addPart('SHIELD — DEFLECTOR GENERATOR', new THREE.Vector3(0, 0.8, 3.5), new THREE.Vector3(0, 1.5, 2), 3, (g) => {
        // Dish
        m(g, G('sphere', 0.4, 12, 8), matHull, [0, 0, 0], [0, 0, 0], [1.2, 0.4, 1.2]);
        // Emitter core
        m(g, G('sphere', 0.12, 8, 6), matAccent, [0, 0.15, 0]);
        // Support strut
        m(g, G('cyl', 0.04, 0.04, 0.5, 6), matDark, [0, -0.3, 0]);
        // Ring
        m(g, G('torus', 0.35, 0.02, 8, 16), matDark, [0, 0, 0], [Math.PI/2, 0, 0]);
        greeble(g, matDark, 0, 0, 0, 0.6, 0.2, 0.01, 6, 0.02, 0.05);
      });

      // ── 21. COMM ANTENNA ARRAY ──
      addPart('COMMS — ANTENNA ARRAY', new THREE.Vector3(0.8, 1.3, -1.5), new THREE.Vector3(1.5, 2.5, -0.5), 3, (g) => {
        // Main dish
        m(g, G('sphere', 0.3, 10, 8), matHull, [0, 0, 0], [0, 0, 0], [1, 0.3, 1]);
        m(g, G('cyl', 0.02, 0.02, 0.25, 4), matDark, [0, 0.12, 0]);
        m(g, G('sphere', 0.03, 4, 3), matAccent, [0, 0.25, 0]);
        // Sub-array rods
        m(g, G('cyl', 0.015, 0.015, 0.4, 4), matDark, [0.15, 0, 0.15], [0.3, 0, 0]);
        m(g, G('cyl', 0.015, 0.015, 0.35, 4), matDark, [-0.15, 0, 0.1], [-0.2, 0, 0]);
        // Mount
        m(g, G('box', 0.15, 0.08, 0.15), matAccent, [0, -0.18, 0]);
      });

      // ── 22. HANGAR BAY ──
      addPart('HANGAR — FLIGHT DECK', new THREE.Vector3(0, -0.5, 2.5), new THREE.Vector3(0, -2, 1.5), 3.5, (g) => {
        m(g, G('box', 1.6, 0.5, 1.5), matHull, [0, 0, 0]);
        // Bay opening
        m(g, G('box', 1.0, 0.35, 0.05), matDark, [0, -0.05, 0.77]);
        // Internal detail
        m(g, G('box', 0.9, 0.3, 1.2), matDark, [0, 0, 0]);
        // Landing guides
        for (let i = 0; i < 4; i++) {
          m(g, G('box', 0.02, 0.01, 1.2), matAccent, [-0.3 + i * 0.2, -0.25, 0]);
        }
        greeble(g, matDark, 0, 0.26, 0, 1.2, 0.01, 1.2, 10, 0.02, 0.06);
      });

      // ── 23. PORT POINT-DEFENSE ──
      addPart('PORT PD — CLOSE-IN WEAPON SYSTEM', new THREE.Vector3(-1.3, 0.5, 2.0), new THREE.Vector3(-1.8, 1, 1), 2.5, (g) => {
        m(g, G('cyl', 0.15, 0.18, 0.2, 8), matHull, [0, 0, 0]);
        m(g, G('box', 0.25, 0.15, 0.25), matAccent, [0, 0.12, 0]);
        // Gatling barrels
        for (let i = 0; i < 4; i++) {
          const a = (i / 4) * Math.PI * 2;
          m(g, G('cyl', 0.015, 0.015, 0.6, 4), matDark, [Math.cos(a) * 0.06, 0.12, 0.4 + Math.sin(a) * 0.06], [Math.PI/2, 0, 0]);
        }
        m(g, G('sphere', 0.03, 4, 3), matDark, [0.12, 0.18, 0.05]);
      });

      // ── 24. STARBOARD POINT-DEFENSE ──
      addPart('STARBOARD PD — CLOSE-IN WEAPON SYSTEM', new THREE.Vector3(1.3, 0.5, 2.0), new THREE.Vector3(1.8, 1, 1), 2.5, (g) => {
        m(g, G('cyl', 0.15, 0.18, 0.2, 8), matHull, [0, 0, 0]);
        m(g, G('box', 0.25, 0.15, 0.25), matAccent, [0, 0.12, 0]);
        for (let i = 0; i < 4; i++) {
          const a = (i / 4) * Math.PI * 2;
          m(g, G('cyl', 0.015, 0.015, 0.6, 4), matDark, [Math.cos(a) * 0.06, 0.12, 0.4 + Math.sin(a) * 0.06], [Math.PI/2, 0, 0]);
        }
        m(g, G('sphere', 0.03, 4, 3), matDark, [-0.12, 0.18, 0.05]);
      });

      // ── 25. AFT SENSOR DOME ──
      addPart('AFT SENSOR — TRACKING DOME', new THREE.Vector3(0, 0.6, -4.5), new THREE.Vector3(0, 1.5, -2), 3, (g) => {
        m(g, G('sphere', 0.3, 10, 8), matHull, [0, 0, 0], [0, 0, 0], [1, 0.6, 1]);
        m(g, G('cyl', 0.32, 0.35, 0.1, 10), matAccent, [0, -0.15, 0]);
        m(g, G('cyl', 0.02, 0.02, 0.35, 4), matDark, [0, 0.15, 0]);
        m(g, G('sphere', 0.04, 6, 4), matDark, [0, 0.33, 0]);
        greeble(g, matDark, 0, -0.15, 0, 0.5, 0.01, 0.5, 6, 0.02, 0.05);
      });

      // ═══════════════════════════════════════════════════════════════
      // TRIANGLE COUNT
      // ═══════════════════════════════════════════════════════════════
      let totalTris = 0;
      scene.traverse((c) => {
        const mesh = c as T.Mesh;
        if (mesh.isMesh && mesh.geometry) {
          totalTris += (mesh.geometry.index ? mesh.geometry.index.count / 3 : mesh.geometry.attributes.position.count / 3);
        }
      });

      // ═══════════════════════════════════════════════════════════════
      // STATE & INTERACTION
      // ═══════════════════════════════════════════════════════════════
      let explodeAmount = 0, targetExplode = 0;
      let wireframeMode = false, xrayMode = false, autoSpin = false;
      let hoveredPart: Part | null = null;

      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();
      function onMouseMove(event: MouseEvent) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      }
      window.addEventListener('mousemove', onMouseMove);

      // Part count display
      function updatePartCount() {
        const el = document.getElementById('mech-part-count');
        if (el) el.textContent = String(parts.length);
        const el2 = document.getElementById('mech-tri-count');
        if (el2) el2.textContent = Math.round(totalTris).toLocaleString();
      }
      updatePartCount();

      // Button hookups
      function setupUI() {
        const btnA = document.getElementById('mech-btn-assembled');
        const btnE = document.getElementById('mech-btn-exploded');
        const btnW = document.getElementById('mech-btn-wireframe');
        const btnX = document.getElementById('mech-btn-xray');
        const btnS = document.getElementById('mech-btn-spin');
        const slider = document.getElementById('mech-sep-slider') as HTMLInputElement | null;

        const inkBtn = 'rgba(26,26,24,0.08)';
        const inkBtnActive = 'rgba(26,26,24,0.2)';

        function updateBtnStates() {
          [btnA, btnE, btnW, btnX, btnS].forEach(b => { if (b) b.style.background = inkBtn; });
          if (targetExplode === 0 && btnA) btnA.style.background = inkBtnActive;
          if (targetExplode === 1 && btnE) btnE.style.background = inkBtnActive;
          if (wireframeMode && btnW) btnW.style.background = inkBtnActive;
          if (xrayMode && btnX) btnX.style.background = inkBtnActive;
          if (autoSpin && btnS) btnS.style.background = inkBtnActive;
        }

        if (btnA) btnA.onclick = () => { targetExplode = 0; if (slider) slider.value = '0'; updateBtnStates(); };
        if (btnE) btnE.onclick = () => { targetExplode = 1; if (slider) slider.value = '100'; updateBtnStates(); };
        if (btnW) btnW.onclick = () => {
          wireframeMode = !wireframeMode;
          parts.forEach(p => p.group.traverse(c => {
            if ((c as T.Mesh).isMesh) {
              const mat = (c as T.Mesh).material as T.ShaderMaterial;
              if (mat.wireframe !== undefined) mat.wireframe = wireframeMode;
            }
            if (c.userData.isEdge) c.visible = !wireframeMode;
          }));
          updateBtnStates();
        };
        if (btnX) btnX.onclick = () => {
          xrayMode = !xrayMode;
          sharedUniforms.xrayAlpha.value = xrayMode ? 0.12 : 1.0;
          parts.forEach(p => p.group.traverse(c => {
            if (c.userData.isEdge) {
              (c as T.LineSegments).material = xrayMode ? edgeMatStrong : edgeMat;
            }
          }));
          updateBtnStates();
        };
        if (btnS) btnS.onclick = () => { autoSpin = !autoSpin; updateBtnStates(); };
        if (slider) slider.oninput = () => { targetExplode = parseInt(slider.value) / 100; };
        updateBtnStates();
      }
      setTimeout(setupUI, 100);

      // ═══════════════════════════════════════════════════════════════
      // RENDER LOOP
      // ═══════════════════════════════════════════════════════════════
      const clock = new THREE.Clock();
      let animId = 0;

      function animate() {
        animId = requestAnimationFrame(animate);
        const dt = Math.min(clock.getDelta(), 0.05);

        explodeAmount += (targetExplode - explodeAmount) * 3 * dt;
        parts.forEach(p => {
          const offset = p.explodeDir.clone().multiplyScalar(p.explodeDist * explodeAmount);
          p.group.position.copy(p.origin).add(offset);
        });

        controls.autoRotate = autoSpin;
        controls.autoRotateSpeed = 1.0;

        // Raycasting
        raycaster.setFromCamera(mouse, camera);
        const allMeshes: T.Mesh[] = [];
        parts.forEach(p => p.group.traverse(c => { if ((c as T.Mesh).isMesh) allMeshes.push(c as T.Mesh); }));
        const intersects = raycaster.intersectObjects(allMeshes, false);
        const labelEl = document.getElementById('mech-part-label');
        if (intersects.length > 0) {
          let found: Part | null = null;
          for (const p of parts) {
            let match = false;
            p.group.traverse(c => { if (c === intersects[0].object) match = true; });
            if (match) { found = p; break; }
          }
          if (found && found !== hoveredPart) {
            hoveredPart = found;
            if (labelEl) { labelEl.textContent = found.name; labelEl.style.opacity = '1'; }
          }
        } else {
          if (hoveredPart) { hoveredPart = null; if (labelEl) labelEl.style.opacity = '0'; }
        }

        controls.update();
        renderer.render(scene, camera);
      }
      animate();
      setLoaded(true);

      function onResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
      window.addEventListener('resize', onResize);

      cleanup = () => {
        cancelAnimationFrame(animId);
        window.removeEventListener('resize', onResize);
        window.removeEventListener('mousemove', onMouseMove);
        controls.dispose();
        renderer.dispose();
        if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      };
    })();

    return () => { if (cleanup) cleanup(); };
  }, []);

  return (
    <div className="relative w-full h-screen" style={{ background: '#f0ebe0' }}>
      <div ref={containerRef} className="absolute inset-0" />

      <div className="absolute inset-0 pointer-events-none z-10" style={{ fontFamily: "'Courier New', monospace", color: '#1a1a18' }}>
        {/* Top-left title */}
        <div className="absolute top-6 sm:top-8 left-6 sm:left-10">
          <div style={{ fontSize: '9px', letterSpacing: '0.35em', textTransform: 'uppercase', opacity: 0.35 }}>
            TARTARY HEAVY INDUSTRIES — BUREAU OF NAVAL ARCHITECTURE
          </div>
          <h1 style={{ fontSize: '22px', letterSpacing: '0.18em', fontWeight: 300, color: '#1a1a18', margin: '4px 0' }}>
            LEVIATHAN-IX BATTLECRUISER
          </h1>
          <div style={{ fontSize: '9px', letterSpacing: '0.4em', textTransform: 'uppercase', opacity: 0.3 }}>
            EXPLODED ASSEMBLY — TECHNICAL ILLUSTRATION — DWG. NO. THI-2847-IX
          </div>
        </div>

        {/* Top-right stats */}
        <div className="absolute top-6 sm:top-8 right-6 sm:right-10 text-right" style={{ fontSize: '9px', letterSpacing: '0.2em', opacity: 0.35 }}>
          DRAG TO ROTATE<br />
          SCROLL TO ZOOM<br /><br />
          COMPONENTS: <span id="mech-part-count">0</span><br />
          TRIANGLES: <span id="mech-tri-count">0</span>
        </div>

        {/* Part hover label */}
        <div
          id="mech-part-label"
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            bottom: '80px', fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase',
            opacity: 0, transition: 'opacity 0.4s',
            background: 'rgba(240,235,224,0.9)', padding: '6px 16px',
            border: '1px solid rgba(26,26,24,0.15)',
          }}
        />

        {/* Bottom buttons */}
        <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3 pointer-events-auto">
          {[
            { id: 'mech-btn-assembled', label: 'ASSEMBLED' },
            { id: 'mech-btn-exploded', label: 'EXPLODED' },
            { id: 'mech-btn-wireframe', label: 'WIREFRAME' },
            { id: 'mech-btn-xray', label: 'X-RAY' },
            { id: 'mech-btn-spin', label: 'AUTO-SPIN' },
          ].map(btn => (
            <button key={btn.id} id={btn.id} style={{
              background: 'rgba(26,26,24,0.08)', border: '1px solid rgba(26,26,24,0.2)',
              color: '#1a1a18', padding: '8px 14px', fontFamily: "'Courier New', monospace",
              fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase' as const, cursor: 'pointer', transition: 'all 0.3s',
            }}>
              {btn.label}
            </button>
          ))}
        </div>

        {/* Slider */}
        <div className="absolute bottom-6 sm:bottom-8 right-6 sm:right-10 flex items-center gap-2 pointer-events-auto">
          <label style={{ fontSize: '8px', letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.4 }}>Separation</label>
          <input id="mech-sep-slider" type="range" min="0" max="100" defaultValue="0" style={{ width: '100px' }} />
        </div>

        {/* Drawing border frame */}
        <div className="absolute inset-4 sm:inset-6 pointer-events-none" style={{ border: '1px solid rgba(26,26,24,0.12)' }} />
        <div className="absolute inset-5 sm:inset-7 pointer-events-none" style={{ border: '1px solid rgba(26,26,24,0.06)' }} />
      </div>

      {!loaded && (
        <div className="absolute inset-0 z-20 flex items-center justify-center" style={{ background: '#f0ebe0' }}>
          <div className="text-center">
            <p style={{ fontFamily: "'Courier New', monospace", color: '#1a1a18', fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', opacity: 0.5 }}>
              RENDERING TECHNICAL ILLUSTRATION...
            </p>
            <div className="w-48 h-[1px] mx-auto mt-4 relative overflow-hidden" style={{ background: 'rgba(26,26,24,0.1)' }}>
              <div className="absolute top-0 left-0 h-full w-1/3 animate-pulse" style={{ background: 'rgba(26,26,24,0.3)' }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
