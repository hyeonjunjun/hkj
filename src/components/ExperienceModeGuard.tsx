"use client";

import { useStudioStore } from "@/lib/store";
import RecruiterView from "@/components/RecruiterView";

/**
 * ExperienceModeGuard
 * ───────────────────
 * Client component that conditionally renders Cinematic (children)
 * or Recruiter view based on store.experienceMode.
 */
export default function ExperienceModeGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const mode = useStudioStore((s) => s.experienceMode);

  if (mode === "recruiter") {
    return <RecruiterView />;
  }

  return <>{children}</>;
}
