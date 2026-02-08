'use client';

import { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';

// ═══════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════
const CK = 16;          // chunk size (16x16)
const RD = 3;           // render distance in chunks
const VR = 10;          // visibility radius (fog of war)
const SEED = 42;        // world seed
const SPEED = 4.0;
const MAX_I = 16384;    // max instances per tile type
const T = { GRASS: 0, DIRT: 1, STONE: 2, WATER: 3, SAND: 4 } as const;
const T_COL: Record<number, number> = { 0: 0x4a7c3f, 1: 0x8b7355, 2: 0x6b6b6b, 3: 0x2a5f8f, 4: 0xc2b280 };
const T_HT: Record<number, number> = { 0: 0.4, 1: 0.35, 2: 0.5, 3: 0.15, 4: 0.3 };
const T_MAP: Record<number, string> = { 0: '#4a7c3f', 1: '#8b7355', 2: '#6b6b6b', 3: '#2a5f8f', 4: '#c2b280' };
const BASE_C = Object.fromEntries(Object.entries(T_COL).map(([k, v]) => [k, new THREE.Color(v)])) as Record<number, THREE.Color>;
const CAM_OFF = new THREE.Vector3(12, 12, 12);
const MM_R = 32; // minimap radius in tiles

// ═══════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════
interface TileD { type: number; height: number }
interface BldInst { grp: THREE.Group; tile: [number, number]; size: [number, number]; label: string; blades?: THREE.Group }
interface NPCInst { g: THREE.Group; name: string; color: string; dialogs: string[]; wp: number; wps: [number, number][]; tile: [number, number]; pos: THREE.Vector3; tgt: THREE.Vector3; mv: boolean; pause: number; angle: number; wt: number; p: { la: THREE.Mesh; ra: THREE.Mesh; ll: THREE.Mesh; rl: THREE.Mesh }; ind: THREE.Mesh }
interface ResInst { g: THREE.Group; type: 'gold' | 'wood' | 'stone'; tile: [number, number]; got: boolean; respawn: number; mesh: THREE.Mesh }
interface HidInst { g: THREE.Group; type: 'chest' | 'ruin' | 'stone' | 'hermit'; tile: [number, number]; found: boolean; dialogs: string[]; mesh: THREE.Mesh }
interface ChunkD { cx: number; cz: number; key: string; tiles: TileD[][]; blds: BldInst[]; npcs: NPCInst[]; res: ResInst[]; hid: HidInst[]; meshes: THREE.Object3D[] }

// ═══════════════════════════════════════════════════════════════════════
// DATA POOLS
// ═══════════════════════════════════════════════════════════════════════
const NPC_NAMES = ['Aldric','Bren','Cael','Dara','Eira','Finn','Gwyn','Hale','Iris','Jora','Kael','Luna','Mira','Nira','Orin','Penn','Reva','Sage','Thane','Uma','Vale','Wren','Yara','Zara'];
const V_DLG: string[][] = [
  ['Welcome, traveler. These lands are vast.', 'Explore wisely — not all paths are safe.'],
  ['Trade caravans come through here sometimes.', 'Gold shines brighter near the mountains.'],
  ['The castle was built by the first settlers.', 'Many secrets lie buried in the soil.'],
  ['I\'ve heard tales of ancient ruins nearby.', 'Some say mysterious stones can speak.'],
  ['The forests are rich with timber.', 'Stay away from the deep waters.'],
  ['Stone is strongest in the highlands.', 'Hermits live in the far reaches.'],
  ['This settlement has stood for generations.', 'The wind carries whispers of old kingdoms.'],
  ['Have you seen the glowing stones? They hum.', 'Treasure chests hide in forgotten places.'],
];
const H_DLG: string[][] = [
  ['I chose solitude long ago...', 'The stones remember what we forget.', 'Listen to the wind — it knows.'],
  ['Long ago, this land was one kingdom.', 'Now only fragments remain.', 'You seek truth? Walk further.'],
  ['I\'ve walked this world longer than you know.', 'Every ruin tells a story.', 'Find the stones. They hold answers.'],
];
const CHEST_DLG = ['A hidden chest! +5 gold found.'];
const RUIN_DLG = ['Crumbling pillars mark where a great hall once stood...', 'Ancient inscriptions cover the walls.'];
const STONE_DLG = ['The stone hums with an ancient resonance...', 'Faint symbols glow on its surface.'];
const BLD_NAMES = ['Cottage', 'Farmhouse', 'Outpost', 'Waystation', 'Cabin', 'Lodge', 'Shelter'];

// ═══════════════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════════════
function srand(seed: number) { let s = Math.abs(seed) || 1; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }
function noise2(x: number, z: number, s: number) { const n = Math.sin(x * 12.9898 + z * 78.233 + s) * 43758.5453; return n - Math.floor(n); }
function snoise(x: number, z: number, s: number, sc: number) {
  const sx = x / sc, sz = z / sc, ix = Math.floor(sx), iz = Math.floor(sz), fx = sx - ix, fz = sz - iz;
  const a = noise2(ix, iz, s), b = noise2(ix + 1, iz, s), c = noise2(ix, iz + 1, s), d = noise2(ix + 1, iz + 1, s);
  const ux = fx * fx * (3 - 2 * fx), uz = fz * fz * (3 - 2 * fz);
  return a * (1 - ux) * (1 - uz) + b * ux * (1 - uz) + c * (1 - ux) * uz + d * ux * uz;
}
function cseed(cx: number, cz: number) { return Math.abs((cx * 73856093) ^ (cz * 19349663) ^ SEED) || 1; }

function astar(ok: (x: number, z: number) => boolean, sx: number, sz: number, ex: number, ez: number, maxDist = 60): [number, number][] | null {
  if (!ok(ex, ez) || Math.abs(ex - sx) + Math.abs(ez - sz) > maxDist) return null;
  const k = (x: number, z: number) => `${x},${z}`;
  const open: { x: number; z: number; g: number; f: number }[] = [{ x: sx, z: sz, g: 0, f: 0 }];
  const closed = new Set<string>(); const from = new Map<string, string>(); const gs = new Map<string, number>();
  gs.set(k(sx, sz), 0);
  while (open.length > 0) {
    open.sort((a, b) => a.f - b.f);
    const c = open.shift()!; const ck = k(c.x, c.z);
    if (c.x === ex && c.z === ez) {
      const path: [number, number][] = []; let pk: string | undefined = ck;
      while (pk !== undefined) { const [px, pz] = pk.split(',').map(Number); path.unshift([px, pz]); pk = from.get(pk); }
      return path;
    }
    closed.add(ck);
    for (const [dx, dz] of [[0, 1], [0, -1], [1, 0], [-1, 0]] as [number, number][]) {
      const nx = c.x + dx, nz = c.z + dz, nk = k(nx, nz);
      if (closed.has(nk) || !ok(nx, nz)) continue;
      const ng = c.g + 1;
      if ((gs.get(nk) ?? Infinity) <= ng) continue;
      gs.set(nk, ng); from.set(nk, ck);
      open.push({ x: nx, z: nz, g: ng, f: ng + Math.abs(nx - ex) + Math.abs(nz - ez) });
    }
  }
  return null;
}

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
// WORLD GENERATION
// ═══════════════════════════════════════════════════════════════════════
function genTile(wx: number, wz: number): TileD {
  const n = snoise(wx, wz, SEED, 48) + snoise(wx, wz, SEED + 500, 24) * 0.5 + snoise(wx, wz, SEED + 200, 8) * 0.25;
  // Rivers
  const rx = Math.sin(wz * 0.05 + SEED * 0.1) * 8 + Math.sin(wz * 0.12 + SEED * 0.3) * 3;
  const rd = Math.abs(wx - rx);
  const inRiver = rd < 1.2 && (wz % 80) < 55;
  // Lakes
  const lk = snoise(wx, wz, SEED + 1000, 20);
  const isLake = lk > 0.75;
  let type: number;
  if (inRiver || isLake) type = T.WATER;
  else if (rd < 2.5 && (wz % 80) < 55 || (lk > 0.68 && lk <= 0.75)) type = T.SAND;
  else if (n > 1.1) type = T.STONE;
  else if (n > 0.85) type = T.DIRT;
  else if (n < 0.3) type = T.SAND;
  else type = T.GRASS;
  const h = (T_HT[type] || 0.4) + snoise(wx, wz, SEED + 300, 6) * 0.08;
  return { type, height: h };
}

function genChunkTiles(cx: number, cz: number): TileD[][] {
  const tiles: TileD[][] = [];
  for (let lx = 0; lx < CK; lx++) {
    tiles[lx] = [];
    for (let lz = 0; lz < CK; lz++) tiles[lx][lz] = genTile(cx * CK + lx, cz * CK + lz);
  }
  return tiles;
}

// ═══════════════════════════════════════════════════════════════════════
// FOG STATE
// ═══════════════════════════════════════════════════════════════════════
class FogState {
  explored = new Set<string>();
  private vx = 0; private vz = 0;
  update(px: number, pz: number) {
    this.vx = px; this.vz = pz;
    for (let dx = -VR; dx <= VR; dx++) for (let dz = -VR; dz <= VR; dz++) {
      if (dx * dx + dz * dz <= VR * VR) this.explored.add(`${px + dx},${pz + dz}`);
    }
  }
  fogMul(wx: number, wz: number): number {
    const k = `${wx},${wz}`;
    if (!this.explored.has(k)) return 0.06;
    const dx = wx - this.vx, dz = wz - this.vz;
    return (dx * dx + dz * dz <= VR * VR) ? 1.0 : 0.3;
  }
}

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
  // Chunks
  private chunks = new Map<string, ChunkD>();
  private fog = new FogState();
  private blocked = new Set<string>();
  // InstancedMesh
  private iMesh: Record<number, THREE.InstancedMesh> = {};
  private tileBuf: Map<number, { wx: number; wz: number; h: number }[]> = new Map();
  private dummy = new THREE.Object3D();
  // Player
  private player!: THREE.Group;
  private pTile: [number, number] = [8, 12];
  private pPos = new THREE.Vector3(8, 0.4, 12);
  private pPath: [number, number][] = [];
  private pPI = 0;
  private pMoving = false;
  private pAngle = 0;
  private pTAngle = 0;
  private pWalk = 0;
  private pParts!: { la: THREE.Mesh; ra: THREE.Mesh; ll: THREE.Mesh; rl: THREE.Mesh; body: THREE.Mesh };
  private lastCx = -999;
  private lastCz = -999;
  private lastTx = -999;
  private lastTz = -999;
  // All NPCs/Resources across loaded chunks
  private allNPCs: NPCInst[] = [];
  private allRes: ResInst[] = [];
  private allHid: HidInst[] = [];
  private rc = { gold: 0, wood: 0, stone: 0 };
  // Input
  private keys = new Set<string>();
  private mNDC = new THREE.Vector2(-999, -999);
  // State
  private dialog: { name: string; dlgs: string[]; idx: number } | null = null;
  private pendNPC: NPCInst | null = null;
  private pendRes: ResInst | null = null;
  private pendHid: HidInst | null = null;
  private gPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.35);
  private aLight!: THREE.AmbientLight;
  private sLight!: THREE.DirectionalLight;
  private camLook = new THREE.Vector3();
  private cleanup: (() => void) | null = null;
  private discovered = 0;

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
    this.scene.fog = new THREE.FogExp2(0x87CEEB, 0.015);
    const w = ctr.clientWidth, h = ctr.clientHeight;
    this.cam = new THREE.OrthographicCamera(-w / 2, w / 2, h / 2, -h / 2, 0.1, 200);
    this.cam.zoom = 42;
    this.cam.updateProjectionMatrix();
    // InstancedMeshes
    const g = G();
    for (const t of [0, 1, 2, 3, 4]) {
      const m = new THREE.MeshLambertMaterial({ color: 0xffffff });
      if (t === T.WATER) { m.transparent = true; m.opacity = 0.7; }
      const im = new THREE.InstancedMesh(g.box, m, MAX_I);
      im.count = 0; im.castShadow = false; im.receiveShadow = true;
      this.scene.add(im);
      this.iMesh[t] = im;
      this.tileBuf.set(t, []);
    }
    this.setupLights();
    this.buildPlayer();
    this.fog.update(this.pTile[0], this.pTile[1]);
    this.updateChunks();
    const sp = this.getH(this.pTile[0], this.pTile[1]);
    this.pPos.set(this.pTile[0], sp, this.pTile[1]);
    this.player.position.copy(this.pPos);
    this.camLook.copy(this.pPos);
    this.cam.position.set(this.pPos.x + CAM_OFF.x, CAM_OFF.y, this.pPos.z + CAM_OFF.z);
    this.cam.lookAt(this.camLook);
    this.cam.updateProjectionMatrix();
    this.setupInput();
    this.animate();
  }

  // ── Lights ──
  private setupLights() {
    this.aLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(this.aLight);
    this.sLight = new THREE.DirectionalLight(0xfff5e0, 1.0);
    this.sLight.position.set(20, 30, 20);
    this.sLight.castShadow = true;
    this.sLight.shadow.mapSize.set(1024, 1024);
    const sc = this.sLight.shadow.camera;
    sc.left = -40; sc.right = 40; sc.top = 40; sc.bottom = -40; sc.far = 100;
    this.scene.add(this.sLight);
    this.scene.add(this.sLight.target);
    const fill = new THREE.DirectionalLight(0xb0c4de, 0.3);
    fill.position.set(-15, 20, -15);
    this.scene.add(fill);
  }

  // ── Humanoid builder ──
  private mkHuman(bodyCol: string, s = 1): { grp: THREE.Group; la: THREE.Mesh; ra: THREE.Mesh; ll: THREE.Mesh; rl: THREE.Mesh; body: THREE.Mesh } {
    const g = G(), grp = new THREE.Group();
    const body = new THREE.Mesh(g.box, mat(bodyCol)); body.scale.set(0.4 * s, 0.5 * s, 0.3 * s); body.position.y = 0.65 * s; body.castShadow = true; grp.add(body);
    const head = new THREE.Mesh(g.sphere, mat('#f5d6b0')); head.scale.setScalar(0.3 * s); head.position.y = 1.1 * s; head.castShadow = true; grp.add(head);
    const am = mat(bodyCol);
    const la = new THREE.Mesh(g.box, am); la.scale.set(0.12 * s, 0.4 * s, 0.12 * s); la.position.set(-0.28 * s, 0.65 * s, 0); grp.add(la);
    const ra = new THREE.Mesh(g.box, am.clone()); ra.scale.set(0.12 * s, 0.4 * s, 0.12 * s); ra.position.set(0.28 * s, 0.65 * s, 0); grp.add(ra);
    const lm = mat('#5a4a30');
    const ll = new THREE.Mesh(g.box, lm); ll.scale.set(0.14 * s, 0.35 * s, 0.14 * s); ll.position.set(-0.1 * s, 0.25 * s, 0); grp.add(ll);
    const rl = new THREE.Mesh(g.box, lm.clone()); rl.scale.set(0.14 * s, 0.35 * s, 0.14 * s); rl.position.set(0.1 * s, 0.25 * s, 0); grp.add(rl);
    return { grp, la, ra, ll, rl, body };
  }
  private buildPlayer() { const h = this.mkHuman('#c9a96e'); this.player = h.grp; this.pParts = h; this.scene.add(this.player); }

  // ═══════════════════════════════════════════════════════════════════
  // CHUNK MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════
  private updateChunks() {
    const pcx = Math.floor(this.pPos.x / CK), pcz = Math.floor(this.pPos.z / CK);
    // Unload far
    for (const [key, ch] of this.chunks) {
      if (Math.abs(ch.cx - pcx) > RD || Math.abs(ch.cz - pcz) > RD) {
        for (const m of ch.meshes) this.scene.remove(m);
        for (const n of ch.npcs) this.scene.remove(n.g);
        for (const r of ch.res) this.scene.remove(r.g);
        for (const h of ch.hid) this.scene.remove(h.g);
        // Remove from blocked
        for (const b of ch.blds) for (let dx = 0; dx < b.size[0]; dx++) for (let dz = 0; dz < b.size[1]; dz++) this.blocked.delete(`${b.tile[0] + dx},${b.tile[1] + dz}`);
        this.chunks.delete(key);
      }
    }
    // Load near
    let changed = false;
    for (let dx = -RD; dx <= RD; dx++) for (let dz = -RD; dz <= RD; dz++) {
      const cx = pcx + dx, cz = pcz + dz, key = `${cx},${cz}`;
      if (!this.chunks.has(key)) { this.loadChunk(cx, cz, key); changed = true; }
    }
    if (changed) {
      this.rebuildInstances();
      this.collectEntities();
    }
  }

  private loadChunk(cx: number, cz: number, key: string) {
    const tiles = genChunkTiles(cx, cz);
    const ch: ChunkD = { cx, cz, key, tiles, blds: [], npcs: [], res: [], hid: [], meshes: [] };
    const rng = srand(cseed(cx, cz));
    // Mark water + building blocked
    for (let lx = 0; lx < CK; lx++) for (let lz = 0; lz < CK; lz++) {
      if (tiles[lx][lz].type === T.WATER) this.blocked.add(`${cx * CK + lx},${cz * CK + lz}`);
    }
    // Spawn content
    this.spawnBuildings(ch, rng);
    this.spawnTrees(ch, rng);
    this.spawnResources(ch, rng);
    this.spawnNPCs(ch, rng);
    this.spawnHidden(ch, rng);
    this.chunks.set(key, ch);
  }

  // ── Building spawning ──
  private spawnBuildings(ch: ChunkD, rng: () => number) {
    const { cx, cz } = ch; const g = G();
    interface Bdef { type: string; lx: number; lz: number; sx: number; sz: number; label: string }
    const bdefs: Bdef[] = [];
    // Starting area hand-coded
    if (cx === 0 && cz === 0) bdefs.push({ type: 'castle', lx: 5, lz: 5, sx: 4, sz: 4, label: 'Castle Tartary' });
    else if (cx === 1 && cz === 0) { bdefs.push({ type: 'market', lx: 4, lz: 6, sx: 3, sz: 2, label: 'Market Square' }); bdefs.push({ type: 'house', lx: 11, lz: 11, sx: 2, sz: 2, label: "Merchant's Lodge" }); }
    else if (cx === 0 && cz === 1) { bdefs.push({ type: 'windmill', lx: 8, lz: 8, sx: 2, sz: 2, label: 'Old Windmill' }); bdefs.push({ type: 'house', lx: 3, lz: 12, sx: 2, sz: 2, label: "Fisherman's Hut" }); }
    else if (cx === -1 && cz === 0) bdefs.push({ type: 'tower', lx: 10, lz: 5, sx: 2, sz: 2, label: 'Watchtower' });
    else if (cx === 0 && cz === -1) bdefs.push({ type: 'house', lx: 7, lz: 8, sx: 2, sz: 2, label: "Elder's House" });
    else {
      const roll = rng();
      if (roll < 0.15) bdefs.push({ type: 'house', lx: 4 + Math.floor(rng() * 8), lz: 4 + Math.floor(rng() * 8), sx: 2, sz: 2, label: BLD_NAMES[Math.floor(rng() * BLD_NAMES.length)] });
      else if (roll < 0.22) bdefs.push({ type: 'tower', lx: 5 + Math.floor(rng() * 6), lz: 5 + Math.floor(rng() * 6), sx: 2, sz: 2, label: 'Watchtower' });
      else if (roll < 0.28) bdefs.push({ type: 'market', lx: 4 + Math.floor(rng() * 7), lz: 4 + Math.floor(rng() * 7), sx: 3, sz: 2, label: 'Trading Post' });
      else if (roll < 0.32) bdefs.push({ type: 'windmill', lx: 5 + Math.floor(rng() * 6), lz: 5 + Math.floor(rng() * 6), sx: 2, sz: 2, label: 'Windmill' });
    }
    for (const bd of bdefs) {
      const wx = cx * CK + bd.lx, wz = cz * CK + bd.lz;
      // Mark blocked and set terrain
      for (let dx = 0; dx < bd.sx; dx++) for (let dz = 0; dz < bd.sz; dz++) {
        this.blocked.add(`${wx + dx},${wz + dz}`);
        if (ch.tiles[bd.lx + dx]?.[bd.lz + dz]) { ch.tiles[bd.lx + dx][bd.lz + dz] = { type: T.STONE, height: 0.3 }; }
      }
      const bx = wx + bd.sx / 2 - 0.5, bz = wz + bd.sz / 2 - 0.5, bh = 0.3;
      const grp = new THREE.Group(); grp.position.set(bx, bh, bz);
      let blades: THREE.Group | undefined;
      if (bd.type === 'house') {
        const b = new THREE.Mesh(g.box, mat('#d4a574')); b.scale.set(1.6, 1.2, 1.4); b.position.y = 0.6; b.castShadow = true; grp.add(b);
        const rf = new THREE.Mesh(g.cone, mat('#8b4513')); rf.scale.set(2.0, 1.0, 1.8); rf.position.y = 1.7; rf.castShadow = true; grp.add(rf);
        const door = new THREE.Mesh(g.box, mat('#5a3010')); door.scale.set(0.3, 0.5, 0.05); door.position.set(0, 0.35, 0.73); grp.add(door);
      } else if (bd.type === 'tower') {
        const bs = new THREE.Mesh(g.cyl, mat('#808080')); bs.scale.set(1.2, 3.0, 1.2); bs.position.y = 1.5; bs.castShadow = true; grp.add(bs);
        const tp = new THREE.Mesh(g.cone, mat('#c9a96e')); tp.scale.set(1.6, 1.2, 1.6); tp.position.y = 3.6; tp.castShadow = true; grp.add(tp);
      } else if (bd.type === 'castle') {
        const kp = new THREE.Mesh(g.box, mat('#696969')); kp.scale.set(2.5, 2.5, 2.5); kp.position.y = 1.25; kp.castShadow = true; grp.add(kp);
        for (const [tx, tz] of [[-1.2, -1.2], [1.2, -1.2], [-1.2, 1.2], [1.2, 1.2]]) {
          const tw = new THREE.Mesh(g.cyl, mat('#787878')); tw.scale.set(0.5, 3.5, 0.5); tw.position.set(tx, 1.75, tz); tw.castShadow = true; grp.add(tw);
          const tc = new THREE.Mesh(g.cone, mat('#c9a96e')); tc.scale.set(0.7, 0.8, 0.7); tc.position.set(tx, 3.9, tz); grp.add(tc);
        }
        const flag = new THREE.Mesh(g.box, mat('#c9a96e')); flag.scale.set(0.6, 0.3, 0.02); flag.position.set(0.3, 3.85, 0); grp.add(flag);
      } else if (bd.type === 'market') {
        const bs = new THREE.Mesh(g.box, mat('#deb887')); bs.scale.set(2.4, 0.8, 1.4); bs.position.y = 0.4; bs.castShadow = true; grp.add(bs);
        const aw = new THREE.Mesh(g.box, mat('#b22222')); aw.scale.set(2.6, 0.1, 1.4); aw.position.y = 1.8; aw.castShadow = true; grp.add(aw);
        for (const px of [-1, 1]) for (const pz of [-0.5, 0.5]) { const p = new THREE.Mesh(g.cyl, mat('#8b6914')); p.scale.set(0.06, 1.8, 0.06); p.position.set(px, 0.9, pz); grp.add(p); }
      } else if (bd.type === 'windmill') {
        const bs = new THREE.Mesh(g.box, mat('#d4a574')); bs.scale.set(1.4, 2.0, 1.4); bs.position.y = 1.0; bs.castShadow = true; grp.add(bs);
        const rf = new THREE.Mesh(g.cone, mat('#8b4513')); rf.scale.set(1.8, 1.0, 1.8); rf.position.y = 2.5; rf.castShadow = true; grp.add(rf);
        blades = new THREE.Group(); blades.position.set(0, 2.0, 0.8);
        for (let i = 0; i < 4; i++) { const arm = new THREE.Mesh(g.box, mat('#a0522d')); arm.scale.set(0.1, 1.5, 0.04); const a = (i / 4) * Math.PI * 2; arm.position.set(Math.sin(a) * 0.75, Math.cos(a) * 0.75, 0); arm.rotation.z = a; blades.add(arm); }
        grp.add(blades);
      }
      this.scene.add(grp);
      ch.meshes.push(grp);
      ch.blds.push({ grp, tile: [wx, wz], size: [bd.sx, bd.sz], label: bd.label, blades });
    }
  }

  // ── Trees ──
  private spawnTrees(ch: ChunkD, rng: () => number) {
    const g = G(), { cx, cz } = ch;
    const biome = snoise(cx * CK + 8, cz * CK + 8, SEED, 48);
    const count = biome > 0.6 ? 3 + Math.floor(rng() * 4) : 5 + Math.floor(rng() * 8);
    for (let i = 0; i < count; i++) {
      const lx = Math.floor(rng() * CK), lz = Math.floor(rng() * CK);
      const wx = cx * CK + lx, wz = cz * CK + lz;
      if (this.blocked.has(`${wx},${wz}`) || ch.tiles[lx]?.[lz]?.type === T.WATER || ch.tiles[lx]?.[lz]?.type === T.SAND) continue;
      const h = ch.tiles[lx][lz].height;
      const gr = new THREE.Group(); gr.position.set(wx, h, wz);
      const sv = 0.7 + rng() * 0.6;
      const trunk = new THREE.Mesh(g.cyl, mat('#654321')); trunk.scale.set(0.12 * sv, 0.8 * sv, 0.12 * sv); trunk.position.y = 0.4 * sv; trunk.castShadow = true; gr.add(trunk);
      const fc = rng() > 0.5 ? '#2d5a27' : '#3a7533';
      for (let j = 0; j < 2; j++) { const cn = new THREE.Mesh(g.cone, mat(fc)); const cs = (1.0 - j * 0.2) * sv; cn.scale.set(cs * 0.8, cs * 0.6, cs * 0.8); cn.position.y = (0.8 + j * 0.35) * sv; cn.castShadow = true; gr.add(cn); }
      this.scene.add(gr); ch.meshes.push(gr); this.blocked.add(`${wx},${wz}`);
    }
  }

  // ── Resources ──
  private spawnResources(ch: ChunkD, rng: () => number) {
    const g = G(), { cx, cz } = ch;
    const count = 1 + Math.floor(rng() * 3);
    for (let i = 0; i < count; i++) {
      const lx = Math.floor(rng() * CK), lz = Math.floor(rng() * CK);
      const wx = cx * CK + lx, wz = cz * CK + lz;
      if (this.blocked.has(`${wx},${wz}`) || ch.tiles[lx]?.[lz]?.type === T.WATER) continue;
      const h = ch.tiles[lx][lz].height;
      const biome = ch.tiles[lx][lz].type;
      const type: 'gold' | 'wood' | 'stone' = biome === T.STONE ? (rng() > 0.5 ? 'gold' : 'stone') : biome === T.DIRT ? 'wood' : (['gold', 'wood', 'stone'] as const)[Math.floor(rng() * 3)];
      const gr = new THREE.Group(); gr.position.set(wx, h, wz);
      let mesh: THREE.Mesh;
      if (type === 'gold') { mesh = new THREE.Mesh(g.oct, new THREE.MeshLambertMaterial({ color: '#ffd700', emissive: 0xffd700, emissiveIntensity: 0.3 })); mesh.scale.setScalar(0.3); mesh.position.y = 0.4; }
      else if (type === 'wood') { mesh = new THREE.Mesh(g.cyl, mat('#8b6914')); mesh.scale.set(0.2, 0.5, 0.2); mesh.position.y = 0.15; mesh.rotation.z = Math.PI / 2; }
      else { mesh = new THREE.Mesh(g.dodec, mat('#555')); mesh.scale.set(0.35, 0.3, 0.35); mesh.position.y = 0.2; }
      mesh.castShadow = true; gr.add(mesh); this.scene.add(gr); ch.meshes.push(gr);
      ch.res.push({ g: gr, type, tile: [wx, wz], got: false, respawn: 0, mesh });
    }
  }

  // ── NPCs ──
  private spawnNPCs(ch: ChunkD, rng: () => number) {
    const { cx, cz } = ch, g = G();
    interface NPCSeed { name: string; color: string; wx: number; wz: number; wps: [number, number][]; dlgs: string[] }
    const seeds: NPCSeed[] = [];
    // Starting area hand-coded
    if (cx === 0 && cz === -1) seeds.push({ name: 'Elder Rowan', color: '#8b4513', wx: 8, wz: -6, wps: [[8, -6], [8, -4], [6, -4], [6, -6]], dlgs: ['Welcome to Tartary, traveler.', 'Explore the land and gather resources.', 'The castle holds many secrets...'] });
    else if (cx === 1 && cz === 0) seeds.push({ name: 'Merchant Lira', color: '#b8860b', wx: 22, wz: 8, wps: [[22, 8], [24, 8], [24, 6]], dlgs: ['Fine wares from distant lands!', 'Gold buys knowledge in this realm.'] });
    else if (cx === -1 && cz === 0) seeds.push({ name: 'Guard Thane', color: '#4a4a4a', wx: -4, wz: 3, wps: [[-4, 3], [-3, 3], [-3, 6], [-4, 6]], dlgs: ['The tower watches over all.', 'I serve the kingdom faithfully.'] });
    else if (cx === 0 && cz === 1) seeds.push({ name: 'Scholar Mira', color: '#483d8b', wx: 10, wz: 20, wps: [[10, 20], [12, 20], [12, 22]], dlgs: ['Knowledge is the truest treasure.', 'The windmill grinds more than grain...'] });
    else if (ch.blds.length > 0 && rng() < 0.7) {
      const b = ch.blds[0]; const ni = Math.floor(rng() * NPC_NAMES.length);
      const colors = ['#8b4513', '#b8860b', '#4a4a4a', '#483d8b', '#556b2f', '#8b0000', '#4682b4'];
      const dlgi = Math.floor(rng() * V_DLG.length);
      const bx = b.tile[0], bz = b.tile[1];
      seeds.push({ name: NPC_NAMES[ni], color: colors[Math.floor(rng() * colors.length)], wx: bx - 1, wz: bz - 1, wps: [[bx - 1, bz - 1], [bx + 2, bz - 1], [bx + 2, bz + 2], [bx - 1, bz + 2]], dlgs: V_DLG[dlgi] });
    }
    for (const s of seeds) {
      const { grp, la, ra, ll, rl } = this.mkHuman(s.color, 0.9);
      const h = this.getH(s.wx, s.wz);
      grp.position.set(s.wx, h, s.wz);
      const ind = new THREE.Mesh(g.oct, new THREE.MeshLambertMaterial({ color: '#ffd700', emissive: 0xffd700, emissiveIntensity: 0.5 }));
      ind.scale.setScalar(0.12); ind.position.y = 1.4; ind.visible = false; grp.add(ind);
      this.scene.add(grp);
      ch.npcs.push({ g: grp, name: s.name, color: s.color, dialogs: s.dlgs, wp: 0, wps: s.wps, tile: [s.wx, s.wz], pos: new THREE.Vector3(s.wx, h, s.wz), tgt: new THREE.Vector3(s.wx, h, s.wz), mv: false, pause: 2 + rng() * 2, angle: 0, wt: 0, p: { la, ra, ll, rl }, ind });
    }
  }

  // ── Hidden items ──
  private spawnHidden(ch: ChunkD, rng: () => number) {
    const g = G(), { cx, cz } = ch;
    if (cx === 0 && cz === 0) return; // no hidden in starting chunk
    const roll = rng();
    let type: HidInst['type'] | null = null, dlgs: string[] = [];
    if (roll < 0.12) { type = 'chest'; dlgs = CHEST_DLG; }
    else if (roll < 0.2) { type = 'stone'; dlgs = STONE_DLG; }
    else if (roll < 0.28) { type = 'ruin'; dlgs = RUIN_DLG; }
    else if (roll < 0.34) { type = 'hermit'; dlgs = H_DLG[Math.floor(rng() * H_DLG.length)]; }
    if (!type) return;
    const lx = 2 + Math.floor(rng() * 12), lz = 2 + Math.floor(rng() * 12);
    const wx = cx * CK + lx, wz = cz * CK + lz;
    if (this.blocked.has(`${wx},${wz}`) || ch.tiles[lx]?.[lz]?.type === T.WATER) return;
    const h = ch.tiles[lx][lz].height;
    const gr = new THREE.Group(); gr.position.set(wx, h, wz);
    let mesh: THREE.Mesh;
    if (type === 'chest') {
      mesh = new THREE.Mesh(g.box, new THREE.MeshLambertMaterial({ color: '#daa520', emissive: 0xdaa520, emissiveIntensity: 0.2 }));
      mesh.scale.set(0.4, 0.3, 0.3); mesh.position.y = 0.2;
    } else if (type === 'stone') {
      mesh = new THREE.Mesh(g.dodec, new THREE.MeshLambertMaterial({ color: '#9370db', emissive: 0x9370db, emissiveIntensity: 0.4 }));
      mesh.scale.setScalar(0.35); mesh.position.y = 0.3;
    } else if (type === 'ruin') {
      mesh = new THREE.Mesh(g.cyl, mat('#808080')); mesh.scale.set(0.15, 1.2, 0.15); mesh.position.y = 0.6;
      for (let i = 0; i < 3; i++) { const p = new THREE.Mesh(g.cyl, mat('#707070')); p.scale.set(0.12, 0.5 + rng() * 0.4, 0.12); p.position.set((rng() - 0.5) * 1.5, 0.3, (rng() - 0.5) * 1.5); gr.add(p); }
    } else {
      // hermit is an NPC-like entity
      const hm = this.mkHuman('#556b2f', 0.85);
      gr.add(hm.grp); mesh = hm.body;
    }
    mesh.castShadow = true; gr.add(mesh); this.scene.add(gr); ch.meshes.push(gr);
    ch.hid.push({ g: gr, type, tile: [wx, wz], found: false, dialogs: dlgs, mesh });
  }

  // ── Collect entities from loaded chunks ──
  private collectEntities() {
    this.allNPCs = []; this.allRes = []; this.allHid = [];
    for (const ch of this.chunks.values()) {
      this.allNPCs.push(...ch.npcs);
      this.allRes.push(...ch.res);
      this.allHid.push(...ch.hid);
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  // INSTANCED MESH REBUILD
  // ═══════════════════════════════════════════════════════════════════
  private rebuildInstances() {
    for (const t of [0, 1, 2, 3, 4]) this.tileBuf.set(t, []);
    for (const ch of this.chunks.values()) {
      for (let lx = 0; lx < CK; lx++) for (let lz = 0; lz < CK; lz++) {
        const td = ch.tiles[lx][lz];
        const wx = ch.cx * CK + lx, wz = ch.cz * CK + lz;
        this.tileBuf.get(td.type)!.push({ wx, wz, h: td.height });
      }
    }
    for (const [type, tiles] of this.tileBuf) {
      const im = this.iMesh[type]; const base = BASE_C[type];
      tiles.forEach((t, i) => {
        this.dummy.position.set(t.wx, t.h / 2, t.wz);
        this.dummy.scale.set(1, t.h, 1);
        this.dummy.updateMatrix();
        im.setMatrixAt(i, this.dummy.matrix);
        const mul = this.fog.fogMul(t.wx, t.wz);
        im.setColorAt(i, new THREE.Color(base.r * mul, base.g * mul, base.b * mul));
      });
      im.count = tiles.length;
      im.instanceMatrix.needsUpdate = true;
      if (im.instanceColor) im.instanceColor.needsUpdate = true;
    }
  }

  private updateFogColors() {
    for (const [type, tiles] of this.tileBuf) {
      const im = this.iMesh[type]; const base = BASE_C[type];
      if (!im.instanceColor) continue;
      const arr = im.instanceColor.array as Float32Array;
      tiles.forEach((t, i) => {
        const mul = this.fog.fogMul(t.wx, t.wz);
        const idx = i * 3; arr[idx] = base.r * mul; arr[idx + 1] = base.g * mul; arr[idx + 2] = base.b * mul;
      });
      im.instanceColor.needsUpdate = true;
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  // INPUT
  // ═══════════════════════════════════════════════════════════════════
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
    for (const n of this.allNPCs) { if (this.ray.intersectObject(n.g, true).length > 0) { this.walkToNPC(n); return; } }
    for (const r of this.allRes) { if (!r.got && this.ray.intersectObject(r.g, true).length > 0) { this.walkToRes(r); return; } }
    for (const h of this.allHid) { if (!h.found && this.ray.intersectObject(h.g, true).length > 0) { this.walkToHid(h); return; } }
    const pt = new THREE.Vector3();
    if (this.ray.ray.intersectPlane(this.gPlane, pt)) {
      const tx = Math.round(pt.x), tz = Math.round(pt.z);
      if (!this.blocked.has(`${tx},${tz}`)) {
        const path = astar((x, z) => !this.blocked.has(`${x},${z}`), this.pTile[0], this.pTile[1], tx, tz);
        if (path && path.length > 1) { this.pPath = path; this.pPI = 1; this.pMoving = true; this.pendNPC = null; this.pendRes = null; this.pendHid = null; }
      }
    }
  }

  private walkToNPC(n: NPCInst) {
    const adj = this.adjTiles(n.tile[0], n.tile[1]);
    if (!adj.length) return;
    const path = astar((x, z) => !this.blocked.has(`${x},${z}`), this.pTile[0], this.pTile[1], adj[0][0], adj[0][1]);
    if (path) { this.pPath = path; this.pPI = 1; this.pMoving = true; this.pendNPC = n; this.pendRes = null; this.pendHid = null; }
  }
  private walkToRes(r: ResInst) {
    const adj = this.adjTiles(r.tile[0], r.tile[1]);
    const t = adj.length ? adj[0] : r.tile;
    const path = astar((x, z) => !this.blocked.has(`${x},${z}`), this.pTile[0], this.pTile[1], t[0], t[1]);
    if (path) { this.pPath = path; this.pPI = 1; this.pMoving = true; this.pendRes = r; this.pendNPC = null; this.pendHid = null; }
  }
  private walkToHid(h: HidInst) {
    const adj = this.adjTiles(h.tile[0], h.tile[1]);
    const t = adj.length ? adj[0] : h.tile;
    const path = astar((x, z) => !this.blocked.has(`${x},${z}`), this.pTile[0], this.pTile[1], t[0], t[1]);
    if (path) { this.pPath = path; this.pPI = 1; this.pMoving = true; this.pendHid = h; this.pendNPC = null; this.pendRes = null; }
  }

  public advDialog() {
    if (!this.dialog) return;
    this.dialog.idx++;
    if (this.dialog.idx >= this.dialog.dlgs.length) { this.dialog = null; this.updDialogDOM(null); }
    else this.updDialogDOM(this.dialog);
  }
  private updDialogDOM(d: { name: string; dlgs: string[]; idx: number } | null) {
    const p = document.getElementById('gd-panel'), n = document.getElementById('gd-name'), t = document.getElementById('gd-text');
    if (!p) return;
    if (d) { p.style.opacity = '1'; p.style.transform = 'translateY(0)'; p.style.pointerEvents = 'auto'; if (n) n.textContent = d.name; if (t) t.textContent = d.dlgs[d.idx]; }
    else { p.style.opacity = '0'; p.style.transform = 'translateY(20px)'; p.style.pointerEvents = 'none'; }
  }

  // ── Helpers ──
  private getH(wx: number, wz: number): number {
    const cx = Math.floor(wx / CK), cz = Math.floor(wz / CK);
    const ch = this.chunks.get(`${cx},${cz}`);
    if (ch) { const lx = ((wx % CK) + CK) % CK, lz = ((wz % CK) + CK) % CK; return ch.tiles[lx]?.[lz]?.height ?? 0.4; }
    return genTile(wx, wz).height;
  }
  private adjTiles(tx: number, tz: number): [number, number][] {
    const a: [number, number][] = [];
    for (const [dx, dz] of [[0, 1], [0, -1], [1, 0], [-1, 0]] as const) {
      const nx = tx + dx, nz = tz + dz;
      if (!this.blocked.has(`${nx},${nz}`)) a.push([nx, nz]);
    }
    a.sort((a, b) => (Math.abs(a[0] - this.pTile[0]) + Math.abs(a[1] - this.pTile[1])) - (Math.abs(b[0] - this.pTile[0]) + Math.abs(b[1] - this.pTile[1])));
    return a;
  }

  // ═══════════════════════════════════════════════════════════════════
  // GAME LOOP
  // ═══════════════════════════════════════════════════════════════════
  private animate = () => {
    if (this.dead) return;
    this.aid = requestAnimationFrame(this.animate);
    const dt = Math.min(this.clk.getDelta(), 0.05), t = this.clk.getElapsedTime();
    this.updPlayer(dt, t);
    // Chunk check
    const ncx = Math.floor(this.pPos.x / CK), ncz = Math.floor(this.pPos.z / CK);
    if (ncx !== this.lastCx || ncz !== this.lastCz) { this.lastCx = ncx; this.lastCz = ncz; this.updateChunks(); }
    // Fog check
    const ntx = Math.round(this.pPos.x), ntz = Math.round(this.pPos.z);
    if (ntx !== this.lastTx || ntz !== this.lastTz) { this.lastTx = ntx; this.lastTz = ntz; this.fog.update(ntx, ntz); this.updateFogColors(); }
    this.updNPCs(dt, t);
    this.updRes(dt, t);
    this.updHidden(t);
    this.updDayNight(t);
    this.updCam(dt);
    // Windmill blades
    for (const ch of this.chunks.values()) for (const b of ch.blds) if (b.blades) b.blades.rotation.z += dt * 0.5;
    // NPC indicators
    for (const n of this.allNPCs) {
      const dist = Math.abs(n.tile[0] - this.pTile[0]) + Math.abs(n.tile[1] - this.pTile[1]);
      n.ind.visible = dist < 5; if (n.ind.visible) { n.ind.rotation.y = t * 2; n.ind.position.y = 1.4 + Math.sin(t * 3) * 0.08; }
    }
    if (Math.floor(t * 60) % 6 === 0) this.updMinimap();
    this.r.render(this.scene, this.cam);
  };

  // ── Player ──
  private updPlayer(dt: number, t: number) {
    const dir = this.wasd();
    if (dir.x !== 0 || dir.z !== 0) {
      this.pPath = []; this.pendNPC = null; this.pendRes = null; this.pendHid = null;
      const nx = this.pPos.x + dir.x * SPEED * dt, nz = this.pPos.z + dir.z * SPEED * dt;
      const ntx = Math.round(nx), ntz = Math.round(nz);
      if (!this.blocked.has(`${ntx},${ntz}`)) {
        this.pPos.x = nx; this.pPos.z = nz; this.pTile = [ntx, ntz]; this.pPos.y = this.getH(ntx, ntz);
      }
      this.pTAngle = Math.atan2(dir.x, dir.z); this.pMoving = true; this.pWalk += dt * 8;
    } else if (this.pPath.length > 0 && this.pPI < this.pPath.length) {
      const tgt = this.pPath[this.pPI], h = this.getH(tgt[0], tgt[1]);
      const tp = new THREE.Vector3(tgt[0], h, tgt[1]);
      const dx = tp.x - this.pPos.x, dz = tp.z - this.pPos.z, dist = Math.sqrt(dx * dx + dz * dz);
      if (dist < 0.1) {
        this.pPos.copy(tp); this.pTile = [tgt[0], tgt[1]]; this.pPI++;
        if (this.pPI >= this.pPath.length) {
          this.pPath = []; this.pMoving = false;
          if (this.pendNPC) { this.dialog = { name: this.pendNPC.name, dlgs: this.pendNPC.dialogs, idx: 0 }; this.updDialogDOM(this.dialog); this.pendNPC = null; }
          if (this.pendRes && !this.pendRes.got) { this.pendRes.got = true; this.pendRes.g.visible = false; this.pendRes.respawn = 30; this.rc[this.pendRes.type]++; this.updRC(); this.pendRes = null; }
          if (this.pendHid && !this.pendHid.found) {
            this.pendHid.found = true; this.discovered++;
            if (this.pendHid.type === 'chest') { this.rc.gold += 5; this.updRC(); }
            this.dialog = { name: this.pendHid.type === 'chest' ? 'Treasure Chest' : this.pendHid.type === 'ruin' ? 'Ancient Ruins' : this.pendHid.type === 'stone' ? 'Mysterious Stone' : 'Hermit', dlgs: this.pendHid.dialogs, idx: 0 };
            this.updDialogDOM(this.dialog); this.pendHid = null;
            this.updDisc();
          }
        }
      } else {
        this.pPos.x += (dx / dist) * SPEED * dt; this.pPos.z += (dz / dist) * SPEED * dt;
        const rx = Math.round(this.pPos.x), rz = Math.round(this.pPos.z);
        this.pPos.y = this.getH(rx, rz); this.pTile = [rx, rz];
        this.pTAngle = Math.atan2(dx, dz); this.pWalk += dt * 8;
      }
    } else { this.pMoving = false; this.pWalk = 0; }
    let ad = this.pTAngle - this.pAngle; while (ad > Math.PI) ad -= Math.PI * 2; while (ad < -Math.PI) ad += Math.PI * 2;
    this.pAngle += ad * Math.min(1, dt * 10);
    this.player.position.copy(this.pPos); this.player.rotation.y = this.pAngle;
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
    return new THREE.Vector3(d.x * c - d.z * s, 0, d.x * s + d.z * c).normalize();
  }

  // ── NPCs ──
  private updNPCs(dt: number, _t: number) {
    for (const n of this.allNPCs) {
      if (n.mv) {
        const dx = n.tgt.x - n.pos.x, dz = n.tgt.z - n.pos.z, dist = Math.sqrt(dx * dx + dz * dz);
        if (dist < 0.1) { n.pos.copy(n.tgt); n.mv = false; n.pause = 2 + Math.random() * 3; n.tile = [Math.round(n.pos.x), Math.round(n.pos.z)]; }
        else { const sp = 1.5 * dt; n.pos.x += (dx / dist) * sp; n.pos.z += (dz / dist) * sp; n.angle = Math.atan2(dx, dz); n.wt += dt * 6; }
      } else {
        n.pause -= dt;
        if (n.pause <= 0) { n.wp = (n.wp + 1) % n.wps.length; const wp = n.wps[n.wp]; n.tgt.set(wp[0], this.getH(wp[0], wp[1]), wp[1]); n.mv = true; n.wt = 0; }
      }
      n.g.position.copy(n.pos); n.g.rotation.y = n.angle;
      if (n.mv) { const sw = Math.sin(n.wt) * 0.3; n.p.la.rotation.x = sw; n.p.ra.rotation.x = -sw; n.p.ll.rotation.x = -sw; n.p.rl.rotation.x = sw; }
      else { n.p.la.rotation.x = n.p.ra.rotation.x = n.p.ll.rotation.x = n.p.rl.rotation.x = 0; }
    }
  }

  // ── Resources ──
  private updRes(dt: number, t: number) {
    for (const r of this.allRes) {
      if (r.got) { r.respawn -= dt; if (r.respawn <= 0) { r.got = false; r.g.visible = true; } }
      else if (r.type === 'gold') { r.mesh.rotation.y = t * 2; r.mesh.position.y = 0.4 + Math.sin(t * 2 + r.tile[0]) * 0.08; }
    }
  }

  // ── Hidden items ──
  private updHidden(t: number) {
    for (const h of this.allHid) {
      if (h.found) continue;
      const vis = Math.abs(h.tile[0] - this.pTile[0]) + Math.abs(h.tile[1] - this.pTile[1]) < VR;
      h.g.visible = vis;
      if (vis) {
        if (h.type === 'stone') { h.mesh.rotation.y = t * 1.5; h.mesh.position.y = 0.3 + Math.sin(t * 2) * 0.06; }
        if (h.type === 'chest') h.mesh.position.y = 0.2 + Math.sin(t * 1.5) * 0.03;
      }
    }
  }

  // ── Day/Night ──
  private updDayNight(t: number) {
    const d = (t % 90) / 90;
    let ac: THREE.Color, sc: THREE.Color, si: number, ai: number, sky: THREE.Color;
    if (d < 0.15) { const f = d / 0.15; ac = new THREE.Color('#4a3520').lerp(new THREE.Color('#ffffff'), f); sc = new THREE.Color('#ff8040').lerp(new THREE.Color('#fff5e0'), f); si = 0.4 + f * 0.6; ai = 0.3 + f * 0.3; sky = new THREE.Color('#2a1a30').lerp(new THREE.Color('#87CEEB'), f); }
    else if (d < 0.45) { ac = new THREE.Color('#ffffff'); sc = new THREE.Color('#fff5e0'); si = 1.0; ai = 0.6; sky = new THREE.Color('#87CEEB'); }
    else if (d < 0.6) { const f = (d - 0.45) / 0.15; ac = new THREE.Color('#ffffff').lerp(new THREE.Color('#6040a0'), f); sc = new THREE.Color('#fff5e0').lerp(new THREE.Color('#ff6030'), f); si = 1.0 - f * 0.5; ai = 0.6 - f * 0.2; sky = new THREE.Color('#87CEEB').lerp(new THREE.Color('#4a2a50'), f); }
    else if (d < 0.85) { const f = Math.min(1, (d - 0.6) / 0.15); ac = new THREE.Color('#6040a0').lerp(new THREE.Color('#1a1a3a'), f); sc = new THREE.Color('#ff6030').lerp(new THREE.Color('#3a3a6a'), f); si = 0.5 - f * 0.3; ai = 0.4 - f * 0.15; sky = new THREE.Color('#4a2a50').lerp(new THREE.Color('#0a0a20'), f); }
    else { const f = (d - 0.85) / 0.15; ac = new THREE.Color('#1a1a3a').lerp(new THREE.Color('#4a3520'), f); sc = new THREE.Color('#3a3a6a').lerp(new THREE.Color('#ff8040'), f); si = 0.2 + f * 0.2; ai = 0.25 + f * 0.05; sky = new THREE.Color('#0a0a20').lerp(new THREE.Color('#2a1a30'), f); }
    this.aLight.color.copy(ac); this.aLight.intensity = ai;
    this.sLight.color.copy(sc); this.sLight.intensity = si;
    this.r.setClearColor(sky); if (this.scene.fog) (this.scene.fog as THREE.FogExp2).color.copy(sky);
    const sa = d * Math.PI * 2; this.sLight.position.set(Math.cos(sa) * 30, Math.sin(sa) * 25 + 10, 20);
  }

  // ── Camera ──
  private updCam(dt: number) {
    this.camLook.lerp(this.pPos, dt * 3);
    this.cam.position.set(this.camLook.x + CAM_OFF.x, CAM_OFF.y, this.camLook.z + CAM_OFF.z);
    this.cam.lookAt(this.camLook);
    this.sLight.target.position.copy(this.camLook); this.sLight.target.updateMatrixWorld();
  }

  // ── HUD ──
  private updRC() {
    const ge = document.getElementById('g-gold'), we = document.getElementById('g-wood'), se = document.getElementById('g-stone');
    if (ge) ge.textContent = String(this.rc.gold); if (we) we.textContent = String(this.rc.wood); if (se) se.textContent = String(this.rc.stone);
  }
  private updDisc() {
    const el = document.getElementById('g-disc'); if (el) el.textContent = String(this.discovered);
  }
  private updLoc() {
    const el = document.getElementById('g-loc'); if (!el) return;
    let lbl = '';
    for (const ch of this.chunks.values()) for (const b of ch.blds) {
      if (Math.abs(this.pTile[0] - (b.tile[0] + b.size[0] / 2)) < b.size[0] && Math.abs(this.pTile[1] - (b.tile[1] + b.size[1] / 2)) < b.size[1]) { lbl = b.label; break; }
    }
    if (!lbl) {
      const cx = Math.floor(this.pTile[0] / CK), cz = Math.floor(this.pTile[1] / CK);
      const ch = this.chunks.get(`${cx},${cz}`);
      const lx = ((this.pTile[0] % CK) + CK) % CK, lz = ((this.pTile[1] % CK) + CK) % CK;
      const tt = ch?.tiles[lx]?.[lz]?.type;
      lbl = tt === T.GRASS ? 'Green Fields' : tt === T.DIRT ? 'Dusty Path' : tt === T.STONE ? 'Rocky Highlands' : tt === T.SAND ? 'Sandy Shore' : tt === T.WATER ? 'Waterside' : 'Wilderness';
    }
    el.textContent = lbl;
  }
  private updMinimap() {
    const c = document.getElementById('g-mm') as HTMLCanvasElement; if (!c) return;
    const ctx = c.getContext('2d'); if (!ctx) return;
    const sz = c.width, ppx = sz / (MM_R * 2);
    ctx.fillStyle = '#111'; ctx.fillRect(0, 0, sz, sz);
    for (let dx = -MM_R; dx < MM_R; dx++) for (let dz = -MM_R; dz < MM_R; dz++) {
      const wx = this.pTile[0] + dx, wz = this.pTile[1] + dz;
      const k = `${wx},${wz}`;
      const sx = (dx + MM_R) * ppx, sz2 = (dz + MM_R) * ppx;
      if (!this.fog.explored.has(k)) { ctx.fillStyle = '#080808'; ctx.fillRect(sx, sz2, ppx + 0.5, ppx + 0.5); continue; }
      const tile = this.getTileType(wx, wz);
      const fogM = this.fog.fogMul(wx, wz);
      if (fogM < 0.5) ctx.globalAlpha = 0.4; else ctx.globalAlpha = 1;
      ctx.fillStyle = T_MAP[tile] || '#333'; ctx.fillRect(sx, sz2, ppx + 0.5, ppx + 0.5);
      ctx.globalAlpha = 1;
    }
    // Buildings
    ctx.fillStyle = '#aaa';
    for (const ch of this.chunks.values()) for (const b of ch.blds) {
      const dx = b.tile[0] - this.pTile[0] + MM_R, dz = b.tile[1] - this.pTile[1] + MM_R;
      if (dx >= 0 && dx < MM_R * 2 && dz >= 0 && dz < MM_R * 2) ctx.fillRect(dx * ppx, dz * ppx, b.size[0] * ppx, b.size[1] * ppx);
    }
    // NPCs
    ctx.fillStyle = '#ff0';
    for (const n of this.allNPCs) { const dx = n.tile[0] - this.pTile[0] + MM_R, dz = n.tile[1] - this.pTile[1] + MM_R; if (dx >= 0 && dx < MM_R * 2) { ctx.beginPath(); ctx.arc(dx * ppx, dz * ppx, ppx, 0, Math.PI * 2); ctx.fill(); } }
    // Player
    ctx.fillStyle = '#c9a96e'; ctx.beginPath(); ctx.arc(MM_R * ppx, MM_R * ppx, ppx * 2, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 1; ctx.stroke();
  }
  private getTileType(wx: number, wz: number): number {
    const cx = Math.floor(wx / CK), cz = Math.floor(wz / CK), ch = this.chunks.get(`${cx},${cz}`);
    if (ch) { const lx = ((wx % CK) + CK) % CK, lz = ((wz % CK) + CK) % CK; return ch.tiles[lx]?.[lz]?.type ?? 0; }
    return genTile(wx, wz).type;
  }

  // ── Resize / Dispose ──
  onResize = () => { const w = this.ctr.clientWidth, h = this.ctr.clientHeight; this.r.setSize(w, h); this.cam.left = -w / 2; this.cam.right = w / 2; this.cam.top = h / 2; this.cam.bottom = -h / 2; this.cam.updateProjectionMatrix(); };
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
      <div className="absolute top-4 left-4 flex gap-3 transition-opacity duration-700" style={{ opacity: isReady ? 1 : 0, transitionDelay: '800ms' }}>
        {[['gold', '#ffd700', 'g-gold'], ['wood', '#8b6914', 'g-wood'], ['stone', '#888', 'g-stone']].map(([l, c, id]) => (
          <div key={l} className="flex items-center gap-1.5 bg-black/50 backdrop-blur-sm rounded px-2.5 py-1">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c as string }} />
            <span className="text-[10px] uppercase tracking-wider text-white/70">{l}</span>
            <span id={id as string} className="text-[12px] font-bold text-white">0</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-sm rounded px-2.5 py-1">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#9370db' }} />
          <span className="text-[10px] uppercase tracking-wider text-white/70">found</span>
          <span id="g-disc" className="text-[12px] font-bold text-white">0</span>
        </div>
      </div>
      <div className="absolute top-4 left-1/2 -translate-x-1/2 transition-opacity duration-700" style={{ opacity: isReady ? 1 : 0, transitionDelay: '1000ms' }}>
        <div className="bg-black/40 backdrop-blur-sm rounded px-4 py-1.5">
          <span id="g-loc" className="text-[11px] uppercase tracking-[0.2em] text-white/70">Wilderness</span>
        </div>
      </div>
      <div className="absolute top-4 right-4 transition-opacity duration-700" style={{ opacity: isReady ? 1 : 0, transitionDelay: '800ms' }}>
        <div className="bg-black/50 backdrop-blur-sm rounded p-1.5">
          <canvas id="g-mm" width={128} height={128} className="rounded" style={{ width: 128, height: 128 }} />
        </div>
      </div>
      <div id="gd-panel" className="absolute bottom-20 left-1/2 -translate-x-1/2 w-[90%] max-w-lg transition-all duration-300" style={{ opacity: 0, transform: 'translateY(20px)', pointerEvents: 'none' }}>
        <div className="bg-black/70 backdrop-blur-md rounded-lg border border-white/10 p-4 pointer-events-auto cursor-pointer" onClick={onContinue}>
          <p id="gd-name" className="text-[11px] uppercase tracking-[0.2em] mb-2" style={{ color: '#c9a96e' }} />
          <p id="gd-text" className="text-sm text-white/90 leading-relaxed" style={{ fontFamily: 'var(--font-heading)' }} />
          <p className="text-[9px] uppercase tracking-wider text-white/30 mt-3">Click or press Space to continue</p>
        </div>
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 transition-opacity duration-700" style={{ opacity: isReady ? 1 : 0, transitionDelay: '1200ms' }}>
        <p className="text-[9px] uppercase tracking-[0.15em] text-white/30 bg-black/30 rounded px-3 py-1">WASD to move &middot; Click to interact &middot; Scroll to zoom</p>
      </div>
    </div>
  );
}

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
