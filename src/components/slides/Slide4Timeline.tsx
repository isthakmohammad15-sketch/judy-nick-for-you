import { useEffect, useRef } from "react";
import gsap from "gsap";

interface Props {
  onNext: () => void;
}

const events = [
  { emoji: "🌅", title: "The Beginning", desc: "we meet in EWS lab and became more close in EG lab  and i was litrally sooo much shy to talk ." },
  { emoji: "🌻", title: "Growing Together", desc: "Finding home in the laughter and the quiet moments and became each others comfort zone." },
];

const Slide4Timeline = ({ onNext }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(
      ref.current.querySelectorAll(".tl-item"),
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 0.8, stagger: 0.4, ease: "power3.out" }
    );
  }, []);

  return (
    <div ref={ref} className="flex flex-col items-center px-6 max-w-2xl mx-auto text-center">
      <h2 className="font-limelight text-3xl md:text-4xl text-foreground mb-10">Our Timeline</h2>

      <div className="space-y-8 w-full mb-10">
        {events.map((e, i) => (
          <div key={i} className="tl-item opacity-0 premium-card rounded-2xl p-6 flex items-start gap-4 text-left">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-2xl">
              {e.emoji}
            </div>
            <div>
              <h3 className="font-semibold text-lg text-foreground">{e.title}</h3>
              <p className="text-muted-foreground mt-1">{e.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onNext}
        className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium text-lg transition-all duration-500 hover:scale-105"
      >
        Click here for a secial letter ➔
      </button>

      {/* Interactive Hint */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-black/80 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-sm border border-white/20 cursor-pointer hover:bg-black/90 transition-colors">
          <div className="flex items-center gap-2">
            <span className="text-yellow-400">💡</span>
            <span>Read our timeline and click to continue</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Slide4Timeline;
