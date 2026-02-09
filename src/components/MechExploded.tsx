'use client';

import { useEffect, useRef, useState } from 'react';
import type * as THREE_TYPES from 'three';

// ═══════════════════════════════════════════════════════════════
// MECH EXPLODED VIEW — ATLAS-7 ASSAULT MECH
// Technical Illustration with Line Drawing + Cross-Hatching
// ═══════════════════════════════════════════════════════════════

export default function MechExploded() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // Dynamic import Three.js
    let cleanup: (() => void) | null = null;

    (async () => {
      const THREE = await import('three');
      const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js');

      // RENDERER
      const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x0a0e14);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      container.appendChild(renderer.domElement);

      // SCENE
      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x0a0e14, 0.008);

      // CAMERA
      const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 200);
      camera.position.set(14, 10, 14);

      // CONTROLS
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.target.set(0, 3, 0);
      controls.minDistance = 5;
      controls.maxDistance = 40;
      controls.maxPolarAngle = Math.PI * 0.85;

      // LIGHTING — dramatic 3-point + accent
      const ambient = new THREE.AmbientLight(0x1a2a44, 0.8);
      scene.add(ambient);
      const key = new THREE.DirectionalLight(0xc8ddf8, 1.5);
      key.position.set(10, 20, 8); key.castShadow = true;
      key.shadow.mapSize.set(2048, 2048);
      key.shadow.camera.near = 0.5; key.shadow.camera.far = 50;
      key.shadow.camera.left = -15; key.shadow.camera.right = 15;
      key.shadow.camera.top = 15; key.shadow.camera.bottom = -15;
      scene.add(key);
      const fill = new THREE.DirectionalLight(0x4466aa, 0.4);
      fill.position.set(-8, 10, -6);
      scene.add(fill);
      const rim = new THREE.DirectionalLight(0x88aaff, 0.6);
      rim.position.set(-5, 5, -10);
      scene.add(rim);

      // GROUND — blueprint grid
      const gridHelper = new THREE.GridHelper(40, 80, 0x1a2a44, 0x0f1820);
      scene.add(gridHelper);
      const groundGeo = new THREE.PlaneGeometry(40, 40);
      const groundMat = new THREE.ShadowMaterial({ opacity: 0.3 });
      const ground = new THREE.Mesh(groundGeo, groundMat);
      ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true;
      scene.add(ground);

      // ═══════════════════════════════════════════════════════════════
      // MATERIALS
      // ═══════════════════════════════════════════════════════════════
      function mechMat(color: number, roughness = 0.6, metalness = 0.7) {
        return new THREE.MeshStandardMaterial({ color, roughness, metalness });
      }
      function glowMat(color: number, intensity = 0.8) {
        return new THREE.MeshStandardMaterial({
          color, emissive: color, emissiveIntensity: intensity,
          roughness: 0.2, metalness: 0.5
        });
      }

      const M = {
        frame: mechMat(0x3a4555, 0.7, 0.8),
        armor: mechMat(0x556677, 0.5, 0.6),
        dark: mechMat(0x1a2233, 0.8, 0.9),
        accent: mechMat(0x889aaa, 0.4, 0.7),
        joint: mechMat(0x2a3344, 0.6, 0.85),
        pipe: mechMat(0x445566, 0.3, 0.9),
        glow: glowMat(0x4488ff, 0.6),
        glowRed: glowMat(0xff3344, 0.5),
        glowGreen: glowMat(0x44ff88, 0.4),
        glowOrange: glowMat(0xff8844, 0.5),
        glass: new THREE.MeshStandardMaterial({
          color: 0x88ccff, roughness: 0.05, metalness: 0.1,
          transparent: true, opacity: 0.3
        }),
        wire: mechMat(0x667788, 0.9, 0.3),
        hatch: mechMat(0x4a5a6a, 0.75, 0.5),
      };

      // EDGE LINE MATERIAL
      const edgeMat = new THREE.LineBasicMaterial({
        color: 0x8ab4f8, transparent: true, opacity: 0.35
      });
      const edgeMatBright = new THREE.LineBasicMaterial({
        color: 0x8ab4f8, transparent: true, opacity: 0.7
      });

      // ═══════════════════════════════════════════════════════════════
      // GEOMETRY CACHE
      // ═══════════════════════════════════════════════════════════════
      const _gc: Record<string, THREE_TYPES.BufferGeometry> = {};
      function G(type: string, ...args: number[]): THREE_TYPES.BufferGeometry {
        const k = type + args.join(',');
        if (!_gc[k]) {
          if (type === 'box') _gc[k] = new THREE.BoxGeometry(args[0], args[1], args[2]);
          else if (type === 'cyl') _gc[k] = new THREE.CylinderGeometry(args[0], args[1], args[2], args[3] || 12);
          else if (type === 'sphere') _gc[k] = new THREE.SphereGeometry(args[0], args[1] || 12, args[2] || 8);
          else if (type === 'cone') _gc[k] = new THREE.ConeGeometry(args[0], args[1], args[2] || 12);
          else if (type === 'torus') _gc[k] = new THREE.TorusGeometry(args[0], args[1], args[2] || 8, args[3] || 24);
          else if (type === 'oct') _gc[k] = new THREE.OctahedronGeometry(args[0], args[1] || 0);
          else if (type === 'dodec') _gc[k] = new THREE.DodecahedronGeometry(args[0], args[1] || 0);
          else if (type === 'ico') _gc[k] = new THREE.IcosahedronGeometry(args[0], args[1] || 0);
        }
        return _gc[k];
      }

      // ═══════════════════════════════════════════════════════════════
      // PART SYSTEM
      // ═══════════════════════════════════════════════════════════════
      interface Part {
        group: THREE_TYPES.Group;
        edgeGroup: THREE_TYPES.Group;
        name: string;
        origin: THREE_TYPES.Vector3;
        explodeDir: THREE_TYPES.Vector3;
        explodeDist: number;
      }
      const parts: Part[] = [];

      function addPart(
        name: string,
        origin: THREE_TYPES.Vector3,
        explodeDir: THREE_TYPES.Vector3,
        explodeDist: number,
        buildFn: (g: THREE_TYPES.Group) => void
      ) {
        const group = new THREE.Group();
        group.position.copy(origin);
        buildFn(group);

        // Add edge lines for every mesh — technical illustration look
        const edgeGroup = new THREE.Group();
        group.traverse((child) => {
          if ((child as THREE_TYPES.Mesh).isMesh) {
            const mesh = child as THREE_TYPES.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            const edges = new THREE.EdgesGeometry(mesh.geometry, 20);
            const line = new THREE.LineSegments(edges, edgeMat.clone());
            line.position.copy(mesh.position);
            line.rotation.copy(mesh.rotation);
            line.scale.copy(mesh.scale);
            edgeGroup.add(line);
          }
        });
        group.add(edgeGroup);
        scene.add(group);
        parts.push({
          group, edgeGroup, name,
          origin: origin.clone(),
          explodeDir: explodeDir.clone().normalize(),
          explodeDist
        });
      }

      // Mesh helper
      function m(
        group: THREE_TYPES.Group,
        geometry: THREE_TYPES.BufferGeometry,
        material: THREE_TYPES.Material,
        pos?: number[],
        rot?: number[],
        scale?: number | number[]
      ): THREE_TYPES.Mesh {
        const mesh = new THREE.Mesh(geometry, material);
        if (pos) mesh.position.set(pos[0], pos[1], pos[2]);
        if (rot) mesh.rotation.set(rot[0], rot[1], rot[2]);
        if (scale) {
          if (typeof scale === 'number') mesh.scale.setScalar(scale);
          else mesh.scale.set(scale[0], scale[1], scale[2]);
        }
        group.add(mesh);
        return mesh;
      }

      // ═══════════════════════════════════════════════════════════════
      // BUILD ATLAS-7 MECH — 22 Component Groups
      // ═══════════════════════════════════════════════════════════════

      // ── TORSO CORE ──
      addPart('TORSO — PRIMARY FRAME', new THREE.Vector3(0, 3.5, 0), new THREE.Vector3(0, 0, 0), 0, (g) => {
        m(g, G('box', 2.0, 1.8, 1.2), M.frame, [0, 0, 0]);
        // Chest plating grooves
        m(g, G('box', 1.8, 0.08, 1.25), M.accent, [0, 0.5, 0]);
        m(g, G('box', 1.8, 0.08, 1.25), M.accent, [0, -0.5, 0]);
        m(g, G('box', 0.08, 1.6, 1.25), M.accent, [0.6, 0, 0]);
        m(g, G('box', 0.08, 1.6, 1.25), M.accent, [-0.6, 0, 0]);
        // Center reactor housing
        m(g, G('cyl', 0.3, 0.3, 0.4, 16), M.dark, [0, 0, 0.62], [Math.PI/2, 0, 0]);
        m(g, G('cyl', 0.2, 0.2, 0.1, 16), M.glow, [0, 0, 0.82], [Math.PI/2, 0, 0]);
        // Spine vertebrae
        for (let i = 0; i < 5; i++) {
          m(g, G('box', 0.5, 0.12, 0.4), M.joint, [0, -0.6 + i * 0.3, -0.55]);
        }
        // Internal ribcage structure
        for (let i = 0; i < 3; i++) {
          m(g, G('box', 1.6, 0.04, 0.08), M.hatch, [0, -0.3 + i * 0.3, 0.5]);
        }
        // Side vents
        for (const sx of [-1, 1]) {
          for (let i = 0; i < 3; i++) {
            m(g, G('box', 0.04, 0.15, 0.8), M.dark, [sx * 0.95, 0.1 + i * 0.2, 0]);
          }
        }
      });

      // ── TORSO UPPER ARMOR ──
      addPart('TORSO — UPPER ARMOR PLATE', new THREE.Vector3(0, 4.6, 0), new THREE.Vector3(0, 1, 0.3), 3, (g) => {
        m(g, G('box', 2.4, 0.5, 1.5), M.armor, [0, 0, 0]);
        // Collar ridges
        m(g, G('box', 1.0, 0.15, 0.3), M.dark, [0, 0.3, -0.5]);
        m(g, G('box', 0.3, 0.15, 1.0), M.dark, [0.9, 0.3, 0]);
        m(g, G('box', 0.3, 0.15, 1.0), M.dark, [-0.9, 0.3, 0]);
        // Ventilation slots
        for (let i = 0; i < 4; i++) {
          m(g, G('box', 0.25, 0.05, 0.08), M.dark, [-0.5 + i * 0.35, 0.26, 0.76]);
        }
        // Sub-plating detail
        m(g, G('box', 2.0, 0.08, 1.3), M.hatch, [0, -0.22, 0]);
        // Mounting bolts
        for (const sx of [-1, 1]) {
          for (const sz of [-1, 1]) {
            m(g, G('cyl', 0.04, 0.04, 0.08, 8), M.accent, [sx * 0.8, 0.26, sz * 0.5]);
          }
        }
      });

      // ── TORSO LOWER SKIRT ──
      addPart('TORSO — LOWER SKIRT ARMOR', new THREE.Vector3(0, 2.4, 0), new THREE.Vector3(0, -1, 0.2), 2.5, (g) => {
        m(g, G('box', 2.2, 0.6, 1.4), M.armor, [0, 0, 0]);
        // Hip joints housing
        m(g, G('cyl', 0.35, 0.35, 0.5, 12), M.joint, [0.8, 0, 0], [0, 0, Math.PI/2]);
        m(g, G('cyl', 0.35, 0.35, 0.5, 12), M.joint, [-0.8, 0, 0], [0, 0, Math.PI/2]);
        // Pelvis armor plates
        m(g, G('box', 0.8, 0.4, 0.2), M.dark, [0, -0.1, 0.8]);
        // Decorative rivets
        for (let i = 0; i < 6; i++) {
          m(g, G('cyl', 0.03, 0.03, 0.05, 6), M.accent, [-0.8 + i * 0.32, 0.31, 0.71]);
        }
      });

      // ── HEAD ──
      addPart('HEAD — SENSOR ARRAY', new THREE.Vector3(0, 5.5, 0), new THREE.Vector3(0, 1.5, 0), 3.5, (g) => {
        // Skull casing
        m(g, G('box', 0.9, 0.7, 0.8), M.frame, [0, 0, 0]);
        // Visor
        m(g, G('box', 0.85, 0.2, 0.1), M.glass, [0, 0.1, 0.42]);
        m(g, G('box', 0.85, 0.22, 0.02), M.glow, [0, 0.1, 0.47]);
        // Antenna
        m(g, G('cyl', 0.02, 0.02, 0.5, 6), M.pipe, [0.35, 0.55, -0.1]);
        m(g, G('cyl', 0.02, 0.02, 0.4, 6), M.pipe, [-0.35, 0.5, -0.1]);
        m(g, G('sphere', 0.04, 8, 6), M.glowRed, [0.35, 0.82, -0.1]);
        m(g, G('sphere', 0.04, 8, 6), M.glowGreen, [-0.35, 0.72, -0.1]);
        // Jaw
        m(g, G('box', 0.6, 0.15, 0.5), M.dark, [0, -0.35, 0.15]);
        // Side sensors
        for (const sx of [-1, 1]) {
          m(g, G('box', 0.15, 0.3, 0.4), M.accent, [sx * 0.52, 0.05, 0.1]);
          m(g, G('cyl', 0.05, 0.05, 0.2, 8), M.glow, [sx * 0.58, 0.15, 0.3], [Math.PI/2, 0, 0]);
        }
        // Top crest
        m(g, G('box', 0.15, 0.25, 0.6), M.armor, [0, 0.48, -0.05]);
        // Neck pistons
        m(g, G('cyl', 0.04, 0.04, 0.4, 6), M.pipe, [0.2, -0.5, 0]);
        m(g, G('cyl', 0.04, 0.04, 0.4, 6), M.pipe, [-0.2, -0.5, 0]);
      });

      // ── RIGHT SHOULDER ──
      addPart('RIGHT SHOULDER — MISSILE PAULDRON', new THREE.Vector3(1.6, 4.2, 0), new THREE.Vector3(1.5, 0.8, 0), 3, (g) => {
        m(g, G('box', 1.2, 0.8, 1.0), M.armor, [0, 0, 0]);
        m(g, G('box', 1.3, 0.12, 1.1), M.accent, [0, 0.35, 0]);
        m(g, G('box', 1.1, 0.12, 0.9), M.accent, [0, -0.35, 0]);
        // Missile pod — 6 tubes
        for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) {
          m(g, G('cyl', 0.08, 0.08, 0.3, 8), M.dark, [-0.2 + c * 0.2, 0.42 + r * 0.01, -0.15 + r * 0.3], [Math.PI/2, 0, 0]);
        }
        // Joint ball
        m(g, G('sphere', 0.25, 12, 8), M.joint, [-0.55, -0.1, 0]);
        // Armor edging detail
        m(g, G('box', 1.25, 0.04, 0.04), M.hatch, [0, 0, 0.52]);
        m(g, G('box', 1.25, 0.04, 0.04), M.hatch, [0, 0, -0.52]);
      });

      // ── LEFT SHOULDER ──
      addPart('LEFT SHOULDER — SHIELD PAULDRON', new THREE.Vector3(-1.6, 4.2, 0), new THREE.Vector3(-1.5, 0.8, 0), 3, (g) => {
        m(g, G('box', 1.2, 0.8, 1.0), M.armor, [0, 0, 0]);
        m(g, G('box', 1.3, 0.12, 1.1), M.accent, [0, 0.35, 0]);
        m(g, G('box', 1.1, 0.12, 0.9), M.accent, [0, -0.35, 0]);
        // Shield emitter array
        m(g, G('oct', 0.2, 0), M.glow, [0, 0, 0.55]);
        for (let i = 0; i < 4; i++) {
          const a = (i / 4) * Math.PI * 2;
          m(g, G('cyl', 0.03, 0.03, 0.25, 6), M.pipe, [Math.cos(a) * 0.3, Math.sin(a) * 0.3, 0.5], [Math.PI/2, 0, 0]);
        }
        m(g, G('sphere', 0.25, 12, 8), M.joint, [0.55, -0.1, 0]);
      });

      // ── RIGHT UPPER ARM ──
      addPart('RIGHT ARM — UPPER SEGMENT', new THREE.Vector3(2.3, 3.5, 0), new THREE.Vector3(2, 0.3, 0), 3.5, (g) => {
        m(g, G('box', 0.5, 1.4, 0.5), M.frame, [0, 0, 0]);
        // Hydraulic pistons
        m(g, G('cyl', 0.06, 0.06, 1.2, 8), M.pipe, [0.2, 0, 0.2]);
        m(g, G('cyl', 0.06, 0.06, 1.2, 8), M.pipe, [-0.2, 0, -0.2]);
        m(g, G('cyl', 0.04, 0.04, 0.8, 6), M.accent, [0.2, -0.15, -0.2]);
        m(g, G('box', 0.55, 1.0, 0.12), M.armor, [0, 0, 0.3]);
        m(g, G('sphere', 0.2, 10, 8), M.joint, [0, -0.75, 0]);
        // Cable wrap
        for (let i = 0; i < 4; i++) {
          m(g, G('torus', 0.28, 0.015, 6, 12), M.wire, [0, -0.5 + i * 0.3, 0]);
        }
      });

      // ── LEFT UPPER ARM ──
      addPart('LEFT ARM — UPPER SEGMENT', new THREE.Vector3(-2.3, 3.5, 0), new THREE.Vector3(-2, 0.3, 0), 3.5, (g) => {
        m(g, G('box', 0.5, 1.4, 0.5), M.frame, [0, 0, 0]);
        m(g, G('cyl', 0.06, 0.06, 1.2, 8), M.pipe, [0.2, 0, 0.2]);
        m(g, G('cyl', 0.06, 0.06, 1.2, 8), M.pipe, [-0.2, 0, -0.2]);
        m(g, G('box', 0.55, 1.0, 0.12), M.armor, [0, 0, 0.3]);
        m(g, G('sphere', 0.2, 10, 8), M.joint, [0, -0.75, 0]);
        // Cable wrap
        for (let i = 0; i < 4; i++) {
          m(g, G('torus', 0.28, 0.015, 6, 12), M.wire, [0, -0.5 + i * 0.3, 0]);
        }
      });

      // ── RIGHT FOREARM + GAUSS CANNON ──
      addPart('RIGHT ARM — GAUSS CANNON', new THREE.Vector3(2.3, 2.2, 0), new THREE.Vector3(2.5, -0.5, 0.5), 4, (g) => {
        m(g, G('box', 0.5, 1.2, 0.5), M.frame, [0, 0, 0]);
        // Gauss cannon barrel assembly
        m(g, G('cyl', 0.18, 0.12, 1.8, 12), M.dark, [0, 0, 1.1], [Math.PI/2, 0, 0]);
        m(g, G('cyl', 0.22, 0.22, 0.3, 12), M.frame, [0, 0, 0.3], [Math.PI/2, 0, 0]);
        m(g, G('cyl', 0.15, 0.1, 0.5, 12), M.accent, [0, 0, 1.8], [Math.PI/2, 0, 0]);
        // Barrel rings
        for (let i = 0; i < 4; i++) {
          m(g, G('torus', 0.16, 0.02, 8, 16), M.accent, [0, 0, 0.5 + i * 0.35], [Math.PI/2, 0, 0]);
        }
        // Muzzle glow
        m(g, G('cyl', 0.1, 0.1, 0.05, 12), M.glow, [0, 0, 2.02], [Math.PI/2, 0, 0]);
        // Ammo feed
        m(g, G('cyl', 0.08, 0.08, 0.8, 8), M.pipe, [0.25, 0.1, 0.4], [0.3, 0, 0.2]);
        // Hand guard
        m(g, G('box', 0.15, 0.4, 0.3), M.armor, [0, -0.4, 0.2]);
        // Targeting reticle
        m(g, G('cyl', 0.04, 0.04, 0.6, 6), M.pipe, [0.15, 0.2, 1.0], [Math.PI/2, 0, 0]);
        m(g, G('sphere', 0.03, 6), M.glowRed, [0.15, 0.2, 1.35]);
      });

      // ── LEFT FOREARM + SHIELD PROJECTOR ──
      addPart('LEFT ARM — ENERGY SHIELD PROJECTOR', new THREE.Vector3(-2.3, 2.2, 0), new THREE.Vector3(-2.5, -0.5, 0.5), 4, (g) => {
        m(g, G('box', 0.5, 1.2, 0.5), M.frame, [0, 0, 0]);
        // Shield projector — partial sphere
        m(g, G('sphere', 0.5, 16, 8), M.accent, [0, 0, 0.5], [0, 0, 0], [1, 1, 0.5]);
        m(g, G('cyl', 0.15, 0.15, 0.3, 12), M.glow, [0, 0, 0.5], [Math.PI/2, 0, 0]);
        // Energy conduits
        for (let i = 0; i < 3; i++) {
          const a = (i / 3) * Math.PI * 2 - Math.PI/2;
          m(g, G('cyl', 0.04, 0.04, 0.6, 6), M.pipe, [Math.cos(a) * 0.25, Math.sin(a) * 0.25, 0.2], [Math.PI/2, 0, 0]);
        }
        // Wrist joint
        m(g, G('cyl', 0.15, 0.15, 0.2, 10), M.joint, [0, -0.6, 0], [0, 0, Math.PI/2]);
        // Fingers / clamp
        for (const sx of [-0.15, 0, 0.15]) {
          m(g, G('box', 0.06, 0.3, 0.06), M.dark, [sx, -0.85, 0.1]);
        }
        // Shield energy ring
        m(g, G('torus', 0.4, 0.02, 8, 24), M.glow, [0, 0, 0.65], [Math.PI/2, 0, 0]);
      });

      // ── RIGHT THIGH ──
      addPart('RIGHT LEG — THIGH', new THREE.Vector3(0.8, 1.5, 0), new THREE.Vector3(1, -1, 0.3), 3, (g) => {
        m(g, G('box', 0.65, 1.6, 0.65), M.frame, [0, 0, 0]);
        m(g, G('box', 0.7, 1.2, 0.15), M.armor, [0, 0, 0.38]);
        m(g, G('box', 0.15, 1.2, 0.7), M.armor, [0.38, 0, 0]);
        m(g, G('cyl', 0.07, 0.07, 1.4, 8), M.pipe, [0.25, 0, -0.25]);
        m(g, G('cyl', 0.05, 0.05, 1.0, 6), M.accent, [-0.25, 0, 0.25]);
        // Knee joint assembly
        m(g, G('sphere', 0.22, 10, 8), M.joint, [0, -0.85, 0]);
        m(g, G('cyl', 0.25, 0.25, 0.2, 10), M.joint, [0, -0.85, 0], [0, 0, Math.PI/2]);
        // Piston detail
        m(g, G('cyl', 0.03, 0.03, 1.2, 6), M.wire, [0.28, 0, 0.28]);
      });

      // ── LEFT THIGH ──
      addPart('LEFT LEG — THIGH', new THREE.Vector3(-0.8, 1.5, 0), new THREE.Vector3(-1, -1, 0.3), 3, (g) => {
        m(g, G('box', 0.65, 1.6, 0.65), M.frame, [0, 0, 0]);
        m(g, G('box', 0.7, 1.2, 0.15), M.armor, [0, 0, 0.38]);
        m(g, G('box', 0.15, 1.2, 0.7), M.armor, [-0.38, 0, 0]);
        m(g, G('cyl', 0.07, 0.07, 1.4, 8), M.pipe, [-0.25, 0, -0.25]);
        m(g, G('cyl', 0.05, 0.05, 1.0, 6), M.accent, [0.25, 0, 0.25]);
        m(g, G('sphere', 0.22, 10, 8), M.joint, [0, -0.85, 0]);
        m(g, G('cyl', 0.25, 0.25, 0.2, 10), M.joint, [0, -0.85, 0], [0, 0, Math.PI/2]);
        m(g, G('cyl', 0.03, 0.03, 1.2, 6), M.wire, [-0.28, 0, 0.28]);
      });

      // ── RIGHT SHIN ──
      addPart('RIGHT LEG — SHIN', new THREE.Vector3(0.8, 0.3, 0.15), new THREE.Vector3(1.2, -1.5, 0.5), 3.5, (g) => {
        m(g, G('box', 0.55, 1.4, 0.55), M.frame, [0, 0, 0]);
        m(g, G('box', 0.6, 1.2, 0.12), M.armor, [0, 0.05, 0.32]);
        // Thruster nozzle
        m(g, G('cyl', 0.2, 0.12, 0.3, 10), M.dark, [0, -0.2, -0.35], [Math.PI * 0.4, 0, 0]);
        m(g, G('cyl', 0.1, 0.1, 0.05, 8), M.glowRed, [0, -0.35, -0.48], [Math.PI * 0.4, 0, 0]);
        // Cable runs
        for (let i = 0; i < 3; i++) {
          m(g, G('cyl', 0.03, 0.03, 1.0, 6), M.wire, [0.22, i * 0.02, -0.18 + i * 0.08]);
        }
        // Shin guard bolts
        for (let i = 0; i < 3; i++) {
          m(g, G('cyl', 0.03, 0.03, 0.06, 6), M.accent, [0.22, -0.3 + i * 0.3, 0.38]);
        }
      });

      // ── LEFT SHIN ──
      addPart('LEFT LEG — SHIN', new THREE.Vector3(-0.8, 0.3, 0.15), new THREE.Vector3(-1.2, -1.5, 0.5), 3.5, (g) => {
        m(g, G('box', 0.55, 1.4, 0.55), M.frame, [0, 0, 0]);
        m(g, G('box', 0.6, 1.2, 0.12), M.armor, [0, 0.05, 0.32]);
        m(g, G('cyl', 0.2, 0.12, 0.3, 10), M.dark, [0, -0.2, -0.35], [Math.PI * 0.4, 0, 0]);
        m(g, G('cyl', 0.1, 0.1, 0.05, 8), M.glowRed, [0, -0.35, -0.48], [Math.PI * 0.4, 0, 0]);
        for (let i = 0; i < 3; i++) {
          m(g, G('cyl', 0.03, 0.03, 1.0, 6), M.wire, [-0.22, i * 0.02, -0.18 + i * 0.08]);
        }
      });

      // ── RIGHT FOOT ──
      addPart('RIGHT FOOT — STABILIZER', new THREE.Vector3(0.8, -0.5, 0.2), new THREE.Vector3(1, -2, 0.8), 3, (g) => {
        m(g, G('box', 0.7, 0.25, 1.0), M.frame, [0, 0, 0.1]);
        m(g, G('box', 0.65, 0.3, 0.5), M.armor, [0, 0.05, -0.15]);
        // Toe claws
        for (const tx of [-0.2, 0, 0.2]) {
          m(g, G('box', 0.12, 0.15, 0.2), M.dark, [tx, -0.08, 0.55]);
        }
        m(g, G('cyl', 0.1, 0.06, 0.15, 8), M.joint, [0, -0.1, -0.4]);
        m(g, G('sphere', 0.15, 8, 6), M.joint, [0, 0.2, -0.1]);
        // Magnetic grip pads
        m(g, G('cyl', 0.08, 0.08, 0.03, 8), M.glow, [-0.15, -0.13, 0.3]);
        m(g, G('cyl', 0.08, 0.08, 0.03, 8), M.glow, [0.15, -0.13, 0.3]);
      });

      // ── LEFT FOOT ──
      addPart('LEFT FOOT — STABILIZER', new THREE.Vector3(-0.8, -0.5, 0.2), new THREE.Vector3(-1, -2, 0.8), 3, (g) => {
        m(g, G('box', 0.7, 0.25, 1.0), M.frame, [0, 0, 0.1]);
        m(g, G('box', 0.65, 0.3, 0.5), M.armor, [0, 0.05, -0.15]);
        for (const tx of [-0.2, 0, 0.2]) {
          m(g, G('box', 0.12, 0.15, 0.2), M.dark, [tx, -0.08, 0.55]);
        }
        m(g, G('cyl', 0.1, 0.06, 0.15, 8), M.joint, [0, -0.1, -0.4]);
        m(g, G('sphere', 0.15, 8, 6), M.joint, [0, 0.2, -0.1]);
        m(g, G('cyl', 0.08, 0.08, 0.03, 8), M.glow, [-0.15, -0.13, 0.3]);
        m(g, G('cyl', 0.08, 0.08, 0.03, 8), M.glow, [0.15, -0.13, 0.3]);
      });

      // ── BACKPACK REACTOR ──
      addPart('BACKPACK — FUSION REACTOR', new THREE.Vector3(0, 3.8, -1.0), new THREE.Vector3(0, 0.5, -2), 4, (g) => {
        m(g, G('box', 1.5, 1.5, 0.8), M.dark, [0, 0, 0]);
        // Reactor core — glowing
        m(g, G('cyl', 0.3, 0.3, 0.85, 16), M.glow, [0, 0, 0]);
        // Heat sink radiator fins
        for (let i = 0; i < 5; i++) {
          m(g, G('box', 1.6, 0.03, 0.6), M.accent, [0, -0.5 + i * 0.25, -0.35]);
        }
        // Exhaust ports
        for (const sy of [-0.4, 0.4]) {
          m(g, G('cyl', 0.15, 0.2, 0.3, 10), M.frame, [0.6, sy, -0.3], [Math.PI/2, 0, 0]);
          m(g, G('cyl', 0.15, 0.2, 0.3, 10), M.frame, [-0.6, sy, -0.3], [Math.PI/2, 0, 0]);
          m(g, G('cyl', 0.1, 0.1, 0.05, 8), M.glowOrange, [0.6, sy, -0.48], [Math.PI/2, 0, 0]);
          m(g, G('cyl', 0.1, 0.1, 0.05, 8), M.glowOrange, [-0.6, sy, -0.48], [Math.PI/2, 0, 0]);
        }
        // Power cables
        m(g, G('cyl', 0.05, 0.05, 0.6, 6), M.pipe, [0.3, 0.3, 0.5]);
        m(g, G('cyl', 0.05, 0.05, 0.6, 6), M.pipe, [-0.3, 0.3, 0.5]);
        // Coolant pipes
        m(g, G('cyl', 0.04, 0.04, 1.2, 6), M.pipe, [0.6, 0, 0.1], [0, 0, 0.3]);
        m(g, G('cyl', 0.04, 0.04, 1.2, 6), M.pipe, [-0.6, 0, 0.1], [0, 0, -0.3]);
      });

      // ── LEFT WING THRUSTER ──
      addPart('LEFT WING — THRUSTER NACELLE', new THREE.Vector3(-1.8, 4.0, -0.8), new THREE.Vector3(-2, 0.5, -1.5), 4.5, (g) => {
        m(g, G('box', 0.3, 0.6, 1.5), M.frame, [0, 0, 0]);
        m(g, G('box', 0.35, 0.15, 1.6), M.armor, [0, 0.3, 0]);
        m(g, G('cyl', 0.2, 0.12, 0.5, 10), M.dark, [0, 0, -0.9], [Math.PI/2, 0, 0]);
        m(g, G('cyl', 0.12, 0.12, 0.1, 8), M.glow, [0, 0, -1.18], [Math.PI/2, 0, 0]);
        m(g, G('cyl', 0.15, 0.2, 0.3, 10), M.accent, [0, 0, 0.8], [Math.PI/2, 0, 0]);
        m(g, G('box', 0.08, 0.08, 0.5), M.pipe, [0, -0.2, 0.3]);
        // Winglet
        m(g, G('box', 0.6, 0.04, 0.4), M.armor, [-0.2, 0.08, -0.3]);
      });

      // ── RIGHT WING THRUSTER ──
      addPart('RIGHT WING — THRUSTER NACELLE', new THREE.Vector3(1.8, 4.0, -0.8), new THREE.Vector3(2, 0.5, -1.5), 4.5, (g) => {
        m(g, G('box', 0.3, 0.6, 1.5), M.frame, [0, 0, 0]);
        m(g, G('box', 0.35, 0.15, 1.6), M.armor, [0, 0.3, 0]);
        m(g, G('cyl', 0.2, 0.12, 0.5, 10), M.dark, [0, 0, -0.9], [Math.PI/2, 0, 0]);
        m(g, G('cyl', 0.12, 0.12, 0.1, 8), M.glow, [0, 0, -1.18], [Math.PI/2, 0, 0]);
        m(g, G('cyl', 0.15, 0.2, 0.3, 10), M.accent, [0, 0, 0.8], [Math.PI/2, 0, 0]);
        m(g, G('box', 0.08, 0.08, 0.5), M.pipe, [0, -0.2, 0.3]);
        m(g, G('box', 0.6, 0.04, 0.4), M.armor, [0.2, 0.08, -0.3]);
      });

      // ── DORSAL ROTARY CANNON ──
      addPart('DORSAL — ROTARY CANNON', new THREE.Vector3(0.6, 5.3, -0.6), new THREE.Vector3(0.8, 1.5, -1), 4, (g) => {
        // Mount arm
        m(g, G('box', 0.15, 0.4, 0.15), M.frame, [0, -0.3, 0.2]);
        // Cannon housing
        m(g, G('cyl', 0.15, 0.15, 0.8, 10), M.dark, [0, 0, 0], [Math.PI/2, 0, 0]);
        // Rotating barrels (6)
        for (let i = 0; i < 6; i++) {
          const a = (i / 6) * Math.PI * 2;
          m(g, G('cyl', 0.025, 0.025, 1.0, 6), M.pipe, [Math.cos(a) * 0.08, Math.sin(a) * 0.08, 0.5], [Math.PI/2, 0, 0]);
        }
        // Barrel shroud
        m(g, G('cyl', 0.12, 0.1, 0.15, 10), M.accent, [0, 0, 0.95], [Math.PI/2, 0, 0]);
        m(g, G('cyl', 0.06, 0.06, 0.02, 8), M.glowRed, [0, 0, 1.05], [Math.PI/2, 0, 0]);
        // Ammo drum
        m(g, G('cyl', 0.12, 0.12, 0.3, 10), M.dark, [0.2, -0.1, -0.2]);
      });

      // Update stats display
      let totalTris = 0;
      scene.traverse((c) => {
        const mesh = c as THREE_TYPES.Mesh;
        if (mesh.isMesh && mesh.geometry) {
          totalTris += (mesh.geometry.index
            ? mesh.geometry.index.count / 3
            : mesh.geometry.attributes.position.count / 3);
        }
      });

      // ═══════════════════════════════════════════════════════════════
      // STATE
      // ═══════════════════════════════════════════════════════════════
      let explodeAmount = 0;
      let targetExplode = 0;
      let wireframeMode = false;
      let xrayMode = false;
      let autoSpin = false;
      let hoveredPart: Part | null = null;

      // ═══════════════════════════════════════════════════════════════
      // RAYCASTING FOR PART HOVER
      // ═══════════════════════════════════════════════════════════════
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      function onMouseMove(event: MouseEvent) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      }
      window.addEventListener('mousemove', onMouseMove);

      // ═══════════════════════════════════════════════════════════════
      // DOM UPDATES — wire up buttons via DOM after render
      // ═══════════════════════════════════════════════════════════════
      function updatePartCount() {
        const el = document.getElementById('mech-part-count');
        if (el) el.textContent = String(parts.length);
        const el2 = document.getElementById('mech-tri-count');
        if (el2) el2.textContent = Math.round(totalTris).toLocaleString();
      }
      updatePartCount();

      // Button/slider event hookups
      function setupUI() {
        const btnAssembled = document.getElementById('mech-btn-assembled');
        const btnExploded = document.getElementById('mech-btn-exploded');
        const btnWireframe = document.getElementById('mech-btn-wireframe');
        const btnXray = document.getElementById('mech-btn-xray');
        const btnSpin = document.getElementById('mech-btn-spin');
        const slider = document.getElementById('mech-sep-slider') as HTMLInputElement | null;

        function updateBtnStates() {
          [btnAssembled, btnExploded, btnWireframe, btnXray, btnSpin].forEach(b => {
            if (b) b.style.background = 'rgba(138,180,248,0.08)';
          });
          if (targetExplode === 0 && btnAssembled) btnAssembled.style.background = 'rgba(138,180,248,0.2)';
          if (targetExplode === 1 && btnExploded) btnExploded.style.background = 'rgba(138,180,248,0.2)';
          if (wireframeMode && btnWireframe) btnWireframe.style.background = 'rgba(138,180,248,0.2)';
          if (xrayMode && btnXray) btnXray.style.background = 'rgba(138,180,248,0.2)';
          if (autoSpin && btnSpin) btnSpin.style.background = 'rgba(138,180,248,0.2)';
        }

        if (btnAssembled) btnAssembled.onclick = () => {
          targetExplode = 0;
          if (slider) slider.value = '0';
          updateBtnStates();
        };
        if (btnExploded) btnExploded.onclick = () => {
          targetExplode = 1;
          if (slider) slider.value = '100';
          updateBtnStates();
        };
        if (btnWireframe) btnWireframe.onclick = () => {
          wireframeMode = !wireframeMode;
          parts.forEach(p => {
            p.group.traverse(c => {
              const mesh = c as THREE_TYPES.Mesh;
              if (mesh.isMesh && mesh.material) (mesh.material as THREE_TYPES.MeshStandardMaterial).wireframe = wireframeMode;
            });
            p.edgeGroup.visible = !wireframeMode;
          });
          updateBtnStates();
        };
        if (btnXray) btnXray.onclick = () => {
          xrayMode = !xrayMode;
          parts.forEach(p => {
            p.group.traverse(c => {
              const mesh = c as THREE_TYPES.Mesh;
              if (mesh.isMesh && mesh.material) {
                const mat = mesh.material as THREE_TYPES.MeshStandardMaterial;
                if (!mat.emissive || mat.emissive.getHex() === 0) {
                  mat.transparent = xrayMode;
                  mat.opacity = xrayMode ? 0.15 : 1;
                }
              }
            });
            p.edgeGroup.traverse(c => {
              const line = c as THREE_TYPES.LineSegments;
              if (line.isLineSegments) {
                (line.material as THREE_TYPES.LineBasicMaterial).opacity = xrayMode ? 0.8 : 0.35;
              }
            });
          });
          updateBtnStates();
        };
        if (btnSpin) btnSpin.onclick = () => {
          autoSpin = !autoSpin;
          updateBtnStates();
        };
        if (slider) slider.oninput = () => {
          targetExplode = parseInt(slider.value) / 100;
        };

        updateBtnStates();
      }
      // Small delay to let React render the DOM
      setTimeout(setupUI, 100);

      // ═══════════════════════════════════════════════════════════════
      // RENDER LOOP
      // ═══════════════════════════════════════════════════════════════
      const clock = new THREE.Clock();
      let animId = 0;

      function animate() {
        animId = requestAnimationFrame(animate);
        const dt = Math.min(clock.getDelta(), 0.05);
        const t = clock.elapsedTime;

        // Smooth explode interpolation
        explodeAmount += (targetExplode - explodeAmount) * 3 * dt;

        // Position parts
        parts.forEach(p => {
          const offset = p.explodeDir.clone().multiplyScalar(p.explodeDist * explodeAmount);
          p.group.position.copy(p.origin).add(offset);
        });

        // Auto spin
        controls.autoRotate = autoSpin;
        controls.autoRotateSpeed = 1.5;

        // Glow pulse
        const pulse = 0.5 + Math.sin(t * 2) * 0.3;
        M.glow.emissiveIntensity = 0.4 + pulse * 0.4;
        M.glowRed.emissiveIntensity = 0.3 + pulse * 0.3;
        M.glowGreen.emissiveIntensity = 0.3 + Math.sin(t * 3) * 0.2;
        M.glowOrange.emissiveIntensity = 0.3 + pulse * 0.25;

        // Raycasting for part hover label
        raycaster.setFromCamera(mouse, camera);
        const allMeshes: THREE_TYPES.Mesh[] = [];
        parts.forEach(p => {
          p.group.traverse(c => {
            if ((c as THREE_TYPES.Mesh).isMesh) allMeshes.push(c as THREE_TYPES.Mesh);
          });
        });
        const intersects = raycaster.intersectObjects(allMeshes, false);
        const labelEl = document.getElementById('mech-part-label');
        if (intersects.length > 0) {
          // Find which part this mesh belongs to
          let found: Part | null = null;
          for (const p of parts) {
            let match = false;
            p.group.traverse(c => { if (c === intersects[0].object) match = true; });
            if (match) { found = p; break; }
          }
          if (found && found !== hoveredPart) {
            hoveredPart = found;
            if (labelEl) {
              labelEl.textContent = found.name;
              labelEl.style.opacity = '1';
            }
          }
        } else {
          if (hoveredPart) {
            hoveredPart = null;
            if (labelEl) labelEl.style.opacity = '0';
          }
        }

        controls.update();
        renderer.render(scene, camera);
      }

      animate();
      setLoaded(true);

      // Resize handler
      function onResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
      window.addEventListener('resize', onResize);

      // Cleanup
      cleanup = () => {
        cancelAnimationFrame(animId);
        window.removeEventListener('resize', onResize);
        window.removeEventListener('mousemove', onMouseMove);
        controls.dispose();
        renderer.dispose();
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      };
    })();

    return () => { if (cleanup) cleanup(); };
  }, []);

  return (
    <div className="relative w-full h-screen bg-[#0a0e14]">
      <div ref={containerRef} className="absolute inset-0" />

      <div className="absolute inset-0 pointer-events-none z-10" style={{ fontFamily: "'Courier New', monospace", color: '#8ab4f8' }}>
        <div className="absolute top-6 sm:top-8 left-6 sm:left-10">
          <div style={{ fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', opacity: 0.4 }}>
            TARTARY HEAVY INDUSTRIES — TECHNICAL DIVISION
          </div>
          <h1 style={{ fontSize: '24px', letterSpacing: '0.15em', fontWeight: 300, color: '#c8ddf8', margin: '4px 0' }}>
            ATLAS-7 ASSAULT MECH
          </h1>
          <div style={{ fontSize: '10px', letterSpacing: '0.4em', textTransform: 'uppercase', opacity: 0.35 }}>
            EXPLODED ASSEMBLY VIEW — CLASSIFIED
          </div>
        </div>

        <div className="absolute top-6 sm:top-8 right-6 sm:right-10 text-right" style={{ fontSize: '10px', letterSpacing: '0.2em', opacity: 0.4 }}>
          DRAG TO ROTATE<br />
          SCROLL TO ZOOM<br /><br />
          COMPONENTS: <span id="mech-part-count">0</span><br />
          TRIANGLES: <span id="mech-tri-count">0</span>
        </div>

        <div
          id="mech-part-label"
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            bottom: '80px',
            fontSize: '12px', letterSpacing: '0.25em', textTransform: 'uppercase',
            opacity: 0, transition: 'opacity 0.4s',
            background: 'rgba(10,14,20,0.8)',
            padding: '6px 16px',
            border: '1px solid rgba(138,180,248,0.15)',
          }}
        />

        <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3 pointer-events-auto">
          {[
            { id: 'mech-btn-assembled', label: 'ASSEMBLED' },
            { id: 'mech-btn-exploded', label: 'EXPLODED' },
            { id: 'mech-btn-wireframe', label: 'WIREFRAME' },
            { id: 'mech-btn-xray', label: 'X-RAY' },
            { id: 'mech-btn-spin', label: 'AUTO-SPIN' },
          ].map(btn => (
            <button
              key={btn.id}
              id={btn.id}
              style={{
                background: 'rgba(138,180,248,0.08)',
                border: '1px solid rgba(138,180,248,0.2)',
                color: '#8ab4f8',
                padding: '8px 14px',
                fontFamily: "'Courier New', monospace",
                fontSize: '10px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase' as const,
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>

        <div className="absolute bottom-6 sm:bottom-8 right-6 sm:right-10 flex items-center gap-2 pointer-events-auto">
          <label style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.5 }}>Separation</label>
          <input
            id="mech-sep-slider"
            type="range"
            min="0"
            max="100"
            defaultValue="0"
            style={{ width: '100px' }}
          />
        </div>
      </div>

      {!loaded && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#0a0e14]">
          <div className="text-center">
            <p style={{ fontFamily: "'Courier New', monospace", color: '#8ab4f8', fontSize: '11px', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
              INITIALIZING SYSTEMS...
            </p>
            <div className="w-48 h-[1px] bg-white/10 mx-auto mt-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 h-full w-1/3 bg-blue-400 animate-pulse" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
