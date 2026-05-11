/**
 * /api/now-playing — proxy to Last.fm user.getRecentTracks.
 *
 * Keeps the Last.fm API key server-side. Returns the most recent
 * track plus a flag for whether it's currently playing.
 *
 * Required env vars (set in .env.local):
 *   LASTFM_API_KEY — your Last.fm API key (https://www.last.fm/api/account/create)
 *   LASTFM_USERNAME — your Last.fm username
 *
 * If either env var is missing, the route returns { ok: false, reason }.
 * The client component degrades gracefully — renders nothing if no track.
 *
 * Response shape (success):
 *   {
 *     ok: true,
 *     nowPlaying: boolean,    // true if currently scrobbling
 *     track: { name, artist, album, image, url },
 *     playedAt: string | null // ISO timestamp; null when nowPlaying
 *   }
 */

export const runtime = "edge";
export const revalidate = 30;

const ENDPOINT = "https://ws.audioscrobbler.com/2.0/";

type LastFmTrack = {
  name: string;
  artist: { "#text": string };
  album: { "#text": string };
  image: Array<{ "#text": string; size: string }>;
  url: string;
  "@attr"?: { nowplaying?: string };
  date?: { uts: string; "#text": string };
};

export async function GET() {
  const apiKey = process.env.LASTFM_API_KEY;
  const username = process.env.LASTFM_USERNAME;

  if (!apiKey || !username) {
    return Response.json(
      {
        ok: false,
        reason: "Last.fm credentials not configured",
      },
      { status: 200 },
    );
  }

  const url = new URL(ENDPOINT);
  url.searchParams.set("method", "user.getrecenttracks");
  url.searchParams.set("user", username);
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");

  try {
    const res = await fetch(url.toString(), {
      next: { revalidate: 30 },
    });
    if (!res.ok) {
      return Response.json({ ok: false, reason: "Last.fm fetch failed" });
    }
    const data = (await res.json()) as {
      recenttracks?: { track: LastFmTrack | LastFmTrack[] };
    };

    const tracks = data.recenttracks?.track;
    const track = Array.isArray(tracks) ? tracks[0] : tracks;
    if (!track) return Response.json({ ok: false, reason: "No tracks" });

    const nowPlaying = track["@attr"]?.nowplaying === "true";
    const image =
      track.image?.find((i) => i.size === "medium")?.["#text"] ??
      track.image?.[0]?.["#text"] ??
      null;

    return Response.json({
      ok: true,
      nowPlaying,
      track: {
        name: track.name,
        artist: track.artist["#text"],
        album: track.album["#text"],
        image: image || null,
        url: track.url,
      },
      playedAt: track.date ? new Date(Number(track.date.uts) * 1000).toISOString() : null,
    });
  } catch (err) {
    return Response.json({
      ok: false,
      reason: err instanceof Error ? err.message : "Unknown error",
    });
  }
}
