import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Heart as HeartIcon, Music, VolumeX } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import TypewriterTitle from './TypewriterTitle';
import './MusicPlayer.css';
import song from '../music/Lady Gaga, Bruno Mars - Die With A Smile (Official Music Video) [kPa7bsKwL-c].mp3';
import cover from '../music/Portada de la musica.png';

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
  const [duration, setDuration] = useState(251); // Fallback to 251
  const playerRef = useRef(null);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => console.log("Play failed", err));
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const dur = audioRef.current.duration;
      setProgress((current / dur) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  useEffect(() => {
    // Attempt autoplay on mount
    const playAudio = async () => {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (err) {
        console.log("Autoplay blocked or failed", err);
      }
    };
    playAudio();
  }, []);

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

  // Calculate formatted time
  const currentSeconds = Math.floor((progress / 100) * duration);
  const currentMins = Math.floor(currentSeconds / 60);
  const currentSecs = currentSeconds % 60;
  
  const durMins = Math.floor(duration / 60);
  const durSecs = Math.floor(duration % 60);

  return (
    <section className="section music-section" ref={playerRef}>
      <TypewriterTitle text="Nuestra Canción" />
      
      {/* Audio Element */}
      <audio 
        ref={audioRef} 
        src={song} 
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Floating Control in corner */}
      <div className="floating-music-control" onClick={togglePlay}>
        {isPlaying ? <Music size={24} color="var(--color-primary)" /> : <VolumeX size={24} color="var(--color-primary)" />}
      </div>
      
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
               <img src={cover} alt="Album Cover" className="record-image" />
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
              <span className="time">{durMins}:{durSecs.toString().padStart(2, '0')}</span>
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
