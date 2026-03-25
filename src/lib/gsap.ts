import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// NOTE: The Flip module file on disk is "Flip.js" but TypeScript on Windows
// sees the types as "flip.d.ts". We import with the canonical casing and
// suppress the false-positive with skipLibCheck (already true in tsconfig).
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore — casing mismatch on Windows only; runtime import is correct
import Flip from "gsap/Flip";

gsap.registerPlugin(ScrollTrigger, Flip);

export { gsap, ScrollTrigger, Flip };
