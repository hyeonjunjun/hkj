import type { AvailabilityStatus, RoomKey } from "@/lib/types";

/** A single navigation entry, one per room. */
export interface NavItem {
  label: string;
  href: string;
  /** Which room this link points to — drives Nav's active-state matching against the current pathname. */
  room: RoomKey;
}

/** Studio-wide identity, copy, and metadata — the single data source shared by the landing masthead and every room's chrome. */
export interface StudioData {
  /** Short mark rendered large by Wordmark (e.g. "ryan jun"). */
  wordmark: string;
  fullName: string;
  ownerName: string;
  role: string;
  location: string;
  /** Founding year, rendered as "EST {established}". */
  established: string;
  /** Human-readable availability label (e.g. "Available"). */
  availability: string;
  /** Machine-readable availability state, reserved for future status styling. */
  availabilityStatus: AvailabilityStatus;
  /** Short paragraph rendered by Standfirst. */
  standfirst: string;
  /** Large statement rendered by ThesisStatement. */
  thesis: string;
  /** Philosophy quote and attribution. */
  quote?: {
    text: string;
    author: string;
  };
  contactEmail: string;
  navItems: NavItem[];
}

export const studio: StudioData = {
  wordmark: "ryan jun",
  fullName: "Ryan Jun",
  ownerName: "Ryan Jun",
  role: "independent creative studio",
  location: "New York",
  established: "2026",
  availability: "Available",
  availabilityStatus: "available",
  standfirst:
    "Placeholder standfirst — a short paragraph describing the practice, scope, and audience. Replace when real copy is written.",
  thesis:
    "“Twenty years from now you will be more disappointed by the things that you didn't do than by the ones you did do. So throw off the bowlines. Sail away from the safe harbor. Catch the trade winds in your sails. Explore. Dream. Discover.”",
  quote: {
    text: "Twenty years from now you will be more disappointed by the things that you didn't do than by the ones you did do. So throw off the bowlines. Sail away from the safe harbor. Catch the trade winds in your sails. Explore. Dream. Discover.",
    author: "Unknown",
  },
  contactEmail: "hello@hkjstudio.com",
  navItems: [
    { label: "works", href: "/works", room: "works" },
    { label: "archive", href: "/archive", room: "archive" },
    { label: "notes", href: "/notes", room: "notes" },
  ],
};
