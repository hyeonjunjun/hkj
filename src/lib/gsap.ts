import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Observer } from "gsap/Observer";

gsap.registerPlugin(ScrollTrigger, SplitText, Observer);

export { gsap, ScrollTrigger, SplitText, Observer };
