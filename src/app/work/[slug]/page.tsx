"use client";

import { useParams, useRouter } from "next/navigation";
import { PROJECTS } from "@/constants/projects";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";

export default function ProjectDetail() {
  const { slug } = useParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Find project
  const project = PROJECTS.find((p) => p.id === slug);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!project) {
    return (
      <div className="w-full h-screen flex items-center justify-center font-mono">
        PROJECT NOT FOUND [404]
      </div>
    );
  }

  return (
    <main className="w-full min-h-screen" style={{ backgroundColor: "var(--color-bg)" }}>
      {/* Back Button (Console Style) */}
      <motion.button
        onClick={() => router.back()}
        className="fixed top-8 left-6 z-50 flex items-center gap-2 group mix-blend-difference"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-mono text-[10px] tracking-widest uppercase">Return</span>
      </motion.button>

      {/* Hero Header with FLIP layoutId */}
      <motion.div
        layoutId={`project-image-${project.id}`}
        className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden"
      >
        <Image
          src={project.image}
          alt={project.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ filter: "brightness(0.7)" }}
        />
        
        {/* Title overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 bg-gradient-to-t from-black/80 to-transparent">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <span className="font-mono text-[10px] tracking-widest uppercase text-gray-400 block mb-2">
              [{project.sector}] // {project.year}
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-sans tracking-tight text-white mb-2">
              {project.title}
            </h1>
            <p className="font-mono text-sm tracking-widest uppercase text-gray-300">
              Client: {project.client}
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Project Content */}
      <div className="max-w-4xl mx-auto px-6 py-20 text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-12"
        >
          <div className="md:col-span-2">
            <p className="text-xl md:text-2xl leading-relaxed font-sans text-gray-300">
              {project.editorial.copy}
            </p>
          </div>
          <div className="font-mono text-xs uppercase tracking-widest text-gray-500 space-y-6">
            <div>
              <strong className="block text-gray-300 mb-2">Role</strong>
              <p>Design Engineer</p>
              <p>Creative Developer</p>
            </div>
            <div>
              <strong className="block text-gray-300 mb-2">Tech Stack</strong>
              <p>Next.js, WebGL, GSAP</p>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
