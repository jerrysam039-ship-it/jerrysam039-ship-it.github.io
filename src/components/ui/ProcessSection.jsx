import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ProcessSection.css';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: '01',
    label: 'DISCOVER',
    description: 'Understand the problem space. Map the system. Identify what actually matters before touching a line of code.'
  },
  {
    number: '02',
    label: 'ARCHITECT',
    description: 'Design the interaction structure, data flow and component hierarchy. Engineering decisions happen here, not later.'
  },
  {
    number: '03',
    label: 'BUILD',
    description: 'Implement with precision. Every component, animation and interaction is purposeful and measurable.'
  },
  {
    number: '04',
    label: 'REFINE',
    description: 'Improve motion timing, responsive behavior and edge cases. The experience gets sharper at every pass.'
  },
  {
    number: '05',
    label: 'SHIP',
    description: 'Optimize, test across devices, deploy. Performance and accessibility are non-negotiable at this stage.'
  }
];

const ProcessSection = () => {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const stepsRef = useRef([]);
  const lineRef = useRef(null);

  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

      if (!isReducedMotion && lineRef.current) {
        gsap.fromTo(lineRef.current,
          { scaleX: 0 },
          {
            scaleX: 1, duration: 1.5, ease: 'power3.inOut',
            scrollTrigger: { trigger: lineRef.current, start: 'top 80%' }
          }
        );
      }

      stepsRef.current.forEach((step, idx) => {
        if (!step) return;
        gsap.fromTo(step,
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
            delay: isReducedMotion ? 0 : idx * 0.12,
            scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' }
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="process-section" ref={sectionRef} aria-label="Design and development process">
      <div className="container process-container">

        <header className="process-header" ref={headerRef}>
          <h3 className="technical-text process-eyebrow">HOW I WORK</h3>
          <h2 className="process-title">THE PROCESS</h2>
          <p className="process-intro">
            A repeatable system for building experiences that are intentional from start to finish.
          </p>
        </header>

        <div className="process-steps-wrapper">
          <div className="process-line" ref={lineRef} aria-hidden="true"></div>

          <ol className="process-steps">
            {steps.map((step, idx) => (
              <li
                key={step.number}
                className="process-step"
                ref={el => stepsRef.current[idx] = el}
              >
                <div className="process-step-dot" aria-hidden="true"></div>
                <div className="process-step-content">
                  <div className="technical-text process-step-number">{step.number}</div>
                  <h3 className="process-step-label">{step.label}</h3>
                  <p className="process-step-description">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

      </div>
    </section>
  );
};

export default ProcessSection;
