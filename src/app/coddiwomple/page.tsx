"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import TransitionLink from "@/components/TransitionLink";
import { gsap } from "@/lib/gsap";
import { EXPLORATIONS } from "@/constants/explorations";

export default function CoddiwomplePage() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridRef.current) return;

    const items = gridRef.current.querySelectorAll("[data-explore-item]");
    gsap.fromTo(
      items,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.08,
      }
    );
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--color-bg)",
        paddingTop: "clamp(6rem, 12vh, 10rem)",
        paddingBottom: "var(--section-py)",
      }}
    >
      {/* Header */}
      <div
        className="section-padding"
        style={{ marginBottom: "clamp(3rem, 6vh, 5rem)" }}
      >
        <h1
          className="font-display italic"
          style={{
            fontSize: "var(--text-display)",
            color: "var(--color-text)",
            lineHeight: 1.1,
          }}
        >
          Coddiwomple
        </h1>
        <p
          style={{
            fontSize: "var(--text-body)",
            color: "var(--color-text-dim)",
            marginTop: "0.75rem",
            maxWidth: "40ch",
          }}
        >
          Traveling purposefully toward an unknown destination. Visual studies,
          material research, and things that caught the light.
        </p>
      </div>

      {/* Gallery — asymmetric masonry */}
      <div
        ref={gridRef}
        className="section-padding"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          gap: "var(--grid-gutter, 1rem)",
          rowGap: "clamp(2rem, 5vh, 4rem)",
        }}
      >
        {EXPLORATIONS.map((piece, i) => {
          const isWide = i % 3 === 0;
          const colSpan = isWide ? "span 7" : "span 5";
          const colStart = !isWide && i % 3 === 2 ? "8" : undefined;

          return (
            <TransitionLink
              key={piece.id}
              href={`/coddiwomple/${piece.id}`}
              data-explore-item
              style={{
                gridColumn: colStart ? `${colStart} / span 5` : colSpan,
                opacity: 0,
                display: "block",
              }}
            >
              <div
                className="overflow-hidden"
                style={{
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
                    className="w-full h-full object-cover"
                    style={{
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
                      className="object-cover"
                      sizes={isWide ? "58vw" : "42vw"}
                      quality={90}
                    />
                  </div>
                )}
              </div>

              <div style={{ marginTop: "0.75rem" }}>
                <span
                  className="font-display italic"
                  style={{
                    fontSize: "var(--text-body)",
                    color: "var(--color-text)",
                  }}
                >
                  {piece.title}
                </span>
                <span
                  className="font-mono uppercase"
                  style={{
                    fontSize: 10,
                    color: "var(--color-text-ghost)",
                    marginLeft: "0.75rem",
                    letterSpacing: "0.1em",
                  }}
                >
                  {piece.medium}
                </span>
              </div>
            </TransitionLink>
          );
        })}
      </div>
    </main>
  );
}
