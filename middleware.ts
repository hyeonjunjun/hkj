import { NextRequest, NextResponse } from "next/server";

/**
 * Mobile redirect middleware (HKJ_OS Plan A).
 *
 * Layer 1 of the two-layer mobile fallback strategy. Edge-runs
 * before any HTML is generated. Sniffs User-Agent for known
 * mobile patterns (including iPad, which Apple ships without
 * "Mobile" in the UA).
 *
 * If matched and the path is "/", rewrites to /classic. The
 * client-side Layer 2 (matchMedia coarse-pointer + viewport)
 * lives elsewhere and catches ambiguous devices that pass this
 * filter — see <ClassicGate> (Plan B).
 *
 * User overrides via ?force=os | ?force=classic + cookie are
 * NOT yet implemented in Plan A — added in Plan B alongside
 * window state machinery.
 */

// Matches: iPhone, iPad, iPod, Android Mobile, generic Mobile, Opera Mobi.
// Known coverage gap (accepted in Plan A): Android tablets without
// "Mobile" in their UA (e.g. Samsung Galaxy Tab default mode) will
// pass through to / and hit the OS surface. Plan B's Layer-2
// client-side check (matchMedia coarse-pointer + viewport ≤720px)
// will catch them. Until Plan B ships, this is a known gap; do not
// extend the regex here unilaterally.
const MOBILE_UA = /iPhone|iPad|iPod|Android.*Mobile|Mobile.*(Safari|Firefox)|Opera Mobi/i;

export function middleware(req: NextRequest) {
  const ua = req.headers.get("user-agent") ?? "";
  const path = req.nextUrl.pathname;

  if (path === "/" && MOBILE_UA.test(ua)) {
    return NextResponse.rewrite(new URL("/classic", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
