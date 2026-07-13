import type { NavItem } from "@/data/studio";

/**
 * Whether a NavItem should render as "active" for the given pathname.
 *
 * Matches on exact href equality, OR on the item's `room` — checked as
 * its own path segment (`/${room}/`), not a raw string prefix, so
 * "/archive/x" matches the "archive" room but "/archived-notes" doesn't.
 *
 * The room-based check matters independently of href: if a room's link
 * ever points somewhere other than "/{room}" (e.g. "works" pointing at
 * "/" instead of "/works"), sub-pages under "/{room}/..." still need to
 * light up the right tab.
 */
export function isNavItemActive(pathname: string | null, item: NavItem): boolean {
  if (pathname === null) return false;
  if (pathname === item.href) return true;
  return pathname.startsWith(`/${item.room}/`);
}
