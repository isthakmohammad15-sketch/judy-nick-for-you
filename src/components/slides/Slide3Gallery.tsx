import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import memory1 from "@/assets/memory 1.jpg";
import memory2 from "@/assets/memory2.jpg";
import memory3 from "@/assets/memory 3.jpg";
import memory4 from "@/assets/memory 4.jpg";
import memory5 from "@/assets/memory 5.jpg";
import memory6 from "@/assets/memory 11.jpeg";
import memory7 from "@/assets/memory 7.mp4";
import memory8 from "@/assets/memory 8.mp4";
import goldenArrow from "@/assets/golden-arrow.png";

interface Props {
  onNext: () => void;
}

const photos = [
  { src: memory1, label: "the first photo we both took may be it is like these only i think" },
  { src: memory2, label: "joyfull photo ever" },
  { src: memory3, label: "Laughter & light" },
  { src: memory4, label: "Celebrations" },
  { src: memory5, label: "Under the stars" },
  { src: memory6, label: "The beatuful pic of urs" },
  { src: memory7, label: "memorable day ever" },
  { src: memory8, label: "black magic bro" },
];

// S-pattern reveal order: row1 L→R, then row2 R→L
// S-pattern: row1 L→R (0,1,2), row2 R→L (5,4,3), row3 L→R (6,7)
const revealOrder = [0, 1, 2, 5, 4, 3, 6, 7];

const Slide3Gallery = ({ onNext }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLImageElement>(null);
  const [revealed, setRevealed] = useState<boolean[]>(Array(8).fill(false));
  const [started, setStarted] = useState(false);
  const [allRevealed, setAllRevealed] = useState(false);
  const [paths, setPaths] = useState<string[]>([]);
  const [visiblePaths, setVisiblePaths] = useState<number>(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>(Array(8).fill(null) as (HTMLVideoElement | null)[]);

  const getPhotoRect = useCallback((index: number) => {
    const photoEl = containerRef.current?.querySelector(`[data-photo="${index}"]`);
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!photoEl || !containerRect) return { left: 0, right: 0, top: 0, bottom: 0, cx: 0, cy: 0 };
    const rect = photoEl.getBoundingClientRect();
    return {
      left: rect.left - containerRect.left,
      right: rect.right - containerRect.left,
      top: rect.top - containerRect.top,
      bottom: rect.bottom - containerRect.top,
      cx: rect.left - containerRect.left + rect.width / 2,
      cy: rect.top - containerRect.top + rect.height / 2,
    };
  }, []);

  // Compute S-shaped paths from borders
  useEffect(() => {
    if (!containerRef.current) return;
    const timer = setTimeout(() => {
      const allPaths: string[] = [];

      for (let step = 0; step < revealOrder.length - 1; step++) {
        const fromIdx = revealOrder[step];
        const toIdx = revealOrder[step + 1];
        const fromR = getPhotoRect(fromIdx);
        const toR = getPhotoRect(toIdx);

        // Row changes: step 2 (photo 2→5) and step 5 (photo 3→6)
        const isRowChange = step === 2 || step === 5;

        if (isRowChange) {
          // Vertical S-curve from bottom of one photo to top of next
          const startX = fromR.cx;
          const startY = fromR.bottom;
          const endX = toR.cx;
          const endY = toR.top;
          const cp1x = startX + (step === 2 ? 50 : -50);
          const cp1y = startY + (endY - startY) * 0.4;
          const cp2x = endX + (step === 2 ? 50 : -50);
          const cp2y = endY - (endY - startY) * 0.4;
          allPaths.push(`M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`);
        } else if (step < 2) {
          // Row 1: left to right
          const startX = fromR.right;
          const startY = fromR.cy;
          const endX = toR.left;
          const endY = toR.cy;
          const midX = (startX + endX) / 2;
          const curveAmt = step % 2 === 0 ? -25 : 25;
          const cpY = (startY + endY) / 2 + curveAmt;
          allPaths.push(`M ${startX} ${startY} Q ${midX} ${cpY}, ${endX} ${endY}`);
        } else if (step > 2 && step < 5) {
          // Row 2: right to left
          const startX = fromR.left;
          const startY = fromR.cy;
          const endX = toR.right;
          const endY = toR.cy;
          const midX = (startX + endX) / 2;
          const curveAmt = step % 2 === 0 ? -25 : 25;
          const cpY = (startY + endY) / 2 + curveAmt;
          allPaths.push(`M ${startX} ${startY} Q ${midX} ${cpY}, ${endX} ${endY}`);
        } else {
          // Row 3: left to right
          const startX = fromR.right;
          const startY = fromR.cy;
          const endX = toR.left;
          const endY = toR.cy;
          const midX = (startX + endX) / 2;
          const curveAmt = -25;
          const cpY = (startY + endY) / 2 + curveAmt;
          allPaths.push(`M ${startX} ${startY} Q ${midX} ${cpY}, ${endX} ${endY}`);
        }
      }
      setPaths(allPaths);
    }, 300);
    return () => clearTimeout(timer);
  }, [getPhotoRect]);

  const startReveal = useCallback(() => {
    if (started) return;
    setStarted(true);

    const arrowEl = arrowRef.current;
    if (!arrowEl || !containerRef.current) return;

    const tl = gsap.timeline();
    tl.set(arrowEl, { opacity: 1, x: -120, y: 100, rotation: 0, scale: 1 });

    revealOrder.forEach((photoIdx, step) => {
      const r = getPhotoRect(photoIdx);
      const arrowX = r.cx - 32;
      const arrowY = r.cy - 32;

      // Wave motion
      const waveAmp = step % 2 === 0 ? -45 : 45;

      // Flip arrow for row 2 (steps 3,4,5 go right to left)
      const flipRotation = step >= 3 && step <= 5 ? 180 : 0;

      tl.to(arrowEl, {
        x: arrowX,
        y: arrowY + waveAmp,
        rotation: flipRotation + (waveAmp > 0 ? 10 : -10),
        duration: 0.45,
        ease: "power1.inOut",
      });

      tl.to(arrowEl, {
        y: arrowY,
        rotation: flipRotation,
        duration: 0.25,
        ease: "power2.out",
      });

      // Hit flash
      tl.to(arrowEl, { scale: 1.5, duration: 0.08, ease: "power4.out" });
      tl.to(arrowEl, { scale: 1, duration: 0.12, ease: "power2.in" });

      // Reveal + draw line
      tl.call(() => {
        setRevealed((prev) => {
          const next = [...prev];
          next[photoIdx] = true;
          return next;
        });
        if ((photoIdx === 6 || photoIdx === 7) && videoRefs.current[photoIdx]) {
          (videoRefs.current[photoIdx] as HTMLVideoElement)?.play().catch(console.error);
        }
        if (step > 0) {
          setVisiblePaths(step);
        }
        if (step === revealOrder.length - 1) {
          setTimeout(() => setAllRevealed(true), 800);
        }
      });

      tl.to({}, { duration: 0.15 });
    });

    tl.to(arrowEl, { opacity: 0, scale: 0.3, duration: 0.5, delay: 0.2 });
  }, [started, getPhotoRect]);

  useEffect(() => {
    if (!containerRef.current) return;
    gsap.fromTo(
      containerRef.current.querySelector(".title"),
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center px-4 py-4 pb-28 max-w-5xl mx-auto w-full h-full overflow-y-auto custom-scroll"
    >
      <h2 className="title font-limelight text-2xl md:text-4xl text-foreground mb-4 opacity-0 flex-shrink-0">
        The Little Moments, Big memorys i made with you
      </h2>

      {/* Golden Arrow */}
      <img
        ref={arrowRef}
        src={goldenArrow}
        alt="Golden arrow"
        className="absolute w-16 h-16 object-contain z-30 pointer-events-none opacity-0"
        style={{ filter: "drop-shadow(0 0 15px hsl(var(--gold) / 0.8))" }}
      />

      {/* SVG curved connecting lines */}
      <svg
        className="absolute inset-0 w-full h-full z-20 pointer-events-none"
        style={{ overflow: "visible" }}
      >
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--gold))" stopOpacity="0.5" />
            <stop offset="50%" stopColor="hsl(var(--gold-glow))" stopOpacity="0.9" />
            <stop offset="100%" stopColor="hsl(var(--gold))" stopOpacity="0.5" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {paths.map((d, i) => (
          <g key={i}>
            {/* Glow */}
            <path
              d={d}
              fill="none"
              stroke="hsl(var(--gold-glow))"
              strokeWidth="4"
              opacity={i < visiblePaths ? 0.25 : 0}
              filter="url(#glow)"
              className="transition-opacity duration-700"
            />
            {/* Line */}
            <path
              d={d}
              fill="none"
              stroke="url(#lineGrad)"
              strokeWidth="2"
              strokeDasharray="8 5"
              opacity={i < visiblePaths ? 0.9 : 0}
              className="transition-opacity duration-700"
            >
              {i < visiblePaths && (
                <animate
                  attributeName="stroke-dashoffset"
                  from="100"
                  to="0"
                  dur="1s"
                  fill="freeze"
                />
              )}
            </path>
          </g>
        ))}
      </svg>

      {/* Photo Grid */}
      <div className="grid grid-cols-3 gap-5 md:gap-8 mb-6 w-full flex-shrink-0">
        {photos.map((photo, i) => (
          <div
            key={i}
            data-photo={i}
            onClick={!started ? startReveal : undefined}
            className={`relative transition-all duration-700 ${
              !started && i > 0 ? "opacity-0 scale-90" : ""
            } ${started && !revealed[i] ? "opacity-30 scale-95" : ""} ${
              revealed[i] ? "opacity-100 scale-100" : ""
            } ${!started ? "cursor-pointer" : ""}`}
          >
            <div
              className={`paper-texture rounded-xl p-1.5 transition-all duration-700 ${
                revealed[i] ? "shadow-lg" : ""
              }`}
              style={{
                transform: `rotate(${(i % 2 === 0 ? -1 : 1) * (1 + (i % 3))}deg)`,
              }}
            >
              <div className="relative overflow-hidden rounded-lg aspect-[4/3]">
                {/* Hidden state: frosted glass with golden frame glow */}
                <div
                  className={`absolute inset-0 flex items-center justify-center transition-all z-10 ${
                    revealed[i]
                      ? "opacity-0 pointer-events-none duration-2000"
                      : "opacity-100 duration-500"
                  }`}
                  style={{
                    background: revealed[i]
                      ? "transparent"
                      : "linear-gradient(135deg, hsl(var(--muted) / 0.95), hsl(var(--vintage) / 0.9))",
                    backdropFilter: revealed[i] ? "none" : "blur(12px)",
                  }}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-2xl animate-pulse">🤫</span>
                    <span className="text-[10px] font-dancing text-muted-foreground/60">tap to reveal</span>
                  </div>
                </div>

                {/* Brush stroke reveal mask */}
                <div
                  className={`absolute inset-0 z-[5] transition-all duration-2000 ease-out ${
                    revealed[i] ? "translate-x-full" : "translate-x-0"
                  }`}
                  style={{
                    background: "linear-gradient(90deg, hsl(var(--vintage)) 60%, transparent 100%)",
                  }}
                />

                {/* Photo/Video with Ken Burns slow zoom */}
                {(i === 6 || i === 7) ? (
                  <video
                    ref={(el) => {
                      videoRefs.current[i] = el;
                    }}
                    src={photo.src}
                    width={800}
                    height={600}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className={`w-full h-full object-cover transition-all duration-2000 ease-out ${
                      revealed[i]
                        ? "opacity-100 scale-105 blur-0"
                        : "opacity-0 scale-[1.3] blur-md"
                    }`}
                    style={
                      revealed[i]
                        ? {
                            animation: "kenBurns 8s ease-in-out infinite alternate",
                          }
                        : {}
                    }
                  />
                ) : (
                  <img
                    src={photo.src as string}
                    alt={photo.label}
                    loading="lazy"
                    width={800}
                    height={600}
                    className={`w-full h-full object-cover transition-all duration-2000 ease-out ${
                      revealed[i]
                        ? "opacity-100 scale-105 blur-0"
                        : "opacity-0 scale-[1.3] blur-md"
                    }`}
                    style={revealed[i] ? {
                      animation: "kenBurns 8s ease-in-out infinite alternate",
                    } : {}} 
                  />
                )}

                {/* Golden glow flash on reveal */}
                <div
                  className={`absolute inset-0 z-[15] pointer-events-none transition-opacity ${
                    revealed[i] ? "animate-revealFlash" : "opacity-0"
                  }`}
                  style={{
                    background: "radial-gradient(circle, hsl(var(--gold-glow) / 0.4) 0%, transparent 70%)",
                  }}
                />

                {/* Golden Dust & Bokeh particles */}
                {revealed[i] && (
                  <div className="absolute inset-0 pointer-events-none z-20">
                    {/* Large bokeh circles */}
                    {[...Array(4)].map((_, j) => (
                      <div
                        key={`bokeh-${j}`}
                        className="absolute rounded-full"
                        style={{
                          width: `${12 + Math.random() * 16}px`,
                          height: `${12 + Math.random() * 16}px`,
                          left: `${10 + Math.random() * 80}%`,
                          top: `${10 + Math.random() * 80}%`,
                          background: `radial-gradient(circle, hsl(var(--gold-glow) / 0.6), transparent)`,
                          animation: `floatBokeh ${3 + Math.random() * 3}s ease-in-out infinite`,
                          animationDelay: `${Math.random() * 2}s`,
                        }}
                      />
                    ))}
                    {/* Small golden dust */}
                    {[...Array(10)].map((_, j) => (
                      <div
                        key={`dust-${j}`}
                        className="absolute rounded-full bg-gold-glow"
                        style={{
                          width: `${1 + Math.random() * 2}px`,
                          height: `${1 + Math.random() * 2}px`,
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          animation: `dustFloat ${2 + Math.random() * 3}s ease-in-out infinite`,
                          animationDelay: `${Math.random() * 2}s`,
                          opacity: 0.9,
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
              <p
                className={`text-center text-xs font-dancing text-muted-foreground mt-1 transition-opacity duration-1000 ${
                  revealed[i] ? "opacity-100" : "opacity-0"
                }`}
              >
                {photo.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {allRevealed && (
        <button
          onClick={onNext}
          className="flex-shrink-0 mb-24 px-8 py-3 rounded-full bg-scrapbook-green text-primary-foreground font-medium text-lg transition-all duration-500 hover:scale-105 animate-fade-in"
        >
          The Journey Continues
        </button>
      )}

      {/* Interactive Hint */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-black/80 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-sm border border-white/20 cursor-pointer hover:bg-black/90 transition-colors">
          <div className="flex items-center gap-2">
            <span className="text-yellow-400">💡</span>
            <span>Tap photo to reveal our memories</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Slide3Gallery;
