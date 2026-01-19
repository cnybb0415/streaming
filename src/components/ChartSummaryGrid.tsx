import type { ChartItem, ChartsData } from "@/lib/charts";
import { cn } from "@/lib/utils";
import { MusicServiceIcon } from "@/components/MusicServiceIcon";

type ProviderKey = "melon" | "genie" | "bugs" | "flo" | "vibe";

type CardDef = {
  id: string;
  provider: ProviderKey;
  providerLabel: string;
  typeLabel: string;
  matchLabels: string[];
};

const CARDS: CardDef[] = [
  {
    id: "melon_top100",
    provider: "melon",
    providerLabel: "멜론",
    typeLabel: "TOP100",
    matchLabels: ["멜론 TOP100"],
  },
  {
    id: "melon_hot100_100d",
    provider: "melon",
    providerLabel: "멜론",
    typeLabel: "HOT100 100일",
    matchLabels: ["멜론 HOT100 100일"],
  },
  {
    id: "melon_hot100_30d",
    provider: "melon",
    providerLabel: "멜론",
    typeLabel: "HOT100 30일",
    matchLabels: ["멜론 HOT100 30일"],
  },
  {
    id: "genie_top200",
    provider: "genie",
    providerLabel: "지니",
    typeLabel: "TOP200",
    matchLabels: ["지니", "지니 TOP200"],
  },
  {
    id: "bugs_realtime",
    provider: "bugs",
    providerLabel: "벅스",
    typeLabel: "실시간",
    matchLabels: ["벅스", "벅스 실시간"],
  },
  {
    id: "flo_realtime",
    provider: "flo",
    providerLabel: "플로",
    typeLabel: "실시간",
    matchLabels: ["플로", "플로 실시간"],
  },
  {
    id: "vibe_domestic",
    provider: "vibe",
    providerLabel: "바이브",
    typeLabel: "국내 급상승",
    matchLabels: ["바이브", "바이브 국내 급상승"],
  },
];

function formatKstTimestamp(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "-";

  const parts = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
    .formatToParts(date)
    .reduce<Record<string, string>>((acc, p) => {
      if (p.type !== "literal") acc[p.type] = p.value;
      return acc;
    }, {});

  return `${parts.year}.${parts.month}.${parts.day} ${parts.hour}:${parts.minute} KST`;
}

function findItem(items: ChartItem[], matchLabels: string[]): ChartItem | undefined {
  return items.find((item) => matchLabels.some((label) => item.label.includes(label)));
}

function getRankText(item?: ChartItem): { primary: string; suffix?: string } {
  if (typeof item?.rank === "number") return { primary: String(item.rank), suffix: "위" };
  if (typeof item?.status === "string" && item.status.trim().length > 0) {
    return { primary: item.status.trim() };
  }
  return { primary: "-" };
}

function getChange(rank?: number, prevRank?: number): { label: string; className: string } {
  if (typeof rank !== "number") return { label: "-", className: "text-neutral-400" };
  if (typeof prevRank !== "number" || prevRank === rank) {
    return { label: "-", className: "text-neutral-400" };
  }

  // Smaller rank is better. (ex: 10 -> 8 means ↑2)
  if (prevRank > rank) {
    return { label: `↑${prevRank - rank}`, className: "text-red-500" };
  }
  return { label: `↓${rank - prevRank}`, className: "text-blue-500" };
}

function renderTypeLabel(typeLabel: string) {
  const hotMatch = typeLabel.match(/^HOT100\s+(100일|30일)$/);
  if (hotMatch) {
    const day = hotMatch[1];
    return (
      <span>
        HOT100 <span className="text-[10px] font-semibold text-neutral-400">({day})</span>
      </span>
    );
  }

  return <span>{typeLabel}</span>;
}

function ProviderIcon({ provider, label }: { provider: ProviderKey; label: string }) {
  return (
    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm border border-foreground/10">
      <MusicServiceIcon service={provider} label={label} size={18} className="h-[18px] w-[18px]" />
    </span>
  );
}

function ClockIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className="text-neutral-400"
    >
      <path
        d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M12 6v6l4 2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChartSummaryGrid({
  trackTitle,
  charts,
}: {
  trackTitle: string;
  charts: ChartsData;
}) {
  const safeTitle = trackTitle?.trim().length ? trackTitle.trim() : "노래제목";
  const updated = formatKstTimestamp(charts.lastUpdated);

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">
            <span className="font-bold">{safeTitle}</span>의 실시간 차트
          </h2>
          <div className="mt-1 flex items-center gap-2 text-xs text-neutral-400">
            <ClockIcon />
            <span className="tabular-nums">{updated}</span>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {CARDS.map((card) => {
          const item = findItem(charts.items, card.matchLabels);
          const rankText = getRankText(item);
          const change = getChange(item?.rank, item?.prevRank);

          return (
            <div
              key={card.id}
              className={cn(
                "rounded-2xl border border-foreground/10 bg-white px-5 py-4 shadow-sm",
                "transition-colors hover:border-sky-300"
              )}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <ProviderIcon provider={card.provider} label={card.providerLabel} />
                  <div className="min-w-0">
                    <p className="text-sm font-bold leading-none truncate">{card.providerLabel}</p>
                    <p className="mt-1 text-xs text-neutral-500 leading-none truncate">
                      {renderTypeLabel(card.typeLabel)}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xl font-extrabold tabular-nums leading-none">
                    {rankText.suffix ? (
                      <>
                        {rankText.primary}
                        <span className="ml-1 text-sm font-bold">{rankText.suffix}</span>
                      </>
                    ) : (
                      <span className="text-sm font-semibold text-neutral-500">
                        {rankText.primary}
                      </span>
                    )}
                  </p>
                  <p className={cn("mt-1 text-xs font-semibold tabular-nums", change.className)}>
                    {change.label}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
