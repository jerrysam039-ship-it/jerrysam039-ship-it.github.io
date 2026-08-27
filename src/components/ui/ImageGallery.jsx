import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ImageGallery.css';

gsap.registerPlugin(ScrollTrigger);

const ImageGallery = ({ media }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    let ctx = gsap.context(() => {
      const items = containerRef.current.querySelectorAll('.media-item');
      
      items.forEach((item) => {
        gsap.fromTo(item, 
          { clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)', opacity: 0, y: 40 },
          {
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
            opacity: 1,
            y: 0,
            duration: 1.5,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 85%',
            }
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, [media]);

  if (!media || media.length === 0) return null;

  return (
    <div className="image-gallery-container" ref={containerRef}>
      {media.map((item, index) => (
        <div key={index} className={`media-item ${item.type === 'hero' ? 'is-hero' : ''}`}>
          <div className="media-visual" style={{ aspectRatio: item.aspectRatio || '16/9' }}>
            {item.src ? (
              <img src={item.src} alt={item.alt || 'Project Media'} className="media-image" loading="lazy" />
            ) : (
              <div className="media-placeholder">
                <div className="placeholder-content">
                  <div className="placeholder-icon"></div>
                  <div className="placeholder-text technical-text">{item.caption || 'PROJECT MEDIA PENDING'}</div>
                  <div className="placeholder-sub technical-text">VISUAL DOCUMENTATION COMING SOON</div>
                </div>
              </div>
            )}
          </div>
          {(item.title || item.caption) && (
            <div className="media-meta">
              {item.title && <h3 className="media-title technical-text">{item.title}</h3>}
              {item.caption && item.src && <p className="media-caption">{item.caption}</p>}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ImageGallery;
