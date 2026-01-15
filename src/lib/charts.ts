import localCharts from "@/data/charts.json";

type ChartItem = {
  label: string;
  status: string;
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
    const i = item as { label?: unknown; status?: unknown };
    return typeof i.label === "string" && typeof i.status === "string";
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
