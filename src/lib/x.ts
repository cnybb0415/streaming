type XUserResponse = {
  data?: { id: string; username: string; name: string };
};

type XMedia = {
  media_key: string;
  type: "photo" | "video" | "animated_gif";
  url?: string;
  preview_image_url?: string;
};

type XTweetsResponse = {
  data?: Array<{
    id: string;
    text: string;
    created_at?: string;
    attachments?: { media_keys?: string[] };
  }>;
  includes?: {
    media?: XMedia[];
  };
};

export type LatestTweet = {
  id: string;
  text: string;
  createdAt?: string;
  mediaUrl?: string;
  previewImageUrl?: string;
  previewUrl?: string;
  url: string;
  username: string;
};

const API_BASE = "https://api.x.com/2";
const MICROLINK_API = "https://api.microlink.io";

function getBearerToken() {
  const raw = process.env.X_BEARER_TOKEN?.trim();
  if (!raw) return undefined;
  const token = raw.startsWith("Bearer ") ? raw.slice(7).trim() : raw;
  return token.length > 0 ? token : undefined;
}

async function fetchJson<T>(url: string, token: string): Promise<T> {
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    next: { revalidate: 900 },
  });

  if (!res.ok) {
    throw new Error(`X API error: ${res.status}`);
  }

  return (await res.json()) as T;
}

async function resolveFinalUrl(url: string): Promise<string> {
  try {
    const res = await fetch(url, { redirect: "follow" });
    return res.url || url;
  } catch {
    return url;
  }
}

function extractFirstUrl(text: string): string | undefined {
  const match = text.match(/https?:\/\/\S+/i);
  if (!match) return undefined;
  const raw = match[0];
  return raw.replace(/[),.!?\]]+$/, "");
}

async function fetchLinkPreviewImage(url: string): Promise<string | undefined> {
  const expandedUrl = await resolveFinalUrl(url);
  const lower = expandedUrl.toLowerCase();
  const isTikTok = lower.includes("tiktok.com/");
  const isYouTube = lower.includes("youtube.com/") || lower.includes("youtu.be/");

  if (isTikTok) {
    try {
      const res = await fetch(
        `https://www.tiktok.com/oembed?url=${encodeURIComponent(expandedUrl)}`
      );
      if (res.ok) {
        const json = (await res.json()) as { thumbnail_url?: string };
        if (json.thumbnail_url) return json.thumbnail_url;
      }
    } catch {
      // fall through
    }
  }

  if (isYouTube) {
    try {
      const res = await fetch(
        `https://www.youtube.com/oembed?url=${encodeURIComponent(expandedUrl)}&format=json`
      );
      if (res.ok) {
        const json = (await res.json()) as { thumbnail_url?: string };
        if (json.thumbnail_url) return json.thumbnail_url;
      }
    } catch {
      // fall through
    }
  }

  try {
    const apiKey = process.env.MICROLINK_API_KEY?.trim();
    const req = new URL(MICROLINK_API);
    req.searchParams.set("url", expandedUrl);
    req.searchParams.set("screenshot", "true");
    if (apiKey) req.searchParams.set("apiKey", apiKey);

    const res = await fetch(req.toString(), { next: { revalidate: 900 } });
    if (!res.ok) return undefined;
    const json = (await res.json()) as {
      status?: string;
      data?: { image?: { url?: string } | string; screenshot?: { url?: string } };
    };
    const image = json?.data?.image;
    if (typeof image === "string") return image;
    return image?.url || json?.data?.screenshot?.url;
  } catch {
    return undefined;
  }
}

async function resolveUserId(username: string, token: string): Promise<string> {
  const url = `${API_BASE}/users/by/username/${encodeURIComponent(username)}`;
  const json = await fetchJson<XUserResponse>(url, token);
  if (!json.data?.id) throw new Error("X API: missing user id");
  return json.data.id;
}

export async function getLatestTweet(): Promise<LatestTweet | null> {
  const token = getBearerToken();
  if (!token) {
    console.warn("X API: missing bearer token");
    return null;
  }

  const username = (process.env.X_USERNAME || "weareoneEXO").trim();
  const userIdFromEnv = process.env.X_USER_ID?.trim();

  let userId: string;
  try {
    userId = userIdFromEnv && userIdFromEnv.length > 0
      ? userIdFromEnv
      : await resolveUserId(username, token);
  } catch (error) {
    console.error("X API: failed to resolve user id", error);
    return null;
  }

  const url = new URL(`${API_BASE}/users/${userId}/tweets`);
  url.searchParams.set("max_results", "5");
  url.searchParams.set("exclude", "replies,retweets");
  url.searchParams.set("tweet.fields", "created_at,attachments");
  url.searchParams.set("expansions", "attachments.media_keys");
  url.searchParams.set("media.fields", "url,preview_image_url,type");

  let json: XTweetsResponse;
  try {
    json = await fetchJson<XTweetsResponse>(url.toString(), token);
  } catch (error) {
    console.error("X API: failed to fetch tweets", error);
    return null;
  }
  const tweet = json.data?.[0];
  if (!tweet) {
    console.warn("X API: no tweets returned", {
      count: json.data?.length ?? 0,
      username,
    });
    return null;
  }

  const mediaKeys = tweet.attachments?.media_keys ?? [];
  const media = json.includes?.media ?? [];
  const firstMedia = mediaKeys.length
    ? media.find((m) => m.media_key === mediaKeys[0])
    : undefined;

  const mediaUrl = firstMedia?.url || firstMedia?.preview_image_url;
  const previewUrl = extractFirstUrl(tweet.text);
  const previewImageUrl = !mediaUrl && previewUrl ? await fetchLinkPreviewImage(previewUrl) : undefined;

  return {
    id: tweet.id,
    text: tweet.text,
    createdAt: tweet.created_at,
    mediaUrl,
    previewImageUrl,
    previewUrl,
    url: `https://x.com/${username}/status/${tweet.id}`,
    username,
  };
}
