"use client";

import { useEffect, useState } from "react";

interface Project {
  id: string;
  title: string;
  year: string;
  headline: React.ReactNode;
}

const PROJECTS: Project[] = [
  {
    id: "la28",
    title: "la28",
    year: "2026",
    headline: (
      <>
        la28 —<br />
        a city in motion,<br />
        in marks<span className="v2-statement__period">.</span>
      </>
    ),
  },
  {
    id: "sift",
    title: "sift",
    year: "2025",
    headline: (
      <>
        sift —<br />
        an intelligent meal,<br />
        in plain language<span className="v2-statement__period">.</span>
      </>
    ),
  },
  {
    id: "halo",
    title: "halo halo",
    year: "2026",
    headline: (
      <>
        halo halo —<br />
        a café<br />
        between hours<span className="v2-statement__period">.</span>
      </>
    ),
  },
  {
    id: "gyeol",
    title: "gyeol",
    year: "2026",
    headline: (
      <>
        gyeol —<br />
        texture, as a way<br />
        of selling<span className="v2-statement__period">.</span>
      </>
    ),
  },
];

const DEFAULT_HEADLINE: React.ReactNode = (
  <>
    the intersection of<br />
    design, code,<br />
    and the field<span className="v2-statement__period">.</span>
  </>
);

export default function Composition() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prev = { html: html.style.overflow, body: body.style.overflow };
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    html.setAttribute("data-surface", "v2");
    return () => {
      html.style.overflow = prev.html;
      body.style.overflow = prev.body;
      html.removeAttribute("data-surface");
    };
  }, []);

  useEffect(() => {
    if (matchMedia("(hover: none), (pointer: coarse)").matches) return;
    const dot = document.querySelector<HTMLDivElement>(".v2-cursor");
    if (!dot) return;
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let cx = mx;
    let cy = my;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };
    const onOver = (e: MouseEvent) => {
      const t = e.target as Element | null;
      const isLink = !!t?.closest?.("a, button, [data-cursor='link']");
      dot.classList.toggle("is-hover", isLink);
    };
    const tick = () => {
      cx += (mx - cx) * 0.14;
      cy += (my - cy) * 0.14;
      dot.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
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

  const activeProject = PROJECTS.find((p) => p.id === active);
  const headline = activeProject?.headline ?? DEFAULT_HEADLINE;
  const headlineKey = activeProject?.id ?? "_default";

  return (
    <div className="v2-root">
      <header className="v2-bar">
        <nav className="v2-bar__nav" aria-label="primary">
          <a href="#works">works</a>
          <a href="#about">about</a>
          <a href="#notes">field notes</a>
        </nav>
        <a href="mailto:rykjun@gmail.com" className="v2-bar__cta">
          <span className="v2-bar__cta-dot" aria-hidden>
            ●
          </span>
          let&apos;s talk
        </a>
      </header>

      <main className="v2-stage">
        <h1 className="v2-mark">
          rykjun<span className="v2-mark__period">.</span>
        </h1>

        <div
          className={`v2-tile v2-tile--la28 ${active === "la28" ? "is-active" : ""}`}
          data-cursor="link"
          onMouseEnter={() => setActive("la28")}
          onMouseLeave={() => setActive(null)}
        >
          <div className="v2-tile__media-wrap">
            <div className="v2-tile__media v2-tile__media--la28" />
            <div className="v2-tile__disc" aria-hidden />
          </div>
          <div className="v2-tile__label">
            <span>● la28</span>
            <span className="v2-tile__label-meta">brand · 2026</span>
          </div>
        </div>

        <div
          className={`v2-tile v2-tile--sift ${active === "sift" ? "is-active" : ""}`}
          data-cursor="link"
          onMouseEnter={() => setActive("sift")}
          onMouseLeave={() => setActive(null)}
        >
          <div className="v2-tile__media-wrap">
            <div className="v2-tile__media v2-tile__media--sift" />
            <div className="v2-tile__disc" aria-hidden />
          </div>
          <div className="v2-tile__label">
            <span>● sift</span>
            <span className="v2-tile__label-meta">ai · 2025</span>
          </div>
        </div>

        <div
          className={`v2-tile v2-tile--halo ${active === "halo" ? "is-active" : ""}`}
          data-cursor="link"
          onMouseEnter={() => setActive("halo")}
          onMouseLeave={() => setActive(null)}
        >
          <div className="v2-tile__media-wrap">
            <div className="v2-tile__media v2-tile__media--halo" />
            <div className="v2-tile__disc" aria-hidden />
          </div>
          <div className="v2-tile__label">
            <span>● halo halo</span>
            <span className="v2-tile__label-meta">café · 2026</span>
          </div>
        </div>

        <div
          className={`v2-tile v2-tile--gyeol ${active === "gyeol" ? "is-active" : ""}`}
          data-cursor="link"
          onMouseEnter={() => setActive("gyeol")}
          onMouseLeave={() => setActive(null)}
        >
          <div className="v2-tile__media-wrap">
            <div className="v2-tile__media v2-tile__media--gyeol" />
            <div className="v2-tile__disc" aria-hidden />
          </div>
          <div className="v2-tile__label">
            <span>● gyeol</span>
            <span className="v2-tile__label-meta">ecom · 2026</span>
          </div>
        </div>

        <span className="v2-dot-float" aria-hidden />

        <span className="v2-ornament" aria-hidden />

        <p className="v2-statement" key={headlineKey}>
          {headline}
        </p>

        <div className="v2-foot">
          <span>ryan jun · brooklyn, n.y.</span>
          <a href="mailto:rykjun@gmail.com">rykjun@gmail.com</a>
        </div>
      </main>

      <div className="v2-cursor" aria-hidden />
    </div>
  );
}
