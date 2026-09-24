"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** One block of the page, measured in document coordinates. */
interface Block {
  kind: "media" | "text";
  /** Fractions of the document, so the rail can be any size without re-measuring. */
  top: number;
  left: number;
  width: number;
  height: number;
  /** Real pixels — the scaled clone is laid out at the block's true width. */
  pxWidth: number;
  /** Document pixels, for the jump. */
  docTop: number;
  src?: string;
  label: string;
  /** The live node, cloned into the rail for text blocks. */
  node: HTMLElement;
}

/**
 * The horizontal extent of what a block actually DRAWS — glyph rects for
 * its text, box rects for its images — as opposed to the extent of the
 * grid cell holding it.
 *
 * The two differ by a whole column on this layout. The header's
 * Year/Status cell spans columns 9-10, one past every plate, but its
 * content is four short left-aligned strings sitting at the start of it.
 * A frame drawn round the cell therefore reached 133px past the last
 * thing a reader can see, and the right-hand margin looked wrong against
 * a left-hand one that was correct.
 */
function inkBounds(root: HTMLElement): { left: number; right: number } {
  let left = Infinity;
  let right = -Infinity;

  for (const m of root.querySelectorAll("img, video")) {
    const b = m.getBoundingClientRect();
    if (!b.width) continue;
    left = Math.min(left, b.left);
    right = Math.max(right, b.right);
  }

  // Range over each text node: its rects hug the glyphs, where the
  // element's own rect would just give the full width of its line box.
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const range = document.createRange();
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (!n.textContent?.trim()) continue;
    range.selectNodeContents(n);
    for (const b of range.getClientRects()) {
      if (!b.width) continue;
      left = Math.min(left, b.left);
      right = Math.max(right, b.right);
    }
  }

  return { left, right };
}

/** Rail width, in grid columns. */
const RAIL_COLS = 1;
/** The rail may not take more than this share of the viewport height. */
const MAX_VH = 0.62;
/** How far outside the content the viewport frame sits, in rail pixels. */
const FRAME_PAD = 3;

/**
 * A miniature of the case study, down the right edge, doubling as the
 * scroll position indicator.
 *
 * It is a picture of the PAGE, not a strip of its pictures, and not a
 * diagram of it either: media draws as the image, and text draws as the
 * text — the real nodes, cloned and scaled down by the same factor the
 * rail bears to the document, laid out at their true pixel width so the
 * lines break exactly where they break on the page. At this size type is
 * texture rather than words, which is the point; it should look like
 * writing, not like a grey bar standing in for writing.
 *
 * DISCOVERY — why there is nothing to remember
 *
 * Blocks are found, not declared: every direct child of a `.grid12`
 * inside the article is a grid cell, and a grid cell is exactly what a
 * block is. So a new section, a new field, a whole new kind of row
 * appears in the map the moment it appears on the page, and nobody has
 * to mark it up. This replaced a `data-mm` attribute on each block,
 * which worked but relied on whoever edits the page next knowing it
 * existed — a guarantee that lasts until the first person who does not.
 *
 * `data-mm="skip"` opts a cell out. `data-mm` on something that is not a
 * grid cell opts it in, for anything that ever sits outside the grid.
 *
 * Kind is derived too: a block holding an img or video is media,
 * everything else is text.
 *
 * THE RAIL'S SHAPE
 *
 * Height is width x the document's own aspect, so the rail is the page
 * to scale rather than a box the page is squeezed into. A long case
 * study gets a taller rail, up to MAX_VH, past which the rail narrows
 * instead of distorting — the aspect is the one thing that must not
 * bend, or it stops being a picture of the page.
 *
 * Desktop only: below md the rail would take a third of the screen.
 */
export default function CaseStudyMinimap() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [aspect, setAspect] = useState(0);
  /** Document fractions — where the page's ink starts and stops. */
  const [ink, setInk] = useState({ left: 0, right: 1 });
  const [scale, setScale] = useState(0);
  const [view, setView] = useState({ frac: 0, offset: 0 });
  const railRef = useRef<HTMLDivElement>(null);
  const [rail, setRail] = useState({ w: 0, h: 0 });

  const measure = useCallback(() => {
    const doc = document.documentElement;
    const docH = doc.scrollHeight;
    const docW = doc.clientWidth;
    const article = document.querySelector("article");
    if (!docH || !docW || !article) return;

    // Every grid cell in the article, plus anything explicitly opted in
    // from outside the grid. A Set because the two can overlap.
    const candidates = new Set<HTMLElement>([
      ...article.querySelectorAll<HTMLElement>(".grid12 > *"),
      ...article.querySelectorAll<HTMLElement>("[data-mm]"),
    ]);

    const found: Block[] = [];
    let inkL = Infinity;
    let inkR = -Infinity;
    for (const el of candidates) {
      if (el.dataset.mm === "skip") continue;
      const box = el.getBoundingClientRect();
      if (!box.height || !box.width) continue;
      const media = el.querySelector<HTMLImageElement | HTMLVideoElement>("img, video");
      const drawn = inkBounds(el);
      if (Number.isFinite(drawn.left)) {
        inkL = Math.min(inkL, drawn.left + window.scrollX);
        inkR = Math.max(inkR, drawn.right + window.scrollX);
      }
      found.push({
        kind: media ? "media" : "text",
        top: (box.top + window.scrollY) / docH,
        left: (box.left + window.scrollX) / docW,
        width: box.width / docW,
        height: box.height / docH,
        pxWidth: box.width,
        docTop: box.top + window.scrollY,
        src: media instanceof HTMLImageElement ? media.currentSrc || media.src : undefined,
        label:
          (media instanceof HTMLImageElement && media.alt) ||
          el.textContent?.trim().slice(0, 60) ||
          "section",
        node: el,
      });
    }
    found.sort((a, b) => a.top - b.top);
    setBlocks(found);
    if (Number.isFinite(inkL) && inkR > inkL) {
      setInk({ left: inkL / docW, right: inkR / docW });
    }
    setAspect(docH / docW);
    setScale(railRef.current ? railRef.current.offsetWidth / docW : 0);
  }, []);

  useEffect(() => {
    measure();
    // Images arrive after first paint and change the document height,
    // which moves every block below them.
    const article = document.querySelector("article");
    const ro = article ? new ResizeObserver(measure) : null;
    if (article && ro) ro.observe(article);
    window.addEventListener("resize", measure);
    window.addEventListener("load", measure);
    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("load", measure);
    };
  }, [measure]);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    const read = () => {
      setRail({ w: el.offsetWidth, h: el.offsetHeight });
      const docW = document.documentElement.clientWidth;
      if (docW) setScale(el.offsetWidth / docW);
    };
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, [aspect]);

  useEffect(() => {
    // rAF, not the scroll event: Lenis interpolates scrollTop between
    // native events, so an event-only listener trails the page visibly.
    let frame = requestAnimationFrame(function tick() {
      const docH = document.documentElement.scrollHeight;
      if (docH > 0) {
        setView({
          frac: Math.min(1, window.innerHeight / docH),
          offset: Math.min(1, Math.max(0, window.scrollY / docH)),
        });
      }
      frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  if (blocks.length === 0 || aspect <= 0) return null;

  const railW = `min(calc(var(--col) * ${RAIL_COLS}), calc(${MAX_VH} * 100vh / ${aspect}))`;

  /* The frame hugs the page's INK — see inkBounds above for why not its
     boxes, and not the document either: at full width it enclosed two
     columns of nothing on the left and ran out under its own rail on the
     right, reading as a box around the page rather than a window onto
     it. Measured, so it tracks whatever the real measure turns out to
     be, with no column numbers here to drift out of step with the
     layout. */
  const contentLeft = ink.left;
  const contentRight = ink.right;

  const jumpTo = (block: Block) => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const target = Math.min(max, Math.max(0, block.docTop - window.innerHeight * 0.12));
    window.scrollTo({ top: target, behavior: "smooth" });
  };

  return (
    <aside
      aria-label="Page overview"
      className="fixed right-0 top-1/2 z-20 hidden -translate-y-1/2 md:block"
      style={{ width: railW, marginInline: "var(--gutter)" }}
    >
      <div ref={railRef} className="relative w-full" style={{ aspectRatio: `1 / ${aspect}` }}>
        {blocks.map((b, i) => (
          <button
            key={i}
            type="button"
            onClick={() => jumpTo(b)}
            aria-label={`Jump to ${b.label}`}
            className="absolute block cursor-pointer overflow-hidden transition-opacity hover:opacity-50"
            style={{
              top: `${b.top * 100}%`,
              left: `${b.left * 100}%`,
              width: `${b.width * 100}%`,
              height: `${b.height * 100}%`,
            }}
          >
            {b.kind === "media" && b.src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={b.src} alt="" aria-hidden="true" className="h-full w-full object-cover" />
            ) : (
              <MiniText block={b} scale={scale} />
            )}
          </button>
        ))}

        {/* At offset = (docH - viewH)/docH the top lands at rail.h * (1 -
            frac), flush with the bottom, so this needs no end-clamping.
            No transition: it must sit where the page is, not ease toward
            it a frame later. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute z-10 border border-ws-ink"
          style={{
            left: `calc(${contentLeft * 100}% - ${FRAME_PAD}px)`,
            width: `calc(${(contentRight - contentLeft) * 100}% + ${FRAME_PAD * 2}px)`,
            height: `${Math.max(rail.h * view.frac, 6)}px`,
            top: `${rail.h * view.offset}px`,
          }}
        />
      </div>
    </aside>
  );
}

/**
 * The block's own text, cloned and shrunk.
 *
 * Laid out at the block's REAL pixel width and then scaled by the rail's
 * ratio to the document, rather than simply set in a tiny font: only the
 * former breaks the lines where the page breaks them, which is most of
 * what makes a paragraph recognisable at this size.
 *
 * The clone is inert and aria-hidden — it is a picture of content that
 * already exists above it, and a second copy of every link would be two
 * more tab stops for nothing.
 */
function MiniText({ block, scale }: { block: Block; scale: number }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const clone = block.node.cloneNode(true) as HTMLElement;
    // A view-transition-name must be unique per document; a clone
    // carrying one would silently cancel the real element's transition.
    for (const n of [clone, ...clone.querySelectorAll<HTMLElement>("*")]) {
      n.style.removeProperty("view-transition-name");
      n.removeAttribute("id");
    }
    // Every link in the clone is a second copy of one that already exists
    // further up the page, so it must not take focus. Stripped from the
    // nodes rather than left to `inert` on the host: React did not apply
    // the attribute, and the tab order was silently one stop longer.
    for (const n of clone.querySelectorAll<HTMLElement>("a, button, input, select, textarea, [tabindex]")) {
      n.removeAttribute("href");
      n.setAttribute("tabindex", "-1");
    }
    el.setAttribute("inert", "");
    el.replaceChildren(clone);
    // `scale` is in the deps because this component renders nothing until
    // it is known: on the first pass the ref is still null, so without it
    // the clone is never injected once the span finally exists.
  }, [block.node, scale]);

  if (scale <= 0) return null;

  return (
    <span
      ref={host}
      aria-hidden="true"
      className="pointer-events-none block origin-top-left text-ws-ink"
      style={{ width: `${block.pxWidth}px`, transform: `scale(${scale})` }}
    />
  );
}
