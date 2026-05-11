import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Heart as HeartIcon } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import TypewriterTitle from './TypewriterTitle';
import './MusicPlayer.css';

const NUM_BARS = 41;
// Heights to form a heart shape (0-100 scale)
const heartHeights = [
  2, 5, 10, 18, 30, 45, 65, 85, 95, 100, 100, 95, 85, 70, 55, 42, 32, 24, 20, 18,
  15,
  18, 20, 24, 32, 42, 55, 70, 85, 95, 100, 100, 95, 85, 65, 45, 30, 18, 10, 5, 2
];

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const playerRef = useRef(null);
  const progressInterval = useRef(null);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (isPlaying) {
      // 4:11 = 251 seconds
      progressInterval.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + (100 / 251); 
        });
      }, 1000);
    } else {
      clearInterval(progressInterval.current);
    }

    return () => clearInterval(progressInterval.current);
  }, [isPlaying]);

  const recordTween = useRef(null);
  const waveTimeout = useRef(null);

  const { contextSafe } = useGSAP(() => {
    gsap.from('.player-container', {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.music-section',
        start: 'top 80%',
      }
    });

    recordTween.current = gsap.to('.record-image', {
      rotation: "+=360",
      duration: 4,
      repeat: -1,
      ease: "none",
      paused: true
    });
  }, { scope: playerRef });

  const updatePlayState = contextSafe((playing) => {
    if (playing) {
      recordTween.current?.play();

      // Sound waves animation
      const animateWaves = () => {
        // 15% chance to form a heart, otherwise random heights
        const isHeart = Math.random() < 0.15;
        
        gsap.utils.toArray('.sound-bar').forEach((bar, i) => {
          const targetHeight = isHeart ? heartHeights[i] : gsap.utils.random(10, 100);
          gsap.to(bar, {
            height: `${targetHeight}%`,
            duration: isHeart ? 1.5 : 0.4, // Heart holds slightly longer
            ease: isHeart ? 'power2.out' : 'sine.inOut',
            overwrite: 'auto'
          });
        });
        
        // Schedule next wave
        waveTimeout.current = gsap.delayedCall(isHeart ? 2 : 0.4, animateWaves);
      };
      
      animateWaves();

    } else {
      recordTween.current?.pause();
      if (waveTimeout.current) {
        waveTimeout.current.kill();
      }
      gsap.killTweensOf('.sound-bar');
      // Reset bars to a flat line when paused
      gsap.to('.sound-bar', { height: '5%', duration: 0.5, ease: 'power2.out' });
    }
  });

  useEffect(() => {
    updatePlayState(isPlaying);
  }, [isPlaying]);

  // Calculate formatted time based on progress
  const currentSeconds = Math.floor((progress / 100) * 251);
  const currentMins = Math.floor(currentSeconds / 60);
  const currentSecs = currentSeconds % 60;

  return (
    <section className="section music-section" ref={playerRef}>
      <TypewriterTitle text="Nuestra Canción" />
      
      {/* Sound Waves Background */}
      <div className="sound-waves-bg">
        {Array.from({ length: NUM_BARS }).map((_, i) => (
          <div key={i} className="sound-bar-container">
            <div className="sound-bar"></div>
          </div>
        ))}
      </div>
      
      <div className="player-wrapper">
        <div className="player-container glass">
          <div className="album-art">
            <div className={`record-wrapper ${isPlaying ? 'playing' : ''}`}>
               <img src="/gallery_hands_1777576098411.png" alt="Album Cover" className="record-image" />
               <div className="record-hole"></div>
            </div>
          </div>
          
          <div className="player-controls">
            <div className="song-info">
              <h3>Die With A Smile</h3>
              <p>Bruno Mars & Lady Gaga</p>
              <HeartIcon className="heart-icon" size={20} fill="var(--color-primary)" color="var(--color-primary)" />
            </div>
            
            <div className="progress-bar-container">
              <span className="time">{currentMins}:{currentSecs.toString().padStart(2, '0')}</span>
              <div className="progress-bar">
                <div className="progress" style={{ width: `${progress}%` }}></div>
              </div>
              <span className="time">4:11</span>
            </div>
            
            <div className="buttons">
              <button className="control-btn"><SkipBack size={24} /></button>
              <button className="play-btn" onClick={togglePlay}>
                {isPlaying ? <Pause size={32} fill="white" /> : <Play size={32} fill="white" className="play-icon-fix" />}
              </button>
              <button className="control-btn"><SkipForward size={24} /></button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MusicPlayer;
