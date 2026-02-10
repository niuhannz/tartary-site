'use client';

import { useEffect, useRef, useState } from 'react';
import type * as T from 'three';

// ═══════════════════════════════════════════════════════════════
// TARTARY HEAVY INDUSTRIES — NAVAL ARCHITECTURE GALLERY
// 6 Ship Models — Cross-Hatching on Cream Paper
// Arrow keys to cycle, random on load
// ═══════════════════════════════════════════════════════════════

const hatchVert = `
varying vec3 vNormal;
varying vec2 vScreenPos;
void main() {
  vNormal = normalize(normalMatrix * normal);
  vec4 cp = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  vScreenPos = cp.xy / cp.w * 0.5 + 0.5;
  gl_Position = cp;
}`;

const hatchFrag = `
uniform vec3 lightDir;
uniform float hatchScale;
uniform vec3 inkColor;
uniform vec3 paperColor;
uniform float xrayAlpha;
varying vec3 vNormal;
varying vec2 vScreenPos;

float hatchLine(vec2 uv, float angle, float freq, float width) {
  float c = cos(angle), s = sin(angle);
  float v = uv.x * c + uv.y * s;
  return smoothstep(width, width * 0.3, abs(fract(v * freq) - 0.5));
}

void main() {
  float NdotL = dot(normalize(vNormal), normalize(lightDir));
  float shade = 1.0 - (NdotL * 0.5 + 0.5);
  vec2 sp = vScreenPos * hatchScale;
  float h = 0.0;
  if (shade > 0.2) h += hatchLine(sp, 0.785, 18.0, 0.38) * min((shade - 0.2) * 2.0, 1.0);
  if (shade > 0.4) h += hatchLine(sp, -0.785, 20.0, 0.35) * min((shade - 0.4) * 2.5, 1.0);
  if (shade > 0.55) h += hatchLine(sp, 0.0, 22.0, 0.32) * min((shade - 0.55) * 3.0, 1.0);
  if (shade > 0.7) h += hatchLine(sp, 1.5708, 24.0, 0.30) * min((shade - 0.7) * 4.0, 1.0);
  h = clamp(h, 0.0, 1.0) * 0.85;
  gl_FragColor = vec4(mix(paperColor, inkColor, h), xrayAlpha);
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

      const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0xf0ebe0);
      container.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xf0ebe0);

      const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 300);
      camera.position.set(18, 12, 18);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.target.set(0, 0, 0);
      controls.minDistance = 6;
      controls.maxDistance = 60;

      const lightDir = new THREE.Vector3(1.0, 1.5, 0.8).normalize();
      const sharedU = {
        lightDir: { value: lightDir },
        hatchScale: { value: 8.0 },
        inkColor: { value: new THREE.Color(0x1a1a18) },
        paperColor: { value: new THREE.Color(0xf0ebe0) },
        xrayAlpha: { value: 1.0 },
      };

      function hatchMat(tint?: number): T.ShaderMaterial {
        return new THREE.ShaderMaterial({
          vertexShader: hatchVert, fragmentShader: hatchFrag, transparent: true, side: THREE.FrontSide,
          uniforms: {
            lightDir: sharedU.lightDir, hatchScale: sharedU.hatchScale,
            inkColor: tint !== undefined ? { value: new THREE.Color(tint) } : sharedU.inkColor,
            paperColor: sharedU.paperColor, xrayAlpha: sharedU.xrayAlpha,
          },
        });
      }

      const MH = hatchMat(), MD = hatchMat(0x0d0d0c), MA = hatchMat(0x2a2820);
      const edgeMat = new THREE.LineBasicMaterial({ color: 0x1a1a18, transparent: true, opacity: 0.5 });
      const edgeMatStrong = new THREE.LineBasicMaterial({ color: 0x1a1a18, transparent: true, opacity: 0.85 });

      // ── Geometry cache ──
      const _gc: Record<string, T.BufferGeometry> = {};
      function G(type: string, ...a: number[]): T.BufferGeometry {
        const k = type + a.join(',');
        if (!_gc[k]) {
          if (type === 'b') _gc[k] = new THREE.BoxGeometry(a[0], a[1], a[2]);
          else if (type === 'c') _gc[k] = new THREE.CylinderGeometry(a[0], a[1], a[2], a[3] || 16);
          else if (type === 's') _gc[k] = new THREE.SphereGeometry(a[0], a[1] || 12, a[2] || 8);
          else if (type === 'n') _gc[k] = new THREE.ConeGeometry(a[0], a[1], a[2] || 12);
          else if (type === 't') _gc[k] = new THREE.TorusGeometry(a[0], a[1], a[2] || 8, a[3] || 24);
          else if (type === 'o') _gc[k] = new THREE.OctahedronGeometry(a[0], a[1] || 0);
        }
        return _gc[k];
      }

      // ── Part system ──
      interface Part { group: T.Group; name: string; origin: T.Vector3; explodeDir: T.Vector3; explodeDist: number; }
      const parts: Part[] = [];

      function addPart(name: string, origin: T.Vector3, dir: T.Vector3, dist: number, buildFn: (g: T.Group) => void) {
        const group = new THREE.Group();
        group.position.copy(origin);
        buildFn(group);
        group.traverse((child) => {
          if ((child as T.Mesh).isMesh) {
            const mesh = child as T.Mesh;
            const edges = new THREE.EdgesGeometry(mesh.geometry, 15);
            const line = new THREE.LineSegments(edges, edgeMat.clone());
            line.position.copy(mesh.position); line.rotation.copy(mesh.rotation); line.scale.copy(mesh.scale);
            line.userData.isEdge = true;
            group.add(line);
          }
        });
        scene.add(group);
        parts.push({ group, name, origin: origin.clone(), explodeDir: dir.clone().normalize(), explodeDist: dist });
      }

      function m(g: T.Group, geo: T.BufferGeometry, mat: T.Material, p?: number[], r?: number[], s?: number | number[]): T.Mesh {
        const mesh = new THREE.Mesh(geo, mat);
        if (p) mesh.position.set(p[0], p[1], p[2]);
        if (r) mesh.rotation.set(r[0], r[1], r[2]);
        if (s) { if (typeof s === 'number') mesh.scale.setScalar(s); else mesh.scale.set(s[0], s[1], s[2]); }
        g.add(mesh);
        return mesh;
      }

      const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
      const PI = Math.PI, PI2 = PI / 2;

      // ── Seeded random ──
      let _seed = 42;
      function sr() { _seed = (_seed * 16807) % 2147483647; return (_seed - 1) / 2147483646; }
      function srr(a: number, b: number) { return a + sr() * (b - a); }

      function greeble(g: T.Group, mat: T.Material, cx: number, cy: number, cz: number, w: number, h: number, d: number, n: number, sMin: number, sMax: number) {
        for (let i = 0; i < n; i++) m(g, G('b', srr(sMin, sMax), srr(sMin, sMax) * .5, srr(sMin, sMax)), mat, [cx + srr(-w/2, w/2), cy + srr(-h/2, h/2), cz + srr(-d/2, d/2)]);
      }

      // ── Engineering grid ──
      const gridGroup = new THREE.Group();
      const gridMat = new THREE.LineBasicMaterial({ color: 0xc0b8a8, transparent: true, opacity: 0.25 });
      for (let r = 3; r <= 24; r += 3) {
        const pts: T.Vector3[] = [];
        for (let a = 0; a <= 64; a++) { const th = (a / 64) * PI * 2; pts.push(new THREE.Vector3(Math.cos(th) * r, -0.01, Math.sin(th) * r)); }
        gridGroup.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pts.reduce((acc: T.Vector3[], p, i) => { if (i > 0) acc.push(pts[i-1], p); return acc; }, [])), gridMat));
      }
      for (let i = 0; i < 12; i++) { const a = (i / 12) * PI * 2; gridGroup.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints([V(0, -0.01, 0), V(Math.cos(a) * 24, -0.01, Math.sin(a) * 24)]), gridMat)); }
      scene.add(gridGroup);

      // ═══════════════════════════════════════════════════════════════
      // MODEL 1: LEVIATHAN-IX HEAVY BATTLECRUISER
      // ═══════════════════════════════════════════════════════════════
      function buildLeviathan() {
        _seed = 42;
        addPart('MAIN HULL — CENTRAL FUSELAGE', V(0,0,0), V(0,0,0), 0, g => {
          m(g, G('b',2,1.2,8), MH); m(g, G('b',1.6,.15,7.5), MH, [0,.68,0]); m(g, G('b',1.6,.15,7.5), MH, [0,-.68,0]);
          m(g, G('b',.15,.9,7.5), MH, [1.05,0,0]); m(g, G('b',.15,.9,7.5), MH, [-1.05,0,0]);
          m(g, G('b',.3,.2,6.5), MA, [0,.82,0]); m(g, G('b',.4,.15,5), MA, [0,-.78,.5]);
          greeble(g, MD, 0,.82,0, 1.2,.01,5.5, 25,.04,.15);
          greeble(g, MD, 1.05,0,0, .01,.7,5.5, 18,.03,.12); greeble(g, MD, -1.05,0,0, .01,.7,5.5, 18,.03,.12);
          for(let z=-3;z<=3;z+=.4){m(g,G('s',.015,4,3),MD,[.95,.45,z]);m(g,G('s',.015,4,3),MD,[-.95,.45,z]);}
        });
        addPart('PROW — FORWARD HULL', V(0,0,5.5), V(0,0,2), 4, g => {
          m(g,G('b',1.6,.9,2.5),MH); m(g,G('b',1.2,.7,1.5),MH,[0,0,1.5]); m(g,G('b',.6,.4,1),MH,[0,0,2.6]);
          m(g,G('n',.25,1.2,8),MH,[0,0,3.5],[PI2,0,0]); m(g,G('c',.08,.08,.6,8),MD,[0,0,4.1],[PI2,0,0]);
          for(let i=-2;i<=2;i++) m(g,G('b',.08,.03,.35),MD,[i*.25,.46,1]);
          greeble(g,MD,0,.46,0,1,.01,2,15,.03,.1); greeble(g,MD,0,-.46,0,1,.01,2,12,.03,.08);
        });
        addPart('STERN — AFT HULL', V(0,0,-5.5), V(0,0,-2), 4, g => {
          m(g,G('b',1.8,1,2.5),MH); m(g,G('b',2.2,1.4,.3),MA,[0,0,-1.3]); m(g,G('b',1.5,.8,.5),MD,[0,0,-1.5]);
          greeble(g,MD,0,0,0,1.4,.8,2,20,.03,.1);
        });
        addPart('BRIDGE — COMMAND TOWER', V(0,1.2,1.5), V(0,2,.5), 4.5, g => {
          m(g,G('b',1.2,.8,1.5),MH); m(g,G('b',1,.4,1.2),MH,[0,.55,0]); m(g,G('b',.7,.25,.8),MH,[0,.9,.1]);
          for(let i=-3;i<=3;i++) m(g,G('b',.12,.02,.04),MD,[i*.13,.72,.62]);
          m(g,G('c',.04,.03,.8,6),MD,[0,1.3,0]); m(g,G('s',.06,6,4),MA,[0,1.72,0]);
          m(g,G('s',.15,8,6),MH,[.5,.9,-.3],[0,0,0],[1,.3,1]); greeble(g,MD,0,.5,0,.9,.01,1.2,12,.02,.08);
        });
        addPart('PORT ENGINE — NACELLE', V(-2.5,-.2,-3), V(-2.5,-.5,-1.5), 5, g => {
          m(g,G('c',.6,.5,3.5,12),MH,[0,0,0],[PI2,0,0]); m(g,G('c',.7,.65,.4,12),MA,[0,0,1.6],[PI2,0,0]);
          m(g,G('c',.5,.7,.8,12),MD,[0,0,-2],[PI2,0,0]);
          for(let i=0;i<8;i++){const a=(i/8)*PI*2;m(g,G('b',.02,.12,1.5),MD,[Math.cos(a)*.55,Math.sin(a)*.55,-.5],[0,0,a]);}
          greeble(g,MD,0,.5,0,.6,.01,2.5,15,.02,.08);
        });
        addPart('STARBOARD ENGINE — NACELLE', V(2.5,-.2,-3), V(2.5,-.5,-1.5), 5, g => {
          m(g,G('c',.6,.5,3.5,12),MH,[0,0,0],[PI2,0,0]); m(g,G('c',.7,.65,.4,12),MA,[0,0,1.6],[PI2,0,0]);
          m(g,G('c',.5,.7,.8,12),MD,[0,0,-2],[PI2,0,0]);
          for(let i=0;i<8;i++){const a=(i/8)*PI*2;m(g,G('b',.02,.12,1.5),MD,[Math.cos(a)*.55,Math.sin(a)*.55,-.5],[0,0,a]);}
          greeble(g,MD,0,.5,0,.6,.01,2.5,15,.02,.08);
        });
        addPart('PORT PYLON', V(-1.5,0,-2), V(-1.5,-.3,-.8), 3, g => {
          m(g,G('b',1.2,.2,2),MH); m(g,G('b',1,.08,1.8),MA,[0,.12,0]); greeble(g,MD,0,.12,0,.9,.01,1.5,10,.02,.06);
        });
        addPart('STARBOARD PYLON', V(1.5,0,-2), V(1.5,-.3,-.8), 3, g => {
          m(g,G('b',1.2,.2,2),MH); m(g,G('b',1,.08,1.8),MA,[0,.12,0]); greeble(g,MD,0,.12,0,.9,.01,1.5,10,.02,.06);
        });
        addPart('DORSAL — WEAPONS BATTERY', V(0,1,-1), V(0,2.5,0), 4, g => {
          m(g,G('c',.5,.6,.3,12),MH); m(g,G('b',.8,.4,.8),MH,[0,.3,0]);
          m(g,G('c',.06,.05,2,8),MD,[.15,.35,1.2],[PI2,0,0]); m(g,G('c',.06,.05,2,8),MD,[-.15,.35,1.2],[PI2,0,0]);
          greeble(g,MD,0,.52,0,.6,.01,.6,8,.02,.06);
        });
        addPart('VENTRAL — TORPEDO BAY', V(0,-.9,.5), V(0,-2.5,0), 4, g => {
          m(g,G('b',1.4,.4,2),MH);
          for(let r=0;r<2;r++)for(let c=0;c<3;c++) m(g,G('c',.08,.08,.5,8),MD,[-.3+c*.3,-.1+r*.2,1.1],[PI2,0,0]);
          greeble(g,MD,0,-.22,0,1.1,.01,1.6,12,.02,.07);
        });
        addPart('PORT WING', V(-2,.1,0), V(-3,0,0), 4.5, g => {
          m(g,G('b',2,.12,2.5),MH); m(g,G('b',1.8,.06,2.3),MA,[0,.08,0]); m(g,G('b',.5,.08,1.5),MH,[-.9,0,.3]);
          greeble(g,MD,-.3,.08,0,1.5,.01,2,18,.02,.08);
        });
        addPart('STARBOARD WING', V(2,.1,0), V(3,0,0), 4.5, g => {
          m(g,G('b',2,.12,2.5),MH); m(g,G('b',1.8,.06,2.3),MA,[0,.08,0]); m(g,G('b',.5,.08,1.5),MH,[.9,0,.3]);
          greeble(g,MD,.3,.08,0,1.5,.01,2,18,.02,.08);
        });
        addPart('PORT RAILGUN', V(-1.2,-.3,3), V(-1.5,-.5,2), 4, g => {
          m(g,G('c',.12,.08,3,10),MH,[0,0,0],[PI2,0,0]);
          for(let i=0;i<6;i++) m(g,G('t',.14,.02,6,12),MA,[0,0,-1+i*.4],[PI2,0,0]);
          m(g,G('c',.15,.12,.2,8),MD,[0,0,1.6],[PI2,0,0]);
        });
        addPart('STARBOARD RAILGUN', V(1.2,-.3,3), V(1.5,-.5,2), 4, g => {
          m(g,G('c',.12,.08,3,10),MH,[0,0,0],[PI2,0,0]);
          for(let i=0;i<6;i++) m(g,G('t',.14,.02,6,12),MA,[0,0,-1+i*.4],[PI2,0,0]);
          m(g,G('c',.15,.12,.2,8),MD,[0,0,1.6],[PI2,0,0]);
        });
        addPart('DORSAL FIN — SENSOR ARRAY', V(0,1.5,-2.5), V(0,2.5,-.5), 3.5, g => {
          m(g,G('b',.08,1.5,1.8),MH); m(g,G('b',.06,1.2,1.5),MA,[0,.2,0]);
          for(let i=0;i<4;i++) m(g,G('b',.1,.03,.3),MD,[0,-.4+i*.4,.7]);
          m(g,G('s',.04,6,4),MD,[0,.78,0]);
        });
      }

      // ═══════════════════════════════════════════════════════════════
      // MODEL 2: WHISPERWIND FAST INTERCEPTOR
      // ═══════════════════════════════════════════════════════════════
      function buildWhisperwind() {
        _seed = 137;
        addPart('FUSELAGE — AERODYNAMIC HULL', V(0,0,0), V(0,0,0), 0, g => {
          m(g,G('b',1,.6,6),MH); m(g,G('b',.8,.3,5.5),MA,[0,.35,0]); m(g,G('b',.8,.3,5.5),MA,[0,-.35,0]);
          m(g,G('b',.12,.5,5),MH,[.52,0,0]); m(g,G('b',.12,.5,5),MH,[-.52,0,0]);
          greeble(g,MD,0,.35,0,.6,.01,4,20,.03,.1);
          greeble(g,MD,.52,0,0,.01,.4,4,12,.02,.08); greeble(g,MD,-.52,0,0,.01,.4,4,12,.02,.08);
        });
        addPart('NOSE CONE — SENSOR PROBE', V(0,0,4.5), V(0,0,2.5), 3.5, g => {
          m(g,G('n',.35,2.5,10),MH,[0,0,0],[PI2,0,0]); m(g,G('c',.06,.06,.8,6),MD,[0,0,1.4],[PI2,0,0]);
          m(g,G('s',.04,6,4),MA,[0,0,2]); greeble(g,MD,0,.2,0,.4,.01,1.5,8,.02,.06);
        });
        addPart('COCKPIT CANOPY', V(0,.5,1.5), V(0,1.5,.5), 3, g => {
          m(g,G('s',.3,10,8),MH,[0,0,0],[0,0,0],[1.2,.5,1.5]);
          for(let i=-2;i<=2;i++) m(g,G('b',.06,.01,.2),MD,[i*.1,.14,.3]);
          m(g,G('b',.5,.04,.8),MA,[0,-.12,0]);
        });
        addPart('PORT DELTA WING', V(-1.8,0,-.5), V(-3,0,.5), 5, g => {
          m(g,G('b',2.5,.06,3),MH); m(g,G('b',2.2,.04,2.6),MA,[0,.04,0]);
          m(g,G('b',2.5,.04,.08),MD,[0,0,1.52]); // leading edge
          m(g,G('b',.1,.2,.25),MD,[-.8,-.12,.3]); m(g,G('b',.1,.2,.25),MD,[.2,-.12,.3]); // hardpoints
          greeble(g,MD,0,.04,0,2,.01,2.5,20,.02,.08);
          m(g,G('s',.03,4,3),MD,[-1.25,.04,.8]); // nav light
        });
        addPart('STARBOARD DELTA WING', V(1.8,0,-.5), V(3,0,.5), 5, g => {
          m(g,G('b',2.5,.06,3),MH); m(g,G('b',2.2,.04,2.6),MA,[0,.04,0]);
          m(g,G('b',2.5,.04,.08),MD,[0,0,1.52]);
          m(g,G('b',.1,.2,.25),MD,[.8,-.12,.3]); m(g,G('b',.1,.2,.25),MD,[-.2,-.12,.3]);
          greeble(g,MD,0,.04,0,2,.01,2.5,20,.02,.08);
          m(g,G('s',.03,4,3),MD,[1.25,.04,.8]);
        });
        addPart('PORT TAIL FIN', V(-.6,.6,-3.5), V(-.8,2,-.5), 3, g => {
          m(g,G('b',.04,1.2,1.2),MH); m(g,G('b',.03,.9,1),MA,[0,.15,0]);
          m(g,G('s',.03,4,3),MD,[0,.62,0]); greeble(g,MD,0,0,0,.01,.9,1,6,.02,.05);
        });
        addPart('STARBOARD TAIL FIN', V(.6,.6,-3.5), V(.8,2,-.5), 3, g => {
          m(g,G('b',.04,1.2,1.2),MH); m(g,G('b',.03,.9,1),MA,[0,.15,0]);
          m(g,G('s',.03,4,3),MD,[0,.62,0]); greeble(g,MD,0,0,0,.01,.9,1,6,.02,.05);
        });
        addPart('PORT ENGINE POD', V(-1,-.15,-3), V(-1.5,-.5,-2), 4, g => {
          m(g,G('c',.3,.25,2.5,10),MH,[0,0,0],[PI2,0,0]);
          m(g,G('c',.25,.35,.5,10),MD,[0,0,-1.4],[PI2,0,0]); // exhaust
          m(g,G('c',.35,.3,.3,10),MA,[0,0,1],[PI2,0,0]); // intake
          greeble(g,MD,0,.25,0,.3,.01,2,8,.02,.06);
        });
        addPart('STARBOARD ENGINE POD', V(1,-.15,-3), V(1.5,-.5,-2), 4, g => {
          m(g,G('c',.3,.25,2.5,10),MH,[0,0,0],[PI2,0,0]);
          m(g,G('c',.25,.35,.5,10),MD,[0,0,-1.4],[PI2,0,0]);
          m(g,G('c',.35,.3,.3,10),MA,[0,0,1],[PI2,0,0]);
          greeble(g,MD,0,.25,0,.3,.01,2,8,.02,.06);
        });
        addPart('CHIN GUN — PULSE LASER', V(0,-.4,2.5), V(0,-1.5,1.5), 3, g => {
          m(g,G('b',.2,.15,.4),MA,[0,0,0]); m(g,G('c',.04,.03,1.5,6),MD,[0,0,.8],[PI2,0,0]);
          m(g,G('c',.04,.03,1.5,6),MD,[.08,0,.8],[PI2,0,0]);
          m(g,G('s',.03,4,3),MD,[.04,0,1.55]);
        });
        addPart('PORT WINGTIP LAUNCHER', V(-3,0,0), V(-2,.5,.5), 2, g => {
          m(g,G('c',.08,.08,.6,6),MD,[0,0,0],[PI2,0,0]); m(g,G('c',.1,.08,.15,6),MA,[0,0,.35],[PI2,0,0]);
        });
        addPart('STARBOARD WINGTIP LAUNCHER', V(3,0,0), V(2,.5,.5), 2, g => {
          m(g,G('c',.08,.08,.6,6),MD,[0,0,0],[PI2,0,0]); m(g,G('c',.1,.08,.15,6),MA,[0,0,.35],[PI2,0,0]);
        });
      }

      // ═══════════════════════════════════════════════════════════════
      // MODEL 3: CATHEDRAL DREADNOUGHT
      // ═══════════════════════════════════════════════════════════════
      function buildCathedral() {
        _seed = 271;
        addPart('MAIN HULL — ARMORED CITADEL', V(0,0,0), V(0,0,0), 0, g => {
          m(g,G('b',3.5,1,7),MH); m(g,G('b',3,.15,6.5),MH,[0,.55,0]); m(g,G('b',3,.15,6.5),MH,[0,-.55,0]);
          m(g,G('b',.15,.8,6.5),MH,[1.78,0,0]); m(g,G('b',.15,.8,6.5),MH,[-1.78,0,0]);
          greeble(g,MD,0,.55,0,2.5,.01,5.5,35,.04,.15);
          greeble(g,MD,1.78,0,0,.01,.6,5,20,.03,.12); greeble(g,MD,-1.78,0,0,.01,.6,5,20,.03,.12);
          for(let z=-3;z<=3;z+=.3){m(g,G('s',.015,4,3),MD,[1.7,.35,z]);m(g,G('s',.015,4,3),MD,[-1.7,.35,z]);}
        });
        addPart('PROW — ARMORED RAM', V(0,0,5), V(0,0,2.5), 4, g => {
          m(g,G('b',2.5,.8,2),MH); m(g,G('b',1.5,.6,1.5),MH,[0,0,1.2]); m(g,G('b',.8,.4,1),MH,[0,0,2.2]);
          m(g,G('b',.3,.2,1.5),MD,[0,-.3,2]); // ventral ram blade
          greeble(g,MD,0,.42,0,1.8,.01,2,15,.03,.1);
        });
        addPart('BRIDGE SPIRE — COMMAND', V(0,1.5,0), V(0,3,0), 5, g => {
          m(g,G('b',.8,.6,1),MH); m(g,G('b',.6,.5,.8),MH,[0,.5,0]); m(g,G('b',.4,.8,.5),MH,[0,1.2,0]);
          m(g,G('b',.2,1.2,.3),MA,[0,1.5,0]); // gothic spire
          m(g,G('n',.12,.5,6),MH,[0,2.3,0]); // spire tip
          for(let i=-2;i<=2;i++) m(g,G('b',.06,.02,.03),MD,[i*.08,.35,.52]);
          greeble(g,MD,0,.8,0,.5,.01,.8,10,.02,.06);
        });
        addPart('PORT BROADSIDE — BATTERY', V(-2.2,.2,-.5), V(-3,.5,0), 4.5, g => {
          m(g,G('b',1,.6,3),MH);
          for(let z=-1;z<=1;z+=.5) m(g,G('c',.05,.04,1,6),MD,[-.52,.1,z],[0,0,PI2]);
          greeble(g,MD,0,.32,0,.8,.01,2.5,12,.02,.08);
        });
        addPart('STARBOARD BROADSIDE — BATTERY', V(2.2,.2,-.5), V(3,.5,0), 4.5, g => {
          m(g,G('b',1,.6,3),MH);
          for(let z=-1;z<=1;z+=.5) m(g,G('c',.05,.04,1,6),MD,[.52,.1,z],[0,0,PI2]);
          greeble(g,MD,0,.32,0,.8,.01,2.5,12,.02,.08);
        });
        addPart('DORSAL TURRET A', V(-.8,.8,2), V(-.8,2.5,1), 3.5, g => {
          m(g,G('c',.4,.5,.2,10),MH); m(g,G('b',.6,.3,.6),MH,[0,.2,0]);
          m(g,G('c',.05,.04,1.5,6),MD,[.12,.25,.9],[PI2,0,0]); m(g,G('c',.05,.04,1.5,6),MD,[-.12,.25,.9],[PI2,0,0]);
        });
        addPart('DORSAL TURRET B', V(.8,.8,-2), V(.8,2.5,-1), 3.5, g => {
          m(g,G('c',.4,.5,.2,10),MH); m(g,G('b',.6,.3,.6),MH,[0,.2,0]);
          m(g,G('c',.05,.04,1.5,6),MD,[.12,.25,.9],[PI2,0,0]); m(g,G('c',.05,.04,1.5,6),MD,[-.12,.25,.9],[PI2,0,0]);
        });
        addPart('VENTRAL HANGAR', V(0,-.7,1), V(0,-2.5,.5), 4, g => {
          m(g,G('b',2.5,.5,2),MH); m(g,G('b',1.8,.3,1.5),MD,[0,0,0]); // internal bay
          m(g,G('b',1.5,.35,.05),MD,[0,-.05,1.02]); // bay opening
          greeble(g,MD,0,-.25,0,2,.01,1.5,12,.02,.06);
        });
        addPart('ENGINE BLOCK — PORT', V(-1.2,-.1,-4.5), V(-1.5,-.3,-2), 4, g => {
          m(g,G('c',.45,.4,2.5,10),MH,[0,0,0],[PI2,0,0]);
          m(g,G('c',.35,.5,.6,10),MD,[0,0,-1.4],[PI2,0,0]);
          for(let i=0;i<6;i++){const a=(i/6)*PI*2;m(g,G('b',.02,.1,1),MD,[Math.cos(a)*.4,Math.sin(a)*.4,-.3],[0,0,a]);}
          greeble(g,MD,0,.35,0,.4,.01,2,10,.02,.06);
        });
        addPart('ENGINE BLOCK — STARBOARD', V(1.2,-.1,-4.5), V(1.5,-.3,-2), 4, g => {
          m(g,G('c',.45,.4,2.5,10),MH,[0,0,0],[PI2,0,0]);
          m(g,G('c',.35,.5,.6,10),MD,[0,0,-1.4],[PI2,0,0]);
          for(let i=0;i<6;i++){const a=(i/6)*PI*2;m(g,G('b',.02,.1,1),MD,[Math.cos(a)*.4,Math.sin(a)*.4,-.3],[0,0,a]);}
          greeble(g,MD,0,.35,0,.4,.01,2,10,.02,.06);
        });
        addPart('ENGINE BLOCK — CENTER', V(0,-.1,-4.5), V(0,-.3,-2.5), 4, g => {
          m(g,G('c',.5,.45,2.8,10),MH,[0,0,0],[PI2,0,0]);
          m(g,G('c',.4,.55,.7,10),MD,[0,0,-1.6],[PI2,0,0]);
          greeble(g,MD,0,.4,0,.5,.01,2,10,.02,.06);
        });
        addPart('STERN — AFT SECTION', V(0,0,-4), V(0,0,-2), 3, g => {
          m(g,G('b',3,1,1.5),MH); m(g,G('b',3.2,1.2,.2),MA,[0,0,-.8]);
          greeble(g,MD,0,.5,0,2.5,.01,1.2,15,.03,.1);
        });
      }

      // ═══════════════════════════════════════════════════════════════
      // MODEL 4: NOMAD SURVEY VESSEL
      // ═══════════════════════════════════════════════════════════════
      function buildNomad() {
        _seed = 389;
        addPart('CORE MODULE — CREW HABITAT', V(0,0,0), V(0,0,0), 0, g => {
          m(g,G('c',.8,.8,3,12),MH,[0,0,0]); m(g,G('c',.85,.85,.3,12),MA,[0,0,0],[0,0,0]);
          greeble(g,MD,0,.7,0,.8,.01,2,15,.03,.1);
          for(let i=0;i<8;i++){const a=(i/8)*PI*2;m(g,G('b',.02,.05,2.5),MD,[Math.cos(a)*.82,Math.sin(a)*.82,0]);}
        });
        addPart('SENSOR BOOM', V(0,.2,3.5), V(0,.5,3), 5, g => {
          m(g,G('c',.08,.06,5,6),MH,[0,0,0],[PI2,0,0]);
          m(g,G('s',.2,8,6),MA,[0,0,2.8]); // sensor head
          for(let i=0;i<3;i++) m(g,G('c',.015,.015,.4,4),MD,[srr(-.1,.1),srr(-.1,.1),1+i*.8],[srr(-.3,.3),0,0]);
          greeble(g,MD,0,.08,0,.1,.01,4,8,.02,.05);
        });
        addPart('SENSOR RING', V(0,0,1.5), V(0,1.5,1), 3.5, g => {
          m(g,G('t',1.2,.04,8,32),MH,[0,0,0],[PI2,0,0]);
          m(g,G('t',1.2,.06,6,24),MA,[0,0,0],[PI2,0,0]);
          for(let i=0;i<8;i++){const a=(i/8)*PI*2;m(g,G('b',.06,.04,.12),MD,[Math.cos(a)*1.2,0,Math.sin(a)*1.2],[0,a,0]);}
        });
        addPart('PORT SOLAR PANEL', V(-1.8,.1,.5), V(-3,0,.3), 4.5, g => {
          m(g,G('b',2,.03,2.5),MH); m(g,G('b',1.8,.02,2.3),MD,[0,.02,0]);
          for(let x=-.8;x<=.8;x+=.2) m(g,G('b',.01,.01,2.3),MD,[x,.025,0]);
          m(g,G('b',.08,.06,.3),MA,[.95,0,0]); // hinge
        });
        addPart('STARBOARD SOLAR PANEL', V(1.8,.1,.5), V(3,0,.3), 4.5, g => {
          m(g,G('b',2,.03,2.5),MH); m(g,G('b',1.8,.02,2.3),MD,[0,.02,0]);
          for(let x=-.8;x<=.8;x+=.2) m(g,G('b',.01,.01,2.3),MD,[x,.025,0]);
          m(g,G('b',.08,.06,.3),MA,[-.95,0,0]);
        });
        addPart('LAB MODULE', V(0,.6,-1), V(0,2,-.5), 3.5, g => {
          m(g,G('b',.8,.5,1.2),MH); m(g,G('b',.6,.08,1),MA,[0,.28,0]);
          for(let i=-2;i<=2;i++) m(g,G('b',.06,.02,.03),MD,[i*.12,.26,.62]);
          greeble(g,MD,0,.28,0,.6,.01,.8,8,.02,.06);
        });
        addPart('PROBE LAUNCH BAY', V(0,-.6,.5), V(0,-2,.3), 3, g => {
          m(g,G('b',.6,.3,1),MH);
          for(let c=0;c<3;c++) m(g,G('c',.05,.05,.3,6),MD,[-.15+c*.15,-.12,.55],[PI2,0,0]);
          m(g,G('b',.5,.04,.8),MA,[0,-.16,0]);
        });
        addPart('COMMS DISH', V(.7,.8,-1.5), V(1.5,2,-.8), 3, g => {
          m(g,G('s',.35,10,8),MH,[0,0,0],[0,0,0],[1,.25,1]);
          m(g,G('c',.02,.02,.3,4),MD,[0,.1,0]); m(g,G('s',.04,4,3),MA,[0,.25,0]);
        });
        addPart('PORT THRUSTER', V(-.8,-.3,-2), V(-1.2,-.5,-1.5), 3, g => {
          m(g,G('c',.2,.15,1,8),MH,[0,0,0],[PI2,0,0]);
          m(g,G('c',.15,.22,.3,8),MD,[0,0,-.6],[PI2,0,0]);
          greeble(g,MD,0,.15,0,.2,.01,.8,6,.02,.04);
        });
        addPart('STARBOARD THRUSTER', V(.8,-.3,-2), V(1.2,-.5,-1.5), 3, g => {
          m(g,G('c',.2,.15,1,8),MH,[0,0,0],[PI2,0,0]);
          m(g,G('c',.15,.22,.3,8),MD,[0,0,-.6],[PI2,0,0]);
          greeble(g,MD,0,.15,0,.2,.01,.8,6,.02,.04);
        });
        addPart('SHIELD EMITTER', V(0,.3,2.5), V(0,1,2), 2.5, g => {
          m(g,G('s',.25,8,6),MH,[0,0,0],[0,0,0],[1,.3,1]); m(g,G('t',.22,.015,6,16),MD,[0,0,0],[PI2,0,0]);
          m(g,G('c',.03,.03,.3,4),MD,[0,-.18,0]);
        });
        addPart('DOCKING PORT', V(0,0,-2.5), V(0,0,-2), 3, g => {
          m(g,G('c',.4,.4,.4,10),MH,[0,0,0]); m(g,G('c',.3,.3,.1,10),MD,[0,0,-.25]);
          m(g,G('t',.35,.02,6,16),MA,[0,0,-.2]);
        });
      }

      // ═══════════════════════════════════════════════════════════════
      // MODEL 5: IRON WASP GUNSHIP
      // ═══════════════════════════════════════════════════════════════
      function buildIronWasp() {
        _seed = 503;
        addPart('HULL — ARMORED FUSELAGE', V(0,0,0), V(0,0,0), 0, g => {
          m(g,G('b',1.4,.9,3.5),MH); m(g,G('b',1.2,.12,3.2),MH,[0,.5,0]); m(g,G('b',1.2,.12,3.2),MH,[0,-.5,0]);
          m(g,G('b',.12,.75,3.2),MH,[.72,0,0]); m(g,G('b',.12,.75,3.2),MH,[-.72,0,0]);
          greeble(g,MD,0,.5,0,1,.01,2.8,20,.03,.12);
          greeble(g,MD,.72,0,0,.01,.6,2.8,14,.02,.1); greeble(g,MD,-.72,0,0,.01,.6,2.8,14,.02,.1);
          for(let z=-1.5;z<=1.5;z+=.3){m(g,G('s',.012,4,3),MD,[.65,.35,z]);m(g,G('s',.012,4,3),MD,[-.65,.35,z]);}
        });
        addPart('COCKPIT — ARMORED CANOPY', V(0,.3,2.2), V(0,1.5,1.5), 3, g => {
          m(g,G('b',.8,.5,1),MH); m(g,G('b',.7,.35,.8),MH,[0,.15,.2]);
          for(let i=-2;i<=2;i++) m(g,G('b',.08,.02,.03),MD,[i*.12,.38,.55]); // viewports
          m(g,G('b',.6,.06,.8),MA,[0,.42,0]);
          greeble(g,MD,0,.42,0,.5,.01,.6,6,.02,.05);
        });
        addPart('CHIN ROTARY CANNON', V(0,-.6,2), V(0,-2,2.5), 4.5, g => {
          m(g,G('b',.25,.2,.4),MA,[0,0,-.2]); // mount
          m(g,G('c',.12,.1,2.8,10),MD,[0,0,1.2],[PI2,0,0]); // housing
          for(let i=0;i<6;i++){const a=(i/6)*PI*2;m(g,G('c',.02,.02,1.5,4),MD,[Math.cos(a)*.06,Math.sin(a)*.06,2],[PI2,0,0]);}
          m(g,G('c',.1,.08,.15,8),MA,[0,0,2.8],[PI2,0,0]); // muzzle
          m(g,G('c',.1,.1,.25,8),MD,[0,.15,-.5]); // ammo drum
        });
        addPart('PORT STUB WING', V(-1.2,0,-.3), V(-2,.3,.3), 3.5, g => {
          m(g,G('b',1.2,.08,1.5),MH); m(g,G('b',1,.05,1.3),MA,[0,.05,0]);
          m(g,G('b',.08,.2,.25),MD,[-.3,-.12,.3]); m(g,G('b',.08,.2,.25),MD,[.3,-.12,.3]); // pylons
          greeble(g,MD,0,.05,0,.9,.01,1.2,10,.02,.06);
        });
        addPart('STARBOARD STUB WING', V(1.2,0,-.3), V(2,.3,.3), 3.5, g => {
          m(g,G('b',1.2,.08,1.5),MH); m(g,G('b',1,.05,1.3),MA,[0,.05,0]);
          m(g,G('b',.08,.2,.25),MD,[.3,-.12,.3]); m(g,G('b',.08,.2,.25),MD,[-.3,-.12,.3]);
          greeble(g,MD,0,.05,0,.9,.01,1.2,10,.02,.06);
        });
        addPart('PORT ENGINE', V(-1,-.1,-2.5), V(-1.8,-.5,-1.5), 4, g => {
          m(g,G('c',.35,.3,2,10),MH,[0,0,0],[PI2,0,0]);
          m(g,G('c',.3,.4,.5,10),MD,[0,0,-1.2],[PI2,0,0]); // exhaust
          m(g,G('c',.38,.35,.25,10),MA,[0,0,.8],[PI2,0,0]); // intake
          greeble(g,MD,0,.3,0,.3,.01,1.5,8,.02,.05);
        });
        addPart('STARBOARD ENGINE', V(1,-.1,-2.5), V(1.8,-.5,-1.5), 4, g => {
          m(g,G('c',.35,.3,2,10),MH,[0,0,0],[PI2,0,0]);
          m(g,G('c',.3,.4,.5,10),MD,[0,0,-1.2],[PI2,0,0]);
          m(g,G('c',.38,.35,.25,10),MA,[0,0,.8],[PI2,0,0]);
          greeble(g,MD,0,.3,0,.3,.01,1.5,8,.02,.05);
        });
        addPart('DORSAL TURRET', V(0,.6,-1), V(0,2.5,-.3), 3.5, g => {
          m(g,G('c',.25,.3,.15,8),MH); m(g,G('b',.4,.2,.4),MH,[0,.12,0]);
          m(g,G('c',.04,.035,1.2,6),MD,[.1,.15,.7],[PI2,0,0]); m(g,G('c',.04,.035,1.2,6),MD,[-.1,.15,.7],[PI2,0,0]);
          m(g,G('s',.03,4,3),MD,[0,.25,.15]);
        });
        addPart('VENTRAL SENSOR', V(0,-.6,.5), V(0,-2,.3), 2.5, g => {
          m(g,G('s',.2,8,6),MH,[0,0,0],[0,0,0],[1,.5,1]); m(g,G('c',.22,.25,.08,8),MA,[0,-.08,0]);
          m(g,G('c',.015,.015,.15,4),MD,[0,-.2,0]);
        });
        addPart('TAIL BOOM', V(0,.2,-2.5), V(0,.5,-2), 3, g => {
          m(g,G('c',.08,.06,2,6),MH,[0,0,0],[PI2,0,0]);
          m(g,G('b',.04,.6,.5),MH,[0,.15,-1]); // vertical stab
          m(g,G('s',.03,4,3),MD,[0,.48,-1]);
          greeble(g,MD,0,.08,0,.08,.01,1.5,5,.02,.04);
        });
        addPart('PORT MISSILE RACK', V(-1.5,-.15,0), V(-2,-.5,.5), 2.5, g => {
          m(g,G('b',.3,.2,.8),MH);
          for(let r=0;r<2;r++)for(let c=0;c<2;c++) m(g,G('c',.04,.04,.4,6),MD,[-.06+c*.12,-.05+r*.1,.5],[PI2,0,0]);
        });
        addPart('STARBOARD MISSILE RACK', V(1.5,-.15,0), V(2,-.5,.5), 2.5, g => {
          m(g,G('b',.3,.2,.8),MH);
          for(let r=0;r<2;r++)for(let c=0;c<2;c++) m(g,G('c',.04,.04,.4,6),MD,[-.06+c*.12,-.05+r*.1,.5],[PI2,0,0]);
        });
      }

      // ═══════════════════════════════════════════════════════════════
      // MODEL 6: VOID HARVESTER — INDUSTRIAL MINING VESSEL
      // ═══════════════════════════════════════════════════════════════
      function buildVoidHarvester() {
        _seed = 617;
        addPart('PROCESSING HULL', V(0,0,0), V(0,0,0), 0, g => {
          m(g,G('b',2.5,1.5,4),MH); m(g,G('b',2.2,.12,3.8),MH,[0,.78,0]); m(g,G('b',2.2,.12,3.8),MH,[0,-.78,0]);
          m(g,G('b',.12,1.3,3.8),MH,[1.28,0,0]); m(g,G('b',.12,1.3,3.8),MH,[-1.28,0,0]);
          greeble(g,MD,0,.78,0,1.8,.01,3,30,.05,.18);
          greeble(g,MD,1.28,0,0,.01,.9,3,16,.03,.12); greeble(g,MD,-1.28,0,0,.01,.9,3,16,.03,.12);
          for(let z=-1.5;z<=1.5;z+=.35){m(g,G('s',.02,4,3),MD,[1.2,.55,z]);m(g,G('s',.02,4,3),MD,[-1.2,.55,z]);}
        });
        addPart('BRIDGE — CONTROL TOWER', V(1,.9,1.5), V(1,2.5,1), 4, g => {
          m(g,G('b',.8,.6,.8),MH); m(g,G('b',.6,.3,.6),MH,[0,.4,0]);
          for(let i=-2;i<=2;i++) m(g,G('b',.06,.02,.03),MD,[i*.1,.28,.32]);
          m(g,G('c',.03,.025,.4,4),MD,[0,.6,0]); m(g,G('s',.04,4,3),MA,[0,.82,0]);
          greeble(g,MD,0,.3,0,.5,.01,.5,6,.02,.05);
        });
        addPart('PORT BOOM ARM', V(-2,.3,2.5), V(-3,.5,2), 5, g => {
          m(g,G('b',.2,.2,4),MH); m(g,G('b',.25,.25,.3),MA,[0,0,2]);
          for(let i=0;i<6;i++) m(g,G('b',.22,.03,.06),MD,[0,0,-1.7+i*.7]);
          greeble(g,MD,0,.12,0,.15,.01,3.5,8,.02,.05);
        });
        addPart('STARBOARD BOOM ARM', V(2,.3,2.5), V(3,.5,2), 5, g => {
          m(g,G('b',.2,.2,4),MH); m(g,G('b',.25,.25,.3),MA,[0,0,2]);
          for(let i=0;i<6;i++) m(g,G('b',.22,.03,.06),MD,[0,0,-1.7+i*.7]);
          greeble(g,MD,0,.12,0,.15,.01,3.5,8,.02,.05);
        });
        addPart('PORT GRAPPLER CLAW', V(-2,.3,5), V(-2.5,1,3), 3, g => {
          m(g,G('b',.4,.3,.3),MA); // wrist
          m(g,G('b',.08,.5,.08),MD,[.12,-.3,.1],[0,0,.2]); m(g,G('b',.08,.5,.08),MD,[-.12,-.3,-.1],[0,0,-.2]);
          m(g,G('b',.08,.5,.08),MD,[0,-.3,.12],[.2,0,0]);
        });
        addPart('STARBOARD GRAPPLER CLAW', V(2,.3,5), V(2.5,1,3), 3, g => {
          m(g,G('b',.4,.3,.3),MA);
          m(g,G('b',.08,.5,.08),MD,[.12,-.3,.1],[0,0,.2]); m(g,G('b',.08,.5,.08),MD,[-.12,-.3,-.1],[0,0,-.2]);
          m(g,G('b',.08,.5,.08),MD,[0,-.3,.12],[.2,0,0]);
        });
        addPart('ORE HOPPER', V(0,-.9,0), V(0,-3,0), 4, g => {
          m(g,G('b',2,.6,2.5),MH); m(g,G('b',1.6,.4,2),MD,[0,0,0]);
          m(g,G('b',1.8,.04,2.3),MA,[0,-.32,0]);
          greeble(g,MD,0,-.32,0,1.5,.01,2,12,.03,.08);
        });
        addPart('ENGINE — INDUSTRIAL DRIVE', V(0,0,-3), V(0,0,-3), 4.5, g => {
          m(g,G('c',.6,.5,2,10),MH,[0,0,0],[PI2,0,0]);
          m(g,G('c',.5,.7,.6,10),MD,[0,0,-1.2],[PI2,0,0]);
          m(g,G('c',.65,.6,.3,10),MA,[0,0,.8],[PI2,0,0]);
          for(let i=0;i<6;i++){const a=(i/6)*PI*2;m(g,G('b',.02,.1,1.2),MD,[Math.cos(a)*.55,Math.sin(a)*.55,-.2],[0,0,a]);}
          greeble(g,MD,0,.5,0,.5,.01,1.5,10,.02,.06);
        });
        addPart('DRILL ARRAY', V(0,-.2,3.5), V(0,-.5,3), 4, g => {
          m(g,G('c',.35,.2,1.5,8),MH,[0,0,0],[PI2,0,0]); m(g,G('n',.15,1,8),MD,[0,0,1.2],[PI2,0,0]);
          for(let i=0;i<4;i++){const a=(i/4)*PI*2;m(g,G('c',.03,.03,.8,4),MD,[Math.cos(a)*.2,Math.sin(a)*.2,.4],[PI2,0,0]);}
        });
        addPart('RADIATOR ARRAY', V(0,1,-.5), V(0,2.5,0), 3.5, g => {
          for(let i=0;i<6;i++) m(g,G('b',1.8,.02,.3),MH,[0,i*.08,0]);
          m(g,G('b',.1,.5,.15),MA,[.85,0,0]); m(g,G('b',.1,.5,.15),MA,[-.85,0,0]);
        });
        addPart('CARGO FRAME', V(0,0,-1.5), V(0,-.5,-1.5), 3, g => {
          m(g,G('b',.08,.08,2),MH,[1,-.6,0]); m(g,G('b',.08,.08,2),MH,[-1,-.6,0]);
          m(g,G('b',.08,.08,2),MH,[1,.6,0]); m(g,G('b',.08,.08,2),MH,[-1,.6,0]);
          m(g,G('b',2.08,.08,.08),MH,[0,.6,1]); m(g,G('b',2.08,.08,.08),MH,[0,.6,-1]);
          m(g,G('b',2.08,.08,.08),MH,[0,-.6,1]); m(g,G('b',2.08,.08,.08),MH,[0,-.6,-1]);
        });
        addPart('TOWING CLAMP', V(0,0,-4.5), V(0,0,-2.5), 2.5, g => {
          m(g,G('b',.5,.4,.3),MA); m(g,G('b',.1,.6,.1),MD,[.2,0,.05],[0,0,.15]); m(g,G('b',.1,.6,.1),MD,[-.2,0,.05],[0,0,-.15]);
        });
      }

      // ═══════════════════════════════════════════════════════════════
      // MODEL GALLERY SYSTEM
      // ═══════════════════════════════════════════════════════════════
      const models = [
        { name: 'LEVIATHAN-IX', sub: 'HEAVY BATTLECRUISER', dwg: 'THI-2847-IX', build: buildLeviathan },
        { name: 'WHISPERWIND', sub: 'FAST INTERCEPTOR', dwg: 'THI-1103-WW', build: buildWhisperwind },
        { name: 'CATHEDRAL', sub: 'DREADNOUGHT-CLASS', dwg: 'THI-5520-CT', build: buildCathedral },
        { name: 'NOMAD', sub: 'SURVEY VESSEL', dwg: 'THI-3391-NM', build: buildNomad },
        { name: 'IRON WASP', sub: 'ATTACK GUNSHIP', dwg: 'THI-7704-IW', build: buildIronWasp },
        { name: 'VOID HARVESTER', sub: 'INDUSTRIAL MINING VESSEL', dwg: 'THI-9182-VH', build: buildVoidHarvester },
      ];

      let currentModel = Math.floor(Math.random() * models.length);
      let explodeAmount = 0, targetExplode = 0;
      let wireframeMode = false, xrayMode = false, autoSpin = false;
      let hoveredPart: Part | null = null;
      let modelLoadTime = 0;

      function loadModel(idx: number) {
        // Remove old parts
        parts.forEach(p => {
          p.group.traverse(c => { if (c.userData.isEdge && (c as T.LineSegments).material) ((c as T.LineSegments).material as T.Material).dispose(); });
          scene.remove(p.group);
        });
        parts.length = 0;

        // Build new model
        models[idx].build();
        currentModel = idx;
        modelLoadTime = clock.elapsedTime;

        // Reapply modes
        if (xrayMode) {
          sharedU.xrayAlpha.value = 0.12;
          parts.forEach(p => p.group.traverse(c => { if (c.userData.isEdge) (c as T.LineSegments).material = edgeMatStrong; }));
        }
        if (wireframeMode) {
          parts.forEach(p => p.group.traverse(c => {
            if ((c as T.Mesh).isMesh) { const mt = (c as T.Mesh).material as T.ShaderMaterial; if (mt.wireframe !== undefined) mt.wireframe = true; }
            if (c.userData.isEdge) c.visible = false;
          }));
        }

        // Update UI
        let tris = 0;
        scene.traverse(c => { const ms = c as T.Mesh; if (ms.isMesh && ms.geometry) tris += (ms.geometry.index ? ms.geometry.index.count / 3 : ms.geometry.attributes.position.count / 3); });
        const elName = document.getElementById('ship-name');
        const elSub = document.getElementById('ship-subtitle');
        const elCount = document.getElementById('ship-counter');
        const elParts = document.getElementById('mech-part-count');
        const elTris = document.getElementById('mech-tri-count');
        if (elName) elName.textContent = models[idx].name;
        if (elSub) elSub.textContent = `${models[idx].sub} — DWG. NO. ${models[idx].dwg}`;
        if (elCount) elCount.textContent = `${idx + 1} / ${models.length}`;
        if (elParts) elParts.textContent = String(parts.length);
        if (elTris) elTris.textContent = Math.round(tris).toLocaleString();
      }

      // Arrow key handler
      function onKeyDown(e: KeyboardEvent) {
        if (e.key === 'ArrowRight') { e.preventDefault(); loadModel((currentModel + 1) % models.length); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); loadModel((currentModel - 1 + models.length) % models.length); }
      }
      window.addEventListener('keydown', onKeyDown);

      // ── Raycasting ──
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();
      function onMouseMove(e: MouseEvent) { mouse.x = (e.clientX / window.innerWidth) * 2 - 1; mouse.y = -(e.clientY / window.innerHeight) * 2 + 1; }
      window.addEventListener('mousemove', onMouseMove);

      // ── UI button hookups ──
      function setupUI() {
        const btnA = document.getElementById('mech-btn-assembled');
        const btnE = document.getElementById('mech-btn-exploded');
        const btnW = document.getElementById('mech-btn-wireframe');
        const btnX = document.getElementById('mech-btn-xray');
        const btnS = document.getElementById('mech-btn-spin');
        const slider = document.getElementById('mech-sep-slider') as HTMLInputElement | null;
        const ib = 'rgba(26,26,24,0.08)', ia = 'rgba(26,26,24,0.2)';

        function upd() {
          [btnA,btnE,btnW,btnX,btnS].forEach(b => { if(b) b.style.background = ib; });
          if(targetExplode===0 && btnA) btnA.style.background = ia;
          if(targetExplode===1 && btnE) btnE.style.background = ia;
          if(wireframeMode && btnW) btnW.style.background = ia;
          if(xrayMode && btnX) btnX.style.background = ia;
          if(autoSpin && btnS) btnS.style.background = ia;
        }
        if(btnA) btnA.onclick=()=>{targetExplode=0;if(slider)slider.value='0';upd();};
        if(btnE) btnE.onclick=()=>{targetExplode=1;if(slider)slider.value='100';upd();};
        if(btnW) btnW.onclick=()=>{wireframeMode=!wireframeMode;parts.forEach(p=>p.group.traverse(c=>{if((c as T.Mesh).isMesh){const mt=(c as T.Mesh).material as T.ShaderMaterial;if(mt.wireframe!==undefined)mt.wireframe=wireframeMode;}if(c.userData.isEdge)c.visible=!wireframeMode;}));upd();};
        if(btnX) btnX.onclick=()=>{xrayMode=!xrayMode;sharedU.xrayAlpha.value=xrayMode?0.12:1;parts.forEach(p=>p.group.traverse(c=>{if(c.userData.isEdge)(c as T.LineSegments).material=xrayMode?edgeMatStrong:edgeMat;}));upd();};
        if(btnS) btnS.onclick=()=>{autoSpin=!autoSpin;upd();};
        if(slider) slider.oninput=()=>{targetExplode=parseInt(slider.value)/100;};
        upd();
      }
      setTimeout(setupUI, 100);

      // ── Render loop ──
      const clock = new THREE.Clock();
      let animId = 0;

      // Initial load
      loadModel(currentModel);

      function animate() {
        animId = requestAnimationFrame(animate);
        const dt = Math.min(clock.getDelta(), 0.05);
        const t = clock.elapsedTime;

        explodeAmount += (targetExplode - explodeAmount) * 3 * dt;
        parts.forEach(p => {
          const offset = p.explodeDir.clone().multiplyScalar(p.explodeDist * explodeAmount);
          p.group.position.copy(p.origin).add(offset);
        });

        // Scale-in animation on model switch
        const sinceLoad = t - modelLoadTime;
        if (sinceLoad < 0.4) {
          const s = Math.min(sinceLoad / 0.3, 1);
          const ease = 1 - Math.pow(1 - s, 3);
          parts.forEach(p => p.group.scale.setScalar(ease));
        } else {
          parts.forEach(p => p.group.scale.setScalar(1));
        }

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
          for (const p of parts) { let match = false; p.group.traverse(c => { if (c === intersects[0].object) match = true; }); if (match) { found = p; break; } }
          if (found && found !== hoveredPart) { hoveredPart = found; if (labelEl) { labelEl.textContent = found.name; labelEl.style.opacity = '1'; } }
        } else {
          if (hoveredPart) { hoveredPart = null; if (labelEl) labelEl.style.opacity = '0'; }
        }

        controls.update();
        renderer.render(scene, camera);
      }
      animate();
      setLoaded(true);

      function onResize() { camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); }
      window.addEventListener('resize', onResize);

      cleanup = () => {
        cancelAnimationFrame(animId);
        window.removeEventListener('resize', onResize);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('keydown', onKeyDown);
        controls.dispose(); renderer.dispose();
        if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      };
    })();

    return () => { if (cleanup) cleanup(); };
  }, []);

  return (
    <div className="relative w-full h-screen" style={{ background: '#f0ebe0' }}>
      <div ref={containerRef} className="absolute inset-0" />

      <div className="absolute inset-0 pointer-events-none z-10" style={{ fontFamily: "'Courier New', monospace", color: '#1a1a18' }}>
        {/* Top-left — small branding only */}
        <div className="absolute top-20 sm:top-24 left-6 sm:left-10">
          <div style={{ fontSize: '8px', letterSpacing: '0.35em', textTransform: 'uppercase', opacity: 0.3 }}>
            TARTARY HEAVY INDUSTRIES
          </div>
          <div style={{ fontSize: '8px', letterSpacing: '0.3em', textTransform: 'uppercase', opacity: 0.2, marginTop: '2px' }}>
            BUREAU OF NAVAL ARCHITECTURE
          </div>
        </div>

        {/* Top-right stats */}
        <div className="absolute top-20 sm:top-24 right-6 sm:right-10 text-right" style={{ fontSize: '8px', letterSpacing: '0.2em', opacity: 0.3 }}>
          DRAG TO ROTATE<br />SCROLL TO ZOOM<br /><br />
          COMPONENTS: <span id="mech-part-count">0</span><br />
          TRIANGLES: <span id="mech-tri-count">0</span>
        </div>

        {/* Part hover label */}
        <div id="mech-part-label" className="absolute left-1/2 -translate-x-1/2" style={{
          bottom: '80px', fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase',
          opacity: 0, transition: 'opacity 0.4s', background: 'rgba(240,235,224,0.9)', padding: '5px 14px',
          border: '1px solid rgba(26,26,24,0.12)',
        }} />

        {/* Bottom-left — ship name + navigation */}
        <div className="absolute bottom-6 sm:bottom-8 left-6 sm:left-10">
          <div style={{ fontSize: '7px', letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.3, marginBottom: '4px' }}>
            ← →&ensp;ARROW KEYS TO BROWSE
          </div>
          <div id="ship-name" style={{ fontSize: '14px', letterSpacing: '0.15em', fontWeight: 300, lineHeight: 1.2 }}>
            LEVIATHAN-IX
          </div>
          <div id="ship-subtitle" style={{ fontSize: '8px', letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.35, marginTop: '2px' }}>
            HEAVY BATTLECRUISER — DWG. NO. THI-2847-IX
          </div>
          <div id="ship-counter" style={{ fontSize: '8px', letterSpacing: '0.15em', opacity: 0.25, marginTop: '4px' }}>
            1 / 6
          </div>
        </div>

        {/* Bottom-center buttons */}
        <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3 pointer-events-auto">
          {[
            { id: 'mech-btn-assembled', label: 'ASSEMBLED' },
            { id: 'mech-btn-exploded', label: 'EXPLODED' },
            { id: 'mech-btn-wireframe', label: 'WIREFRAME' },
            { id: 'mech-btn-xray', label: 'X-RAY' },
            { id: 'mech-btn-spin', label: 'AUTO-SPIN' },
          ].map(btn => (
            <button key={btn.id} id={btn.id} style={{
              background: 'rgba(26,26,24,0.08)', border: '1px solid rgba(26,26,24,0.18)',
              color: '#1a1a18', padding: '7px 12px', fontFamily: "'Courier New', monospace",
              fontSize: '8px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, cursor: 'pointer', transition: 'all 0.3s',
            }}>
              {btn.label}
            </button>
          ))}
        </div>

        {/* Bottom-right slider */}
        <div className="absolute bottom-6 sm:bottom-8 right-6 sm:right-10 flex items-center gap-2 pointer-events-auto">
          <label style={{ fontSize: '7px', letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.35 }}>Separation</label>
          <input id="mech-sep-slider" type="range" min="0" max="100" defaultValue="0" style={{ width: '90px' }} />
        </div>

        {/* Drawing border frame */}
        <div className="absolute inset-4 sm:inset-6 pointer-events-none" style={{ border: '1px solid rgba(26,26,24,0.1)' }} />
        <div className="absolute inset-5 sm:inset-7 pointer-events-none" style={{ border: '1px solid rgba(26,26,24,0.05)' }} />
      </div>

      {!loaded && (
        <div className="absolute inset-0 z-20 flex items-center justify-center" style={{ background: '#f0ebe0' }}>
          <div className="text-center">
            <p style={{ fontFamily: "'Courier New', monospace", color: '#1a1a18', fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase', opacity: 0.4 }}>
              RENDERING TECHNICAL ILLUSTRATION...
            </p>
            <div className="w-48 h-[1px] mx-auto mt-4 relative overflow-hidden" style={{ background: 'rgba(26,26,24,0.1)' }}>
              <div className="absolute top-0 left-0 h-full w-1/3 animate-pulse" style={{ background: 'rgba(26,26,24,0.25)' }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
