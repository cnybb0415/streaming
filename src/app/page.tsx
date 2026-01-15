import { siteConfig } from "@/config/site";
import { getChartsData } from "@/lib/charts";
import { YouTubeStatsCards } from "@/components/YouTubeStatsCards";
import { QuickActionsBar } from "@/components/QuickActionsBar";
import { StreamingLinksGrid } from "@/components/StreamingLinksGrid";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function getStatusMeta(status: string): {
  variant: "default" | "success" | "danger";
  icon: string;
} {
  const s = status.trim();
  if (
    s.includes("없") ||
    s.includes("실패") ||
    s.includes("오류") ||
    s.includes("미진입") ||
    s === "❌"
  ) {
    return { variant: "danger", icon: "❌" };
  }
  if (s === "UP" || s.includes("상승")) return { variant: "success", icon: "▲" };
  if (s === "DOWN" || s.includes("하락")) return { variant: "danger", icon: "▼" };
  if (s === "NEW" || s.includes("진입") || s.includes("성공")) {
    return { variant: "success", icon: "NEW" };
  }
  if (s === "-" || s.includes("유지") || s.includes("동결")) {
    return { variant: "default", icon: "-" };
  }
  return { variant: "default", icon: "•" };
}

function toChartTokenFromLegacyStatus(status: string): string {
  const s = status.trim();
  if (s.length === 0) return "❌";
  if (s.includes("미진입") || s.includes("없") || s.includes("실패") || s.includes("오류")) {
    return "❌";
  }
  if (s.includes("진입") || s.includes("성공")) return "NEW";
  if (s.includes("상승")) return "UP";
  if (s.includes("하락")) return "DOWN";
  if (s.includes("유지") || s.includes("동결")) return "-";
  return "•";
}

function formatChartDisplay(item: {
  status?: string;
  rank?: number;
  prevRank?: number;
}): { badgeText: string; detailText: string } {
  const status = (item.status ?? "").trim();

  if (typeof item.rank !== "number") {
    const fallback = status.length > 0 ? status : "차트 데이터가 없습니다";
    return { badgeText: toChartTokenFromLegacyStatus(fallback), detailText: fallback };
  }

  const rankText = `#${item.rank}`;
  // Some providers (ex: Melon) may not provide change info; treat as “-” (frozen/unknown)
  // rather than “NEW”.
  if (typeof item.prevRank !== "number" || item.prevRank === item.rank) {
    return { badgeText: "-", detailText: `${rankText} · -` };
  }

  if (item.prevRank > item.rank) {
    const diff = item.prevRank - item.rank;
    return { badgeText: "UP", detailText: `${rankText} · UP (+${diff})` };
  }

  const diff = item.rank - item.prevRank;
  return { badgeText: "DOWN", detailText: `${rankText} · DOWN (-${diff})` };
}

export default async function Home() {
  const charts = await getChartsData();

  return (
    <div className="min-h-screen bg-transparent text-foreground">
      <div>
        <main className="relative mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
          <header className="space-y-4">
            {siteConfig.assets.heroBanners.length > 0 && (
              <div className="grid gap-3 sm:grid-cols-2">
                {siteConfig.assets.heroBanners.slice(0, 2).map((banner) => (
                  <a
                    key={banner.href}
                    href={banner.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <Card className="overflow-hidden">
                      <div className="aspect-[16/6] w-full bg-[var(--surface-90)]">
                        {banner.src ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={banner.src}
                            alt={banner.alt}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.01]"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-foreground/50">
                            배너 이미지 자리 (16:6)
                          </div>
                        )}
                      </div>
                    </Card>
                  </a>
                ))}
              </div>
            )}
          </header>

          <section className="mt-6">
            <QuickActionsBar
              actions={siteConfig.actions}
              albumLinks={siteConfig.albumPurchaseLinks}
            />
          </section>

          <div className="mt-8 space-y-6">
            <Card>
              <CardContent className="p-5">
                <div className="overflow-hidden rounded-xl border border-foreground/10 bg-[var(--surface-90)] backdrop-blur">
                  <div className="aspect-video w-full">
                    <iframe
                      className="h-full w-full"
                      src={siteConfig.youtube.embedUrl}
                      title="YouTube video player"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <YouTubeStatsCards />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>음원사이트 바로가기</CardTitle>              
              </CardHeader>
              <CardContent className="pt-4">
                <StreamingLinksGrid
                  links={siteConfig.streamingLinks}
                  youtubeUrl={siteConfig.youtube.url}
                  columnsClassName="grid-cols-2 gap-2"
                  buttonVariant="secondary"
                />
              </CardContent>
            </Card>
          </div>

          <section className="mt-8">
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-base font-semibold">실시간 차트 현황</h2>
            </div>

            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {charts.items.map((item) => {
                const display = formatChartDisplay(item);
                const meta = getStatusMeta(display.badgeText);
                return (
                  <Card key={item.label}>
                    <CardContent className="flex items-center justify-between gap-3 p-4">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">{item.label}</div>
                        <div className="truncate text-xs text-foreground">{display.detailText}</div>
                      </div>
                      <Badge variant={meta.variant}>
                        {meta.icon} {display.badgeText}
                      </Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          <footer className="mt-10">
            <Separator className="mb-6" />
            <div className="flex flex-col gap-2 text-sm text-foreground sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                <a
                  href={siteConfig.contacts.twitterUrl}
                  className="underline underline-offset-4 hover:text-foreground"
                >
                  스트리밍팀 트위터
                </a>
                <a
                  href={`mailto:${siteConfig.contacts.devEmail}`}
                  className="underline underline-offset-4 hover:text-foreground"
                >
                  개발 문의
                </a>
                <a
                  href={`mailto:${siteConfig.contacts.teamEmail}`}
                  className="underline underline-offset-4 hover:text-foreground"
                >
                  팀 이메일
                </a>
              </div>
              <div>Copyright © {new Date().getFullYear()} All rights reserved.</div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
