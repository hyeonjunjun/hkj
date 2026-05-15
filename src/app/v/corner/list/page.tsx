import { redirect } from "next/navigation";

/**
 * /v/corner/list — legacy path. Index and Projects are now the same
 * page (/v/corner) with a `?view=projects` query toggle. This route
 * stays for old links / bookmarks and redirects to the canonical URL.
 */
export default function CornerListLegacyPage() {
  redirect("/v/corner?view=projects");
}
