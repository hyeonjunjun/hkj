"use client";

const HEADLINE = ["we", "build", "slow", "systems", "for", "fast", "times."];

const BODY =
  "ryan jun is a designer and engineer working at the intersection of interface, motion, and editorial direction. the practice spans systems for individuals and small teams who care about how a thing feels — built one careful decision at a time, in service of the people who use the work.";

export default function About() {
  return (
    <div className="v2-view v2-view-about">
      <h1 className="about-headline">
        {HEADLINE.map((w, i) => (
          <span key={i} className="home-word" style={{ "--i": i } as React.CSSProperties}>
            {w}
          </span>
        ))}
      </h1>

      <div className="about-shapes" aria-hidden>
        <Shape kind="circle" />
        <Shape kind="square" />
        <Shape kind="slash" />
      </div>

      <p className="about-body">{BODY}</p>
      <p className="about-stamp">studio practice — new york, 2026</p>
    </div>
  );
}

function Shape({ kind }: { kind: "circle" | "square" | "slash" }) {
  const onEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (el.classList.contains("is-spinning")) return;
    el.classList.add("is-spinning");
    const onEnd = () => {
      el.classList.remove("is-spinning");
      el.removeEventListener("animationend", onEnd);
    };
    el.addEventListener("animationend", onEnd);
  };
  return (
    <div
      className={`about-shape shape-${kind}`}
      onMouseEnter={onEnter}
      role="presentation"
    />
  );
}
