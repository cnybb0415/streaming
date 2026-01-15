import { siteConfig } from "@/config/site";
import type { ChartItem, ChartsData } from "@/lib/charts";

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";
export const revalidate = 0;

type ProviderEntry = {
  rank?: unknown;
  rankStatus?: unknown;
  changedRank?: unknown;
  artistName?: unknown;
  title?: unknown;
};

type ChartsCacheFile = {
  lastUpdated: string;
  items: Array<{ label: string; status?: string; rank?: number; prevRank?: number }>;
};

function extractEntries(json: unknown): ProviderEntry[] {
  if (Array.isArray(json)) return json as ProviderEntry[];
  if (!json || typeof json !== "object") return [];

  const data = (json as { data?: unknown }).data;
  return Array.isArray(data) ? (data as ProviderEntry[]) : [];
}

function toNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function normalizeText(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim().toLowerCase();
}

function computePrevRank(entry: ProviderEntry, rank: number): number | undefined {
  const rankStatus = normalizeText(entry.rankStatus);
  const changedRank = toNumber(entry.changedRank) ?? 0;

  if (rankStatus === "static") return rank;
  if (rankStatus === "up") return rank + changedRank;
  if (rankStatus === "down") return rank - changedRank;

  return undefined;
}

function getCacheFilePath(): string {
  const fromEnv = process.env.CHARTS_CACHE_FILE;
  if (fromEnv && fromEnv.trim().length > 0) return fromEnv.trim();
  return path.join(process.cwd(), ".cache", "charts-cache.json");
}

async function readChartsCache(): Promise<ChartsData | null> {
  const filePath = getCacheFilePath();
  try {
    const raw = await readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return null;

    const data = parsed as ChartsCacheFile;
    if (typeof data.lastUpdated !== "string") return null;
    if (!Array.isArray(data.items)) return null;

    // Light validation; keep it permissive for local dev.
    const items: ChartItem[] = data.items
      .filter((i) => i && typeof i === "object")
      .map((i) => ({
        label: (i as { label?: unknown }).label as string,
        status: (i as { status?: unknown }).status as string | undefined,
        rank: (i as { rank?: unknown }).rank as number | undefined,
        prevRank: (i as { prevRank?: unknown }).prevRank as number | undefined,
      }))
      .filter((i) => typeof i.label === "string" && i.label.trim().length > 0);

    return {
      lastUpdated: data.lastUpdated,
      items,
    };
  } catch {
    return null;
  }
}

async function writeChartsCache(data: ChartsData): Promise<void> {
  const filePath = getCacheFilePath();
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
}

function getNextTopOfHour(now: Date): Date {
  const next = new Date(now);
  next.setMinutes(0, 0, 0);
  next.setHours(next.getHours() + 1);
  return next;
}

function isStaleForHourlyRefresh(lastUpdatedIso: string, now: Date): boolean {
  const last = new Date(lastUpdatedIso);
  if (Number.isNaN(last.getTime())) return true;
  // Refresh once we cross the next top-of-hour boundary after lastUpdated.
  return now.getTime() >= getNextTopOfHour(last).getTime();
}

function pickTrackEntry(
  entries: ProviderEntry[],
  artistName: string,
  trackTitle: string
): ProviderEntry | undefined {
  const artistNorm = normalizeText(artistName);
  const trackNorm = normalizeText(trackTitle);

  const byTrack = entries.filter((e) => {
    const title = normalizeText(e.title);
    if (!title) return false;
    return title === trackNorm || title.includes(trackNorm) || trackNorm.includes(title);
  });

  const scoped = byTrack.length
    ? byTrack
    : entries.filter((e) => {
        const artist = normalizeText(e.artistName);
        return artistNorm.length > 0 && artist.includes(artistNorm);
      });

  return scoped[0];
}

async function fetchChartsAndPersist(
  artistName: string,
  trackTitle: string
): Promise<ChartsData> {
  const baseUrl = process.env.KOREA_MUSIC_CHART_API_BASE_URL;
  if (!baseUrl) {
    const data: ChartsData = {
      lastUpdated: new Date().toISOString(),
      items: [
        {
          label: "차트",
          status: "Missing env: KOREA_MUSIC_CHART_API_BASE_URL",
        },
      ],
    };
    await writeChartsCache(data);
    return data;
  }

  const cached = await readChartsCache();
  const prevRankByLabel = new Map<string, number>();
  cached?.items.forEach((item) => {
    if (typeof item.rank === "number") prevRankByLabel.set(item.label, item.rank);
  });

  const platforms = [
    { key: "melon", label: "멜론 TOP100" },
    { key: "genie", label: "지니" },
    { key: "bugs", label: "벅스" },
    { key: "vibe", label: "바이브" },
  ] as const;

  const results: Array<ChartItem | null> = new Array(platforms.length).fill(null);

  await Promise.all(
    platforms.map(async (platform, index) => {
      const endpoint = `${baseUrl.replace(/\/+$/, "")}/${platform.key}/chart/${encodeURIComponent(
        artistName
      )}`;

      let response: Response;
      try {
        response = await fetch(endpoint, {
          headers: { accept: "application/json" },
        });
      } catch {
        results[index] = { label: platform.label, status: "차트 API 서버 연결 실패" };
        return;
      }

      if (!response.ok) {
        results[index] = { label: platform.label, status: "차트 연동 실패" };
        return;
      }

      let json: unknown;
      try {
        json = (await response.json()) as unknown;
      } catch {
        results[index] = { label: platform.label, status: "차트 응답 파싱 실패" };
        return;
      }

      const entries = extractEntries(json);
      const match = pickTrackEntry(entries, artistName, trackTitle);
      const rank = match ? toNumber(match.rank) : undefined;

      if (typeof rank !== "number") {
        results[index] = { label: platform.label, status: "TOP100 미진입" };
        return;
      }

      const prevRankFromProvider = match ? computePrevRank(match, rank) : undefined;
      const prevRank =
        typeof prevRankFromProvider === "number"
          ? prevRankFromProvider
          : prevRankByLabel.get(platform.label);

      results[index] = { label: platform.label, rank, prevRank };
    })
  );

  const items = results.filter((item): item is ChartItem => item !== null);

  const data: ChartsData = {
    lastUpdated: new Date().toISOString(),
    items,
  };

  await writeChartsCache(data);
  return data;
}

function ensureHourlyBackgroundRefreshStarted(): void {
  const enabled =
    process.env.CHARTS_BACKGROUND_REFRESH === "1" ||
    (process.env.CHARTS_BACKGROUND_REFRESH !== "0" && process.env.NODE_ENV !== "production");

  if (!enabled) return;

  const g = globalThis as unknown as { __chartsRefreshStarted?: boolean };
  if (g.__chartsRefreshStarted) return;
  g.__chartsRefreshStarted = true;

  const tick = async () => {
    try {
      await fetchChartsAndPersist(siteConfig.artistName, siteConfig.trackTitle);
    } catch {
      // Best-effort; failures are reflected in the cached JSON next time.
    }
  };

  const now = new Date();
  const delayMs = Math.max(0, getNextTopOfHour(now).getTime() - now.getTime());
  setTimeout(() => {
    void tick();
    setInterval(() => void tick(), 1000 * 60 * 60);
  }, delayMs);
}

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);

  ensureHourlyBackgroundRefreshStarted();

  const artistName = url.searchParams.get("artist") || siteConfig.artistName;
  const trackTitle = url.searchParams.get("track") || siteConfig.trackTitle;

  const force = url.searchParams.get("force") === "1";

  try {
    const cached = await readChartsCache();
    const now = new Date();

    if (!force && cached && !isStaleForHourlyRefresh(cached.lastUpdated, now)) {
      return Response.json(cached, {
        headers: {
          "cache-control": "no-store",
        },
      });
    }

    const data = await fetchChartsAndPersist(artistName, trackTitle);
    return Response.json(data, {
      headers: {
        "cache-control": "no-store",
      },
    });
  } catch {
    // Keep the API shape stable even if something unexpected happens.
    const data: ChartsData = {
      lastUpdated: new Date().toISOString(),
      items: [
        {
          label: "차트",
          status: "차트 연동 실패",
        },
      ],
    };
    try {
      await writeChartsCache(data);
    } catch {
      // ignore
    }
    return Response.json(data, {
      headers: {
        "cache-control": "no-store",
      },
    });
  }
}
