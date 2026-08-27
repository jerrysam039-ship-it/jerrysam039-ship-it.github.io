import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { networkData } from '../../data/network';
import { useStore } from '../../utils/store';

const PacketSystem = ({ connections, nodes }) => {
  const meshRef = useRef();
  const performanceTier = useStore(state => state.performanceTier);
  
  // Create object pool for packets
  const { dummy, packets, poolSize } = useMemo(() => {
    let poolSize = 30; // Max concurrent packets
    if (performanceTier === 'MEDIUM') poolSize = 15;
    if (performanceTier === 'LOW') poolSize = 5;

    const dummy = new THREE.Object3D();
    const packets = [];
    for (let i = 0; i < poolSize; i++) {
       packets.push({
          active: false,
          progress: 0,
          speed: 0,
          connIdx: -1,
          startPos: new THREE.Vector3(),
          endPos: new THREE.Vector3()
       });
    }
    return { dummy, packets, poolSize };
  }, [performanceTier]);

  const { connectionMap } = useMemo(() => {
     // Pre-calculate positions for fast lookup
     const map = [];
     connections.forEach(conn => {
        const sourceNode = nodes.find(n => n.id === conn.source);
        const targetNode = nodes.find(n => n.id === conn.target);
        if (sourceNode && targetNode) {
           map.push({
              start: new THREE.Vector3(...sourceNode.position),
              end: new THREE.Vector3(...targetNode.position)
           });
        }
     });
     return { connectionMap: map };
  }, [connections, nodes]);

  useFrame((state, delta) => {
     if (!meshRef.current || connectionMap.length === 0) return;

     // Spawn logic
     if (Math.random() < 0.1) {
        // Find inactive packet
        const inactiveIdx = packets.findIndex(p => !p.active);
        if (inactiveIdx !== -1) {
           const connIdx = Math.floor(Math.random() * connectionMap.length);
           packets[inactiveIdx] = {
              active: true,
              progress: 0,
              speed: 0.2 + Math.random() * 0.3, // travel duration 
              connIdx: connIdx,
              startPos: connectionMap[connIdx].start,
              endPos: connectionMap[connIdx].end
           };
        }
     }

     // Update and render logic
     packets.forEach((p, idx) => {
        if (!p.active) {
            dummy.position.set(0, 0, 1000); // hide far away
            dummy.updateMatrix();
            meshRef.current.setMatrixAt(idx, dummy.matrix);
            return;
        }

        p.progress += delta * p.speed;
        
        if (p.progress >= 1) {
           p.active = false;
        } else {
           // easing
           const easeProg = p.progress < 0.5 
              ? 2 * p.progress * p.progress 
              : 1 - Math.pow(-2 * p.progress + 2, 2) / 2;
           
           dummy.position.lerpVectors(p.startPos, p.endPos, easeProg);
           const scale = 0.5 + Math.sin(p.progress * Math.PI) * 1.5;
           dummy.scale.setScalar(scale);
           dummy.updateMatrix();
           meshRef.current.setMatrixAt(idx, dummy.matrix);
        }
     });
     meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, poolSize]} frustumCulled={false}>
      <sphereGeometry args={[0.08, 8, 8]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
    </instancedMesh>
  );
};

export const NetworkTopology = () => {
  const groupRef = useRef();
  const sceneState = useStore(state => state.sceneState);
  
  const lineGeometries = useMemo(() => {
     return networkData.connections.map(conn => {
        const sourceNode = networkData.nodes.find(n => n.id === conn.source);
        const targetNode = networkData.nodes.find(n => n.id === conn.target);
        if (sourceNode && targetNode) {
            const points = [
               new THREE.Vector3(...sourceNode.position),
               new THREE.Vector3(...targetNode.position)
            ];
            const geo = new THREE.BufferGeometry().setFromPoints(points);
            return { id: conn.id, geo };
        }
        return null;
     }).filter(Boolean);
  }, []);

  useEffect(() => {
    if (!groupRef.current) return;
    
    if (sceneState === 'NETWORK') {
       gsap.to(groupRef.current.position, { y: 0, duration: 2, ease: "power3.out" });
       gsap.to(groupRef.current.scale, { x: 1, y: 1, z: 1, duration: 2, ease: "power3.out" });
    } else {
       gsap.to(groupRef.current.position, { y: -20, duration: 2, ease: "power3.inOut" });
       gsap.to(groupRef.current.scale, { x: 0.8, y: 0.8, z: 0.8, duration: 2, ease: "power3.inOut" });
    }
  }, [sceneState]);

  const setActiveNetworkNode = useStore(state => state.setActiveNetworkNode);
  const setHoveredNetworkNode = useStore(state => state.setHoveredNetworkNode);
  const activeNodeId = useStore(state => state.activeNetworkNode);
  const hoveredNodeId = useStore(state => state.hoveredNetworkNode);

  const isVisible = sceneState === 'NETWORK' || sceneState === 'MEDIA_SECTION';
  
  if (!isVisible) return null;

  const handlePointerOver = (e, id) => {
    e.stopPropagation();
    setHoveredNetworkNode(id);
    window.dispatchEvent(new CustomEvent('set-cursor', { detail: 'INSPECT' }));
  };

  const handlePointerOut = () => {
    setHoveredNetworkNode(null);
    window.dispatchEvent(new CustomEvent('set-cursor', { detail: '' }));
  };

  const handleClick = (e, id) => {
    e.stopPropagation();
    setActiveNetworkNode(activeNodeId === id ? null : id);
  };

  return (
    <group ref={groupRef} position={[0, -20, 0]} scale={[0.8, 0.8, 0.8]}>
      {networkData.nodes.map(node => {
         const isHovered = hoveredNodeId === node.id;
         const isActive = activeNodeId === node.id;
         const scale = isActive ? 1.5 : (isHovered ? 1.2 : 1);
         return (
             <mesh 
                key={node.id} 
                position={node.position}
                scale={[scale, scale, scale]}
                onPointerOver={(e) => handlePointerOver(e, node.id)}
                onPointerOut={handlePointerOut}
                onClick={(e) => handleClick(e, node.id)}
             >
                <icosahedronGeometry args={[0.3, 0]} />
                <meshBasicMaterial color={isActive ? "#4d4dff" : "#ffffff"} wireframe />
                
                {(isActive || isHovered) && (
                   <Html distanceFactor={15} center position={[0, 0.6, 0]}>
                      <div style={{
                         color: isActive ? '#4d4dff' : '#ffffff',
                         fontFamily: 'monospace',
                         fontSize: '12px',
                         letterSpacing: '2px',
                         whiteSpace: 'nowrap',
                         background: 'rgba(3,3,5,0.8)',
                         padding: '4px 8px',
                         border: `1px solid ${isActive ? '#4d4dff' : 'rgba(255,255,255,0.2)'}`,
                         pointerEvents: 'none'
                      }}>
                         {node.label}
                      </div>
                   </Html>
                )}
             </mesh>
         )
      })}

      {lineGeometries.map(line => {
         const conn = networkData.connections.find(c => c.id === line.id);
         const isRelevant = activeNodeId 
            ? (conn.source === activeNodeId || conn.target === activeNodeId)
            : hoveredNodeId 
               ? (conn.source === hoveredNodeId || conn.target === hoveredNodeId)
               : false;
         
         const opacity = activeNodeId || hoveredNodeId
            ? (isRelevant ? 0.6 : 0.05)
            : 0.15;
            
         return (
             <line key={line.id} geometry={line.geo}>
                <lineBasicMaterial color="#ffffff" transparent opacity={opacity} />
             </line>
         )
      })}

      <PacketSystem connections={networkData.connections} nodes={networkData.nodes} />
    </group>
  );
};
