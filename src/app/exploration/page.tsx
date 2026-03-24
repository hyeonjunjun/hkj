"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { EXPLORATIONS } from "@/constants/explorations";

export default function ExplorationPage() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const items = gridRef.current.querySelectorAll("[data-explore-item]");
    gsap.fromTo(
      items,
      { autoAlpha: 0, y: 32 },
      { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08, ease: "expo.out" }
    );
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--paper)",
        paddingTop: "var(--space-breath)",
        paddingBottom: "var(--space-breath)",
      }}
    >
      {/* Header */}
      <div
        style={{
          paddingLeft: "var(--page-px)",
          paddingRight: "var(--page-px)",
          marginBottom: "clamp(3rem, 6vh, 5rem)",
        }}
      >
        <h1
          className="font-display"
          style={{
            fontSize: "clamp(2.2rem, 4.5vw, 3.2rem)",
            color: "var(--ink-full)",
            lineHeight: 1.1,
            fontStyle: "italic",
          }}
        >
          Exploration
        </h1>
        <p
          style={{
            fontSize: "var(--text-body)",
            color: "var(--ink-secondary)",
            fontStyle: "italic",
            marginTop: "0.75rem",
            maxWidth: "40ch",
          }}
        >
          coddiwompling — travelling purposefully toward an unknown destination.
          <br></br>
          <br></br>

          a collection of creative explorations.
        </p>
      </div>

      {/* Gallery — asymmetric masonry */}
      <div
        ref={gridRef}
        style={{
          paddingLeft: "var(--page-px)",
          paddingRight: "var(--page-px)",
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          gap: "16px",
          rowGap: "clamp(2rem, 5vh, 4rem)",
        }}
      >
        {EXPLORATIONS.map((piece, i) => {
          const isWide = i % 3 === 0;
          const colSpan = isWide ? "span 7" : "span 5";
          const colStart = !isWide && i % 3 === 2 ? "8" : undefined;

          return (
            <Link
              key={piece.id}
              href={`/exploration/${piece.id}`}
              data-explore-item
              style={{
                gridColumn: colStart ? `${colStart} / span 5` : colSpan,
                visibility: "hidden",
                display: "block",
              }}
            >
              <div
                style={{
                  overflow: "hidden",
                  aspectRatio: isWide ? "16/10" : "3/4",
                  position: "relative",
                }}
              >
                {piece.heroType === "video" ? (
                  <video
                    src={piece.hero}
                    autoPlay
                    muted
                    loop
                    playsInline
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition:
                        "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                    onMouseEnter={(e) =>
                    ((e.target as HTMLElement).style.transform =
                      "scale(1.03)")
                    }
                    onMouseLeave={(e) =>
                      ((e.target as HTMLElement).style.transform = "scale(1)")
                    }
                  />
                ) : (
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "100%",
                      transition:
                        "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                    onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.transform =
                      "scale(1.03)")
                    }
                    onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.transform =
                      "scale(1)")
                    }
                  >
                    <Image
                      src={piece.hero}
                      alt={piece.title}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes={isWide ? "58vw" : "42vw"}
                      quality={90}
                    />
                  </div>
                )}
              </div>

              <div style={{ marginTop: "0.75rem" }}>
                <span
                  className="font-display"
                  style={{
                    fontSize: "var(--text-body)",
                    color: "var(--ink-full)",
                    fontStyle: "italic",
                  }}
                >
                  {piece.title}
                </span>
                <span
                  className="font-mono"
                  style={{
                    fontSize: 10,
                    color: "var(--ink-muted)",
                    marginLeft: "0.75rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  {piece.medium}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
