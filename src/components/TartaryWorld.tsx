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
const T_COL: Record<number, number> = { 0: 0x3d7a35, 1: 0x7a6545, 2: 0x757580, 3: 0x2a5580, 4: 0xbfaa70 };
const T_HT: Record<number, number> = { 0: 0.45, 1: 0.35, 2: 0.65, 3: 0.08, 4: 0.22 };
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
interface MonsterInst { type: string; grp: THREE.Group; wx: number; wz: number; phase: number; dialogs: string[]; parts: Record<string, THREE.Object3D>; met: boolean }
interface ParkInst { grp: THREE.Group; type: string; wx: number; wz: number; parts: Record<string, THREE.Object3D>; discovered: boolean }
interface ZombieInst { grp: THREE.Group; pos: THREE.Vector3; vel: THREE.Vector3; hp: number; tile: [number, number]; angle: number; parts: { la: THREE.Mesh; ra: THREE.Mesh; ll: THREE.Mesh; rl: THREE.Mesh; body: THREE.Mesh }; hitCD: number; walkT: number; dying: boolean; deathT: number }
interface AirshipInst { grp: THREE.Group; pos: THREE.Vector3; vel: THREE.Vector3; propeller: THREE.Mesh; targetX: number; targetZ: number }
interface BloodPart { mesh: THREE.Mesh; pos: THREE.Vector3; vel: THREE.Vector3; life: number }
interface ChunkD { cx: number; cz: number; key: string; tiles: TileD[][]; blds: BldInst[]; npcs: NPCInst[]; res: ResInst[]; hid: HidInst[]; monsters: MonsterInst[]; parks: ParkInst[]; meshes: THREE.Object3D[] }

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

// Monster data
const M_TYPES = ['slime', 'dragon', 'mushroom', 'golem', 'wisp', 'spider', 'troll', 'elemental'] as const;
const M_DLG: Record<string, string[]> = {
  slime: ['Bloop! *wobbles happily*', 'Splish splash! Want to bounce?', '*jiggles contentedly*'],
  dragon: ['Rawr! ...just kidding, I\'m tiny.', '*puffs a tiny flame* Did you see that?!', 'One day I\'ll be BIG. Just you wait!'],
  mushroom: ['Don\'t eat me! I taste terrible!', '*shakes spores everywhere* Oops!', 'I\'m a fun-gi! Get it? ...anyone?'],
  golem: ['*crystalline humming*', 'These crystals have seen millennia pass...', '*resonates with ancient energy*'],
  wisp: ['Wooooo... just kidding. Hi!', '*flickers mysteriously*', 'Follow me! Or don\'t. I\'ll follow you.'],
  spider: ['*clickety clack*', '*waves all eight legs* Hello friend!', 'I knit the finest silk in the land!'],
  troll: ['You pay troll toll? ...just kidding!', '*scratches head* Which bridge was mine again?', 'I\'m actually a vegetarian. Don\'t tell anyone.'],
  elemental: ['*crackle* Got any marshmallows?', '*warm glow* I provide free heating!', 'Hot take: fire is the best element. *ba dum tss*'],
};
// Theme park attraction types
const PARK_TYPES = ['ferris', 'carousel', 'circus', 'coaster', 'bumper', 'food'] as const;

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
    box: new THREE.BoxGeometry(1, 1, 1), cone: new THREE.ConeGeometry(0.5, 1, 12),
    cyl: new THREE.CylinderGeometry(0.5, 0.5, 1, 16), sphere: new THREE.SphereGeometry(0.5, 16, 12),
    oct: new THREE.OctahedronGeometry(0.5, 1), dodec: new THREE.DodecahedronGeometry(0.5, 1),
    ico: new THREE.IcosahedronGeometry(0.5, 1),
  };
  return _g;
}
function mat(c: string | number) { return new THREE.MeshStandardMaterial({ color: c, roughness: 0.8, metalness: 0.05 }); }

// ═══════════════════════════════════════════════════════════════════════
// WORLD GENERATION
// ═══════════════════════════════════════════════════════════════════════
function genTile(wx: number, wz: number): TileD {
  // Multi-octave terrain noise for organic landscape
  const n1 = snoise(wx, wz, SEED, 64) * 1.0;     // continent scale
  const n2 = snoise(wx, wz, SEED + 500, 28) * 0.5; // regional hills
  const n3 = snoise(wx, wz, SEED + 200, 10) * 0.25; // local bumps
  const n4 = snoise(wx, wz, SEED + 777, 5) * 0.12;  // micro detail
  const n = n1 + n2 + n3 + n4;
  // Ridge noise for mountain ranges (absolute value creates ridges)
  const ridge = 1.0 - Math.abs(snoise(wx, wz, SEED + 900, 40)) * 1.8;
  // Rivers — winding, organic
  const rx = Math.sin(wz * 0.04 + SEED * 0.1) * 10 + Math.sin(wz * 0.09 + SEED * 0.3) * 5 + Math.sin(wz * 0.17) * 2;
  const rd = Math.abs(wx - rx);
  const inRiver = rd < 1.5 && (wz % 100) < 70;
  // Lakes — bigger, more organic shapes
  const lk = snoise(wx, wz, SEED + 1000, 22) + snoise(wx, wz, SEED + 1100, 9) * 0.3;
  const isLake = lk > 0.78;
  // Swamps
  const swampN = snoise(wx, wz, SEED + 1500, 30);
  const isSwamp = swampN > 0.7 && n < 0.7;
  let type: number;
  if (inRiver || isLake) type = T.WATER;
  else if (isSwamp) type = T.WATER;
  else if (rd < 3.0 && (wz % 100) < 70 || (lk > 0.68 && lk <= 0.78)) type = T.SAND;
  else if (n > 1.05 || ridge > 0.85) type = T.STONE;
  else if (n > 0.8) type = T.DIRT;
  else if (n < 0.25) type = T.SAND;
  else type = T.GRASS;
  // Height — dramatic with rolling hills
  const baseH = T_HT[type] || 0.4;
  const hillN = snoise(wx, wz, SEED + 300, 14) * 0.3 + snoise(wx, wz, SEED + 400, 6) * 0.15;
  const mtH = type === T.STONE ? ridge * 0.5 + 0.2 : 0;
  const h = Math.max(0.05, baseH + hillN + mtH);
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
  private allMonsters: MonsterInst[] = [];
  private allParks: ParkInst[] = [];
  private rc = { gold: 0, wood: 0, stone: 0 };
  private monstersMet = 0;
  // Combat
  private playerHP = 100;
  private maxHP = 100;
  private attackCD = 0;
  private comboCount = 0;
  private lastAttackT = -999;
  private screenShake = 0;
  // Zombies
  private zombies: ZombieInst[] = [];
  private zombieSpawnCD = 0;
  private maxZombies = 15;
  private nightKills = 0;
  private dayPhase = 0; // current d value
  private lastNightPhase = 0;
  // Airships
  private airships: AirshipInst[] = [];
  // Particles
  private bloods: BloodPart[] = [];
  // Input
  private keys = new Set<string>();
  private mNDC = new THREE.Vector2(-999, -999);
  // State
  private dialog: { name: string; dlgs: string[]; idx: number } | null = null;
  private pendNPC: NPCInst | null = null;
  private pendRes: ResInst | null = null;
  private pendHid: HidInst | null = null;
  private pendMon: MonsterInst | null = null;
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
    this.scene.fog = new THREE.FogExp2(0x87CEEB, 0.005);
    const w = ctr.clientWidth, h = ctr.clientHeight;
    this.cam = new THREE.OrthographicCamera(-w / 2, w / 2, h / 2, -h / 2, 0.1, 200);
    this.cam.zoom = 42;
    this.cam.updateProjectionMatrix();
    // InstancedMeshes
    const g = G();
    for (const t of [0, 1, 2, 3, 4]) {
      const m = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: t === T.WATER ? 0.1 : 0.85, metalness: t === T.WATER ? 0.2 : 0.0 });
      if (t === T.WATER) { m.transparent = true; m.opacity = 0.65; }
      const im = new THREE.InstancedMesh(g.box, m, MAX_I);
      im.count = 0; im.castShadow = false; im.receiveShadow = true;
      this.scene.add(im);
      this.iMesh[t] = im;
      this.tileBuf.set(t, []);
    }
    this.setupLights();
    this.buildPlayer();
    this.fog.update(this.pTile[0], this.pTile[1]);
    this.initAirships();
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
    this.aLight = new THREE.AmbientLight(0xc8d8f0, 0.55);
    this.scene.add(this.aLight);
    this.sLight = new THREE.DirectionalLight(0xffe8c0, 1.1);
    this.sLight.position.set(25, 35, 20);
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
        for (const mon of ch.monsters) this.scene.remove(mon.grp);
        for (const pk of ch.parks) this.scene.remove(pk.grp);
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
    const ch: ChunkD = { cx, cz, key, tiles, blds: [], npcs: [], res: [], hid: [], monsters: [], parks: [], meshes: [] };
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
    this.spawnMonsters(ch, rng);
    this.spawnThemePark(ch, rng);
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

  // ── Trees (5 types: pine, oak, dead, bush, willow) ──
  private spawnTrees(ch: ChunkD, rng: () => number) {
    const g = G(), { cx, cz } = ch;
    const biome = snoise(cx * CK + 8, cz * CK + 8, SEED, 48);
    const count = biome > 0.6 ? 4 + Math.floor(rng() * 5) : 6 + Math.floor(rng() * 10);
    for (let i = 0; i < count; i++) {
      const lx = Math.floor(rng() * CK), lz = Math.floor(rng() * CK);
      const wx = cx * CK + lx, wz = cz * CK + lz;
      const tile = ch.tiles[lx]?.[lz];
      if (this.blocked.has(`${wx},${wz}`) || !tile || tile.type === T.WATER || tile.type === T.SAND) continue;
      const h = tile.height;
      const gr = new THREE.Group(); gr.position.set(wx, h, wz);
      const sv = 0.7 + rng() * 0.6;
      const treeType = rng();
      const isStone = tile.type === T.STONE;
      const isDirt = tile.type === T.DIRT;
      if (treeType < 0.3) {
        // Pine — tall, narrow, 3 layers of cones
        const trunk = new THREE.Mesh(g.cyl, mat('#4a3520')); trunk.scale.set(0.08 * sv, 1.2 * sv, 0.08 * sv); trunk.position.y = 0.6 * sv; trunk.castShadow = true; gr.add(trunk);
        const pineG = rng() > 0.3 ? '#1a4a1a' : '#2a5a25';
        for (let j = 0; j < 3; j++) { const cn = new THREE.Mesh(g.cone, mat(pineG)); const cs = (1.1 - j * 0.25) * sv; cn.scale.set(cs * 0.55, cs * 0.65, cs * 0.55); cn.position.y = (0.7 + j * 0.38) * sv; cn.castShadow = true; gr.add(cn); }
      } else if (treeType < 0.55) {
        // Oak — round bushy canopy using scaled sphere
        const trunk = new THREE.Mesh(g.cyl, mat('#5a3a20')); trunk.scale.set(0.14 * sv, 0.7 * sv, 0.14 * sv); trunk.position.y = 0.35 * sv; trunk.castShadow = true; gr.add(trunk);
        const oakG = rng() > 0.5 ? '#3a6830' : (rng() > 0.3 ? '#4a7a35' : '#2d5525');
        const canopy = new THREE.Mesh(g.sphere, mat(oakG)); canopy.scale.set(0.9 * sv, 0.7 * sv, 0.9 * sv); canopy.position.y = 0.95 * sv; canopy.castShadow = true; gr.add(canopy);
        // Second smaller canopy clump for organic shape
        if (rng() > 0.4) { const c2 = new THREE.Mesh(g.sphere, mat(oakG)); c2.scale.set(0.5 * sv, 0.45 * sv, 0.5 * sv); c2.position.set((rng() - 0.5) * 0.4 * sv, 1.15 * sv, (rng() - 0.5) * 0.4 * sv); c2.castShadow = true; gr.add(c2); }
      } else if (treeType < 0.68 && (isStone || isDirt)) {
        // Dead/spooky tree — bare trunk with branches, no leaves
        const trunk = new THREE.Mesh(g.cyl, mat('#3a2a1a')); trunk.scale.set(0.1 * sv, 1.0 * sv, 0.1 * sv); trunk.position.y = 0.5 * sv; trunk.castShadow = true; gr.add(trunk);
        for (let b = 0; b < 3; b++) { const br = new THREE.Mesh(g.cyl, mat('#4a3520')); br.scale.set(0.04 * sv, 0.5 * sv, 0.04 * sv); const a = rng() * Math.PI * 2; br.position.set(Math.sin(a) * 0.15 * sv, (0.6 + b * 0.2) * sv, Math.cos(a) * 0.15 * sv); br.rotation.z = (rng() - 0.5) * 1.2; br.rotation.x = (rng() - 0.5) * 0.8; br.castShadow = true; gr.add(br); }
      } else if (treeType < 0.82) {
        // Bush — low round shrub
        const bushCol = rng() > 0.6 ? '#3a6a2a' : (rng() > 0.3 ? '#4a7830' : '#556b2f');
        const bush = new THREE.Mesh(g.sphere, mat(bushCol)); bush.scale.set(0.5 * sv, 0.35 * sv, 0.5 * sv); bush.position.y = 0.18 * sv; bush.castShadow = true; gr.add(bush);
        if (rng() > 0.5) { const b2 = new THREE.Mesh(g.sphere, mat(bushCol)); b2.scale.set(0.35 * sv, 0.25 * sv, 0.35 * sv); b2.position.set((rng() - 0.5) * 0.3, 0.12 * sv, (rng() - 0.5) * 0.3); gr.add(b2); }
      } else {
        // Willow — drooping branches
        const trunk = new THREE.Mesh(g.cyl, mat('#5a4a30')); trunk.scale.set(0.12 * sv, 0.9 * sv, 0.12 * sv); trunk.position.y = 0.45 * sv; trunk.castShadow = true; gr.add(trunk);
        const willowG = '#3a6b30';
        const canopy = new THREE.Mesh(g.sphere, mat(willowG)); canopy.scale.set(0.8 * sv, 0.5 * sv, 0.8 * sv); canopy.position.y = 0.9 * sv; canopy.castShadow = true; gr.add(canopy);
        // Drooping fronds
        for (let f = 0; f < 5; f++) { const frond = new THREE.Mesh(g.cyl, mat('#2a5a20')); frond.scale.set(0.04 * sv, 0.6 * sv, 0.04 * sv); const fa = (f / 5) * Math.PI * 2; frond.position.set(Math.sin(fa) * 0.4 * sv, 0.55 * sv, Math.cos(fa) * 0.4 * sv); frond.rotation.z = Math.sin(fa) * 0.5; frond.rotation.x = Math.cos(fa) * 0.5; gr.add(frond); }
      }
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

  // ── Monsters ──
  private mkMonster(type: string, rng: () => number): { grp: THREE.Group; parts: Record<string, THREE.Object3D> } {
    const g = G(), grp = new THREE.Group(), parts: Record<string, THREE.Object3D> = {};
    if (type === 'slime') {
      const body = new THREE.Mesh(g.sphere, new THREE.MeshLambertMaterial({ color: '#44cc44' }));
      body.scale.set(0.5, 0.35, 0.5); body.position.y = 0.2; body.castShadow = true; grp.add(body); parts.body = body;
      // eyes
      const eyeM = mat('#ffffff');
      for (const ex of [-0.12, 0.12]) { const eye = new THREE.Mesh(g.sphere, eyeM); eye.scale.setScalar(0.08); eye.position.set(ex, 0.32, 0.2); grp.add(eye); }
      for (const ex of [-0.12, 0.12]) { const pupil = new THREE.Mesh(g.sphere, mat('#111')); pupil.scale.setScalar(0.04); pupil.position.set(ex, 0.33, 0.25); grp.add(pupil); }
    } else if (type === 'dragon') {
      const body = new THREE.Mesh(g.cone, new THREE.MeshLambertMaterial({ color: '#ff4422' }));
      body.scale.set(0.35, 0.7, 0.35); body.position.y = 0.45; body.castShadow = true; grp.add(body); parts.body = body;
      const head = new THREE.Mesh(g.sphere, mat('#ff6644')); head.scale.setScalar(0.2); head.position.set(0, 0.85, 0.1); grp.add(head);
      // wings
      const wingM = new THREE.MeshLambertMaterial({ color: '#cc2200', side: THREE.DoubleSide });
      const lw = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.3), wingM); lw.position.set(-0.35, 0.6, 0); lw.rotation.y = -0.3; grp.add(lw); parts.lwing = lw;
      const rw = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.3), wingM); rw.position.set(0.35, 0.6, 0); rw.rotation.y = 0.3; grp.add(rw); parts.rwing = rw;
    } else if (type === 'mushroom') {
      const stem = new THREE.Mesh(g.cyl, mat('#cc9966')); stem.scale.set(0.15, 0.5, 0.15); stem.position.y = 0.25; stem.castShadow = true; grp.add(stem);
      const cap = new THREE.Mesh(g.sphere, new THREE.MeshLambertMaterial({ color: '#ff4488' }));
      cap.scale.set(0.45, 0.25, 0.45); cap.position.y = 0.55; cap.castShadow = true; grp.add(cap); parts.cap = cap;
      // spots on cap
      for (let i = 0; i < 5; i++) { const sp = new THREE.Mesh(g.sphere, mat('#ffffff')); sp.scale.setScalar(0.06); const a = (i / 5) * Math.PI * 2; sp.position.set(Math.cos(a) * 0.25, 0.6, Math.sin(a) * 0.25); grp.add(sp); }
      // eyes
      for (const ex of [-0.08, 0.08]) { const eye = new THREE.Mesh(g.sphere, mat('#111')); eye.scale.setScalar(0.04); eye.position.set(ex, 0.35, 0.14); grp.add(eye); }
    } else if (type === 'golem') {
      const body = new THREE.Mesh(g.box, new THREE.MeshLambertMaterial({ color: '#8844ff', emissive: 0x442288, emissiveIntensity: 0.3 }));
      body.scale.set(0.5, 0.7, 0.4); body.position.y = 0.45; body.castShadow = true; grp.add(body); parts.body = body;
      const head = new THREE.Mesh(g.oct, new THREE.MeshLambertMaterial({ color: '#aa66ff', emissive: 0x6633cc, emissiveIntensity: 0.5 }));
      head.scale.setScalar(0.2); head.position.y = 0.95; grp.add(head); parts.head = head;
      // crystal arms
      for (const sx of [-0.4, 0.4]) { const arm = new THREE.Mesh(g.oct, new THREE.MeshLambertMaterial({ color: '#9955ee', emissive: 0x5522aa, emissiveIntensity: 0.4 })); arm.scale.set(0.12, 0.25, 0.12); arm.position.set(sx, 0.5, 0); grp.add(arm); }
    } else if (type === 'wisp') {
      const body = new THREE.Mesh(g.sphere, new THREE.MeshLambertMaterial({ color: '#ffffff', transparent: true, opacity: 0.4, emissive: 0xaaccff, emissiveIntensity: 0.8 }));
      body.scale.setScalar(0.3); body.position.y = 0.8; grp.add(body); parts.body = body;
      // glow trail
      for (let i = 0; i < 3; i++) { const tr = new THREE.Mesh(g.sphere, new THREE.MeshLambertMaterial({ color: '#aaccff', transparent: true, opacity: 0.2 - i * 0.05 })); tr.scale.setScalar(0.15 - i * 0.03); tr.position.set(0, 0.7 - i * 0.15, -i * 0.1); grp.add(tr); parts[`trail${i}`] = tr; }
    } else if (type === 'spider') {
      const body = new THREE.Mesh(g.sphere, mat('#332211')); body.scale.set(0.3, 0.2, 0.4); body.position.y = 0.35; body.castShadow = true; grp.add(body); parts.body = body;
      // 8 legs
      for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; const leg = new THREE.Mesh(g.cyl, mat('#221100')); leg.scale.set(0.03, 0.35, 0.03); leg.position.set(Math.cos(a) * 0.25, 0.2, Math.sin(a) * 0.25); leg.rotation.z = Math.cos(a) * 0.6; leg.rotation.x = -Math.sin(a) * 0.6; grp.add(leg); parts[`leg${i}`] = leg; }
      // eyes (2 big, 4 small)
      for (const ex of [-0.06, 0.06]) { const eye = new THREE.Mesh(g.sphere, mat('#ff0000')); eye.scale.setScalar(0.04); eye.position.set(ex, 0.4, 0.2); grp.add(eye); }
    } else if (type === 'troll') {
      const body = new THREE.Mesh(g.box, mat('#558833')); body.scale.set(0.7, 0.9, 0.5); body.position.y = 0.55; body.castShadow = true; grp.add(body); parts.body = body;
      const head = new THREE.Mesh(g.sphere, mat('#669944')); head.scale.set(0.35, 0.3, 0.3); head.position.y = 1.2; head.castShadow = true; grp.add(head);
      // tusks
      for (const ex of [-0.12, 0.12]) { const tusk = new THREE.Mesh(g.cone, mat('#ffffcc')); tusk.scale.set(0.04, 0.12, 0.04); tusk.position.set(ex, 1.1, 0.2); tusk.rotation.x = 0.3; grp.add(tusk); }
      // arms
      for (const sx of [-0.5, 0.5]) { const arm = new THREE.Mesh(g.box, mat('#558833')); arm.scale.set(0.18, 0.6, 0.18); arm.position.set(sx, 0.4, 0); grp.add(arm); parts[sx < 0 ? 'larm' : 'rarm'] = arm; }
    } else if (type === 'elemental') {
      const core = new THREE.Mesh(g.sphere, new THREE.MeshLambertMaterial({ color: '#ff6600', emissive: 0xff4400, emissiveIntensity: 0.8 }));
      core.scale.setScalar(0.3); core.position.y = 0.5; grp.add(core); parts.core = core;
      const flame = new THREE.Mesh(g.cone, new THREE.MeshLambertMaterial({ color: '#ffcc00', emissive: 0xff8800, emissiveIntensity: 0.6, transparent: true, opacity: 0.8 }));
      flame.scale.set(0.4, 0.8, 0.4); flame.position.y = 0.8; grp.add(flame); parts.flame = flame;
      // sparks
      for (let i = 0; i < 4; i++) { const sp = new THREE.Mesh(g.sphere, new THREE.MeshLambertMaterial({ color: '#ffff44', emissive: 0xffaa00, emissiveIntensity: 1.0 })); sp.scale.setScalar(0.06); const a = (i / 4) * Math.PI * 2; sp.position.set(Math.cos(a) * 0.3, 0.6 + i * 0.1, Math.sin(a) * 0.3); grp.add(sp); parts[`spark${i}`] = sp; }
    }
    return { grp, parts };
  }

  private spawnMonsters(ch: ChunkD, rng: () => number) {
    const { cx, cz } = ch;
    if (cx === 0 && cz === 0) return; // no monsters in starting area
    const biome = snoise(cx * CK + 8, cz * CK + 8, SEED, 48);
    const roll = rng();
    const count = roll < 0.3 ? 0 : roll < 0.7 ? 1 : 2;
    for (let i = 0; i < count; i++) {
      const lx = 2 + Math.floor(rng() * 12), lz = 2 + Math.floor(rng() * 12);
      const wx = cx * CK + lx, wz = cz * CK + lz;
      if (this.blocked.has(`${wx},${wz}`) || ch.tiles[lx]?.[lz]?.type === T.WATER) continue;
      // pick type based on biome
      let type: string;
      const tr = rng();
      if (biome > 1.0) { // rocky
        type = tr < 0.3 ? 'golem' : tr < 0.5 ? 'elemental' : tr < 0.7 ? 'spider' : tr < 0.9 ? 'slime' : 'dragon';
      } else if (biome > 0.6) { // forest/dirt
        type = tr < 0.3 ? 'mushroom' : tr < 0.5 ? 'spider' : tr < 0.7 ? 'slime' : tr < 0.85 ? 'troll' : 'wisp';
      } else { // grassland/sand
        type = tr < 0.35 ? 'slime' : tr < 0.55 ? 'mushroom' : tr < 0.7 ? 'wisp' : tr < 0.85 ? 'dragon' : 'spider';
      }
      const h = ch.tiles[lx][lz].height;
      const { grp, parts } = this.mkMonster(type, rng);
      grp.position.set(wx, h, wz);
      this.scene.add(grp);
      ch.meshes.push(grp);
      ch.monsters.push({ type, grp, wx, wz, phase: rng() * Math.PI * 2, dialogs: M_DLG[type] || ['...'], parts, met: false });
    }
  }

  // ── Theme Park ──
  private mkAttraction(type: string): { grp: THREE.Group; parts: Record<string, THREE.Object3D> } {
    const g = G(), grp = new THREE.Group(), parts: Record<string, THREE.Object3D> = {};
    if (type === 'ferris') {
      // Ferris wheel frame
      const frame = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.06, 8, 24), new THREE.MeshLambertMaterial({ color: '#ff6600' }));
      frame.position.y = 2.0; frame.rotation.x = Math.PI / 2; grp.add(frame); parts.wheel = frame;
      // support poles
      for (const sx of [-0.5, 0.5]) { const pole = new THREE.Mesh(g.cyl, mat('#884400')); pole.scale.set(0.06, 2.0, 0.06); pole.position.set(sx, 1.0, 0); grp.add(pole); }
      // gondolas
      const gondolas = new THREE.Group(); gondolas.position.y = 2.0;
      for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2; const gon = new THREE.Mesh(g.box, mat('#4488ff')); gon.scale.set(0.2, 0.2, 0.15); gon.position.set(Math.cos(a) * 1.2, Math.sin(a) * 1.2, 0); gondolas.add(gon); }
      grp.add(gondolas); parts.gondolas = gondolas;
    } else if (type === 'carousel') {
      const platform = new THREE.Mesh(g.cyl, new THREE.MeshLambertMaterial({ color: '#ff44aa' }));
      platform.scale.set(1.2, 0.15, 1.2); platform.position.y = 0.1; grp.add(platform);
      const roof = new THREE.Mesh(g.cone, mat('#ff88cc')); roof.scale.set(1.4, 0.8, 1.4); roof.position.y = 1.6; grp.add(roof);
      const pole = new THREE.Mesh(g.cyl, mat('#ffcc00')); pole.scale.set(0.06, 1.6, 0.06); pole.position.y = 0.8; grp.add(pole);
      // horses
      const horses = new THREE.Group(); horses.position.y = 0.3;
      for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2; const horse = new THREE.Mesh(g.cone, mat(i % 2 === 0 ? '#ffffff' : '#ffcc00')); horse.scale.set(0.15, 0.3, 0.15); horse.position.set(Math.cos(a) * 0.8, 0.3, Math.sin(a) * 0.8); const hp = new THREE.Mesh(g.cyl, mat('#ffcc00')); hp.scale.set(0.02, 0.8, 0.02); hp.position.set(Math.cos(a) * 0.8, 0.5, Math.sin(a) * 0.8); horses.add(horse); horses.add(hp); }
      grp.add(horses); parts.horses = horses;
    } else if (type === 'circus') {
      // Striped tent
      const tent = new THREE.Mesh(g.cone, new THREE.MeshLambertMaterial({ color: '#ff0000' }));
      tent.scale.set(1.8, 2.5, 1.8); tent.position.y = 1.25; tent.castShadow = true; grp.add(tent); parts.tent = tent;
      // white stripes (just another smaller cone inside)
      const inner = new THREE.Mesh(g.cone, new THREE.MeshLambertMaterial({ color: '#ffffff', transparent: true, opacity: 0.5 }));
      inner.scale.set(1.6, 2.3, 1.6); inner.position.y = 1.15; grp.add(inner);
      // flag on top
      const flagPole = new THREE.Mesh(g.cyl, mat('#884400')); flagPole.scale.set(0.03, 0.5, 0.03); flagPole.position.y = 2.75; grp.add(flagPole);
      const flag = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.15), new THREE.MeshLambertMaterial({ color: '#ffcc00', side: THREE.DoubleSide }));
      flag.position.set(0.15, 2.9, 0); grp.add(flag); parts.flag = flag;
    } else if (type === 'coaster') {
      // Track (torus knot)
      const track = new THREE.Mesh(new THREE.TorusKnotGeometry(1.0, 0.04, 64, 8, 2, 3), new THREE.MeshLambertMaterial({ color: '#8844ff' }));
      track.position.y = 1.0; track.scale.setScalar(0.8); grp.add(track);
      // Support structures
      for (let i = 0; i < 4; i++) { const a = (i / 4) * Math.PI * 2; const sup = new THREE.Mesh(g.cyl, mat('#666')); sup.scale.set(0.04, 1.2, 0.04); sup.position.set(Math.cos(a) * 0.8, 0.6, Math.sin(a) * 0.8); grp.add(sup); }
      // Cart
      const cart = new THREE.Mesh(g.box, mat('#ffcc00')); cart.scale.set(0.2, 0.12, 0.12); cart.position.y = 1.0; grp.add(cart); parts.cart = cart;
    } else if (type === 'bumper') {
      // Arena
      const arena = new THREE.Mesh(g.cyl, new THREE.MeshLambertMaterial({ color: '#44cc44' }));
      arena.scale.set(1.5, 0.05, 1.5); arena.position.y = 0.03; grp.add(arena);
      // Fence
      const fence = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.04, 6, 24), mat('#888'));
      fence.position.y = 0.15; fence.rotation.x = Math.PI / 2; grp.add(fence);
      // Bumper cars
      const cars = new THREE.Group();
      const carColors = ['#ff4444', '#4444ff', '#ffcc00', '#ff44ff'];
      for (let i = 0; i < 4; i++) { const a = (i / 4) * Math.PI * 2; const car = new THREE.Mesh(g.sphere, new THREE.MeshLambertMaterial({ color: carColors[i] })); car.scale.set(0.2, 0.12, 0.2); car.position.set(Math.cos(a) * 0.7, 0.15, Math.sin(a) * 0.7); cars.add(car); }
      grp.add(cars); parts.cars = cars;
    } else if (type === 'food') {
      // Booth
      const booth = new THREE.Mesh(g.box, mat('#ffaa00')); booth.scale.set(1.0, 1.0, 0.7); booth.position.y = 0.5; booth.castShadow = true; grp.add(booth);
      // Awning
      const awning = new THREE.Mesh(g.box, new THREE.MeshLambertMaterial({ color: '#ff4444' }));
      awning.scale.set(1.2, 0.06, 0.9); awning.position.set(0, 1.2, 0.15); awning.rotation.x = -0.15; grp.add(awning); parts.awning = awning;
      // Counter items (lollipops etc.)
      for (let i = 0; i < 3; i++) { const candy = new THREE.Mesh(g.sphere, mat(i === 0 ? '#ff66aa' : i === 1 ? '#66ffaa' : '#ffff66')); candy.scale.setScalar(0.1); candy.position.set(-0.3 + i * 0.3, 1.1, 0.2); grp.add(candy); }
      // Sign post
      const signPost = new THREE.Mesh(g.cyl, mat('#884400')); signPost.scale.set(0.04, 0.5, 0.04); signPost.position.set(0.7, 1.3, 0); grp.add(signPost);
    }
    return { grp, parts };
  }

  private spawnThemePark(ch: ChunkD, rng: () => number) {
    const { cx, cz } = ch;
    // No theme parks near starting area
    if (Math.abs(cx) < 2 && Math.abs(cz) < 2) return;
    // ~1 per 20 chunks
    if (rng() > 0.05) return;
    // Check biome — only on grass
    const centerX = cx * CK + 8, centerZ = cz * CK + 8;
    const biome = snoise(centerX, centerZ, SEED, 48);
    if (biome > 0.85) return; // not in rocky areas
    // Pick 3-4 attractions
    const numAttr = 3 + (rng() > 0.5 ? 1 : 0);
    const usedTypes = new Set<string>();
    const positions: [number, number][] = [[0, 0], [3, 0], [0, 3], [3, 3]];
    for (let i = 0; i < numAttr; i++) {
      let type: string;
      do { type = PARK_TYPES[Math.floor(rng() * PARK_TYPES.length)]; } while (usedTypes.has(type) && usedTypes.size < PARK_TYPES.length);
      usedTypes.add(type);
      const [offX, offZ] = positions[i];
      const lx = 4 + offX, lz = 4 + offZ;
      const wx = cx * CK + lx, wz = cz * CK + lz;
      if (this.blocked.has(`${wx},${wz}`)) continue;
      const h = ch.tiles[lx]?.[lz]?.height ?? 0.4;
      const { grp, parts } = this.mkAttraction(type);
      grp.position.set(wx, h, wz);
      this.scene.add(grp);
      ch.meshes.push(grp);
      ch.parks.push({ grp, type, wx, wz, parts, discovered: false });
      // Mark path tiles as sand
      for (let dx = -1; dx <= 1; dx++) for (let dz = -1; dz <= 1; dz++) {
        const tlx = lx + dx, tlz = lz + dz;
        if (tlx >= 0 && tlx < CK && tlz >= 0 && tlz < CK && ch.tiles[tlx]?.[tlz]?.type === T.GRASS) {
          ch.tiles[tlx][tlz] = { type: T.SAND, height: ch.tiles[tlx][tlz].height };
        }
      }
    }
  }

  // ── Collect entities from loaded chunks ──
  private collectEntities() {
    this.allNPCs = []; this.allRes = []; this.allHid = []; this.allMonsters = []; this.allParks = [];
    for (const ch of this.chunks.values()) {
      this.allNPCs.push(...ch.npcs);
      this.allRes.push(...ch.res);
      this.allHid.push(...ch.hid);
      this.allMonsters.push(...ch.monsters);
      this.allParks.push(...ch.parks);
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  // INSTANCED MESH REBUILD
  // ═══════════════════════════════════════════════════════════════════
  private tileColorVar(wx: number, wz: number, type: number): [number, number, number] {
    // Per-tile color variation via cheap hash for organic look
    const h1 = Math.sin(wx * 127.1 + wz * 311.7) * 43758.5453;
    const v = (h1 - Math.floor(h1)) * 2 - 1; // -1..1
    const h2 = Math.sin(wx * 269.3 + wz * 183.1) * 28371.2;
    const v2 = (h2 - Math.floor(h2)) * 2 - 1;
    const base = BASE_C[type];
    if (type === T.GRASS) {
      // Grass: green variation + yellow-ish patches + dark spots
      return [base.r + v * 0.06 + v2 * 0.02, base.g + v * 0.08 + v2 * 0.04, base.b + v * 0.03];
    } else if (type === T.STONE) {
      // Stone: grey-purple-brown variation
      return [base.r + v * 0.08, base.g + v * 0.06 + v2 * 0.03, base.b + v * 0.07];
    } else if (type === T.DIRT) {
      // Dirt: warm browns
      return [base.r + v * 0.07, base.g + v * 0.05, base.b + v * 0.04 + v2 * 0.02];
    } else if (type === T.WATER) {
      // Water: blue-teal shifts
      return [base.r + v * 0.03, base.g + v * 0.04, base.b + v * 0.06 + v2 * 0.03];
    } else {
      // Sand: warm yellow variation
      return [base.r + v * 0.06, base.g + v * 0.05 + v2 * 0.03, base.b + v * 0.04];
    }
  }

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
      const im = this.iMesh[type];
      tiles.forEach((t, i) => {
        this.dummy.position.set(t.wx, t.h / 2, t.wz);
        this.dummy.scale.set(1, Math.max(0.05, t.h), 1);
        this.dummy.updateMatrix();
        im.setMatrixAt(i, this.dummy.matrix);
        const mul = this.fog.fogMul(t.wx, t.wz);
        const [cr, cg, cb] = this.tileColorVar(t.wx, t.wz, type);
        im.setColorAt(i, new THREE.Color(
          Math.max(0, Math.min(1, cr)) * mul,
          Math.max(0, Math.min(1, cg)) * mul,
          Math.max(0, Math.min(1, cb)) * mul
        ));
      });
      im.count = tiles.length;
      im.instanceMatrix.needsUpdate = true;
      if (im.instanceColor) im.instanceColor.needsUpdate = true;
    }
  }

  private updateFogColors() {
    for (const [type, tiles] of this.tileBuf) {
      const im = this.iMesh[type];
      if (!im.instanceColor) continue;
      const arr = im.instanceColor.array as Float32Array;
      tiles.forEach((t, i) => {
        const mul = this.fog.fogMul(t.wx, t.wz);
        const [cr, cg, cb] = this.tileColorVar(t.wx, t.wz, type);
        const idx = i * 3;
        arr[idx] = Math.max(0, Math.min(1, cr)) * mul;
        arr[idx + 1] = Math.max(0, Math.min(1, cg)) * mul;
        arr[idx + 2] = Math.max(0, Math.min(1, cb)) * mul;
      });
      im.instanceColor.needsUpdate = true;
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  // INPUT
  // ═══════════════════════════════════════════════════════════════════
  private setupInput() {
    const kd = (e: KeyboardEvent) => { if (e.key === ' ') e.preventDefault(); this.keys.add(e.key.toLowerCase()); if (this.dialog && (e.key === ' ' || e.key === 'Enter' || e.key === 'Escape')) this.advDialog(); else if ((e.key === ' ' || e.key.toLowerCase() === 'j') && !this.dialog) this.playerAttack(); };
    const ku = (e: KeyboardEvent) => this.keys.delete(e.key.toLowerCase());
    const cl = (e: MouseEvent) => { const r = this.ctr.getBoundingClientRect(); this.mNDC.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); this.handleClick(); };
    const wh = (e: WheelEvent) => { e.preventDefault(); this.cam.zoom = Math.max(35, Math.min(80, this.cam.zoom - e.deltaY * 0.03)); this.cam.updateProjectionMatrix(); };
    window.addEventListener('keydown', kd); window.addEventListener('keyup', ku);
    this.ctr.addEventListener('click', cl); this.ctr.addEventListener('wheel', wh, { passive: false });
    this.cleanup = () => { window.removeEventListener('keydown', kd); window.removeEventListener('keyup', ku); this.ctr.removeEventListener('click', cl); this.ctr.removeEventListener('wheel', wh); };
  }

  private handleClick() {
    if (this.dialog) { this.advDialog(); return; }
    this.ray.setFromCamera(this.mNDC, this.cam);
    for (const n of this.allNPCs) { if (this.ray.intersectObject(n.g, true).length > 0) { this.walkToNPC(n); return; } }
    for (const mon of this.allMonsters) { if (this.ray.intersectObject(mon.grp, true).length > 0) { this.walkToMonster(mon); return; } }
    for (const r of this.allRes) { if (!r.got && this.ray.intersectObject(r.g, true).length > 0) { this.walkToRes(r); return; } }
    for (const h of this.allHid) { if (!h.found && this.ray.intersectObject(h.g, true).length > 0) { this.walkToHid(h); return; } }
    const pt = new THREE.Vector3();
    if (this.ray.ray.intersectPlane(this.gPlane, pt)) {
      const tx = Math.round(pt.x), tz = Math.round(pt.z);
      if (!this.blocked.has(`${tx},${tz}`)) {
        const path = astar((x, z) => !this.blocked.has(`${x},${z}`), this.pTile[0], this.pTile[1], tx, tz);
        if (path && path.length > 1) { this.pPath = path; this.pPI = 1; this.pMoving = true; this.pendNPC = null; this.pendRes = null; this.pendHid = null; this.pendMon = null; }
      }
    }
  }

  private walkToNPC(n: NPCInst) {
    const adj = this.adjTiles(n.tile[0], n.tile[1]);
    if (!adj.length) return;
    const path = astar((x, z) => !this.blocked.has(`${x},${z}`), this.pTile[0], this.pTile[1], adj[0][0], adj[0][1]);
    if (path) { this.pPath = path; this.pPI = 1; this.pMoving = true; this.pendNPC = n; this.pendRes = null; this.pendHid = null; this.pendMon = null; }
  }
  private walkToRes(r: ResInst) {
    const adj = this.adjTiles(r.tile[0], r.tile[1]);
    const t = adj.length ? adj[0] : r.tile;
    const path = astar((x, z) => !this.blocked.has(`${x},${z}`), this.pTile[0], this.pTile[1], t[0], t[1]);
    if (path) { this.pPath = path; this.pPI = 1; this.pMoving = true; this.pendRes = r; this.pendNPC = null; this.pendHid = null; this.pendMon = null; }
  }
  private walkToHid(h: HidInst) {
    const adj = this.adjTiles(h.tile[0], h.tile[1]);
    const t = adj.length ? adj[0] : h.tile;
    const path = astar((x, z) => !this.blocked.has(`${x},${z}`), this.pTile[0], this.pTile[1], t[0], t[1]);
    if (path) { this.pPath = path; this.pPI = 1; this.pMoving = true; this.pendHid = h; this.pendNPC = null; this.pendRes = null; this.pendMon = null; }
  }
  private walkToMonster(mon: MonsterInst) {
    const adj = this.adjTiles(mon.wx, mon.wz);
    const t = adj.length ? adj[0] : [mon.wx, mon.wz] as [number, number];
    const path = astar((x, z) => !this.blocked.has(`${x},${z}`), this.pTile[0], this.pTile[1], t[0], t[1]);
    if (path) { this.pPath = path; this.pPI = 1; this.pMoving = true; this.pendMon = mon; this.pendNPC = null; this.pendRes = null; this.pendHid = null; }
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
    this.updCombat(dt);
    this.updZombies(dt, t);
    this.updAirships(dt, t);
    this.updParticles(dt);
    this.updNPCs(dt, t);
    this.updRes(dt, t);
    this.updHidden(t);
    this.updMonsters(t);
    this.updParks(t);
    this.updDayNight(t);
    this.updHealthHUD();
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
      this.pPath = []; this.pendNPC = null; this.pendRes = null; this.pendHid = null; this.pendMon = null;
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
          if (this.pendMon) {
            const mName = this.pendMon.type.charAt(0).toUpperCase() + this.pendMon.type.slice(1);
            if (!this.pendMon.met) { this.pendMon.met = true; this.monstersMet++; this.updMonCount(); }
            this.dialog = { name: mName, dlgs: this.pendMon.dialogs, idx: 0 };
            this.updDialogDOM(this.dialog); this.pendMon = null;
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

  // ── Monster animations ──
  private updMonsters(t: number) {
    for (const m of this.allMonsters) {
      const vis = Math.abs(m.wx - this.pTile[0]) + Math.abs(m.wz - this.pTile[1]) < VR;
      m.grp.visible = vis;
      if (!vis) continue;
      const p = m.phase + t;
      if (m.type === 'slime') {
        if (m.parts.body) { m.parts.body.scale.y = 0.35 + Math.sin(p * 3) * 0.1; m.parts.body.position.y = 0.2 + Math.abs(Math.sin(p * 3)) * 0.15; }
      } else if (m.type === 'dragon') {
        if (m.parts.lwing) m.parts.lwing.rotation.z = Math.sin(p * 5) * 0.5;
        if (m.parts.rwing) m.parts.rwing.rotation.z = -Math.sin(p * 5) * 0.5;
        if (m.parts.body) m.parts.body.position.y = 0.45 + Math.sin(p * 2) * 0.05;
      } else if (m.type === 'mushroom') {
        if (m.parts.cap) m.parts.cap.rotation.z = Math.sin(p * 2) * 0.15;
        m.grp.rotation.y = Math.sin(p * 0.5) * 0.2;
      } else if (m.type === 'golem') {
        if (m.parts.head) { const em = (m.parts.head as THREE.Mesh).material as THREE.MeshLambertMaterial; em.emissiveIntensity = 0.3 + Math.sin(p * 2) * 0.3; }
        if (m.parts.body) { const em = (m.parts.body as THREE.Mesh).material as THREE.MeshLambertMaterial; em.emissiveIntensity = 0.2 + Math.sin(p * 2 + 1) * 0.2; }
      } else if (m.type === 'wisp') {
        if (m.parts.body) m.parts.body.position.y = 0.8 + Math.sin(p * 1.5) * 0.3;
        m.grp.rotation.y = t * 0.5;
        for (let i = 0; i < 3; i++) { const tr = m.parts[`trail${i}`]; if (tr) tr.position.y = 0.7 - i * 0.15 + Math.sin(p * 2 + i) * 0.05; }
      } else if (m.type === 'spider') {
        for (let i = 0; i < 8; i++) { const leg = m.parts[`leg${i}`]; if (leg) leg.rotation.x += Math.sin(p * 6 + i * 0.8) * 0.01; }
        m.grp.rotation.y += Math.sin(p * 0.3) * 0.003;
      } else if (m.type === 'troll') {
        m.grp.rotation.y = Math.sin(p * 0.3) * 0.1;
        if (m.parts.body) m.parts.body.position.y = 0.55 + Math.sin(p * 1) * 0.02;
      } else if (m.type === 'elemental') {
        if (m.parts.flame) { m.parts.flame.scale.y = 0.8 + Math.sin(p * 4) * 0.15; m.parts.flame.scale.x = 0.4 + Math.sin(p * 5) * 0.08; }
        if (m.parts.core) { const em = (m.parts.core as THREE.Mesh).material as THREE.MeshLambertMaterial; em.emissiveIntensity = 0.5 + Math.sin(p * 3) * 0.3; }
        for (let i = 0; i < 4; i++) { const sp = m.parts[`spark${i}`]; if (sp) { const a = (i / 4) * Math.PI * 2 + t; sp.position.set(Math.cos(a) * 0.3, 0.6 + i * 0.1 + Math.sin(p * 4 + i) * 0.1, Math.sin(a) * 0.3); } }
      }
    }
  }

  // ── Theme park animations ──
  private updParks(t: number) {
    for (const pk of this.allParks) {
      const vis = Math.abs(pk.wx - this.pTile[0]) + Math.abs(pk.wz - this.pTile[1]) < VR + 5;
      pk.grp.visible = vis;
      if (!vis) continue;
      // Discovery check
      if (!pk.discovered && Math.abs(pk.wx - this.pTile[0]) + Math.abs(pk.wz - this.pTile[1]) < 6) {
        pk.discovered = true;
      }
      if (pk.type === 'ferris') {
        if (pk.parts.gondolas) pk.parts.gondolas.rotation.z = t * 0.3;
      } else if (pk.type === 'carousel') {
        if (pk.parts.horses) pk.parts.horses.rotation.y = t * 0.8;
      } else if (pk.type === 'circus') {
        if (pk.parts.flag) pk.parts.flag.rotation.z = Math.sin(t * 3) * 0.2;
      } else if (pk.type === 'coaster') {
        if (pk.parts.cart) { const a = t * 1.5; const r = 0.8; pk.parts.cart.position.set(Math.cos(a) * r, 1.0 + Math.sin(a * 1.5) * 0.3, Math.sin(a) * r); }
      } else if (pk.type === 'bumper') {
        if (pk.parts.cars) pk.parts.cars.rotation.y = t * 0.4;
      } else if (pk.type === 'food') {
        if (pk.parts.awning) pk.parts.awning.rotation.x = -0.15 + Math.sin(t * 2) * 0.03;
      }
    }
  }

  private updMonCount() {
    const el = document.getElementById('g-monsters'); if (el) el.textContent = String(this.monstersMet);
  }

  // ═══════════════════════════════════════════════════════════════════
  // V02: COMBAT SYSTEM
  // ═══════════════════════════════════════════════════════════════════
  private playerAttack() {
    if (this.attackCD > 0 || this.playerHP <= 0) return;
    this.attackCD = 0.3;
    const t = this.clk.getElapsedTime();
    // Attack animation - arms snap forward
    this.pParts.la.rotation.x = -1.3; this.pParts.ra.rotation.x = -1.3;
    // Find nearest zombie in range
    let nearest: ZombieInst | null = null, minDist = 1.8;
    for (const z of this.zombies) {
      if (z.dying) continue;
      const dx = z.pos.x - this.pPos.x, dz = z.pos.z - this.pPos.z, dist = Math.sqrt(dx * dx + dz * dz);
      if (dist < minDist) { nearest = z; minDist = dist; }
    }
    if (nearest) {
      // Combo
      if (t - this.lastAttackT < 0.8) this.comboCount = Math.min(3, this.comboCount + 1);
      else this.comboCount = 1;
      this.lastAttackT = t;
      const dmg = 15 * (1 + (this.comboCount - 1) * 0.5);
      nearest.hp -= dmg;
      this.screenShake = 0.15;
      // Knockback
      const kx = nearest.pos.x - this.pPos.x, kz = nearest.pos.z - this.pPos.z;
      const kd = Math.sqrt(kx * kx + kz * kz) || 1;
      nearest.vel.set(kx / kd * 5, 0, kz / kd * 5);
      this.spawnBlood(nearest.pos, 4);
      this.updComboHUD();
      if (nearest.hp <= 0) { nearest.dying = true; nearest.deathT = 0; this.nightKills++; this.updKillsHUD(); }
    }
    // Face nearest zombie
    if (nearest) this.pTAngle = Math.atan2(nearest.pos.x - this.pPos.x, nearest.pos.z - this.pPos.z);
  }
  private updCombat(dt: number) {
    this.attackCD = Math.max(0, this.attackCD - dt);
    // Health regen during day
    if (this.dayPhase < 0.55 && this.playerHP < this.maxHP) { this.playerHP = Math.min(this.maxHP, this.playerHP + 0.5 * dt); }
  }

  // ═══════════════════════════════════════════════════════════════════
  // V02: ZOMBIE SYSTEM
  // ═══════════════════════════════════════════════════════════════════
  private mkZombie(wx: number, wz: number): ZombieInst {
    const { grp, la, ra, ll, rl, body } = this.mkHuman('#445544', 1.0);
    const g = G();
    // Red eyes
    const eyeM = new THREE.MeshLambertMaterial({ color: '#ff0000', emissive: 0xff0000, emissiveIntensity: 0.9 });
    for (const ex of [-0.08, 0.08]) { const eye = new THREE.Mesh(g.sphere, eyeM); eye.scale.setScalar(0.07); eye.position.set(ex, 1.15, -0.13); grp.add(eye); }
    const h = this.getH(Math.round(wx), Math.round(wz));
    grp.position.set(wx, h, wz);
    this.scene.add(grp);
    return { grp, pos: new THREE.Vector3(wx, h, wz), vel: new THREE.Vector3(), hp: 30, tile: [Math.round(wx), Math.round(wz)], angle: 0, parts: { la, ra, ll, rl, body }, hitCD: 0, walkT: 0, dying: false, deathT: 0 };
  }
  private spawnZombie() {
    if (this.zombies.length >= this.maxZombies) return;
    const angle = Math.random() * Math.PI * 2, radius = 15 + Math.random() * 5;
    const wx = this.pTile[0] + Math.cos(angle) * radius, wz = this.pTile[1] + Math.sin(angle) * radius;
    const tx = Math.round(wx), tz = Math.round(wz);
    if (this.blocked.has(`${tx},${tz}`) || this.getTileType(tx, tz) === T.WATER) return;
    this.zombies.push(this.mkZombie(wx, wz));
  }
  private updZombies(dt: number, t: number) {
    const d = this.dayPhase;
    // Night warning
    if (d >= 0.50 && d < 0.55 && this.lastNightPhase < 0.50) this.showWarning('Night approaches...');
    this.lastNightPhase = d;
    // Spawn during dusk/night
    if (d >= 0.55 && d < 0.85) {
      this.zombieSpawnCD -= dt;
      if (this.zombieSpawnCD <= 0) { for (let i = 0; i < (Math.random() > 0.5 ? 2 : 1); i++) this.spawnZombie(); this.zombieSpawnCD = 3.0; }
    }
    // Update each zombie
    for (let i = this.zombies.length - 1; i >= 0; i--) {
      const z = this.zombies[i];
      if (z.dying) {
        z.deathT += dt;
        if (z.deathT > 0.6) { this.scene.remove(z.grp); this.zombies.splice(i, 1); continue; }
        // Death: fly upward, fade by scaling down
        z.grp.position.y += dt * 3;
        const p = 1 - z.deathT / 0.6;
        z.grp.scale.setScalar(p);
        continue;
      }
      // Dawn kill
      if (d >= 0.85 || (d < 0.50 && this.zombies.length > 0)) { z.hp -= dt * 80; if (z.hp <= 0) { z.dying = true; z.deathT = 0; this.spawnBlood(z.pos, 3); } continue; }
      // Move toward player
      const dx = this.pPos.x - z.pos.x, dz = this.pPos.z - z.pos.z, dist = Math.sqrt(dx * dx + dz * dz);
      if (dist > 0.5) {
        const spd = 2.0;
        z.vel.x += (dx / dist) * spd * dt * 3; z.vel.z += (dz / dist) * spd * dt * 3;
        z.vel.multiplyScalar(0.92);
        z.angle = Math.atan2(dx, dz);
      }
      // Apply velocity
      const nx = z.pos.x + z.vel.x * dt, nz = z.pos.z + z.vel.z * dt;
      const ntx = Math.round(nx), ntz = Math.round(nz);
      if (!this.blocked.has(`${ntx},${ntz}`)) { z.pos.x = nx; z.pos.z = nz; z.tile = [ntx, ntz]; z.pos.y = this.getH(ntx, ntz); }
      // Hit player
      z.hitCD = Math.max(0, z.hitCD - dt);
      if (dist < 0.8 && z.hitCD <= 0 && this.playerHP > 0) {
        this.playerHP -= 10; z.hitCD = 1.0; this.screenShake = 0.25; this.updHealthHUD();
        if (this.playerHP <= 0) this.playerDeath();
      }
      // Animation
      z.grp.position.copy(z.pos); z.grp.rotation.y = z.angle; z.grp.scale.setScalar(1);
      z.walkT += dt * 3.5;
      const sw = Math.sin(z.walkT) * 0.35;
      z.parts.la.rotation.x = sw; z.parts.ra.rotation.x = -sw; z.parts.ll.rotation.x = -sw; z.parts.rl.rotation.x = sw;
      z.parts.body.rotation.z = Math.sin(z.walkT * 0.5) * 0.05; // shamble
    }
  }
  private playerDeath() {
    this.pTile = [8, 12]; this.pPos.set(8, this.getH(8, 12), 12); this.playerHP = this.maxHP;
    this.pPath = []; this.pMoving = false;
    this.rc.gold = Math.floor(this.rc.gold * 0.5); this.rc.wood = Math.floor(this.rc.wood * 0.5); this.rc.stone = Math.floor(this.rc.stone * 0.5);
    this.updRC(); this.updHealthHUD();
    this.showWarning('You died! Respawned at castle...');
    // Kill all current zombies
    for (const z of this.zombies) this.scene.remove(z.grp);
    this.zombies = [];
  }

  // ═══════════════════════════════════════════════════════════════════
  // V02: AIRSHIP SYSTEM
  // ═══════════════════════════════════════════════════════════════════
  private initAirships() {
    for (let i = 0; i < 4; i++) {
      const wx = (Math.random() - 0.5) * 120, wz = (Math.random() - 0.5) * 120;
      const g = G(), grp = new THREE.Group();
      const y = 18 + Math.random() * 6;
      grp.position.set(wx, y, wz);
      // Hull
      const hull = new THREE.Mesh(g.box, mat('#6b5b4f')); hull.scale.set(3.5, 1.2, 1.5); hull.position.y = 0; hull.castShadow = true; grp.add(hull);
      // Balloon
      const balloon = new THREE.Mesh(g.sphere, new THREE.MeshLambertMaterial({ color: '#c9a96e' }));
      balloon.scale.set(2.5, 1.8, 1.8); balloon.position.y = 1.8; balloon.castShadow = true; grp.add(balloon);
      // Ropes
      for (const [rx, rz] of [[-0.8, 0], [0.8, 0], [0, -0.5], [0, 0.5]]) { const r = new THREE.Mesh(g.cyl, mat('#554433')); r.scale.set(0.02, 1.2, 0.02); r.position.set(rx, 0.9, rz); grp.add(r); }
      // Propeller
      const prop = new THREE.Mesh(g.box, mat('#555')); prop.scale.set(0.1, 0.8, 0.08); prop.position.set(-2.0, 0, 0); grp.add(prop);
      // Gondola / cabin
      const cab = new THREE.Mesh(g.box, mat('#8b7355')); cab.scale.set(1.5, 0.5, 0.8); cab.position.y = -0.8; grp.add(cab);
      // Windows (small light dots)
      for (let w = 0; w < 3; w++) { const win = new THREE.Mesh(g.sphere, new THREE.MeshLambertMaterial({ color: '#ffcc44', emissive: 0xffcc44, emissiveIntensity: 0.5 })); win.scale.setScalar(0.08); win.position.set(-0.5 + w * 0.5, -0.7, 0.42); grp.add(win); }
      this.scene.add(grp);
      this.airships.push({ grp, pos: new THREE.Vector3(wx, y, wz), vel: new THREE.Vector3((Math.random() - 0.5) * 0.8, 0, (Math.random() - 0.5) * 0.8), propeller: prop, targetX: wx + (Math.random() - 0.5) * 200, targetZ: wz + (Math.random() - 0.5) * 200 });
    }
  }
  private updAirships(dt: number, t: number) {
    for (const a of this.airships) {
      const dx = a.targetX - a.pos.x, dz = a.targetZ - a.pos.z, dist = Math.sqrt(dx * dx + dz * dz);
      if (dist < 10) { a.targetX = this.pPos.x + (Math.random() - 0.5) * 200; a.targetZ = this.pPos.z + (Math.random() - 0.5) * 200; }
      const spd = 0.8;
      a.vel.x += (dx / (dist || 1)) * spd * dt; a.vel.z += (dz / (dist || 1)) * spd * dt;
      a.vel.multiplyScalar(0.995);
      a.pos.add(a.vel.clone().multiplyScalar(dt));
      a.pos.y = 18 + Math.sin(t * 0.3 + a.pos.x * 0.01) * 1.5; // gentle bob
      a.grp.position.copy(a.pos);
      a.grp.rotation.y = Math.atan2(a.vel.x, a.vel.z);
      a.propeller.rotation.z += dt * 8;
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  // V02: VISUAL EFFECTS
  // ═══════════════════════════════════════════════════════════════════
  private spawnBlood(pos: THREE.Vector3, count: number) {
    const g = G();
    for (let i = 0; i < count; i++) {
      const mesh = new THREE.Mesh(g.sphere, new THREE.MeshLambertMaterial({ color: '#880000' }));
      mesh.scale.setScalar(0.04 + Math.random() * 0.04);
      mesh.position.copy(pos);
      this.scene.add(mesh);
      this.bloods.push({ mesh, pos: pos.clone(), vel: new THREE.Vector3((Math.random() - 0.5) * 3, Math.random() * 4, (Math.random() - 0.5) * 3), life: 1.2 });
    }
  }
  private updParticles(dt: number) {
    for (let i = this.bloods.length - 1; i >= 0; i--) {
      const p = this.bloods[i];
      p.life -= dt; if (p.life <= 0) { this.scene.remove(p.mesh); this.bloods.splice(i, 1); continue; }
      p.vel.y -= 8 * dt; // gravity
      p.pos.add(p.vel.clone().multiplyScalar(dt));
      p.mesh.position.copy(p.pos);
      p.mesh.scale.setScalar((p.life / 1.2) * 0.06);
    }
  }
  private showWarning(msg: string) {
    const el = document.getElementById('g-warning');
    if (el) { el.textContent = msg; el.style.opacity = '1'; setTimeout(() => { el.style.opacity = '0'; }, 3000); }
  }
  private updHealthHUD() {
    const el = document.getElementById('g-hp'); const bar = document.getElementById('g-hp-bar');
    if (el) el.textContent = `${Math.max(0, Math.floor(this.playerHP))}/${this.maxHP}`;
    if (bar) { const pct = Math.max(0, this.playerHP / this.maxHP) * 100; bar.style.width = pct + '%'; bar.style.backgroundColor = pct > 50 ? '#ef4444' : pct > 25 ? '#f97316' : '#991b1b'; }
  }
  private updKillsHUD() { const el = document.getElementById('g-kills'); if (el) el.textContent = String(this.nightKills); }
  private updComboHUD() { const el = document.getElementById('g-combo'); if (el) { if (this.comboCount > 1) { el.textContent = `${this.comboCount}x COMBO!`; el.style.opacity = '1'; } else { el.style.opacity = '0'; } } }

  // ── Day/Night ──
  private updDayNight(t: number) {
    const d = (t % 90) / 90;
    this.dayPhase = d; // expose for zombie system
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
    let sx = 0, sy = 0, sz = 0;
    if (this.screenShake > 0.01) {
      sx = (Math.random() - 0.5) * this.screenShake;
      sy = (Math.random() - 0.5) * this.screenShake * 0.5;
      sz = (Math.random() - 0.5) * this.screenShake;
      this.screenShake *= 0.9;
    } else { this.screenShake = 0; }
    this.cam.position.set(this.camLook.x + CAM_OFF.x + sx, CAM_OFF.y + sy, this.camLook.z + CAM_OFF.z + sz);
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
    // Monsters
    ctx.fillStyle = '#ff4444';
    for (const m of this.allMonsters) { const dx = m.wx - this.pTile[0] + MM_R, dz = m.wz - this.pTile[1] + MM_R; if (dx >= 0 && dx < MM_R * 2 && dz >= 0 && dz < MM_R * 2 && this.fog.explored.has(`${m.wx},${m.wz}`)) { ctx.beginPath(); ctx.arc(dx * ppx, dz * ppx, ppx * 0.8, 0, Math.PI * 2); ctx.fill(); } }
    // Theme Parks
    ctx.fillStyle = '#ff44ff';
    for (const pk of this.allParks) { const dx = pk.wx - this.pTile[0] + MM_R, dz = pk.wz - this.pTile[1] + MM_R; if (dx >= 0 && dx < MM_R * 2 && dz >= 0 && dz < MM_R * 2 && this.fog.explored.has(`${pk.wx},${pk.wz}`)) { ctx.fillRect(dx * ppx - ppx, dz * ppx - ppx, ppx * 2, ppx * 2); } }
    // Zombies
    ctx.fillStyle = '#00ffcc';
    for (const z of this.zombies) { if (z.dying) continue; const dx = z.tile[0] - this.pTile[0] + MM_R, dz = z.tile[1] - this.pTile[1] + MM_R; if (dx >= 0 && dx < MM_R * 2 && dz >= 0 && dz < MM_R * 2) { ctx.beginPath(); ctx.arc(dx * ppx, dz * ppx, ppx * 1.2, 0, Math.PI * 2); ctx.fill(); } }
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
      {/* ── Resource bar ── */}
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
        <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-sm rounded px-2.5 py-1">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#ff4444' }} />
          <span className="text-[10px] uppercase tracking-wider text-white/70">monsters</span>
          <span id="g-monsters" className="text-[12px] font-bold text-white">0</span>
        </div>
      </div>
      {/* ── Health bar ── */}
      <div className="absolute top-14 left-4 transition-opacity duration-700" style={{ opacity: isReady ? 1 : 0, transitionDelay: '900ms' }}>
        <div className="bg-black/50 backdrop-blur-sm rounded px-2.5 py-1.5 flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-wider text-white/70">HP</span>
          <div className="w-24 h-2.5 bg-black/60 rounded-full overflow-hidden">
            <div id="g-hp-bar" className="h-full rounded-full transition-all duration-200" style={{ width: '100%', backgroundColor: '#ef4444' }} />
          </div>
          <span id="g-hp" className="text-[11px] font-bold text-white">100/100</span>
        </div>
      </div>
      {/* ── Kill counter ── */}
      <div className="absolute top-[88px] left-4 transition-opacity duration-700" style={{ opacity: isReady ? 1 : 0, transitionDelay: '900ms' }}>
        <div id="g-kills" className="bg-black/50 backdrop-blur-sm rounded px-2.5 py-1 text-[11px] font-bold text-red-400" style={{ display: 'none' }}>
          Kills: 0
        </div>
      </div>
      {/* ── Combo indicator ── */}
      <div id="g-combo" className="absolute top-1/3 left-1/2 -translate-x-1/2 text-center" style={{ opacity: 0, transition: 'opacity 0.3s' }}>
        <span className="text-3xl font-black text-yellow-400 drop-shadow-lg" style={{ textShadow: '0 0 20px rgba(255,200,0,0.5)' }}>COMBO x2</span>
      </div>
      {/* ── Night warning toast ── */}
      <div id="g-warning" className="absolute top-1/4 left-1/2 -translate-x-1/2 text-center" style={{ opacity: 0, transition: 'opacity 0.5s' }}>
        <div className="bg-red-900/70 backdrop-blur-sm rounded-lg px-6 py-3 border border-red-500/40">
          <span className="text-lg font-bold text-red-300 uppercase tracking-[0.2em]" style={{ textShadow: '0 0 10px rgba(255,0,0,0.4)' }}>Night Approaches...</span>
        </div>
      </div>
      {/* ── Location ── */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 transition-opacity duration-700" style={{ opacity: isReady ? 1 : 0, transitionDelay: '1000ms' }}>
        <div className="bg-black/40 backdrop-blur-sm rounded px-4 py-1.5">
          <span id="g-loc" className="text-[11px] uppercase tracking-[0.2em] text-white/70">Wilderness</span>
        </div>
      </div>
      {/* ── Minimap ── */}
      <div className="absolute top-4 right-4 transition-opacity duration-700" style={{ opacity: isReady ? 1 : 0, transitionDelay: '800ms' }}>
        <div className="bg-black/50 backdrop-blur-sm rounded p-1.5">
          <canvas id="g-mm" width={128} height={128} className="rounded" style={{ width: 128, height: 128 }} />
        </div>
      </div>
      {/* ── Dialog panel ── */}
      <div id="gd-panel" className="absolute bottom-20 left-1/2 -translate-x-1/2 w-[90%] max-w-lg transition-all duration-300" style={{ opacity: 0, transform: 'translateY(20px)', pointerEvents: 'none' }}>
        <div className="bg-black/70 backdrop-blur-md rounded-lg border border-white/10 p-4 pointer-events-auto cursor-pointer" onClick={onContinue}>
          <p id="gd-name" className="text-[11px] uppercase tracking-[0.2em] mb-2" style={{ color: '#c9a96e' }} />
          <p id="gd-text" className="text-sm text-white/90 leading-relaxed" style={{ fontFamily: 'var(--font-heading)' }} />
          <p className="text-[9px] uppercase tracking-wider text-white/30 mt-3">Click or press Space to continue</p>
        </div>
      </div>
      {/* ── Controls hint ── */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 transition-opacity duration-700" style={{ opacity: isReady ? 1 : 0, transitionDelay: '1200ms' }}>
        <p className="text-[9px] uppercase tracking-[0.15em] text-white/30 bg-black/30 rounded px-3 py-1">WASD to move &middot; Space to attack &middot; Click to interact &middot; Scroll to zoom</p>
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
