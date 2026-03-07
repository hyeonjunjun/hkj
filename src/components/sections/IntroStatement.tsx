"use client";

import { useRef, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * IntroStatement — Personable About Section
 * ──────────────────────────────────────────
 * Word-level opacity scroll reveal. Serif italic accent.
 * Personal aside at the bottom.
 */

/* ─── Word reveal helper ─── */
function ScrollRevealText({
    text,
    className,
    scrollYProgress,
    startRange,
    endRange,
    accentPhrase,
}: {
    text: string;
    className?: string;
    scrollYProgress: any;
    startRange: number;
    endRange: number;
    accentPhrase?: string;
}) {
    const words = text.split(" ");

    return (
        <p className={className}>
            {words.map((word, i) => {
                const wordStart = startRange + (i / words.length) * (endRange - startRange);
                const wordEnd = wordStart + (1 / words.length) * (endRange - startRange) * 1.5;

                const isAccent = accentPhrase && text.indexOf(accentPhrase) !== -1 &&
                    words.slice(i, i + accentPhrase.split(" ").length).join(" ") === accentPhrase;

                // Check if this word is the start of the accent phrase
                const accentWords = accentPhrase?.split(" ") || [];
                const isAccentWord = accentPhrase &&
                    accentWords.includes(word) &&
                    text.indexOf(accentPhrase) !== -1 &&
                    i >= text.substring(0, text.indexOf(accentPhrase)).split(" ").length - 1 &&
                    i < text.substring(0, text.indexOf(accentPhrase)).split(" ").length - 1 + accentWords.length;

                return (
                    <WordReveal
                        key={`${word}-${i}`}
                        word={word}
                        scrollYProgress={scrollYProgress}
                        wordStart={wordStart}
                        wordEnd={wordEnd}
                        isAccent={!!isAccentWord}
                    />
                );
            })}
        </p>
    );
}

function WordReveal({
    word,
    scrollYProgress,
    wordStart,
    wordEnd,
    isAccent,
}: {
    word: string;
    scrollYProgress: any;
    wordStart: number;
    wordEnd: number;
    isAccent: boolean;
}) {
    const opacity = useTransform(
        scrollYProgress,
        [wordStart, wordEnd],
        [0.15, 1]
    );

    return (
        <motion.span
            className={`inline-block mr-[0.3em] ${isAccent
                    ? "font-display italic text-accent"
                    : ""
                }`}
            style={{ opacity }}
        >
            {word}
        </motion.span>
    );
}

export default function IntroStatement() {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start 0.85", "end 0.4"],
    });

    const clipProgress = useTransform(scrollYProgress, [0, 0.1], [100, 0]);
    const clipPath = useTransform(clipProgress, (v) => `inset(${v}% 0 0 0)`);

    return (
        <motion.section
            id="about"
            ref={containerRef}
            className="relative py-32 sm:py-48 lg:py-64 px-6 sm:px-12 lg:px-20 bg-canvas"
            style={{ clipPath }}
        >
            <div className="max-w-3xl mx-auto lg:mx-0 lg:ml-[16.66%]">

                {/* ─── The Statement — word-by-word reveal ─── */}
                <div>
                    <ScrollRevealText
                        text="I'm Ryan — a design engineer based in New York. I make things for the internet that are thoughtful, well-built, and occasionally a little unexpected."
                        className="font-sans text-xl sm:text-2xl lg:text-[1.75rem] leading-relaxed text-ink font-light flex flex-wrap"
                        scrollYProgress={scrollYProgress}
                        startRange={0.05}
                        endRange={0.45}
                        accentPhrase="a little unexpected"
                    />

                    <ScrollRevealText
                        text="Right now I'm interested in content systems, linguistic tools, and how AI can feel less like a product and more like a quiet companion."
                        className="mt-8 font-sans text-xl sm:text-2xl lg:text-[1.75rem] leading-relaxed text-ink-muted font-light flex flex-wrap"
                        scrollYProgress={scrollYProgress}
                        startRange={0.35}
                        endRange={0.75}
                    />
                </div>

                {/* ─── Personal Aside ─── */}
                <motion.div
                    className="mt-16 pt-6 border-t border-ink/[0.06]"
                    style={{
                        opacity: useTransform(scrollYProgress, [0.7, 0.9], [0, 1]),
                    }}
                >
                    <p className="font-sans text-[12px] text-ink-faint tracking-wide">
                        Currently reading:{" "}
                        <span className="text-ink-muted font-display italic">
                            Dept. of Speculation
                        </span>
                        <span className="text-ink/20 mx-2">·</span>
                        Listening to:{" "}
                        <span className="text-ink-muted font-display italic">
                            Ryuichi Sakamoto
                        </span>
                    </p>
                </motion.div>

                {/* ─── Divider ─── */}
                <motion.div
                    className="mt-16 h-px w-full bg-border"
                    style={{
                        opacity: useTransform(scrollYProgress, [0.85, 1], [0, 1]),
                        scaleX: useTransform(scrollYProgress, [0.85, 1], [0, 1]),
                        transformOrigin: "left",
                    }}
                />
            </div>
        </motion.section>
    );
}
