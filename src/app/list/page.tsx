import { redirect } from "next/navigation";

/**
 * /list — legacy path. Index and Projects are now the same
 * page (/) with a `?view=projects` query toggle. This route
 * stays for old links / bookmarks and redirects to the canonical URL.
 */
export default function CornerListLegacyPage() {
  redirect("/?view=projects");
}
