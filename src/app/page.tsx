"use client";

import Link from "next/link";
import Image from "next/image";
import { PIECES } from "@/constants/pieces";
import { CONTACT_EMAIL, SOCIALS } from "@/constants/contact";

const projects = PIECES.filter((p) => p.type === "project").sort(
  (a, b) => a.order - b.order
);

const featured = projects[0]; // GYEOL — flagship
const supporting = projects.slice(1); // SIFT, CONDUCTOR

export default function Home() {
  return (
    <main className="home" id="main">
      {/* ── Top bar ── */}
      <header className="nav">
        <Link href="/" className="nav-mark">HKJ</Link>
        <div className="nav-links">
          <Link href="/about">About</Link>
          <a href={`mailto:${CONTACT_EMAIL}`}>Contact</a>
        </div>
      </header>

      {/* ── Main content: asymmetric 2-column layout ── */}
      <div className="content">
        {/* Left column: featured project — large */}
        <div className="col-left">
          <Link href={`/work/${featured.slug}`} className="featured">
            <div className="featured-image">
              {featured.image && (
                <Image
                  src={featured.image}
                  alt={featured.title}
                  width={1200}
                  height={800}
                  sizes="55vw"
                  priority
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              )}
            </div>
            <div className="featured-meta">
              <span className="meta-num">01</span>
              <span className="meta-name">{featured.title}</span>
              <span className="meta-dash">—</span>
              <span className="meta-desc">{featured.description}</span>
            </div>
          </Link>
        </div>

        {/* Right column: statement + supporting projects stacked */}
        <div className="col-right">
          {/* Statement */}
          <div className="statement">
            <p className="statement-text">
              A design engineering practice building brands, products, and
              concepts with care.
            </p>
            <p className="statement-note">
              Currently accepting select projects for 2026.
            </p>
          </div>

          {/* Supporting projects — smaller, stacked */}
          <div className="supporting">
            {supporting.map((piece) => {
              const idx = PIECES.indexOf(piece);
              const href = piece.type === "project"
                ? `/work/${piece.slug}`
                : `/lab/${piece.slug}`;

              return (
                <Link key={piece.slug} href={href} className="support-card">
                  <div className="support-image">
                    {piece.image ? (
                      <Image
                        src={piece.image}
                        alt={piece.title}
                        width={600}
                        height={400}
                        sizes="20vw"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <div className="support-empty">
                        <span>{piece.status === "wip" ? "WIP" : ""}</span>
                      </div>
                    )}
                  </div>
                  <div className="support-meta">
                    <span className="meta-num">{String(idx + 1).padStart(2, "0")}</span>
                    <span className="meta-name">{piece.title}</span>
                    <span className="meta-tags">
                      {piece.tags.slice(0, 2).join(" · ")}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Annotation */}
          <p className="hand-note">&ldquo;making things that feel right&rdquo;</p>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <footer className="foot">
        <div className="foot-left">
          <span>Design engineer, New York</span>
        </div>
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
