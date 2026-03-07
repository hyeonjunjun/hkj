"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

/**
 * PullQuote — A breathing pause between sections
 * ────────────────────────────────────────────────
 * Large serif italic quote that fades in on scroll.
 */
export default function PullQuote() {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });

    const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
    const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [40, 0, 0, -40]);

    return (
        <div ref={ref} className="py-24 sm:py-32 lg:py-40 px-6 sm:px-12 lg:px-20 bg-canvas">
            <motion.blockquote
                className="max-w-4xl mx-auto text-center"
                style={{ opacity, y }}
            >
                <p className="font-display italic text-2xl sm:text-3xl lg:text-4xl text-ink/40 leading-relaxed tracking-tight">
                    &ldquo;The details are not the details.
                    <br />
                    They make the design.&rdquo;
                </p>
                <footer className="mt-6 font-sans text-[11px] tracking-[0.2em] uppercase text-ink-faint">
                    Charles Eames
                </footer>
            </motion.blockquote>
        </div>
    );
}
