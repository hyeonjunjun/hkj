/**
 * Inline blocking script rendered in the document head (via root
 * layout). Reads localStorage('hkj.theme'); falls back to time-of-day
 * (light 7am-7pm local; dark otherwise). Sets data-theme on <html>
 * synchronously before paint to eliminate theme flash.
 *
 * Pattern: theme-flash mitigation. The script is tiny, synchronous,
 * and runs once per route load before client hydration.
 *
 * NOT next/script (beforeInteractive only valid in root layout AND
 * blocks app paint differently than a plain <script>). A plain
 * <script> tag with dangerouslySetInnerHTML, server-rendered as part
 * of the layout HTML, is the canonical theme-flash mitigation pattern.
 */
export default function ThemeInit() {
  const code = `(function(){try{var s=localStorage.getItem('hkj.theme');var t;if(s==='light'||s==='dark'){t=s;}else{var h=new Date().getHours();t=(h>=7&&h<19)?'light':'dark';}document.documentElement.dataset.theme=t;}catch(e){document.documentElement.dataset.theme='light';}})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
