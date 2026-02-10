'use client';

import { useEffect, useRef, useState } from 'react';
import type * as T from 'three';

// ═══════════════════════════════════════════════════════════════
// TARTARY IMPERIAL AERONAUTICS — AIRSHIP ENGINEERING GALLERY
// 6 Zeppelin-Aircraft Fusions — Cross-Hatching on Cream Paper
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

      let _seed = 42;
      function sr() { _seed = (_seed * 16807) % 2147483647; return (_seed - 1) / 2147483646; }
      function srr(a: number, b: number) { return a + sr() * (b - a); }

      function greeble(g: T.Group, mat: T.Material, cx: number, cy: number, cz: number, w: number, h: number, d: number, n: number, sMin: number, sMax: number) {
        for (let i = 0; i < n; i++) m(g, G('b', srr(sMin, sMax), srr(sMin, sMax) * .5, srr(sMin, sMax)), mat, [cx + srr(-w/2, w/2), cy + srr(-h/2, h/2), cz + srr(-d/2, d/2)]);
      }

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
      // MODEL 1: LEVIATHAN-IX — IMPERIAL DREADNOUGHT AIRSHIP
      // ═══════════════════════════════════════════════════════════════
      function buildLeviathan() {
        _seed = 42;
        addPart('GAS ENVELOPE — FORWARD DOME', V(0,2.5,4), V(0,1,2.5), 4, g => {
          m(g,G('s',2.2,14,10),MH,[0,0,0],[0,0,0],[1,.85,1.3]);
          for(let i=0;i<8;i++){const a=(i/8)*PI*2; m(g,G('b',.015,.015,2.5),MD,[Math.cos(a)*2,Math.sin(a)*1.8,0]);}
          greeble(g,MD,0,.5,.5,1.5,.01,2,12,.02,.06);
        });
        addPart('GAS ENVELOPE — CENTRAL BARREL', V(0,2.5,0), V(0,1.5,0), 3.5, g => {
          m(g,G('c',2.4,2.4,6,16),MH);
          for(let i=0;i<12;i++){const a=(i/12)*PI*2; m(g,G('b',.012,.012,5.8),MD,[Math.cos(a)*2.42,Math.sin(a)*2.42,0]);}
          greeble(g,MD,0,1.5,0,2,.01,4.5,20,.02,.08); greeble(g,MD,0,-1.5,0,2,.01,4.5,15,.02,.07);
        });
        addPart('GAS ENVELOPE — AFT TAPER', V(0,2.5,-4.5), V(0,1,-2.5), 4, g => {
          m(g,G('n',2.2,4,14),MH,[0,0,0],[-PI2,0,0]);
          for(let i=0;i<6;i++){const a=(i/6)*PI*2; m(g,G('b',.012,.012,3),MD,[Math.cos(a)*1.2,Math.sin(a)*1.2,-1]);}
          greeble(g,MD,0,0,-1.5,1,.01,2.5,8,.02,.05);
        });
        addPart('STRUCTURAL RING — FRAME 7', V(0,2.5,2), V(0,2,.5), 3, g => {
          m(g,G('t',2.5,.06,10,28),MH,[0,0,0],[PI2,0,0]); m(g,G('t',2.5,.03,8,24),MA,[0,0,0],[PI2,0,0]);
          for(let i=0;i<8;i++){const a=(i/8)*PI*2; m(g,G('b',.04,.04,.08),MD,[Math.cos(a)*2.5,Math.sin(a)*2.5,0]);}
        });
        addPart('STRUCTURAL RING — FRAME 14', V(0,2.5,-1.5), V(0,2,-.3), 3, g => {
          m(g,G('t',2.5,.06,10,28),MH,[0,0,0],[PI2,0,0]); m(g,G('t',2.5,.03,8,24),MA,[0,0,0],[PI2,0,0]);
          for(let i=0;i<8;i++){const a=(i/8)*PI*2; m(g,G('b',.04,.04,.08),MD,[Math.cos(a)*2.5,Math.sin(a)*2.5,0]);}
        });
        addPart('KEEL TRUSS — CENTRAL WALKWAY', V(0,.5,0), V(0,-1.5,0), 3.5, g => {
          m(g,G('b',.3,.2,9),MH);
          for(let z=-4;z<=4;z+=.6) m(g,G('b',.25,.03,.06),MD,[0,-.12,z]);
          m(g,G('b',.08,.08,8.5),MA,[.12,.08,0]); m(g,G('b',.08,.08,8.5),MA,[-.12,.08,0]);
          greeble(g,MD,0,.12,0,.2,.01,7,15,.02,.05);
        });
        addPart('COMMAND GONDOLA — MAIN DECK', V(0,-.8,.5), V(0,-3,.5), 5, g => {
          m(g,G('b',2,.8,3),MH); m(g,G('b',1.8,.12,2.8),MH,[0,.42,0]); m(g,G('b',1.8,.12,2.8),MH,[0,-.42,0]);
          for(let z=-1;z<=1;z+=.3){m(g,G('s',.015,4,3),MD,[1.02,.2,z]);m(g,G('s',.015,4,3),MD,[-1.02,.2,z]);}
          greeble(g,MD,0,.42,0,1.5,.01,2.5,20,.03,.1);
        });
        addPart('BRIDGE TOWER — GOTHIC SPIRE', V(0,.2,1), V(0,-2,1.5), 4, g => {
          m(g,G('b',.8,.6,.8),MH); m(g,G('b',.6,.5,.6),MH,[0,.5,0]); m(g,G('b',.4,.8,.4),MH,[0,1.1,0]);
          m(g,G('n',.15,.6,6),MH,[0,1.7,0]);
          for(let i=-2;i<=2;i++) m(g,G('b',.06,.02,.03),MD,[i*.1,.35,.42]);
          m(g,G('c',.03,.02,.5,4),MD,[0,2.1,0]); m(g,G('s',.04,4,3),MA,[0,2.35,0]);
          greeble(g,MD,0,.8,0,.5,.01,.6,8,.02,.05);
        });
        addPart('PORT FORWARD NACELLE', V(-3.2,1.8,-1), V(-2.5,0,-.5), 5, g => {
          m(g,G('c',.5,.4,2.5,10),MH,[0,0,0],[PI2,0,0]);
          m(g,G('c',.55,.5,.25,10),MA,[0,0,1],[PI2,0,0]);
          m(g,G('c',.12,.12,.1,6),MD,[0,0,-1.4],[PI2,0,0]);
          for(let i=0;i<4;i++){const a=(i/4)*PI*2; m(g,G('b',.45,.015,.05),MD,[Math.cos(a)*.2,Math.sin(a)*.2,-1.5],[0,0,a]);}
          greeble(g,MD,0,.4,0,.4,.01,2,8,.02,.05);
        });
        addPart('STBD FORWARD NACELLE', V(3.2,1.8,-1), V(2.5,0,-.5), 5, g => {
          m(g,G('c',.5,.4,2.5,10),MH,[0,0,0],[PI2,0,0]);
          m(g,G('c',.55,.5,.25,10),MA,[0,0,1],[PI2,0,0]);
          m(g,G('c',.12,.12,.1,6),MD,[0,0,-1.4],[PI2,0,0]);
          for(let i=0;i<4;i++){const a=(i/4)*PI*2; m(g,G('b',.45,.015,.05),MD,[Math.cos(a)*.2,Math.sin(a)*.2,-1.5],[0,0,a]);}
          greeble(g,MD,0,.4,0,.4,.01,2,8,.02,.05);
        });
        addPart('PORT AFT NACELLE', V(-2.8,2,-3.5), V(-2.5,.5,-1.5), 5, g => {
          m(g,G('c',.45,.35,2,10),MH,[0,0,0],[PI2,0,0]);
          m(g,G('c',.5,.45,.2,10),MA,[0,0,.8],[PI2,0,0]);
          for(let i=0;i<3;i++){const a=(i/3)*PI*2; m(g,G('b',.4,.015,.04),MD,[Math.cos(a)*.15,Math.sin(a)*.15,-1.3],[0,0,a]);}
        });
        addPart('STBD AFT NACELLE', V(2.8,2,-3.5), V(2.5,.5,-1.5), 5, g => {
          m(g,G('c',.45,.35,2,10),MH,[0,0,0],[PI2,0,0]);
          m(g,G('c',.5,.45,.2,10),MA,[0,0,.8],[PI2,0,0]);
          for(let i=0;i<3;i++){const a=(i/3)*PI*2; m(g,G('b',.4,.015,.04),MD,[Math.cos(a)*.15,Math.sin(a)*.15,-1.3],[0,0,a]);}
        });
        addPart('PORT BROADSIDE GALLERY', V(-2.5,.5,0), V(-3,.5,0), 4, g => {
          m(g,G('b',.6,.5,3.5),MH);
          for(let z=-1.2;z<=1.2;z+=.4) m(g,G('c',.05,.04,.8,6),MD,[-.32,.1,z],[0,0,PI2]);
          greeble(g,MD,0,.25,0,.4,.01,3,12,.02,.06);
        });
        addPart('STBD BROADSIDE GALLERY', V(2.5,.5,0), V(3,.5,0), 4, g => {
          m(g,G('b',.6,.5,3.5),MH);
          for(let z=-1.2;z<=1.2;z+=.4) m(g,G('c',.05,.04,.8,6),MD,[.32,.1,z],[0,0,PI2]);
          greeble(g,MD,0,.25,0,.4,.01,3,12,.02,.06);
        });
        addPart('DORSAL OBSERVATORY DOME', V(0,5.2,.5), V(0,3,.3), 4, g => {
          m(g,G('s',.6,10,8),MH,[0,0,0],[0,0,0],[1,.5,1]);
          m(g,G('t',.55,.025,8,20),MA,[0,-.1,0],[PI2,0,0]);
          m(g,G('c',.08,.06,.3,6),MD,[0,.28,0]); m(g,G('s',.04,4,3),MA,[0,.42,0]);
          for(let i=0;i<6;i++){const a=(i/6)*PI*2; m(g,G('b',.015,.18,.015),MD,[Math.cos(a)*.5,0,Math.sin(a)*.5]);}
        });
        addPart('GOTHIC SPIRE — AFT TOWER', V(0,5,-2), V(0,3,-.5), 3.5, g => {
          m(g,G('b',.3,.4,.3),MH); m(g,G('b',.2,1,.2),MA,[0,.6,0]); m(g,G('n',.1,.5,6),MH,[0,1.3,0]);
          greeble(g,MD,0,.3,0,.2,.01,.3,6,.02,.04);
        });
        addPart('RUDDER — VERTICAL FIN', V(0,2.5,-7), V(0,1.5,-2.5), 4, g => {
          m(g,G('b',.06,2,1.5),MH); m(g,G('b',.04,1.6,1.2),MA,[0,.2,0]);
          m(g,G('s',.03,4,3),MD,[0,1.02,0]);
        });
        addPart('ELEVATOR — PORT', V(-1.5,2.5,-6.5), V(-1.5,.5,-2), 3.5, g => {
          m(g,G('b',1.5,.06,1),MH); m(g,G('b',1.3,.04,.8),MA,[0,.04,0]);
        });
        addPart('ELEVATOR — STARBOARD', V(1.5,2.5,-6.5), V(1.5,.5,-2), 3.5, g => {
          m(g,G('b',1.5,.06,1),MH); m(g,G('b',1.3,.04,.8),MA,[0,.04,0]);
        });
        addPart('MOORING CONE — BOW', V(0,2.5,6.5), V(0,.5,3), 4.5, g => {
          m(g,G('n',.4,1.5,8),MH,[0,0,0],[PI2,0,0]);
          m(g,G('t',.35,.03,6,16),MA,[0,0,-.3],[PI2,0,0]);
          m(g,G('c',.06,.06,.3,4),MD,[0,-.25,-.5]);
        });
        addPart('STEAM MANIFOLD — PORT', V(-2.5,3.5,0), V(-2,.8,0), 3, g => {
          for(let z=-.8;z<=.8;z+=.4){m(g,G('c',.04,.04,.6,6),MD,[0,0,z],[PI2,0,0]); m(g,G('c',.06,.06,.04,6),MA,[0,0,z+.2],[PI2,0,0]);}
          m(g,G('b',.08,.08,2),MD,[0,.06,0]);
        });
        addPart('STEAM MANIFOLD — STBD', V(2.5,3.5,0), V(2,.8,0), 3, g => {
          for(let z=-.8;z<=.8;z+=.4){m(g,G('c',.04,.04,.6,6),MD,[0,0,z],[PI2,0,0]); m(g,G('c',.06,.06,.04,6),MA,[0,0,z+.2],[PI2,0,0]);}
          m(g,G('b',.08,.08,2),MD,[0,.06,0]);
        });
        addPart('BALLAST TANK — FORWARD', V(0,1,3), V(0,-1.5,1.5), 3, g => {
          m(g,G('c',.3,.3,1.5,8),MH,[0,0,0],[PI2,0,0]);
          m(g,G('c',.35,.35,.1,8),MA,[0,0,.6],[PI2,0,0]); m(g,G('c',.35,.35,.1,8),MA,[0,0,-.6],[PI2,0,0]);
        });
        addPart('BALLAST TANK — AFT', V(0,1,-3), V(0,-1.5,-1.5), 3, g => {
          m(g,G('c',.3,.3,1.5,8),MH,[0,0,0],[PI2,0,0]);
          m(g,G('c',.35,.35,.1,8),MA,[0,0,.6],[PI2,0,0]); m(g,G('c',.35,.35,.1,8),MA,[0,0,-.6],[PI2,0,0]);
        });
        addPart('SIGNAL MAST — DORSAL', V(0,5.5,-1), V(0,2.5,-.3), 2.5, g => {
          m(g,G('c',.025,.02,.8,4),MD); m(g,G('s',.03,4,3),MA,[0,.42,0]);
          m(g,G('b',.3,.015,.015),MD,[0,.2,0]); m(g,G('b',.2,.015,.015),MD,[0,.35,0]);
        });
      }

      // ═══════════════════════════════════════════════════════════════
      // MODEL 2: WHISPERWIND — PHANTOM CORSAIR AIRSHIP
      // ═══════════════════════════════════════════════════════════════
      function buildWhisperwind() {
        _seed = 137;
        addPart('ENVELOPE — STREAMLINED HULL', V(0,2,0), V(0,1.5,0), 3.5, g => {
          m(g,G('c',1.6,1.6,7,14),MH); m(g,G('s',1.6,12,8),MH,[0,0,3.8],[0,0,0],[1,.9,.6]);
          for(let i=0;i<8;i++){const a=(i/8)*PI*2; m(g,G('b',.01,.01,7.5),MD,[Math.cos(a)*1.62,Math.sin(a)*1.62,-.2]);}
          greeble(g,MD,0,1,0,1.2,.01,5,18,.02,.07);
        });
        addPart('ENVELOPE — AFT CONE', V(0,2,-5), V(0,1,-2), 4, g => {
          m(g,G('n',1.5,3.5,12),MH,[0,0,0],[-PI2,0,0]);
          for(let i=0;i<6;i++){const a=(i/6)*PI*2; m(g,G('b',.01,.01,2.5),MD,[Math.cos(a)*.8,Math.sin(a)*.8,-.5]);}
        });
        addPart('STRUCTURAL RING — FORWARD', V(0,2,2.5), V(0,2,.5), 3, g => {
          m(g,G('t',1.65,.04,8,24),MH,[0,0,0],[PI2,0,0]); m(g,G('t',1.65,.02,6,20),MA,[0,0,0],[PI2,0,0]);
        });
        addPart('STRUCTURAL RING — AFT', V(0,2,-2), V(0,2,-.5), 3, g => {
          m(g,G('t',1.65,.04,8,24),MH,[0,0,0],[PI2,0,0]); m(g,G('t',1.65,.02,6,20),MA,[0,0,0],[PI2,0,0]);
        });
        addPart('KEEL — SPINE', V(0,.6,0), V(0,-1.5,0), 3, g => {
          m(g,G('b',.15,.12,8),MH); m(g,G('b',.06,.06,7.5),MA,[.06,.05,0]); m(g,G('b',.06,.06,7.5),MA,[-.06,.05,0]);
          for(let z=-3.5;z<=3.5;z+=.5) m(g,G('b',.12,.02,.04),MD,[0,-.07,z]);
        });
        addPart('CORSAIR GONDOLA', V(0,-.5,.8), V(0,-3,.5), 4.5, g => {
          m(g,G('b',1,.5,2),MH); m(g,G('b',.8,.15,1.8),MH,[0,.28,0]);
          for(let z=-.6;z<=.6;z+=.25) m(g,G('s',.012,4,3),MD,[.52,.12,z]);
          greeble(g,MD,0,.28,0,.7,.01,1.5,12,.02,.06);
        });
        addPart('COCKPIT — OBSERVATION BUBBLE', V(0,.1,2.2), V(0,-1.5,2), 3.5, g => {
          m(g,G('s',.3,10,8),MH,[0,0,0],[0,0,0],[1.2,.5,1]);
          for(let i=-2;i<=2;i++) m(g,G('b',.06,.01,.15),MD,[i*.1,.13,.2]);
          m(g,G('b',.4,.03,.6),MA,[0,-.14,0]);
        });
        addPart('PORT ENGINE — VECTORING', V(-2,1.2,-3.5), V(-2.5,.5,-1.5), 5, g => {
          m(g,G('c',.4,.3,2.5,10),MH,[0,0,0],[PI2,0,0]);
          m(g,G('c',.45,.4,.2,10),MA,[0,0,1],[PI2,0,0]);
          m(g,G('c',.1,.1,.08,6),MD,[0,0,-1.4],[PI2,0,0]);
          for(let i=0;i<4;i++){const a=(i/4)*PI*2; m(g,G('b',.5,.012,.04),MD,[Math.cos(a)*.18,Math.sin(a)*.18,-1.5],[0,0,a]);}
          greeble(g,MD,0,.3,0,.3,.01,2,8,.02,.05);
        });
        addPart('STBD ENGINE — VECTORING', V(2,1.2,-3.5), V(2.5,.5,-1.5), 5, g => {
          m(g,G('c',.4,.3,2.5,10),MH,[0,0,0],[PI2,0,0]);
          m(g,G('c',.45,.4,.2,10),MA,[0,0,1],[PI2,0,0]);
          m(g,G('c',.1,.1,.08,6),MD,[0,0,-1.4],[PI2,0,0]);
          for(let i=0;i<4;i++){const a=(i/4)*PI*2; m(g,G('b',.5,.012,.04),MD,[Math.cos(a)*.18,Math.sin(a)*.18,-1.5],[0,0,a]);}
          greeble(g,MD,0,.3,0,.3,.01,2,8,.02,.05);
        });
        addPart('PORT SWEPT FIN', V(-1.2,2,-5.5), V(-1.5,1,-1.5), 3.5, g => {
          m(g,G('b',1.2,.05,1.2),MH); m(g,G('b',1,.03,1),MA,[0,.03,0]);
          m(g,G('s',.02,4,3),MD,[-.6,.03,0]);
        });
        addPart('STBD SWEPT FIN', V(1.2,2,-5.5), V(1.5,1,-1.5), 3.5, g => {
          m(g,G('b',1.2,.05,1.2),MH); m(g,G('b',1,.03,1),MA,[0,.03,0]);
          m(g,G('s',.02,4,3),MD,[.6,.03,0]);
        });
        addPart('DORSAL FIN — VERTICAL', V(0,3.5,-5), V(0,2.5,-1.5), 3, g => {
          m(g,G('b',.05,1.5,1.5),MH); m(g,G('b',.04,1.2,1.2),MA,[0,.15,0]);
          m(g,G('s',.025,4,3),MD,[0,.78,0]);
        });
        addPart('VENTRAL FIN', V(0,.5,-5), V(0,-1.5,-1.5), 3, g => {
          m(g,G('b',.05,.8,1),MH); m(g,G('b',.04,.6,.8),MA,[0,-.1,0]);
        });
        addPart('NOSE LANCE — SENSOR PROBE', V(0,2,5.5), V(0,.5,3), 4, g => {
          m(g,G('c',.08,.04,2,6),MH,[0,0,0],[PI2,0,0]);
          m(g,G('s',.06,6,4),MA,[0,0,1.2]); m(g,G('t',.12,.015,6,12),MD,[0,0,.5],[PI2,0,0]);
        });
        addPart('PORT CANARD WING', V(-1.5,1.5,3), V(-2,.5,1.5), 3, g => {
          m(g,G('b',1,.04,.6),MH); m(g,G('b',.8,.03,.5),MA,[0,.03,0]);
          greeble(g,MD,0,.03,0,.7,.01,.4,6,.02,.04);
        });
        addPart('STBD CANARD WING', V(1.5,1.5,3), V(2,.5,1.5), 3, g => {
          m(g,G('b',1,.04,.6),MH); m(g,G('b',.8,.03,.5),MA,[0,.03,0]);
          greeble(g,MD,0,.03,0,.7,.01,.4,6,.02,.04);
        });
        addPart('TARTARIAN LANTERN — PORT', V(-1.6,3.5,0), V(-1.5,1.5,0), 2.5, g => {
          m(g,G('c',.08,.08,.25,6),MH); m(g,G('s',.1,6,4),MA,[0,.15,0]); m(g,G('n',.06,.15,6),MH,[0,.25,0]);
          m(g,G('c',.015,.015,.15,4),MD,[0,-.18,0]);
        });
        addPart('TARTARIAN LANTERN — STBD', V(1.6,3.5,0), V(1.5,1.5,0), 2.5, g => {
          m(g,G('c',.08,.08,.25,6),MH); m(g,G('s',.1,6,4),MA,[0,.15,0]); m(g,G('n',.06,.15,6),MH,[0,.25,0]);
          m(g,G('c',.015,.015,.15,4),MD,[0,-.18,0]);
        });
        addPart('STEAM EXHAUST — AFT', V(0,3,-3.5), V(0,2,-1), 2.5, g => {
          m(g,G('c',.06,.04,.5,6),MD,[0,0,0]); m(g,G('c',.08,.06,.06,6),MA,[0,0,.2]);
          m(g,G('c',.06,.04,.5,6),MD,[.15,0,0]); m(g,G('c',.08,.06,.06,6),MA,[.15,0,.2]);
        });
        addPart('GRAPPLING ANCHOR', V(0,-1,-.5), V(0,-2.5,-.3), 2.5, g => {
          m(g,G('b',.15,.1,.15),MA); m(g,G('c',.015,.015,.4,4),MD,[0,-.2,0]);
          m(g,G('b',.08,.02,.15),MD,[0,-.4,.05],[.2,0,0]); m(g,G('b',.08,.02,.15),MD,[0,-.4,-.05],[-.2,0,0]);
        });
      }

      // ═══════════════════════════════════════════════════════════════
      // MODEL 3: CATHEDRAL — GRAND BASILICA AIRSHIP
      // ═══════════════════════════════════════════════════════════════
      function buildCathedral() {
        _seed = 271;
        addPart('ENVELOPE — GRAND DOME FORWARD', V(0,3.5,3.5), V(0,1.5,2), 4, g => {
          m(g,G('s',3,14,10),MH,[0,0,0],[0,0,0],[1,.75,1.1]);
          for(let i=0;i<10;i++){const a=(i/10)*PI*2; m(g,G('b',.018,.018,3),MD,[Math.cos(a)*2.8,Math.sin(a)*2.1,0]);}
          greeble(g,MD,0,1,0,2,.01,2,15,.02,.07);
        });
        addPart('ENVELOPE — CENTRAL VAULT', V(0,3.5,0), V(0,2,0), 3.5, g => {
          m(g,G('c',3.2,3.2,5.5,16),MH);
          for(let i=0;i<14;i++){const a=(i/14)*PI*2; m(g,G('b',.015,.015,5.2),MD,[Math.cos(a)*3.22,Math.sin(a)*3.22,0]);}
          greeble(g,MD,0,2,0,2.5,.01,4,25,.02,.08);
        });
        addPart('ENVELOPE — AFT NAVE', V(0,3.5,-4), V(0,1.5,-2), 4, g => {
          m(g,G('n',3,3.5,14),MH,[0,0,0],[-PI2,0,0]);
          for(let i=0;i<8;i++){const a=(i/8)*PI*2; m(g,G('b',.015,.015,2.5),MD,[Math.cos(a)*1.5,Math.sin(a)*1.5,-1]);}
        });
        addPart('STRUCTURAL RING — TRANSEPT A', V(0,3.5,1.5), V(0,2.5,.5), 3, g => {
          m(g,G('t',3.3,.08,10,32),MH,[0,0,0],[PI2,0,0]);
          for(let i=0;i<12;i++){const a=(i/12)*PI*2; m(g,G('b',.05,.05,.1),MD,[Math.cos(a)*3.3,Math.sin(a)*3.3,0]);}
        });
        addPart('STRUCTURAL RING — TRANSEPT B', V(0,3.5,-1.5), V(0,2.5,-.5), 3, g => {
          m(g,G('t',3.3,.08,10,32),MH,[0,0,0],[PI2,0,0]);
          for(let i=0;i<12;i++){const a=(i/12)*PI*2; m(g,G('b',.05,.05,.1),MD,[Math.cos(a)*3.3,Math.sin(a)*3.3,0]);}
        });
        addPart('CATHEDRAL GONDOLA — NAVE', V(0,-.5,0), V(0,-3.5,0), 5, g => {
          m(g,G('b',2.5,1.2,4),MH); m(g,G('b',2.2,.15,3.8),MH,[0,.62,0]); m(g,G('b',2.2,.15,3.8),MH,[0,-.62,0]);
          m(g,G('b',.15,1,3.8),MH,[1.28,0,0]); m(g,G('b',.15,1,3.8),MH,[-1.28,0,0]);
          for(let z=-1.5;z<=1.5;z+=.3){m(g,G('s',.02,4,3),MD,[1.3,.3,z]);m(g,G('s',.02,4,3),MD,[-1.3,.3,z]);}
          greeble(g,MD,0,.62,0,2,.01,3.5,25,.03,.1);
        });
        addPart('CATHEDRAL GONDOLA — TRANSEPT', V(0,-.2,0), V(0,-2.5,0), 4, g => {
          m(g,G('b',3.5,.8,1.5),MH); m(g,G('b',3.2,.1,1.3),MA,[0,.42,0]);
          greeble(g,MD,0,.42,0,3,.01,1.2,15,.03,.08);
        });
        addPart('GREAT SPIRE — CENTRAL', V(0,1,.5), V(0,-2,1), 4.5, g => {
          m(g,G('b',.5,.6,.5),MH); m(g,G('b',.35,1.5,.35),MA,[0,.9,0]); m(g,G('n',.18,1.2,6),MH,[0,2,0]);
          m(g,G('c',.02,.015,.3,4),MD,[0,2.8,0]); m(g,G('s',.03,4,3),MA,[0,3,0]);
          greeble(g,MD,0,.5,0,.3,.01,.4,6,.02,.04);
        });
        addPart('SPIRE — PORT TRANSEPT', V(-2,.2,.5), V(-2.5,-1.5,.5), 3.5, g => {
          m(g,G('b',.3,.4,.3),MH); m(g,G('b',.2,.8,.2),MA,[0,.5,0]); m(g,G('n',.1,.5,6),MH,[0,1.1,0]);
        });
        addPart('SPIRE — STBD TRANSEPT', V(2,.2,.5), V(2.5,-1.5,.5), 3.5, g => {
          m(g,G('b',.3,.4,.3),MH); m(g,G('b',.2,.8,.2),MA,[0,.5,0]); m(g,G('n',.1,.5,6),MH,[0,1.1,0]);
        });
        addPart('FLYING BUTTRESS — PORT', V(-2.5,1.5,0), V(-2.5,0,0), 3, g => {
          m(g,G('b',.08,.08,3),MH,[0,0,0],[0,0,.4]); m(g,G('b',.08,.08,3),MH,[.3,.3,0],[0,0,.4]);
          for(let z=-1;z<=1;z+=.5) m(g,G('b',.06,.3,.06),MD,[.15,.15,z]);
        });
        addPart('FLYING BUTTRESS — STBD', V(2.5,1.5,0), V(2.5,0,0), 3, g => {
          m(g,G('b',.08,.08,3),MH,[0,0,0],[0,0,-.4]); m(g,G('b',.08,.08,3),MH,[-.3,.3,0],[0,0,-.4]);
          for(let z=-1;z<=1;z+=.5) m(g,G('b',.06,.3,.06),MD,[-.15,.15,z]);
        });
        addPart('ROSE WINDOW — FORE', V(0,.2,2.5), V(0,-1.5,2.5), 3, g => {
          m(g,G('t',.4,.03,8,20),MH,[0,0,0],[PI2,0,0]); m(g,G('t',.25,.02,6,16),MA,[0,0,0],[PI2,0,0]);
          for(let i=0;i<6;i++){const a=(i/6)*PI*2; m(g,G('b',.015,.015,.38),MD,[0,0,0],[Math.cos(a)*.2,Math.sin(a)*.2,a]);}
        });
        addPart('PORT TRIPLE ENGINE', V(-3.5,2,-2), V(-3,.5,-1), 5, g => {
          for(let dy=-.3;dy<=.3;dy+=.3){
            m(g,G('c',.25,.2,1.5,8),MH,[0,dy,0],[PI2,0,0]);
            m(g,G('c',.1,.1,.06,6),MD,[0,dy,-.9],[PI2,0,0]);
            for(let i=0;i<3;i++){const a=(i/3)*PI*2; m(g,G('b',.25,.01,.03),MD,[Math.cos(a)*.08,dy+Math.sin(a)*.08,-1],[0,0,a]);}
          }
        });
        addPart('STBD TRIPLE ENGINE', V(3.5,2,-2), V(3,.5,-1), 5, g => {
          for(let dy=-.3;dy<=.3;dy+=.3){
            m(g,G('c',.25,.2,1.5,8),MH,[0,dy,0],[PI2,0,0]);
            m(g,G('c',.1,.1,.06,6),MD,[0,dy,-.9],[PI2,0,0]);
            for(let i=0;i<3;i++){const a=(i/3)*PI*2; m(g,G('b',.25,.01,.03),MD,[Math.cos(a)*.08,dy+Math.sin(a)*.08,-1],[0,0,a]);}
          }
        });
        addPart('BELL TOWER — PORT', V(-1.8,0,-2), V(-2,-2,-1), 3, g => {
          m(g,G('c',.15,.2,.6,6),MH); m(g,G('n',.18,.3,6),MH,[0,.4,0]);
          m(g,G('s',.06,6,4),MD,[0,.1,0]);
        });
        addPart('BELL TOWER — STBD', V(1.8,0,-2), V(2,-2,-1), 3, g => {
          m(g,G('c',.15,.2,.6,6),MH); m(g,G('n',.18,.3,6),MH,[0,.4,0]);
          m(g,G('s',.06,6,4),MD,[0,.1,0]);
        });
        addPart('KEEL — PROCESSIONAL WALK', V(0,.8,0), V(0,-1,0), 3, g => {
          m(g,G('b',.25,.15,8),MH);
          for(let z=-3.5;z<=3.5;z+=.5) m(g,G('b',.2,.025,.04),MD,[0,-.08,z]);
          m(g,G('b',.04,.04,7.5),MA,[.1,.06,0]); m(g,G('b',.04,.04,7.5),MA,[-.1,.06,0]);
        });
        addPart('CENSER — PORT', V(-1.5,-1.2,1.5), V(-1.5,-2,1), 2.5, g => {
          m(g,G('c',.015,.015,.5,4),MD,[0,.25,0]); m(g,G('s',.08,6,4),MH);
          m(g,G('n',.06,.12,6),MH,[0,.1,0]);
        });
        addPart('CENSER — STBD', V(1.5,-1.2,1.5), V(1.5,-2,1), 2.5, g => {
          m(g,G('c',.015,.015,.5,4),MD,[0,.25,0]); m(g,G('s',.08,6,4),MH);
          m(g,G('n',.06,.12,6),MH,[0,.1,0]);
        });
        addPart('RUDDER — CROSS FIN', V(0,3.5,-6.5), V(0,2,-2.5), 3.5, g => {
          m(g,G('b',.06,2.2,1.5),MH); m(g,G('b',.04,1.8,1.2),MA,[0,.2,0]);
        });
        addPart('ELEVATOR — PORT', V(-2,3.5,-6), V(-2,1,-2), 3, g => {
          m(g,G('b',1.5,.05,1),MH); m(g,G('b',1.3,.03,.8),MA,[0,.03,0]);
        });
        addPart('ELEVATOR — STBD', V(2,3.5,-6), V(2,1,-2), 3, g => {
          m(g,G('b',1.5,.05,1),MH); m(g,G('b',1.3,.03,.8),MA,[0,.03,0]);
        });
        addPart('MOORING SPIRE — BOW', V(0,3.5,6), V(0,1,3), 4, g => {
          m(g,G('n',.5,2,8),MH,[0,0,0],[PI2,0,0]);
          m(g,G('t',.45,.04,6,16),MA,[0,0,-.5],[PI2,0,0]);
          m(g,G('n',.08,.4,6),MH,[0,0,1.2],[PI2,0,0]);
        });
        addPart('SIGNAL LANTERN — DORSAL', V(0,7,0), V(0,3,0), 3, g => {
          m(g,G('c',.06,.06,.2,6),MH); m(g,G('s',.08,6,4),MA,[0,.12,0]);
          m(g,G('n',.05,.1,6),MH,[0,.2,0]); m(g,G('c',.01,.01,.3,4),MD,[0,-.15,0]);
        });
      }

      // ═══════════════════════════════════════════════════════════════
      // MODEL 4: NOMAD — EXPLORER CLOUDSHIP
      // ═══════════════════════════════════════════════════════════════
      function buildNomad() {
        _seed = 389;
        addPart('ENVELOPE — BULBOUS MAIN', V(0,2.5,0), V(0,1.5,0), 3.5, g => {
          m(g,G('s',2.5,14,10),MH,[0,0,0],[0,0,0],[1,.8,1.4]);
          for(let i=0;i<10;i++){const a=(i/10)*PI*2; m(g,G('b',.015,.015,5),MD,[Math.cos(a)*2.3,Math.sin(a)*1.85,0]);}
          greeble(g,MD,0,1,0,1.8,.01,4,20,.02,.07);
        });
        addPart('ENVELOPE — FORWARD BLISTER', V(0,2.5,4.5), V(0,1,2.5), 4, g => {
          m(g,G('s',1.8,12,8),MH,[0,0,0],[0,0,0],[1,.75,.8]);
          greeble(g,MD,0,.5,.3,1,.01,1.2,8,.02,.05);
        });
        addPart('ENVELOPE — AFT SKIRT', V(0,2.5,-4), V(0,1,-2), 3.5, g => {
          m(g,G('c',2.2,1.2,3.5,12),MH,[0,0,0]);
          for(let i=0;i<6;i++){const a=(i/6)*PI*2; m(g,G('b',.012,.012,3),MD,[Math.cos(a)*1.5,Math.sin(a)*1.5,-.5]);}
        });
        addPart('STRUCTURAL RING — EQUATOR', V(0,2.5,.5), V(0,2.5,0), 3, g => {
          m(g,G('t',2.6,.06,10,28),MH,[0,0,0],[PI2,0,0]); m(g,G('t',2.6,.03,8,24),MA,[0,0,0],[PI2,0,0]);
        });
        addPart('OBSERVATORY DOME — DORSAL', V(0,5.5,.5), V(0,3.5,.3), 4.5, g => {
          m(g,G('s',.8,12,8),MH,[0,0,0],[0,0,0],[1,.45,1]);
          m(g,G('t',.75,.03,8,20),MA,[0,-.12,0],[PI2,0,0]);
          for(let i=0;i<8;i++){const a=(i/8)*PI*2; m(g,G('b',.02,.25,.02),MD,[Math.cos(a)*.65,0,Math.sin(a)*.65]);}
          m(g,G('c',.04,.03,.4,4),MD,[0,.35,0]); m(g,G('s',.05,4,3),MA,[0,.55,0]);
        });
        addPart('EXPLORER GONDOLA', V(0,-.5,.5), V(0,-3,.5), 4.5, g => {
          m(g,G('b',1.6,.7,2.5),MH); m(g,G('b',1.4,.12,2.3),MH,[0,.38,0]);
          for(let z=-.8;z<=.8;z+=.25){m(g,G('s',.015,4,3),MD,[.82,.18,z]);m(g,G('s',.015,4,3),MD,[-.82,.18,z]);}
          greeble(g,MD,0,.38,0,1.2,.01,2,15,.03,.08);
        });
        addPart('KEEL — OBSERVATION WALK', V(0,.6,0), V(0,-1.5,0), 3.5, g => {
          m(g,G('b',.2,.12,7),MH);
          for(let z=-3;z<=3;z+=.5) m(g,G('b',.15,.02,.04),MD,[0,-.07,z]);
          m(g,G('b',.05,.05,6.5),MA,[.08,.04,0]); m(g,G('b',.05,.05,6.5),MA,[-.08,.04,0]);
        });
        addPart('PORT SOLAR SAIL', V(-3.5,2,.5), V(-3,.5,.3), 5, g => {
          m(g,G('b',2.5,.03,3),MH); m(g,G('b',2.3,.02,2.8),MD,[0,.02,0]);
          for(let x=-.9;x<=.9;x+=.2) m(g,G('b',.01,.01,2.8),MD,[x,.025,0]);
          m(g,G('b',.08,.06,.3),MA,[1.2,0,0]);
        });
        addPart('STBD SOLAR SAIL', V(3.5,2,.5), V(3,.5,.3), 5, g => {
          m(g,G('b',2.5,.03,3),MH); m(g,G('b',2.3,.02,2.8),MD,[0,.02,0]);
          for(let x=-.9;x<=.9;x+=.2) m(g,G('b',.01,.01,2.8),MD,[x,.025,0]);
          m(g,G('b',.08,.06,.3),MA,[-1.2,0,0]);
        });
        addPart('SENSOR BOOM — FORWARD', V(0,1.5,5), V(0,.5,3.5), 4.5, g => {
          m(g,G('c',.06,.04,4,6),MH,[0,0,0],[PI2,0,0]);
          m(g,G('s',.15,8,6),MA,[0,0,2.2]);
          for(let i=0;i<3;i++) m(g,G('c',.012,.012,.3,4),MD,[srr(-.1,.1),srr(-.1,.1),.8+i*.6]);
        });
        addPart('PORT THRUSTER POD', V(-1.5,1,-4), V(-2,.5,-2), 4, g => {
          m(g,G('c',.25,.2,1.5,8),MH,[0,0,0],[PI2,0,0]);
          m(g,G('c',.3,.25,.15,8),MA,[0,0,.6],[PI2,0,0]);
          m(g,G('c',.08,.08,.06,6),MD,[0,0,-.9],[PI2,0,0]);
          for(let i=0;i<3;i++){const a=(i/3)*PI*2; m(g,G('b',.25,.01,.03),MD,[Math.cos(a)*.06,Math.sin(a)*.06,-1],[0,0,a]);}
        });
        addPart('STBD THRUSTER POD', V(1.5,1,-4), V(2,.5,-2), 4, g => {
          m(g,G('c',.25,.2,1.5,8),MH,[0,0,0],[PI2,0,0]);
          m(g,G('c',.3,.25,.15,8),MA,[0,0,.6],[PI2,0,0]);
          m(g,G('c',.08,.08,.06,6),MD,[0,0,-.9],[PI2,0,0]);
          for(let i=0;i<3;i++){const a=(i/3)*PI*2; m(g,G('b',.25,.01,.03),MD,[Math.cos(a)*.06,Math.sin(a)*.06,-1],[0,0,a]);}
        });
        addPart('LAB MODULE — VENTRAL', V(0,-1.2,-1), V(0,-2.5,-.5), 3.5, g => {
          m(g,G('b',.8,.5,1.2),MH); m(g,G('b',.6,.08,1),MA,[0,.28,0]);
          for(let i=-2;i<=2;i++) m(g,G('b',.06,.02,.03),MD,[i*.12,.26,.62]);
          greeble(g,MD,0,.28,0,.6,.01,.8,8,.02,.06);
        });
        addPart('COMMS ARRAY — DORSAL', V(.8,5,-.5), V(1.5,3,-.3), 3, g => {
          m(g,G('s',.3,10,8),MH,[0,0,0],[0,0,0],[1,.25,1]);
          m(g,G('c',.02,.02,.25,4),MD,[0,.08,0]); m(g,G('s',.03,4,3),MA,[0,.2,0]);
        });
        addPart('PROBE BAY — VENTRAL', V(0,-1,.5), V(0,-2.5,.5), 3, g => {
          m(g,G('b',.5,.25,.8),MH);
          for(let c=0;c<3;c++) m(g,G('c',.04,.04,.25,6),MD,[-.12+c*.12,-.1,.45],[PI2,0,0]);
          m(g,G('b',.4,.03,.6),MA,[0,-.13,0]);
        });
        addPart('RUDDER — VERTICAL', V(0,2.5,-6), V(0,1.5,-2.5), 3.5, g => {
          m(g,G('b',.05,1.5,1.2),MH); m(g,G('b',.04,1.2,1),MA,[0,.15,0]);
        });
        addPart('ELEVATOR — PORT', V(-1.2,2.5,-5.5), V(-1.2,.5,-2), 3, g => {
          m(g,G('b',1,.04,.8),MH); m(g,G('b',.8,.03,.6),MA,[0,.025,0]);
        });
        addPart('ELEVATOR — STBD', V(1.2,2.5,-5.5), V(1.2,.5,-2), 3, g => {
          m(g,G('b',1,.04,.8),MH); m(g,G('b',.8,.03,.6),MA,[0,.025,0]);
        });
        addPart('TARTARIAN WEATHER VANE', V(0,5.8,1), V(0,3,.5), 2, g => {
          m(g,G('c',.015,.012,.5,4),MD); m(g,G('b',.25,.015,.015),MD,[0,.25,0]);
          m(g,G('n',.04,.12,4),MD,[.12,.25,0],[0,0,-PI2]);
        });
        addPart('DOCKING PORT — AFT', V(0,0,-5), V(0,-.5,-3), 3, g => {
          m(g,G('c',.35,.35,.35,10),MH); m(g,G('c',.25,.25,.08,10),MD,[0,0,-.2]);
          m(g,G('t',.3,.02,6,16),MA,[0,0,-.15]);
        });
      }

      // ═══════════════════════════════════════════════════════════════
      // MODEL 5: IRON WASP — ASSAULT HORNET AIRSHIP
      // ═══════════════════════════════════════════════════════════════
      function buildIronWasp() {
        _seed = 503;
        addPart('ENVELOPE — FORWARD THORAX', V(0,2.5,2.5), V(0,1,2), 4, g => {
          m(g,G('s',2,12,10),MH,[0,0,0],[0,0,0],[1,.8,1.2]);
          for(let i=0;i<8;i++){const a=(i/8)*PI*2; m(g,G('b',.015,.015,2.8),MD,[Math.cos(a)*1.8,Math.sin(a)*1.5,0]);}
          greeble(g,MD,0,.8,0,1.5,.01,2,12,.02,.06);
        });
        addPart('ENVELOPE — WASP WAIST', V(0,2.5,0), V(0,2,0), 3, g => {
          m(g,G('c',1.2,1.2,2,12),MH);
          for(let i=0;i<6;i++){const a=(i/6)*PI*2; m(g,G('b',.012,.012,1.8),MD,[Math.cos(a)*1.22,Math.sin(a)*1.22,0]);}
          m(g,G('b',.3,.15,1.8),MA,[0,1.22,0]); m(g,G('b',.3,.15,1.8),MA,[0,-1.22,0]);
        });
        addPart('ENVELOPE — AFT ABDOMEN', V(0,2.5,-3), V(0,1,-2), 4, g => {
          m(g,G('s',2.2,12,10),MH,[0,0,0],[0,0,0],[1,.85,1.5]);
          m(g,G('n',1.8,2.5,12),MH,[0,0,-2.5],[-PI2,0,0]);
          greeble(g,MD,0,0,-1,1.5,.01,3,15,.02,.07);
        });
        addPart('STRUCTURAL RING — THORAX', V(0,2.5,1.5), V(0,2,.5), 3, g => {
          m(g,G('t',2.1,.06,10,24),MH,[0,0,0],[PI2,0,0]);
          for(let i=0;i<8;i++){const a=(i/8)*PI*2; m(g,G('b',.04,.04,.06),MD,[Math.cos(a)*2.1,Math.sin(a)*2.1,0]);}
        });
        addPart('STRUCTURAL RING — WAIST', V(0,2.5,-.5), V(0,2,0), 3, g => {
          m(g,G('t',1.3,.05,10,24),MH,[0,0,0],[PI2,0,0]);
          m(g,G('t',1.3,.025,8,20),MA,[0,0,0],[PI2,0,0]);
        });
        addPart('ARMORED GONDOLA', V(0,-.3,1), V(0,-3,.8), 5, g => {
          m(g,G('b',1.5,.7,2.5),MH); m(g,G('b',1.3,.12,2.3),MH,[0,.38,0]);
          m(g,G('b',.12,.6,2.3),MH,[.78,0,0]); m(g,G('b',.12,.6,2.3),MH,[-.78,0,0]);
          for(let z=-.8;z<=.8;z+=.3){m(g,G('s',.012,4,3),MD,[.72,.2,z]);m(g,G('s',.012,4,3),MD,[-.72,.2,z]);}
          greeble(g,MD,0,.38,0,1,.01,2,18,.03,.1);
        });
        addPart('CHIN TURRET — ROTARY CANNON', V(0,-1.2,2.5), V(0,-3,2.5), 4.5, g => {
          m(g,G('s',.2,8,6),MH,[0,0,0],[0,0,0],[1,.6,1]); m(g,G('b',.25,.15,.25),MA,[0,-.05,0]);
          m(g,G('c',.1,.08,2.5,8),MD,[0,-.05,1.5],[PI2,0,0]);
          for(let i=0;i<6;i++){const a=(i/6)*PI*2; m(g,G('c',.015,.015,1.2,4),MD,[Math.cos(a)*.05,-.05+Math.sin(a)*.05,2],[PI2,0,0]);}
          m(g,G('c',.08,.06,.12,8),MA,[0,-.05,2.6],[PI2,0,0]);
        });
        addPart('PORT STUB WING', V(-2.2,.8,.5), V(-2.5,.3,.3), 4, g => {
          m(g,G('b',1.5,.06,1.5),MH); m(g,G('b',1.3,.04,1.3),MA,[0,.04,0]);
          m(g,G('b',.08,.18,.2),MD,[-.4,-.1,.3]); m(g,G('b',.08,.18,.2),MD,[.4,-.1,.3]);
          greeble(g,MD,0,.04,0,1.2,.01,1.2,10,.02,.06);
        });
        addPart('STBD STUB WING', V(2.2,.8,.5), V(2.5,.3,.3), 4, g => {
          m(g,G('b',1.5,.06,1.5),MH); m(g,G('b',1.3,.04,1.3),MA,[0,.04,0]);
          m(g,G('b',.08,.18,.2),MD,[.4,-.1,.3]); m(g,G('b',.08,.18,.2),MD,[-.4,-.1,.3]);
          greeble(g,MD,0,.04,0,1.2,.01,1.2,10,.02,.06);
        });
        addPart('PORT FORWARD ENGINE', V(-2.8,2,0), V(-2.5,.5,0), 5, g => {
          m(g,G('c',.4,.3,2,10),MH,[0,0,0],[PI2,0,0]);
          m(g,G('c',.45,.4,.2,10),MA,[0,0,.8],[PI2,0,0]);
          for(let i=0;i<4;i++){const a=(i/4)*PI*2; m(g,G('b',.4,.012,.04),MD,[Math.cos(a)*.15,Math.sin(a)*.15,-1.2],[0,0,a]);}
          greeble(g,MD,0,.3,0,.3,.01,1.5,6,.02,.04);
        });
        addPart('STBD FORWARD ENGINE', V(2.8,2,0), V(2.5,.5,0), 5, g => {
          m(g,G('c',.4,.3,2,10),MH,[0,0,0],[PI2,0,0]);
          m(g,G('c',.45,.4,.2,10),MA,[0,0,.8],[PI2,0,0]);
          for(let i=0;i<4;i++){const a=(i/4)*PI*2; m(g,G('b',.4,.012,.04),MD,[Math.cos(a)*.15,Math.sin(a)*.15,-1.2],[0,0,a]);}
          greeble(g,MD,0,.3,0,.3,.01,1.5,6,.02,.04);
        });
        addPart('PORT AFT ENGINE', V(-2.2,2,-3.5), V(-2,.5,-2), 4.5, g => {
          m(g,G('c',.35,.25,1.8,10),MH,[0,0,0],[PI2,0,0]);
          m(g,G('c',.4,.35,.15,10),MA,[0,0,.7],[PI2,0,0]);
          for(let i=0;i<3;i++){const a=(i/3)*PI*2; m(g,G('b',.35,.01,.03),MD,[Math.cos(a)*.12,Math.sin(a)*.12,-1.1],[0,0,a]);}
        });
        addPart('STBD AFT ENGINE', V(2.2,2,-3.5), V(2,.5,-2), 4.5, g => {
          m(g,G('c',.35,.25,1.8,10),MH,[0,0,0],[PI2,0,0]);
          m(g,G('c',.4,.35,.15,10),MA,[0,0,.7],[PI2,0,0]);
          for(let i=0;i<3;i++){const a=(i/3)*PI*2; m(g,G('b',.35,.01,.03),MD,[Math.cos(a)*.12,Math.sin(a)*.12,-1.1],[0,0,a]);}
        });
        addPart('KEEL TRUSS — ARMORED', V(0,.5,.5), V(0,-1.5,0), 3, g => {
          m(g,G('b',.25,.18,7),MH); m(g,G('b',.2,.04,6.5),MA,[0,.1,0]);
          for(let z=-3;z<=3;z+=.4) m(g,G('b',.2,.025,.05),MD,[0,-.1,z]);
        });
        addPart('PORT MISSILE PYLON', V(-2.8,.5,.5), V(-2.5,-.5,.5), 3, g => {
          m(g,G('b',.2,.15,.8),MH);
          for(let c=0;c<2;c++) m(g,G('c',.04,.04,.5,6),MD,[-.06+c*.12,-.08,.5],[PI2,0,0]);
          m(g,G('c',.06,.04,.12,6),MA,[0,-.08,.8],[PI2,0,0]);
        });
        addPart('STBD MISSILE PYLON', V(2.8,.5,.5), V(2.5,-.5,.5), 3, g => {
          m(g,G('b',.2,.15,.8),MH);
          for(let c=0;c<2;c++) m(g,G('c',.04,.04,.5,6),MD,[-.06+c*.12,-.08,.5],[PI2,0,0]);
          m(g,G('c',.06,.04,.12,6),MA,[0,-.08,.8],[PI2,0,0]);
        });
        addPart('DORSAL SENSOR DOME', V(0,4.8,-.5), V(0,3,-.3), 3, g => {
          m(g,G('s',.35,8,6),MH,[0,0,0],[0,0,0],[1,.4,1]);
          m(g,G('t',.3,.02,6,16),MA,[0,-.05,0],[PI2,0,0]);
        });
        addPart('RUDDER — STING TAIL', V(0,2.5,-6), V(0,1.5,-2.5), 3.5, g => {
          m(g,G('b',.05,1.8,1.2),MH); m(g,G('b',.04,1.5,1),MA,[0,.15,0]);
          m(g,G('n',.06,.3,6),MH,[0,-.95,0],[PI,0,0]);
        });
        addPart('ELEVATOR — PORT', V(-1.3,2.5,-5.5), V(-1.3,.5,-2), 3, g => {
          m(g,G('b',1.2,.05,.8),MH); m(g,G('b',1,.03,.6),MA,[0,.03,0]);
        });
        addPart('ELEVATOR — STBD', V(1.3,2.5,-5.5), V(1.3,.5,-2), 3, g => {
          m(g,G('b',1.2,.05,.8),MH); m(g,G('b',1,.03,.6),MA,[0,.03,0]);
        });
        addPart('AMMO DRUM — VENTRAL', V(0,-1.2,.8), V(0,-2.5,.5), 2.5, g => {
          m(g,G('c',.15,.15,.3,8),MH,[0,0,0],[PI2,0,0]);
          m(g,G('b',.06,.06,.2),MD,[0,.12,.12]); m(g,G('c',.03,.03,.4,4),MD,[0,.12,.3],[PI2,0,0]);
        });
      }

      // ═══════════════════════════════════════════════════════════════
      // MODEL 6: VOID HARVESTER — INDUSTRIAL TITAN AIRSHIP
      // ═══════════════════════════════════════════════════════════════
      function buildVoidHarvester() {
        _seed = 617;
        addPart('PORT ENVELOPE — GAS CELL', V(-1.8,3,0), V(-1.5,1.5,0), 4, g => {
          m(g,G('c',1.8,1.8,7,14),MH); m(g,G('s',1.8,12,8),MH,[0,0,3.8],[0,0,0],[1,.85,.5]);
          m(g,G('n',1.6,3,12),MH,[0,0,-4.5],[-PI2,0,0]);
          for(let i=0;i<8;i++){const a=(i/8)*PI*2; m(g,G('b',.012,.012,6.5),MD,[Math.cos(a)*1.82,Math.sin(a)*1.82,-.3]);}
          greeble(g,MD,0,1,0,1.2,.01,5,15,.02,.06);
        });
        addPart('STBD ENVELOPE — GAS CELL', V(1.8,3,0), V(1.5,1.5,0), 4, g => {
          m(g,G('c',1.8,1.8,7,14),MH); m(g,G('s',1.8,12,8),MH,[0,0,3.8],[0,0,0],[1,.85,.5]);
          m(g,G('n',1.6,3,12),MH,[0,0,-4.5],[-PI2,0,0]);
          for(let i=0;i<8;i++){const a=(i/8)*PI*2; m(g,G('b',.012,.012,6.5),MD,[Math.cos(a)*1.82,Math.sin(a)*1.82,-.3]);}
          greeble(g,MD,0,1,0,1.2,.01,5,15,.02,.06);
        });
        addPart('CONNECTING TRUSS — UPPER', V(0,4.5,0), V(0,2.5,0), 3, g => {
          m(g,G('b',2,.12,6),MH); m(g,G('b',1.8,.06,5.5),MA,[0,.08,0]);
          for(let z=-2.5;z<=2.5;z+=.5) m(g,G('b',1.6,.03,.06),MD,[0,-.08,z]);
          greeble(g,MD,0,.08,0,1.5,.01,5,12,.02,.05);
        });
        addPart('CONNECTING TRUSS — LOWER', V(0,1.5,0), V(0,-.5,0), 3, g => {
          m(g,G('b',2,.12,6),MH); m(g,G('b',1.8,.06,5.5),MA,[0,-.08,0]);
          for(let z=-2.5;z<=2.5;z+=.5) m(g,G('b',1.6,.03,.06),MD,[0,.08,z]);
        });
        addPart('STRUCTURAL RING — PORT', V(-1.8,3,1), V(-1.5,2,.3), 3, g => {
          m(g,G('t',1.85,.06,10,24),MH,[0,0,0],[PI2,0,0]);
          for(let i=0;i<6;i++){const a=(i/6)*PI*2; m(g,G('b',.04,.04,.06),MD,[Math.cos(a)*1.85,Math.sin(a)*1.85,0]);}
        });
        addPart('STRUCTURAL RING — STBD', V(1.8,3,-1), V(1.5,2,-.3), 3, g => {
          m(g,G('t',1.85,.06,10,24),MH,[0,0,0],[PI2,0,0]);
          for(let i=0;i<6;i++){const a=(i/6)*PI*2; m(g,G('b',.04,.04,.06),MD,[Math.cos(a)*1.85,Math.sin(a)*1.85,0]);}
        });
        addPart('CARGO GONDOLA — MAIN', V(0,-.8,0), V(0,-3.5,0), 5, g => {
          m(g,G('b',3,1.2,4),MH); m(g,G('b',2.8,.15,3.8),MH,[0,.62,0]); m(g,G('b',2.8,.15,3.8),MH,[0,-.62,0]);
          m(g,G('b',.15,1,3.8),MH,[1.52,0,0]); m(g,G('b',.15,1,3.8),MH,[-1.52,0,0]);
          for(let z=-1.5;z<=1.5;z+=.35){m(g,G('s',.02,4,3),MD,[1.5,.35,z]);m(g,G('s',.02,4,3),MD,[-1.5,.35,z]);}
          greeble(g,MD,0,.62,0,2.5,.01,3.5,30,.04,.12);
        });
        addPart('BRIDGE — CONTROL TOWER', V(1.2,.4,1.5), V(1.5,-2,1.5), 4, g => {
          m(g,G('b',.8,.6,.8),MH); m(g,G('b',.6,.35,.6),MH,[0,.45,0]);
          for(let i=-2;i<=2;i++) m(g,G('b',.06,.02,.03),MD,[i*.1,.3,.32]);
          m(g,G('c',.03,.025,.4,4),MD,[0,.7,0]); m(g,G('s',.04,4,3),MA,[0,.9,0]);
          greeble(g,MD,0,.3,0,.5,.01,.5,6,.02,.05);
        });
        addPart('PORT CRANE BOOM', V(-2.5,.5,2.5), V(-3,.8,2), 5, g => {
          m(g,G('b',.15,.15,4),MH); m(g,G('b',.2,.2,.25),MA,[0,0,2]);
          for(let i=0;i<6;i++) m(g,G('b',.13,.025,.04),MD,[0,0,-1.7+i*.7]);
          m(g,G('c',.015,.015,.5,4),MD,[0,-.15,2.1]); m(g,G('b',.1,.08,.08),MD,[0,-.4,2.1]);
          greeble(g,MD,0,.1,0,.1,.01,3,8,.02,.04);
        });
        addPart('STBD CRANE BOOM', V(2.5,.5,2.5), V(3,.8,2), 5, g => {
          m(g,G('b',.15,.15,4),MH); m(g,G('b',.2,.2,.25),MA,[0,0,2]);
          for(let i=0;i<6;i++) m(g,G('b',.13,.025,.04),MD,[0,0,-1.7+i*.7]);
          m(g,G('c',.015,.015,.5,4),MD,[0,-.15,2.1]); m(g,G('b',.1,.08,.08),MD,[0,-.4,2.1]);
          greeble(g,MD,0,.1,0,.1,.01,3,8,.02,.04);
        });
        addPart('ORE HOPPER — VENTRAL', V(0,-2.2,0), V(0,-3.5,0), 4, g => {
          m(g,G('b',2.2,.6,2.5),MH); m(g,G('b',1.8,.4,2),MD);
          m(g,G('b',2,.04,2.3),MA,[0,-.32,0]);
          greeble(g,MD,0,-.32,0,1.8,.01,2,12,.03,.08);
        });
        addPart('REFINERY STACK — PORT', V(-1.5,5.5,-.5), V(-1.5,3,-.3), 3.5, g => {
          m(g,G('c',.12,.1,.8,6),MH); m(g,G('c',.15,.12,.08,6),MA,[0,0,.35]);
          m(g,G('c',.1,.08,.08,6),MD,[0,0,-.35]); greeble(g,MD,0,.1,0,.1,.01,.6,4,.02,.03);
        });
        addPart('REFINERY STACK — STBD', V(1.5,5.5,.5), V(1.5,3,.3), 3.5, g => {
          m(g,G('c',.12,.1,.8,6),MH); m(g,G('c',.15,.12,.08,6),MA,[0,0,.35]);
          m(g,G('c',.1,.08,.08,6),MD,[0,0,-.35]); greeble(g,MD,0,.1,0,.1,.01,.6,4,.02,.03);
        });
        addPart('ENGINE — PORT INDUSTRIAL', V(-3.5,2.5,-3), V(-3,.5,-1.5), 5, g => {
          m(g,G('c',.5,.4,2.5,10),MH,[0,0,0],[PI2,0,0]);
          m(g,G('c',.55,.5,.25,10),MA,[0,0,1],[PI2,0,0]);
          m(g,G('c',.4,.55,.5,10),MD,[0,0,-1.4],[PI2,0,0]);
          for(let i=0;i<4;i++){const a=(i/4)*PI*2; m(g,G('b',.5,.015,.05),MD,[Math.cos(a)*.2,Math.sin(a)*.2,-1.6],[0,0,a]);}
          greeble(g,MD,0,.4,0,.4,.01,2,10,.02,.06);
        });
        addPart('ENGINE — STBD INDUSTRIAL', V(3.5,2.5,-3), V(3,.5,-1.5), 5, g => {
          m(g,G('c',.5,.4,2.5,10),MH,[0,0,0],[PI2,0,0]);
          m(g,G('c',.55,.5,.25,10),MA,[0,0,1],[PI2,0,0]);
          m(g,G('c',.4,.55,.5,10),MD,[0,0,-1.4],[PI2,0,0]);
          for(let i=0;i<4;i++){const a=(i/4)*PI*2; m(g,G('b',.5,.015,.05),MD,[Math.cos(a)*.2,Math.sin(a)*.2,-1.6],[0,0,a]);}
          greeble(g,MD,0,.4,0,.4,.01,2,10,.02,.06);
        });
        addPart('DRILL ARRAY — FORWARD', V(0,.2,4.5), V(0,-.5,3.5), 4.5, g => {
          m(g,G('c',.35,.2,1.5,8),MH,[0,0,0],[PI2,0,0]); m(g,G('n',.15,1,8),MD,[0,0,1.2],[PI2,0,0]);
          for(let i=0;i<4;i++){const a=(i/4)*PI*2; m(g,G('c',.03,.03,.8,4),MD,[Math.cos(a)*.2,Math.sin(a)*.2,.4],[PI2,0,0]);}
        });
        addPart('RADIATOR ARRAY — DORSAL', V(0,5.2,-.5), V(0,3,0), 3.5, g => {
          for(let i=0;i<6;i++) m(g,G('b',2,.02,.3),MH,[0,i*.08,0]);
          m(g,G('b',.08,.5,.15),MA,[.95,.2,0]); m(g,G('b',.08,.5,.15),MA,[-.95,.2,0]);
        });
        addPart('RUDDER — VERTICAL', V(0,3,-5.5), V(0,2,-2.5), 3.5, g => {
          m(g,G('b',.06,2,1.5),MH); m(g,G('b',.04,1.6,1.2),MA,[0,.2,0]);
        });
        addPart('ELEVATOR — PORT', V(-1.8,3,-5), V(-1.5,.8,-2), 3, g => {
          m(g,G('b',1.5,.05,1),MH); m(g,G('b',1.3,.03,.8),MA,[0,.03,0]);
        });
        addPart('ELEVATOR — STBD', V(1.8,3,-5), V(1.5,.8,-2), 3, g => {
          m(g,G('b',1.5,.05,1),MH); m(g,G('b',1.3,.03,.8),MA,[0,.03,0]);
        });
        addPart('TOWING CLAMP — AFT', V(0,0,-5.5), V(0,-.5,-3), 2.5, g => {
          m(g,G('b',.5,.4,.3),MA); m(g,G('b',.1,.6,.1),MD,[.2,0,.05],[0,0,.15]); m(g,G('b',.1,.6,.1),MD,[-.2,0,.05],[0,0,-.15]);
        });
        addPart('CARGO FRAME — VENTRAL', V(0,-1,-1.5), V(0,-2,-1), 3, g => {
          m(g,G('b',.06,.06,2),MH,[1.2,-.5,0]); m(g,G('b',.06,.06,2),MH,[-1.2,-.5,0]);
          m(g,G('b',.06,.06,2),MH,[1.2,.5,0]); m(g,G('b',.06,.06,2),MH,[-1.2,.5,0]);
          m(g,G('b',2.46,.06,.06),MH,[0,.5,1]); m(g,G('b',2.46,.06,.06),MH,[0,.5,-1]);
          m(g,G('b',2.46,.06,.06),MH,[0,-.5,1]); m(g,G('b',2.46,.06,.06),MH,[0,-.5,-1]);
        });
      }

      // ═══════════════════════════════════════════════════════════════
      // MODEL GALLERY SYSTEM
      // ═══════════════════════════════════════════════════════════════
      const models = [
        { name: 'LEVIATHAN-IX', sub: 'IMPERIAL DREADNOUGHT AIRSHIP', dwg: 'TIA-2847-IX', build: buildLeviathan },
        { name: 'WHISPERWIND', sub: 'PHANTOM CORSAIR AIRSHIP', dwg: 'TIA-1103-WW', build: buildWhisperwind },
        { name: 'CATHEDRAL', sub: 'GRAND BASILICA AIRSHIP', dwg: 'TIA-5520-CT', build: buildCathedral },
        { name: 'NOMAD', sub: 'EXPLORER CLOUDSHIP', dwg: 'TIA-3391-NM', build: buildNomad },
        { name: 'IRON WASP', sub: 'ASSAULT HORNET AIRSHIP', dwg: 'TIA-7704-IW', build: buildIronWasp },
        { name: 'VOID HARVESTER', sub: 'INDUSTRIAL TITAN AIRSHIP', dwg: 'TIA-9182-VH', build: buildVoidHarvester },
      ];

      let currentModel = Math.floor(Math.random() * models.length);
      let explodeAmount = 0, targetExplode = 1;
      let wireframeMode = false, xrayMode = false, autoSpin = true;
      let hoveredPart: Part | null = null;
      let modelLoadTime = 0;

      function loadModel(idx: number) {
        parts.forEach(p => {
          p.group.traverse(c => { if (c.userData.isEdge && (c as T.LineSegments).material) ((c as T.LineSegments).material as T.Material).dispose(); });
          scene.remove(p.group);
        });
        parts.length = 0;

        models[idx].build();
        currentModel = idx;
        modelLoadTime = clock.elapsedTime;

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

      function onKeyDown(e: KeyboardEvent) {
        if (e.key === 'ArrowRight') { e.preventDefault(); loadModel((currentModel + 1) % models.length); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); loadModel((currentModel - 1 + models.length) % models.length); }
      }
      window.addEventListener('keydown', onKeyDown);

      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();
      function onMouseMove(e: MouseEvent) { mouse.x = (e.clientX / window.innerWidth) * 2 - 1; mouse.y = -(e.clientY / window.innerHeight) * 2 + 1; }
      window.addEventListener('mousemove', onMouseMove);

      function setupUI() {
        const btnE = document.getElementById('mech-btn-exploded');
        const btnW = document.getElementById('mech-btn-wireframe');
        const btnX = document.getElementById('mech-btn-xray');
        const btnS = document.getElementById('mech-btn-spin');
        const slider = document.getElementById('mech-sep-slider') as HTMLInputElement | null;
        const ib = 'rgba(26,26,24,0.08)', ia = 'rgba(26,26,24,0.2)';

        function upd() {
          [btnE,btnW,btnX,btnS].forEach(b => { if(b) b.style.background = ib; });
          if(targetExplode===1 && btnE) btnE.style.background = ia;
          if(wireframeMode && btnW) btnW.style.background = ia;
          if(xrayMode && btnX) btnX.style.background = ia;
          if(autoSpin && btnS) btnS.style.background = ia;
        }
        if(btnE) btnE.onclick=()=>{targetExplode=targetExplode===1?0:1;if(slider)slider.value=targetExplode===1?'100':'0';upd();};
        if(btnW) btnW.onclick=()=>{wireframeMode=!wireframeMode;parts.forEach(p=>p.group.traverse(c=>{if((c as T.Mesh).isMesh){const mt=(c as T.Mesh).material as T.ShaderMaterial;if(mt.wireframe!==undefined)mt.wireframe=wireframeMode;}if(c.userData.isEdge)c.visible=!wireframeMode;}));upd();};
        if(btnX) btnX.onclick=()=>{xrayMode=!xrayMode;sharedU.xrayAlpha.value=xrayMode?0.12:1;parts.forEach(p=>p.group.traverse(c=>{if(c.userData.isEdge)(c as T.LineSegments).material=xrayMode?edgeMatStrong:edgeMat;}));upd();};
        if(btnS) btnS.onclick=()=>{autoSpin=!autoSpin;upd();};
        if(slider) slider.oninput=()=>{targetExplode=parseInt(slider.value)/100;};
        upd();
      }
      setTimeout(setupUI, 100);

      const clock = new THREE.Clock();
      let animId = 0;

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
        <div className="absolute top-20 sm:top-24 left-6 sm:left-10">
          <div style={{ fontSize: '8px', letterSpacing: '0.35em', textTransform: 'uppercase', opacity: 0.3 }}>
            TARTARY IMPERIAL AERONAUTICS
          </div>
          <div style={{ fontSize: '8px', letterSpacing: '0.3em', textTransform: 'uppercase', opacity: 0.2, marginTop: '2px' }}>
            BUREAU OF AIRSHIP ENGINEERING
          </div>
        </div>

        <div className="absolute top-20 sm:top-24 right-6 sm:right-10 text-right" style={{ fontSize: '8px', letterSpacing: '0.2em', opacity: 0.3 }}>
          DRAG TO ROTATE<br />SCROLL TO ZOOM<br /><br />
          COMPONENTS: <span id="mech-part-count">0</span><br />
          TRIANGLES: <span id="mech-tri-count">0</span>
        </div>

        <div id="mech-part-label" className="absolute left-1/2 -translate-x-1/2" style={{
          bottom: '80px', fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase',
          opacity: 0, transition: 'opacity 0.4s', background: 'rgba(240,235,224,0.9)', padding: '5px 14px',
          border: '1px solid rgba(26,26,24,0.12)',
        }} />

        <div className="absolute bottom-6 sm:bottom-8 left-6 sm:left-10">
          <div style={{ fontSize: '7px', letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.3, marginBottom: '4px' }}>
            ← →&ensp;ARROW KEYS TO BROWSE
          </div>
          <div id="ship-name" style={{ fontSize: '14px', letterSpacing: '0.15em', fontWeight: 300, lineHeight: 1.2 }}>
            LEVIATHAN-IX
          </div>
          <div id="ship-subtitle" style={{ fontSize: '8px', letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.35, marginTop: '2px' }}>
            IMPERIAL DREADNOUGHT AIRSHIP — DWG. NO. TIA-2847-IX
          </div>
          <div id="ship-counter" style={{ fontSize: '8px', letterSpacing: '0.15em', opacity: 0.25, marginTop: '4px' }}>
            1 / 6
          </div>
        </div>

        <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3 pointer-events-auto">
          {[
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

        <div className="absolute bottom-6 sm:bottom-8 right-6 sm:right-10 flex items-center gap-2 pointer-events-auto">
          <label style={{ fontSize: '7px', letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.35 }}>Separation</label>
          <input id="mech-sep-slider" type="range" min="0" max="100" defaultValue="100" style={{ width: '90px' }} />
        </div>

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
