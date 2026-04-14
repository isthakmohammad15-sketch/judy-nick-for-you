import { useState, useCallback, useEffect, useRef } from "react";
import Slide1Intro from "./slides/Slide1Intro";
import Slide2Memory from "./slides/Slide2Memory";
import Slide3Gallery from "./slides/Slide3Gallery";
import Slide4Timeline from "./slides/Slide4Timeline";
import Slide5Heart from "./slides/Slide5Heart";
import Slide6Letter from "./slides/Slide6Letter";
import Slide7Finale from "./slides/Slide7Finale";

// Import background music
// import backgroundMusic from "/audio/i like me better.mp3";
// import audioAise from "/audio/aise na javo piya.mp3";
// import audioAbhi from "/audio/abhi na javo.mp3";

console.log("SlideContainer loaded");

const TRACK_VOLUME = 0.45;
const INITIAL_COUNTDOWN = 5;

const SlideContainer = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [countdown, setCountdown] = useState(INITIAL_COUNTDOWN);
  const [countdownActive, setCountdownActive] = useState(true);
  const backgroundAudioRef = useRef<HTMLAudioElement>(null);
  const audioAiseRef = useRef<HTMLAudioElement>(null);
  const audioAbhiRef = useRef<HTMLAudioElement>(null);
  const [playlistStarted, setPlaylistStarted] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<0 | 1 | 2>(0);
  const [autoplayFailed, setAutoplayFailed] = useState(false);
  useEffect(() => {
    // Debug audio element creation
    console.log('Audio refs created:', {
      background: !!backgroundAudioRef.current,
      aise: !!audioAiseRef.current,
      abhi: !!audioAbhiRef.current
    });

    if (backgroundAudioRef.current) {
      console.log('Background audio src:', backgroundAudioRef.current.src);
    }
    if (audioAiseRef.current) {
      console.log('Aise audio src:', audioAiseRef.current.src);
    }
    if (audioAbhiRef.current) {
      console.log('Abhi audio src:', audioAbhiRef.current.src);
    }
  }, []);

  const playTone = (frequency: number, duration = 0.18) => {
    const AudioCtx = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    gain.gain.value = 0.12;

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.start();
    oscillator.stop(ctx.currentTime + duration);
    oscillator.onended = () => ctx.close();
  };

  useEffect(() => {
    if (!countdownActive) return;

    if (countdown <= 0) {
      playTone(880, 0.28);
      const doneTimer = window.setTimeout(() => {
        setCountdownActive(false);
      }, 1200);
      return () => window.clearTimeout(doneTimer);
    }

    playTone(260 + countdown * 80);
    const timer = window.setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [countdown, countdownActive]);

  const playTrack = (index: 0 | 1 | 2) => {
    const audioRefs = [backgroundAudioRef, audioAiseRef, audioAbhiRef] as const;
    const selectedRef = audioRefs[index]?.current;
    if (!selectedRef) {
      console.log(`Audio ref for track ${index} not found`);
      return;
    }

    console.log(`Playing track ${index}`);

    audioRefs.forEach((ref, idx) => {
      if (ref.current && idx !== index) {
        ref.current.pause();
        ref.current.currentTime = 0;
      }
    });

    selectedRef.volume = TRACK_VOLUME;
    selectedRef.currentTime = 0;
    selectedRef.play()
      .then(() => {
        console.log(`Track ${index} started playing`);
        setAutoplayFailed(false); // Reset autoplay failed flag on success
      })
      .catch((error) => {
        console.log(`Error playing track ${index}:`, error);
        setAutoplayFailed(true); // Set flag if autoplay fails
        // Try to play again on next user interaction
        if (error.name === 'NotAllowedError') {
          console.log('Autoplay blocked - will try again on user interaction');
        }
      });
    setCurrentTrack(index);
  };

  const handleTrackEnded = (index: 0 | 1 | 2) => {
    const nextTrack = index === 0 ? 1 : index === 1 ? 2 : 0; // Loop back to track 0 after track 2
    window.setTimeout(() => playTrack(nextTrack), 1500);
  };

  const stopPlaylist = () => {
    [backgroundAudioRef, audioAiseRef, audioAbhiRef].forEach((ref) => {
      if (ref.current) {
        ref.current.pause();
        ref.current.currentTime = 0;
      }
    });
    setPlaylistStarted(false);
    setCurrentTrack(0);
  };

  useEffect(() => {
    // Try to start playlist immediately on mount
    console.log('Component mounted - attempting autoplay');
    if (backgroundAudioRef.current && !playlistStarted) {
      backgroundAudioRef.current.loop = false;
      playTrack(0);
      setPlaylistStarted(true);
    }
  }, []); // Empty dependency array - run only on mount

  useEffect(() => {
    console.log(`useEffect check: countdownActive=${countdownActive}, playlistStarted=${playlistStarted}`);
    if (countdownActive || playlistStarted) return;
    console.log('Starting playlist after countdown...');
    if (backgroundAudioRef.current) {
      backgroundAudioRef.current.loop = false;
      playTrack(0);
      setPlaylistStarted(true);
    }
  }, [countdownActive, playlistStarted]);

  // Pause/resume background music based on slide with smooth fade
  useEffect(() => {
    const activeAudioRef = [backgroundAudioRef, audioAiseRef, audioAbhiRef][currentTrack]?.current;
    if (!activeAudioRef || !playlistStarted) return;

    const shouldPause = currentSlide === 1; // Pause only during Slide 2
    const targetVolume = TRACK_VOLUME;

    if (shouldPause && !activeAudioRef.paused) {
      const fadeOut = () => {
        if (activeAudioRef.volume > 0.05) {
          activeAudioRef.volume = Math.max(0, activeAudioRef.volume - 0.05);
          setTimeout(fadeOut, 50);
        } else {
          activeAudioRef.pause();
        }
      };
      fadeOut();
    } else if (!shouldPause && activeAudioRef.paused) {
      activeAudioRef.play().catch(() => {});
      const fadeIn = () => {
        if (activeAudioRef.volume < targetVolume) {
          activeAudioRef.volume = Math.min(targetVolume, activeAudioRef.volume + 0.05);
          setTimeout(fadeIn, 50);
        }
      };
      fadeIn();
    }
  }, [currentSlide, playlistStarted, currentTrack]);

  const goNext = useCallback(() => {
    setCurrentSlide((prev) => Math.min(prev + 1, 6));
  }, []);

  const goTo = useCallback((index: number) => {
    if (index === 0) {
      // Reset everything for replay
      setCountdown(INITIAL_COUNTDOWN);
      setCountdownActive(true);
      stopPlaylist();
    }
    setCurrentSlide(index);
  }, []);

  const slides = [
    <Slide1Intro key={0} onNext={goNext} />,
    <Slide2Memory key={1} onNext={goNext} isActive={currentSlide === 1} />,
    <Slide3Gallery key={2} onNext={goNext} />,
    <Slide4Timeline key={3} onNext={goNext} />,
    <Slide5Heart key={4} onNext={goNext} />,
    <Slide6Letter key={5} onNext={goNext} />,
    <Slide7Finale key={6} onReplay={() => goTo(0)} />,
  ];

  return (
    console.log('Rendering SlideContainer'),
    <div
      className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-background"
      onClick={async () => {
        console.log('User clicked');

        // Resume audio context if needed
        const AudioCtx = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          try {
            const ctx = new AudioCtx();
            if (ctx.state === 'suspended') {
              await ctx.resume();
              console.log('Audio context resumed');
            }
            ctx.close();
          } catch (error) {
            console.log('Error resuming audio context:', error);
          }
        }

        // If autoplay failed, try to play the current track again
        if (autoplayFailed && playlistStarted) {
          console.log('Retrying audio playback after user interaction');
          const activeAudioRef = [backgroundAudioRef, audioAiseRef, audioAbhiRef][currentTrack]?.current;
          if (activeAudioRef) {
            activeAudioRef.play()
              .then(() => {
                console.log('Audio playback resumed after user interaction');
                setAutoplayFailed(false);
              })
              .catch((error) => console.log('Still failed to play audio:', error));
          }
        }
      }}
    >
      {/* Background audio */}
      <audio
        ref={backgroundAudioRef}
        src="/audio/i like me better.mp3"
        onEnded={() => handleTrackEnded(0)}
        onLoadStart={() => console.log('Background audio load start')}
        onCanPlay={() => console.log('Background audio can play')}
        onError={(e) => console.log('Background audio error:', e)}
        preload="auto"
      />
      <audio
        ref={audioAiseRef}
        src="/audio/aise na javo piya.mp3"
        onEnded={() => handleTrackEnded(1)}
        onLoadStart={() => console.log('Aise audio load start')}
        onCanPlay={() => console.log('Aise audio can play')}
        onError={(e) => console.log('Aise audio error:', e)}
        preload="auto"
      />
      <audio
        ref={audioAbhiRef}
        src="/audio/abhi na javo.mp3"
        onEnded={() => handleTrackEnded(2)}
        onLoadStart={() => console.log('Abhi audio load start')}
        onCanPlay={() => console.log('Abhi audio can play')}
        onError={(e) => console.log('Abhi audio error:', e)}
        preload="auto"
      />

      {/* Background blobs */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full opacity-40 -top-40 -left-40"
        style={{
          background: "hsl(var(--primary) / 0.3)",
          filter: "blur(100px)",
          animation: "float 25s infinite alternate ease-in-out",
        }}
      />
      <div
        className="absolute w-[400px] h-[400px] rounded-full opacity-30 -bottom-32 -right-32"
        style={{
          background: "hsl(var(--gold) / 0.3)",
          filter: "blur(100px)",
          animation: "float 20s infinite alternate-reverse ease-in-out",
        }}
      />

      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 flex items-center justify-center transition-all duration-[1200ms] ease-in-out ${
            index === currentSlide
              ? "opacity-100 visible pointer-events-auto z-10"
              : "opacity-0 invisible pointer-events-none z-0"
          }`}
        >
          {slide}
        </div>
      ))}

      {countdownActive && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-background/85 backdrop-blur-md">
          <div className="premium-card flex min-h-52 w-[min(90vw,24rem)] flex-col items-center justify-center rounded-[2rem] px-8 py-10 text-center shadow-2xl">
            <p className="mb-3 text-sm uppercase tracking-[0.35em] text-muted-foreground">
              Starting your memory journey
            </p>
            <div className="font-limelight text-7xl text-primary drop-shadow-sm">
              {countdown > 0 ? countdown : "Go!"}
            </div>
            <p className="mt-4 text-base text-muted-foreground">
              Music and slides will begin together in a moment
            </p>
          </div>
        </div>
      )}

      {autoplayFailed && !countdownActive && (
        <div className="absolute top-4 right-4 z-30 bg-black/80 text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <span className="text-lg">🔊</span>
            <span className="text-sm font-medium">Click anywhere to enable music</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlideContainer;
