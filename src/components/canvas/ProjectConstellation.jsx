import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { useStore } from '../../utils/store';
import { projects } from '../../data/projects';
import { useNavigate } from 'react-router-dom';

const ProjectNode = ({ project, isActiveFilter, onHover, onClick }) => {
  const meshRef = useRef();
  const htmlRef = useRef();
  const { hoveredProject, activeProject } = useStore();
  
  const isHovered = hoveredProject === project.id;
  const isSelected = activeProject === project.id;
  
  // Determine size based on weight
  const baseScale = project.weight === 'PRIMARY' ? 1.5 : project.weight === 'SECONDARY' ? 1.0 : 0.6;
  const targetScale = isSelected ? baseScale * 2 : isHovered ? baseScale * 1.3 : baseScale;
  
  // Determine opacity based on filter
  const targetOpacity = isActiveFilter ? 1 : 0.1;

  useEffect(() => {
    if (meshRef.current) {
      gsap.to(meshRef.current.scale, {
        x: targetScale,
        y: targetScale,
        z: targetScale,
        duration: 0.5,
        ease: 'power2.out'
      });
      
      gsap.to(meshRef.current.material, {
        opacity: targetOpacity,
        duration: 0.8,
      });
    }
  }, [targetScale, targetOpacity]);

  return (
    <group position={project.position}>
      <mesh
        ref={meshRef}
        onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; onHover(project.id); }}
        onPointerOut={(e) => { e.stopPropagation(); document.body.style.cursor = 'auto'; onHover(null); }}
        onClick={(e) => { e.stopPropagation(); onClick(project); }}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial 
          color={isHovered || isSelected ? "#ffffff" : "#666666"} 
          transparent 
          opacity={1}
        />
      </mesh>
      
      {/* Label and Preview Overlay */}
      {isActiveFilter && (
        <Html 
          ref={htmlRef} 
          distanceFactor={15} 
          zIndexRange={[100, 0]}
          className={`project-node-html ${isHovered ? 'is-hovered' : ''}`}
          style={{
            pointerEvents: isHovered || isSelected ? 'auto' : 'none',
            opacity: isHovered || isSelected ? 1 : 0.5,
            transition: 'opacity 0.3s'
          }}
        >
          <div className="node-label" style={{ color: 'white', whiteSpace: 'nowrap', transform: 'translate3d(-50%, 15px, 0)' }}>
            <div className="node-title" style={{ fontSize: '1rem', fontWeight: 'bold' }}>
              <span style={{ color: 'var(--color-accent)', marginRight: '8px', fontSize: '0.8rem' }}>
                {String(projects.indexOf(project) + 1).padStart(2, '0')}
              </span>
              {project.title}
            </div>
            {isHovered && !isSelected && (
              <div className="node-preview" style={{ marginTop: '8px', background: 'rgba(0,0,0,0.85)', padding: '12px 16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="node-category technical-text" style={{ fontSize: '0.7rem', color: '#999', marginBottom: '8px' }}>{project.category}</div>
                {project.shortDescription && (
                  <div className="node-desc" style={{ fontSize: '0.85rem', color: '#ddd', marginBottom: '12px', whiteSpace: 'pre-wrap', lineHeight: '1.4' }}>
                    {project.shortDescription}
                  </div>
                )}
                {project.url ? (
                  <a 
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="node-cta technical-text" 
                    style={{ fontSize: '0.75rem', color: 'var(--color-accent)', textDecoration: 'none', display: 'inline-block', marginTop: '4px' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    VISIT LIVE PROJECT ↗
                  </a>
                ) : (
                  <div className="node-cta technical-text" style={{ fontSize: '0.75rem', color: 'var(--color-accent)', marginTop: '4px' }}>
                    EXPLORE CASE STUDY &rarr;
                  </div>
                )}
              </div>
            )}
          </div>
        </Html>
      )}
    </group>
  );
};

const ProjectConnections = ({ projects, activeFilter }) => {
  const lines = useMemo(() => {
    const arr = [];
    projects.forEach(p1 => {
      p1.connections.forEach(connId => {
        const p2 = projects.find(p => p.id === connId);
        if (p2) {
          // Avoid duplicates
          const id = [p1.id, p2.id].sort().join('-');
          if (!arr.find(l => l.id === id)) {
            arr.push({ id, start: p1.position, end: p2.position, p1, p2 });
          }
        }
      });
    });
    return arr;
  }, [projects]);

  const { hoveredProject, activeProject } = useStore();

  return (
    <group>
      {lines.map(line => {
        const isHovered = hoveredProject === line.p1.id || hoveredProject === line.p2.id;
        const isSelected = activeProject === line.p1.id || activeProject === line.p2.id;
        
        let opacity = 0.1;
        if (activeFilter !== 'ALL' && (line.p1.filterCategory !== activeFilter && line.p2.filterCategory !== activeFilter)) {
            opacity = 0.02; // very faint if not in filter
        } else if (isSelected) {
            opacity = 0.8;
        } else if (isHovered) {
            opacity = 0.5;
        }

        return (
          <Line 
            key={line.id}
            points={[line.start, line.end]}
            color="#ffffff"
            transparent
            opacity={opacity}
            lineWidth={isHovered || isSelected ? 2 : 1}
          />
        );
      })}
    </group>
  );
};

export const ProjectConstellation = () => {
  const groupRef = useRef();
  const { sceneState, activeFilter, setHoveredProject, setActiveProject, setSceneState } = useStore();
  const navigate = useNavigate();

  // Show only when in UNIVERSE or PROJECT state
  const isVisible = sceneState === 'UNIVERSE' || sceneState === 'PROJECT';

  useEffect(() => {
    if (groupRef.current) {
      // Bring the constellation into view or push it away
      gsap.to(groupRef.current.position, {
        z: isVisible ? 0 : -100,
        y: isVisible ? 0 : 50,
        duration: 2,
        ease: 'power3.inOut'
      });
      
      gsap.to(groupRef.current.scale, {
        x: isVisible ? 1 : 0.01,
        y: isVisible ? 1 : 0.01,
        z: isVisible ? 1 : 0.01,
        duration: 2,
        ease: 'power3.inOut'
      });
    }
  }, [isVisible]);

  const handleHover = (id) => {
    if (sceneState === 'UNIVERSE') {
      setHoveredProject(id);
    }
  };

  const handleClick = (project) => {
    if (sceneState === 'UNIVERSE') {
      setActiveProject(project.id);
      setSceneState('PROJECT'); // transition to project flight mode
      
      // Navigate to route after a short cinematic delay
      setTimeout(() => {
        document.body.style.cursor = 'auto';
        navigate(`/project/${project.slug}`);
      }, 1500);
    }
  };

  if (!isVisible) return <group ref={groupRef} position={[0, 50, -100]} scale={0.01} />;

  return (
    <group ref={groupRef} position={[0, 50, -100]} scale={0.01}>
      <ProjectConnections projects={projects} activeFilter={activeFilter} />
      {projects.map(project => (
        <ProjectNode 
          key={project.id} 
          project={project} 
          isActiveFilter={activeFilter === 'ALL' || project.filterCategory === activeFilter}
          onHover={handleHover}
          onClick={handleClick}
        />
      ))}
    </group>
  );
};
