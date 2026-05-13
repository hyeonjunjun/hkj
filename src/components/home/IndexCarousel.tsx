"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { PIECES } from "@/constants/pieces";
import { computeSlot } from "./carouselSlot";
import { ConceptPlate } from "./ConceptPlate";

const COUNT = PIECES.length;

export function IndexCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  const navigate = useCallback((delta: number) => {
    setActiveIndex((current) => (current + delta + COUNT) % COUNT);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      // Bail if the user is typing somewhere — don't hijack arrows.
      const target = document.activeElement;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        (target instanceof HTMLElement && target.isContentEditable)
      ) {
        return;
      }
      if (e.key === "ArrowLeft") navigate(-1);
      else if (e.key === "ArrowRight") navigate(1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);

  return (
    <section className="carousel" aria-label="Work carousel">
      {PIECES.map((piece, pieceIndex) => {
        const { role } = computeSlot(pieceIndex, activeIndex, COUNT);
        return (
          <article
            key={piece.slug}
            className="carousel__card"
            data-role={role}
            aria-current={role === "center"}
            // All cards stay focusable so keyboard users can tab through
            // the catalog even when only 3 are visible. Hidden cards
            // are reachable via focus per the spec.
            tabIndex={0}
            onFocus={() => setActiveIndex(pieceIndex)}
            onClick={() => setActiveIndex(pieceIndex)}
          >
            <CardFace piece={piece} />
          </article>
        );
      })}

      <style>{`
        .carousel {
          position: relative;
          width: 100%;
          height: 100%;
          display: grid;
          place-items: center;
          perspective: 1200px;
        }
        .carousel__card {
          position: absolute;
          width: 28vw;
          aspect-ratio: 4 / 5;
          border: 1px solid var(--ink-hair);
          background: var(--paper-2);
          cursor: pointer;
          transform-style: preserve-3d;
          transition:
            transform 480ms cubic-bezier(0.22, 1, 0.36, 1),
            opacity 480ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .carousel__card[data-role="center"] {
          transform: translateX(0) scale(1) rotateY(0);
          opacity: 1;
          z-index: 3;
        }
        .carousel__card[data-role="right"] {
          transform: translateX(60%) scale(0.7) rotateY(-8deg);
          opacity: 0.55;
          z-index: 2;
        }
        .carousel__card[data-role="left"] {
          transform: translateX(-60%) scale(0.7) rotateY(8deg);
          opacity: 0.55;
          z-index: 2;
        }
        .carousel__card[data-role="hidden"] {
          transform: translateX(120%) scale(0.4);
          opacity: 0;
          pointer-events: none;
          z-index: 1;
        }
        @media (prefers-reduced-motion: reduce) {
          .carousel__card { transition: none; }
        }
        @media (max-width: 760px) {
          .carousel__card { width: 70vw; }
        }
      `}</style>
    </section>
  );
}

function CardFace({ piece }: { piece: (typeof PIECES)[number] }) {
  if (piece.cover?.kind === "video") {
    return (
      <video
        src={piece.cover.src}
        muted
        loop
        playsInline
        autoPlay
        preload="metadata"
        className="card-media"
        aria-label={`${piece.title} cover`}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    );
  }
  if (piece.cover?.kind === "image") {
    return (
      <Image
        src={piece.cover.src}
        alt={`${piece.title} cover`}
        fill
        sizes="(max-width: 760px) 70vw, 28vw"
        style={{ objectFit: "cover" }}
      />
    );
  }
  // Concept piece: typographic plate
  return <ConceptPlate piece={piece} />;
}
