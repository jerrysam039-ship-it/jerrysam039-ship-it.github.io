import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './SkillsSection.css';

gsap.registerPlugin(ScrollTrigger);

const skillGroups = [
  {
    id: 'frontend',
    label: 'FRONTEND',
    category: 'ENGINEERING',
    description: 'Building interfaces that feel intentional, responsive and fast.',
    skills: ['React', 'JavaScript', 'HTML5', 'CSS3', 'Vite', 'Responsive Design']
  },
  {
    id: 'creative',
    label: 'CREATIVE DEVELOPMENT',
    category: 'IMMERSIVE',
    description: 'Translating ideas into cinematic, interactive digital environments.',
    skills: ['Three.js', 'React Three Fiber', 'GSAP', 'ScrollTrigger', 'WebGL', 'Motion Design']
  },
  {
    id: 'engineering',
    label: 'ENGINEERING',
    category: 'ARCHITECTURE',
    description: 'Systems thinking, deployment and performance at every level.',
    skills: ['Network Engineering', 'GitHub Pages', 'Performance Optimization', 'Git', 'CI/CD', 'Accessibility']
  },
  {
    id: 'design',
    label: 'DESIGN',
    category: 'VISUAL SYSTEMS',
    description: 'Visual storytelling through typography, hierarchy and interaction.',
    skills: ['UI Design', 'Design Systems', 'Typography', 'Interaction Design', 'Visual Hierarchy', 'Dark Mode']
  }
];

const SkillsSection = () => {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const groupsRef = useRef([]);

  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReducedMotion) return;

    let ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(headerRef.current.children,
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power3.out',
            scrollTrigger: { trigger: headerRef.current, start: 'top 80%' }
          }
        );
      }

      groupsRef.current.forEach((group, idx) => {
        if (!group) return;
        gsap.fromTo(group,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
            delay: idx * 0.1,
            scrollTrigger: { trigger: group, start: 'top 85%' }
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="skills-section" ref={sectionRef} aria-label="Skills and Technologies">
      <div className="container skills-container">

        <header className="skills-header" ref={headerRef}>
          <h3 className="technical-text skills-eyebrow">TECHNICAL FOUNDATION</h3>
          <h2 className="skills-title">SKILLS &amp; TECHNOLOGY</h2>
          <p className="skills-intro">
            Technologies and disciplines I actively use to build, engineer and ship digital experiences.
          </p>
        </header>

        <div className="skills-grid">
          {skillGroups.map((group, idx) => (
            <article
              key={group.id}
              className="skill-group"
              ref={el => groupsRef.current[idx] = el}
            >
              <div className="skill-group-header">
                <span className="technical-text skill-category">{group.category}</span>
                <h3 className="skill-group-label">{group.label}</h3>
              </div>
              <p className="skill-group-description">{group.description}</p>
              <ul className="skill-list" aria-label={`${group.label} skills`}>
                {group.skills.map(skill => (
                  <li key={skill} className="skill-item technical-text">{skill}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
};

export default SkillsSection;
