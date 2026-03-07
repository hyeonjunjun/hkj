"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useStudioStore } from "@/lib/store";

/**
 * CurtainPreloader
 * ─────────────────
 * Choreographed brand moment.
 *
 * Sequence (~2.8s):
 *   0.3s  — "HKJ" drops in, letter-by-letter (spring)
 *   0.8s  — "Studio" slides in from left
 *   1.4s  — "NYC · Est. 2025" fades in
 *   2.0s  — Everything scales down + fades
 *   2.4s  — Curtain slides up
 */

const topVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.04, delayChildren: 0.3 },
    },
};

const bottomVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.06, delayChildren: 0.7 },
    },
};

const letterSlideIn = {
    hidden: { opacity: 0, x: -20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
    },
};

const letterDropIn = {
    hidden: { opacity: 0, y: -30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring" as const, stiffness: 300, damping: 20 },
    },
};

export default function CurtainPreloader() {
    const [visible, setVisible] = useState(true);
    const setLoaded = useStudioStore((s) => s.setLoaded);
    const isLoaded = useStudioStore((s) => s.isLoaded);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoaded(true);
        }, 2400);
        return () => clearTimeout(timer);
    }, [setLoaded]);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-canvas"
                    initial={{ y: 0 }}
                    animate={isLoaded ? { y: "-100%" } : { y: 0 }}
                    transition={{
                        duration: 1.2,
                        ease: [0.76, 0, 0.24, 1],
                    }}
                    onAnimationComplete={() => {
                        if (isLoaded) setVisible(false);
                    }}
                >
                    {/* ─── Choreographed Title ─── */}
                    <motion.div
                        className="flex flex-col items-center select-none"
                        animate={isLoaded ? { scale: 0.92, opacity: 0 } : {}}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {/* HKJ — drops in from above */}
                        <motion.div
                            className="font-display text-[clamp(3rem,10vw,6rem)] leading-[0.85] tracking-[-0.02em] text-ink mt-1 flex overflow-hidden"
                            variants={bottomVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {"HKJ".split("").map((char, i) => (
                                <motion.span
                                    key={`n-${i}`}
                                    variants={letterDropIn}
                                    className="inline-block will-change-transform"
                                >
                                    {char}
                                </motion.span>
                            ))}
                        </motion.div>

                        {/* Studio — slides in from left */}
                        <motion.div
                            className="font-sans text-[12px] tracking-[0.25em] uppercase text-ink-muted flex overflow-hidden mt-3"
                            variants={topVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {"Studio".split("").map((char, i) => (
                                <motion.span
                                    key={`s-${i}`}
                                    variants={letterSlideIn}
                                    className="inline-block will-change-transform"
                                >
                                    {char}
                                </motion.span>
                            ))}
                        </motion.div>

                        {/* Subtitle */}
                        <motion.p
                            className="font-sans text-[10px] tracking-[0.2em] uppercase text-ink-faint mt-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.4, duration: 0.6 }}
                        >
                            NYC · Est. 2025
                        </motion.p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
