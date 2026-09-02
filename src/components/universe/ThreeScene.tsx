"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import type { UniverseMarker } from "@/lib/siteContent";

/* ═══════════════════════════════════════════════════════
   ThreeScene — vanilla Three.js cinematic universe globe.
   No react-three-fiber: full manual control, minimal deps.
   ═══════════════════════════════════════════════════════ */

interface ThreeSceneProps {
  markers: UniverseMarker[];
  focusId: string | null;
  onSelect: (m: UniverseMarker) => void;
  onHover: (m: UniverseMarker | null, x: number, y: number) => void;
}

const PLANET_RADIUS = 2;
const CAMERA_DEFAULT = new THREE.Vector3(0.4, 1.4, 6.6);

/* ── lat/lng → point on sphere surface ── */
function latLngToVector3(lat: number, lng: number, r: number): THREE.Vector3 {
  const phi = (lat * Math.PI) / 180;
  const theta = (lng * Math.PI) / 180;
  return new THREE.Vector3(
    r * Math.cos(phi) * Math.cos(theta),
    r * Math.sin(phi),
    r * Math.cos(phi) * Math.sin(theta)
  );
}

/* ── canvas label texture ── */
function makeLabelTexture(text: string, kind: UniverseMarker["kind"]): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const fontPx = text.length > 12 ? 68 : 84;
  ctx.font = `600 ${fontPx}px "Syne", "Inter", sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const accent = kind === "world" ? "#FF6600" : kind === "character" ? "#b9d0ff" : "#e7c77a";
  ctx.shadowColor = accent;
  ctx.shadowBlur = 28;
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
  g.addColorStop(0.25, "rgba(255,170,90,0.9)");
  g.addColorStop(0.6, "rgba(255,102,0,0.25)");
  g.addColorStop(1, "rgba(255,102,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/* ── procedural planet surface shader ── */
const planetVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vPos;
  varying vec3 vViewDir;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vViewDir = normalize(-mv.xyz);
    vPos = position;
    gl_Position = projectionMatrix * mv;
  }
`;

const planetFragment = /* glsl */ `
  uniform vec3 uOcean;
  uniform vec3 uLand;
  uniform vec3 uGlow;
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vPos;
  varying vec3 vViewDir;

  float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }
  float noise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
          mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
      mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
          mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
      f.z);
  }
  float fbm(vec3 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p = p * 2.03 + vec3(1.7, 9.2, 0.3);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec3 d = normalize(vPos);
    float n = fbm(d * 2.4 + 0.35);

    // continents vs ocean
    float coast = smoothstep(0.42, 0.55, n);
    vec3 col = mix(uOcean, uLand, coast);

    // coastline energy glow
    float edge = 1.0 - smoothstep(0.0, 0.10, abs(n - 0.48));
    col += uGlow * edge * 1.6;

    // faint lat/long grid (holographic)
    float lat = asin(clamp(d.y, -1.0, 1.0));
    float lon = atan(d.z, d.x);
    float gLat = 1.0 - smoothstep(0.985, 1.0, abs(sin(lat * 9.0)));
    float gLon = 1.0 - smoothstep(0.985, 1.0, abs(sin(lon * 9.0)));
    float grid = max(gLat, gLon);
    col += vec3(0.25, 0.32, 0.5) * grid * 0.35;

    // fresnel rim
    float fres = pow(1.0 - abs(dot(normalize(vNormal), normalize(vViewDir))), 2.4);
    col += uGlow * fres * 0.28;

    gl_FragColor = vec4(col, 1.0);
  }
`;

/* ── atmosphere fresnel shader ── */
const atmoVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vViewDir = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const atmoFragment = /* glsl */ `
  uniform vec3 uColor;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    float fres = pow(1.0 - abs(dot(normalize(vNormal), normalize(vViewDir))), 3.0);
    gl_FragColor = vec4(uColor, fres);
  }
`;

export default function ThreeScene({ markers, focusId, onSelect, onHover }: ThreeSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const ctrlRef = useRef<{
    flyTo: (id: string | null) => void;
    setHover: (m: UniverseMarker | null) => void;
  } | null>(null);

  /* ── init scene once ── */
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
    controls.minDistance = 3.0;
    controls.maxDistance = 14;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.35;
    controls.enablePan = false;
    controls.rotateSpeed = 0.6;
    controls.target.set(0, 0, 0);

    /* ── lights ── */
    const ambient = new THREE.AmbientLight(0x8899bb, 0.4);
    scene.add(ambient);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.4);
    dirLight.position.set(4, 3, 6);
    scene.add(dirLight);

    /* ── planet ── */
    const planetUniforms = {
      uOcean: { value: new THREE.Color("#070b18") },
      uLand: { value: new THREE.Color("#141b2e") },
      uGlow: { value: new THREE.Color("#FF6600") },
      uTime: { value: 0 },
    };
    const planetMat = new THREE.ShaderMaterial({
      vertexShader: planetVertex,
      fragmentShader: planetFragment,
      uniforms: planetUniforms,
    });
    const planet = new THREE.Mesh(
      new THREE.SphereGeometry(PLANET_RADIUS, 128, 128),
      planetMat
    );
    scene.add(planet);

    /* ── atmosphere ── */
    const atmoMat = new THREE.ShaderMaterial({
      vertexShader: atmoVertex,
      fragmentShader: atmoFragment,
      uniforms: { uColor: { value: new THREE.Color("#5f86ff") } },
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      depthWrite: false,
    });
    const atmo = new THREE.Mesh(
      new THREE.SphereGeometry(PLANET_RADIUS * 1.07, 96, 96),
      atmoMat
    );
    scene.add(atmo);

    /* ── starfield ── */
    const starCount = 1800;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const v = new THREE.Vector3(
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1
      )
        .normalize()
        .multiplyScalar(40 + Math.random() * 40);
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

    /* ── markers ── */
    const glowTex = makeGlowTexture();
    const markerGroups: THREE.Group[] = [];
    const hitMeshes: THREE.Mesh[] = [];

    markers.forEach((marker) => {
      const pos = latLngToVector3(marker.lat, marker.lng, PLANET_RADIUS);
      const normal = pos.clone().normalize();
      const group = new THREE.Group();
      group.userData.marker = marker;

      // core dot
      const coreMat = new THREE.MeshBasicMaterial({
        color: marker.kind === "world" ? 0xff7a1a : marker.kind === "character" ? 0xcfe0ff : 0xf0d488,
      });
      const core = new THREE.Mesh(new THREE.SphereGeometry(0.04, 24, 24), coreMat);
      core.position.copy(normal.clone().multiplyScalar(PLANET_RADIUS));
      group.add(core);

      // glow sprite
      const glowMat = new THREE.SpriteMaterial({
        map: glowTex,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
        opacity: 0.9,
      });
      const glow = new THREE.Sprite(glowMat);
      glow.scale.setScalar(0.55);
      glow.position.copy(normal.clone().multiplyScalar(PLANET_RADIUS));
      group.add(glow);

      // vertical beam
      const beamLen = 0.22;
      const beamMat = new THREE.MeshBasicMaterial({
        color: 0xff8c3a,
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const beam = new THREE.Mesh(
        new THREE.CylinderGeometry(0.008, 0.02, beamLen, 8),
        beamMat
      );
      const up = new THREE.Vector3(0, 1, 0);
      const quat = new THREE.Quaternion().setFromUnitVectors(up, normal);
      beam.quaternion.copy(quat);
      beam.position.copy(normal.clone().multiplyScalar(PLANET_RADIUS + beamLen / 2));
      group.add(beam);

      // name label
      const labelTex = makeLabelTexture(marker.name, marker.kind);
      const labelMat = new THREE.SpriteMaterial({
        map: labelTex,
        transparent: true,
        depthWrite: false,
      });
      const label = new THREE.Sprite(labelMat);
      label.scale.set(1.35, 0.34, 1);
      label.position.copy(normal.clone().multiplyScalar(PLANET_RADIUS + 0.42));
      group.add(label);

      // invisible hit sphere (generous target)
      const hitMat = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        depthWrite: false,
      });
      const hit = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 16), hitMat);
      hit.position.copy(normal.clone().multiplyScalar(PLANET_RADIUS));
      hit.userData.marker = marker;
      group.add(hit);

      scene.add(group);
      markerGroups.push(group);
      hitMeshes.push(hit);
    });

    /* ── post-processing (guarded) ── */
    let composer: EffectComposer | null = null;
    try {
      composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
      const bloom = new UnrealBloomPass(
        new THREE.Vector2(container.clientWidth, container.clientHeight),
        1.0,
        0.7,
        0.18
      );
      composer.addPass(bloom);
    } catch {
      composer = null;
    }

    /* ── interaction state ── */
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let hovered: UniverseMarker | null = null;
    let flying = false;
    let flyTarget: { pos: THREE.Vector3; look: THREE.Vector3 } | null = null;

    const setHover = (m: UniverseMarker | null) => {
      if (hovered === m) return;
      hovered = m;
      markerGroups.forEach((g) => {
        const core = g.children[0] as THREE.Mesh;
        const glow = g.children[1] as THREE.Sprite;
        const isThis = g.userData.marker === m;
        core.scale.setScalar(isThis ? 1.9 : 1);
        glow.scale.setScalar(isThis ? 0.85 : 0.55);
        (glow.material as THREE.SpriteMaterial).opacity = isThis ? 1 : 0.9;
      });
      container.style.cursor = m ? "pointer" : "grab";
    };

    const flyTo = (id: string | null) => {
      if (!id) {
        flying = true;
        flyTarget = { pos: CAMERA_DEFAULT.clone(), look: new THREE.Vector3(0, 0, 0) };
        controls.autoRotate = true;
        return;
      }
      const marker = markers.find((m) => m.id === id);
      if (!marker) return;
      const pos = latLngToVector3(marker.lat, marker.lng, PLANET_RADIUS);
      const dir = pos.clone().normalize();
      const camPos = dir.multiplyScalar(4.6);
      flying = true;
      flyTarget = { pos: camPos, look: pos };
      controls.autoRotate = false;
      setHover(marker);
    };

    /* ── events ── */
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
        const marker = hits[0].object.userData.marker as UniverseMarker;
        onSelect(marker);
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
      planetUniforms.uTime.value = t;

      if (flying && flyTarget) {
        camera.position.lerp(flyTarget.pos, 0.08);
        controls.target.lerp(flyTarget.look, 0.08);
        if (camera.position.distanceTo(flyTarget.pos) < 0.02) {
          flying = false;
          flyTarget = null;
        }
      }

      controls.update();
      if (composer) composer.render();
      else renderer.render(scene, camera);
    };
    animate();

    ctrlRef.current = { flyTo, setHover };

    /* ── cleanup ── */
    return () => {
      cancelAnimationFrame(raf);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("resize", onResize);
      controls.dispose();
      markerGroups.forEach((g) => {
        g.traverse((obj) => {
          if (obj instanceof THREE.Mesh || obj instanceof THREE.Sprite) {
            obj.geometry?.dispose?.();
            const mat = obj.material as THREE.Material | THREE.Material[];
            if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
            else mat?.dispose?.();
          }
        });
      });
      planet.geometry.dispose();
      planetMat.dispose();
      atmo.geometry.dispose();
      atmoMat.dispose();
      starGeo.dispose();
      starMat.dispose();
      glowTex.dispose();
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
