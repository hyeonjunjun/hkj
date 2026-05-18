/**
 * Zero-audio playlist — metadata for the silent audio fixture on the
 * corner portfolio. Tracks rotate visually; the page never emits sound.
 *
 * Source: Ryan's "currently on loop" set (received 2026-05-14 via
 * Spotify links). Titles + artists pulled from Spotify oEmbed metadata;
 * cover thumbnails are the oEmbed `thumbnail_url` (Spotify CDN, 300px
 * jpegs). The `url` field is the public Spotify track page — used to
 * make the now-playing title clickable so visitors can open it in
 * their own Spotify / browser.
 *
 * Runtimes in seconds. Rotation logic in useRotatingPlaylist.ts.
 */

export interface CornerTrack {
  title: string;
  artist: string;
  /** Track runtime in seconds. */
  runtime: number;
  /** Public Spotify track URL — opened on click. Undefined disables the link. */
  url?: string;
  /** Album cover thumbnail URL (300px JPEG from Spotify CDN). */
  cover?: string;
}

export const CORNER_PLAYLIST: ReadonlyArray<CornerTrack> = [
  {
    title: "SWIM with RM (Chill Hip Hop Remix)",
    artist: "BTS",
    runtime: 163,
    url: "https://open.spotify.com/track/7EytKcb3klVPpN5IW1sj1Y",
    cover: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02dd898ec5b8a2107a1ab9f47b",
  },
  {
    title: "Trivia 轉 : Seesaw",
    artist: "BTS",
    runtime: 246,
    url: "https://open.spotify.com/track/0mZI1NpihIVcho2f9MmqSW",
    cover: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02af396dce4438624ec801ff1a",
  },
  {
    title: "Do For Love",
    artist: "2Pac",
    runtime: 281,
    url: "https://open.spotify.com/track/4AE7Lj39VnSZNOmGH2iZaq",
    cover: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e028e0ff34ad21955b6f4da9b86",
  },
  {
    title: "too pretty to be this dumb",
    artist: "ava rae",
    runtime: 225,
    url: "https://open.spotify.com/track/6pMy7eL3rd4a7QYCgG5ebB",
    cover: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e024e2cfc31403fb6dc9af6b316",
  },
  {
    title: "ketamina",
    artist: "yaego, KUČKA",
    runtime: 270,
    url: "https://open.spotify.com/track/0mzHbZ09hL9uUeV7rJ1ylR",
    cover: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e029074414dfe975acf68a2e155",
  },
  {
    title: "recuérdame (eterno)",
    artist: "yaego",
    runtime: 352,
    url: "https://open.spotify.com/track/3i1f2dVTf3TZvgYsnspNVx",
    cover: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02468dbd34b58a09350dead6d4",
  },
  {
    title: "I Luv U",
    artist: "Fred again.., Wallfacer",
    runtime: 197,
    url: "https://open.spotify.com/track/3cegNfTneBkgIoPJ5yngNT",
    cover: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e024018b70099d433d9c8aabb12",
  },
  {
    title: "Run",
    artist: "BTS",
    runtime: 235,
    url: "https://open.spotify.com/track/3G1aAxWS2Nd17FQs4PWV6X",
    cover: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02d5d5e874bde16f6ef86c99dc",
  },
  {
    title: "季节性梦见你",
    artist: "白浩贤BlueC, 邹沛沛",
    runtime: 193,
    url: "https://open.spotify.com/track/2CCdiYBdqrb5pUVzDOvWJm",
    cover: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e0223646c98b1e0299819b0dcde",
  },
  {
    title: "Run BTS",
    artist: "BTS",
    runtime: 191,
    url: "https://open.spotify.com/track/69xohKu8C1fsflYAiSNbwM",
    cover: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e0217db30ce3f081d6818a8ad49",
  },
];

/**
 * Rotation epoch — fixed Unix ms timestamp. Position within the
 * playlist is computed from real time elapsed since this moment.
 * Everyone sees the same track at the same wall-clock moment.
 */
export const CORNER_PLAYLIST_EPOCH = 1700000000000; // 2023-11-14
