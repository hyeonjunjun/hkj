export function BottomBar() {
  return (
    <footer
      style={{
        height: 32,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          color: "var(--ink-muted)",
          letterSpacing: "0.06em",
        }}
      >
        design engineer · brands · software
      </span>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          color: "var(--ink-muted)",
          letterSpacing: "0.06em",
        }}
      >
        NYC
      </span>
    </footer>
  );
}

export default BottomBar;
