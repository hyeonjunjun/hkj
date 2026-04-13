"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { PIECES } from "@/constants/pieces";
import { CONTACT_EMAIL, SOCIALS } from "@/constants/contact";
import { useStore } from "@/store/useStore";
import BloomNode from "@/components/BloomNode";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const allPieces = [...PIECES].sort((a, b) => a.order - b.order);

/* ════════════════════════════════════════════════════════════
   Shared inline-style constants
   ════════════════════════════════════════════════════════════ */

const CONTENT_MAX = 1000;
const CONTENT_PAD = "clamp(24px, 5vw, 80px)";
const PROJECT_GAP = "clamp(80px, 10vh, 120px)";

const mono11: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 11,
  fontWeight: 400,
  textTransform: "uppercase" as const,
  letterSpacing: "0.1em",
};

/* ════════════════════════════════════════════════════════════
   Home
   ════════════════════════════════════════════════════════════ */

export default function Home() {
  const hoveredSlug = useStore((s) => s.hoveredSlug);
  const setHoveredSlug = useStore((s) => s.setHoveredSlug);

  const mainRef = useRef<HTMLElement>(null);

  /* ── Entrance animations ──────────────────────────────── */
  useEffect(() => {
    const prefersReduced =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      /* Hero reveals */
      gsap.from("[data-reveal]", {
        opacity: 0,
        y: 24,
        duration: 0.6,
        stagger: 0.08,
        ease: "power3.out",
        delay: 0.3,
      });

      /* Project items — scroll-triggered */
      gsap.utils.toArray<HTMLElement>("[data-project]").forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 32,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            once: true,
          },
        });
      });
    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <main
      ref={mainRef}
      style={{
        minHeight: "100vh",
        background: "var(--surface)",
        color: "var(--text-primary)",
      }}
    >
      {/* ══════════════════════════════════════════════════════
          HERO — 85vh breathing space
          ══════════════════════════════════════════════════════ */}
      <section
        style={{
          minHeight: "85vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          maxWidth: CONTENT_MAX,
          margin: "0 auto",
          paddingInline: CONTENT_PAD,
        }}
      >
        <h1
          data-reveal
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(36px, 5vw, 64px)",
            fontWeight: 400,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: "var(--text-primary)",
            margin: 0,
          }}
        >
          Hyeon Jun
        </h1>

        <p
          data-reveal
          style={{
            ...mono11,
            color: "var(--text-muted)",
            margin: "24px 0 0",
          }}
        >
          Design Engineer
        </p>

        <p
          data-reveal
          style={{
            ...mono11,
            color: "var(--text-muted)",
            margin: "8px 0 0",
          }}
        >
          New York
        </p>
      </section>

      {/* ══════════════════════════════════════════════════════
          DIVIDER
          ══════════════════════════════════════════════════════ */}
      <div
        style={{
          maxWidth: CONTENT_MAX,
          margin: "0 auto",
          paddingInline: CONTENT_PAD,
        }}
      >
        <hr
          style={{
            border: "none",
            borderTop: "1px solid var(--divider)",
            margin: 0,
          }}
        />
      </div>

      {/* ══════════════════════════════════════════════════════
          PROJECT LIST
          ══════════════════════════════════════════════════════ */}
      <section
        className="project-list"
        style={{
          maxWidth: CONTENT_MAX,
          margin: "0 auto",
          paddingInline: CONTENT_PAD,
          paddingTop: PROJECT_GAP,
          paddingBottom: PROJECT_GAP,
        }}
      >
        {allPieces.map((piece) => {
          const isHovered = hoveredSlug === piece.slug;
          const anyHovered = hoveredSlug !== null;
          const isDimmed = anyHovered && !isHovered;

          return (
            <BloomNode
              key={piece.slug}
              active={isHovered}
              accentColor={piece.accent || "#C4A265"}
              style={{
                marginBottom: PROJECT_GAP,
                display: "block",
              }}
            >
              <Link
                href={`/work/${piece.slug}`}
                data-project
                onMouseEnter={() => setHoveredSlug(piece.slug)}
                onMouseLeave={() => setHoveredSlug(null)}
                style={{
                  display: "block",
                  textDecoration: "none",
                  color: "inherit",
                  opacity: isDimmed ? 0.25 : 1,
                  filter: isDimmed ? "blur(2px)" : "none",
                  transition:
                    "opacity 200ms var(--ease-swift), filter 200ms var(--ease-swift)",
                }}
              >
                {/* ── Number ────────────────────────────── */}
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "clamp(48px, 6vw, 80px)",
                    fontWeight: 300,
                    color: "var(--text-ghost)",
                    lineHeight: 1,
                    display: "block",
                    marginBottom: 16,
                  }}
                >
                  {piece.number}
                </span>

                {/* ── Title + Description ───────────────── */}
                <h2
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "clamp(18px, 2vw, 24px)",
                    fontWeight: 500,
                    color: "var(--text-primary)",
                    margin: "0 0 8px",
                    lineHeight: 1.3,
                  }}
                >
                  {piece.title}_
                </h2>

                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 15,
                    color: "var(--text-secondary)",
                    maxWidth: "42ch",
                    lineHeight: 1.5,
                    margin: "0 0 24px",
                  }}
                >
                  {piece.description}
                </p>

                {/* ── Image ─────────────────────────────── */}
                {piece.image && (
                  <div
                    style={{
                      width: "100%",
                      borderRadius: 2,
                      overflow: "hidden",
                      marginBottom: 16,
                    }}
                  >
                    <Image
                      src={piece.image}
                      alt={piece.title}
                      width={1000}
                      height={600}
                      sizes="(max-width: 1000px) 100vw, 1000px"
                      style={{
                        width: "100%",
                        height: "auto",
                        display: "block",
                        filter: isHovered
                          ? "saturate(1)"
                          : "saturate(0.5)",
                        transition:
                          "filter 300ms var(--ease-swift)",
                      }}
                    />
                  </div>
                )}

                {/* ── Tags + metadata ───────────────────── */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    flexWrap: "wrap",
                    gap: 8,
                  }}
                >
                  <span
                    style={{
                      ...mono11,
                      color: "var(--text-muted)",
                    }}
                  >
                    {piece.tags.join("  ")}
                  </span>
                  <span
                    style={{
                      ...mono11,
                      color: "var(--text-muted)",
                    }}
                  >
                    {piece.year} · {piece.status === "wip" ? "WIP" : "Shipped"}
                  </span>
                </div>
              </Link>
            </BloomNode>
          );
        })}
      </section>

      {/* ══════════════════════════════════════════════════════
          FOOTER
          ══════════════════════════════════════════════════════ */}
      <footer
        style={{
          maxWidth: CONTENT_MAX,
          margin: "0 auto",
          paddingInline: CONTENT_PAD,
          paddingTop: "clamp(80px, 12vh, 140px)",
          paddingBottom: "clamp(40px, 6vh, 80px)",
        }}
      >
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          data-reveal
          style={{
            ...mono11,
            color: "var(--text-muted)",
            display: "block",
            marginBottom: 16,
            textDecoration: "none",
            transition: "color 200ms",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "var(--text-primary)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "var(--text-muted)")
          }
        >
          {CONTACT_EMAIL}
        </a>

        <div
          data-reveal
          style={{ display: "flex", gap: 24 }}
        >
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                ...mono11,
                color: "var(--text-muted)",
                textDecoration: "none",
                transition: "color 200ms",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--text-primary)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--text-muted)")
              }
            >
              {s.label.toUpperCase()}
            </a>
          ))}
        </div>
      </footer>

      {/* ══════════════════════════════════════════════════════
          MOBILE: disable depth-of-field on touch devices
          ══════════════════════════════════════════════════════ */}
      <style>{`
        @media (hover: none) {
          .project-list [data-project] {
            opacity: 1 !important;
            filter: none !important;
          }
        }
      `}</style>
    </main>
  );
}
