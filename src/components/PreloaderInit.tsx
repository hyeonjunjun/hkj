/**
 * Inline blocking script rendered ahead of <main> on the home route
 * only. Reads localStorage('hkj.preloader.dismissed') and sets
 * data-preloader-state="dismissed" | "active" on <html> before the
 * preloader DOM parses — so CSS visibility resolves correctly on
 * first paint.
 *
 * Pairs with usePreloaderState. Mounted in src/app/page.tsx, NOT in
 * root layout (preloader is home-route-only).
 *
 * Pattern: theme-flash mitigation, identical shape to ThemeInit.
 */
export default function PreloaderInit() {
  const code = `(function(){try{var v=localStorage.getItem('hkj.preloader.dismissed');document.documentElement.dataset.preloaderState=(v==='1')?'dismissed':'active';}catch(e){document.documentElement.dataset.preloaderState='active';}})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
