import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import gsap from 'gsap';
import { useStore } from '../../utils/store';
import { experiments } from '../../data/experiments';

export const LabEnvironment = () => {
  const groupRef = useRef();
  const sceneState = useStore(state => state.sceneState);
  const activeFilter = useStore(state => state.activeLabFilter);
  const navigate = useNavigate();

  // Create shared geometries for deterministic drifting fragments
  const { tetraGeo, gridGeo, planeGeo } = useMemo(() => {
    return {
      tetraGeo: new THREE.TetrahedronGeometry(1.5, 0),
      gridGeo: new THREE.PlaneGeometry(10, 10, 10, 10),
      planeGeo: new THREE.PlaneGeometry(2, 2)
    };
  }, []);

  // Filter experiments based on active filter (even though it's just one placeholder for now)
  const visibleExperiments = useMemo(() => {
    if (activeFilter === 'ALL') return experiments;
    return experiments.filter(e => e.category === activeFilter);
  }, [activeFilter]);

  useEffect(() => {
    if (!groupRef.current) return;
    
    // Animate visibility and positioning based on scene state
    if (sceneState === 'LAB') {
       gsap.to(groupRef.current.position, { y: -50, duration: 2, ease: "power3.out" }); // Positioned below network topology
       gsap.to(groupRef.current.scale, { x: 1, y: 1, z: 1, duration: 2, ease: "power3.out" });
    } else {
       gsap.to(groupRef.current.position, { y: -80, duration: 2, ease: "power3.inOut" });
       gsap.to(groupRef.current.scale, { x: 0.5, y: 0.5, z: 0.5, duration: 2, ease: "power3.inOut" });
    }
  }, [sceneState]);

  // Keep it hidden to save draw calls if not in Lab or near it
  const isVisible = sceneState === 'LAB' || sceneState === 'NETWORK';
  
  if (!isVisible) return null;

  return (
    <group ref={groupRef} position={[0, -80, 0]} scale={[0.5, 0.5, 0.5]}>
      
      {/* Background deterministic drifting fragments representing unstructured ideas */}
      <DriftingFragments tetraGeo={tetraGeo} planeGeo={planeGeo} gridGeo={gridGeo} />

      {/* The Experiments */}
      {experiments.map((exp, idx) => {
         const isActive = visibleExperiments.some(e => e.id === exp.id);
         return (
            <ExperimentObject 
               key={exp.id}
               experiment={exp}
               isActive={isActive}
               tetraGeo={tetraGeo}
               index={idx}
               navigate={navigate}
            />
         )
      })}
    </group>
  );
};

const ExperimentObject = ({ experiment, isActive, tetraGeo, index, navigate }) => {
   const meshRef = useRef();
   const [hovered, setHovered] = React.useState(false);
   
   // Deterministic offsets
   const timeOffset = index * 4.567;
   
   useFrame(({ clock }) => {
      if (!meshRef.current) return;
      const t = clock.getElapsedTime() + timeOffset;
      
      // Gentle deterministic floating
      meshRef.current.position.y = experiment.position[1] + Math.sin(t * 0.5) * 0.5;
      meshRef.current.rotation.x = Math.sin(t * 0.2) * 0.2;
      meshRef.current.rotation.y = Math.cos(t * 0.3) * 0.2;
   });

   useEffect(() => {
      if (!meshRef.current) return;
      
      // Filter animation
      gsap.to(meshRef.current.scale, {
         x: isActive ? (hovered ? 1.2 : 1) : 0.01,
         y: isActive ? (hovered ? 1.2 : 1) : 0.01,
         z: isActive ? (hovered ? 1.2 : 1) : 0.01,
         duration: 1,
         ease: 'power2.out'
      });
      
      gsap.to(meshRef.current.material, {
         opacity: isActive ? (hovered ? 0.8 : 0.2) : 0.0,
         duration: 1
      });
      
   }, [isActive, hovered]);

   const handlePointerOver = (e) => {
      e.stopPropagation();
      setHovered(true);
      window.dispatchEvent(new CustomEvent('set-cursor', { detail: 'EXPLORE' }));
   };

   const handlePointerOut = () => {
      setHovered(false);
      window.dispatchEvent(new CustomEvent('set-cursor', { detail: '' }));
   };

   const handleClick = (e) => {
      e.stopPropagation();
      // Optional: camera fly animation here before navigating
      window.dispatchEvent(new CustomEvent('set-cursor', { detail: '' }));
      navigate(`/lab/${experiment.slug}`);
   };

   return (
      <mesh
         ref={meshRef}
         position={experiment.position}
         onPointerOver={handlePointerOver}
         onPointerOut={handlePointerOut}
         onClick={handleClick}
      >
         <bufferGeometry attach="geometry" {...tetraGeo} />
         <meshBasicMaterial attach="material" color={hovered ? "#ffffff" : "#8888ff"} wireframe transparent opacity={0.2} />
      </mesh>
   );
};

const DriftingFragments = ({ tetraGeo, planeGeo, gridGeo }) => {
   const groupRef = useRef();

   useFrame(({ clock }) => {
      if (!groupRef.current) return;
      const t = clock.getElapsedTime();
      
      // Rotate the whole field slowly
      groupRef.current.rotation.y = Math.sin(t * 0.05) * 0.5;
      groupRef.current.rotation.x = Math.cos(t * 0.07) * 0.2;

      // Animate children deterministically
      groupRef.current.children.forEach((child, i) => {
         const localT = t + i * 1.23;
         child.rotation.x += Math.sin(localT * 0.01) * 0.01;
         child.rotation.y += Math.cos(localT * 0.01) * 0.01;
         child.position.y += Math.sin(localT * 0.5) * 0.02;
      });
   });

   return (
      <group ref={groupRef}>
         {/* Distribute a few abstract shapes representing broken structure */}
         <mesh position={[-15, 5, -10]} rotation={[0.4, 0.2, 0.1]}>
            <bufferGeometry attach="geometry" {...gridGeo} />
            <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.05} />
         </mesh>
         
         <mesh position={[10, -5, -15]} rotation={[-0.2, 0.5, 0.7]}>
            <bufferGeometry attach="geometry" {...tetraGeo} />
            <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.08} />
         </mesh>

         <mesh position={[-8, -8, -5]} rotation={[0.1, -0.4, 0.2]}>
            <bufferGeometry attach="geometry" {...planeGeo} />
            <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.04} />
         </mesh>
         
         <mesh position={[12, 8, -8]} rotation={[0.8, -0.1, 0.5]}>
            <bufferGeometry attach="geometry" {...gridGeo} />
            <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.03} />
         </mesh>
      </group>
   );
};
