'use client';

import { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';

// ═══════════════════════════════════════════════════════════════════════
// CONSTANTS & TYPES
// ═══════════════════════════════════════════════════════════════════════
const MAP = 32;
const T = { GRASS: 0, DIRT: 1, STONE: 2, WATER: 3, SAND: 4 } as const;
const T_COL: Record<number, number> = { 0: 0x4a7c3f, 1: 0x8b7355, 2: 0x6b6b6b, 3: 0x2a5f8f, 4: 0xc2b280 };
const T_HT: Record<number, number> = { 0: 0.4, 1: 0.35, 2: 0.5, 3: 0.12, 4: 0.3 };
const T_MAP_COL: Record<number, string> = { 0: '#4a7c3f', 1: '#8b7355', 2: '#6b6b6b', 3: '#2a5f8f', 4: '#c2b280' };
const SPEED = 4.0;
const CAM_OFF = new THREE.Vector3(12, 12, 12);

interface NPCDef { name: string; color: string; start: [number, number]; waypoints: [number, number][]; dialogs: string[] }
interface BldDef { type: string; tile: [number, number]; size: [number, number]; label: string }
interface ResDef { type: 'gold' | 'wood' | 'stone'; tile: [number, number] }

const NPCS: NPCDef[] = [
  { name: 'Elder Rowan', color: '#8b4513', start: [8, 10], waypoints: [[8,10],[8,12],[6,12],[6,10]], dialogs: ['Welcome to the kingdom of Tartary, traveler.', 'Explore the land and gather resources.', 'The castle holds many secrets...'] },
  { name: 'Merchant Lira', color: '#b8860b', start: [19, 19], waypoints: [[19,19],[23,19],[23,17]], dialogs: ['Fine wares from distant lands!', 'Gold buys knowledge in this realm.'] },
  { name: 'Guard Thane', color: '#4a4a4a', start: [13, 5], waypoints: [[13,5],[14,5],[17,5],[17,8]], dialogs: ['The tower watches over all.', 'I serve the kingdom faithfully.'] },
  { name: 'Scholar Mira', color: '#483d8b', start: [23, 23], waypoints: [[23,23],[26,23],[26,26],[23,26]], dialogs: ['Knowledge is the truest treasure.', 'The windmill grinds more than grain...'] },
];

const BLDS: BldDef[] = [
  { type: 'castle', tile: [14, 14], size: [4, 4], label: 'Castle Tartary' },
  { type: 'tower', tile: [15, 6], size: [2, 2], label: 'Watchtower' },
  { type: 'house', tile: [6, 8], size: [2, 2], label: "Elder's House" },
  { type: 'house', tile: [24, 12], size: [2, 2], label: "Merchant's Lodge" },
  { type: 'house', tile: [3, 18], size: [2, 2], label: "Fisherman's Hut" },
  { type: 'market', tile: [20, 18], size: [3, 2], label: 'Market Square' },
  { type: 'windmill', tile: [24, 24], size: [2, 2], label: 'Old Windmill' },
  { type: 'house', tile: [26, 8], size: [2, 2], label: 'Outpost' },
];

const RESS: ResDef[] = [
  { type: 'gold', tile: [4, 4] }, { type: 'gold', tile: [12, 26] }, { type: 'gold', tile: [28, 8] },
  { type: 'gold', tile: [18, 22] }, { type: 'gold', tile: [8, 14] }, { type: 'gold', tile: [28, 18] },
  { type: 'wood', tile: [3, 10] }, { type: 'wood', tile: [10, 24] }, { type: 'wood', tile: [25, 10] },
  { type: 'wood', tile: [8, 28] }, { type: 'wood', tile: [20, 4] }, { type: 'wood', tile: [28, 26] },
  { type: 'stone', tile: [2, 14] }, { type: 'stone', tile: [18, 28] }, { type: 'stone', tile: [28, 14] },
  { type: 'stone', tile: [12, 4] }, { type: 'stone', tile: [22, 22] },
];

// ═══════════════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════════════
function srand(seed: number) { let s = seed; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }
function noise2(x: number, z: number, s: number) { const n = Math.sin(x * 12.9898 + z * 78.233 + s) * 43758.5453; return n - Math.floor(n); }
function snoise(x: number, z: number, s: number, sc: number) {
  const sx = x / sc, sz = z / sc, ix = Math.floor(sx), iz = Math.floor(sz), fx = sx - ix, fz = sz - iz;
  const a = noise2(ix, iz, s), b = noise2(ix + 1, iz, s), c = noise2(ix, iz + 1, s), d = noise2(ix + 1, iz + 1, s);
  const ux = fx * fx * (3 - 2 * fx), uz = fz * fz * (3 - 2 * fz);
  return a * (1 - ux) * (1 - uz) + b * ux * (1 - uz) + c * (1 - ux) * uz + d * ux * uz;
}

// A* Pathfinding
function astar(ok: (x: number, z: number) => boolean, sx: number, sz: number, ex: number, ez: number): [number, number][] | null {
  if (!ok(ex, ez)) return null;
  const k = (x: number, z: number) => (x << 8) | z;
  const open: { x: number; z: number; g: number; f: number }[] = [{ x: sx, z: sz, g: 0, f: 0 }];
  const closed = new Set<number>(); const from = new Map<number, number>(); const gs = new Map<number, number>();
  gs.set(k(sx, sz), 0);
  while (open.length > 0) {
    open.sort((a, b) => a.f - b.f);
    const c = open.shift()!; const ck = k(c.x, c.z);
    if (c.x === ex && c.z === ez) {
      const path: [number, number][] = []; let pk = ck;
      while (pk !== undefined) { path.unshift([(pk >> 8) & 0xff, pk & 0xff]); pk = from.get(pk)!; }
      return path;
    }
    closed.add(ck);
    for (const [dx, dz] of [[0, 1], [0, -1], [1, 0], [-1, 0]] as [number, number][]) {
      const nx = c.x + dx, nz = c.z + dz, nk = k(nx, nz);
      if (nx < 0 || nx >= MAP || nz < 0 || nz >= MAP || closed.has(nk) || !ok(nx, nz)) continue;
      const ng = c.g + 1;
      if ((gs.get(nk) ?? Infinity) <= ng) continue;
      gs.set(nk, ng); from.set(nk, ck);
      open.push({ x: nx, z: nz, g: ng, f: ng + Math.abs(nx - ex) + Math.abs(nz - ez) });
    }
  }
  return null;
}

// Shared geometries
let _g: Record<string, THREE.BufferGeometry> | null = null;
function G() {
  if (!_g) _g = {
    box: new THREE.BoxGeometry(1, 1, 1), cone: new THREE.ConeGeometry(0.5, 1, 8),
    cyl: new THREE.CylinderGeometry(0.5, 0.5, 1, 12), sphere: new THREE.SphereGeometry(0.5, 12, 8),
    oct: new THREE.OctahedronGeometry(0.5, 0), dodec: new THREE.DodecahedronGeometry(0.5, 0),
  };
  return _g;
}
function mat(c: string | number) { return new THREE.MeshLambertMaterial({ color: c }); }

// ═══════════════════════════════════════════════════════════════════════
// ISOMETRIC GAME ENGINE
// ═══════════════════════════════════════════════════════════════════════
class IsometricGameEngine {
  private r: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private cam: THREE.OrthographicCamera;
  private clk = new THREE.Clock();
  private ray = new THREE.Raycaster();
  private ctr: HTMLDivElement;
  private aid = 0;
  private dead = false;
  // Terrain
  private grid: number[][] = [];
  private hts: number[][] = [];
  private blocked = new Set<string>();
  private waterMeshes: THREE.Mesh[] = [];
  // Player
  private player!: THREE.Group;
  private pTile: [number, number] = [16, 20];
  private pPos = new THREE.Vector3();
  private pPath: [number, number][] = [];
  private pPI = 0;
  private pMoving = false;
  private pAngle = 0;
  private pTAngle = 0;
  private pWalk = 0;
  private pParts!: { la: THREE.Mesh; ra: THREE.Mesh; ll: THREE.Mesh; rl: THREE.Mesh; body: THREE.Mesh };
  // NPCs
  private npcs: { g: THREE.Group; def: NPCDef; wp: number; tile: [number, number]; pos: THREE.Vector3; tgt: THREE.Vector3; mv: boolean; pause: number; angle: number; wt: number; p: { la: THREE.Mesh; ra: THREE.Mesh; ll: THREE.Mesh; rl: THREE.Mesh }; ind: THREE.Mesh; }[] = [];
  // Resources
  private res: { g: THREE.Group; def: ResDef; got: boolean; respawn: number; mesh: THREE.Mesh }[] = [];
  private rc = { gold: 0, wood: 0, stone: 0 };
  // Buildings
  private wmBlades: THREE.Group | null = null;
  // Input
  private keys = new Set<string>();
  private mNDC = new THREE.Vector2(-999, -999);
  // State
  private dialog: { npc: NPCDef; idx: number } | null = null;
  private pendNPC: NPCDef | null = null;
  private pendRes: typeof this.res[0] | null = null;
  private gPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.35);
  private aLight!: THREE.AmbientLight;
  private sLight!: THREE.DirectionalLight;
  private camLook = new THREE.Vector3();
  private cleanup: (() => void) | null = null;

  constructor(ctr: HTMLDivElement) {
    this.ctr = ctr;
    const r = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance', preserveDrawingBuffer: true });
    r.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    r.setSize(ctr.clientWidth, ctr.clientHeight);
    r.setClearColor(0x87CEEB);
    r.shadowMap.enabled = true;
    r.shadowMap.type = THREE.PCFSoftShadowMap;
    r.domElement.style.display = 'block';
    r.domElement.style.willChange = 'transform';
    r.domElement.style.transform = 'translateZ(0)';
    ctr.appendChild(r.domElement);
    this.r = r;
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x87CEEB, 0.012);
    const w = ctr.clientWidth, h = ctr.clientHeight;
    this.cam = new THREE.OrthographicCamera(-w / 2, w / 2, h / 2, -h / 2, 0.1, 200);
    this.cam.zoom = 42;
    this.cam.updateProjectionMatrix();

    this.buildTerrain();
    this.setupLights();
    this.buildPlayer();
    this.placeBuildings();
    this.placeDecos();
    this.placeResources();
    this.createNPCs();

    const sp = this.tw(this.pTile[0], this.pTile[1]);
    this.pPos.copy(sp); this.player.position.copy(sp);
    this.camLook.copy(this.pPos);
    this.cam.position.set(this.pPos.x + CAM_OFF.x, CAM_OFF.y, this.pPos.z + CAM_OFF.z);
    this.cam.lookAt(this.camLook);
    this.cam.updateProjectionMatrix();

    this.setupInput();
    this.animate();
  }

  // ── Terrain ──
  private buildTerrain() {
    const seed = 42;
    for (let x = 0; x < MAP; x++) {
      this.grid[x] = []; this.hts[x] = [];
      for (let z = 0; z < MAP; z++) {
        const n = snoise(x, z, seed, 8) + snoise(x, z, seed + 100, 4) * 0.5;
        // Pond SW
        const pd = Math.sqrt((x - 5) ** 2 + (z - 25) ** 2);
        // Stream
        const sc = 11 + Math.sin(z * 0.3) * 1.5;
        const sd = Math.abs(x - sc);
        const inStream = sd < 0.8 && z > 5 && z < 22;
        let t: number;
        if (pd < 2.8 || inStream) t = T.WATER;
        else if (pd < 3.8 || (sd < 1.6 && z > 5 && z < 22)) t = T.SAND;
        else if (n > 0.65) t = T.STONE;
        else if (n > 0.45) t = T.DIRT;
        else t = T.GRASS;
        this.grid[x][z] = t;
        this.hts[x][z] = (T_HT[t] || 0.4) + snoise(x, z, seed + 200, 6) * 0.1;
      }
    }
    // Clear building footprints
    for (const b of BLDS) {
      for (let dx = 0; dx < b.size[0]; dx++) for (let dz = 0; dz < b.size[1]; dz++) {
        const bx = b.tile[0] + dx, bz = b.tile[1] + dz;
        if (bx >= 0 && bx < MAP && bz >= 0 && bz < MAP) {
          this.grid[bx][bz] = T.STONE; this.hts[bx][bz] = 0.3; this.blocked.add(`${bx},${bz}`);
        }
      }
    }
    // Mark water blocked
    for (let x = 0; x < MAP; x++) for (let z = 0; z < MAP; z++) if (this.grid[x][z] === T.WATER) this.blocked.add(`${x},${z}`);
    // Create meshes
    const g = G();
    for (let x = 0; x < MAP; x++) for (let z = 0; z < MAP; z++) {
      const t = this.grid[x][z], h = this.hts[x][z];
      const m = new THREE.MeshLambertMaterial({ color: T_COL[t] });
      if (t === T.WATER) { m.transparent = true; m.opacity = 0.7; }
      const mesh = new THREE.Mesh(g.box, m);
      mesh.scale.set(1, h, 1); mesh.position.set(x, h / 2, z);
      mesh.receiveShadow = true;
      this.scene.add(mesh);
      if (t === T.WATER) this.waterMeshes.push(mesh);
    }
    // Edge walls (prevent seeing void)
    const wallMat = mat('#3a5a30');
    for (let i = 0; i < MAP; i++) {
      for (const [x, z] of [[-1, i], [MAP, i], [i, -1], [i, MAP]]) {
        const w = new THREE.Mesh(g.box, wallMat);
        w.scale.set(1, 0.4, 1); w.position.set(x, 0.2, z);
        this.scene.add(w);
      }
    }
  }

  private setupLights() {
    this.aLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(this.aLight);
    this.sLight = new THREE.DirectionalLight(0xfff5e0, 1.0);
    this.sLight.position.set(20, 30, 20);
    this.sLight.castShadow = true;
    this.sLight.shadow.mapSize.set(2048, 2048);
    const sc = this.sLight.shadow.camera;
    sc.left = -40; sc.right = 40; sc.top = 40; sc.bottom = -40; sc.far = 100;
    this.scene.add(this.sLight);
    this.scene.add(this.sLight.target);
    this.scene.add(new THREE.DirectionalLight(0xb0c4de, 0.3)).position.set(-15, 20, -15);
  }

  // ── Build Humanoid ──
  private mkHuman(bodyCol: string, scale = 1): { grp: THREE.Group; la: THREE.Mesh; ra: THREE.Mesh; ll: THREE.Mesh; rl: THREE.Mesh; body: THREE.Mesh } {
    const g = G(), grp = new THREE.Group();
    const body = new THREE.Mesh(g.box, mat(bodyCol));
    body.scale.set(0.4 * scale, 0.5 * scale, 0.3 * scale); body.position.y = 0.65 * scale; body.castShadow = true; grp.add(body);
    const head = new THREE.Mesh(g.sphere, mat('#f5d6b0'));
    head.scale.setScalar(0.3 * scale); head.position.y = 1.1 * scale; head.castShadow = true; grp.add(head);
    const am = mat(bodyCol);
    const la = new THREE.Mesh(g.box, am); la.scale.set(0.12 * scale, 0.4 * scale, 0.12 * scale); la.position.set(-0.28 * scale, 0.65 * scale, 0); grp.add(la);
    const ra = new THREE.Mesh(g.box, am.clone()); ra.scale.set(0.12 * scale, 0.4 * scale, 0.12 * scale); ra.position.set(0.28 * scale, 0.65 * scale, 0); grp.add(ra);
    const lm = mat('#5a4a30');
    const ll = new THREE.Mesh(g.box, lm); ll.scale.set(0.14 * scale, 0.35 * scale, 0.14 * scale); ll.position.set(-0.1 * scale, 0.25 * scale, 0); grp.add(ll);
    const rl = new THREE.Mesh(g.box, lm.clone()); rl.scale.set(0.14 * scale, 0.35 * scale, 0.14 * scale); rl.position.set(0.1 * scale, 0.25 * scale, 0); grp.add(rl);
    return { grp, la, ra, ll, rl, body };
  }

  private buildPlayer() {
    const h = this.mkHuman('#c9a96e');
    this.player = h.grp;
    this.pParts = { la: h.la, ra: h.ra, ll: h.ll, rl: h.rl, body: h.body };
    this.scene.add(this.player);
  }

  // ── Buildings ──
  private placeBuildings() {
    const g = G();
    for (const b of BLDS) {
      const grp = new THREE.Group();
      const cx = b.tile[0] + b.size[0] / 2 - 0.5, cz = b.tile[1] + b.size[1] / 2 - 0.5;
      const gh = this.gh(b.tile[0], b.tile[1]);
      grp.position.set(cx, gh, cz);
      if (b.type === 'house') {
        const bd = new THREE.Mesh(g.box, mat('#d4a574')); bd.scale.set(1.6, 1.2, 1.4); bd.position.y = 0.6; bd.castShadow = true; grp.add(bd);
        const rf = new THREE.Mesh(g.cone, mat('#8b4513')); rf.scale.set(2.0, 1.0, 1.8); rf.position.y = 1.7; rf.castShadow = true; grp.add(rf);
        const dr = new THREE.Mesh(g.box, mat('#5a3010')); dr.scale.set(0.3, 0.5, 0.05); dr.position.set(0, 0.35, 0.73); grp.add(dr);
      } else if (b.type === 'tower') {
        const bs = new THREE.Mesh(g.cyl, mat('#808080')); bs.scale.set(1.2, 3.0, 1.2); bs.position.y = 1.5; bs.castShadow = true; grp.add(bs);
        const tp = new THREE.Mesh(g.cone, mat('#c9a96e')); tp.scale.set(1.6, 1.2, 1.6); tp.position.y = 3.6; tp.castShadow = true; grp.add(tp);
        for (let i = 0; i < 4; i++) {
          const bt = new THREE.Mesh(g.box, mat('#707070')); bt.scale.set(0.2, 0.3, 0.2);
          const a = (i / 4) * Math.PI * 2; bt.position.set(Math.cos(a) * 0.6, 3.15, Math.sin(a) * 0.6); grp.add(bt);
        }
      } else if (b.type === 'castle') {
        const kp = new THREE.Mesh(g.box, mat('#696969')); kp.scale.set(2.5, 2.5, 2.5); kp.position.y = 1.25; kp.castShadow = true; grp.add(kp);
        for (const [tx, tz] of [[-1.2, -1.2], [1.2, -1.2], [-1.2, 1.2], [1.2, 1.2]]) {
          const tw = new THREE.Mesh(g.cyl, mat('#787878')); tw.scale.set(0.5, 3.5, 0.5); tw.position.set(tx, 1.75, tz); tw.castShadow = true; grp.add(tw);
          const tc = new THREE.Mesh(g.cone, mat('#c9a96e')); tc.scale.set(0.7, 0.8, 0.7); tc.position.set(tx, 3.9, tz); grp.add(tc);
        }
        const pole = new THREE.Mesh(g.cyl, mat('#a0a0a0')); pole.scale.set(0.05, 1.5, 0.05); pole.position.y = 3.25; grp.add(pole);
        const flag = new THREE.Mesh(g.box, mat('#c9a96e')); flag.scale.set(0.6, 0.3, 0.02); flag.position.set(0.3, 3.85, 0); grp.add(flag);
      } else if (b.type === 'market') {
        const bs = new THREE.Mesh(g.box, mat('#deb887')); bs.scale.set(2.4, 0.8, 1.4); bs.position.y = 0.4; bs.castShadow = true; grp.add(bs);
        const pm = mat('#8b6914');
        for (const px of [-1.0, 1.0]) for (const pz of [-0.5, 0.5]) {
          const p = new THREE.Mesh(g.cyl, pm); p.scale.set(0.06, 1.8, 0.06); p.position.set(px, 0.9, pz); grp.add(p);
        }
        const aw = new THREE.Mesh(g.box, mat('#b22222')); aw.scale.set(2.6, 0.1, 1.4); aw.position.y = 1.8; aw.castShadow = true; grp.add(aw);
      } else if (b.type === 'windmill') {
        const bs = new THREE.Mesh(g.box, mat('#d4a574')); bs.scale.set(1.4, 2.0, 1.4); bs.position.y = 1.0; bs.castShadow = true; grp.add(bs);
        const rf = new THREE.Mesh(g.cone, mat('#8b4513')); rf.scale.set(1.8, 1.0, 1.8); rf.position.y = 2.5; rf.castShadow = true; grp.add(rf);
        const blades = new THREE.Group(); blades.position.set(0, 2.0, 0.8);
        const bm = mat('#a0522d');
        for (let i = 0; i < 4; i++) {
          const arm = new THREE.Mesh(g.box, bm); arm.scale.set(0.1, 1.5, 0.04);
          const a = (i / 4) * Math.PI * 2; arm.position.set(Math.sin(a) * 0.75, Math.cos(a) * 0.75, 0); arm.rotation.z = a; blades.add(arm);
        }
        grp.add(blades); this.wmBlades = blades;
      }
      this.scene.add(grp);
    }
  }

  // ── Trees & Rocks ──
  private placeDecos() {
    const g = G(), rng = srand(123);
    for (let i = 0; i < 50; i++) {
      const tx = Math.floor(rng() * MAP), tz = Math.floor(rng() * MAP);
      if (this.blocked.has(`${tx},${tz}`) || this.grid[tx]?.[tz] === T.WATER || this.grid[tx]?.[tz] === T.SAND) continue;
      if (Math.abs(tx - 16) < 3 && Math.abs(tz - 20) < 3) continue;
      const h = this.gh(tx, tz), gr = new THREE.Group(); gr.position.set(tx, h, tz);
      const sv = 0.7 + rng() * 0.6;
      const trunk = new THREE.Mesh(g.cyl, mat('#654321')); trunk.scale.set(0.12 * sv, 0.8 * sv, 0.12 * sv); trunk.position.y = 0.4 * sv; trunk.castShadow = true; gr.add(trunk);
      const fc = rng() > 0.5 ? '#2d5a27' : '#3a7533';
      for (let j = 0; j < 2 + Math.floor(rng()); j++) {
        const cn = new THREE.Mesh(g.cone, mat(fc)); const cs = (1.0 - j * 0.2) * sv;
        cn.scale.set(cs * 0.8, cs * 0.6, cs * 0.8); cn.position.y = (0.8 + j * 0.35) * sv; cn.castShadow = true; gr.add(cn);
      }
      this.scene.add(gr); this.blocked.add(`${tx},${tz}`);
    }
    for (let i = 0; i < 15; i++) {
      const rx = Math.floor(rng() * MAP), rz = Math.floor(rng() * MAP);
      if (this.blocked.has(`${rx},${rz}`) || this.grid[rx]?.[rz] === T.WATER) continue;
      const rock = new THREE.Mesh(g.dodec, mat('#888888')); const s = 0.15 + rng() * 0.2;
      rock.scale.set(s, s * 0.7, s); rock.position.set(rx, this.gh(rx, rz) + s * 0.3, rz);
      rock.rotation.set(rng() * 0.3, rng() * Math.PI, rng() * 0.3); rock.castShadow = true; this.scene.add(rock);
    }
  }

  // ── Resources ──
  private placeResources() {
    const g = G();
    for (const rd of RESS) {
      if (this.blocked.has(`${rd.tile[0]},${rd.tile[1]}`)) continue;
      const h = this.gh(rd.tile[0], rd.tile[1]), gr = new THREE.Group(); gr.position.set(rd.tile[0], h, rd.tile[1]);
      let mesh: THREE.Mesh;
      if (rd.type === 'gold') {
        mesh = new THREE.Mesh(g.oct, new THREE.MeshLambertMaterial({ color: '#ffd700', emissive: 0xffd700, emissiveIntensity: 0.3 }));
        mesh.scale.setScalar(0.3); mesh.position.y = 0.4;
      } else if (rd.type === 'wood') {
        mesh = new THREE.Mesh(g.cyl, mat('#8b6914')); mesh.scale.set(0.2, 0.5, 0.2); mesh.position.y = 0.15; mesh.rotation.z = Math.PI / 2;
        const l2 = new THREE.Mesh(g.cyl, mat('#7a5810')); l2.scale.set(0.18, 0.45, 0.18); l2.position.set(0.1, 0.3, 0.1); l2.rotation.z = Math.PI / 2; gr.add(l2);
      } else {
        mesh = new THREE.Mesh(g.dodec, mat('#555555')); mesh.scale.set(0.35, 0.3, 0.35); mesh.position.y = 0.2;
      }
      mesh.castShadow = true; gr.add(mesh); this.scene.add(gr);
      this.res.push({ g: gr, def: rd, got: false, respawn: 0, mesh });
    }
  }

  // ── NPCs ──
  private createNPCs() {
    const g = G();
    for (const def of NPCS) {
      const { grp, la, ra, ll, rl } = this.mkHuman(def.color, 0.9);
      const h = this.gh(def.start[0], def.start[1]);
      grp.position.set(def.start[0], h, def.start[1]);
      const ind = new THREE.Mesh(g.oct, new THREE.MeshLambertMaterial({ color: '#ffd700', emissive: 0xffd700, emissiveIntensity: 0.5 }));
      ind.scale.setScalar(0.12); ind.position.y = 1.4; ind.visible = false; grp.add(ind);
      this.scene.add(grp);
      this.npcs.push({ g: grp, def, wp: 0, tile: [...def.start] as [number, number], pos: new THREE.Vector3(def.start[0], h, def.start[1]), tgt: new THREE.Vector3(def.start[0], h, def.start[1]), mv: false, pause: 2 + Math.random() * 2, angle: 0, wt: 0, p: { la, ra, ll, rl }, ind });
    }
  }

  // ── Input ──
  private setupInput() {
    const kd = (e: KeyboardEvent) => { this.keys.add(e.key.toLowerCase()); if (this.dialog && (e.key === ' ' || e.key === 'Enter' || e.key === 'Escape')) this.advDialog(); };
    const ku = (e: KeyboardEvent) => this.keys.delete(e.key.toLowerCase());
    const cl = (e: MouseEvent) => { const r = this.ctr.getBoundingClientRect(); this.mNDC.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); this.handleClick(); };
    const wh = (e: WheelEvent) => { e.preventDefault(); this.cam.zoom = Math.max(20, Math.min(80, this.cam.zoom - e.deltaY * 0.03)); this.cam.updateProjectionMatrix(); };
    window.addEventListener('keydown', kd); window.addEventListener('keyup', ku);
    this.ctr.addEventListener('click', cl); this.ctr.addEventListener('wheel', wh, { passive: false });
    this.cleanup = () => { window.removeEventListener('keydown', kd); window.removeEventListener('keyup', ku); this.ctr.removeEventListener('click', cl); this.ctr.removeEventListener('wheel', wh); };
  }

  private handleClick() {
    if (this.dialog) { this.advDialog(); return; }
    this.ray.setFromCamera(this.mNDC, this.cam);
    // NPC click
    for (const n of this.npcs) { if (this.ray.intersectObject(n.g, true).length > 0) { this.walkTo(n.tile, n.def); return; } }
    // Resource click
    for (const r of this.res) { if (!r.got && this.ray.intersectObject(r.g, true).length > 0) { this.walkToRes(r); return; } }
    // Ground click
    const pt = new THREE.Vector3();
    if (this.ray.ray.intersectPlane(this.gPlane, pt)) {
      const tx = Math.round(pt.x), tz = Math.round(pt.z);
      if (tx >= 0 && tx < MAP && tz >= 0 && tz < MAP && !this.blocked.has(`${tx},${tz}`)) {
        const path = astar((x, z) => !this.blocked.has(`${x},${z}`), this.pTile[0], this.pTile[1], tx, tz);
        if (path && path.length > 1) { this.pPath = path; this.pPI = 1; this.pMoving = true; this.pendNPC = null; this.pendRes = null; }
      }
    }
  }

  private walkTo(tile: [number, number], npcDef: NPCDef) {
    const adj = this.adjTiles(tile[0], tile[1]);
    if (adj.length === 0) return;
    const path = astar((x, z) => !this.blocked.has(`${x},${z}`), this.pTile[0], this.pTile[1], adj[0][0], adj[0][1]);
    if (path) { this.pPath = path; this.pPI = 1; this.pMoving = true; this.pendNPC = npcDef; this.pendRes = null; }
  }

  private walkToRes(r: typeof this.res[0]) {
    const adj = this.adjTiles(r.def.tile[0], r.def.tile[1]);
    const target = adj.length > 0 ? adj[0] : r.def.tile;
    const path = astar((x, z) => !this.blocked.has(`${x},${z}`), this.pTile[0], this.pTile[1], target[0], target[1]);
    if (path) { this.pPath = path; this.pPI = 1; this.pMoving = true; this.pendRes = r; this.pendNPC = null; }
  }

  public advDialog() {
    if (!this.dialog) return;
    this.dialog.idx++;
    if (this.dialog.idx >= this.dialog.npc.dialogs.length) { this.dialog = null; this.updDialog(null); }
    else this.updDialog(this.dialog);
  }

  private updDialog(d: { npc: NPCDef; idx: number } | null) {
    const p = document.getElementById('gd-panel'), n = document.getElementById('gd-name'), t = document.getElementById('gd-text');
    if (!p) return;
    if (d) { p.style.opacity = '1'; p.style.transform = 'translateY(0)'; p.style.pointerEvents = 'auto'; if (n) n.textContent = d.npc.name; if (t) t.textContent = d.npc.dialogs[d.idx]; }
    else { p.style.opacity = '0'; p.style.transform = 'translateY(20px)'; p.style.pointerEvents = 'none'; }
  }

  // ── Helpers ──
  private tw(x: number, z: number) { return new THREE.Vector3(x, this.gh(x, z), z); }
  private gh(x: number, z: number) { return (x >= 0 && x < MAP && z >= 0 && z < MAP) ? this.hts[x][z] : 0.4; }
  private adjTiles(tx: number, tz: number): [number, number][] {
    const a: [number, number][] = [];
    for (const [dx, dz] of [[0, 1], [0, -1], [1, 0], [-1, 0]] as const) {
      const nx = tx + dx, nz = tz + dz;
      if (nx >= 0 && nx < MAP && nz >= 0 && nz < MAP && !this.blocked.has(`${nx},${nz}`)) a.push([nx, nz]);
    }
    a.sort((a, b) => (Math.abs(a[0] - this.pTile[0]) + Math.abs(a[1] - this.pTile[1])) - (Math.abs(b[0] - this.pTile[0]) + Math.abs(b[1] - this.pTile[1])));
    return a;
  }

  // ── Game Loop ──
  private animate = () => {
    if (this.dead) return;
    this.aid = requestAnimationFrame(this.animate);
    const dt = Math.min(this.clk.getDelta(), 0.05), t = this.clk.getElapsedTime();
    this.updPlayer(dt, t);
    this.updNPCs(dt, t);
    this.updRes(dt, t);
    this.updDayNight(t);
    this.updCam(dt);
    if (this.wmBlades) this.wmBlades.rotation.z += dt * 0.5;
    // Water anim
    for (const wm of this.waterMeshes) wm.position.y = (wm.scale.y / 2) + Math.sin(t * 1.5 + wm.position.x * 0.5 + wm.position.z * 0.3) * 0.02;
    // NPC indicators
    for (const n of this.npcs) {
      const dist = Math.abs(n.tile[0] - this.pTile[0]) + Math.abs(n.tile[1] - this.pTile[1]);
      n.ind.visible = dist < 5; if (n.ind.visible) { n.ind.rotation.y = t * 2; n.ind.position.y = 1.4 + Math.sin(t * 3) * 0.08; }
    }
    // Minimap every ~6 frames
    if (Math.floor(t * 60) % 6 === 0) this.updMinimap();
    this.r.render(this.scene, this.cam);
  };

  // ── Player ──
  private updPlayer(dt: number, t: number) {
    const dir = this.wasd();
    if (dir.x !== 0 || dir.z !== 0) {
      this.pPath = []; this.pendNPC = null; this.pendRes = null;
      const nx = this.pPos.x + dir.x * SPEED * dt, nz = this.pPos.z + dir.z * SPEED * dt;
      const ntx = Math.round(nx), ntz = Math.round(nz);
      if (ntx >= 0 && ntx < MAP && ntz >= 0 && ntz < MAP && !this.blocked.has(`${ntx},${ntz}`)) {
        this.pPos.x = nx; this.pPos.z = nz; this.pTile = [ntx, ntz]; this.pPos.y = this.gh(ntx, ntz);
      }
      this.pTAngle = Math.atan2(dir.x, dir.z); this.pMoving = true; this.pWalk += dt * 8;
    } else if (this.pPath.length > 0 && this.pPI < this.pPath.length) {
      const tgt = this.pPath[this.pPI], tp = this.tw(tgt[0], tgt[1]);
      const dx = tp.x - this.pPos.x, dz = tp.z - this.pPos.z, dist = Math.sqrt(dx * dx + dz * dz);
      if (dist < 0.1) {
        this.pPos.copy(tp); this.pTile = [tgt[0], tgt[1]]; this.pPI++;
        if (this.pPI >= this.pPath.length) {
          this.pPath = []; this.pMoving = false;
          if (this.pendNPC) { this.dialog = { npc: this.pendNPC, idx: 0 }; this.updDialog(this.dialog); this.pendNPC = null; }
          if (this.pendRes && !this.pendRes.got) {
            this.pendRes.got = true; this.pendRes.g.visible = false; this.pendRes.respawn = 30;
            this.rc[this.pendRes.def.type]++; this.updRC(); this.pendRes = null;
          }
        }
      } else {
        this.pPos.x += (dx / dist) * SPEED * dt; this.pPos.z += (dz / dist) * SPEED * dt;
        this.pPos.y = this.gh(Math.round(this.pPos.x), Math.round(this.pPos.z));
        this.pTile = [Math.round(this.pPos.x), Math.round(this.pPos.z)];
        this.pTAngle = Math.atan2(dx, dz); this.pWalk += dt * 8;
      }
    } else { this.pMoving = false; this.pWalk = 0; }
    // Smooth angle
    let ad = this.pTAngle - this.pAngle; while (ad > Math.PI) ad -= Math.PI * 2; while (ad < -Math.PI) ad += Math.PI * 2;
    this.pAngle += ad * Math.min(1, dt * 10);
    this.player.position.copy(this.pPos); this.player.rotation.y = this.pAngle;
    // Animation
    if (this.pMoving) {
      const sw = Math.sin(this.pWalk) * 0.4;
      this.pParts.la.rotation.x = sw; this.pParts.ra.rotation.x = -sw; this.pParts.ll.rotation.x = -sw; this.pParts.rl.rotation.x = sw;
      this.pParts.body.position.y = 0.65 + Math.abs(Math.sin(this.pWalk * 2)) * 0.03;
    } else {
      this.pParts.la.rotation.x = this.pParts.ra.rotation.x = this.pParts.ll.rotation.x = this.pParts.rl.rotation.x = 0;
      this.pParts.body.position.y = 0.65 + Math.sin(t * 2) * 0.015;
    }
    this.updLoc();
  }

  private wasd(): THREE.Vector3 {
    const d = new THREE.Vector3();
    if (this.keys.has('w') || this.keys.has('arrowup')) d.z -= 1;
    if (this.keys.has('s') || this.keys.has('arrowdown')) d.z += 1;
    if (this.keys.has('a') || this.keys.has('arrowleft')) d.x -= 1;
    if (this.keys.has('d') || this.keys.has('arrowright')) d.x += 1;
    if (d.x === 0 && d.z === 0) return d;
    const c = Math.cos(Math.PI / 4), s = Math.sin(Math.PI / 4);
    const rx = d.x * c - d.z * s, rz = d.x * s + d.z * c;
    return new THREE.Vector3(rx, 0, rz).normalize();
  }

  // ── NPCs ──
  private updNPCs(dt: number, _t: number) {
    for (const n of this.npcs) {
      if (n.mv) {
        const dx = n.tgt.x - n.pos.x, dz = n.tgt.z - n.pos.z, dist = Math.sqrt(dx * dx + dz * dz);
        if (dist < 0.1) { n.pos.copy(n.tgt); n.mv = false; n.pause = 2 + Math.random() * 3; n.tile = [Math.round(n.pos.x), Math.round(n.pos.z)]; }
        else { const sp = 1.5 * dt; n.pos.x += (dx / dist) * sp; n.pos.z += (dz / dist) * sp; n.angle = Math.atan2(dx, dz); n.wt += dt * 6; }
      } else {
        n.pause -= dt;
        if (n.pause <= 0) { n.wp = (n.wp + 1) % n.def.waypoints.length; const wp = n.def.waypoints[n.wp]; n.tgt.set(wp[0], this.gh(wp[0], wp[1]), wp[1]); n.mv = true; n.wt = 0; }
      }
      n.g.position.copy(n.pos); n.g.rotation.y = n.angle;
      if (n.mv) { const sw = Math.sin(n.wt) * 0.3; n.p.la.rotation.x = sw; n.p.ra.rotation.x = -sw; n.p.ll.rotation.x = -sw; n.p.rl.rotation.x = sw; }
      else { n.p.la.rotation.x = n.p.ra.rotation.x = n.p.ll.rotation.x = n.p.rl.rotation.x = 0; }
    }
  }

  // ── Resources ──
  private updRes(dt: number, t: number) {
    for (const r of this.res) {
      if (r.got) { r.respawn -= dt; if (r.respawn <= 0) { r.got = false; r.g.visible = true; } }
      else if (r.def.type === 'gold') { r.mesh.rotation.y = t * 2; r.mesh.position.y = 0.4 + Math.sin(t * 2 + r.def.tile[0]) * 0.08; }
    }
  }

  // ── Day/Night ──
  private updDayNight(t: number) {
    const d = (t % 90) / 90;
    let ac: THREE.Color, sc: THREE.Color, si: number, ai: number, sky: THREE.Color;
    if (d < 0.15) {
      const f = d / 0.15;
      ac = new THREE.Color('#4a3520').lerp(new THREE.Color('#ffffff'), f);
      sc = new THREE.Color('#ff8040').lerp(new THREE.Color('#fff5e0'), f);
      si = 0.4 + f * 0.6; ai = 0.3 + f * 0.3; sky = new THREE.Color('#2a1a30').lerp(new THREE.Color('#87CEEB'), f);
    } else if (d < 0.45) {
      ac = new THREE.Color('#ffffff'); sc = new THREE.Color('#fff5e0'); si = 1.0; ai = 0.6; sky = new THREE.Color('#87CEEB');
    } else if (d < 0.6) {
      const f = (d - 0.45) / 0.15;
      ac = new THREE.Color('#ffffff').lerp(new THREE.Color('#6040a0'), f);
      sc = new THREE.Color('#fff5e0').lerp(new THREE.Color('#ff6030'), f);
      si = 1.0 - f * 0.5; ai = 0.6 - f * 0.2; sky = new THREE.Color('#87CEEB').lerp(new THREE.Color('#4a2a50'), f);
    } else if (d < 0.85) {
      const f = Math.min(1, (d - 0.6) / 0.15);
      ac = new THREE.Color('#6040a0').lerp(new THREE.Color('#1a1a3a'), f);
      sc = new THREE.Color('#ff6030').lerp(new THREE.Color('#3a3a6a'), f);
      si = 0.5 - f * 0.3; ai = 0.4 - f * 0.15; sky = new THREE.Color('#4a2a50').lerp(new THREE.Color('#0a0a20'), f);
    } else {
      const f = (d - 0.85) / 0.15;
      ac = new THREE.Color('#1a1a3a').lerp(new THREE.Color('#4a3520'), f);
      sc = new THREE.Color('#3a3a6a').lerp(new THREE.Color('#ff8040'), f);
      si = 0.2 + f * 0.2; ai = 0.25 + f * 0.05; sky = new THREE.Color('#0a0a20').lerp(new THREE.Color('#2a1a30'), f);
    }
    this.aLight.color.copy(ac); this.aLight.intensity = ai;
    this.sLight.color.copy(sc); this.sLight.intensity = si;
    this.r.setClearColor(sky);
    if (this.scene.fog) (this.scene.fog as THREE.FogExp2).color.copy(sky);
    const sa = d * Math.PI * 2;
    this.sLight.position.set(Math.cos(sa) * 30, Math.sin(sa) * 25 + 10, 20);
  }

  // ── Camera ──
  private updCam(dt: number) {
    this.camLook.lerp(this.pPos, dt * 3);
    this.cam.position.set(this.camLook.x + CAM_OFF.x, CAM_OFF.y, this.camLook.z + CAM_OFF.z);
    this.cam.lookAt(this.camLook);
    this.sLight.target.position.copy(this.camLook);
    this.sLight.target.updateMatrixWorld();
  }

  // ── HUD Updates (direct DOM) ──
  private updRC() {
    const ge = document.getElementById('g-gold'), we = document.getElementById('g-wood'), se = document.getElementById('g-stone');
    if (ge) ge.textContent = String(this.rc.gold); if (we) we.textContent = String(this.rc.wood); if (se) se.textContent = String(this.rc.stone);
  }

  private updLoc() {
    const el = document.getElementById('g-loc'); if (!el) return;
    let lbl = '';
    for (const b of BLDS) {
      if (Math.abs(this.pTile[0] - (b.tile[0] + b.size[0] / 2)) < b.size[0] && Math.abs(this.pTile[1] - (b.tile[1] + b.size[1] / 2)) < b.size[1]) { lbl = b.label; break; }
    }
    if (!lbl) { const t = this.grid[this.pTile[0]]?.[this.pTile[1]]; lbl = t === T.GRASS ? 'Green Fields' : t === T.DIRT ? 'Dusty Path' : t === T.STONE ? 'Rocky Ground' : t === T.SAND ? 'Sandy Shore' : 'Wilderness'; }
    el.textContent = lbl;
  }

  private updMinimap() {
    const c = document.getElementById('g-mm') as HTMLCanvasElement; if (!c) return;
    const ctx = c.getContext('2d'); if (!ctx) return;
    const s = c.width / MAP;
    ctx.clearRect(0, 0, c.width, c.height);
    for (let x = 0; x < MAP; x++) for (let z = 0; z < MAP; z++) { ctx.fillStyle = T_MAP_COL[this.grid[x][z]] || '#333'; ctx.fillRect(x * s, z * s, s + 0.5, s + 0.5); }
    ctx.fillStyle = '#888';
    for (const b of BLDS) ctx.fillRect(b.tile[0] * s, b.tile[1] * s, b.size[0] * s, b.size[1] * s);
    ctx.fillStyle = '#ff0';
    for (const n of this.npcs) { ctx.beginPath(); ctx.arc(n.tile[0] * s + s / 2, n.tile[1] * s + s / 2, s, 0, Math.PI * 2); ctx.fill(); }
    for (const r of this.res) { if (r.got) continue; ctx.fillStyle = r.def.type === 'gold' ? '#ffd700' : r.def.type === 'wood' ? '#8b6914' : '#555'; ctx.beginPath(); ctx.arc(r.def.tile[0] * s + s / 2, r.def.tile[1] * s + s / 2, s * 0.7, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = '#c9a96e'; ctx.beginPath(); ctx.arc(this.pTile[0] * s + s / 2, this.pTile[1] * s + s / 2, s * 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 1; ctx.stroke();
  }

  // ── Resize / Dispose ──
  onResize = () => {
    const w = this.ctr.clientWidth, h = this.ctr.clientHeight;
    this.r.setSize(w, h); this.cam.left = -w / 2; this.cam.right = w / 2; this.cam.top = h / 2; this.cam.bottom = -h / 2; this.cam.updateProjectionMatrix();
  };
  dispose() {
    this.dead = true; cancelAnimationFrame(this.aid);
    this.cleanup?.(); window.removeEventListener('resize', this.onResize);
    this.r.dispose(); this.r.domElement.remove(); document.body.style.cursor = 'default';
  }
}

// ═══════════════════════════════════════════════════════════════════════
// HUD OVERLAY
// ═══════════════════════════════════════════════════════════════════════
function HUDOverlay({ isReady, onContinue }: { isReady: boolean; onContinue: () => void }) {
  return (
    <div className="absolute inset-0 pointer-events-none z-10" style={{ fontFamily: 'var(--font-mono)' }}>
      {/* Resources */}
      <div className="absolute top-4 left-4 flex gap-4 transition-opacity duration-700" style={{ opacity: isReady ? 1 : 0, transitionDelay: '800ms' }}>
        {[['gold', '#ffd700', 'g-gold'], ['wood', '#8b6914', 'g-wood'], ['stone', '#888', 'g-stone']].map(([label, color, id]) => (
          <div key={label} className="flex items-center gap-1.5 bg-black/50 backdrop-blur-sm rounded px-3 py-1.5">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color as string }} />
            <span className="text-[11px] uppercase tracking-wider text-white/70">{label}</span>
            <span id={id as string} className="text-[13px] font-bold text-white">0</span>
          </div>
        ))}
      </div>
      {/* Location */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 transition-opacity duration-700" style={{ opacity: isReady ? 1 : 0, transitionDelay: '1000ms' }}>
        <div className="bg-black/40 backdrop-blur-sm rounded px-4 py-1.5">
          <span id="g-loc" className="text-[11px] uppercase tracking-[0.2em] text-white/70">Wilderness</span>
        </div>
      </div>
      {/* Mini-map */}
      <div className="absolute top-4 right-4 transition-opacity duration-700" style={{ opacity: isReady ? 1 : 0, transitionDelay: '800ms' }}>
        <div className="bg-black/50 backdrop-blur-sm rounded p-1.5">
          <canvas id="g-mm" width={128} height={128} className="rounded" style={{ width: 128, height: 128 }} />
        </div>
      </div>
      {/* Dialog panel */}
      <div id="gd-panel" className="absolute bottom-20 left-1/2 -translate-x-1/2 w-[90%] max-w-lg transition-all duration-300" style={{ opacity: 0, transform: 'translateY(20px)', pointerEvents: 'none' }}>
        <div className="bg-black/70 backdrop-blur-md rounded-lg border border-white/10 p-4 pointer-events-auto cursor-pointer" onClick={onContinue}>
          <p id="gd-name" className="text-[11px] uppercase tracking-[0.2em] text-gold mb-2" style={{ color: '#c9a96e' }} />
          <p id="gd-text" className="text-sm text-white/90 leading-relaxed" style={{ fontFamily: 'var(--font-heading)' }} />
          <p className="text-[9px] uppercase tracking-wider text-white/30 mt-3">Click or press Space to continue</p>
        </div>
      </div>
      {/* Controls hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 transition-opacity duration-700" style={{ opacity: isReady ? 1 : 0, transitionDelay: '1200ms' }}>
        <p className="text-[9px] uppercase tracking-[0.15em] text-white/30 bg-black/30 rounded px-3 py-1">WASD to move &middot; Click to interact &middot; Scroll to zoom</p>
      </div>
      {/* Title */}
      <div className="absolute top-4 left-4 transition-opacity duration-1000 pointer-events-none" style={{ opacity: isReady ? 0 : 0 }}>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// LOADING SCREEN
// ═══════════════════════════════════════════════════════════════════════
function LoadingScreen({ isLoaded }: { isLoaded: boolean }) {
  const [bar, setBar] = useState(0);
  useEffect(() => { const r = requestAnimationFrame(() => setBar(100)); return () => cancelAnimationFrame(r); }, []);
  return (
    <div className="absolute inset-0 z-40 bg-[#0a0a0a] flex flex-col items-center justify-center transition-opacity duration-1000" style={{ opacity: isLoaded ? 0 : 1, pointerEvents: isLoaded ? 'none' : 'auto' }}>
      <p className="text-2xl tracking-[0.4em] uppercase mb-8 text-foreground" style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}>Tartary</p>
      <div className="w-48 h-[1px] bg-white/10 mx-auto relative overflow-hidden">
        <div className="absolute top-0 left-0 h-full bg-[#c9a96e] transition-all ease-in-out" style={{ width: `${bar}%`, transitionDuration: '2.2s' }} />
      </div>
      <p className="text-[10px] tracking-[0.25em] uppercase text-white/30 mt-4" style={{ fontFamily: 'var(--font-mono)' }}>Loading world</p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════
export default function TartaryWorld() {
  const cRef = useRef<HTMLDivElement>(null);
  const eRef = useRef<IsometricGameEngine | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!cRef.current) return;
    eRef.current = new IsometricGameEngine(cRef.current);
    const onResize = eRef.current.onResize;
    window.addEventListener('resize', onResize);
    return () => { eRef.current?.dispose(); eRef.current = null; window.removeEventListener('resize', onResize); };
  }, []);

  useEffect(() => { const t = setTimeout(() => setLoaded(true), 2500); return () => clearTimeout(t); }, []);

  return (
    <div className="relative w-full h-screen bg-[#0a0a0a] overflow-hidden">
      <div ref={cRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
      <HUDOverlay isReady={loaded} onContinue={() => eRef.current?.advDialog()} />
      <LoadingScreen isLoaded={loaded} />
    </div>
  );
}
