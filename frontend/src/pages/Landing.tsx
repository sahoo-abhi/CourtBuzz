import { useEffect, useRef } from "react";
import "./Landing.css";
import shuttleImage from "../assets/shuttle_cut.png";

interface FogProps {
  className: string;
  filterId: string;
  baseFrequency: string;
  numOctaves: string;
  seed: string;
  amplitude: string;
  exponent: string;
  offset: string;
}

interface BigWordProps {
  text: string;
  start: number;
}

interface LandingProps {
  onEnter?: () => void;
}

function Fog({
  className,
  filterId,
  baseFrequency,
  numOctaves,
  seed,
  amplitude,
  exponent,
  offset,
}: FogProps) {
  return (
    <div className={`fog ${className}`}>
      <svg
        viewBox="0 0 1600 900"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id={filterId} x="0" y="0" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency={baseFrequency}
              numOctaves={numOctaves}
              seed={seed}
              stitchTiles="stitch"
            />
            <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  .9 0 0 0 0" />
            <feComponentTransfer>
              <feFuncA
                type="gamma"
                amplitude={amplitude}
                exponent={exponent}
                offset={offset}
              />
            </feComponentTransfer>
          </filter>
        </defs>
        <rect width="1600" height="900" filter={`url(#${filterId})`} />
      </svg>
    </div>
  );
}

function BigWord({ text, start }: BigWordProps) {
  return (
    <span className="word">
      {text.split("").map((ch, i) => (
        <span
          className="ltr"
          key={i}
          style={{ "--i": start + i } as React.CSSProperties}
        >
          {ch}
        </span>
      ))}
    </span>
  );
}

export default function Landing({ onEnter }: LandingProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const shuttleRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // ---- load reveal ----
    const revealT = setTimeout(
      () => document.body.classList.add("is-in"),
      60
    );

    // ---- auto redirect after animations complete ----
    const autoRedirectT = setTimeout(() => {
      if (onEnter) onEnter();
    }, 4500);

    // ---- mouse parallax ----
    const stage = stageRef.current;
    const layers = stage ? [...stage.querySelectorAll("[data-depth]")] : [];
    let tx = 0,
      ty = 0,
      cx = 0,
      cy = 0,
      raf = 0,
      running = true;
    const onMove = (e: MouseEvent) => {
      tx = e.clientX / window.innerWidth - 0.5;
      ty = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("mousemove", onMove);
    const loop = () => {
      if (!running) return;
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      for (const el of layers) {
        const elem = el as HTMLElement;
        const d = parseFloat(elem.dataset.depth || "0");
        const mx = -cx * d,
          my = -cy * (d * 0.5);
        if (elem.classList.contains("bigtype")) {
          elem.style.transform = `translate(calc(-50% + ${mx}px), calc(-50% + ${my}px))`;
        } else if (elem.classList.contains("shuttle-wrap")) {
          elem.style.transform = `translate(calc(-50% + ${mx * 1.4}px), calc(-50% + ${my * 1.4}px))`;
        } else {
          elem.style.transform = `translate(${mx}px, ${my}px)`;
        }
      }
      raf = requestAnimationFrame(loop);
    };
    // start parallax after the intro fly-in finishes
    const startT = setTimeout(loop, 1900);

    return () => {
      clearTimeout(revealT);
      clearTimeout(startT);
      clearTimeout(autoRedirectT);
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, [onEnter]);

  const spinShuttle = (e: React.MouseEvent<HTMLImageElement>) => {
    e.stopPropagation();
    const s = shuttleRef.current;
    if (!s) return;
    s.classList.remove("spin");
    void s.offsetWidth;
    s.classList.add("spin");
  };

  return (
    <div
      className="stage"
      ref={stageRef}
      style={{ cursor: "pointer" }}
      onClick={() => onEnter && onEnter()}
    >
      <div className="sky"></div>
      <div className="mountains back" data-depth="6"></div>
      <div className="mountains" data-depth="10"></div>

      <Fog
        className="fog-far"
        filterId="fogA"
        baseFrequency="0.0016 0.004"
        numOctaves="4"
        seed="11"
        amplitude="1.6"
        exponent="2.4"
        offset="-0.18"
      />

      <div className="bigtype" data-depth="22">
        <BigWord text="COURT" start={0} />
        <BigWord text="BUZZ" start={5} />
      </div>

      <Fog
        className="fog-mid"
        filterId="fogB"
        baseFrequency="0.0022 0.006"
        numOctaves="4"
        seed="4"
        amplitude="1.5"
        exponent="2.6"
        offset="-0.22"
      />

      <div className="shuttle-wrap" data-depth="46">
        <div className="shuttle-rise">
          <div className="speedlines">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="shuttle-float">
            <img
              className="shuttle"
              ref={shuttleRef}
              src={shuttleImage}
              alt="CourtBuzz futuristic shuttlecock"
              onClick={spinShuttle}
            />
          </div>
        </div>
      </div>

      <div className="shine"></div>

      <div className="hero-copy">
        <div className="tagline">
          Every smash. Every rally.{" "}
          <span className="tg-accent">Live.</span>
        </div>
      </div>
    </div>
  );
}