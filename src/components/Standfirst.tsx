"use client";

import { motion } from "framer-motion";
import { studio } from "@/data/studio";
import { delaySeconds, durationSeconds, windEasing } from "@/lib/motion";

/**
 * Short supporting line beneath Wordmark in the landing page's composed
 * identity block. Typography intentionally stays the project's existing
 * sans (Inter Tight) rather than General Sans -- only structural headers
 * (the name, the thesis) get the display treatment.
 */
export default function Standfirst() {
  return (
    <motion.p
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delaySeconds.standfirst, duration: durationSeconds.reveal, ease: windEasing }}
      className="mt-2 max-w-[380px] font-sans text-[14px] leading-[1.5] text-ws-ink"
    >
      {studio.standfirst}
    </motion.p>
  );
}
