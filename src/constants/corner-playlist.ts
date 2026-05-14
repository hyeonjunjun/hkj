/**
 * Zero-audio playlist — metadata for the silent audio fixture on the
 * corner portfolio. Tracks rotate visually; the page never emits sound.
 *
 * Current source: Ryan's "currently on loop" set (received 2026-05-14
 * via Spotify links). Track titles + artists pulled from Spotify
 * oEmbed metadata. Runtimes in seconds.
 *
 * Rotation logic: total runtime sums all tracks; position is derived
 * from real time elapsed since CORNER_PLAYLIST_EPOCH (Unix ms),
 * modulo the total. Everyone sees the same track at the same wall-
 * clock moment.
 */

export interface CornerTrack {
  title: string;
  artist: string;
  /** Track runtime in seconds. */
  runtime: number;
}

export const CORNER_PLAYLIST: ReadonlyArray<CornerTrack> = [
  { title: "SWIM with RM (Chill Hip Hop Remix)", artist: "BTS",                            runtime: 163 },
  { title: "Trivia 轉 : Seesaw",                  artist: "BTS",                            runtime: 246 },
  { title: "Do For Love",                         artist: "2Pac",                           runtime: 281 },
  { title: "too pretty to be this dumb",          artist: "ava rae",                        runtime: 225 },
  { title: "ketamina",                            artist: "yaego, KUČKA",                   runtime: 270 },
  { title: "recuérdame (eterno)",                 artist: "yaego",                          runtime: 352 },
  { title: "I Luv U",                             artist: "Fred again.., Wallfacer",        runtime: 197 },
  { title: "Run",                                 artist: "BTS",                            runtime: 235 },
  { title: "季节性梦见你",                          artist: "白浩贤BlueC, 邹沛沛",              runtime: 193 },
];

/**
 * Rotation epoch — fixed Unix ms timestamp. Position within the
 * playlist is computed from real time elapsed since this moment.
 * Picking a date in the past means the rotation is "in progress"
 * on first load; everyone sees the same track at the same wall-
 * clock moment.
 */
export const CORNER_PLAYLIST_EPOCH = 1700000000000; // 2023-11-14
