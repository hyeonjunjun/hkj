"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

/**
 * Colophon — Intimate Footer
 * ───────────────────────────
 * Time-aware greeting, per-letter email hover,
 * rotating @, personal details.
 */
export default function Colophon() {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });
    const [eggCount, setEggCount] = useState(0);
    const eggTriggered = eggCount >= 5;

    return (
        <footer
            id="contact"
            ref={ref}
            className="px-6 sm:px-12 lg:px-20 py-24 sm:py-32 border-t border-border"
        >
            <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 gap-16 sm:gap-8"
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
                {/* Left: Contact + Links */}
                <div>
                    <h4 className="font-sans text-[11px] tracking-[0.2em] uppercase text-ink-faint mb-6">
                        Contact
                    </h4>
                    <EmailLink />
                    <div className="flex gap-6 mt-6">
                        {[
                            { label: "LinkedIn", href: "https://www.linkedin.com/in/ryan-jun-" },
                            { label: "GitHub", href: "https://github.com/hyeonjunjun" },
                            { label: "Twitter", href: "https://twitter.com/ryanjunhkj" },
                        ].map(({ label, href }) => (
                            <a
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-sans text-[11px] tracking-[0.15em] uppercase text-ink-faint hover:text-ink transition-colors duration-300 p-2 -m-2"
                            >
                                {label}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Right: Availability + Clock + Colophon */}
                <div className="sm:text-right">
                    <h4 className="font-sans text-[11px] tracking-[0.2em] uppercase text-ink-faint mb-6">
                        Availability
                    </h4>
                    <div className="flex items-center gap-2 sm:justify-end mb-4">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
                        </span>
                        <span className="font-sans text-[12px] text-ink-muted">
                            Open to projects
                        </span>
                    </div>

                    <TimeGreeting />

                    <p className="font-sans text-[11px] text-ink-faint leading-relaxed mt-8">
                        Built with Next.js, Framer Motion,
                        <br />
                        and late-night focus.
                        <br />
                        Set in Instrument Serif & Geist.
                    </p>
                </div>
            </motion.div>

            {/* Personal line + Copyright + Easter Egg */}
            <div className="mt-20 pt-6 border-t border-ink/[0.04]">
                <p className="font-sans text-[11px] text-ink-faint/60 text-center mb-4 font-display italic">
                    Made with care in a small apartment in NYC.
                </p>
                <p
                    className="font-sans text-[11px] tracking-[0.1em] text-ink-faint text-center select-none cursor-default p-4 -m-4"
                    onClick={() => setEggCount((c) => c + 1)}
                >
                    {eggTriggered ? (
                        <motion.span
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-ink-muted"
                        >
                            나비가 날아갑니다 🦋
                        </motion.span>
                    ) : (
                        <>© 2025 HKJ Studio. All rights reserved.</>
                    )}
                </p>
            </div>
        </footer>
    );
}

/**
 * EmailLink — Per-letter 3D rotateX flip on hover.
 * The @ symbol rotates continuously between hovers.
 */
function EmailLink() {
    const [isHovered, setIsHovered] = useState(false);
    const email = "hello@hkjstudio.com";
    const chars = email.split("");
    const STAGGER = 0.02;

    return (
        <a
            href={`mailto:${email}`}
            className="block mb-4 cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ perspective: "800px" }}
        >
            <span className="flex flex-wrap">
                {chars.map((char, i) => {
                    const isAt = char === "@";

                    return (
                        <motion.span
                            key={`${char}-${i}`}
                            className="font-display italic text-[clamp(1.2rem,2.5vw,1.8rem)] text-ink inline-block"
                            style={{
                                transformStyle: "preserve-3d",
                                whiteSpace: "pre",
                            }}
                            animate={{
                                rotateX: isAt
                                    ? isHovered ? 360 : undefined
                                    : isHovered ? 360 : 0,
                                color: isHovered
                                    ? "var(--color-accent)"
                                    : "var(--color-ink)",
                            }}
                            transition={
                                isAt && !isHovered
                                    ? {
                                        rotateX: {
                                            duration: 8,
                                            repeat: Infinity,
                                            ease: "linear",
                                        },
                                    }
                                    : {
                                        rotateX: {
                                            duration: 0.6,
                                            delay: i * STAGGER,
                                            ease: [0.16, 1, 0.3, 1],
                                        },
                                        color: {
                                            duration: 0.3,
                                            delay: i * STAGGER,
                                            ease: "easeOut",
                                        },
                                    }
                            }
                        >
                            {char}
                        </motion.span>
                    );
                })}
            </span>
        </a>
    );
}

/**
 * TimeGreeting — Contextual NYC greeting + live clock.
 */
function TimeGreeting() {
    const [greeting, setGreeting] = useState("");
    const [time, setTime] = useState("");

    useEffect(() => {
        const update = () => {
            const now = new Date();
            const nycTime = new Date(
                now.toLocaleString("en-US", { timeZone: "America/New_York" })
            );
            const hour = nycTime.getHours();

            let greet: string;
            if (hour < 12) greet = "Good morning from NYC";
            else if (hour < 18) greet = "Good afternoon from NYC";
            else if (hour < 22) greet = "Good evening from NYC";
            else greet = "Working late in NYC";

            setGreeting(greet);
            setTime(
                now.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false,
                    timeZone: "America/New_York",
                })
            );
        };
        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="font-sans text-[11px] tracking-[0.1em] text-ink-faint tabular-nums">
            {greeting} — {time || "--:--:--"}
        </div>
    );
}
