import { redirect } from "next/navigation";

/**
 * /contact — the corner doesn't have a separate Contact route; the
 * Info tab (/about) houses contact info. Redirect there.
 */
export default function ContactLegacyPage() {
  redirect("/about");
}
