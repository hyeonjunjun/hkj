"use client";

import { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";

const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";

interface TextDecryptProps {
    text: string;
    className?: string;
    speed?: number;
    duration?: number;
}

export default function TextDecrypt({ text, className = "", speed = 20, duration = 150 }: TextDecryptProps) {
    const [displayText, setDisplayText] = useState("");
    const containerRef = useRef<HTMLSpanElement>(null);
    const isInView = useInView(containerRef, { once: true, margin: "-10% 0px" });

    useEffect(() => {
        if (!isInView) return;

        let intervalId: NodeJS.Timeout;

        const startTime = Date.now();

        const shuffle = () => {
            const now = Date.now();
            if (now - startTime > duration) {
                setDisplayText(text);
                return;
            }

            const currentLength = text.length;
            let randomized = "";
            for (let i = 0; i < currentLength; i++) {
                // If it's a space, keep it a space
                if (text[i] === " ") {
                    randomized += " ";
                    continue;
                }
                randomized += CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
            }
            setDisplayText(randomized);

            intervalId = setTimeout(shuffle, speed);
        };

        shuffle();

        return () => {
            clearTimeout(intervalId);
        };
    }, [text, speed, duration, isInView]);

    return (
        <span ref={containerRef} className={className}>
            {displayText}
        </span>
    );
}
