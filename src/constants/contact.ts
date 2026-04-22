export const CONTACT_EMAIL = "rykjun@gmail.com";

export interface Network {
  /** Display name for the network (e.g. "Cosmos", "X", "LinkedIn"). */
  label: string;
  /** Human-readable handle shown on the contact page (e.g. "cosmos.so/hyeonjun"). */
  handle: string;
  /** Full URL destination. */
  href: string;
}

export const NETWORKS: Network[] = [
  {
    label: "Cosmos",
    handle: "cosmos.so/hyeonjun",
    href: "https://cosmos.so/hyeonjun",
  },
  {
    label: "X",
    handle: "x.com/hyeonjunjun",
    href: "https://x.com/hyeonjunjun",
  },
  {
    label: "LinkedIn",
    handle: "linkedin.com/in/hyeonjunjun",
    href: "https://linkedin.com/in/hyeonjunjun",
  },
];

// Back-compat alias — /about page imports SOCIALS.
export const SOCIALS = NETWORKS;
