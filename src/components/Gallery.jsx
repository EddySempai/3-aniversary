import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TypewriterTitle from './TypewriterTitle';
import './Gallery.css';

gsap.registerPlugin(ScrollTrigger);

const images = [
  { id: 1, src: '/gallery_sunset_1777576125396.png', className: 'tall' },
  { id: 2, src: '/gallery_hands_1777576098411.png', className: 'wide' },
  { id: 3, src: '/gallery_coffee_1777576113032.png', className: 'small' },
  { id: 4, src: '/timeline_trip_1777576085342.png', className: 'big' },
];

const Gallery = () => {
  const galleryRef = useRef();

  useGSAP(() => {
    const items = gsap.utils.toArray('.gallery-item');
    
    items.forEach((item) => {
      gsap.fromTo(item, 
        { y: 100, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });
  }, { scope: galleryRef });

  return (
    <section className="section gallery-section" ref={galleryRef}>
      <TypewriterTitle text="Momentos Inolvidables" />
      
      <div className="masonry-grid">
        {images.map((img) => (
          <div key={img.id} className={`gallery-item ${img.className}`}>
            <div className="gallery-img-wrapper">
              <img src={img.src} alt="Gallery moment" />
              <div className="gallery-overlay">
                <HeartIcon />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const HeartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
);

export default Gallery;
