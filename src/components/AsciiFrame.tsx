"use client";

import React from "react";

type AsciiFrameProps = {
  children: React.ReactNode;
  topLeft?: string;
  topRight?: string;
  bottomLeft?: string;
  bottomRight?: string;
  className?: string;
  padding?: number;
  as?: React.ElementType;
};

export default function AsciiFrame({
  children,
  topLeft,
  topRight,
  bottomLeft,
  bottomRight,
  className,
  padding = 0,
  as: Tag = "div",
}: AsciiFrameProps) {
  const hasTop = topLeft || topRight;
  const hasBot = bottomLeft || bottomRight;

  return (
    <Tag className={`ascii-frame-root${className ? ` ${className}` : ""}`}>
      <span className="ascii-corner ascii-tl">┌</span>
      <span className="ascii-corner ascii-tr">┐</span>
      <span className="ascii-corner ascii-bl">└</span>
      <span className="ascii-corner ascii-br">┘</span>
      {hasTop ? (
        <div className="ascii-strip ascii-strip-top">
          <span className="ascii-strip-text">{topLeft ?? ""}</span>
          <span className="ascii-strip-rule" />
          <span className="ascii-strip-text">{topRight ?? ""}</span>
        </div>
      ) : null}
      <div className="ascii-frame-body" style={{ padding }}>
        {children}
      </div>
      {hasBot ? (
        <div className="ascii-strip ascii-strip-bot">
          <span className="ascii-strip-text">{bottomLeft ?? ""}</span>
          <span className="ascii-strip-rule" />
          <span className="ascii-strip-text">{bottomRight ?? ""}</span>
        </div>
      ) : null}
      <style jsx>{`
        .ascii-frame-root {
          position: relative;
          display: block;
        }
        .ascii-frame-body {
          position: relative;
        }
        .ascii-corner {
          position: absolute;
          font-family: var(--font-stack-mono);
          font-size: 18px;
          line-height: 1;
          color: var(--ink);
          transition: color 200ms var(--ease);
          pointer-events: none;
          user-select: none;
          z-index: 3;
        }
        .ascii-tl { top: -4px; left: -2px; }
        .ascii-tr { top: -4px; right: -2px; }
        .ascii-bl { bottom: -4px; left: -2px; }
        .ascii-br { bottom: -4px; right: -2px; }
        .ascii-frame-root:hover .ascii-corner { color: var(--ink); }
        .ascii-frame-root:hover .ascii-strip-rule { background: var(--ink); }
        .ascii-frame-root:hover .ascii-strip-text { color: var(--ink); }
        .ascii-strip {
          display: flex;
          align-items: center;
          padding: 0 16px;
          height: 14px;
        }
        .ascii-strip-top { margin-bottom: 6px; }
        .ascii-strip-bot { margin-top: 6px; }
        .ascii-strip-text {
          font-family: var(--font-stack-mono);
          font-size: 10px;
          line-height: 1;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--ink-muted);
          transition: color 200ms var(--ease);
          white-space: nowrap;
        }
        .ascii-strip-rule {
          flex: 1;
          height: 1px;
          background: var(--ink-ghost);
          margin: 0 8px;
          transition: background 200ms var(--ease);
        }
      `}</style>
    </Tag>
  );
}
