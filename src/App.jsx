import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Hero from './components/Hero';
import Timeline from './components/Timeline';
import MusicPlayer from './components/MusicPlayer';
import Gallery from './components/Gallery';
import Footer from './components/Footer';

gsap.registerPlugin(useGSAP, ScrollTrigger);

function App() {
  const appRef = useRef();

  useGSAP(() => {
    // We can add global animations or just let components handle their own
  }, { scope: appRef });

  return (
    <div ref={appRef} className="app-container">
      <Hero />
      <Timeline />
      <MusicPlayer />
      <Gallery />
      <Footer />
    </div>
  );
}

export default App;
