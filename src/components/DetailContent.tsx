"use client";

import { motion } from "framer-motion";
import type { CaseStudy } from "@/constants/case-studies";

interface DetailContentProps {
  caseStudy?: CaseStudy;
  fallbackDescription: string;
}

const reveal = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: {
    type: "spring",
    stiffness: 120,
    damping: 20,
    mass: 0.8,
    delay: 0.1,
  },
};

function Divider() {
  return (
    <div className="relative my-10">
      <div className="h-px bg-fg-4" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-fg-4 rotate-45" />
    </div>
  );
}

export default function DetailContent({
  caseStudy,
  fallbackDescription,
}: DetailContentProps) {
  if (!caseStudy) {
    return (
      <article className="max-w-[700px] px-[clamp(24px,6vw,48px)] py-14">
        <p className="text-[14px] leading-[1.7] text-fg-2">
          {fallbackDescription}
        </p>
      </article>
    );
  }

  const { editorial, process, engineering } = caseStudy;

  return (
    <article className="max-w-[700px] px-[clamp(24px,6vw,48px)] py-14">
      {/* Editorial */}
      <motion.h2
        {...reveal}
        className="font-display text-[clamp(20px,3vw,28px)] text-fg leading-tight"
      >
        {editorial.heading}
      </motion.h2>

      {editorial.subhead && (
        <motion.p
          {...reveal}
          className="font-mono text-[10px] uppercase tracking-[0.06em] text-fg-3 mt-3"
        >
          {editorial.subhead}
        </motion.p>
      )}

      <motion.p
        {...reveal}
        className="text-[14px] leading-[1.7] text-fg-2 mt-6"
      >
        {editorial.copy}
      </motion.p>

      {/* Process */}
      {process && (
        <>
          <Divider />
          <motion.h3
            {...reveal}
            className="font-display text-[clamp(18px,2.5vw,24px)] text-fg leading-tight"
          >
            {process.title}
          </motion.h3>
          <motion.p
            {...reveal}
            className="text-[14px] leading-[1.7] text-fg-2 mt-4"
          >
            {process.copy}
          </motion.p>
        </>
      )}

      {/* Engineering */}
      {engineering && (
        <>
          <Divider />
          <motion.h3
            {...reveal}
            className="font-display text-[clamp(18px,2.5vw,24px)] text-fg leading-tight"
          >
            {engineering.title}
          </motion.h3>
          <motion.p
            {...reveal}
            className="text-[14px] leading-[1.7] text-fg-2 mt-4"
          >
            {engineering.copy}
          </motion.p>

          {engineering.signals.length > 0 && (
            <motion.div {...reveal} className="flex flex-wrap gap-2 mt-5">
              {engineering.signals.map((signal) => (
                <span
                  key={signal}
                  className="font-mono text-[10px] uppercase tracking-[0.04em] border border-fg-4 rounded-sm px-2 py-0.5 text-fg-3"
                >
                  {signal}
                </span>
              ))}
            </motion.div>
          )}
        </>
      )}
    </article>
  );
}
