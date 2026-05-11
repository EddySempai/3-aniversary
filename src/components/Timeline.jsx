import { useRef, useMemo, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Heart, X } from 'lucide-react';
import TypewriterTitle from './TypewriterTitle';
import './Timeline.css';

gsap.registerPlugin(ScrollTrigger);

const milestones = [
  {
    id: 1,
    title: "Nuestro primer viaje",
    date: "14 de Febrero, 2023",
    image: "/timeline_trip_1777576085342.png",
    description: "El inicio de nuestras aventuras por el mundo.",
    quote: '"El mundo es demasiado hermoso para viajar por él sin ti."'
  },
  {
    id: 2,
    title: "Un café juntos",
    date: "20 de Mayo, 2023",
    image: "/gallery_coffee_1777576113032.png",
    description: "Tardes enteras hablando de nuestros sueños.",
    quote: '"El amor, como un buen café, se disfruta sorbo a sorbo y sin prisa."'
  },
  {
    id: 3,
    title: "Atardecer inolvidable",
    date: "10 de Agosto, 2024",
    image: "/gallery_sunset_1777576125396.png",
    description: "Caminando juntos bajo el cielo de colores.",
    quote: '"Incluso el sol se detiene a admirar lo nuestro antes de ocultarse."'
  },
  {
    id: 4,
    title: "De la mano, siempre",
    date: "Hoy y siempre",
    image: "/gallery_hands_1777576098411.png",
    description: "Sosteniendo mi mundo entero en tus manos.",
    quote: '"Mientras nuestras manos estén entrelazadas, no hay camino imposible."'
  }
];

const Timeline = () => {
  const container = useRef(null);
  const [activePhoto, setActivePhoto] = useState(null);
  const modalPhotoRef = useRef(null);

  useGSAP(() => {
    // Animate the line using scaleY for better performance and to ensure it renders correctly
    gsap.fromTo('.timeline-line', 
      { scaleY: 0, xPercent: -50 },
      {
        scaleY: 1,
        xPercent: -50,
        ease: 'none',
        scrollTrigger: {
          trigger: '.timeline-container',
          start: 'top center',
          end: 'bottom center',
          scrub: 1.5
        }
      }
    );

    // Floating hearts animation (continuous independent movement)
    const animateHeart = (heart) => {
      gsap.to(heart, {
        y: `+=${gsap.utils.random(-80, 80)}`,
        x: `+=${gsap.utils.random(-80, 80)}`,
        rotation: `+=${gsap.utils.random(-45, 45)}`,
        scale: gsap.utils.random(0.8, 1.2),
        duration: gsap.utils.random(4, 8),
        ease: 'sine.inOut',
        onComplete: () => animateHeart(heart)
      });
    };
    gsap.utils.toArray('.floating-heart').forEach(animateHeart);

    // Animate the cards, quotes, and dots
    const items = gsap.utils.toArray('.timeline-item');
    
    items.forEach((item, i) => {
      const card = item.querySelector('.timeline-content');
      const quote = item.querySelector('.timeline-quote');
      const dot = item.querySelector('.timeline-dot');
      
      const direction = i % 2 === 0 ? -50 : 50;
      
      // Card animation
      gsap.fromTo(card,
        { x: direction, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Quote animation (handwriting style)
      if (quote) {
        // Also ensure quote text is left-aligned to make the effect natural
        const pTag = quote.querySelector('p');
        gsap.fromTo(pTag,
          { clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)', opacity: 0 },
          {
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            opacity: 1,
            duration: 2.5,
            delay: 0.5,
            ease: 'power2.inOut',
            scrollTrigger: {
              trigger: item,
              start: 'top 80%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }

      // Dot scale animation when line reaches it
      gsap.fromTo(dot,
        { scale: 1 },
        {
          scale: 1.5,
          backgroundColor: 'var(--color-primary)', // Fill the dot
          duration: 0.5,
          ease: 'back.out(2)',
          scrollTrigger: {
            trigger: dot,
            start: 'top center', // Trigger when dot hits the center
            toggleActions: 'play none none reverse'
          }
        }
      );
    });
  }, { scope: container });

  // Generate random positions for floating hearts once
  const floatingHearts = useMemo(() => Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 20 + 10,
    opacity: Math.random() * 0.4 + 0.1
  })), []);

  const openPhoto = (milestone) => {
    setActivePhoto(milestone);
    document.body.style.overflow = 'hidden';
  };

  const closePhoto = () => {
    setActivePhoto(null);
    document.body.style.overflow = '';
  };

  const handleMouseMove = (e) => {
    if (!modalPhotoRef.current) return;
    const rect = modalPhotoRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate rotation between -20 and 20 degrees based on mouse position
    const xPct = (x / rect.width - 0.5) * 2;
    const yPct = (y / rect.height - 0.5) * 2;
    
    gsap.to('.active-polaroid', {
      rotationY: xPct * 20,
      rotationX: -yPct * 20,
      ease: 'power2.out',
      duration: 0.5,
      transformPerspective: 1000,
      transformOrigin: 'center center'
    });
  };

  const handleMouseLeave = () => {
    gsap.to('.active-polaroid', {
      rotationY: 0,
      rotationX: 0,
      ease: 'power3.out',
      duration: 0.8
    });
  };

  // Entrance animation for modal
  useGSAP(() => {
    if (activePhoto) {
      gsap.fromTo('.photo-modal-overlay', { opacity: 0 }, { opacity: 1, duration: 0.3 });
      gsap.fromTo('.active-polaroid', 
        { scale: 0.5, opacity: 0, rotationX: 45 }, 
        { scale: 1, opacity: 1, rotationX: 0, duration: 0.6, ease: 'back.out(1.5)', transformPerspective: 1000 }
      );
    }
  }, [activePhoto]);

  return (
    <section ref={container} className="section timeline-section">
      {/* Floating Elements Background */}
      <div className="floating-background">
        {floatingHearts.map((heart) => (
          <div 
            key={heart.id} 
            className="floating-heart" 
            style={{ 
              top: heart.top, 
              left: heart.left, 
              opacity: heart.opacity 
            }}
          >
            <Heart size={heart.size} fill="var(--color-primary)" color="var(--color-primary)" />
          </div>
        ))}
      </div>

      <TypewriterTitle text="Nuestra Historia" />
      
      <div className="timeline-container">
        <div className="timeline-line-bg"></div>
        <div className="timeline-line"></div>
        
        {milestones.map((milestone, index) => {
          const isLeft = index % 2 === 0;
          return (
            <div key={milestone.id} className={`timeline-item ${isLeft ? 'left' : 'right'}`}>
              <div className="timeline-dot"></div>
              
              <div className="timeline-content glass">
                <div 
                  className="polaroid clickable" 
                  onClick={() => openPhoto(milestone)}
                  title="Haz clic para ver más de cerca"
                >
                  <div className="polaroid-img-wrapper">
                    <img src={milestone.image} alt={milestone.title} />
                  </div>
                  <div className="polaroid-caption">
                    <span className="date">{milestone.date}</span>
                  </div>
                </div>
                <div className="timeline-text">
                  <h3>{milestone.title}</h3>
                  <p>{milestone.description}</p>
                </div>
              </div>

              <div className="timeline-quote">
                <p>{milestone.quote}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3D Photo Modal Overlay */}
      {activePhoto && (
        <div className="photo-modal-overlay" onClick={closePhoto}>
          <button className="close-modal-btn" onClick={closePhoto}>
            <X size={32} />
          </button>
          
          <div 
            className="photo-modal-content" 
            ref={modalPhotoRef}
            onMouseMove={handleMouseMove} 
            onMouseLeave={handleMouseLeave}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the photo wrapper
          >
            <div className="polaroid active-polaroid">
              <div className="polaroid-img-wrapper">
                <img src={activePhoto.image} alt={activePhoto.title} />
              </div>
              <div className="polaroid-caption">
                <span className="date">{activePhoto.date}</span>
                <h3 className="modal-title">{activePhoto.title}</h3>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Timeline;
