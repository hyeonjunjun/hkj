"use client";

import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative h-[100dvh] flex flex-col justify-end px-[clamp(32px,8vw,96px)] pb-[clamp(48px,10vh,120px)]">
      {/* Atmospheric radial glow — warm, barely there */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 30% 70%, rgba(200,164,85,0.03), transparent 70%)",
        }}
      />

      {/* Subtle top-right cool glow for depth */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 40% 40% at 80% 20%, rgba(74,138,140,0.02), transparent 60%)",
        }}
      />

      <div className="relative z-10 max-w-[900px]">
        {/* Small mono label above */}
        <motion.span
          className="block font-mono text-[10px] uppercase tracking-[0.12em] mb-6"
          style={{ color: "var(--fg-3)" }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          HKJ Studio
        </motion.span>

        {/* Main headline — large, serif, dramatic */}
        <motion.h1
          className="font-display font-normal leading-[1.05] tracking-[-0.025em]"
          style={{
            fontSize: "clamp(42px, 6vw, 72px)",
            color: "var(--fg)",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          Design
          <br />
          engineering
        </motion.h1>

        {/* Subtext — understated */}
        <motion.p
          className="font-mono text-[11px] tracking-[0.04em] mt-6 max-w-[360px] leading-[1.7]"
          style={{ color: "var(--fg-2)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          Craft, systems thinking, and the invisible details
          that make software feel intentional.
        </motion.p>
      </div>

      {/* Scroll hint — thin line at bottom center */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 w-px h-8"
        style={{ background: "var(--fg-4)" }}
        initial={{ opacity: 0, scaleY: 0 }}
        animate={{ opacity: 1, scaleY: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
      />
    </section>
  );
}
