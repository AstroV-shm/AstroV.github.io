import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Play, Pause } from 'lucide-react';

interface SolarSystemViewerProps {
  asteroidDiameter: number;
  velocity: number;
  angle: number;
  isAnimating?: boolean;
}

export default function SolarSystemViewer({
  asteroidDiameter,
  velocity,
  angle,
  isAnimating = true,
}: SolarSystemViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    earth: THREE.Mesh;
    asteroid: THREE.Mesh;
    trajectory: THREE.Line;
    animationId: number | null;
    time: number;
  } | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000011);

    const camera = new THREE.PerspectiveCamera(
      45,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      10000
    );
    camera.position.set(0, 150, 300);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
    sunLight.position.set(100, 50, 100);
    scene.add(sunLight);

    const earthGeometry = new THREE.SphereGeometry(20, 64, 64);

    const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin('anonymous');

    const earthMaterial = new THREE.MeshPhongMaterial({
      map: textureLoader.load(
        'https://unpkg.com/three-globe@2.31.1/example/img/earth-blue-marble.jpg',
        undefined,
        undefined,
        () => {
          earthMaterial.color = new THREE.Color(0x2244aa);
        }
      ),
      bumpScale: 0.5,
    });

    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);

    const atmosphereGeometry = new THREE.SphereGeometry(20.5, 64, 64);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x4488ff,
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide,
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphere);

    const asteroidSize = Math.log(asteroidDiameter + 1) * 0.5 + 1;
    const asteroidGeometry = new THREE.SphereGeometry(asteroidSize, 16, 16);
    const asteroidMaterial = new THREE.MeshPhongMaterial({
      color: 0x8b7355,
      roughness: 0.9,
    });
    const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
    scene.add(asteroid);

    const trajectoryPoints = [];
    const orbitRadius = 150;
    const segments = 100;
    const angleRad = (angle * Math.PI) / 180;

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const x = orbitRadius * Math.cos(t * Math.PI * 2);
      const y = orbitRadius * Math.sin(angleRad) * Math.sin(t * Math.PI);
      const z = orbitRadius * Math.sin(t * Math.PI * 2);
      trajectoryPoints.push(new THREE.Vector3(x, y, z));
    }

    const trajectoryGeometry = new THREE.BufferGeometry().setFromPoints(trajectoryPoints);
    const trajectoryMaterial = new THREE.LineBasicMaterial({
      color: 0xff3333,
      linewidth: 2,
      transparent: true,
      opacity: 0.6,
    });
    const trajectory = new THREE.Line(trajectoryGeometry, trajectoryMaterial);
    scene.add(trajectory);

    const starGeometry = new THREE.BufferGeometry();
    const starVertices = [];
    for (let i = 0; i < 2000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = (Math.random() - 0.5) * 2000;
      starVertices.push(x, y, z);
    }
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 1.5 });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    sceneRef.current = {
      scene,
      camera,
      renderer,
      earth,
      asteroid,
      trajectory,
      animationId: null,
      time: 0,
    };

    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      if (mountRef.current) {
        mouseX = (event.clientX / mountRef.current.clientWidth) * 2 - 1;
        mouseY = -(event.clientY / mountRef.current.clientHeight) * 2 + 1;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      if (!sceneRef.current) return;

      sceneRef.current.animationId = requestAnimationFrame(animate);

      if (isPlaying && isAnimating) {
        sceneRef.current.time += 0.005 * animationSpeed;

        sceneRef.current.earth.rotation.y += 0.001 * animationSpeed;

        const t = (sceneRef.current.time % 1);
        const point = trajectoryPoints[Math.floor(t * segments)];
        if (point) {
          sceneRef.current.asteroid.position.copy(point);
        }
      }

      sceneRef.current.camera.position.x += (mouseX * 50 - sceneRef.current.camera.position.x) * 0.05;
      sceneRef.current.camera.position.y += (-mouseY * 50 + 100 - sceneRef.current.camera.position.y) * 0.05;
      sceneRef.current.camera.lookAt(0, 0, 0);

      sceneRef.current.renderer.render(sceneRef.current.scene, sceneRef.current.camera);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current || !sceneRef.current) return;
      sceneRef.current.camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      sceneRef.current.camera.updateProjectionMatrix();
      sceneRef.current.renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);

      if (sceneRef.current) {
        if (sceneRef.current.animationId) {
          cancelAnimationFrame(sceneRef.current.animationId);
        }
        sceneRef.current.renderer.dispose();
        if (mountRef.current && mountRef.current.contains(sceneRef.current.renderer.domElement)) {
          mountRef.current.removeChild(sceneRef.current.renderer.domElement);
        }
      }
    };
  }, [asteroidDiameter, velocity, angle, isPlaying, animationSpeed, isAnimating]);

  return (
    <div className="relative w-full h-full">
      <div ref={mountRef} className="w-full h-full" />

      <div className="absolute bottom-4 left-4 flex gap-2">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="bg-gray-900/80 backdrop-blur-sm text-white p-3 rounded-lg hover:bg-gray-800 transition-colors"
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>

        <div className="bg-gray-900/80 backdrop-blur-sm text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <span className="text-sm">Speed:</span>
          {[1, 10, 100].map((speed) => (
            <button
              key={speed}
              onClick={() => setAnimationSpeed(speed)}
              className={`px-2 py-1 rounded ${
                animationSpeed === speed
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              } transition-colors text-sm`}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
