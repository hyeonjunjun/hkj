"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

interface MarginImageProps {
  src: string | null;
  alt: string;
}

const svgNoise = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

export default function MarginImage({ src, alt }: MarginImageProps) {
  return (
    <AnimatePresence mode="wait">
      {src && (
        <motion.div
          key={src}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.85 }}
          exit={{ opacity: 0, transition: { duration: 0.3, ease: [0.23, 0.88, 0.26, 0.92] } }}
          transition={{
            duration: 0.5,
            ease: [0.23, 0.88, 0.26, 0.92],
          }}
          className="hidden md:block"
          style={{
            position: "fixed",
            right: 24,
            top: "50%",
            transform: "translateY(-50%)",
            width: 280,
            zIndex: 5,
            pointerEvents: "none",
          }}
        >
          <Image
            src={src}
            alt={alt}
            width={280}
            height={400}
            className="image-treatment"
            style={{
              width: 280,
              height: "auto",
              display: "block",
            }}
          />
          {/* Grain overlay */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: svgNoise,
              opacity: 0.03,
              pointerEvents: "none",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
