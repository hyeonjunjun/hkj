"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import type { Project } from "@/constants/projects";
import { useDesignStore } from "@/store/useDesignStore";
import BoundingBox from "@/components/BoundingBox";


interface SpecimenRowProps {
    project: Project;
    index: number;
}

/**
 * SpecimenRow — Awwwards-style List Entry
 * ───────────────────────────────────────
 * - Minimal text-only row.
 * - On hover:
 *   1. Row expands in height to reveal editorial tagline.
 *   2. Large cinematic preview follows cursor.
 *   3. Accent color floods the line.
 */
export default function SpecimenRow({ project, index }: SpecimenRowProps) {
    const [isHovered, setIsHovered] = useState(false);
    const setActiveMood = useDesignStore((state) => state.setActiveMood);
    const setIsFocussed = useDesignStore((state) => state.setIsFocussed);


    // Cursor Tracking (Relative to viewport for global follow)
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Ref for the title element to get its position for magnetic effect
    const titleRef = useRef<HTMLHeadingElement>(null);
    const [titleCenter, setTitleCenter] = useState({ x: 0, y: 0 });

    // Spring physics for the image follow
    const springConfig = { damping: 25, stiffness: 150 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
    }, [mouseX, mouseY]);

    useEffect(() => {
        const updateTitlePosition = () => {
            if (titleRef.current) {
                const rect = titleRef.current.getBoundingClientRect();
                setTitleCenter({
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2,
                });
            }
        };

        updateTitlePosition(); // Set initial position
        window.addEventListener('resize', updateTitlePosition); // Update on resize
        return () => window.removeEventListener('resize', updateTitlePosition);
    }, []);


    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.05 }}
        >
            <BoundingBox tag="">
                <Link
                    href={`/work/${project.id}`}
                    className="group block relative border-b border-ink/10 overflow-visible"
                    data-cursor="view"
                    onMouseEnter={() => {
                        setIsHovered(true);
                        setIsFocussed(true);
                        // Handled by BoundingBox: playHover();
                    }}
                    onMouseLeave={() => {
                        setIsHovered(false);
                        setIsFocussed(false);
                    }}
                >
                    {/* ─── Main Row ─── */}
                    <div className="flex items-center justify-between py-6 sm:py-8 transition-colors duration-500 bg-transparent group-hover:bg-ink/[0.02]">
                        <div className="flex items-center gap-12 sm:gap-16">
                            {/* Index */}
                            <span className="font-mono font-bold text-[10px] text-ink-muted shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">
                                [{project.id}]
                            </span>

                            {/* Title */}
                            <h3 className="font-mono font-bold uppercase text-[clamp(1.5rem,3vw,2.5rem)] leading-none tracking-widest text-ink transition-colors duration-150 whitespace-nowrap">
                                {project.title}
                            </h3>
                        </div>

                        {/* Meta Detail (Hidden on mobile) */}
                        <div className="hidden md:flex items-center gap-16 text-right">
                            <div className="flex flex-col items-end">
                                <span className="font-mono font-bold text-[9px] text-ink-muted opacity-50 tracking-[0.2em] mb-1">
                                    CLIENT
                                </span>
                                <span className="font-mono text-[10px] text-ink uppercase tracking-wider transition-colors">
                                    {project.client}
                                </span>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="font-mono font-bold text-[9px] text-ink-muted opacity-50 tracking-[0.2em] mb-1">
                                    SECTOR
                                </span>
                                <span className="font-mono text-[10px] text-ink uppercase tracking-wider transition-colors">
                                    {project.sector}
                                </span>
                            </div>
                        </div>
                    </div>
                </Link>
            </BoundingBox>
        </motion.div>
    );
}
