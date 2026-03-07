"use client";

import Link from "next/link";
import { useSliderStore } from "@/store/useSliderStore";

export default function GlobalNav() {
    const { activeSlide, totalSlides } = useSliderStore();

    // Calculate progress as a percentage
    const progress = totalSlides > 1 ? (activeSlide / (totalSlides - 1)) * 100 : 0;
    return (
        <nav className="fixed inset-0 z-50 pointer-events-none mix-blend-difference text-white p-6 sm:p-10 lg:p-12 flex flex-col justify-between uppercase tracking-widest font-mono text-[10px] leading-relaxed">

            {/* ─── TOP ROW ─── */}
            <div className="flex justify-between items-start w-full pointer-events-auto">

                {/* 1. Left Stack (Links) */}
                <div className="flex flex-col gap-1 items-start">
                    <Link href="#work" className="hover:opacity-50 transition-opacity">WORK</Link>
                    <Link href="#services" className="hover:opacity-50 transition-opacity">SERVICES</Link>
                    <Link href="#about" className="hover:opacity-50 transition-opacity">ABOUT</Link>
                    <Link href="#bts" className="hover:opacity-50 transition-opacity">BTS</Link>
                </div>

                {/* 2. Center Logo */}
                <div className="absolute left-1/2 -translate-x-1/2 top-6 sm:top-10 lg:top-12 flex flex-col items-center gap-1">
                    <div className="flex gap-2 font-bold tracking-[0.3em] text-[12px]">
                        <span>H</span>
                        <span>K</span>
                        <span>J</span>
                    </div>
                    <span className="text-[8px] tracking-[0.4em] opacity-70">STUDIO</span>
                </div>

                {/* 3. Right Buttons */}
                <div className="flex gap-4 items-center">
                    <button className="border border-white/20 px-4 py-2 hover:bg-white hover:text-black transition-colors duration-300">
                        LET'S TALK
                    </button>
                    <button className="border border-white/20 px-4 py-2 hover:bg-white hover:text-black transition-colors duration-300">
                        MENU
                    </button>
                </div>

            </div>

            {/* ─── BOTTOM ROW ─── */}
            <div className="flex justify-between items-end w-full pointer-events-auto">
                <div className="md:w-[150px]"></div> {/* Spacer for flex balance */}

                {/* Slide Indicator */}
                <div className="flex items-center gap-4 text-white/50">
                    <span className="text-white w-4 text-right">
                        {String(activeSlide + 1).padStart(2, '0')}
                    </span>
                    <div className="w-[40px] h-[1px] bg-white/20 relative">
                        <div
                            className="absolute left-0 top-0 h-full bg-white transition-all duration-500 ease-out min-w-[4px]"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <span>{String(totalSlides).padStart(2, '0')}</span>
                </div>

                <div className="md:w-[150px] text-right pointer-events-none opacity-50">
                    <span className="hidden md:inline">SCROLL // NAVIGATE</span>
                </div>
            </div>

        </nav>
    );
}
