// Shared type definitions used across all rooms.

/** The four rooms of the site, plus the landing masthead they open onto. */
export type RoomKey = "works" | "archive" | "references" | "info";

export type AvailabilityStatus = "available" | "limited" | "unavailable";

export type MediaType = "video" | "image" | "placeholder";

export type AspectRatio = "portrait" | "square" | "landscape" | "wide";

/** A media asset attached to a Work, Archive entry, or Reference. */
export interface MediaAsset {
  type: MediaType;
  /** Required for "video" and "image"; ignored for "placeholder". */
  src?: string;
  /** Poster frame for video, or a low-res stand-in while the real asset loads. */
  fallbackSrc?: string;
  /** Always required, even for placeholders — describes what the asset represents. */
  alt: string;
  aspectRatio: AspectRatio;
}
