const SOCIALS = [
  { label: "instagram", href: "https://instagram.com/hyeonjunjun" },
  { label: "linkedin", href: "https://linkedin.com/in/hyeonjunjun" },
  { label: "vimeo", href: "https://vimeo.com/hyeonjunjun" },
];

export default function Contact() {
  return (
    <div className="v2-view v2-view-contact">
      <div className="contact-bg" aria-hidden />
      <div className="contact-center">
        <h1 className="contact-headline">say hello.</h1>
        <p className="contact-sub">rykjun@gmail.com — new york</p>
        <div className="contact-rule" />
      </div>
      <div className="contact-socials">
        {SOCIALS.map((s, i) => (
          <a
            key={s.label}
            className="contact-social"
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="link"
            style={{ "--i": i } as React.CSSProperties}
          >
            {s.label}
          </a>
        ))}
      </div>
    </div>
  );
}
