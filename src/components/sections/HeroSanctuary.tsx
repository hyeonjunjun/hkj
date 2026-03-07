"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";

import BlobVideoShader from "@/components/BlobVideoShader";

/**
 * HeroSanctuary
 * ─────────────
 * Fullscreen spatial hero with cursor-reactive radial gradient
 * and parallax depth on the stacked headline.
 *
 *   [top-left]      HKJ Studio
 *   [top-right]     Work · About · Contact
 *   [center]        Ryan Jun / Design / Engineer —
 *   [bottom-left]   Design Engineer — NYC
 *   [bottom-right]  Available Q3 2026
 */

/* ─── Stagger animation variants ─── */
const containerVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.5, delayChildren: 0.5 },
    },
};

const lineReveal = {
    hidden: { clipPath: "inset(100% 0 0 0)", opacity: 0 },
    visible: {
        clipPath: "inset(0% 0 0 0)",
        opacity: 1,
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
    },
};

/* ─── Parallax multipliers per headline line ─── */
const PARALLAX = [0.015, 0.025, 0.035];

export default function HeroSanctuary() {
    const ref = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
    const contentY = useTransform(scrollYProgress, [0, 0.6], [0, -100]);

    /* ─── Cinematic Video Parallax & Scale ─── */
    const videoY = useTransform(scrollYProgress, [0, 1], [0, 200]);
    const videoScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.0]);

    /* ─── Parallax offset per line ─── */
    const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const section = ref.current;
        if (!section) return;

        const handleMove = (e: MouseEvent) => {
            const rect = section.getBoundingClientRect();
            const nx = (e.clientX - rect.left) / rect.width;
            const ny = (e.clientY - rect.top) / rect.height;
            setMouseOffset({ x: nx - 0.5, y: ny - 0.5 });
        };

        section.addEventListener("mousemove", handleMove, { passive: true });
        return () => section.removeEventListener("mousemove", handleMove);
    }, []);

    return (
        <section
            id="hero"
            ref={ref}
            className="relative h-screen w-full overflow-hidden bg-canvas"
        >
            {/* ─── Cinematic Shader Atmosphere ─── */}
            <motion.div
                className="absolute inset-0 z-0 select-none pointer-events-auto" // Needs pointer events for the shader mouse tracking
                style={{
                    y: videoY,
                    scale: videoScale,
                }}
            >
                <BlobVideoShader videoSrc="/assets/Add_soft_gentle_1080p_202602191457.mp4" />
            </motion.div>


            {/* ─── Content Layer ─── */}
            <motion.div
                className="absolute inset-0 z-10 flex flex-col justify-between p-6 sm:p-10 lg:p-16 mix-blend-difference text-canvas"
                style={{ opacity: contentOpacity, y: contentY }}
            >
                {/* ══ TOP BAR ══ */}
                <div className="flex justify-between items-start">
                    {/* Logo */}
                    <motion.div
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <Link
                            href="#hero"
                            className="font-sans text-[12px] tracking-[0.15em] uppercase hover:opacity-100 transition-opacity duration-300"
                            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                        >
                            HKJ Studio
                        </Link>
                    </motion.div>

                    {/* Navigation — plain text */}
                    <motion.nav
                        className="flex items-center gap-6 sm:gap-8"
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {[
                            { label: "Work", href: "#work" },
                            { label: "About", href: "#about" },
                            { label: "Contact", href: "#contact" },
                        ].map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="font-sans text-[12px] tracking-[0.15em] uppercase opacity-50 hover:opacity-100 transition-opacity duration-300"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </motion.nav>
                </div>

                {/* ══ CENTER: Stacked Headline with Parallax ══ */}
                <motion.div
                    className="flex-1 flex items-center"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <h1 className="w-full max-w-[90vw] lg:max-w-[80vw]">
                        {/* Line 1: Ryan Jun */}
                        <div className="overflow-hidden pb-4">
                            <motion.span
                                className="block font-sans font-bold uppercase text-[clamp(4rem,10vw,12rem)] leading-[0.85] tracking-tighter will-change-transform"
                                variants={lineReveal}
                                style={{
                                    transform: `translate(${mouseOffset.x * PARALLAX[0] * 100}px, ${mouseOffset.y * PARALLAX[0] * 100}px)`,
                                    transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                                }}
                            >
                                Ryan Jun
                            </motion.span>
                        </div>

                        {/* Line 2: Design */}
                        <div className="overflow-hidden mt-1 pb-4">
                            <motion.span
                                className="block font-sans font-bold uppercase text-[clamp(4rem,10vw,12rem)] leading-[0.85] tracking-tighter will-change-transform"
                                variants={lineReveal}
                                style={{
                                    transform: `translate(${mouseOffset.x * PARALLAX[1] * 100}px, ${mouseOffset.y * PARALLAX[1] * 100}px)`,
                                    transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                                }}
                            >
                                Design
                            </motion.span>
                        </div>

                        {/* Line 3: Engineer — */}
                        <div className="overflow-hidden mt-1 pb-4 flex items-baseline gap-4">
                            <motion.span
                                className="block font-sans font-bold uppercase text-[clamp(4rem,10vw,12rem)] leading-[0.85] tracking-tighter will-change-transform"
                                variants={lineReveal}
                                style={{
                                    transform: `translate(${mouseOffset.x * PARALLAX[2] * 100}px, ${mouseOffset.y * PARALLAX[2] * 100}px)`,
                                    transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                                }}
                            >
                                Engineer
                            </motion.span>
                            <motion.span
                                className="font-sans font-bold text-[clamp(3.5rem,9vw,11rem)] opacity-30 will-change-transform"
                                variants={lineReveal}
                                style={{
                                    transform: `translate(${mouseOffset.x * PARALLAX[2] * 100}px, ${mouseOffset.y * PARALLAX[2] * 100}px)`,
                                    transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                                }}
                            >
                                —
                            </motion.span>
                        </div>
                    </h1>
                </motion.div>

                {/* ══ BOTTOM BAR — Clean, plain text ══ */}
                <div className="flex justify-between items-end">
                    <motion.p
                        className="font-sans text-[12px] tracking-wide opacity-50"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    >
                        Design Engineer — NYC
                    </motion.p>

                    <motion.p
                        className="font-sans text-[12px] tracking-wide opacity-30 flex items-center gap-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.1, duration: 0.6 }}
                    >
                        Available Q3 2026
                        <motion.span
                            className="inline-block w-[1px] h-[12px] bg-canvas"
                            animate={{ opacity: [1, 0] }}
                            transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                        />
                    </motion.p>
                </div>

                {/* ─── Scroll Indicator ─── */}
                <motion.div
                    className="absolute bottom-6 left-1/2 -translate-x-1/2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4, duration: 0.5 }}
                >
                    <motion.div
                        className="w-[1px] h-8 bg-canvas/40 origin-top"
                        animate={{ scaleY: [0, 1, 0] }}
                        transition={{
                            duration: 2.4,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                </motion.div>
            </motion.div>


        </section >
    );
}
