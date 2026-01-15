import localCharts from "@/data/charts.json";

export type ChartItem = {
  label: string;
  status?: string;
  rank?: number;
  prevRank?: number;
};

export type ChartsData = {
  lastUpdated: string;
  items: ChartItem[];
};

function isChartsData(value: unknown): value is ChartsData {
  if (!value || typeof value !== "object") return false;
  const data = value as { lastUpdated?: unknown; items?: unknown };
  if (typeof data.lastUpdated !== "string") return false;
  if (!Array.isArray(data.items)) return false;
  return data.items.every((item) => {
    if (!item || typeof item !== "object") return false;
    const i = item as {
      label?: unknown;
      status?: unknown;
      rank?: unknown;
      prevRank?: unknown;
    };

    if (typeof i.label !== "string") return false;

    const hasValidStatus = i.status === undefined || typeof i.status === "string";
    const hasValidRank = i.rank === undefined || typeof i.rank === "number";
    const hasValidPrevRank =
      i.prevRank === undefined || typeof i.prevRank === "number";

    // Must have at least one displayable field.
    const hasAnyDisplay =
      typeof i.status === "string" || typeof i.rank === "number";

    return hasValidStatus && hasValidRank && hasValidPrevRank && hasAnyDisplay;
  });
}

export async function getChartsData(): Promise<ChartsData> {
  const overrideUrl = process.env.CHARTS_JSON_URL;
  if (!overrideUrl) {
    return localCharts as ChartsData;
  }

  try {
    const response = await fetch(overrideUrl, { next: { revalidate: 60 } });
    if (!response.ok) return localCharts as ChartsData;

    const json = (await response.json()) as unknown;
    if (!isChartsData(json)) return localCharts as ChartsData;

    return json;
  } catch {
    return localCharts as ChartsData;
  }
}
