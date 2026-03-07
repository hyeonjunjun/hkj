"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

/**
 * CursorDot — "The Warmth Source"
 * ────────────────────────────────
 * A soft, warm glow orb that IS the brand.
 *
 * States:
 *   - default  → Soft 10px glow orb, clay color
 *   - link     → Shrinks to 4px dot, target text shifts to accent
 *   - image    → Expands to 60px warm ring with "View" text
 *   - click    → Ripple pulse
 */

type CursorState = "default" | "link" | "image" | "explore";

export default function CursorDot() {
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    // Smooth trailing spring — feels organic, not robotic
    const springConfig = { damping: 35, stiffness: 200, mass: 0.5 };
    const smoothX = useSpring(cursorX, springConfig);
    const smoothY = useSpring(cursorY, springConfig);

    const [cursorState, setCursorState] = useState<CursorState>("default");
    const [isVisible, setIsVisible] = useState(false);
    const [isClicking, setIsClicking] = useState(false);

    // Trail positions for luminous echo
    const [trail, setTrail] = useState<{ x: number; y: number; id: number }[]>([]);
    const trailId = useRef(0);
    const lastTrailPos = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
        if (!hasFinePointer) return;

        setIsVisible(true);

        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);

            // Trail logic — emit a trail dot every 30px moved
            const dx = e.clientX - lastTrailPos.current.x;
            const dy = e.clientY - lastTrailPos.current.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist > 30) {
                setTrail((prev) => [
                    ...prev.slice(-8),
                    { x: e.clientX, y: e.clientY, id: trailId.current++ },
                ]);
                lastTrailPos.current = { x: e.clientX, y: e.clientY };
            }
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;

            // Check for explore hover (cinematic video)
            const exploreTarget = target.closest("[data-cursor='explore']");
            if (exploreTarget) {
                setCursorState("explore");
                return;
            }

            // Check for image/project hover
            const imageTarget = target.closest("[data-cursor='view'], img, video:not([data-cursor='explore'])");
            if (imageTarget) {
                setCursorState("image");
                return;
            }

            // Check for links/buttons
            const interactive = target.closest(
                "a, button, [role='button'], input, textarea, select"
            );
            if (interactive) {
                setCursorState("link");
                return;
            }

            setCursorState("default");
        };

        const handleMouseDown = () => setIsClicking(true);
        const handleMouseUp = () => {
            setIsClicking(false);
        };

        window.addEventListener("mousemove", moveCursor, { passive: true });
        document.addEventListener("mouseover", handleMouseOver, { passive: true });
        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
            window.removeEventListener("mousemove", moveCursor);
            document.removeEventListener("mouseover", handleMouseOver);
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [cursorX, cursorY]);

    // Clean up old trail particles
    useEffect(() => {
        const interval = setInterval(() => {
            setTrail((prev) => prev.slice(-6));
        }, 200);
        return () => clearInterval(interval);
    }, []);

    if (!isVisible) return null;

    return (
        <>
            {/* ─── Trail: Luminous Echo ─── */}
            <AnimatePresence>
                {trail.map((dot) => (
                    <motion.div
                        key={dot.id}
                        className="fixed top-0 left-0 pointer-events-none z-[9996] rounded-full"
                        initial={{ opacity: 0.3, scale: 1 }}
                        animate={{ opacity: 0, scale: 0.3 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        style={{
                            x: dot.x,
                            y: dot.y,
                            width: 6,
                            height: 6,
                            translateX: "-50%",
                            translateY: "-50%",
                            background: "var(--color-accent)",
                        }}
                    />
                ))}
            </AnimatePresence>

            {/* ─── Click Ripple ─── */}
            <AnimatePresence>
                {isClicking && (
                    <motion.div
                        key="ripple"
                        className="fixed top-0 left-0 pointer-events-none z-[9997] rounded-full border border-accent/40"
                        initial={{ width: 10, height: 10, opacity: 0.6 }}
                        animate={{ width: 50, height: 50, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        style={{
                            x: cursorX,
                            y: cursorY,
                            translateX: "-50%",
                            translateY: "-50%",
                        }}
                    />
                )}
            </AnimatePresence>

            {/* ─── Main Orb ─── */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full"
                style={{
                    x: smoothX,
                    y: smoothY,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
                animate={{
                    width: cursorState === "image" ? 60 : cursorState === "explore" ? 80 : cursorState === "link" ? 4 : 10,
                    height: cursorState === "image" ? 60 : cursorState === "explore" ? 80 : cursorState === "link" ? 4 : 10,
                    opacity: 1,
                }}
                transition={{
                    width: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
                    height: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
                }}
            >
                {/* Glow layer */}
                <div
                    className="absolute inset-0 rounded-full transition-all duration-300"
                    style={{
                        background:
                            (cursorState === "image" || cursorState === "explore")
                                ? "transparent"
                                : "var(--color-accent)",
                        border:
                            (cursorState === "image" || cursorState === "explore")
                                ? "1.5px solid var(--color-accent)"
                                : "none",
                        boxShadow:
                            cursorState === "default"
                                ? "0 0 20px 6px rgba(207,149,123,0.25), 0 0 40px 12px rgba(207,149,123,0.08)"
                                : (cursorState === "image" || cursorState === "explore")
                                    ? "0 0 30px 8px rgba(207,149,123,0.12)"
                                    : "none",
                        opacity: cursorState === "link" ? 0.8 : 1,
                    }}
                />

                {/* "View" text inside the expanded ring */}
                {cursorState === "image" && (
                    <motion.span
                        className="absolute inset-0 flex items-center justify-center font-sans text-[9px] tracking-[0.2em] uppercase text-accent"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1, duration: 0.2 }}
                    >
                        View
                    </motion.span>
                )}

                {/* "Explore" text inside the expanded ring */}
                {cursorState === "explore" && (
                    <motion.span
                        className="absolute inset-0 flex items-center justify-center font-sans text-[9px] tracking-[0.2em] uppercase text-accent"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1, duration: 0.2 }}
                    >
                        Explore
                    </motion.span>
                )}
            </motion.div>

            {/* ─── Ambient glow halo (always visible, very subtle) ─── */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9995] rounded-full"
                style={{
                    x: smoothX,
                    y: smoothY,
                    translateX: "-50%",
                    translateY: "-50%",
                    width: 120,
                    height: 120,
                    background:
                        "radial-gradient(circle, rgba(207,149,123,0.04) 0%, transparent 70%)",
                }}
            />
        </>
    );
}
