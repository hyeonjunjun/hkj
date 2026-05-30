"use client";

import { useState } from "react";

type Project = {
  slug: string;
  title: string;
  category: string;
  seed: string;
};

const PROJECTS: Project[] = [
  { slug: "echo-conditions", title: "echo conditions", category: "sound studies", seed: "421" },
  { slug: "parallel-states", title: "parallel states", category: "interaction system", seed: "312" },
  { slug: "material-intelligence", title: "material intelligence", category: "generative tools", seed: "528" },
  { slug: "the-space-between", title: "the space between", category: "editorial", seed: "199" },
  { slug: "soft-interference", title: "soft interference", category: "installation", seed: "687" },
  { slug: "signal-and-circuit", title: "signal & circuit", category: "identity", seed: "84" },
];

export default function Work() {
  const [activeSlug, setActiveSlug] = useState<string>(PROJECTS[0].slug);

  return (
    <div className="v2-view v2-view-work">
      <div className="work-grid">
        <div className="work-list">
          {PROJECTS.map((p, i) => (
            <div
              key={p.slug}
              className={`work-entry ${activeSlug === p.slug ? "is-active" : ""}`}
              style={{ "--i": i } as React.CSSProperties}
              data-cursor="link"
              onMouseEnter={() => setActiveSlug(p.slug)}
              onFocus={() => setActiveSlug(p.slug)}
              tabIndex={0}
            >
              <p className="work-title">{p.title}</p>
              <p className="work-tag">{p.category}</p>
            </div>
          ))}
        </div>
        <div className="work-preview" data-cursor="image">
          <div className="work-image-stack">
            {PROJECTS.map((p) => (
              <div
                key={p.slug}
                className={`work-image ${activeSlug === p.slug ? "is-active" : ""}`}
              >
                <img
                  src={`https://picsum.photos/seed/v2-work-${p.seed}/1600/1800`}
                  alt=""
                  loading="eager"
                />
              </div>
            ))}
          </div>
          {PROJECTS.map((p) => (
            <span
              key={p.slug}
              className={`work-ghost ${activeSlug === p.slug ? "is-visible" : ""}`}
            >
              {p.title}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
