import { NextResponse } from "next/server";

type YouTubeStats = {
  viewCount: number;
  likeCount: number;
  fetchedAt: string;
};

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

export async function GET() {
  try {
    const apiKey = getRequiredEnv("YOUTUBE_API_KEY");
    const videoId = getRequiredEnv("YOUTUBE_VIDEO_ID");

    const url = new URL("https://www.googleapis.com/youtube/v3/videos");
    url.searchParams.set("part", "statistics");
    url.searchParams.set("id", videoId);
    url.searchParams.set("key", apiKey);

    const response = await fetch(url, {
      // cache on the server for a short time
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      const text = await response.text();
      let googleMessage: string | undefined;
      let googleReason: string | undefined;

      try {
        const parsed = JSON.parse(text) as {
          error?: { message?: string; errors?: Array<{ reason?: string }> };
        };
        googleMessage = parsed.error?.message;
        googleReason = parsed.error?.errors?.[0]?.reason;
      } catch {
        // ignore parse errors
      }

      return NextResponse.json(
        {
          error: "YouTube API request failed",
          googleMessage,
          googleReason,
          upstreamStatus: response.status,
        },
        { status: 502 }
      );
    }

    const json = (await response.json()) as {
      items?: Array<{ statistics?: { viewCount?: string; likeCount?: string } }>;
    };

    const stats = json.items?.[0]?.statistics;
    const viewCount = Number(stats?.viewCount ?? 0);
    const likeCount = Number(stats?.likeCount ?? 0);

    const body: YouTubeStats = {
      viewCount: Number.isFinite(viewCount) ? viewCount : 0,
      likeCount: Number.isFinite(likeCount) ? likeCount : 0,
      fetchedAt: new Date().toISOString(),
    };

    return NextResponse.json(body);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
