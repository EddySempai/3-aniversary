import { useRef, useMemo, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Heart, X } from 'lucide-react';
import TypewriterTitle from './TypewriterTitle';
import './Timeline.css';
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(ScrollTrigger, TextPlugin);

const images = import.meta.glob('../History/*.jpg', { eager: true });

const rawMilestones = [
  { file: "Primera cita.jpg", title: "Nuestra Primera Cita", phrase: "El comienzo de todo." },
  { file: "Mi primer dibujo a ti.jpg", title: "Mi Primer Dibujo Para Ti", phrase: "Un detalle con el corazón." },
  { file: "Nuestro primer mes.jpg", title: "Nuestro Primer Mes", phrase: "Un mes de pura felicidad." },
  { file: "mi primer cumple junto a ti.jpg", title: "Mi Primer Cumpleaños Contigo", phrase: "Celebrando la vida a tu lado." },
  { file: "Cita de los 3 meses.jpg", title: "Cita de los 3 Meses", phrase: "Tres meses llenos de amor." },
  { file: "Nuestra primera aventura (sale mal).jpg", title: "Nuestra Primera Aventura (Sale Mal)", phrase: "Risas que superan cualquier imprevisto." },
  { file: "cita de los 5 mese.jpg", title: "Cita de los 5 Meses", phrase: "Cinco meses construyendo algo hermoso." },
  { file: "cita de los 6 meses.jpg", title: "Cita de los 6 Meses", phrase: "Medio año de pura magia." },
  { file: "Nuestro primer concierto juntos.jpg", title: "Nuestro Primer Concierto Juntos", phrase: "Cantando a todo pulmón." },
  { file: "Nuestra primera navidad juntos.jpg", title: "Nuestra Primera Navidad Juntos", phrase: "La mejor época del año contigo." },
  { file: "Nuestro primer fin de años juntos.jpg", title: "Nuestro Primer Fin de Año Juntos", phrase: "Recibiendo el año con el mejor abrazo." },
  { file: "Cita en el cine.jpg", title: "Cita en el Cine", phrase: "Pelis, palomitas y tu compañía." },
  { file: "San valentin.jpg", title: "San Valentín", phrase: "El amor en su máxima expresión." },
  { file: "Tu primer Cumpleaños juntos.jpg", title: "Tu Primer Cumpleaños Juntos", phrase: "Tu día especial, el más feliz para mí." },
  { file: "Cita en el parque.jpg", title: "Cita en el Parque", phrase: "Tardes tranquilas que valen oro." },
  { file: "Feliz primer año junto.jpg", title: "Feliz Primer Año Juntos", phrase: "Un año de amor inolvidable." },
  { file: "Sacando el pasaporte.jpg", title: "Sacando el Pasaporte", phrase: "Listos para recorrer el mundo." },
  { file: "A por un helado.jpg", title: "A por un Helado", phrase: "Momentos dulces como tú." },
  { file: "mis primeras rosas, gracias amor.jpg", title: "Mis Primeras Rosas, Gracias Amor", phrase: "Un detalle que florece en mi corazón." },
  { file: "Mi segundo cumple contigo.jpg", title: "Mi Segundo Cumpleaños Contigo", phrase: "Otro año celebrando tu vida." },
  { file: "Nos mudamos juntos.jpg", title: "Nos Mudamos Juntos", phrase: "Nuestro propio espacio, nuestro hogar." },
  { file: "Nuesto primer viaje juntos.jpg", title: "Nuestro Primer Viaje Juntos", phrase: "Descubriendo nuevos lugares de la mano." },
  { file: "A las montañas.jpg", title: "A las Montañas", phrase: "Tocando el cielo contigo." },
  { file: "salida  a la picina.jpg", title: "Salida a la Piscina", phrase: "Días de sol y diversión." },
  { file: "celebrando juntos mas timepo junto.jpg", title: "Celebrando Juntos Más Tiempo", phrase: "Brindando por nuestro amor." },
  { file: "cita en los videogames.jpg", title: "Cita en los Videojuegos", phrase: "Jugando y ganando en el amor." },
  { file: "videojuegos parte 2.jpg", title: "Videojuegos Parte 2", phrase: "La revancha más divertida." },
  { file: "segunda navidad juntos.jpg", title: "Segunda Navidad Juntos", phrase: "Navidad brilla más a tu lado." },
  { file: "cita en el rio.jpg", title: "Cita en el Río", phrase: "Naturaleza y amor en sintonía." },
  { file: "segundo años nuevo juntos.jpg", title: "Segundo Año Nuevo Juntos", phrase: "Otro año que empieza perfecto." },
  { file: "segundo san valentin juntos.jpg", title: "Segundo San Valentín Juntos", phrase: "Reafirmando lo que sentimos." },
  { file: "Tu segundo cumpelaños.jpg", title: "Tu Segundo Cumpleaños", phrase: "Celebrando tu existencia." },
  { file: "pa la playa juntitos.jpg", title: "Pa' la Playa Juntitos", phrase: "Sol, arena y tú." },
  { file: "Segunda cita en el parque.jpg", title: "Segunda Cita en el Parque", phrase: "Volviendo a nuestros lugares favoritos." },
  { file: "segundo aniversario te amo.jpg", title: "Segundo Aniversario, Te Amo", phrase: "Dos años de amarte cada día más." },
  { file: "Juntos avanzamos en el gym.jpg", title: "Juntos Avanzamos en el Gym", phrase: "Entrenando cuerpo y alma." },
  { file: "Feliz dia de las flores amarillas.jpg", title: "Feliz Día de las Flores Amarillas", phrase: "Un detalle para la más hermosa." },
  { file: "viaje al zoologico.jpg", title: "Viaje al Zoológico", phrase: "Conociendo el mundo animal juntos." },
  { file: "vamos a las picina parte 2.jpg", title: "Vamos a la Piscina Parte 2", phrase: "Más momentos refrescantes." },
  { file: "se acerca navidad y ya me dieron mi regalo.jpg", title: "Se Acerca Navidad", phrase: "El mejor regalo eres tú." },
  { file: "tercera navidad juntos.jpg", title: "Tercera Navidad Juntos", phrase: "Tradiciones que amamos." },
  { file: "A un 15 años vamos.jpg", title: "A un 15 Años Vamos", phrase: "De fiesta y elegantes." },
  { file: "tercer año nuevo juntos vamos por mas.jpg", title: "Tercer Año Nuevo Juntos", phrase: "Tres años iniciando juntos." },
  { file: "al rio parte 3.jpg", title: "Al Río Parte 3", phrase: "Nuestros paseos favoritos." },
  { file: "tercer Cumple juntos.jpg", title: "Tercer Cumpleaños Juntos", phrase: "Tres años celebrando tu vida." },
  { file: "pa la playa juntitos parte 2.jpg", title: "Pa' la Playa Juntitos Parte 2", phrase: "Siempre con ganas de volver al mar." }
];

const milestones = rawMilestones.map((item, index) => {
  const imagePath = `../History/${item.file}`;
  const resolvedImage = images[imagePath]?.default || images[imagePath];
  
  return {
    id: index + 1,
    title: item.title,
    date: `Paso ${index + 1}`,
    image: resolvedImage,
    description: item.phrase,
    quote: `"${item.phrase}"`
  };
});

const Timeline = () => {
  const container = useRef(null);
  const [activePhoto, setActivePhoto] = useState(null);
  const modalPhotoRef = useRef(null);
  const [anniversaryEvent, setAnniversaryEvent] = useState(null);

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

    // Triggers for Anniversaries
    ScrollTrigger.create({
      trigger: '.anniversary-trigger-1',
      start: 'top 75%',
      onEnter: () => setAnniversaryEvent({ text: "1 ANIVERSARIO JUNTOS" }),
    });

    ScrollTrigger.create({
      trigger: '.anniversary-trigger-2',
      start: 'top 75%',
      onEnter: () => setAnniversaryEvent({ text: "2 ANIVERSARIO JUNTOS" }),
    });

  }, { scope: container });

  // Generate random positions for floating hearts once
  const floatingHearts = useMemo(() => Array.from({ length: 100 }).map((_, i) => ({
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

  const createHeartExplosion = () => {
    const container = document.querySelector('.anniversary-overlay');
    if (!container) return;
    
    for (let i = 0; i < 50; i++) {
      const heart = document.createElement('div');
      heart.className = 'explosion-heart';
      heart.innerHTML = '❤️';
      heart.style.position = 'absolute';
      heart.style.top = '50%';
      heart.style.left = '50%';
      container.appendChild(heart);
      
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 300 + 100;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      
      gsap.to(heart, {
        x: x,
        y: y,
        opacity: 0,
        scale: Math.random() * 2 + 0.5,
        duration: Math.random() * 2 + 2,
        ease: 'power2.out',
        onComplete: () => heart.remove()
      });
    }
  };

  useEffect(() => {
    if (anniversaryEvent) {
      // Typewriter effect
      gsap.fromTo('.anniversary-typewriter', 
        { text: "" },
        { text: anniversaryEvent.text, duration: 2, ease: "none" }
      );
      
      // Heart explosion
      createHeartExplosion();
      
      // Auto close
      const timer = setTimeout(() => {
        setAnniversaryEvent(null);
      }, 4000);
      
      return () => clearTimeout(timer);
    }
  }, [anniversaryEvent]);

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
            <div key={milestone.id} className={`timeline-item ${isLeft ? 'left' : 'right'} ${milestone.title === "Feliz Primer Año Juntos" ? 'anniversary-trigger-1' : ''} ${milestone.title === "Segundo Aniversario, Te Amo" ? 'anniversary-trigger-2' : ''}`}>
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
      {/* Anniversary Overlay */}
      {anniversaryEvent && (
        <div className="anniversary-overlay">
          <h1 className="anniversary-typewriter">{anniversaryEvent.text}</h1>
        </div>
      )}
    </section>
  );
};

export default Timeline;
