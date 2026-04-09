"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const EASE_SWIFT = [0.23, 0.88, 0.26, 0.92] as const;

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 32, filter: "blur(3px)" }}
        animate={{
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { duration: 0.5, ease: EASE_SWIFT },
        }}
        exit={{
          opacity: 0,
          transition: { duration: 0.3, ease: EASE_SWIFT },
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
