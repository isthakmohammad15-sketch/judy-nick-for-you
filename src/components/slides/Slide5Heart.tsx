import { useEffect, useRef } from "react";
import gsap from "gsap";
import krishnaImage from "@/assets/krishna.02 .jpg";

interface Props {
  onNext: () => void;
}

const Slide5Heart = ({ onNext }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(
      ref.current.querySelector(".heart"),
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.5, ease: "elastic.out(1, 0.4)" }
    );
  }, []);

  return (
    <div ref={ref} className="flex flex-col items-center justify-center px-6">
      <img
        src={krishnaImage}
        alt="Krishna scroll"
        className="heart w-48 h-48 md:w-60 md:h-60 object-contain animate-float"
      />
      <button
        onClick={onNext}
        className="mt-8 px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium text-lg transition-all duration-500 hover:scale-105"
      >
        The Special Letter
      </button>

      {/* Interactive Hint */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-black/80 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-sm border border-white/20 cursor-pointer hover:bg-black/90 transition-colors">
          <div className="flex items-center gap-2">
            <span className="text-yellow-400">💡</span>
            <span>Click "The Special Letter" to continue</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Slide5Heart;
