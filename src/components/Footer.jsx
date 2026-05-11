import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import { Heart } from 'lucide-react';
import TypewriterTitle from './TypewriterTitle';
import './Footer.css';

gsap.registerPlugin(ScrollTrigger, TextPlugin);

const Footer = () => {
  const footerRef = useRef();

  useGSAP(() => {
    gsap.from('.letter-card', {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.footer-section',
        start: 'top 80%',
      }
    });

    // Complex Typewriter with Mistakes
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.letter-text',
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });

    tl.to('.letter-text', { duration: 8, text: "Han pasado 3 años increíbles a tu lado, llenos de risas, aventuras y mucho ", ease: "none" })
      .to('.letter-text', { duration: 3, text: "Han pasado 3 años increíbles a tu lado, llenos de risas, aventuras y mucho dolor", ease: "none" })
      .to('.letter-text', { duration: 3, text: "Han pasado 3 años increíbles a tu lado, llenos de risas, aventuras y mucho ", ease: "none", delay: 0.5 }) // backspace
      .to('.letter-text', { duration: 1, text: "Han pasado 3 años increíbles a tu lado, llenos de risas, aventuras y mucho amor. ", ease: "none" })
      .to('.letter-text', { duration: 9, text: "Han pasado 3 años increíbles a tu lado, llenos de risas, aventuras y mucho amor. Cada día me enamoro más de ti y de todo lo que estamos construyendo ", ease: "none", delay: 0.3 })
      .to('.letter-text', { duration: 1, text: "Han pasado 3 años increíbles a tu lado, llenos de risas, aventuras y mucho amor. Cada día me enamoro más de ti y de todo lo que estamos construyendo solos", ease: "none" })
      .to('.letter-text', { duration: 3, text: "Han pasado 3 años increíbles a tu lado, llenos de risas, aventuras y mucho amor. Cada día me enamoro más de ti y de todo lo que estamos construyendo ", ease: "none", delay: 0.5 }) // backspace
      .to('.letter-text', { duration: 2, text: "Han pasado 3 años increíbles a tu lado, llenos de risas, aventuras y mucho amor. Cada día me enamoro más de ti y de todo lo que estamos construyendo juntos. ", ease: "none" })
      .to('.letter-text', { duration: 9, text: "Han pasado 3 años increíbles a tu lado, llenos de risas, aventuras y mucho amor. Cada día me enamoro más de ti y de todo lo que estamos construyendo juntos. Gracias por ser mi compañera, mi mejor amiga y el amor de mi vida.", ease: "none", delay: 0.4 });
    
    gsap.fromTo('.letter-signature strong', 
      { clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)', opacity: 0, x: -20 },
      {
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        opacity: 1,
        x: 0,
        duration: 2.5,
        delay: tl.duration() + 0.5, // Start after letter finishes
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: '.letter-card',
          start: 'top 80%',
        }
      }
    );

    gsap.to('.beating-heart', {
      scale: 1.2,
      duration: 0.8,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    });
  }, { scope: footerRef });

  return (
    <footer className="footer-section" ref={footerRef}>
      <div className="section">
        <div className="letter-card glass">
          <TypewriterTitle text="Para mi Solecito" className="letter-title" />
          <p className="letter-text"></p>
          <p className="letter-signature">
            Con todo mi amor,<br/>
            <strong>Eduin</strong>
          </p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>Hecho con <Heart className="beating-heart" size={16} fill="var(--color-primary)" color="var(--color-primary)" /> para nuestro 3er Aniversario</p>
        <p className="footer-date">2023 - Siempre</p>
      </div>
    </footer>
  );
};

export default Footer;
