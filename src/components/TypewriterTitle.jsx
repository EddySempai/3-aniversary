import { useRef, useEffect, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(ScrollTrigger, TextPlugin);

const TypewriterTitle = ({ text, className = "title", as: Tag = "h2" }) => {
  const titleRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(titleRef.current,
      { text: "" },
      {
        duration: text.length * 0.08, // Adjust speed based on length
        text: text,
        ease: "none",
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );
  }, { scope: titleRef });

  return <Tag ref={titleRef} className={className} style={{ minHeight: '1.2em' }}>{text}</Tag>;
};

export default TypewriterTitle;
