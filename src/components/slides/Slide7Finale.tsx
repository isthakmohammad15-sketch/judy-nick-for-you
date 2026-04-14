import { useEffect, useRef } from "react";
import gsap from "gsap";
import memory1 from "@/assets/memory 1.jpg";
import memory2 from "@/assets/memory2.jpg";
import memory3 from "@/assets/memory 3.jpg";
import memory4 from "@/assets/memory 4.jpg";
import memory5 from "@/assets/memory 5.jpg";
import memory6 from "@/assets/memory 6.jpg";
import memory10 from "@/assets/memory 10.jpeg";
import memory11 from "@/assets/memory 11.jpeg";
import memory12 from "@/assets/memory 12.jpg";
import memory13 from "@/assets/memory 13.jpg";
import memory14 from "@/assets/memory 14.jpg";
import memory15 from "@/assets/memory 15.jpeg";

interface Props {
  onReplay: () => void;
}

// All available memory photos for the background grid
const finaleImages = [
  memory1,
  memory2,
  memory3,
  memory4,
  memory5,
  memory6,
  memory10,
  memory11,
  memory12,
  memory13,
  memory14,
  memory15,
];

const Slide7Finale = ({ onReplay }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    gsap.fromTo(
      ref.current.querySelectorAll(".anim"),
      { opacity: 0, y: 30, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        stagger: 0.3,
        ease: "power3.out",
      }
    );

    gsap.to(".frame", {
      y: "+=6",
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, []);

  return (
    <div
      ref={ref}
      className="relative w-full h-screen flex items-center justify-center text-center overflow-hidden"
    >
      {/* BACKGROUND GRID (13 MEMORY PHOTOS) */}
      <div className="absolute inset-0 z-0 grid grid-cols-3 md:grid-cols-4 gap-x-8 gap-y-12 p-8 opacity-40">

        {finaleImages.map((src, i) => (
          <div key={i} className="flex flex-col items-center frame">

            {/* string */}
            <div className="w-[2px] h-20 bg-gray-300" />

            {/* clip */}
            <div className="w-5 h-2 bg-gray-400 mb-2 rounded-sm" />

            {/* portrait frame */}
            <div className="bg-white p-2 shadow-xl">
              <img
                src={src}
                alt={`Memory photo ${i + 1}`}
                loading="lazy"
                className="w-28 md:w-36 h-40 md:h-52 object-cover"
              />
            </div>

          </div>
        ))}

      </div>

      {/* overlay */}
      <div className="absolute inset-0 bg-black/30 z-0" />

      {/* Foreground */}
      <div className="relative z-10 px-6">
        <div className="anim opacity-0 text-8xl mb-4">🎂</div>

        <p className="anim opacity-0 font-dancing text-5xl text-foreground mb-8">
          To the brightest star
        </p>

        <h2 className="anim opacity-0 font-limelight text-5xl md:text-7xl text-foreground mb-8">
          ✨ HAPPY BIRTHDAY! ✨
        </h2>

        <button
          onClick={onReplay}
          className="anim opacity-0 px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium text-lg transition-all duration-500 hover:scale-105"
        >
          Replay the Magic
        </button>
      </div>

      {/* Interactive Hint */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-black/80 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-sm border border-white/20 cursor-pointer hover:bg-black/90 transition-colors">
          <div className="flex items-center gap-2">
            <span className="text-yellow-400">💡</span>
            <span>Click "Replay the Magic" to start over</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Slide7Finale;