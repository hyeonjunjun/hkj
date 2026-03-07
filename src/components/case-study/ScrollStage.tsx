"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useSpring, useMotionValue, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import type { Project, ProjectHighlight } from "@/constants/projects";
import { PROJECTS } from "@/constants/projects";
import Link from "next/link";
import Image from "next/image";
import ScrollToTop from "@/components/ScrollToTop";

interface ScrollStageProps {
    project: Project;
}

const reveal = {
    hidden: { opacity: 0, y: 24 },
    visible: (delay: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const },
    }),
};

function SidebarItem({ label, isActive, targetId }: { label: string; isActive: boolean; targetId: string }) {
    return (
        <button
            onClick={() => document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' })}
            className={`font-pixel text-[9px] tracking-[0.2em] uppercase text-left transition-all duration-300 ${isActive ? 'text-accent' : 'text-ink-faint hover:text-ink'}`}
        >
            {isActive && <span className="mr-2">●</span>}
            {label}
        </button>
    );
}

function MetaItem({ label, value }: { label: string; value: string | React.ReactNode }) {
    return (
        <div className="flex flex-col gap-2">
            <span className="font-pixel text-[9px] tracking-[0.25em] uppercase text-accent">
                {label}
            </span>
            <span className="font-sans text-sm text-ink transition-colors duration-300 hover:text-accent cursor-default">
                {value}
            </span>
        </div>
    );
}

function PlaceholderFrame({ label }: { label: string }) {
    return (
        <div className="w-full aspect-[16/10] bg-ink/[0.03] border border-dashed border-ink/[0.1] rounded-sm flex items-center justify-center">
            <span className="font-pixel text-[9px] tracking-[0.2em] uppercase text-ink-faint">{label}</span>
        </div>
    );
}

function ImageBlock({ src, index, fullWidth = false, placeholder }: { src: string; index: number; fullWidth?: boolean; placeholder?: string }) {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 });

    if (src.startsWith('/placeholder')) {
        return <PlaceholderFrame label={placeholder || "Media Pending"} />;
    }

    return (
        <motion.div
            ref={ref}
            className={`relative w-full aspect-[16/10] overflow-hidden rounded-sm group ${fullWidth ? 'md:col-span-2' : 'md:col-span-1'}`}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{
                duration: 0.8,
                delay: index * 0.05,
                ease: [0.16, 1, 0.3, 1],
            }}
        >
            <Image
                src={src}
                alt=""
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                sizes="100vw"
                quality={90}
            />
        </motion.div>
    );
}

function ProcessSection({ project }: { project: Project }) {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

    if (!project?.process) return null;

    return (
        <section id="the-rough" className="py-24 sm:py-32 border-t border-ink/[0.06]">
            <div className="px-6 sm:px-12 lg:px-0 mb-16">
                <motion.div
                    ref={ref}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    variants={reveal}
                >
                    <p className="font-pixel text-[9px] tracking-[0.3em] uppercase text-accent mb-4">
                        (01) The Rough
                    </p>
                    <h2 className="font-display italic text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.1] text-ink mb-8">
                        {project.process.title}
                    </h2>
                    <p className="font-sans text-[18px] leading-[1.7] text-ink-muted max-w-2xl">
                        {project.process.copy}
                    </p>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 sm:px-12 lg:px-0 mt-12">
                {project.process.images?.map((img, i) => (
                    <ImageBlock key={i} src={img} index={i} placeholder="Sketch / Wireframe" />
                )) || <PlaceholderFrame label="Process Media Pending" />}
            </div>
        </section>
    );
}

function EngineeringSection({ project }: { project: Project }) {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

    if (!project?.engineering) return null;

    return (
        <section id="engineering" className="py-24 sm:py-32 bg-ink/[0.02] border-y border-ink/[0.06]">
            <div className="px-6 sm:px-12 lg:px-0">
                <motion.div
                    ref={ref}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    variants={reveal}
                >
                    <p className="font-pixel text-[9px] tracking-[0.3em] uppercase text-accent mb-4">
                        (03) Engineering
                    </p>
                    <h2 className="font-display italic text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.1] text-ink mb-8">
                        {project.engineering.title}
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-16 items-start">
                        <div className="space-y-8">
                            <p className="font-sans text-[18px] leading-[1.8] text-ink-muted">
                                {project.engineering.copy}
                            </p>
                            <div className="flex flex-wrap gap-3">
                                {project.engineering.signals?.map(signal => (
                                    <span key={signal} className="px-3 py-1 bg-white border border-ink/[0.1] rounded-full font-pixel text-[8px] tracking-[0.1em] text-ink uppercase">
                                        {signal}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-6">
                            {project.engineering.images?.map((img, i) => (
                                <ImageBlock key={i} src={img} index={i} placeholder="Technical Architecture / Code Snippet" />
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

function SystemSection({ project }: { project: Project }) {
    if (!project?.schematic) return null;

    return (
        <section id="the-system" className="py-24 sm:py-32 border-t border-ink/[0.06]">
            <div className="px-6 sm:px-12 lg:px-0 mb-20">
                <p className="font-pixel text-[9px] tracking-[0.3em] uppercase text-accent mb-4">
                    (04) The System
                </p>
                <h2 className="font-display italic text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.1] text-ink">
                    Design Specifications
                </h2>
            </div>

            <div className="px-6 sm:px-12 lg:px-0">
                <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-20">
                    <div className="space-y-20">
                        {/* Typography */}
                        <div className="border-t border-ink/[0.06] pt-10">
                            <p className="font-pixel text-[8px] tracking-[0.2em] uppercase text-ink-faint mb-10">Typeface</p>
                            <div className="space-y-4">
                                <h3 className="font-display italic text-[clamp(3.5rem,8vw,7rem)] leading-none text-ink">Aa Zz</h3>
                                <p className="font-sans text-sm text-ink-muted uppercase tracking-[0.1em]">{project.schematic.typography}</p>
                            </div>
                        </div>

                        {/* Grid */}
                        <div className="border-t border-ink/[0.06] pt-10">
                            <p className="font-pixel text-[8px] tracking-[0.2em] uppercase text-ink-faint mb-10">Grid Rules</p>
                            <div className="h-64 border border-ink/[0.06] relative overflow-hidden flex items-center justify-center group bg-canvas">
                                {/* Simulated Grid Lines */}
                                <div className="absolute inset-0 grid grid-cols-12 gap-px px-px">
                                    {Array.from({ length: 12 }).map((_, i) => (
                                        <div key={i} className="bg-ink/[0.03] h-full" />
                                    ))}
                                </div>
                                <span className="relative z-10 font-pixel text-[8px] tracking-[0.2em] uppercase text-ink-muted">{project.schematic.grid}</span>
                            </div>
                        </div>
                    </div>

                    {/* Colors */}
                    <div className="border-t border-ink/[0.06] pt-10">
                        <p className="font-pixel text-[8px] tracking-[0.2em] uppercase text-ink-faint mb-10">Atmospheric Palette</p>
                        <div className="space-y-6">
                            {project.schematic.colors?.map(color => (
                                <div key={color} className="flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-sm border border-black/5 shadow-sm" style={{ backgroundColor: color }} />
                                    <div>
                                        <p className="font-pixel text-[10px] tracking-[0.1em] text-ink uppercase">{color}</p>
                                        <p className="font-sans text-[10px] text-ink-muted uppercase tracking-[0.1em]">Primary Selection</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function HighlightSection({ highlight, index, id }: { highlight: ProjectHighlight; index: number; id: string }) {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

    if (!highlight) return null;

    return (
        <div id={id} className="py-12 sm:py-16">
            <div className="px-6 sm:px-12 lg:px-0 mb-12">
                <motion.div
                    ref={ref}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    variants={reveal}
                    custom={0}
                >
                    <p className="font-pixel text-[9px] tracking-[0.3em] uppercase text-ink-faint mb-4">
                        02.{index + 1} // HIGHLIGHT
                    </p>
                    <h2 className="font-display italic text-[clamp(2rem,5vw,4rem)] leading-[1.1] text-ink mb-10">
                        {highlight.title}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-[1fr_350px] gap-12 items-start">
                        <p className="font-sans text-[16px] leading-[1.8] text-ink-muted">
                            {highlight.description}
                        </p>
                        <div className="bg-ink/[0.02] border border-ink/[0.06] p-8 rounded-sm">
                            <p className="font-sans italic text-sm text-ink mb-4 leading-relaxed">
                                Challenge: {highlight.challenge}
                            </p>
                            {highlight.recipe && (
                                <p className="font-pixel text-[8px] tracking-[0.1em] text-accent uppercase">
                                    Recipe: {highlight.recipe}
                                </p>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 px-6 sm:px-12 lg:px-0">
                {highlight.images?.map((img, i) => (
                    <ImageBlock
                        key={`${img}-${i}`}
                        src={img}
                        index={i}
                        fullWidth={i === 0 && highlight.images.length % 2 !== 0}
                    />
                )) || <PlaceholderFrame label="Highlight Media Pending" />}
            </div>
        </div>
    );
}

export default function ScrollStage({ project }: ScrollStageProps) {
    const [activeSection, setActiveSection] = useState("overview");
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

    /* ─── Cursor tracking for light spot (Hero continuity) ─── */
    const rawX = useMotionValue(0.5);
    const rawY = useMotionValue(0.5);
    const spotX = useSpring(rawX, { damping: 40, stiffness: 120, mass: 0.8 });
    const spotY = useSpring(rawY, { damping: 40, stiffness: 120, mass: 0.8 });

    useEffect(() => {
        const handleMove = (e: MouseEvent) => {
            const nx = e.clientX / window.innerWidth;
            const ny = e.clientY / window.innerHeight;
            rawX.set(nx);
            rawY.set(ny);
        };

        window.addEventListener("mousemove", handleMove, { passive: true });
        return () => window.removeEventListener("mousemove", handleMove);
    }, [rawX, rawY]);

    const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.2 });
    const [metaRef, metaInView] = useInView({ triggerOnce: true, threshold: 0.3 });

    const sections = [
        { id: "overview", label: "Overview" },
        { id: "the-rough", label: "The Rough" },
        ...(project.highlights?.map((h, i) => ({ id: `highlight-${i}`, label: h.title || `Highlight ${i + 1}` })) || []),
        { id: "engineering", label: "Engineering" },
        { id: "the-system", label: "The System" },
        { id: "statistics", label: "Statistics" },
        { id: "launch", label: "Launch" }
    ];

    useEffect(() => {
        const observers = sections.map(section => {
            const observer = new IntersectionObserver(([entry]) => {
                if (entry.isIntersecting) setActiveSection(section.id);
            }, { threshold: 0.2 });
            const el = document.getElementById(section.id);
            if (el) observer.observe(el);
            return { observer, el };
        });

        return () => observers.forEach(o => o.el && o.observer.unobserve(o.el));
    }, [project.highlights]);

    const currentIndex = PROJECTS.findIndex((p) => p.id === project.id);
    const nextProject = PROJECTS[(currentIndex + 1) % PROJECTS.length] || PROJECTS[0];

    return (
        <div ref={containerRef} className="min-h-screen bg-canvas selection:bg-accent selection:text-white relative overflow-hidden">
            {/* ─── Cursor Light Spot (Subtle Sanctuary Persistence) ─── */}
            <motion.div
                className="fixed inset-0 pointer-events-none z-[1]"
                style={{
                    background: useTransform(
                        [spotX, spotY],
                        ([x, y]: number[]) =>
                            `radial-gradient(800px circle at ${(x as number) * 100}% ${(y as number) * 100}%, rgba(139,158,107,0.04) 0%, rgba(139,158,107,0.01) 40%, transparent 80%)`
                    ),
                }}
            />

            {/* Progress Bar */}
            <motion.div className="fixed top-0 left-0 right-0 h-[2px] bg-accent z-[100] origin-left" style={{ scaleX }} />

            <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-screen">
                {/* ─── Integrated Sidebar ─── */}
                <aside className="hidden lg:block lg:col-span-3 px-12 pt-12 pb-32">
                    <div className="sticky top-12 space-y-12">
                        <Link
                            href="/"
                            className="font-pixel text-[10px] tracking-[0.2em] uppercase text-ink-faint hover:text-ink transition-colors block"
                        >
                            ← Studio Index
                        </Link>

                        <nav className="flex flex-col gap-6 pt-8">
                            {sections.map(s => (
                                <SidebarItem key={s.id} label={s.label.slice(0, 18)} targetId={s.id} isActive={activeSection === s.id} />
                            ))}
                        </nav>
                    </div>
                </aside>

                {/* ─── Main Content ─── */}
                <main className="lg:col-span-9 flex flex-col min-w-0 overflow-hidden">
                    {/* ─── Header ─── */}
                    <motion.div
                        className="flex items-center justify-between px-6 sm:px-12 lg:px-0 pt-12 pb-4 border-b border-ink/[0.03]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <div className="flex items-center gap-12">
                            <div className="lg:hidden">
                                <Link
                                    href="/"
                                    className="font-pixel text-[10px] tracking-[0.2em] uppercase text-ink-faint hover:text-ink transition-colors"
                                >
                                    ← Home
                                </Link>
                            </div>
                            <div className="flex gap-2">
                                {project.tags?.map(tag => (
                                    <span key={tag} className="px-2 py-1 border border-ink/[0.08] rounded-full font-pixel text-[7px] tracking-[0.15em] text-ink-faint uppercase">
                                        {tag}
                                    </span>
                                )) || null}
                            </div>
                        </div>
                        <span className="lg:pr-12 font-pixel text-[10px] tracking-[0.3em] uppercase text-ink-faint">
                            Nᵒ {project.id}
                        </span>
                    </motion.div>

                    {/* ─── Hero ─── */}
                    <div
                        id="overview"
                        ref={heroRef}
                        className="px-6 sm:px-12 lg:px-0 pt-16 sm:pt-24 pb-16 sm:pb-20"
                    >
                        <div className="max-w-4xl">
                            <motion.p
                                className="font-pixel text-[9px] tracking-[0.3em] uppercase text-ink-faint mb-4"
                                initial="hidden"
                                animate={heroInView ? "visible" : "hidden"}
                                variants={reveal}
                            >
                                ({project.client})
                            </motion.p>

                            <motion.h1
                                className="font-display italic text-[clamp(2.5rem,8vw,6rem)] leading-[1.05] tracking-[-0.02em] text-ink"
                                initial="hidden"
                                animate={heroInView ? "visible" : "hidden"}
                                variants={reveal}
                            >
                                {project.editorial.headline}
                            </motion.h1>

                            <motion.p
                                className="font-display italic text-[clamp(1.2rem,2.5vw,2.2rem)] text-ink-muted mt-4 leading-[1.3]"
                                initial="hidden"
                                animate={heroInView ? "visible" : "hidden"}
                                variants={reveal}
                                custom={0.2}
                            >
                                {project.pitch}
                            </motion.p>
                        </div>
                    </div>

                    {/* ─── Metadata ─── */}
                    <motion.div
                        ref={metaRef}
                        className="px-6 sm:px-12 lg:px-0 py-12 border-y border-ink/[0.06] lg:mr-12"
                        initial={{ opacity: 0, y: 16 }}
                        animate={metaInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-8">
                            <MetaItem label="Client" value={project.client} />
                            <MetaItem label="Year" value={project.year} />
                            <MetaItem label="Stack" value={project.schematic.stack.slice(0, 3).join(", ")} />
                            <MetaItem label="System" value={project?.schematic?.grid} />
                            <MetaItem
                                label="Team"
                                value={project.contributors?.map(c => c.name).join(", ") || "N/A"}
                            />
                        </div>
                    </motion.div>

                    {/* ─── Content Sections (No redundancy in padding) ─── */}
                    <div className="pr-6 sm:pr-12 lg:pr-12">
                        <div className="px-6 sm:px-12 lg:px-0 py-24 sm:py-32">
                            <motion.div
                                className="max-w-3xl"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <p className="font-pixel text-[9px] tracking-[0.25em] uppercase text-ink-faint mb-8">
                                    The Mission
                                </p>
                                <p className="font-sans text-[clamp(1.1rem,1.5vw,1.4rem)] leading-[1.7] text-ink-muted italic">
                                    {project.editorial.copy}
                                </p>
                            </motion.div>
                        </div>

                        <ProcessSection project={project} />

                        <div className="space-y-12">
                            <div className="px-6 sm:px-12 lg:px-0 pt-24 pb-12">
                                <p className="font-pixel text-[9px] tracking-[0.3em] uppercase text-accent mb-4">
                                    (02) Highlights
                                </p>
                                <h2 className="font-display italic text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.1] text-ink">
                                    Core Capabilities
                                </h2>
                            </div>
                            {project.highlights?.map((h, i) => (
                                <HighlightSection key={h.id} highlight={h} index={i} id={`highlight-${i}`} />
                            ))}
                        </div>

                        <EngineeringSection project={project} />

                        <SystemSection project={project} />

                        {/* ─── Statistics ─── */}
                        <section id="statistics" className="px-6 sm:px-12 lg:px-0 py-32 border-t border-ink/[0.06]">
                            <p className="font-pixel text-[9px] tracking-[0.3em] uppercase text-ink-faint mb-16">
                                Quantitative Data
                            </p>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
                                {project.statistics?.map(stat => (
                                    <div key={stat.label}>
                                        <p className="font-display italic text-[clamp(3.5rem,7vw,5.5rem)] text-ink leading-none mb-3">
                                            {stat.value}
                                        </p>
                                        <p className="font-pixel text-[9px] tracking-[0.2em] uppercase text-ink-faint">
                                            {stat.label}
                                        </p>
                                    </div>
                                )) || null}
                            </div>
                        </section>

                        {/* ─── Launch ─── */}
                        {project.launchVideos?.length > 0 && (
                            <section id="launch" className="px-6 sm:px-12 lg:px-0 py-32 border-t border-ink/[0.06]">
                                <p className="font-pixel text-[9px] tracking-[0.3em] uppercase text-ink-faint mb-16">
                                    The Reveal
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                                    {project.launchVideos?.map(vid => (
                                        <div key={vid.id} className="group">
                                            <div className="relative aspect-[9/16] bg-ink/[0.05] rounded-sm overflow-hidden mb-4 border border-ink/5">
                                                {vid.thumbnail && <Image src={vid.thumbnail} alt={vid.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />}
                                                <div className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center translate-y-4 group-hover:translate-y-0 transition-transform">
                                                        <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-black border-b-[6px] border-b-transparent ml-1" />
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="font-pixel text-[8px] tracking-[0.1em] uppercase text-accent mb-1">{vid.type}</p>
                                            <p className="font-sans text-xs text-ink">{vid.title}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    <div className="border-t border-ink/[0.06] mt-auto overflow-hidden">
                        <Link
                            href={`/work/${nextProject.id}`}
                            className="group relative z-20 block px-6 sm:px-12 py-32 sm:py-44 transition-all duration-500 hover:bg-black overflow-hidden"
                        >
                            <div className="relative z-10 max-w-4xl">
                                <p className="font-pixel text-[9px] tracking-[0.3em] uppercase text-ink-faint mb-6 group-hover:text-white/40 transition-colors">
                                    Next Sequence
                                </p>
                                <h3 className="font-display italic text-[clamp(2.5rem,6vw,5.5rem)] leading-[1.15] text-ink group-hover:text-accent transition-all duration-500 group-hover:translate-x-4 break-words">
                                    {nextProject.title}
                                </h3>
                                <p className="font-sans text-sm text-ink-muted mt-8 max-w-xl group-hover:text-white/60 transition-colors leading-relaxed">
                                    {nextProject.pitch}
                                </p>
                            </div>

                            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                <div className="absolute top-1/2 right-8 sm:right-12 lg:right-16 -translate-y-1/2 opacity-0 group-hover:opacity-[0.06] transition-all duration-700">
                                    <span className="font-display italic text-[min(20rem,40vw)] leading-none text-white select-none">
                                        {nextProject.id.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </div>

                    <footer className="px-6 sm:px-12 lg:px-0 py-12 border-t border-ink/[0.06] flex justify-between items-center bg-canvas lg:pr-12">
                        <span className="font-pixel text-[9px] tracking-[0.3em] uppercase text-ink-faint">
                            HKJ Studio © 2025
                        </span>
                        <button
                            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                            className="font-pixel text-[9px] tracking-[0.3em] uppercase text-ink-faint hover:text-accent transition-colors"
                        >
                            ↑ Return to Surface
                        </button>
                    </footer>
                </main>
            </div>

            <ScrollToTop />
        </div>
    );
}
