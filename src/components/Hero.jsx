import { useEffect, useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import TypewriterTitle from './TypewriterTitle';
import './Hero.css';

const Hero = () => {
  const container = useRef();
  
  const [timePassed, setTimePassed] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const startDate = new Date('2023-05-11T14:00:00-04:00');

    const updateCounter = () => {
      const now = new Date();
      let years = now.getFullYear() - startDate.getFullYear();
      let months = now.getMonth() - startDate.getMonth();
      let days = now.getDate() - startDate.getDate();
      let hours = now.getHours() - startDate.getHours();
      let minutes = now.getMinutes() - startDate.getMinutes();
      let seconds = now.getSeconds() - startDate.getSeconds();

      if (seconds < 0) {
        seconds += 60;
        minutes--;
      }
      if (minutes < 0) {
        minutes += 60;
        hours--;
      }
      if (hours < 0) {
        hours += 24;
        days--;
      }
      if (days < 0) {
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonth.getDate();
        months--;
      }
      if (months < 0) {
        months += 12;
        years--;
      }
      
      setTimePassed({ years, months, days, hours, minutes, seconds });
    };

    updateCounter();
    const interval = setInterval(updateCounter, 1000);

    return () => clearInterval(interval);
  }, []);

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.from('.hero-bg', {
      scale: 1.1,
      duration: 3,
      ease: 'power2.out'
    })
    .from('.hero-content .subtitle', {
      y: 20,
      opacity: 0,
      duration: 1,
      ease: 'power2.out'
    }, "-=1.5")
    .from('.counter-box', {
      scale: 0.8,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'back.out(1.7)'
    }, "-=1");
  }, { scope: container });

  return (
    <section ref={container} className="hero-section">
      <div 
        className="hero-bg" 
        style={{ backgroundImage: `url('/hero_background_1777576070964.png')` }}
      ></div>
      <div className="hero-overlay"></div>
      
      <div className="hero-content">
        <p className="subtitle">Yesica & Eduin</p>
        <TypewriterTitle text="Feliz 3er Aniversario" as="h1" className="main-title" />
        
        <div className="counter-container glass">
          <div className="counter-box">
            <span className="number">{timePassed.years}</span>
            <span className="label">Años</span>
          </div>
          <div className="counter-divider">:</div>
          <div className="counter-box">
            <span className="number">{timePassed.months}</span>
            <span className="label">Meses</span>
          </div>
          <div className="counter-divider">:</div>
          <div className="counter-box">
            <span className="number">{timePassed.days}</span>
            <span className="label">Días</span>
          </div>
          <div className="counter-divider">:</div>
          <div className="counter-box">
            <span className="number">{timePassed.hours}</span>
            <span className="label">Horas</span>
          </div>
          <div className="counter-divider">:</div>
          <div className="counter-box">
            <span className="number">{timePassed.minutes}</span>
            <span className="label">Minutos</span>
          </div>
          <div className="counter-divider">:</div>
          <div className="counter-box">
            <span className="number">{timePassed.seconds}</span>
            <span className="label">Segundos</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
