export interface ExperienceEntry {
  period: string;
  role: string;
  /** Optional — some engagements intentionally unattributed. */
  org?: string;
}

export const EXPERIENCE: ExperienceEntry[] = [
  { period: "2024–Present", role: "Independent",         org: "Design engineering" },
  { period: "2023–2024",    role: "Design technologist" },
  { period: "2021–2023",    role: "Frontend developer" },
];
