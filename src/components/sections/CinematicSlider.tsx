"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PROJECTS } from "@/constants/projects";
import Image from "next/image";
import TextDecrypt from "@/components/TextDecrypt";
import { useSliderStore } from "@/store/useSliderStore";

/**
 * CinematicSlider Engine
 * ──────────────────────
 * A unified, full-screen vertical snapping carousel.
 * Slide 0: The Hero (Title slide)
 * Slide 1 - N: The Projects
 * Interspersed: Breather slides
 */

export default function CinematicSlider() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isScrolling, setIsScrolling] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Calculate total slides: 1 Hero + 1 Breather + Projects
    // Currently hardcoded breather at index 4 (after 3 projects)
    const BREATHER_INDEX = 4;
    const totalSlides = PROJECTS.length + 2;

    // Global Store sync
    const { setActiveSlide, setTotalSlides } = useSliderStore();

    useEffect(() => {
        setTotalSlides(totalSlides);
    }, [totalSlides, setTotalSlides]);

    useEffect(() => {
        setActiveSlide(currentSlide);
    }, [currentSlide, setActiveSlide]);

    // Handle Wheel Events for snapping
    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            if (isScrolling) return;

            const threshold = 50;
            if (Math.abs(e.deltaY) > threshold) {
                if (e.deltaY > 0) {
                    // Scroll Down - Wrap to 0 if at the end
                    setIsScrolling(true);
                    setCurrentSlide((prev) => (prev + 1) % totalSlides);
                } else if (e.deltaY < 0) {
                    // Scroll Up - Wrap to end if at 0
                    setIsScrolling(true);
                    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
                }
            }
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener("wheel", handleWheel, { passive: false });
        }

        return () => {
            if (container) {
                container.removeEventListener("wheel", handleWheel);
            }
        };
    }, [currentSlide, isScrolling, totalSlides]);

    // Reset scrolling lock after animation
    useEffect(() => {
        if (isScrolling) {
            const timer = setTimeout(() => setIsScrolling(false), 1000); // 1s transition lock
            return () => clearTimeout(timer);
        }
    }, [isScrolling]);


    const renderSlide = () => {
        // Slide 0: HERO
        if (currentSlide === 0) {
            return (
                <motion.div
                    key="hero"
                    className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-canvas text-ink"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                >
                    {/* Background Vibe (Optional dim video) */}
                    <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
                        <video
                            src="https://cdn.coverr.co/videos/coverr-driving-through-the-city-at-night-8485/1080p.mp4"
                            autoPlay loop muted playsInline
                            className="w-full h-full object-cover grayscale blur-sm"
                        />
                    </div>

                    <div className="relative z-10 flex flex-col items-center text-center">
                        <h1 className="font-display font-black text-[clamp(6rem,15vw,20rem)] uppercase leading-none tracking-tighter text-outline-solid">
                            <TextDecrypt text="RYAN JUN" speed={15} duration={150} />
                        </h1>
                        <p className="font-mono text-[10px] sm:text-[12px] tracking-[0.3em] uppercase opacity-70 mt-4">
                            Design Engineer / Neural Urbanism
                        </p>
                    </div>
                </motion.div>
            );
        }

        // Slide BREATHER_INDEX: BREATHER SLIDE
        if (currentSlide === BREATHER_INDEX) {
            return (
                <motion.div
                    key="breather"
                    className="absolute inset-0 w-full h-full flex items-center justify-center bg-[#000] text-white"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className="text-center max-w-2xl px-6">
                        <h2 className="font-display font-bold text-4xl sm:text-6xl uppercase tracking-tight mb-6">
                            "The city is a circuit."
                        </h2>
                        <p className="font-mono text-xs tracking-widest opacity-50 uppercase">
                            Observation 04 / NY / EST
                        </p>
                    </div>
                </motion.div>
            );
        }

        // Slide 1, 2, 3... (Project Slides)
        // Need to map currentSlide index back to PROJECTS array index
        let projectIndex = currentSlide - 1;
        if (currentSlide > BREATHER_INDEX) {
            projectIndex = currentSlide - 2; // Subtract hero + breather
        }

        const project = PROJECTS[projectIndex];

        if (!project) return null; // Safety

        return (
            <motion.div
                key={`project-${project.id}`}
                className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-canvas group cursor-pointer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => window.location.href = `/work/${project.id}`}
            >
                {/* Full-bleed Image Background */}
                <div className="absolute inset-0 z-0 bg-black">
                    <Image
                        src={project.image || "/placeholder.jpg"}
                        alt={project.title}
                        fill
                        className="object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-700 ease-out"
                    />
                </div>

                <div className="relative z-10 flex flex-col items-center text-center text-white mix-blend-difference">
                    <h2 className="font-display font-black text-[clamp(4rem,10vw,14rem)] uppercase leading-[0.8] tracking-tighter">
                        <TextDecrypt text={project.title} speed={10} duration={100} />
                    </h2>
                    <p className="font-mono text-[10px] sm:text-[12px] tracking-[0.3em] uppercase opacity-70 mt-6">
                        {project.client} // {project.sector}
                    </p>
                </div>
            </motion.div>
        );
    };

    return (
        <section
            id="slider-engine"
            ref={containerRef}
            className="fixed inset-0 w-full h-screen overflow-hidden bg-black z-0 touch-none"
        >
            <AnimatePresence mode="wait">
                {renderSlide()}
            </AnimatePresence>
        </section>
    );
}
