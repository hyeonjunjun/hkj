const HEADLINE = ["a", "quieter", "way", "to", "make", "things", "matter."];

export default function Home() {
  return (
    <div className="v2-view v2-view-home">
      <div className="home-grid">
        <div className="home-text">
          <h1 className="home-headline">
            {HEADLINE.map((w, i) => (
              <span key={i} className="home-word" style={{ "--i": i } as React.CSSProperties}>
                {w}
              </span>
            ))}
          </h1>
          <p className="home-sub">a multidisciplinary practice — new york.</p>
        </div>
        <div className="home-image">
          <img
            src="https://picsum.photos/seed/v2-home-314/1400/1800"
            alt=""
            loading="eager"
          />
        </div>
      </div>
      <div className="home-circle" aria-hidden />
      <BrandMark />
    </div>
  );
}

function BrandMark() {
  return (
    <div className="v2-brand-mark" aria-hidden>
      <svg viewBox="0 0 60 60" width="60" height="60" xmlns="http://www.w3.org/2000/svg">
        <rect width="60" height="60" fill="#000" />
        <circle cx="18" cy="20" r="6" fill="#fff" />
        <rect x="32" y="14" width="12" height="12" fill="#fff" />
        <line x1="20" y1="46" x2="44" y2="38" stroke="#fff" strokeWidth="3" strokeLinecap="square" />
      </svg>
    </div>
  );
}
