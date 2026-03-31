"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { PIECES } from "@/constants/pieces";
import { CONTACT_EMAIL, SOCIALS } from "@/constants/contact";

const projects = PIECES.filter((p) => p.type === "project").sort(
  (a, b) => a.order - b.order
);

export default function Home() {
  const mainRef = useRef<HTMLElement>(null);

  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = () =>
      setTime(
        new Date().toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      );
    fmt();
    const i = setInterval(fmt, 60_000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    if (!mainRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      mainRef.current.querySelectorAll(".fade-in").forEach((el) => {
        (el as HTMLElement).style.opacity = "1";
      });
      return;
    }
    gsap.set(".project", { y: 12 });
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    tl.to(".nav", { opacity: 1, duration: 0.4 }, 0);
    tl.to(".headline", { opacity: 1, duration: 0.5 }, 0.15);
    tl.to(".project", { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 }, 0.3);
    tl.to(".foot", { opacity: 1, duration: 0.4 }, 0.55);
  }, []);

  return (
    <main className="home" id="main" ref={mainRef}>
      {/* Nav */}
      <header className="nav fade-in">
        <Link href="/" className="nav-mark">HKJ Studio</Link>
        <div className="nav-links">
          <Link href="/about">About</Link>
          <a href={`mailto:${CONTACT_EMAIL}`}>Contact</a>
        </div>
      </header>

      {/* Center */}
      <div className="center">
        <div className="headline fade-in">
          <h1>
            Brands, products, and ideas
            <br />
            built with craft and intention.
          </h1>
          <p className="headline-sub">Selected work</p>
        </div>

        <section className="projects">
          {projects.map((piece) => {
            const href = `/work/${piece.slug}`;
            return (
              <Link key={piece.slug} href={href} className="project fade-in">
                <div className="project-img">
                  {piece.image ? (
                    <Image
                      src={piece.image}
                      alt={piece.title}
                      width={800}
                      height={600}
                      sizes="(max-width: 768px) 90vw, 30vw"
                      priority
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <div className="project-empty">
                      <span>{piece.status === "wip" ? "Coming soon" : ""}</span>
                    </div>
                  )}
                </div>
                <span className="project-name">{piece.title}</span>
                <span className="project-detail">
                  {piece.tags[0]} · {piece.year}
                </span>
              </Link>
            );
          })}
        </section>
      </div>

      {/* Footer */}
      <footer className="foot fade-in">
        <span>New York{time ? ` · ${time}` : ""}</span>
        <div className="foot-right">
          {SOCIALS.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">
              {s.label}
            </a>
          ))}
        </div>
      </footer>
    </main>
  );
}
