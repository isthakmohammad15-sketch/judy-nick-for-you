import { useEffect, useRef } from "react";
import gsap from "gsap";

interface Props {
  onNext: () => void;
}

const Slide1Intro = ({ onNext }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline();

    // 🎈 ARRANGED BALLOON ENTRANCE - Staggered from different directions
    tl.fromTo(
      "#balloons",
      { opacity: 0, y: -120, scale: 0.8, rotation: -15 },
      { opacity: 1, y: 0, scale: 1, rotation: 0, duration: 2, ease: "back.out(2)" }
    );

    // ✨ BACKGROUND BLOBS ARRANGEMENT - Gentle fade and scale
    tl.fromTo(
      ".bg-blob-1",
      { opacity: 0, scale: 0.5 },
      { opacity: 0.4, scale: 1, duration: 1.5, ease: "power2.out" },
      "-=1.5"
    )
    .fromTo(
      ".bg-blob-2",
      { opacity: 0, scale: 0.3 },
      { opacity: 0.4, scale: 1, duration: 1.5, ease: "power2.out" },
      "-=1.2"
    );

    // 🎀 RIBBON ARRANGEMENT - Wave-like entrance
    tl.fromTo(
      "#ribbon",
      { opacity: 0, scaleX: 0 },
      { opacity: 1, scaleX: 1, duration: 1.2, ease: "power2.out" },
      "-=1"
    );

    // 📦 CARD CONTENT ARRANGEMENT - Sophisticated stagger sequence
    const cardElements = containerRef.current.querySelectorAll(".card-element");
    tl.fromTo(
      cardElements,
      {
        opacity: 0,
        y: 50,
        scale: 0.9,
        rotationX: -15
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        rotationX: 0,
        duration: 0.8,
        stagger: {
          amount: 1.2,
          from: "start",
          ease: "power2.out"
        },
        ease: "back.out(1.7)"
      },
      "-=0.8"
    );

    // ⭐ BOTTOM STRIP ARRANGEMENT - Dramatic slide up with bounce
    tl.fromTo(
      "#strip",
      { y: "120%", rotationX: 45 },
      { y: "0%", rotationX: 0, duration: 1.2, ease: "back.out(1.5)" },
      "-=0.5"
    );

    // 🎯 HINT ARRANGEMENT - Delayed subtle entrance
    tl.fromTo(
      ".hint-element",
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.6, ease: "power2.out" },
      "-=0.3"
    );

    // 🎈 CONTINUOUS BALLOON ARRANGEMENTS - Multiple floating patterns
    gsap.to("#balloons", {
      y: "+=60",
      rotation: "+=5",
      duration: 6,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // 🌟 BACKGROUND BLOBS CONTINUOUS ARRANGEMENT
    gsap.to(".bg-blob-1", {
      scale: 1.1,
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    gsap.to(".bg-blob-2", {
      scale: 1.15,
      duration: 10,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // 🎀 RIBBON CONTINUOUS ARRANGEMENT - Subtle wave
    gsap.to("#ribbon path", {
      attr: { d: "M0,0 H100 V10 L95,6 L90,10 L85,4 L80,10 L75,6 L70,10 L65,4 L60,10 L55,6 L50,10 L45,4 L40,10 L35,6 L30,10 L25,4 L20,10 L15,6 L10,10 L5,4 L0,10 Z" },
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // 💫 CARD HOVER ARRANGEMENT - Interactive enhancement
    const card = containerRef.current.querySelector(".anim");
    if (card) {
      card.addEventListener("mouseenter", () => {
        gsap.to(card, {
          scale: 1.02,
          rotationY: 2,
          duration: 0.3,
          ease: "power2.out"
        });
      });

      card.addEventListener("mouseleave", () => {
        gsap.to(card, {
          scale: 1,
          rotationY: 0,
          duration: 0.3,
          ease: "power2.out"
        });
      });
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center justify-center text-center px-6 min-h-screen w-full overflow-visible bg-gray-50"
    >
      {/* Background blobs */}
      <div className="absolute w-[30rem] h-[30rem] md:w-[40rem] md:h-[40rem] bg-pink-200 rounded-full blur-[100px] opacity-40 -top-20 -left-20 bg-blob-1" />
      <div className="absolute w-[25rem] h-[25rem] md:w-[35rem] md:h-[35rem] bg-purple-200 rounded-full blur-[100px] opacity-40 bottom-10 right-10 bg-blob-2" />

      {/* Top ribbon */}
      <svg
        id="ribbon"
        className="absolute top-0 left-0 w-full h-24 z-10"
        viewBox="0 0 100 15"
        preserveAspectRatio="none"
      >
        <path
          d="M0,0 H100 V10 L95,5 L90,10 L85,5 L80,10 L75,5 L70,10 L65,5 L60,10 L55,5 L50,10 L45,5 L40,10 L35,5 L30,10 L25,5 L20,10 L15,5 L10,10 L5,5 L0,10 Z"
          fill="#6c9a91"
        />
      </svg>

      {/* Balloons */}
      <div
        id="balloons"
        className="absolute top-40 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-1 z-30 pointer-events-none"
      >
        <svg viewBox="0 0 100 120" width="120">
          <ellipse cx="25" cy="50" rx="15" ry="20" fill="#fedc56" />
          <ellipse cx="50" cy="50" rx="15" ry="20" fill="#fb8c81" />
          <ellipse cx="75" cy="50" rx="15" ry="20" fill="#9cd6bf" />
          <ellipse cx="37" cy="30" rx="15" ry="20" fill="#6c9a91" />
          <ellipse cx="62" cy="30" rx="15" ry="20" fill="#e11d48" />
          <path d="M50,70 L50,120" stroke="#aaa" />
        </svg>
      </div>

      {/* ✅ FIXED PREMIUM BORDER CARD */}
      <div
        className="anim rounded-3xl p-10 max-w-lg z-20
        bg-white/95 backdrop-blur-xl
        border-2 border-slate-200/80
        shadow-[0_25px_60px_rgba(0,0,0,0.12)]
        hover:shadow-[0_40px_80px_rgba(0,0,0,0.18)]
        transition-all duration-500"
      >
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center animate-pulse-glow card-element">
          <span className="text-6xl">💜</span>
        </div>

        <h1 className="font-dancing text-4xl md:text-5xl text-slate-900 mb-4 card-element" style={{ textShadow: '2px 2px 6px rgba(0,0,0,0.12), -2px -2px 4px rgba(255,255,255,0.5)' }}>
           My dear friend tiru...
        </h1>

        <p className="text-slate-700 text-lg leading-relaxed mb-8 card-element" style={{ textShadow: '1px 1px 3px rgba(255,255,255,0.8)' }}>
          Every moment is a memory waiting to be framed.....Let's look back at the beautiful chapters we've written together and spent together.
        </p>

        <button
          onClick={onNext}
          className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium text-lg transition-all duration-500 hover:scale-105 hover:shadow-lg card-element"
          style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.25)' }}
        >
          let's Begin the Adventure
        </button>
      </div>

      {/* Bottom strip */}
      <div
        id="strip"
        className="absolute bottom-0 w-full h-[25vh] bg-[#6c9a91] translate-y-full rounded-t-3xl flex justify-center items-center"
      >
        <div className="flex gap-4 text-2xl">⭐ ⭐ ⭐</div>
      </div>

      {/* Interactive Hint */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 hint-element">
        <div className="bg-black/90 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-sm border-2 border-white/30 cursor-pointer hover:bg-black/95 transition-colors shadow-lg">
          <div className="flex items-center gap-2">
            <span className="text-yellow-400 text-base drop-shadow-lg">💡</span>
            <span className="font-medium drop-shadow-sm">Click "let's Begin the Adventure" to start</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Slide1Intro;
