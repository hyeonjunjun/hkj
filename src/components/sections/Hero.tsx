"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { useStudioStore } from "@/lib/store";
import TransitionLink from "@/components/TransitionLink";
import { PROJECTS } from "@/constants/projects";
import { CONTACT_EMAIL, SOCIALS } from "@/constants/contact";

const featured = PROJECTS.filter((p) => !p.wip);
const wip = PROJECTS.filter((p) => p.wip);

/**
 * Hero — Single-viewport "Studio Desk" layout.
 *
 * Featured works arranged at deliberate asymmetric positions,
 * like objects on a designer's desk. No scroll.
 * About statement + contact anchored at the bottom.
 */
export default function Hero() {
  const isLoaded = useStudioStore((s) => s.isLoaded);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isLoaded || !containerRef.current || hasAnimated.current) return;
    hasAnimated.current = true;

    const els = containerRef.current.querySelectorAll("[data-reveal]");
    gsap.fromTo(
      els,
      { opacity: 0, y: 12, filter: "blur(3px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.9,
        stagger: 0.06,
        ease: "power3.out",
      }
    );
  }, [isLoaded]);

  const primary = featured[0];
  const secondary = featured[1];
  const wipProject = wip[0];

  return (
    <div
      ref={containerRef}
      style={{
        height: "100svh",
        overflow: "hidden",
        backgroundColor: "var(--color-bg)",
        position: "relative",
      }}
    >
      {/* ── Desk surface — CSS Grid with named areas ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          gridTemplateRows: "auto 1fr auto",
          gap: "var(--grid-gutter)",
          height: "100%",
          padding:
            "clamp(4.5rem, 8vh, 6rem) var(--page-px) clamp(1.2rem, 2.5vh, 1.8rem)",
        }}
      >
        {/* ── Row 1: Project titles + metadata ── */}
        <div style={{ gridColumn: "1 / 6", alignSelf: "start" }} data-reveal>
          {primary && (
            <>
              <h2
                className="font-display italic"
                style={{
                  fontSize: "clamp(1.2rem, 2.2vw, 2rem)",
                  color: "var(--color-text)",
                  lineHeight: 1.15,
                }}
              >
                {primary.title}
              </h2>
              <span
                className="font-mono uppercase block"
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.12em",
                  color: "var(--color-text-ghost)",
                  marginTop: "0.4rem",
                }}
              >
                {primary.sector} · {primary.year}
              </span>
            </>
          )}
        </div>

        <div style={{ gridColumn: "8 / 12", alignSelf: "start" }} data-reveal>
          {secondary && (
            <>
              <h2
                className="font-display italic"
                style={{
                  fontSize: "clamp(0.95rem, 1.4vw, 1.3rem)",
                  color: "var(--color-text)",
                  lineHeight: 1.15,
                }}
              >
                {secondary.title}
              </h2>
              <span
                className="font-mono uppercase block"
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.12em",
                  color: "var(--color-text-ghost)",
                  marginTop: "0.3rem",
                }}
              >
                {secondary.sector} · {secondary.year}
              </span>
            </>
          )}
        </div>

        {/* ── Row 2: Media cards ── */}

        {/* Primary — larger, left side */}
        {primary && (
          <TransitionLink
            href={`/work/${primary.id}`}
            className="group block"
            style={{
              gridColumn: "1 / 6",
              gridRow: "2 / 3",
              alignSelf: "start",
            }}
            data-reveal
          >
            <div
              className="relative overflow-hidden"
              style={{ aspectRatio: "16/10", width: "100%" }}
            >
              {primary.cardVideo ? (
                <video
                  src={primary.cardVideo}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                />
              ) : (
                <Image
                  src={primary.image}
                  alt={primary.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                  sizes="42vw"
                  quality={90}
                  priority
                />
              )}
            </div>
          </TransitionLink>
        )}

        {/* Secondary — smaller, right side, vertically centered */}
        {secondary && (
          <TransitionLink
            href={`/work/${secondary.id}`}
            className="group block"
            style={{
              gridColumn: "8 / 12",
              gridRow: "2 / 3",
              alignSelf: "center",
            }}
            data-reveal
          >
            <div
              className="relative overflow-hidden"
              style={{ aspectRatio: "4/3", width: "100%" }}
            >
              <Image
                src={secondary.image}
                alt={secondary.title}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                sizes="30vw"
                quality={90}
              />
            </div>
          </TransitionLink>
        )}

        {/* WIP — small, muted, bottom-left under primary */}
        {wipProject && (
          <div
            style={{
              gridColumn: "1 / 4",
              gridRow: "2 / 3",
              alignSelf: "end",
              opacity: 0.45,
            }}
            data-reveal
          >
            <div
              className="relative overflow-hidden"
              style={{ aspectRatio: "3/2", width: "60%" }}
            >
              <Image
                src={wipProject.image}
                alt={wipProject.title}
                fill
                className="object-cover"
                sizes="15vw"
                quality={80}
              />
            </div>
            <span
              className="font-mono uppercase block"
              style={{
                fontSize: "10px",
                letterSpacing: "0.1em",
                color: "var(--color-text-ghost)",
                marginTop: "0.3rem",
              }}
            >
              {wipProject.title} · Coming Soon
            </span>
          </div>
        )}

        {/* ── Row 3: About + Contact ── */}
        <div
          style={{
            gridColumn: "1 / 7",
            gridRow: "3 / 4",
            alignSelf: "end",
          }}
          data-reveal
        >
          <p
            className="font-display italic"
            style={{
              fontSize: "var(--text-small)",
              color: "var(--color-text-dim)",
              lineHeight: 1.5,
              maxWidth: "38ch",
            }}
          >
            A small corner of the internet for work, material research, and
            things that caught the light.
          </p>
        </div>

        <div
          style={{
            gridColumn: "8 / 13",
            gridRow: "3 / 4",
            alignSelf: "end",
            textAlign: "right",
          }}
          data-reveal
        >
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-mono uppercase"
            style={{
              fontSize: "10px",
              letterSpacing: "0.1em",
              color: "var(--color-text-ghost)",
              transition: "color 0.3s ease",
            }}
            onMouseEnter={(e) =>
              ((e.target as HTMLElement).style.color = "var(--color-text)")
            }
            onMouseLeave={(e) =>
              ((e.target as HTMLElement).style.color =
                "var(--color-text-ghost)")
            }
          >
            {CONTACT_EMAIL}
          </a>
          <div
            className="flex items-center justify-end gap-3"
            style={{ marginTop: "0.35rem" }}
          >
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono uppercase"
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.1em",
                  color: "var(--color-text-ghost)",
                  transition: "color 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLElement).style.color = "var(--color-text)")
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLElement).style.color =
                    "var(--color-text-ghost)")
                }
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
