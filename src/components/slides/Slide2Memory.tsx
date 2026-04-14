import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";

// Import birthday audio
const birthdayAudio = "/audio/birthday.mp3";

interface Props {
  onNext: () => void;
  isActive: boolean;
}

const message = `    𝑅𝑒𝒶𝓁 𝒻𝓇𝒾𝑒𝓃𝓭𝓈𝒽𝒾𝓅 𝒹𝑜𝑒𝓃’𝓉 𝒻𝒶𝒹𝑒.
𝐼𝓉 𝓈𝓉𝒶𝓎𝓈 𝓉𝒽𝓇𝑜𝓊𝑔𝒽 𝑒𝓋𝑒𝓇𝓎𝓉𝒽𝒾𝓃𝑔.

𝐻𝒶𝓅𝓅𝓎 𝐵𝒾𝓇𝓉𝒽𝒹𝒶𝓎 𝓂𝓎 𝒹𝑒𝒶𝓇 𝒷𝑒𝓈𝓉𝒾𝒆 🤍
𝒜𝓁𝓌𝒶𝓎𝓈 𝓉𝒽𝑒𝓇𝑒 𝓌𝒾𝓉𝒽 𝓊 𝒾𝓃 𝑒𝓋𝑒𝓇𝓎 𝓈𝒾𝓉𝓊𝒶𝓉𝒾𝑜𝓃  `;

const Slide2Memory = ({ onNext, isActive }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  const audioRef = useRef<HTMLAudioElement>(null);
  const audioFadeTimer = useRef<number | null>(null);
  const popRef = useRef<HTMLAudioElement>(null);
  const heartRef = useRef<HTMLAudioElement>(null);
  const birthdayAudioRef = useRef<HTMLAudioElement>(null);

  const cakeRef = useRef<HTMLDivElement>(null);
  const lidRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const ribbonRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  const [typedText, setTypedText] = useState("");
  const [isPlaying, setIsPlaying] = useState(true);
  const [revealStage, setRevealStage] = useState<'closed' | 'revealed' | 'typing' | 'complete'>('closed');

  useEffect(() => {
    if (!ref.current) return;

    // Blast explosion on slide entry
    gsap.timeline({ delay: 0.1 })
      .fromTo(".blast div", { scale: 0, opacity: 0 }, { scale: 1.5, opacity: 1, duration: 0.5, ease: "back.out(2)" })
      .to(".blast div", { scale: 2.5, opacity: 0, duration: 0.7, ease: "power2.in" })
      .set(".blast", { opacity: 0 });

    createParticles();

    tl.current = gsap.timeline({ paused: true });

    if (!tl.current) return;

    // 🎀 Ribbon untie first
    tl.current.to(ribbonRef.current, {
      scaleY: 1.3,
      rotation: 15,
      duration: 0.4,
      ease: "power2.in"
    }).to(ribbonRef.current, {
      y: 100,
      opacity: 0,
      rotation: 40,
      scaleX: 0.6,
      duration: 0.8,
      ease: "power3.in",
      onComplete: () => {
        if (ribbonRef.current) ribbonRef.current.style.display = 'none';
      }
    });

    // ❤️ heartbeat
    tl.current.add(() => heartRef.current?.play(), "-=0.3");

    // 🎥 zoom
    tl.current.to(boxRef.current, {
      scale: 1.15,
      duration: 0.8,
      ease: "power2.out",
    }, "-=0.5");

    // 🎁 shake
    tl.current.to(boxRef.current, {
      x: -12,
      duration: 0.06,
      repeat: 8,
      yoyo: true,
    });

    // 🔊 pop
    tl.current.add(() => popRef.current?.play());

    // open lid
    tl.current.to(lidRef.current, {
      y: -140,
      rotation: -30,
      duration: 0.6,
    });

    // cake reveal
    tl.current.to(
      cakeRef.current,
      {
        scale: 1,
        opacity: 1,
        duration: 1,
        ease: "back.out(2)",
        onComplete: () => {
          startTyping();
          showGlow();
        },
      },
      "-=0.3"
    );

    // remove box & lid
    tl.current.to([boxRef.current, lidRef.current], {
      opacity: 0,
      scale: 0.85,
      duration: 0.6,
      ease: "power2.in",
      onComplete: () => {
        if (boxRef.current) boxRef.current.style.display = "none";
        if (lidRef.current) lidRef.current.style.display = "none";
      },
    }, "-=0.2");

    // Cleanup on unmount
    return () => {
      if (audioFadeTimer.current) {
        window.clearInterval(audioFadeTimer.current);
        audioFadeTimer.current = null;
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      if (popRef.current) popRef.current.pause();
      if (heartRef.current) heartRef.current.pause();
    };
  }, []); // Removed revealStage dep - timeline setup only on mount

  const fadeOutAudio = (audio: HTMLAudioElement, duration = 1.0) => {
    if (audioFadeTimer.current) {
      window.clearInterval(audioFadeTimer.current);
      audioFadeTimer.current = null;
    }

    const startVolume = audio.volume;
    const intervalMs = 50;
    const steps = Math.max(1, Math.ceil((duration * 1000) / intervalMs));
    let currentStep = 0;

    audioFadeTimer.current = window.setInterval(() => {
      currentStep += 1;
      const nextVolume = Math.max(0, startVolume * (1 - currentStep / steps));
      audio.volume = nextVolume;

      if (currentStep >= steps) {
        if (audioFadeTimer.current) {
          window.clearInterval(audioFadeTimer.current);
          audioFadeTimer.current = null;
        }
        audio.pause();
        audio.currentTime = 0;
        audio.volume = 0.7; // Reset to target volume
      }
    }, intervalMs);
  };

  const fadeInAudio = (audio: HTMLAudioElement, targetVolume = 0.7, duration = 1.5) => {
    if (audioFadeTimer.current) {
      window.clearInterval(audioFadeTimer.current);
      audioFadeTimer.current = null;
    }

    const startVolume = audio.volume > 0 ? audio.volume : 0;
    const intervalMs = 50;
    const steps = Math.max(1, Math.ceil((duration * 1000) / intervalMs));
    let currentStep = 0;

    audio.volume = startVolume;
    if (audio.paused) {
      audio.play().catch(() => {});
    }

    audioFadeTimer.current = window.setInterval(() => {
      currentStep += 1;
      const nextVolume = Math.min(targetVolume, startVolume + (targetVolume - startVolume) * (currentStep / steps));
      audio.volume = nextVolume;

      if (currentStep >= steps) {
        if (audioFadeTimer.current) {
          window.clearInterval(audioFadeTimer.current);
          audioFadeTimer.current = null;
        }
        audio.volume = targetVolume;
      }
    }, intervalMs);
  };

  useEffect(() => {
    if (!audioRef.current) return;

    if (audioFadeTimer.current) {
      window.clearInterval(audioFadeTimer.current);
      audioFadeTimer.current = null;
    }

    audioRef.current.loop = true;

    if (isActive) {
      audioRef.current.volume = 0;
      fadeInAudio(audioRef.current, 0.7, 1.5); // Increased volume to 0.7 for more impact
      setIsPlaying(true);
    } else {
      fadeOutAudio(audioRef.current, 1.5); // Slower fade-out
      setIsPlaying(false);
    }
  }, [isActive]);

  // ✨ glow effect
  const showGlow = () => {
    if (!glowRef.current) return;
    gsap.fromTo(
      glowRef.current,
      { opacity: 0, scale: 0.5 },
      { opacity: 1, scale: 1.2, duration: 1.2, ease: "power2.out" }
    );
  };

  // 🌟 floating particles
  const createParticles = () => {
    const container = ref.current;
    if (!container) return;

    for (let i = 0; i < 25; i++) {
      const p = document.createElement("div");
      p.className = "particle";
      container.appendChild(p);

      const startX = Math.random() * window.innerWidth;
      const startY = window.innerHeight + Math.random() * 200;

      gsap.set(p, {
        x: startX,
        y: startY,
        opacity: 0.6,
      });

      gsap.to(p, {
        y: -200,
        x: `+=${(Math.random() - 0.5) * 100}`,
        duration: 6 + Math.random() * 4,
        repeat: -1,
        delay: Math.random() * 3,
        ease: "none",
      });
    }
  };

  // ⌨️ typing
  const startTyping = () => {
    setRevealStage('typing');
    let i = 0;
    const interval = setInterval(() => {
      setTypedText((prev) => prev + message[i]);
      i++;
      if (i >= message.length) {
        clearInterval(interval);
        setRevealStage('complete');
      }
    }, 50);
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  const handleRibbonTap = useCallback(() => {
    if (revealStage !== 'closed') return;
    setRevealStage('revealed');
    if (ribbonRef.current) ribbonRef.current.style.pointerEvents = 'none';
    if (boxRef.current) boxRef.current.style.pointerEvents = 'none';
    tl.current?.play();
  }, [revealStage]);

  return (
    <div
      ref={ref}
      className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-200 via-white to-yellow-100 overflow-hidden px-6"
    >
      {/* sounds */}
      <audio ref={audioRef} loop src={birthdayAudio} />
  {/* External audio sources blocked - using local/no-op
      <audio ref={popRef} src="https://assets.mixkit.co/sfx/preview/mixkit-balloon-pop-1988.mp3" />
      <audio ref={heartRef} src="https://assets.mixkit.co/sfx/preview/mixkit-heartbeat-80.mp3" />
    */}
    <audio ref={popRef} />
    <audio ref={heartRef} />
      

      {/* toggle */}
      <button
        onClick={toggleAudio}
        className="absolute top-6 right-6 p-3 rounded-full bg-white shadow-lg z-50"
      >
        {isPlaying ? "🔊" : "🔇"}
      </button>

      {/* Blast effects on slide entry */}
      <div className="blast absolute inset-0 flex items-center justify-center z-[60] pointer-events-none opacity-100">
        <div className="opacity-0 scale-0 text-[12rem] md:text-[10rem] lg:text-[14rem]">💥💥🎉</div>
      </div>

      <h1 className="text-5xl font-bold text-gray-800 mb-10">
        🎉 Happy Birthday Tiru 🎉
      </h1>

      {/* 🎂 area */}
      <div className="relative w-60 h-60 flex items-center justify-center mb-12">

        {/* ✨ glow */}
        <div
          ref={glowRef}
          className="absolute w-56 h-56 rounded-full bg-pink-300 blur-3xl opacity-0"
        ></div>

        {/* 🎂 cake */}
        <div ref={cakeRef} className="absolute scale-0 opacity-0">
          <svg width="260" height="240" viewBox="0 0 260 240">
            {/* Plate */}
            <ellipse cx="130" cy="215" rx="85" ry="15" fill="#e8d5b7" stroke="#d4c4a0" strokeWidth="3"/>
            <ellipse cx="130" cy="215" rx="78" ry="12" fill="url(#plateGradient)"/>

            {/* Bottom tier - chocolate */}
            <defs>
              <radialGradient id="chocGradient" cx="50%" cy="30%">
                <stop offset="0%" stopColor="#8B4513"/>
                <stop offset="50%" stopColor="#A0522D"/>
                <stop offset="100%" stopColor="#654321"/>
              </radialGradient>
              <radialGradient id="plateGradient" cx="50%" cy="50%">
                <stop offset="0%" stopColor="#f5f0e8"/>
                <stop offset="100%" stopColor="#e8d5b7"/>
              </radialGradient>
            </defs>
            <rect x="45" y="140" width="170" height="65" rx="15" fill="url(#chocGradient)" stroke="#5D2E0A" strokeWidth="2"/>
            
            {/* Cream drips bottom */}
            <path d="M60 140 Q65 155 70 140 Q75 155 80 140 Q85 155 100 140 Q110 160 120 145 Q130 155 140 140 Q150 160 160 145 Q170 155 180 140 Q185 155 190 140 L195 140 L60 140 Z" fill="#F5F5DC" opacity="0.9">
              <animate attributeName="opacity" values="0.7;1;0.7" dur="3s" repeatCount="indefinite"/>
            </path>

            {/* Middle tier - pink */}
            <rect x="60" y="105" width="140" height="50" rx="12" fill="#FF69B4" stroke="#FF1493" strokeWidth="2"/>
            <ellipse cx="75" cy="115" rx="8" ry="6" fill="#FFB6C1" opacity="0.8"/>
            <ellipse cx="185" cy="125" rx="10" ry="7" fill="#FFB6C1" opacity="0.8"/>
            
            {/* Cream swirls middle */}
            <path d="M70 105 Q80 120 90 108 Q100 122 110 110 Q120 118 130 105 Q140 122 150 112 Q160 120 170 108" stroke="#FFF8DC" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.9"/>
            <circle cx="95" cy="112" r="3" fill="#FFF8DC"/>

            {/* Top tier - vanilla cream */}
            <rect x="75" y="70" width="110" height="40" rx="10" fill="#FFFDD0" stroke="#F0E68C" strokeWidth="2"/>
            <path d="M85 70 L90 85 L95 72 L102 88 L110 75 L118 86 L125 73 L132 87 L140 76 L145 70 Z" fill="#FDF5E6" opacity="0.8"/>

            {/* Frosting top */}
            <path d="M80 65 Q90 80 100 68 Q110 82 120 70 Q130 78 140 65" stroke="#FFF8DC" strokeWidth="5" strokeLinecap="round" fill="none" opacity="1"/>
            <circle cx="105" cy="67" r="4" fill="#FFF8DC"/>
            <circle cx="125" cy="69" r="3" fill="#FFF8DC"/>

            {/* Cherries */}
            <circle cx="90" cy="95" r="7" fill="#DC143C">
              <animateTransform attributeName="transform" type="rotate" values="0 90 95; 360 90 95" dur="4s" repeatCount="indefinite"/>
            </circle>
            <circle cx="170" cy="92" r="6" fill="#DC143C">
              <animateTransform attributeName="transform" type="rotate" values="0 170 92; -360 170 92" dur="4s" repeatCount="indefinite"/>
            </circle>

            {/* Candles */}
            <rect x="102" y="35" width="6" height="32" rx="2" fill="#F4A460"/>
            <rect x="122" y="38" width="6" height="29" rx="2" fill="#F4A460"/>
            <rect x="142" y="36" width="6" height="31" rx="2" fill="#F4A460"/>
            
            {/* Flames */}
            <path d="M105 30 Q108 25 110 30 Q112 25 115 30" fill="#FF4500" opacity="0.9">
              <animate attributeName="opacity" values="0.8;1;0.8" dur="0.7s" repeatCount="indefinite"/>
            </path>
            <path d="M125 28 Q128 23 130 28 Q132 23 135 28" fill="#FF4500" opacity="0.9">
              <animate attributeName="opacity" values="0.8;1;0.8" dur="0.7s" repeatCount="indefinite" begin="0.2s"/>
            </path>
            <path d="M145 29 Q148 24 150 29 Q152 24 155 29" fill="#FF4500" opacity="0.9">
              <animate attributeName="opacity" values="0.8;1;0.8" dur="0.7s" repeatCount="indefinite" begin="0.4s"/>
            </path>

            {/* Name plate */}
            <rect x="95" y="82" width="70" height="18" rx="8" fill="#FFD700" opacity="0.9"/>
            <text x="130" y="95" textAnchor="middle" fill="#8B4513" fontSize="12" fontWeight="bold">Happy Birthday!</text>

            {/* Cream drips sides */}
            <path d="M50 150 Q55 165 60 155 Q65 170 70 160" fill="none" stroke="#F5F5DC" strokeWidth="3" strokeLinecap="round" opacity="0.8"/>
            <path d="M210 145 Q205 160 200 150 Q195 165 190 155" fill="none" stroke="#F5F5DC" strokeWidth="3" strokeLinecap="round" opacity="0.8"/>
          </svg>
        </div>

        {/* 🎁 box */}
<div ref={boxRef} className="absolute w-[15rem] h-[15rem] bottom-0 cursor-pointer hover:scale-[1.05] transition-all duration-300 rounded-2xl shadow-2xl overflow-hidden border-8 border-pink-100/70" onClick={handleRibbonTap}>
          {/* Main cube body - ultra realistic 3D */}
          <div 
            className="w-full h-4/5 bg-gradient-to-br from-rose-100 via-pink-200 to-pink-400 relative"
            style={{
              boxShadow: `
                inset 0 8px 20px rgba(255,255,255,0.6),
                inset 0 -8px 20px rgba(0,0,0,0.2),
                0 20px 50px rgba(236,72,153,0.6),
                8px 0 20px rgba(255,192,203,0.4),
                -8px 0 20px rgba(255,192,203,0.3)
              `
            }}
          >
            {/* Side edge highlights */}
            <div className="absolute right-0 top-0 w-12 h-full bg-gradient-to-b from-white/30 to-transparent pointer-events-none"></div>
            <div className="absolute left-0 top-0 w-12 h-full bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>
          </div>
          
          {/* No bottom line - removed */}

          {/* Ultra prominent ribbon */}
          <div 
            ref={ribbonRef}
            className="absolute z-30 inset-0 cursor-pointer"
            onClick={handleRibbonTap}
          >
            <div className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none drop-shadow-[0_0_30px_rgba(236,72,153,0.8)]">
              {/* Massive glowing bow center */}
              <div 
                style={{
                  width: '140px',
                  height: '40px',
                  background: 'linear-gradient(45deg, hsl(330 90% 75%), hsl(330 80% 65%), hsl(330 90% 70%))',
                  borderRadius: '50px',
                  boxShadow: `
                    0 12px 40px rgba(219,39,119,0.8),
                    inset 0 6px 12px rgba(255,255,255,0.7),
                    0 0 60px rgba(236,72,153,0.7),
                    0 0 20px rgba(255,105,180,0.6)
                  `
                }}
              />
              {/* Huge bow loops */}
              <div className="flex -mt-4 gap-2">
                <div 
                  style={{
                    width: '70px',
                    height: '40px',
                    background: 'linear-gradient(135deg, hsl(330 85% 70%), hsl(330 75% 60%))',
                    borderRadius: '70% 70% 60% 60% / 80% 80% 20% 20%',
                    transform: 'rotate(-20deg)',
                    marginRight: '-8px',
                    boxShadow: `
                      0 10px 30px rgba(219,39,119,0.7),
                      inset 0 4px 8px rgba(255,255,255,0.5)
                    `
                  }}
                />
                <div 
                  style={{
                    width: '70px',
                    height: '40px',
                    background: 'linear-gradient(135deg, hsl(330 85% 70%), hsl(330 75% 60%))',
                    borderRadius: '70% 70% 60% 60% / 80% 80% 20% 20%',
                    transform: 'rotate(20deg)',
                    marginLeft: '-8px',
                    boxShadow: `
                      0 10px 30px rgba(219,39,119,0.7),
                      inset 0 4px 8px rgba(255,255,255,0.5)
                    `
                  }}
                />
              </div>
              {/* Extra long glowing tails */}
              <div className="flex gap-3 -mt-3">
                <div 
                  style={{
                    width: '12px',
                    height: '70px',
                    background: 'linear-gradient(180deg, hsl(330 80% 65%), hsl(330 70% 55%), hsl(330 85% 60%))',
                    borderRadius: '0 0 12px 12px 8px',
                    transform: 'rotate(-15deg)',
                    boxShadow: `
                      0 6px 24px rgba(219,39,119,0.6),
                      0 0 20px rgba(236,72,153,0.5)
                    `
                  }}
                />
                <div 
                  style={{
                    width: '12px',
                    height: '68px',
                    background: 'linear-gradient(180deg, hsl(330 80% 65%), hsl(330 70% 55%), hsl(330 85% 60%))',
                    borderRadius: '0 0 12px 12px 8px',
                    transform: 'rotate(15deg)',
                    boxShadow: `
                      0 6px 24px rgba(219,39,119,0.6),
                      0 0 20px rgba(236,72,153,0.5)
                    `
                  }}
                />
              </div>
            </div>
          </div>

          {/* Massive cube lid */}
          <div
            ref={lidRef}
            className="absolute -top-[5.5rem] w-full h-28 bg-gradient-to-br from-rose-50 via-pink-100 to-pink-200 rounded-2xl origin-bottom shadow-2xl border-8 border-white/80 z-10"
            style={{ 
              boxShadow: `
                0 24px 60px rgba(236,72,153,0.7),
                inset 0 8px 20px rgba(255,255,255,0.8),
                inset -8px 0 16px rgba(255,255,255,0.4)
              `
            }}
          />
        </div>
      </div>

      {/* typing - hidden until revealed */}
      <div className={`bg-white/70 backdrop-blur-md shadow-xl rounded-2xl px-6 py-5 max-w-xl text-center min-h-[120px] border transition-all duration-700 font-sacramento ${revealStage === 'revealed' || revealStage === 'typing' || revealStage === 'complete' ? 'scale-100 opacity-100' : 'scale-90 opacity-0 pointer-events-none'}`}>
        <p className={`text-gray-800 text-xl leading-relaxed whitespace-pre-line font-normal transition-opacity duration-500 ${revealStage === 'revealed' || revealStage === 'typing' || revealStage === 'complete' ? 'opacity-100' : 'opacity-0'}`}>
          {typedText}
          <span className={`animate-pulse transition-opacity ${revealStage === 'typing' ? 'opacity-100 block' : 'opacity-0 hidden'}`}>|</span>
        </p>
      </div>

      {/* Continue button - only after typing complete */}
      <button
        onClick={() => {
          // Stop all sounds before next
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
          }
          if (popRef.current) popRef.current.pause();
          if (heartRef.current) heartRef.current.pause();
          onNext();
        }}
        className={`mt-10 px-8 py-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-full hover:from-pink-700 hover:to-rose-700 shadow-xl transition-all duration-500 font-medium ${revealStage === 'complete' ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none translate-y-4'}`}
      >
        Continue ➔
      </button>

      {/* 🌟 particle style */}
      <style>
        {`
          .particle {
            position: absolute;
            width: 6px;
            height: 6px;
            background: white;
            border-radius: 50%;
            opacity: 0.6;
            filter: blur(1px);
          }
        `}
      </style>

      {/* Interactive Hint */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-black/80 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-sm border border-white/20 cursor-pointer hover:bg-black/90 transition-colors">
          <div className="flex items-center gap-2">
            <span className="text-yellow-400">💡</span>
            <span>Click the pink ribbon to open the birthday gift</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Slide2Memory;