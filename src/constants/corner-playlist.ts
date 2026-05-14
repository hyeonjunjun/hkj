/**
 * Zero-audio playlist — metadata for the silent audio fixture on the
 * corner portfolio. Tracks rotate visually; the page never emits sound.
 * 8-track target per spec; expand later as the rotation deepens.
 *
 * Runtime is in seconds. The fixture computes the current track by
 * dividing real time (since a fixed epoch) by the cumulative runtime
 * of the playlist, so navigation between pages picks up wherever the
 * rotation actually is — not from zero on every mount.
 */

export interface CornerTrack {
  title: string;
  artist: string;
  /** Track runtime in seconds. */
  runtime: number;
}

export const CORNER_PLAYLIST: ReadonlyArray<CornerTrack> = [
  { title: "Adore U",                artist: "Fred Again..",            runtime: 214 },
  { title: "Marilyn Monroe",         artist: "Sevdaliza",               runtime: 254 },
  { title: "Spring Day",             artist: "BTS",                     runtime: 274 },
  { title: "Houdini",                artist: "Dua Lipa",                runtime: 187 },
  { title: "Delilah (pull me out of this)", artist: "Fred Again..",     runtime: 220 },
  { title: "Pink + White",           artist: "Frank Ocean",             runtime: 184 },
  { title: "Run",                    artist: "BTS",                     runtime: 234 },
  { title: "Kyoto",                  artist: "Phoebe Bridgers",         runtime: 187 },
];

/**
 * Rotation epoch — fixed Unix ms timestamp. Position within the
 * playlist is computed from real time elapsed since this moment.
 * Picking a date in the past means the rotation is "in progress"
 * on first load; everyone sees the same track at the same wall-
 * clock moment.
 */
export const CORNER_PLAYLIST_EPOCH = 1700000000000; // 2023-11-14
