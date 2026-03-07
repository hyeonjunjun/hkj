"use client";

import { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useDesignStore } from "@/store/useDesignStore";

export default function TacticalCursor() {
    const { isFocussed } = useDesignStore();

    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);

    // Tighter spring for instant "machine" feel
    const springConfig = { damping: 40, stiffness: 400, mass: 0.5 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const updateMousePosition = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        window.addEventListener("mousemove", updateMousePosition);
        return () => window.removeEventListener("mousemove", updateMousePosition);
    }, [mouseX, mouseY]);

    return (
        <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
            style={{
                x: springX,
                y: springY,
                translateX: "-50%",
                translateY: "-50%",
            }}
        >
            <motion.div
                className="relative flex items-center justify-center"
                animate={{
                    scale: isFocussed ? 1.5 : 1,
                    rotate: isFocussed ? 90 : 0
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
                {/* Center Dot */}
                <div className="w-[2px] h-[2px] bg-[#00FF41]" />

                {/* Crosshairs */}
                <div className="absolute w-[12px] h-[1px] bg-[#00FF41]" />
                <div className="absolute w-[1px] h-[12px] bg-[#00FF41]" />
            </motion.div>
        </motion.div>
    );
}
