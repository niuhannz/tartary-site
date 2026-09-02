"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import type { UniverseMarker } from "@/lib/siteContent";

/* ═══════════════════════════════════════════════════════════════════
   ThreeScene — sandbox-style universe shelf.
   Each IP is a floating tabletop diorama (a terrain mini-scene on a
   pedestal) arranged across a shared display shelf. No react-three-fiber.
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
  ctx.shadowBlur = 30;
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

function makeGlowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.28, "rgba(255,255,255,0.55)");
  g.addColorStop(0.6, "rgba(255,255,255,0.12)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/* ── terrain builders (add meshes into a local group, y grows up from 0) ── */
function buildTerrain(
  terrain: UniverseMarker["terrain"],
  size: number,
  base: THREE.Color,
  ridge: THREE.Color,
  glow: THREE.Color,
  water: THREE.Color
): THREE.Group {
  const g = new THREE.Group();

  const ridgeMat = new THREE.MeshStandardMaterial({
    color: ridge,
    roughness: 0.9,
    metalness: 0.05,
    emissive: glow,
    emissiveIntensity: 0.14,
    flatShading: true,
  });
  const groundMat = new THREE.MeshStandardMaterial({
    color: base,
    roughness: 0.92,
    metalness: 0.05,
    emissive: base,
    emissiveIntensity: 0.08,
  });

  if (terrain === "mountains") {
    const snowMat = new THREE.MeshStandardMaterial({
      color: 0xdfe4ea,
      roughness: 0.65,
      emissive: 0x8899aa,
      emissiveIntensity: 0.06,
      flatShading: true,
    });
    const peaks = 5 + Math.floor(size * 2);
    for (let i = 0; i < peaks; i++) {
      const h = size * (0.3 + Math.random() * 0.6);
      const r = size * (0.14 + Math.random() * 0.1);
      const cone = new THREE.Mesh(new THREE.ConeGeometry(r, h, 6), ridgeMat);
      const ang = (i / peaks) * Math.PI * 2 + Math.random() * 0.6;
      const dist = size * (0.16 + Math.random() * 0.48);
      cone.position.set(Math.cos(ang) * dist, h / 2, Math.sin(ang) * dist);
      cone.rotation.y = Math.random() * Math.PI;
      g.add(cone);
      if (h > size * 0.55) {
        const cap = new THREE.Mesh(new THREE.ConeGeometry(r * 0.45, h * 0.32, 6), snowMat);
        cap.position.y = h * 0.28;
        cone.add(cap);
      }
    }
  } else if (terrain === "plains") {
    const mounds = 6;
    for (let i = 0; i < mounds; i++) {
      const r = size * (0.2 + Math.random() * 0.24);
      const mound = new THREE.Mesh(new THREE.SphereGeometry(r, 16, 12), ridgeMat);
      mound.scale.y = 0.34 + Math.random() * 0.3;
      const ang = (i / mounds) * Math.PI * 2 + Math.random();
      const dist = size * (0.18 + Math.random() * 0.45);
      mound.position.set(Math.cos(ang) * dist, r * 0.14, Math.sin(ang) * dist);
      g.add(mound);
    }
  } else if (terrain === "marsh") {
    const ground = new THREE.Mesh(
      new THREE.CylinderGeometry(size * 0.82, size * 0.82, size * 0.07, 40),
      groundMat
    );
    ground.position.y = size * 0.03;
    g.add(ground);

    const waterMat = new THREE.MeshStandardMaterial({
      color: water,
      roughness: 0.08,
      metalness: 0.6,
      transparent: true,
      opacity: 0.88,
      emissive: water,
      emissiveIntensity: 0.18,
    });
    for (let i = 0; i < 4; i++) {
      const wr = size * (0.18 + Math.random() * 0.24);
      const pool = new THREE.Mesh(new THREE.CylinderGeometry(wr, wr, size * 0.02, 32), waterMat);
      const ang = (i / 4) * Math.PI * 2 + Math.random() * 0.8;
      const dist = size * (0.12 + Math.random() * 0.4);
      pool.position.set(Math.cos(ang) * dist, size * 0.07, Math.sin(ang) * dist);
      g.add(pool);
    }

    const reedMat = new THREE.MeshStandardMaterial({
      color: ridge,
      roughness: 0.8,
      emissive: glow,
      emissiveIntensity: 0.18,
    });
    for (let i = 0; i < 15; i++) {
      const rh = size * (0.24 + Math.random() * 0.34);
      const reed = new THREE.Mesh(
        new THREE.CylinderGeometry(size * 0.008, size * 0.012, rh, 5),
        reedMat
      );
      const ang = Math.random() * Math.PI * 2;
      const dist = size * (0.1 + Math.random() * 0.55);
      reed.position.set(Math.cos(ang) * dist, rh / 2 + size * 0.05, Math.sin(ang) * dist);
      reed.rotation.z = (Math.random() - 0.5) * 0.25;
      reed.rotation.x = (Math.random() - 0.5) * 0.25;
      g.add(reed);
    }
  } else if (terrain === "coast") {
    // ground slab shifted toward -x, sea covering the +x side
    const ground = new THREE.Mesh(
      new THREE.CylinderGeometry(size * 0.85, size * 0.85, size * 0.08, 48),
      groundMat
    );
    ground.position.set(-size * 0.18, size * 0.04, 0);
    g.add(ground);

    const seaMat = new THREE.MeshStandardMaterial({
      color: water,
      roughness: 0.05,
      metalness: 0.65,
      transparent: true,
      opacity: 0.9,
      emissive: water,
      emissiveIntensity: 0.22,
    });
    const sea = new THREE.Mesh(
      new THREE.CylinderGeometry(size * 0.55, size * 0.55, size * 0.02, 40),
      seaMat
    );
    sea.position.set(size * 0.42, size * 0.05, 0);
    g.add(sea);

    const rockMat = new THREE.MeshStandardMaterial({
      color: ridge,
      roughness: 0.85,
      emissive: glow,
      emissiveIntensity: 0.16,
      flatShading: true,
    });
    for (let i = 0; i < 6; i++) {
      const r = size * (0.06 + Math.random() * 0.09);
      const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(r, 0), rockMat);
      const ang = Math.random() * Math.PI * 2;
      const dist = size * (0.15 + Math.random() * 0.55);
      rock.position.set(Math.cos(ang) * dist - size * 0.05, r * 0.6, Math.sin(ang) * dist);
      rock.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      g.add(rock);
    }
  } else {
    // city — a cluster of towers with lit caps
    const towerMat = new THREE.MeshStandardMaterial({
      color: base,
      roughness: 0.65,
      metalness: 0.35,
      emissive: base,
      emissiveIntensity: 0.12,
    });
    const accentMat = new THREE.MeshStandardMaterial({
      color: ridge,
      roughness: 0.5,
      metalness: 0.2,
      emissive: glow,
      emissiveIntensity: 0.5,
    });
    const towers = 8;
    for (let i = 0; i < towers; i++) {
      const h = size * (0.22 + Math.random() * 0.58);
      const w = size * (0.08 + Math.random() * 0.09);
      const tower = new THREE.Mesh(new THREE.BoxGeometry(w, h, w), towerMat);
      const ang = (i / towers) * Math.PI * 2 + Math.random() * 0.5;
      const dist = size * (0.14 + Math.random() * 0.5);
      tower.position.set(Math.cos(ang) * dist, h / 2, Math.sin(ang) * dist);
      tower.rotation.y = Math.random() * Math.PI;
      g.add(tower);
      if (Math.random() > 0.45) {
        const cap = new THREE.Mesh(new THREE.BoxGeometry(w * 0.5, size * 0.05, w * 0.5), accentMat);
        cap.position.y = h / 2 + size * 0.025;
        tower.add(cap);
      }
    }
  }

  return g;
}

/* ── build one diorama: pedestal + terrain + beacon + glow + label + hit ── */
function buildDiorama(marker: UniverseMarker, glowTex: THREE.Texture) {
  const { palette, size, terrain, kind } = marker;
  const base = new THREE.Color(palette.base);
  const ridge = new THREE.Color(palette.ridge);
  const glow = new THREE.Color(palette.glow);
  const water = new THREE.Color(palette.water ?? palette.base);

  const group = new THREE.Group();
  group.position.set(marker.x, 0, marker.z);

  const plinthR = size * 0.95;
  const plinthH = size * 0.34;

  // pedestal block
  const plinthMat = new THREE.MeshStandardMaterial({
    color: base,
    roughness: 0.85,
    metalness: 0.2,
    emissive: base,
    emissiveIntensity: 0.1,
  });
  const plinth = new THREE.Mesh(
    new THREE.CylinderGeometry(plinthR, plinthR * 0.9, plinthH, 48),
    plinthMat
  );
  plinth.position.y = -plinthH / 2;
  group.add(plinth);

  // terrain mini-scene on top (plinth top is at y = 0)
  const terrainGroup = buildTerrain(terrain, size, base, ridge, glow, water);
  group.add(terrainGroup);

  // glowing beacon ring beneath the pedestal
  const beaconMat = new THREE.MeshBasicMaterial({
    color: glow,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const beacon = new THREE.Mesh(
    new THREE.TorusGeometry(plinthR * 1.06, size * 0.035, 16, 64),
    beaconMat
  );
  beacon.rotation.x = Math.PI / 2;
  beacon.position.y = -plinthH - size * 0.06;
  group.add(beacon);

  // soft glow sprite above the island
  const glowSprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: glowTex,
      color: glow,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  glowSprite.scale.set(size * 2.3, size * 2.3, 1);
  glowSprite.position.y = size * 0.55;
  group.add(glowSprite);

  // name label
  const labelTex = makeLabelTexture(marker.name, `#${glow.getHexString()}`);
  const label = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: labelTex, transparent: true, depthWrite: false })
  );
  label.scale.set(size * 1.7, size * 1.7 * 0.26, 1);
  label.position.y = size * 0.7 + 0.7;
  group.add(label);

  // invisible hit cylinder
  const hit = new THREE.Mesh(
    new THREE.CylinderGeometry(plinthR * 1.15, plinthR * 1.15, size * 1.9, 16),
    new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })
  );
  hit.position.y = size * 0.25;
  hit.userData.marker = marker;
  group.add(hit);

  const fallbackGlow = new THREE.Color(KIND_GLOW[kind]);
  group.userData = {
    marker,
    beacon,
    glowSprite,
    label,
    labelTex,
    baseY: 0,
    phase: Math.random() * Math.PI * 2,
    fallbackGlow,
  };

  return { group, hit, beacon, glowSprite, label, labelTex, glow };
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
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = null;
    scene.fog = new THREE.FogExp2(0x05060c, 0.018);

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

    /* ── lights ── */
    scene.add(new THREE.AmbientLight(0x8899bb, 0.5));
    const key = new THREE.DirectionalLight(0xfff2df, 1.6);
    key.position.set(6, 9, 5);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x5f86ff, 0.9);
    rim.position.set(-7, 3, -5);
    scene.add(rim);

    /* ── starfield ── */
    const starCount = 1500;
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
      size: 0.09,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    /* ── display shelf ── */
    const shelfMat = new THREE.MeshStandardMaterial({
      color: 0x0c0a09,
      roughness: 0.9,
      metalness: 0.25,
      emissive: 0x050403,
      emissiveIntensity: 0.6,
    });
    const shelf = new THREE.Mesh(new THREE.CylinderGeometry(11, 11.6, 0.4, 72), shelfMat);
    shelf.position.y = -2.35;
    scene.add(shelf);

    const rimMat = new THREE.MeshBasicMaterial({
      color: 0x4a3a28,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const rimRing = new THREE.Mesh(new THREE.TorusGeometry(11.0, 0.05, 12, 96), rimMat);
    rimRing.rotation.x = Math.PI / 2;
    rimRing.position.y = -2.14;
    scene.add(rimRing);

    /* ── dioramas ── */
    const glowTex = makeGlowTexture();
    const dioramas: ReturnType<typeof buildDiorama>[] = [];
    const hitMeshes: THREE.Mesh[] = [];
    const labelTextures: THREE.CanvasTexture[] = [];

    markers.forEach((marker) => {
      const d = buildDiorama(marker, glowTex);
      scene.add(d.group);
      dioramas.push(d);
      hitMeshes.push(d.hit);
      labelTextures.push(d.labelTex);
    });

    /* ── post-processing (guarded) ── */
    let composer: EffectComposer | null = null;
    try {
      composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
      const bloom = new UnrealBloomPass(
        new THREE.Vector2(container.clientWidth, container.clientHeight),
        0.9,
        0.65,
        0.22
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
        (d.beacon.material as THREE.MeshBasicMaterial).opacity = isThis ? 0.95 : 0.5;
        d.beacon.scale.setScalar(isThis ? 1.35 : 1);
        (d.glowSprite.material as THREE.SpriteMaterial).opacity = isThis ? 0.9 : 0.55;
        d.glowSprite.scale.setScalar(isThis ? d.group.userData.marker.size * 2.8 : d.group.userData.marker.size * 2.3);
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

      // idle float + beacon pulse
      dioramas.forEach((d) => {
        const u = d.group.userData;
        const bob = Math.sin(t * 0.7 + u.phase) * 0.08;
        d.group.position.y = u.baseY + bob;
        const pulse = 0.5 + Math.sin(t * 1.6 + u.phase) * 0.12;
        (d.beacon.material as THREE.MeshBasicMaterial).opacity =
          hovered === u.marker ? 0.95 : pulse;
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
      glowTex.dispose();
      labelTextures.forEach((tex) => tex.dispose());

      if (composer) composer.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [markers, onSelect, onHover]);

  /* ── react to focusId changes ── */
  useEffect(() => {
    ctrlRef.current?.flyTo(focusId);
  }, [focusId]);

  return <div ref={containerRef} className="absolute inset-0" />;
}
