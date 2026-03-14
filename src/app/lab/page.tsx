"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import MagneticButton from "@/components/ui/MagneticButton";

function HexClock() {
  const [time, setTime] = useState("");
  const [hex, setHex] = useState("");
  
  useEffect(() => {
    const t = setInterval(() => {
      const d = new Date();
      setTime(d.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute:"2-digit", second:"2-digit", fractionalSecondDigits: 3 }));
      const hexStr = `#${d.getHours().toString(16).padStart(2, "0")}${d.getMinutes().toString(16).padStart(2, "0")}${d.getSeconds().toString(16).padStart(2, "0")}`.toUpperCase();
      setHex(hexStr);
    }, 50);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex flex-col gap-3">
       <span className="font-mono text-[10px] tracking-widest text-[var(--color-text-dim)]">time</span>
       <span className="font-serif italic text-4xl md:text-5xl" style={{ color: "var(--color-text)" }}>{time || "00:00:00.000"}</span>
       <span className="font-mono text-[10px] tracking-widest" style={{ color: "var(--color-accent)" }}>{hex || "#000000"}</span>
    </div>
  );
}

/**
 * The Lab
 * ───────
 * A dedicated playground route showcasing "Software as a Gift".
 * Proves interactive micro-physics capabilities directly.
 */
export default function LabPage() {
  return (
    <div className="min-h-screen pt-40 px-6 sm:px-12 pb-32">
      <div className="max-w-[1200px] mx-auto">
        <header className="mb-20 flex flex-col md:flex-row justify-between md:items-end gap-8 border-b border-[var(--color-border)] pb-8">
           <div>
             <h1 className="headline-mixed" style={{ fontSize: "clamp(3rem, 8vw, 6rem)", lineHeight: 1 }}>
               <span className="font-sans font-medium uppercase">the </span>
               <em className="font-serif italic">lab</em>
             </h1>
             <p className="font-mono text-xs tracking-[0.1em] text-[var(--color-text-dim)] mt-6">
               interactive experiments
             </p>
           </div>
           <Link
             href="/"
             className="font-sans text-[11px] tracking-[0.02em] transition-colors"
             style={{ color: "var(--color-text-dim)" }}
             onMouseEnter={(e) => e.currentTarget.style.color = "var(--color-text)"}
             onMouseLeave={(e) => e.currentTarget.style.color = "var(--color-text-dim)"}
           >
             ← back
           </Link>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Exp 1: Ambient EQ */}
          <div className="border border-[var(--color-border)] bg-[var(--color-surface)] aspect-square flex flex-col justify-between p-8 group">
             <div className="flex justify-between items-start">
               <span className="font-mono text-[10px] tracking-[0.1em] text-[var(--color-text-dim)]">01 — audio</span>
               <div className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
             </div>
             <div className="flex-1 flex items-center justify-center">
               <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-text-dim)]">Audio Visualizer</span>
             </div>
             <p className="font-sans text-sm text-[var(--color-text-dim)] mt-6 leading-relaxed">Reactive Equalizer Array. Move cursor across elements to simulate audio peaks.</p>
          </div>

          {/* Exp 2: Hex Clock */}
          <div className="border border-[var(--color-border)] bg-[var(--color-surface)] aspect-square flex flex-col justify-between p-8">
             <div className="flex justify-between items-start">
               <span className="font-mono text-[10px] tracking-[0.1em] text-[var(--color-text-dim)]">02 — chronos</span>
             </div>
             <div className="flex-1 flex items-center justify-center">
               <HexClock />
             </div>
             <p className="font-sans text-sm text-[var(--color-text-dim)] mt-6 leading-relaxed">High-frequency millisecond tick mapped to a live hexadecimal color conversion string.</p>
          </div>

          {/* Exp 3: Magnetic Field */}
           <div className="border border-[var(--color-border)] bg-[var(--color-surface)] aspect-square flex flex-col justify-between p-8">
             <div className="flex justify-between items-start">
               <span className="font-mono text-[10px] tracking-[0.1em] text-[var(--color-text-dim)]">03 — inertia</span>
             </div>
             <div className="flex-1 flex items-center justify-center">
               <MagneticButton strength={0.8} radius={150} scale={1.15}>
                  <div className="w-32 h-32 rounded-full border border-[var(--color-border)] flex items-center justify-center bg-[var(--color-bg)] shadow-[0_4px_24px_rgba(0,0,0,0.5)] cursor-none">
                     <span className="font-sans text-[10px] tracking-[0.05em]">pull me</span>
                  </div>
               </MagneticButton>
             </div>
             <p className="font-sans text-sm text-[var(--color-text-dim)] mt-6 leading-relaxed">Magnetic boundary field with enhanced inertia weight using GSAP Spring calculations.</p>
          </div>

          {/* Exp 4: Cypher */}
          <div className="border border-[var(--color-border)] bg-[var(--color-surface)] lg:col-span-3 flex flex-col justify-between p-8 md:p-12">
             <div className="flex justify-between items-start">
               <span className="font-mono text-[10px] tracking-[0.1em] text-[var(--color-text-dim)]">04 — typography</span>
             </div>
             <div className="flex-1 flex items-center justify-start py-12 md:py-24">
               <h2 className="font-serif italic text-3xl md:text-5xl lg:text-7xl text-[var(--color-text)] leading-[1.15] max-w-5xl">
                 We believe software should feel like a physical instrument: precise, purposeful, and built to withstand the test of time.
               </h2>
             </div>
             <p className="font-sans text-sm text-[var(--color-text-dim)] mt-4 border-t border-[var(--color-border)] pt-6">Continuous text decryption matrix triggered on viewport intersection.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
