"use client";

import { motion } from "framer-motion";
import { studio } from "@/data/studio";
import { delaySeconds, durationSeconds, windEasing } from "@/lib/motion";

/**
 * The philosophy statement, nested inside the landing page's composed
 * identity block (alongside Wordmark and Standfirst) -- landing-page-only,
 * not used by any room. Positioning is handled by the parent block
 * (see page.tsx), not by this component itself.
 */
export default function ThesisStatement() {
  return (
    <motion.p
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delaySeconds.thesis, duration: durationSeconds.reveal, ease: windEasing }}
      className="thesis mt-6 text-prose text-ws-ink"
    >
      {studio.thesis}
    </motion.p>
  );
}
