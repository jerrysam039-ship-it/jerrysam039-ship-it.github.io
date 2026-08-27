import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { useStore } from '../../utils/store';

export const ConnectionNode = () => {
  const meshRef = useRef();
  const materialRef = useRef();
  const sceneState = useStore(state => state.sceneState);

  useEffect(() => {
    if (!meshRef.current || !materialRef.current) return;

    if (sceneState === 'CONTACT') {
      // Reveal the connection node smoothly
      gsap.to(meshRef.current.position, { y: -70, duration: 2.5, ease: 'power3.out' });
      gsap.to(meshRef.current.scale, { x: 1, y: 1, z: 1, duration: 2.5, ease: 'power3.out' });
      gsap.to(materialRef.current, { opacity: 0.8, duration: 2 });
    } else {
      // Hide when not in Contact
      gsap.to(meshRef.current.position, { y: -80, duration: 2, ease: 'power3.inOut' });
      gsap.to(meshRef.current.scale, { x: 0.01, y: 0.01, z: 0.01, duration: 2, ease: 'power3.inOut' });
      gsap.to(materialRef.current, { opacity: 0, duration: 2 });
    }
  }, [sceneState]);

  useFrame(({ clock }) => {
    if (!meshRef.current || sceneState !== 'CONTACT') return;
    const t = clock.getElapsedTime();
    
    // Calm, sophisticated motion
    meshRef.current.rotation.y = t * 0.1;
    meshRef.current.rotation.x = Math.sin(t * 0.2) * 0.1;
    
    // Soft breathing scale
    const scale = 1 + Math.sin(t * 0.5) * 0.05;
    meshRef.current.scale.set(scale, scale, scale);
  });

  return (
    <mesh ref={meshRef} position={[0, -80, 0]} scale={[0.01, 0.01, 0.01]}>
      <icosahedronGeometry args={[2, 1]} />
      <meshBasicMaterial 
         ref={materialRef} 
         color="#ffffff" 
         wireframe 
         transparent 
         opacity={0} 
      />
    </mesh>
  );
};
