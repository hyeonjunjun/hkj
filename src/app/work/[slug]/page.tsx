"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { PROJECTS } from "@/constants/projects";
import { CASE_STUDIES } from "@/constants/case-studies";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: [0.23, 0.88, 0.26, 0.92] as const },
};

export default function CaseStudy() {
  const { slug } = useParams();
  const router = useRouter();
  const [scrollPercent, setScrollPercent] = useState(0);

  const project = PROJECTS.find((p) => p.id === slug || p.slug === slug);
  const caseStudy = CASE_STUDIES[slug as string];
  const slugStr = slug as string;
  const allSlugs = PROJECTS.map((p) => p.slug);
  const currentIdx = allSlugs.indexOf(slugStr);
  const prevProject = currentIdx > 0 ? PROJECTS[currentIdx - 1] : null;
  const nextProject = currentIdx < PROJECTS.length - 1 ? PROJECTS[currentIdx + 1] : null;

  useEffect(() => {
    const el = document.querySelector("[data-page-scrollable]") as HTMLElement | null;
    const target = el ?? window;

    const handleScroll = () => {
      const scrollEl = el ?? document.documentElement;
      const scrollHeight = scrollEl.scrollHeight;
      const clientHeight = el ? el.clientHeight : window.innerHeight;
      const scrollTop = el ? el.scrollTop : window.scrollY;
      const pct = Math.round((scrollTop / (scrollHeight - clientHeight)) * 100);
      setScrollPercent(Math.max(0, Math.min(pct, 100)));
    };

    target.addEventListener("scroll", handleScroll, { passive: true });
    return () => target.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") router.push("/");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  if (!project) {
    return (
      <div
        data-page-scrollable
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--ink-secondary)",
        }}
      >
        project not found
      </div>
    );
  }

  const has = (s?: string) => s && s.trim().length > 0;

  return (
    <div data-page-scrollable>
      <div
        style={{
          maxWidth: 720,
          margin: "0 auto",
          padding: "clamp(80px, 12vh, 140px) 24px clamp(48px, 8vh, 80px)",
        }}
      >
        {/* Back */}
        <motion.div {...fadeUp} style={{ marginBottom: 48 }}>
          <Link
            href="/"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--ink-muted)",
              textDecoration: "none",
            }}
          >
            ← Back
          </Link>
        </motion.div>

        {/* Project Metadata */}
        <motion.div {...fadeUp} style={{ marginBottom: 64 }}>
          <h1
            className="font-mono"
            style={{
              fontSize: 10,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--ink-primary)",
              margin: "0 0 16px",
            }}
          >
            {project.title}
          </h1>
          <p
            className="font-mono"
            style={{
              fontSize: 10,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--ink-secondary)",
              margin: "0 0 24px",
              lineHeight: 1.6,
            }}
          >
            {project.description}
          </p>
          <div style={{ display: "flex", gap: 32 }}>
            {caseStudy?.role && (
              <div>
                <span className="font-mono" style={{ fontSize: 10, color: "var(--ink-muted)", display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.1em" }}>Role</span>
                <span className="font-mono" style={{ fontSize: 10, color: "var(--ink-secondary)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{caseStudy.role}</span>
              </div>
            )}
            <div>
              <span className="font-mono" style={{ fontSize: 10, color: "var(--ink-muted)", display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.1em" }}>Year</span>
              <span className="font-mono" style={{ fontSize: 10, color: "var(--ink-secondary)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{project.year}</span>
            </div>
            <div>
              <span className="font-mono" style={{ fontSize: 10, color: "var(--ink-muted)", display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.1em" }}>Sector</span>
              <span className="font-mono" style={{ fontSize: 10, color: "var(--ink-secondary)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{project.sector}</span>
            </div>
          </div>
        </motion.div>

        {/* Narrative Lede */}
        {caseStudy && (has(caseStudy.paradox) || has(caseStudy.stakes)) && (
          <motion.div {...fadeUp} style={{ marginBottom: 64 }}>
            {has(caseStudy.paradox) && (
              <p className="font-display" style={{ fontSize: "var(--text-title)", lineHeight: 1.4, color: "var(--ink-primary)", maxWidth: "58ch", fontStyle: "italic", margin: has(caseStudy.stakes) ? "0 0 24px" : 0 }}>
                {caseStudy.paradox}
              </p>
            )}
            {has(caseStudy.stakes) && (
              <p style={{ fontSize: "var(--text-body)", lineHeight: 1.7, color: "var(--ink-secondary)", maxWidth: "58ch", margin: 0 }}>
                {caseStudy.stakes}
              </p>
            )}
          </motion.div>
        )}

        {/* Editorial */}
        {caseStudy && has(caseStudy.editorial.copy) && (
          <motion.div {...fadeUp} style={{ marginBottom: 64 }}>
            {has(caseStudy.editorial.heading) && (
              <h2 className="font-display" style={{ fontSize: "var(--text-title)", fontWeight: 400, color: "var(--ink-primary)", marginBottom: 16 }}>
                {caseStudy.editorial.heading}
              </h2>
            )}
            {has(caseStudy.editorial.subhead) && (
              <p className="font-mono" style={{ fontSize: "var(--text-meta)", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-muted)", marginBottom: 16 }}>
                {caseStudy.editorial.subhead}
              </p>
            )}
            <p style={{ fontSize: "var(--text-body)", lineHeight: 1.7, color: "var(--ink-secondary)", maxWidth: "58ch", margin: 0 }}>
              {caseStudy.editorial.copy}
            </p>
            {caseStudy.editorial.images && caseStudy.editorial.images.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 32, marginTop: 32 }}>
                {caseStudy.editorial.images.map((img, i) => (
                  <motion.div key={i} {...fadeUp} style={{ position: "relative", width: "100%", aspectRatio: "16/10", overflow: "hidden" }}>
                    <Image src={img} alt={`${project.title} — editorial ${i + 1}`} fill className="object-cover" sizes="(max-width: 768px) 95vw, 57vw" quality={90} />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Process Steps */}
        {caseStudy?.processSteps && caseStudy.processSteps.length > 0 && (
          <motion.div {...fadeUp} style={{ marginBottom: 64 }}>
            <h2 className="font-mono" style={{ fontSize: "var(--text-meta)", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-muted)", marginBottom: 32 }}>
              Process
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
              {caseStudy.processSteps.map((step, i) => (
                <motion.div key={i} {...fadeUp} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <span className="font-mono" style={{ fontSize: 10, color: "var(--ink-muted)", marginRight: 12 }}>{String(i + 1).padStart(2, "0")}</span>
                    <span style={{ fontSize: "var(--text-body)", fontWeight: 500, color: "var(--ink-primary)" }}>{step.title}</span>
                  </div>
                  {has(step.copy) && (
                    <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--ink-secondary)", maxWidth: "58ch", paddingLeft: 40, margin: 0 }}>
                      {step.copy}
                    </p>
                  )}
                  {step.image && (
                    <div style={{ position: "relative", width: "100%", aspectRatio: "4/3", overflow: "hidden" }}>
                      <Image src={step.image} alt={`${project.title} — ${step.title}`} fill className="object-cover" sizes="(max-width: 768px) 95vw, 57vw" quality={90} />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Highlights */}
        {caseStudy?.highlights && caseStudy.highlights.length > 0 && (
          <motion.div {...fadeUp} style={{ marginBottom: 64 }}>
            <h2 className="font-mono" style={{ fontSize: "var(--text-meta)", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-muted)", marginBottom: 32 }}>
              Key Details
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
              {caseStudy.highlights.map((hl) => (
                <motion.div key={hl.id} {...fadeUp}>
                  <h3 style={{ fontSize: "var(--text-body)", fontWeight: 500, color: "var(--ink-primary)", marginBottom: 8 }}>{hl.title}</h3>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--ink-secondary)", maxWidth: "58ch", margin: 0 }}>{hl.description}</p>
                  {has(hl.challenge) && (
                    <p className="font-display" style={{ fontSize: 14, lineHeight: 1.5, color: "var(--ink-secondary)", maxWidth: "58ch", paddingLeft: 16, borderLeft: "1px solid rgba(var(--ink-rgb), 0.06)", fontStyle: "italic", marginTop: 16 }}>
                      {hl.challenge}
                    </p>
                  )}
                  {has(hl.recipe) && (
                    <p className="font-mono" style={{ fontSize: 10, letterSpacing: "0.05em", color: "var(--ink-muted)", marginTop: 12 }}>{hl.recipe}</p>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Engineering */}
        {caseStudy?.engineering && has(caseStudy.engineering.copy) && (
          <motion.div {...fadeUp} style={{ marginBottom: 64 }}>
            <h2 className="font-mono" style={{ fontSize: "var(--text-meta)", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-muted)", marginBottom: 16 }}>
              Engineering
            </h2>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--ink-secondary)", maxWidth: "58ch", margin: "0 0 16px" }}>
              {caseStudy.engineering.copy}
            </p>
            {caseStudy.engineering.signals.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {caseStudy.engineering.signals.map((signal) => (
                  <span key={signal} className="font-mono" style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-secondary)", padding: "3px 8px", border: "1px solid rgba(var(--ink-rgb), 0.06)" }}>
                    {signal}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Videos */}
        {caseStudy?.videos && caseStudy.videos.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 32, marginBottom: 64 }}>
            {caseStudy.videos.map((video, i) => (
              <motion.div key={i} {...fadeUp}>
                <div style={{ position: "relative", width: "100%", aspectRatio: video.aspect || "16/9", overflow: "hidden" }}>
                  <video src={video.src} poster={video.poster} autoPlay muted loop playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                {has(video.caption) && (
                  <p className="font-mono" style={{ fontSize: 10, letterSpacing: "0.05em", color: "var(--ink-muted)", marginTop: 8 }}>{video.caption}</p>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Statistics */}
        {caseStudy?.statistics && caseStudy.statistics.length > 0 && (
          <motion.div {...fadeUp} style={{ marginBottom: 64 }}>
            <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
              {caseStudy.statistics.map((stat) => (
                <div key={stat.label}>
                  <span className="font-mono" style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-muted)", display: "block", marginBottom: 4 }}>{stat.label}</span>
                  <span className="font-mono" style={{ fontSize: "var(--text-body)", color: "var(--ink-primary)" }}>{stat.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Gut Punch */}
        {caseStudy && has(caseStudy.gutPunch) && (
          <motion.div {...fadeUp} style={{ marginBottom: 64 }}>
            <p className="font-display" style={{ fontSize: "var(--text-title)", lineHeight: 1.4, color: "var(--ink-primary)", maxWidth: "48ch", fontStyle: "italic", margin: 0 }}>
              {caseStudy.gutPunch}
            </p>
          </motion.div>
        )}

        {/* Stack */}
        {caseStudy?.schematic && caseStudy.schematic.stack.length > 0 && (
          <motion.div {...fadeUp} style={{ marginBottom: 64 }}>
            <h2 className="font-mono" style={{ fontSize: "var(--text-meta)", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-muted)", marginBottom: 16 }}>
              Stack
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {caseStudy.schematic.stack.map((item) => (
                <span key={item} className="font-mono" style={{ fontSize: 10, color: "var(--ink-secondary)" }}>{item}</span>
              ))}
            </div>
            {has(caseStudy.schematic.typography) && (
              <p className="font-mono" style={{ fontSize: 10, color: "var(--ink-muted)", marginTop: 12 }}>Type: {caseStudy.schematic.typography}</p>
            )}
          </motion.div>
        )}

        {/* Credits */}
        {caseStudy?.contributors && caseStudy.contributors.length > 0 && (
          <motion.div {...fadeUp} style={{ marginBottom: 64 }}>
            <h2 className="font-mono" style={{ fontSize: "var(--text-meta)", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-muted)", marginBottom: 12 }}>
              Credits
            </h2>
            {caseStudy.contributors.map((c) => (
              <p key={c.name} className="font-mono" style={{ fontSize: 10, color: "var(--ink-secondary)", margin: "0 0 4px" }}>
                {c.name} — {c.role}
              </p>
            ))}
          </motion.div>
        )}

        {/* Prev/Next nav */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 48, paddingTop: 24, borderTop: "1px solid rgba(var(--ink-rgb), 0.08)" }}>
          {prevProject ? (
            <Link href={`/work/${prevProject.slug}`} className="font-mono" style={{ fontSize: 10, color: "var(--ink-secondary)", letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none" }}>
              ← {prevProject.title}
            </Link>
          ) : <span />}
          {nextProject && (
            <Link href={`/work/${nextProject.slug}`} className="font-mono" style={{ fontSize: 10, color: "var(--ink-secondary)", letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none" }}>
              {nextProject.title} →
            </Link>
          )}
        </div>
      </div>

      {/* Scroll percent */}
      <div style={{ position: "fixed", bottom: 16, right: 24 }}>
        <span className="font-mono" style={{ fontSize: 10, letterSpacing: "0.1em", color: "var(--ink-muted)" }}>{scrollPercent} %</span>
      </div>
    </div>
  );
}
