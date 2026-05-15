import { redirect } from "next/navigation";

/**
 * /work — the corner doesn't have a separate work index; the home
 * IS the index (project grid + ledger toggle). Redirect to /.
 */
export default function WorkLegacyPage() {
  redirect("/");
}
