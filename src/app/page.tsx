import { works } from "@/data/works";
import HomeShell from "@/components/home/HomeShell";

/**
 * Home: a bare top row (wordmark, nav, info, clock — no chip/pill
 * backgrounds, per the editorial-analog rebuild) over the catalogue in
 * one of its two arrangements — the stepped spread, or the index.
 *
 * Both live here rather than at two URLs; see lib/homeView. The shell is
 * a client component because the arrangement is state, so this file is
 * only the data hand-off.
 */
export default function Landing() {
  return <HomeShell works={works} />;
}
