"use client";

import { useEffect } from "react";
import { rememberWork } from "@/lib/currentWork";

/**
 * Records the case study you are reading as the current work, so that
 * going back — to home or to /works — returns to this project rather
 * than to the top of the catalogue.
 *
 * A component rather than a call inside the page because the case study
 * is a server component; this is the smallest possible client boundary
 * that can reach sessionStorage. Renders nothing.
 */
export default function RememberWork({ slug }: { slug: string }) {
  useEffect(() => {
    rememberWork(slug);
  }, [slug]);

  return null;
}
