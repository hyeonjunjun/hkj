"use client";

import { useState } from "react";
import useSound from "use-sound";

interface BoundingBoxProps {
    children: React.ReactNode;
    tag?: string;
    className?: string;
}

export default function BoundingBox({ children, tag = "[TRG_LOCKED]", className = "" }: BoundingBoxProps) {
    const [isHovered, setIsHovered] = useState(false);

    // Provide a mechanical click sound placeholder, this will quietly fail if sound missing rather than throwing.
    // In a real environment, you'd place "mechanical_click.mp3" in /public/assets/
    const [playHover] = useSound("/assets/mechanical_click.mp3", { volume: 0.25, interrupt: true });

    return (
        <div
            className={`relative group ${className}`}
            onMouseEnter={() => {
                setIsHovered(true);
                try { playHover(); } catch (e) { }
            }}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* The Bounding Box edges - zero easing snapping */}
            {isHovered && (
                <div className="absolute inset-[-12px] border border-ink/10 pointer-events-none z-50">
                    {tag && (
                        <span className="absolute -top-[14px] left-[-1px] font-mono text-[8px] font-bold tracking-widest text-ink/70 uppercase leading-none py-[2px]">
                            {tag}
                        </span>
                    )}
                    {/* Corner Crosshairs */}
                    <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-ink/40" />
                    <div className="absolute -top-1 -right-1 w-2 h-2 border-t border-r border-ink/40" />
                    <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b border-l border-ink/40" />
                    <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-ink/40" />
                </div>
            )}

            {/* Content Payload */}
            {children}
        </div>
    );
}
