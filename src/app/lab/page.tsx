"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

function HexClock() {
  const [time, setTime] = useState("");
  const [hex, setHex] = useState("");

  useEffect(() => {
    const t = setInterval(() => {
      const d = new Date();
      setTime(
        d.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
      const hexStr = `#${d.getHours().toString(16).padStart(2, "0")}${d
        .getMinutes()
        .toString(16)
        .padStart(2, "0")}${d.getSeconds().toString(16).padStart(2, "0")}`.toUpperCase();
      setHex(hexStr);
    }, 50);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <span className="font-mono" style={{ fontSize: "var(--text-micro)", letterSpacing: "0.12em", color: "var(--color-text-dim)" }}>
        time
      </span>
      <span className="font-display italic" style={{ fontSize: "var(--text-h2)", color: "var(--color-text)" }}>
        {time || "00:00:00"}
      </span>
      <span className="font-mono" style={{ fontSize: "var(--text-micro)", color: "var(--color-text-dim)" }}>
        {hex || "#000000"}
      </span>
    </div>
  );
}

export default function LabPage() {
  return (
    <div className="min-h-screen section-padding" style={{ paddingTop: "clamp(8rem, 16vh, 12rem)", paddingBottom: "4rem" }}>
      <div className="max-w-[1200px] mx-auto">
        <header className="mb-20 flex flex-col md:flex-row justify-between md:items-end gap-8" style={{ borderBottom: "1px solid var(--color-border)", paddingBottom: "2rem" }}>
          <div>
            <h1 className="font-display" style={{ fontSize: "var(--text-display)", lineHeight: 1.1 }}>
              The <em>Lab</em>
            </h1>
            <p className="font-mono mt-4" style={{ fontSize: "var(--text-micro)", letterSpacing: "0.12em", color: "var(--color-text-dim)", textTransform: "uppercase" }}>
              Interactive experiments
            </p>
          </div>
          <Link
            href="/"
            className="font-mono transition-colors duration-300 hover:text-[var(--color-accent)]"
            style={{ fontSize: "var(--text-micro)", color: "var(--color-text-dim)", letterSpacing: "0.1em", textTransform: "uppercase" }}
          >
            ← Back
          </Link>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Exp 1 */}
          <div className="aspect-square flex flex-col justify-between p-8" style={{ border: "1px solid var(--color-border)", backgroundColor: "var(--color-surface)" }}>
            <span className="font-mono" style={{ fontSize: "var(--text-micro)", letterSpacing: "0.1em", color: "var(--color-text-dim)" }}>
              01 — audio
            </span>
            <div className="flex-1 flex items-center justify-center">
              <span className="font-mono uppercase" style={{ fontSize: "var(--text-micro)", letterSpacing: "0.15em", color: "var(--color-text-dim)" }}>
                Audio Visualizer
              </span>
            </div>
            <p className="font-sans" style={{ fontSize: "var(--text-small)", color: "var(--color-text-dim)", lineHeight: 1.6 }}>
              Reactive Equalizer Array. Move cursor across elements to simulate audio peaks.
            </p>
          </div>

          {/* Exp 2 */}
          <div className="aspect-square flex flex-col justify-between p-8" style={{ border: "1px solid var(--color-border)", backgroundColor: "var(--color-surface)" }}>
            <span className="font-mono" style={{ fontSize: "var(--text-micro)", letterSpacing: "0.1em", color: "var(--color-text-dim)" }}>
              02 — chronos
            </span>
            <div className="flex-1 flex items-center justify-center">
              <HexClock />
            </div>
            <p className="font-sans" style={{ fontSize: "var(--text-small)", color: "var(--color-text-dim)", lineHeight: 1.6 }}>
              High-frequency millisecond tick mapped to live hexadecimal color conversion.
            </p>
          </div>

          {/* Exp 3 */}
          <div className="aspect-square flex flex-col justify-between p-8" style={{ border: "1px solid var(--color-border)", backgroundColor: "var(--color-surface)" }}>
            <span className="font-mono" style={{ fontSize: "var(--text-micro)", letterSpacing: "0.1em", color: "var(--color-text-dim)" }}>
              03 — typography
            </span>
            <div className="flex-1 flex items-center justify-center">
              <span className="font-display italic" style={{ fontSize: "var(--text-h3)", color: "var(--color-text)" }}>
                Craft &amp; Code
              </span>
            </div>
            <p className="font-sans" style={{ fontSize: "var(--text-small)", color: "var(--color-text-dim)", lineHeight: 1.6 }}>
              Type specimen with scroll-driven animation. Coming soon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
