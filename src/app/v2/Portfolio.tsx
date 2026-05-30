"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Home from "./Home";
import Work from "./Work";
import About from "./About";
import Contact from "./Contact";

type ViewId = "home" | "work" | "about" | "contact";

const NAV: { id: ViewId; label: string }[] = [
  { id: "work", label: "works" },
  { id: "about", label: "about" },
  { id: "contact", label: "contact" },
];

const EASE = "cubic-bezier(0.76, 0, 0.24, 1)";
const CURTAIN_MS = 380;

export default function Portfolio() {
  const [active, setActive] = useState<ViewId>("home");
  const [viewKey, setViewKey] = useState(0);
  const curtainRef = useRef<HTMLDivElement | null>(null);
  const lockRef = useRef(false);

  // freeze the page beneath us — no scroll anywhere while v2 is mounted
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    return () => {
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
    };
  }, []);

  const transitionTo = useCallback(
    (target: ViewId) => {
      if (lockRef.current || target === active) return;
      const curtain = curtainRef.current;
      if (!curtain) return;
      lockRef.current = true;
      const accent = target === "contact";
      curtain.classList.toggle("is-accent", accent);

      const slideIn = curtain.animate(
        [{ transform: "translateX(-100%)" }, { transform: "translateX(0)" }],
        { duration: CURTAIN_MS, easing: EASE, fill: "forwards" },
      );
      slideIn.onfinish = () => {
        setActive(target);
        setViewKey((k) => k + 1);
        const slideOut = curtain.animate(
          [{ transform: "translateX(0)" }, { transform: "translateX(100%)" }],
          { duration: CURTAIN_MS, easing: EASE, fill: "forwards" },
        );
        slideOut.onfinish = () => {
          curtain.style.transform = "translateX(-100%)";
          curtain.classList.remove("is-accent");
          lockRef.current = false;
        };
      };
    },
    [active],
  );

  // ─── custom cursor ─────────────────────────────────────────────────────
  useEffect(() => {
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;
    const dot = document.querySelector<HTMLDivElement>(".v2-cursor-dot");
    const ring = document.querySelector<HTMLDivElement>(".v2-cursor-ring");
    if (!dot || !ring) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    };

    const tick = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as Element | null;
      if (!t || typeof t.closest !== "function") return;
      const image = t.closest('[data-cursor="image"]');
      const link =
        !image &&
        (t.closest('[data-cursor="link"]') || t.closest("a") || t.closest("button"));
      if (image) {
        ring.classList.add("is-image");
        ring.classList.remove("is-link");
        ring.textContent = "view";
        dot.classList.add("is-hidden");
      } else if (link) {
        ring.classList.add("is-link");
        ring.classList.remove("is-image");
        ring.textContent = "";
        dot.classList.add("is-hidden");
      } else {
        ring.classList.remove("is-link", "is-image");
        ring.textContent = "";
        dot.classList.remove("is-hidden");
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver);
    tick();
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  const renderActive = () => {
    switch (active) {
      case "home":
        return <Home />;
      case "work":
        return <Work />;
      case "about":
        return <About />;
      case "contact":
        return <Contact />;
    }
  };

  return (
    <div className="v2-app">
      <header className="v2-header">
        <a
          href="#home"
          className="v2-wordmark"
          onClick={(e) => {
            e.preventDefault();
            transitionTo("home");
          }}
          data-cursor="link"
        >
          ryan jun.
        </a>
        <nav className="v2-nav">
          {NAV.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              className={`v2-nav-link ${active === n.id ? "is-active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                transitionTo(n.id);
              }}
              data-cursor="link"
            >
              {n.label}
            </a>
          ))}
        </nav>
        <a
          href="#contact"
          className="v2-cta"
          onClick={(e) => {
            e.preventDefault();
            transitionTo("contact");
          }}
          data-cursor="link"
        >
          <span className="v2-cta-dot" aria-hidden>
            ●
          </span>{" "}
          let&apos;s talk
        </a>
      </header>

      <main className="v2-stage">
        <div key={viewKey}>{renderActive()}</div>
      </main>

      <div className="v2-curtain" ref={curtainRef} aria-hidden />
      <div className="v2-cursor-ring" aria-hidden />
      <div className="v2-cursor-dot" aria-hidden />
    </div>
  );
}
