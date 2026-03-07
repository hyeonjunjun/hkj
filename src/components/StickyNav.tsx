"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import RollingLink from "@/components/RollingLink";

export default function StickyNav() {
    const { scrollY } = useScroll();
    const [hidden, setHidden] = useState(true);

    useMotionValueEvent(scrollY, "change", (latest) => {
        // Show after 90vh (past hero)
        if (latest > window.innerHeight * 0.9) {
            setHidden(false);
        } else {
            setHidden(true);
        }
    });

    return (
        <motion.nav
            className="fixed top-0 left-0 right-0 z-40 py-5 px-6 sm:px-12 lg:px-20 flex items-center justify-between pointer-events-none data-[visible=true]:pointer-events-auto"
            data-visible={!hidden}
            initial={{ y: -100, opacity: 0 }}
            animate={hidden ? { y: -100, opacity: 0 } : { y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
            <RollingLink
                href="#hero"
                label="HKJ Studio"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            />

            <div className="flex gap-8">
                {[
                    { label: "Work", href: "#work" },
                    { label: "About", href: "#about" },
                    { label: "Contact", href: "#contact" },
                ].map(({ label, href }) => (
                    <RollingLink
                        key={label}
                        href={href}
                        label={label}
                    />
                ))}
            </div>
        </motion.nav>
    );
}
