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
  fetchedAt?: string;
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

function normalizeComparable(value: unknown): string {
  if (typeof value !== "string") return "";
  return value
    .normalize("NFKC")
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "");
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

async function readChartsCache(): Promise<(ChartsData & { fetchedAt?: string }) | null> {
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
      fetchedAt: typeof data.fetchedAt === "string" ? data.fetchedAt : undefined,
      items,
    };
  } catch {
    return null;
  }
}

async function writeChartsCache(data: ChartsData): Promise<void> {
  const filePath = getCacheFilePath();
  await mkdir(path.dirname(filePath), { recursive: true });
  const payload: ChartsCacheFile = {
    ...data,
    fetchedAt: new Date().toISOString(),
  };
  await writeFile(filePath, JSON.stringify(payload, null, 2), "utf8");
}

function hasTransientFailure(items: ChartItem[]): boolean {
  return items.some((item) => {
    const status = typeof item.status === "string" ? item.status : "";
    return (
      status.includes("서버 연결 실패") ||
      status.includes("연동 실패") ||
      status.includes("응답 파싱 실패")
    );
  });
}

function hasDeprecatedPlaceholders(items: ChartItem[]): boolean {
  return items.some((item) => {
    const label = typeof item.label === "string" ? item.label.trim() : "";
    const status = typeof item.status === "string" ? item.status.trim() : "";
    return (
      label === "플로 실시간" ||
      (label.includes("플로") && status === "준비중")
    );
  });
}

const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

function getKstTopOfHourIso(now: Date): string {
  // KST has a fixed UTC+9 offset (no DST). We compute the KST-local top-of-hour
  // and convert back to an ISO timestamp.
  const kstMs = now.getTime() + KST_OFFSET_MS;
  const flooredKstMs = kstMs - (kstMs % (60 * 60 * 1000));
  const utcMs = flooredKstMs - KST_OFFSET_MS;
  return new Date(utcMs).toISOString();
}

function getNextKstTopOfHour(now: Date): Date {
  const kstMs = now.getTime() + KST_OFFSET_MS;
  const flooredKstMs = kstMs - (kstMs % (60 * 60 * 1000));
  const nextKstMs = flooredKstMs + 60 * 60 * 1000;
  const utcMs = nextKstMs - KST_OFFSET_MS;
  return new Date(utcMs);
}

function isStaleForHourlyRefresh(lastUpdatedIso: string, now: Date): boolean {
  const last = new Date(lastUpdatedIso);
  if (Number.isNaN(last.getTime())) return true;
  // Refresh once we cross a new KST top-of-hour boundary.
  return getKstTopOfHourIso(now) !== getKstTopOfHourIso(last);
}

function pickTrackEntry(
  entries: ProviderEntry[],
  artistName: string,
  trackTitle: string
): ProviderEntry | undefined {
  const artistNorm = normalizeText(artistName);
  const artistKey = normalizeComparable(artistName);
  const trackKey = normalizeComparable(trackTitle);

  const byTrack = entries.filter((e) => {
    if (!trackKey) return false;
    const titleKey = normalizeComparable(e.title);
    if (!titleKey) return false;
    return titleKey === trackKey || titleKey.includes(trackKey) || trackKey.includes(titleKey);
  });

  const byTrackAndArtist = byTrack.filter((e) => {
    if (!artistKey) return false;
    const entryArtistKey = normalizeComparable(e.artistName);
    return entryArtistKey.includes(artistKey);
  });

  const scoped = (byTrackAndArtist.length ? byTrackAndArtist : byTrack).length
    ? (byTrackAndArtist.length ? byTrackAndArtist : byTrack)
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
      lastUpdated: getKstTopOfHourIso(new Date()),
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
    {
      label: "멜론 TOP100",
      buildEndpoint: (base: string) =>
        `${base}/melon/chart/${encodeURIComponent(artistName)}`,
    },
    {
      label: "멜론 HOT100 100일",
      buildEndpoint: (base: string) =>
        `${base}/melon/hot100/D100/chart/${encodeURIComponent(artistName)}`,
    },
    {
      label: "멜론 HOT100 30일",
      buildEndpoint: (base: string) =>
        `${base}/melon/hot100/D30/chart/${encodeURIComponent(artistName)}`,
    },
    {
      label: "지니 TOP200",
      buildEndpoint: (base: string) =>
        `${base}/genie/chart/${encodeURIComponent(artistName)}`,
    },
    {
      label: "벅스 실시간",
      buildEndpoint: (base: string) =>
        `${base}/bugs/chart/${encodeURIComponent(artistName)}`,
    },
    {
      label: "플로 24시간",
      buildEndpoint: (base: string) =>
        `${base}/flo/chart/${encodeURIComponent(artistName)}`,
    },
    {
      label: "바이브 국내 급상승",
      buildEndpoint: (base: string) =>
        `${base}/vibe/chart/${encodeURIComponent(artistName)}`,
    },
  ] as const;

  const results: Array<ChartItem | null> = new Array(platforms.length).fill(null);

  await Promise.all(
    platforms.map(async (platform, index) => {
      const endpoint = platform.buildEndpoint(baseUrl.replace(/\/+$/, ""));

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
        results[index] = { label: platform.label, status: "차트 미진입" };
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
    lastUpdated: getKstTopOfHourIso(new Date()),
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
  const delayMs = Math.max(0, getNextKstTopOfHour(now).getTime() - now.getTime());
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

    // If the last fetch had transient failures, retry more aggressively so the UI
    // recovers quickly after the backend comes back up.
    const fetchedAtMs = cached?.fetchedAt ? new Date(cached.fetchedAt).getTime() : NaN;
    const allowQuickRetry =
      cached &&
      Number.isFinite(fetchedAtMs) &&
      hasTransientFailure(cached.items) &&
      now.getTime() - fetchedAtMs >= 60_000;

    const mustRefreshForSchema = cached ? hasDeprecatedPlaceholders(cached.items) : false;

    if (
      !force &&
      cached &&
      !mustRefreshForSchema &&
      !allowQuickRetry &&
      !isStaleForHourlyRefresh(cached.lastUpdated, now)
    ) {
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
      lastUpdated: getKstTopOfHourIso(new Date()),
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
