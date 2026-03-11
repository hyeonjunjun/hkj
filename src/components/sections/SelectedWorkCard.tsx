"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Project } from "@/constants/projects";
import { useRouter } from "next/navigation";

interface SelectedWorkCardProps {
  project: Project;
  index: number;
}

function EqBars() {
  return (
    <div className="flex items-end gap-[2px] h-3">
      <span className="eq-bar" style={{ height: "40%" }} />
      <span className="eq-bar" style={{ height: "70%" }} />
      <span className="eq-bar" style={{ height: "50%" }} />
    </div>
  );
}

export default function SelectedWorkCard({
  project,
  index,
}: SelectedWorkCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const num = String(index + 1).padStart(2, "0");
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={cardRef}
      role="link"
      tabIndex={0}
      onClick={() => router.push(`/work/${project.id}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter") router.push(`/work/${project.id}`);
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group cursor-pointer"
      data-cursor="explore"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: index * 0.08 }}
    >
      {/* Index + Name label */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <span className="index-num">[{num}]</span>
          <span
            className="font-mono uppercase tracking-[0.1em]"
            style={{
              fontSize: "var(--text-xs)",
              color: "var(--color-text)",
            }}
          >
            {project.title}
          </span>
        </div>
        {/* Equalizer on hover */}
        <div
          style={{
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        >
          <EqBars />
        </div>
      </div>

      {/* Client / Sector label */}
      <div className="mb-2">
        <span className="label">
          {project.client}
        </span>
      </div>

      {/* Thumbnail with LayoutId for FLIP */}
      <motion.div
        layoutId={`project-image-${project.id}`}
        className="relative w-full overflow-hidden"
        style={{
          aspectRatio: "16 / 10",
          border: "1px solid var(--color-border)",
        }}
      >
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-all duration-500"
          style={{
            filter: hovered ? "brightness(1.1)" : "brightness(0.85)",
            transform: hovered ? "scale(1.03)" : "scale(1)",
          }}
          priority={index === 0}
        />

        {/* Bottom info bar */}
        <div
          className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-3 py-2"
          style={{
            backgroundColor: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(4px)",
          }}
        >
          <span className="label">{project.sector}</span>
          <span className="label">{project.year}</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
