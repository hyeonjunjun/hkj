/**
 * TransitionLink — passthrough shim.
 * The old page-transition system has been removed. This component is a
 * drop-in replacement that renders a plain Next.js Link so existing pages
 * continue to compile without modification.
 */
import Link from "next/link";
export default Link;
