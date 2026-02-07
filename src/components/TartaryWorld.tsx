'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import * as THREE from 'three';
import { useRouter } from 'next/navigation';

// ═══════════════════════════════════════════════════════════════════════
// TYPES & DATA
// ═══════════════════════════════════════════════════════════════════════
interface District {
  id: string; label: string; subtitle: string; href: string;
  position: [number, number, number]; baseColor: string; neonColor: string; pulseSpeed: number;
}

const districts: District[] = [
  { id: 'universe', label: 'UNIVERSE', subtitle: 'Worlds & Characters', href: '/worlds', position: [0, 0, 0], baseColor: '#0d1b2a', neonColor: '#3b82f6', pulseSpeed: 1.0 },
  { id: 'cinema', label: 'CINEMA', subtitle: 'Film & Anime', href: '/cinema', position: [7.5, 0, -2.5], baseColor: '#1a0f00', neonColor: '#f59e0b', pulseSpeed: 0.8 },
  { id: 'games', label: 'GAMES', subtitle: 'Interactive & Systems', href: '/games', position: [-7.5, 0, -2.5], baseColor: '#0a1f15', neonColor: '#10b981', pulseSpeed: 1.2 },
  { id: 'publishing', label: 'PUBLISHING', subtitle: 'Books & Print', href: '/publishing', position: [4.5, 0, 6], baseColor: '#140a2e', neonColor: '#8b5cf6', pulseSpeed: 0.7 },
  { id: 'shop', label: 'SHOP', subtitle: 'Store & Membership', href: '/shop', position: [-4.5, 0, 6], baseColor: '#1a1208', neonColor: '#c9a96e', pulseSpeed: 0.9 },
];

const CONNECTIONS: [number, number][] = [[0,1],[0,2],[0,3],[0,4],[1,3],[2,4]];

// ═══════════════════════════════════════════════════════════════════════
// SHADERS
// ═══════════════════════════════════════════════════════════════════════
const groundVS = `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;

const groundFS = `
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
    float alpha = gridAlpha * 0.05 * fade + majorAlpha * 0.08 * fade + scan1 * 0.25 * fade
                + echo1 * 0.08 * fade + echo2 * 0.04 * fade + scan2 * 0.12 * fade + outerGlow;
    gl_FragColor = vec4(color, alpha);
  }
`;

// ═══════════════════════════════════════════════════════════════════════
// SHARED GEOMETRIES
// ═══════════════════════════════════════════════════════════════════════
let _g: Record<string, THREE.BufferGeometry> | null = null;
function G() {
  if (!_g) _g = {
    box: new THREE.BoxGeometry(1,1,1),
    cyl: new THREE.CylinderGeometry(0.5,0.5,1,24),
    cone: new THREE.ConeGeometry(0.5,1,6),
    dome: new THREE.SphereGeometry(0.5,24,12,0,Math.PI*2,0,Math.PI/2),
    oct: new THREE.OctahedronGeometry(0.5,0),
    ico: new THREE.IcosahedronGeometry(0.07,0),
  };
  return _g;
}

// ═══════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════
function mkBldg(geo: THREE.BufferGeometry, p: number[], s: number[], base: string, neon: string, r?: number[]): THREE.Mesh {
  const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
    color: base, metalness: 0.7, roughness: 0.3, emissive: new THREE.Color(neon), emissiveIntensity: 0.5,
  }));
  m.position.set(p[0],p[1],p[2]); m.scale.set(s[0],s[1],s[2]);
  if (r) m.rotation.set(r[0],r[1],r[2]);
  m.castShadow = true; m.receiveShadow = true;
  return m;
}

function mkNeon(p: number[], s: number[], color: string): THREE.Mesh {
  const m = new THREE.Mesh(G().box, new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.4 }));
  m.position.set(p[0],p[1],p[2]); m.scale.set(s[0],s[1],s[2]);
  return m;
}

function mkSparkles(count: number, box: number[], color: string): THREE.Points {
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos[i*3]=(Math.random()-0.5)*box[0]; pos[i*3+1]=Math.random()*box[1]; pos[i*3+2]=(Math.random()-0.5)*box[2];
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  return new THREE.Points(geo, new THREE.PointsMaterial({
    size: 1.2, color: new THREE.Color(color), transparent: true, opacity: 0.25,
    sizeAttenuation: true, blending: THREE.AdditiveBlending, depthWrite: false,
  }));
}

// ═══════════════════════════════════════════════════════════════════════
// DISTRICT OBJECT COLLECTION
// ═══════════════════════════════════════════════════════════════════════
interface DObjs {
  group: THREE.Group; buildings: THREE.Mesh[]; strips: THREE.Mesh[];
  sparkles: THREE.Points; pulseRing: THREE.Mesh; platform: THREE.Mesh;
  hoverLight: THREE.PointLight; hitbox: THREE.Mesh;
  specials: Record<string, THREE.Object3D>; time: number;
}

function buildDistrict(d: District): DObjs {
  const g = G();
  const group = new THREE.Group();
  group.position.set(d.position[0], d.position[1], d.position[2]);
  const buildings: THREE.Mesh[] = [];
  const strips: THREE.Mesh[] = [];
  const specials: Record<string, THREE.Object3D> = {};

  // ── UNIVERSE ──
  if (d.id === 'universe') {
    const b = [
      mkBldg(g.dome,[0,0,0],[3.2,2.2,3.2],d.baseColor,d.neonColor),
      mkBldg(g.cyl,[0,2.8,0],[0.15,1.8,0.15],'#0a1628',d.neonColor),
      mkBldg(g.oct,[1.8,1.2,-1.0],[0.4,2.6,0.4],'#0f1d30',d.neonColor),
      mkBldg(g.oct,[-1.6,0.9,0.8],[0.35,2.0,0.35],'#0f1d30',d.neonColor),
      mkBldg(g.oct,[0.9,0.8,1.5],[0.3,1.6,0.3],'#0f1d30',d.neonColor),
    ];
    b.forEach(m => group.add(m)); buildings.push(...b);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(2.0,0.03,8,64),
      new THREE.MeshBasicMaterial({ color: d.neonColor, transparent: true, opacity: 0.25 }));
    ring.position.set(0,1.8,0); group.add(ring); specials.ring = ring;
    const gr = new THREE.Mesh(new THREE.RingGeometry(1.5,1.65,64),
      new THREE.MeshBasicMaterial({ color: d.neonColor, transparent: true, opacity: 0.08, side: THREE.DoubleSide }));
    gr.position.set(0,0.02,0); gr.rotation.x = -Math.PI/2; group.add(gr); specials.groundRing = gr;
    const ns = [mkNeon([0,0.5,1.6],[1.5,0.04,0.04],d.neonColor), mkNeon([0,0.8,-1.5],[1.2,0.04,0.04],d.neonColor)];
    ns.forEach(m => group.add(m)); strips.push(...ns);
  }

  // ── CINEMA ──
  if (d.id === 'cinema') {
    const b = [
      mkBldg(g.box,[0,1.0,0],[3.0,2.0,0.6],d.baseColor,d.neonColor),
      mkBldg(g.box,[-1.8,1.5,-0.5],[0.5,3.0,0.5],'#1a0f00',d.neonColor),
      mkBldg(g.box,[1.8,1.5,-0.5],[0.5,3.0,0.5],'#1a0f00',d.neonColor),
      mkBldg(g.cone,[-1.8,3.2,-0.5],[0.5,0.6,0.5],'#1a0f00',d.neonColor),
      mkBldg(g.cone,[1.8,3.2,-0.5],[0.5,0.6,0.5],'#1a0f00',d.neonColor),
    ];
    b.forEach(m => group.add(m)); buildings.push(...b);
    const face = new THREE.Mesh(new THREE.PlaneGeometry(2.6,1.6),
      new THREE.MeshBasicMaterial({ color: d.neonColor, transparent: true, opacity: 0.15 }));
    face.position.set(0,1.0,0.32); group.add(face); specials.face = face;
    const beam = new THREE.Mesh(new THREE.ConeGeometry(1.5,4,16,1,true),
      new THREE.MeshBasicMaterial({ color: d.neonColor, transparent: true, opacity: 0.05, side: THREE.DoubleSide }));
    beam.position.set(0,2.2,0.6); beam.rotation.x = Math.PI/2; group.add(beam); specials.beam = beam;
    const ns = [mkNeon([0,0.2,0.32],[2.8,0.06,0.06],d.neonColor), mkNeon([0,1.8,0.32],[2.8,0.06,0.06],d.neonColor)];
    ns.forEach(m => group.add(m)); strips.push(...ns);
  }

  // ── GAMES ──
  if (d.id === 'games') {
    const b = [
      mkBldg(g.box,[0,1.8,0],[1.4,3.6,1.4],d.baseColor,d.neonColor),
      mkBldg(g.box,[0,3.8,0],[1.8,0.3,1.8],'#0a1f15',d.neonColor),
      mkBldg(g.cyl,[0.4,4.3,0.4],[0.08,1.0,0.08],'#0a1f15',d.neonColor),
      mkBldg(g.cyl,[-0.4,4.1,-0.4],[0.08,0.7,0.08],'#0a1f15',d.neonColor),
      mkBldg(g.box,[2.0,0.8,0.6],[0.8,1.6,0.8],'#0d2419',d.neonColor),
      mkBldg(g.box,[-1.6,0.6,-0.8],[0.9,1.2,0.7],'#0d2419',d.neonColor),
      mkBldg(g.cyl,[0,0.08,0],[2.8,0.16,2.8],'#060e0a',d.neonColor),
    ];
    b.forEach(m => group.add(m)); buildings.push(...b);
    const ns = [
      mkNeon([0.72,1.8,0],[0.05,3.4,0.05],d.neonColor), mkNeon([-0.72,1.8,0],[0.05,3.4,0.05],d.neonColor),
      mkNeon([0,1.8,0.72],[0.05,3.4,0.05],d.neonColor), mkNeon([0,1.8,-0.72],[0.05,3.4,0.05],d.neonColor),
    ];
    ns.forEach(m => group.add(m)); strips.push(...ns);
  }

  // ── PUBLISHING ──
  if (d.id === 'publishing') {
    const b = [
      mkBldg(g.box,[0,0.4,0],[2.8,0.8,1.6],d.baseColor,d.neonColor),
      mkBldg(g.box,[0.2,1.1,-0.1],[2.4,0.6,1.4],'#1a0e35',d.neonColor),
      mkBldg(g.box,[-0.15,1.7,0.1],[2.6,0.5,1.3],'#1f1040',d.neonColor),
      mkBldg(g.box,[0.1,2.2,0],[2.2,0.4,1.1],'#240f45',d.neonColor),
      mkBldg(g.box,[1.7,1.5,0],[0.15,3.0,0.8],'#2a1350',d.neonColor),
    ];
    b.forEach(m => group.add(m)); buildings.push(...b);
    const orb = new THREE.Mesh(new THREE.SphereGeometry(0.15,16,8),
      new THREE.MeshBasicMaterial({ color: d.neonColor, transparent: true, opacity: 0.3 }));
    orb.position.set(1.7,3.2,0); group.add(orb); specials.orb = orb;
    const ns = [mkNeon([-1.3,0.82,0],[0.06,0.04,1.4],d.neonColor), mkNeon([-1.1,1.42,0],[0.06,0.04,1.2],d.neonColor), mkNeon([0,0.4,0.82],[2.6,0.04,0.04],d.neonColor)];
    ns.forEach(m => group.add(m)); strips.push(...ns);
  }

  // ── SHOP ──
  if (d.id === 'shop') {
    const arch = new THREE.Mesh(new THREE.TorusGeometry(1.5,0.2,12,24,Math.PI),
      new THREE.MeshStandardMaterial({ color: d.baseColor, metalness: 0.92, roughness: 0.08, emissive: new THREE.Color(d.neonColor), emissiveIntensity: 0.2 }));
    arch.position.set(0,1.6,0); group.add(arch); buildings.push(arch); specials.arch = arch;
    const b = [
      mkBldg(g.box,[-1.5,0.8,0],[0.35,1.6,0.35],'#1a1208',d.neonColor),
      mkBldg(g.box,[1.5,0.8,0],[0.35,1.6,0.35],'#1a1208',d.neonColor),
      mkBldg(g.dome,[0,0,-1.2],[2.2,1.4,2.2],'#15100a',d.neonColor),
      mkBldg(g.cyl,[1.8,0.9,-0.8],[0.4,1.8,0.4],'#1a1208',d.neonColor),
      mkBldg(g.cyl,[-1.8,0.7,-0.8],[0.4,1.4,0.4],'#1a1208',d.neonColor),
    ];
    b.forEach(m => group.add(m)); buildings.push(...b);
    const capMat = new THREE.MeshBasicMaterial({ color: '#ffd700', transparent: true, opacity: 0.4 });
    const capL = new THREE.Mesh(new THREE.SphereGeometry(0.12,12,8), capMat);
    capL.position.set(-1.5,1.8,0); group.add(capL); specials.capL = capL;
    const capR = new THREE.Mesh(new THREE.SphereGeometry(0.12,12,8), capMat.clone());
    capR.position.set(1.5,1.8,0); group.add(capR); specials.capR = capR;
    const ns = [mkNeon([0,0.05,0.2],[3.0,0.05,0.05],d.neonColor), mkNeon([0,0.05,-0.2],[3.0,0.05,0.05],d.neonColor)];
    ns.forEach(m => group.add(m)); strips.push(...ns);
  }

  // ── SHARED: Platform, Pulse Ring, Hover Light, Sparkles, Hitbox ──
  const platform = new THREE.Mesh(new THREE.CylinderGeometry(3.2,3.4,0.08,6),
    new THREE.MeshStandardMaterial({ color: '#080808', metalness: 0.95, roughness: 0.2, emissive: new THREE.Color(d.neonColor), emissiveIntensity: 0.04 }));
  platform.position.y = -0.04; platform.receiveShadow = true; group.add(platform);

  const pulseRing = new THREE.Mesh(new THREE.RingGeometry(3.0,3.35,6),
    new THREE.MeshBasicMaterial({ color: d.neonColor, transparent: true, opacity: 0.1, side: THREE.DoubleSide }));
  pulseRing.position.set(0,0.03,0); pulseRing.rotation.x = -Math.PI/2; group.add(pulseRing);

  const hoverLight = new THREE.PointLight(d.neonColor, 0, 14, 2);
  hoverLight.position.set(0,5,0); group.add(hoverLight);

  const sp = mkSparkles(50, [6,5,6], d.neonColor); group.add(sp);

  const hitbox = new THREE.Mesh(new THREE.CylinderGeometry(3.2,3.2,5,16), new THREE.MeshBasicMaterial({ visible: false }));
  hitbox.position.y = 2.5; group.add(hitbox);
  (hitbox as any).districtId = d.id;

  return { group, buildings, strips, sparkles: sp, pulseRing, platform, hoverLight, hitbox, specials, time: Math.random()*100 };
}

// ═══════════════════════════════════════════════════════════════════════
// MEGACITY ENGINE — Raw Three.js (bypasses R3F fiber root issue)
// ═══════════════════════════════════════════════════════════════════════
class MegacityEngine {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.OrthographicCamera;
  private clock = new THREE.Clock();
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2(-999, -999);
  private container: HTMLDivElement;
  private animId = 0;
  private onHover: (id: string | null) => void;
  private onClickHref: (href: string) => void;
  private hoveredId: string | null = null;
  private disposed = false;
  private groundMat!: THREE.ShaderMaterial;
  private dObjs = new Map<string, DObjs>();
  private hitboxes: THREE.Mesh[] = [];
  private dLights = new Map<string, THREE.PointLight>();
  private streams: { pts: THREE.Points; curve: THREE.QuadraticBezierCurve3; count: number; speed: number }[] = [];
  private drones: { mesh: THREE.Mesh; curve: THREE.QuadraticBezierCurve3; speed: number; offset: number }[] = [];
  private smog!: THREE.Points;
  private motes!: THREE.Points;
  private camTime = 0;
  private camLook = new THREE.Vector3(0, 0, 1.5);
  private camDefPos = new THREE.Vector3(20, 18, 20);
  private camDefLook = new THREE.Vector3(0, 0, 1.5);

  constructor(container: HTMLDivElement, onHover: (id: string | null) => void, onClickHref: (href: string) => void) {
    this.container = container;
    this.onHover = onHover;
    this.onClickHref = onClickHref;

    // Renderer
    const r = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance', preserveDrawingBuffer: true });
    r.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    r.setSize(container.clientWidth, container.clientHeight);
    r.setClearColor(new THREE.Color('#020204'));
    r.toneMapping = THREE.ACESFilmicToneMapping;
    r.toneMappingExposure = 1.2;
    r.shadowMap.enabled = true;
    r.shadowMap.type = THREE.PCFSoftShadowMap;
    r.domElement.style.display = 'block';
    // Force canvas into its own GPU compositing layer so browser repaints
    // of overlapping DOM elements don't clear the WebGL drawing buffer.
    r.domElement.style.willChange = 'transform';
    r.domElement.style.transform = 'translateZ(0)';
    container.appendChild(r.domElement);
    this.renderer = r;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog('#020204', 40, 75);

    // Camera (replicates R3F OrthographicCamera with zoom=36)
    const w = container.clientWidth, h = container.clientHeight;
    this.camera = new THREE.OrthographicCamera(-w/2, w/2, h/2, -h/2, 0.1, 120);
    this.camera.zoom = 36;
    this.camera.position.set(20, 18, 20);
    this.camera.lookAt(0, 0, 1.5);
    this.camera.updateProjectionMatrix();

    this.build();

    container.addEventListener('pointermove', this.onPointerMove);
    container.addEventListener('click', this.onClick);
    window.addEventListener('resize', this.onResize);
    this.animate();
  }

  private build() {
    // Lights
    this.scene.add(new THREE.AmbientLight('#8a9ab8', 0.4));
    const dir1 = new THREE.DirectionalLight('#fff8e8', 1.2);
    dir1.position.set(15,25,12); dir1.castShadow = true;
    dir1.shadow.mapSize.set(2048,2048); dir1.shadow.camera.far = 70;
    dir1.shadow.camera.left = -25; dir1.shadow.camera.right = 25;
    dir1.shadow.camera.top = 25; dir1.shadow.camera.bottom = -25;
    this.scene.add(dir1);
    const dir2 = new THREE.DirectionalLight('#4a6fa5', 0.4); dir2.position.set(-12,18,-12); this.scene.add(dir2);
    const dir3 = new THREE.DirectionalLight('#c9a96e', 0.3); dir3.position.set(0,5,20); this.scene.add(dir3);
    const cLight = new THREE.PointLight('#c9a96e', 2.0, 30, 2); cLight.position.set(0,10,0); this.scene.add(cLight);

    for (const d of districts) {
      const pl = new THREE.PointLight(d.neonColor, 0.6, 10, 2);
      pl.position.set(d.position[0], 3, d.position[2]);
      this.scene.add(pl); this.dLights.set(d.id, pl);
    }

    // Ground
    const gnd = new THREE.Mesh(new THREE.PlaneGeometry(80,80),
      new THREE.MeshStandardMaterial({ color: '#030303', metalness: 0.95, roughness: 0.4 }));
    gnd.rotation.x = -Math.PI/2; gnd.position.y = -0.08; gnd.receiveShadow = true; this.scene.add(gnd);
    this.groundMat = new THREE.ShaderMaterial({ vertexShader: groundVS, fragmentShader: groundFS,
      uniforms: { uTime: { value: 0 } }, transparent: true, depthWrite: false, side: THREE.DoubleSide });
    const overlay = new THREE.Mesh(new THREE.PlaneGeometry(80,80), this.groundMat);
    overlay.rotation.x = -Math.PI/2; overlay.position.y = -0.01; this.scene.add(overlay);

    // Districts
    for (const d of districts) {
      const objs = buildDistrict(d);
      this.scene.add(objs.group);
      this.dObjs.set(d.id, objs);
      this.hitboxes.push(objs.hitbox);
    }

    // Data streams
    for (let i = 0; i < CONNECTIONS.length; i++) {
      const [fi, ti] = CONNECTIONS[i];
      const fp = districts[fi].position, tp = districts[ti].position;
      const a = new THREE.Vector3(fp[0],0.3,fp[2]), b = new THREE.Vector3(tp[0],0.3,tp[2]);
      const mid = a.clone().add(b).multiplyScalar(0.5); mid.y = 2.0;
      const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
      const count = 6;
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count*3), 3));
      const pts = new THREE.Points(geo, new THREE.PointsMaterial({
        size: 0.12, color: new THREE.Color(districts[fi].neonColor), transparent: true, opacity: 0.85,
        sizeAttenuation: true, blending: THREE.AdditiveBlending, depthWrite: false,
      }));
      this.scene.add(pts);
      this.streams.push({ pts, curve, count, speed: 0.8 + i * 0.15 });
    }

    // Drones
    for (let i = 0; i < CONNECTIONS.length; i++) {
      const [fi, ti] = CONNECTIONS[i];
      const fp = districts[fi].position, tp = districts[ti].position;
      const a = new THREE.Vector3(fp[0],0.5,fp[2]), b = new THREE.Vector3(tp[0],0.5,tp[2]);
      const mid = a.clone().add(b).multiplyScalar(0.5); mid.y = 1.8;
      const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
      const mesh = new THREE.Mesh(G().ico, new THREE.MeshStandardMaterial({
        color: districts[ti].neonColor, emissive: new THREE.Color(districts[ti].neonColor),
        emissiveIntensity: 3, metalness: 0.9, roughness: 0.1, transparent: true, opacity: 0.9,
      }));
      this.scene.add(mesh);
      this.drones.push({ mesh, curve, speed: 0.6 + i * 0.1, offset: i * 0.17 });
    }

    // Particles
    const smogPos = new Float32Array(250*3);
    for (let i = 0; i < 250; i++) { smogPos[i*3]=(Math.random()-0.5)*50; smogPos[i*3+1]=Math.random()*1.2; smogPos[i*3+2]=(Math.random()-0.5)*50; }
    const smogGeo = new THREE.BufferGeometry(); smogGeo.setAttribute('position', new THREE.BufferAttribute(smogPos, 3));
    this.smog = new THREE.Points(smogGeo, new THREE.PointsMaterial({ size: 0.5, color: '#0a0a1a', transparent: true, opacity: 0.12, sizeAttenuation: true, depthWrite: false }));
    this.scene.add(this.smog);

    const motePos = new Float32Array(150*3);
    for (let i = 0; i < 150; i++) { motePos[i*3]=(Math.random()-0.5)*45; motePos[i*3+1]=Math.random()*10+1; motePos[i*3+2]=(Math.random()-0.5)*45; }
    const moteGeo = new THREE.BufferGeometry(); moteGeo.setAttribute('position', new THREE.BufferAttribute(motePos, 3));
    this.motes = new THREE.Points(moteGeo, new THREE.PointsMaterial({ size: 0.05, color: '#c9a96e', transparent: true, opacity: 0.5, sizeAttenuation: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    this.scene.add(this.motes);
  }

  private animate = () => {
    if (this.disposed) return;
    this.animId = requestAnimationFrame(this.animate);
    const dt = this.clock.getDelta();
    const t = this.clock.getElapsedTime();

    this.groundMat.uniforms.uTime.value = t;

    // Raycast
    this.scene.updateMatrixWorld();
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const hits = this.raycaster.intersectObjects(this.hitboxes);
    const newId = hits.length > 0 ? (hits[0].object as any).districtId : null;
    if (newId !== this.hoveredId) {
      this.hoveredId = newId;
      this.onHover(newId);
      document.body.style.cursor = newId ? 'pointer' : 'default';
    }

    // Districts
    for (const d of districts) {
      const o = this.dObjs.get(d.id)!;
      const h = this.hoveredId === d.id;
      o.time += dt;
      o.group.position.y = d.position[1] + Math.sin(o.time * 0.6) * 0.06;

      for (const b of o.buildings) {
        const m = b.material as THREE.MeshStandardMaterial;
        m.emissiveIntensity = THREE.MathUtils.lerp(m.emissiveIntensity, h ? 1.8 : 0.4, dt * 5);
      }
      for (const s of o.strips) {
        (s.material as THREE.MeshBasicMaterial).opacity = h ? (Math.sin(t*3)*0.3+0.7) : 0.4;
      }
      (o.platform.material as THREE.MeshStandardMaterial).emissiveIntensity =
        THREE.MathUtils.lerp((o.platform.material as THREE.MeshStandardMaterial).emissiveIntensity, h ? 0.35 : 0.04, dt*5);
      const pv = Math.sin(t * d.pulseSpeed * 2) * 0.15 + 0.35;
      (o.pulseRing.material as THREE.MeshBasicMaterial).opacity = h ? pv*1.5 : pv*0.3;
      o.pulseRing.rotation.z = t * 0.2;
      o.hoverLight.intensity = h ? 10 : 0;
      (o.sparkles.material as THREE.PointsMaterial).opacity = h ? 0.9 : 0.25;
      (o.sparkles.material as THREE.PointsMaterial).size = h ? 3.5 : 1.2;
      this.dLights.get(d.id)!.intensity = h ? 4 : 0.6;

      // Per-district specials
      if (d.id === 'universe') {
        const ring = o.specials.ring as THREE.Mesh;
        ring.rotation.y = t*0.3; ring.rotation.x = Math.PI/3 + Math.sin(t*0.5)*0.1;
        (ring.material as THREE.MeshBasicMaterial).opacity = h ? 0.7 : 0.25;
        (o.specials.groundRing as THREE.Mesh).material && ((o.specials.groundRing as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity !== undefined &&
          ((o.specials.groundRing as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity;
        ((o.specials.groundRing as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = h ? 0.5 : 0.08;
      } else if (d.id === 'cinema') {
        ((o.specials.beam as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = h ? Math.sin(t*8)*0.15+0.35 : 0.05;
        ((o.specials.face as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = h ? 0.6 : 0.15;
      } else if (d.id === 'publishing') {
        ((o.specials.orb as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = h ? 0.9 : 0.3;
      } else if (d.id === 'shop') {
        ((o.specials.arch as THREE.Mesh).material as THREE.MeshStandardMaterial).emissiveIntensity = h ? 1.0 : 0.2;
        ((o.specials.capL as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = h ? 0.9 : 0.4;
        ((o.specials.capR as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = h ? 0.9 : 0.4;
      }
    }

    // Data streams
    for (const s of this.streams) {
      const arr = s.pts.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < s.count; i++) {
        const pt = s.curve.getPointAt(((t * s.speed * 0.15 + i / s.count) % 1 + 1) % 1);
        arr[i*3]=pt.x; arr[i*3+1]=pt.y; arr[i*3+2]=pt.z;
      }
      s.pts.geometry.attributes.position.needsUpdate = true;
    }

    // Drones
    for (const dr of this.drones) {
      const pt = dr.curve.getPointAt(((t * dr.speed * 0.12 + dr.offset) % 1 + 1) % 1);
      dr.mesh.position.copy(pt);
      dr.mesh.position.y += Math.sin(t*4 + dr.offset*20) * 0.08;
      dr.mesh.rotation.y = t*3; dr.mesh.rotation.x = t*2;
    }

    // Smog
    { const a = this.smog.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < 250; i++) { a[i*3]+=Math.sin(t*0.08+i*0.5)*0.003; a[i*3+2]+=Math.cos(t*0.06+i*0.3)*0.003; }
      this.smog.geometry.attributes.position.needsUpdate = true; }

    // Motes
    { const a = this.motes.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < 150; i++) { a[i*3+1]+=Math.sin(t*0.2+i)*0.002; if(a[i*3+1]>12) a[i*3+1]=1; }
      this.motes.geometry.attributes.position.needsUpdate = true; }

    // Camera
    this.camTime += dt;
    const ox = Math.sin(this.camTime*0.06)*0.6, oz = Math.cos(this.camTime*0.06)*0.6;
    const hd = this.hoveredId ? districts.find(d => d.id === this.hoveredId) : null;
    const tp = hd?.position;
    const tPos = tp
      ? new THREE.Vector3(this.camDefPos.x+ox+tp[0]*0.06, this.camDefPos.y, this.camDefPos.z+oz+tp[2]*0.06)
      : new THREE.Vector3(this.camDefPos.x+ox, this.camDefPos.y, this.camDefPos.z+oz);
    const tLook = tp ? new THREE.Vector3(tp[0]*0.3, 0.5, tp[2]*0.3+1.5) : this.camDefLook;
    this.camera.position.lerp(tPos, dt*1.8);
    this.camLook.lerp(tLook, dt*1.8);
    this.camera.lookAt(this.camLook);

    this.renderer.render(this.scene, this.camera);
  };

  private onPointerMove = (e: PointerEvent) => {
    const r = this.container.getBoundingClientRect();
    this.mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    this.mouse.y = -((e.clientY - r.top) / r.height) * 2 + 1;
  };

  private onClick = () => {
    if (this.hoveredId) {
      const d = districts.find(x => x.id === this.hoveredId);
      if (d) this.onClickHref(d.href);
    }
  };

  private onResize = () => {
    const w = this.container.clientWidth, h = this.container.clientHeight;
    this.renderer.setSize(w, h);
    this.camera.left = -w/2; this.camera.right = w/2;
    this.camera.top = h/2; this.camera.bottom = -h/2;
    this.camera.updateProjectionMatrix();
  };

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.animId);
    this.container.removeEventListener('pointermove', this.onPointerMove);
    this.container.removeEventListener('click', this.onClick);
    window.removeEventListener('resize', this.onResize);
    this.renderer.dispose();
    document.body.style.cursor = 'default';
    this.renderer.domElement.remove();
  }
}

// ═══════════════════════════════════════════════════════════════════════
// HUD OVERLAY  (static render — hover updates via direct DOM manipulation)
// ═══════════════════════════════════════════════════════════════════════
function HUDOverlay({ onDistrictClick, isReady }: {
  onDistrictClick: (href: string) => void; isReady: boolean;
}) {
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
      {/* District info panel — updated via DOM by handleHover */}
      <div id="hud-info" className="absolute bottom-10 left-10 transition-all duration-300 ease-out" style={{ opacity: 0, transform: 'translateY(8px)' }}>
        <p id="hud-subtitle" className="text-[10px] tracking-[0.2em] uppercase mb-1" style={{ fontFamily: 'var(--font-mono)' }} />
        <h2 id="hud-label" className="text-4xl sm:text-5xl font-bold text-foreground mb-3" style={{ fontFamily: 'var(--font-heading)' }} />
        <button id="hud-btn" className="pointer-events-auto text-xs tracking-[0.15em] uppercase border px-4 py-2 transition-colors duration-200 hover:bg-white/10" style={{ fontFamily: 'var(--font-mono)' }} onClick={(e) => { const href = e.currentTarget.getAttribute('data-href'); if (href) onDistrictClick(href); }}>Enter District →</button>
      </div>
      {/* District nav list — dots/colors updated via DOM by handleHover */}
      <div className="absolute bottom-10 right-10 text-right transition-opacity duration-1000" style={{ opacity: isReady ? 1 : 0, transitionDelay: '1200ms' }}>
        <div className="flex flex-col gap-1.5 items-end">
          {districts.map((d) => (
            <button key={d.id} id={`hnav-${d.id}`} className="pointer-events-auto flex items-center gap-1.5 text-[9px] tracking-[0.15em] uppercase transition-all duration-200 hover:opacity-100" style={{ fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.25)', opacity: 0.5 }} onClick={() => onDistrictClick(d.href)}>
              <span id={`hdot-${d.id}`} className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 transition-all duration-300" style={{ backgroundColor: 'rgba(255,255,255,0.15)', boxShadow: 'none' }} />
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
// ═══════════════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════════
// Direct DOM hover handler — avoids React re-renders entirely
// ═══════════════════════════════════════════════════════════════════════
function updateHUDForHover(id: string | null) {
  const active = id ? districts.find(d => d.id === id) : null;
  // Info panel
  const info = document.getElementById('hud-info');
  if (info) { info.style.opacity = active ? '1' : '0'; info.style.transform = active ? 'translateY(0)' : 'translateY(8px)'; }
  if (active) {
    const sub = document.getElementById('hud-subtitle');
    const lbl = document.getElementById('hud-label');
    const btn = document.getElementById('hud-btn');
    if (sub) { sub.textContent = active.subtitle; sub.style.color = active.neonColor; }
    if (lbl) { lbl.textContent = active.label; }
    if (btn) { btn.style.color = active.neonColor; btn.style.borderColor = active.neonColor; btn.setAttribute('data-href', active.href); }
  }
  // Nav dots
  for (const d of districts) {
    const nav = document.getElementById(`hnav-${d.id}`);
    const dot = document.getElementById(`hdot-${d.id}`);
    if (nav) { nav.style.color = id === d.id ? d.neonColor : 'rgba(255,255,255,0.25)'; nav.style.opacity = id === d.id ? '1' : '0.5'; }
    if (dot) { dot.style.backgroundColor = id === d.id ? d.neonColor : 'rgba(255,255,255,0.15)'; dot.style.boxShadow = id === d.id ? `0 0 10px ${d.neonColor}` : 'none'; }
  }
}

export default function TartaryWorld() {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<MegacityEngine | null>(null);
  const clickRef = useRef<(href: string) => void>(() => {});
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);

  clickRef.current = (href: string) => router.push(href);

  useEffect(() => {
    if (!containerRef.current) return;
    engineRef.current = new MegacityEngine(containerRef.current, updateHUDForHover, (href) => clickRef.current(href));
    return () => { engineRef.current?.dispose(); engineRef.current = null; };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleDistrictClick = useCallback((href: string) => { router.push(href); }, [router]);

  return (
    <div className="relative w-full h-screen bg-[#020204] overflow-hidden">
      <div ref={containerRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
      <HUDOverlay onDistrictClick={handleDistrictClick} isReady={isLoaded} />
      <LoadingScreen isLoaded={isLoaded} />
      <div className="absolute inset-0 pointer-events-none z-[5]" style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(2,2,4,0.6) 100%)' }} />
      <div className="absolute top-0 left-0 right-0 h-28 pointer-events-none z-[5]" style={{ background: 'linear-gradient(to bottom, rgba(2,2,4,0.6) 0%, transparent 100%)' }} />
    </div>
  );
}
