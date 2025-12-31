
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { AccretionDiskShader, PlanetShader } from './Shaders';

interface CelestialSceneProps {
  isLoading: boolean;
}

const CelestialScene: React.FC<CelestialSceneProps> = ({ isLoading }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  // Fix: Initialize useRef with undefined to satisfy TypeScript requirement for 1 argument when type is specified
  const requestRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!containerRef.current) return;

    // --- Setup ---
    const width = window.innerWidth;
    const height = window.innerHeight;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#010409');

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(15, 12, 25);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // --- Lights ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x60a5fa, 2.5);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // --- Starfield ---
    const starCount = 7000;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const r = 150;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPos[i * 3 + 2] = r * Math.cos(phi);
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1, transparent: true, opacity: 0.5 });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // --- Group ---
    const mainGroup = new THREE.Group();
    mainGroup.rotation.x = 0.2;
    scene.add(mainGroup);

    // --- Planet ---
    const planetUniforms = { uTime: { value: 0 } };
    const planetGeo = new THREE.SphereGeometry(3.2, 64, 64);
    const planetMat = new THREE.ShaderMaterial({
      vertexShader: PlanetShader.vertexShader,
      fragmentShader: PlanetShader.fragmentShader,
      uniforms: planetUniforms,
    });
    const planet = new THREE.Mesh(planetGeo, planetMat);
    mainGroup.add(planet);

    // --- Accretion Disk ---
    const diskUniforms = {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color('#1e40af') },
      uSecondaryColor: { value: new THREE.Color('#60a5fa') }
    };
    const diskGeo = new THREE.PlaneGeometry(22, 22, 128, 128);
    const diskMat = new THREE.ShaderMaterial({
      vertexShader: AccretionDiskShader.vertexShader,
      fragmentShader: AccretionDiskShader.fragmentShader,
      uniforms: diskUniforms,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    const disk = new THREE.Mesh(diskGeo, diskMat);
    disk.rotation.x = -Math.PI / 2;
    mainGroup.add(disk);

    // --- Particles ---
    const partCount = 5000;
    const partGeo = new THREE.BufferGeometry();
    const partPos = new Float32Array(partCount * 3);
    const partCol = new Float32Array(partCount * 3);
    for (let i = 0; i < partCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 4.5 + Math.pow(Math.random(), 1.5) * 10;
      partPos[i * 3] = Math.cos(angle) * radius;
      partPos[i * 3 + 1] = Math.sin(angle) * radius;
      partPos[i * 3 + 2] = (Math.random() - 0.5) * 0.4;
      
      const mixedColor = new THREE.Color('#3b82f6').lerp(new THREE.Color('#ffffff'), Math.random() * 0.5);
      partCol[i * 3] = mixedColor.r;
      partCol[i * 3 + 1] = mixedColor.g;
      partCol[i * 3 + 2] = mixedColor.b;
    }
    partGeo.setAttribute('position', new THREE.BufferAttribute(partPos, 3));
    partGeo.setAttribute('color', new THREE.BufferAttribute(partCol, 3));
    const partMat = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const particles = new THREE.Points(partGeo, partMat);
    particles.rotation.x = -Math.PI / 2;
    mainGroup.add(particles);

    // --- Animation ---
    const clock = new THREE.Clock();
    const animate = () => {
      const time = clock.getElapsedTime();
      
      planetUniforms.uTime.value = time;
      diskUniforms.uTime.value = time;
      
      planet.rotation.y = time * 0.03;
      disk.rotation.z = time * 0.08;
      particles.rotation.z = time * 0.04;
      
      // Gentle orbit-like rotation of the whole group
      mainGroup.rotation.y = time * 0.05;

      renderer.render(scene, camera);
      requestRef.current = requestAnimationFrame(animate);
    };
    animate();

    // --- Resize ---
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (rendererRef.current) {
        containerRef.current?.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
      planetGeo.dispose();
      planetMat.dispose();
      diskGeo.dispose();
      diskMat.dispose();
      partGeo.dispose();
      partMat.dispose();
      starGeo.dispose();
      starMat.dispose();
    };
  }, []);

  // Visual reaction to loading state
  useEffect(() => {
    if (rendererRef.current) {
      // Small visual feedback if needed
    }
  }, [isLoading]);

  return <div ref={containerRef} className="absolute inset-0 z-0" />;
};

export default CelestialScene;
