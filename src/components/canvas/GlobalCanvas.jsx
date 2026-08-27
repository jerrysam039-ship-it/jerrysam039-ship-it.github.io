import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { useStore } from '../../utils/store';
import { ProjectConstellation } from './ProjectConstellation';
import { NetworkTopology } from './NetworkTopology';
import { LabEnvironment } from './LabEnvironment';
import { ConnectionNode } from './ConnectionNode';
import { projects } from '../../data/projects';

// A component that moves the camera based on pointer and scene state
const CameraRig = () => {
  const { camera, pointer } = useThree();
  const sceneState = useStore(state => state.sceneState);
  const activeProject = useStore(state => state.activeProject);
  const reducedMotion = useStore(state => state.reducedMotion);
  
  // Target coordinates for different states
  const targets = {
    HERO: { z: 15, x: 0, y: 0 },
    ABOUT: { z: 20, x: -5, y: 2 },
    PHILOSOPHY: { z: 12, x: 0, y: 5 },
    JOURNEY: { z: 18, x: 0, y: -5 },
    UNIVERSE: { z: 45, x: 0, y: 0 },
    MEDIA_SECTION: { z: 30, x: -10, y: 5 },
    NETWORK: { z: 0, x: 0, y: -30 }, // Fly down deep into the topology which is at y=-20
    LAB: { z: 0, x: 0, y: -50 }, // Deepest level for the Lab
    CONTACT: { z: 15, x: 0, y: -70 }, // Final calm connection point
  };

  useFrame(() => {
    if (reducedMotion && sceneState !== 'PROJECT') return;

    let targetX = 0, targetY = 0, targetZ = 15;
    let lookTarget = new THREE.Vector3(0, 0, 0);

    if (sceneState === 'PROJECT' && activeProject) {
      const proj = projects.find(p => p.id === activeProject);
      if (proj) {
         targetX = proj.position[0];
         targetY = proj.position[1];
         targetZ = proj.position[2] + 5; 
         lookTarget.set(proj.position[0], proj.position[1], proj.position[2]);
      }
    } else {
      const target = targets[sceneState] || targets.HERO;
      targetX = target.x + (pointer.x * 1.5);
      targetY = target.y + (pointer.y * 1.5);
      targetZ = target.z;

      if (sceneState === 'JOURNEY') {
         lookTarget.set(0, -2, 0);
      }
    }

    gsap.to(camera.position, {
      x: targetX,
      y: targetY,
      z: targetZ,
      duration: sceneState === 'PROJECT' ? 1.5 : 3,
      ease: sceneState === 'PROJECT' ? "power3.inOut" : "power2.out",
    });
    
    if (!camera.userData.lookProxy) {
      camera.userData.lookProxy = new THREE.Vector3(0,0,0);
    }
    gsap.to(camera.userData.lookProxy, {
      x: lookTarget.x,
      y: lookTarget.y,
      z: lookTarget.z,
      duration: 1.5,
      ease: "power2.out",
      onUpdate: () => camera.lookAt(camera.userData.lookProxy)
    });
  });
  
  return null;
};

const ParticleSystem = () => {
  const ref = useRef();
  const materialRef = useRef();
  const sceneState = useStore(state => state.sceneState);
  const activeProject = useStore(state => state.activeProject);
  const reducedMotion = useStore(state => state.reducedMotion);
  const performanceTier = useStore(state => state.performanceTier);
  
  const [positions] = useMemo(() => {
    let count = 1500;
    if (performanceTier === 'MEDIUM') count = 1000;
    if (performanceTier === 'LOW') count = 500;
    
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 15 + Math.random() * 40; 
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos((Math.random() * 2) - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    return [positions];
  }, [performanceTier]);

  const speedRef = useRef({ x: 0.001, y: 0.002 });

  useEffect(() => {
    if (!materialRef.current) return;
    
    let targetOpacity = 0.3;
    let targetSize = 0.06;
    let targetSpeedX = 0.001;
    let targetSpeedY = 0.002;
    let targetColor = new THREE.Color("#ffffff");

    if (sceneState === 'PROJECT' && activeProject) {
      const proj = projects.find(p => p.id === activeProject);
      const theme = proj ? proj.theme : 'default';
      
      switch(theme) {
        case 'commerce':
          targetOpacity = 0.4;
          targetSize = 0.05;
          targetSpeedX = 0.002;
          targetSpeedY = 0.0005;
          break;
        case 'education':
          targetOpacity = 0.25;
          targetSize = 0.08;
          targetSpeedX = 0.003;
          targetSpeedY = 0.003;
          break;
        case 'media':
          targetOpacity = 0.5;
          targetSize = 0.04;
          targetSpeedX = 0.008;
          targetSpeedY = 0.0;
          break;
        case 'archive':
          targetOpacity = 0.15;
          targetSize = 0.1;
          targetSpeedX = 0.0001;
          targetSpeedY = 0.0001;
          break;
        default:
          targetOpacity = 0.2;
          targetSize = 0.05;
          targetSpeedX = 0.001;
          targetSpeedY = 0.001;
      }
    } else {
      switch(sceneState) {
        case 'ABOUT':
          targetOpacity = 0.15;
          targetSize = 0.04;
          targetSpeedX = 0.0002;
          targetSpeedY = 0.0005;
          break;
        case 'PHILOSOPHY':
          targetOpacity = 0.4;
          targetSize = 0.08;
          targetSpeedX = 0.005;
          targetSpeedY = 0.002;
          break;
        case 'JOURNEY':
          targetOpacity = 0.2;
          targetSize = 0.05;
          targetSpeedX = 0.0;
          targetSpeedY = 0.005;
          break;
        case 'MEDIA_SECTION':
          // Metadata breaking apart
          targetOpacity = 0.4;
          targetSize = 0.04;
          targetSpeedX = 0.006;
          targetSpeedY = 0.001;
          break;
        case 'NETWORK':
          // Fade out to let topology take over
          targetOpacity = 0.05;
          targetSize = 0.02;
          targetSpeedX = 0.0005;
          targetSpeedY = 0.001;
          break;
        case 'LAB':
          // Fragmented, unstable drifting
          targetOpacity = 0.2;
          targetSize = 0.08;
          targetSpeedX = 0.003;
          targetSpeedY = -0.002;
          break;
        case 'CONTACT':
          // Extreme calm, slow motion convergence
          targetOpacity = 0.1;
          targetSize = 0.03;
          targetSpeedX = 0.0001;
          targetSpeedY = 0.0001;
          break;
        default:
          targetOpacity = 0.3;
          targetSize = 0.06;
          targetSpeedX = 0.001;
          targetSpeedY = 0.002;
      }
    }

    gsap.to(materialRef.current, {
      opacity: targetOpacity,
      size: targetSize,
      duration: 2,
      ease: 'power2.inOut',
      onUpdate: () => {
         // GSAP doesn't perfectly animate THREE.Color directly without a proxy,
         // but for opacity/size it's fine. We'll leave color static white for now to keep the cinematic dark identity.
      }
    });

    gsap.to(speedRef.current, {
      x: targetSpeedX,
      y: targetSpeedY,
      duration: 2,
      ease: 'power2.inOut'
    });

  }, [sceneState, activeProject]);

  useFrame((state) => {
    if (ref.current && !reducedMotion) {
      ref.current.rotation.y += speedRef.current.y;
      ref.current.rotation.x += speedRef.current.x;
    }
  });

  return (
    <group ref={ref}>
      <Points positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial 
          ref={materialRef}
          transparent 
          color="#ffffff" 
          size={0.06} 
          sizeAttenuation={true} 
          depthWrite={false} 
          opacity={0.3} 
        />
      </Points>
    </group>
  );
};

const GlobalCanvas = () => {
  const performanceTier = useStore(state => state.performanceTier);

  // Disable heavy WebGL on phones to prevent mobile rendering crashes
  const isMobile = window.matchMedia('(max-width: 768px)').matches;

  if (isMobile) {
    return null;
  }

  const dpr =
    performanceTier === 'HIGH'
      ? Math.min(window.devicePixelRatio, 2)
      : performanceTier === 'MEDIUM'
        ? Math.min(window.devicePixelRatio, 1.5)
        : 1;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 'var(--z-canvas)',
        pointerEvents: 'none',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 15], fov: 45 }}
        dpr={dpr}
        eventSource={document.getElementById('root')}
        eventPrefix="client"
        style={{ pointerEvents: 'none' }}
      >
        <color attach="background" args={['#030305']} />
        <fog attach="fog" args={['#030305', 10, 60]} />
        <ambientLight intensity={0.5} />
        <ParticleSystem />
        <ProjectConstellation />
        <NetworkTopology />
        <LabEnvironment />
        <ConnectionNode />
        <CameraRig />
      </Canvas>
    </div>
  );
};

export default GlobalCanvas;
