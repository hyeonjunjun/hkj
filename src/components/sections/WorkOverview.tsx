"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring, useMotionTemplate, AnimatePresence } from "framer-motion";
import { PROJECTS } from "@/constants/projects";
import Image from "next/image";
import Link from "next/link";
import { useLenis } from "lenis/react";
import { Lock, Unlock } from "lucide-react";

/**
 * Dual-State Vertical Carousel
 * ────────────────────────────
 * Left: Project list 01-04
 * Center: Vertical stack of images (active scales up)
 * Right: Project list 05-09
 *
 * UNLOCKED: Finite sticky scroll (h-[300vh]) tied to scrollYProgress
 * LOCKED: Page scroll frozen via Lenis. Mouse wheel infinity scrolls the carousel.
 */

const TOTAL_PROJECTS = PROJECTS.length;
const MID = Math.ceil(TOTAL_PROJECTS / 2);
const LEFT_PROJECTS = PROJECTS.slice(0, MID);
const RIGHT_PROJECTS = PROJECTS.slice(MID);

export default function WorkOverview() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isLocked, setIsLocked] = useState(false);

    const lenis = useLenis();

    /* ─── FINITE SCROLL (UNLOCKED STATE) ─── */
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    /* ─── INFINITE SCROLL (LOCKED STATE) ─── */
    const manualScroll = useMotionValue(0);
    // Smooth the manual scrolling for wheel events
    const smoothManualScroll = useSpring(manualScroll, { damping: 30, stiffness: 100, mass: 1 });

    useEffect(() => {
        if (!isLocked) {
            if (lenis) lenis.start();
            return;
        }

        // When locked, freeze lenis and hijack wheel events for infinite scroll
        if (lenis) lenis.stop();

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            // Scale delta to a standard range
            const delta = e.deltaY * 0.001;
            manualScroll.set(manualScroll.get() + delta);
        };

        window.addEventListener("wheel", handleWheel, { passive: false });
        // Optional: Touch support
        let touchStart = 0;
        const handleTouchStart = (e: TouchEvent) => { touchStart = e.touches[0].clientY; };
        const handleTouchMove = (e: TouchEvent) => {
            e.preventDefault();
            const delta = (touchStart - e.touches[0].clientY) * 0.005;
            manualScroll.set(manualScroll.get() + delta);
            touchStart = e.touches[0].clientY;
        };

        window.addEventListener("touchstart", handleTouchStart, { passive: false });
        window.addEventListener("touchmove", handleTouchMove, { passive: false });

        return () => {
            if (lenis) lenis.start();
            window.removeEventListener("wheel", handleWheel);
            window.removeEventListener("touchstart", handleTouchStart);
            window.removeEventListener("touchmove", handleTouchMove);
        };
    }, [isLocked, lenis, manualScroll]);

    /* ─── SCROLL NORMALIZATION ─── */
    // Map both progress values (0 to 1 finite vs infinite continuous number) 
    // to a uniform offset we can use to drive the UI.
    const activeProgress = isLocked ? smoothManualScroll : scrollYProgress;

    // Convert activeProgress to total pixels of translation
    // Let's say one "card" height represents 0.1 of progress.
    const ITEM_HEIGHT = 400; // Expected vertical travel per item
    const offset = useTransform(activeProgress, (v) => v * TOTAL_PROJECTS * ITEM_HEIGHT);

    return (
        <section
            id="work"
            // The wrapper controls finite scrolling length.
            // If locked, we don't care about the wrapper height since scroll is frozen.
            className={`relative ${isLocked ? "h-screen" : "h-[400vh]"}`}
            ref={containerRef}
            data-cursor="default"
        >
            <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center bg-canvas">

                {/* ─── THE LOCK TOGGLE ─── */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-auto">
                    <button
                        onClick={() => setIsLocked(!isLocked)}
                        className="group flex flex-col items-center justify-center gap-2 p-4 outline-none"
                        aria-label={isLocked ? "Unlock Carousel" : "Lock Carousel"}
                    >
                        <div className="w-12 h-12 bg-ink flex items-center justify-center text-canvas hover:invert transition-colors duration-300">
                            <AnimatePresence mode="popLayout">
                                {isLocked ? (
                                    <motion.div
                                        key="lock"
                                        initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                        exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
                                    >
                                        <Lock size={18} strokeWidth={2} />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="unlock"
                                        initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                        exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
                                    >
                                        <Unlock size={18} strokeWidth={2} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        <span className="font-sans text-[10px] uppercase font-bold tracking-wider text-ink">
                            {isLocked ? "LOCKED" : "UNLOCKED"}
                        </span>
                    </button>
                </div>

                {/* ─── 3-COLUMN LAYOUT ─── */}
                <div className="w-full flex justify-between px-6 sm:px-12 lg:px-20 relative pointer-events-none">

                    {/* LEFT LIST */}
                    <div className="w-1/4 h-[80vh] flex flex-col relative overflow-hidden hidden md:flex">
                        {LEFT_PROJECTS.map((project, i) => (
                            <ListItem
                                key={project.id}
                                project={project}
                                index={i}
                                offset={offset}
                                itemHeight={ITEM_HEIGHT}
                                total={TOTAL_PROJECTS}
                                isLocked={isLocked}
                            />
                        ))}
                    </div>

                    {/* CENTER IMAGE STACK */}
                    <div className="w-full max-w-[600px] h-[80vh] relative z-10 mx-auto">
                        {PROJECTS.map((project, i) => (
                            <ImageStackItem
                                key={project.id}
                                project={project}
                                index={i}
                                offset={offset}
                                itemHeight={ITEM_HEIGHT}
                                total={TOTAL_PROJECTS}
                                isLocked={isLocked}
                            />
                        ))}
                    </div>

                    {/* RIGHT LIST */}
                    <div className="w-1/4 h-[80vh] flex flex-col relative overflow-hidden hidden md:flex items-end text-right">
                        {RIGHT_PROJECTS.map((project, i) => (
                            <ListItem
                                key={project.id}
                                project={project}
                                index={i + MID}
                                offset={offset}
                                itemHeight={ITEM_HEIGHT}
                                total={TOTAL_PROJECTS}
                                isLocked={isLocked}
                                alignRight
                            />
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}

/* ──────────────────────────────
 * HELPER COMPONENTS
 * ────────────────────────────── */

function ListItem({ project, index, offset, itemHeight, total, isLocked, alignRight }: any) {
    // Math to unwrap the infinite sequence
    const yTransform = useTransform(offset, (v: number) => {
        const basePos = index * itemHeight;
        let currentPos = basePos - v;

        // Wrap logic
        const cycle = itemHeight * total;
        if (isLocked) {
            // Infinite Modulo calculation for wrapping
            currentPos = ((currentPos % cycle) + cycle) % cycle;
            // Shift so 0 is center, not top
            if (currentPos > cycle / 2) currentPos -= cycle;
        }

        return currentPos;
    });

    const opacityTransform = useTransform(yTransform, [-itemHeight, 0, itemHeight], [0, 1, 0]);

    return (
        <motion.div
            className={`absolute top-1/2 -translate-y-1/2 w-full ${alignRight ? "text-right" : "text-left"} pointer-events-auto`}
            style={{ y: yTransform, opacity: opacityTransform }}
        >
            <Link href={project.tags?.includes("Coming Soon") ? "#work" : `/work/${project.id}`} className={`inline-flex items-center group ${alignRight ? "flex-row-reverse" : ""}`}>
                <span className={`font-sans text-[10px] sm:text-[12px] font-bold uppercase text-ink-faint group-hover:text-ink transition-colors ${alignRight ? "ml-8" : "mr-8"}`}>
                    {String(index + 1).padStart(2, "0")}/
                </span>
                <span className="font-sans text-[10px] sm:text-[12px] font-bold uppercase tracking-widest text-ink group-hover:opacity-50 transition-opacity">
                    {project.title}
                </span>
            </Link>
        </motion.div>
    );
}

function ImageStackItem({ project, index, offset, itemHeight, total, isLocked }: any) {

    // Core positioning math
    const normalizePos = useTransform(offset, (v: number) => {
        const basePos = index * itemHeight;
        let p = basePos - v;

        const cycle = itemHeight * total;
        if (isLocked) {
            p = ((p % cycle) + cycle) % cycle;
            if (p > cycle / 2) p -= cycle;
        }
        return p;
    });

    // We use the normalized Y distance from center (0) to calculate transforms
    // Range maps: [-itemHeight (above), 0 (center), itemHeight (below)]
    const yTransform = useTransform(normalizePos, [-itemHeight, 0, itemHeight], [-300, 0, 300]);
    const scaleTransform = useTransform(normalizePos, [-itemHeight, 0, itemHeight], [0.8, 1, 0.8]);
    const opacityTransform = useTransform(normalizePos, [-itemHeight * 1.5, -itemHeight, 0, itemHeight, itemHeight * 1.5], [0, 0.5, 1, 0.5, 0]);

    // Calculate z-index. The closest to 0 (center) should have the highest z-index.
    const zIndexTransform = useTransform(normalizePos, (v) => {
        return Math.max(0, 100 - Math.abs(v));
    });

    return (
        <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] sm:w-[500px] aspect-[4/3] pointer-events-auto bg-canvas overflow-hidden"
            style={{
                y: yTransform,
                scale: scaleTransform,
                opacity: opacityTransform,
                zIndex: zIndexTransform
            }}
        >
            <Link href={project.tags?.includes("Coming Soon") ? "#work" : `/work/${project.id}`}>
                <Image
                    src={project.image || "/placeholder.jpg"}
                    alt={project.title}
                    fill
                    className={`object-cover ${project.tags?.includes("Coming Soon") ? "grayscale" : ""}`}
                />
            </Link>
        </motion.div>
    );
}
