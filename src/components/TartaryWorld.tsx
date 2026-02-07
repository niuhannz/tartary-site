'use client';

import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

export default function TartaryWorld() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState('initializing...');

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Raw Three.js — no R3F
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0000ff');

    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Add a spinning box
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshStandardMaterial({ color: 0xff8800, emissive: 0xff4400, emissiveIntensity: 0.5 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambient);
    const directional = new THREE.DirectionalLight(0xffffff, 1);
    directional.position.set(5, 5, 5);
    scene.add(directional);

    setStatus(`Renderer: ${renderer.getContext().getParameter(renderer.getContext().RENDERER)} | Canvas: ${renderer.domElement.width}x${renderer.domElement.height}`);

    let frameId: number;
    function animate() {
      frameId = requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.005;
      renderer.render(scene, camera);
    }
    animate();

    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-red-900 overflow-hidden">
      <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }} />
      <div className="absolute top-4 left-4 z-50 text-white text-sm font-mono bg-black/80 p-3 rounded max-w-lg">
        <p>RAW Three.js Test (no R3F)</p>
        <p>Background should be BLUE, box ORANGE</p>
        <p>If RED: Three.js canvas not rendering</p>
        <p>Status: {status}</p>
      </div>
    </div>
  );
}
