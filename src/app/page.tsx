import { siteConfig } from "@/config/site";
import { getChartsData } from "@/lib/charts";
import { formatIsoDate } from "@/lib/format";
import { YouTubeStatsCards } from "@/components/YouTubeStatsCards";

export default async function Home() {
  const charts = await getChartsData();
  const lastUpdated = formatIsoDate(charts.lastUpdated);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <header className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {siteConfig.artistName} 스트리밍
              </h1>
              <p className="text-sm text-foreground/70">{siteConfig.description}</p>
            </div>
            <div className="text-right text-xs text-foreground/60">
              <div>Last Update</div>
              <div className="font-medium text-foreground/80">
                {lastUpdated}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {siteConfig.actions.map((action) => (
              <a
                key={action.label}
                href={action.href}
                target={action.href.startsWith("http") ? "_blank" : undefined}
                rel={action.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="inline-flex h-10 items-center justify-center rounded-full border border-foreground/15 px-4 text-sm font-medium transition-colors hover:bg-foreground/5"
              >
                {action.label}
              </a>
            ))}
          </div>
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="sm:col-span-2 rounded-2xl border border-foreground/10 p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="text-sm text-foreground/70">현재 스트리밍 곡</div>
                <div className="text-lg font-semibold tracking-tight">
                  {siteConfig.trackTitle || "(곡 제목 설정 필요)"}
                </div>
                <div className="text-sm text-foreground/70">{siteConfig.artistName}</div>
              </div>
              <div className="text-right text-sm text-foreground/70">
                <div>발매일</div>
                <div className="font-medium text-foreground/80">
                  {siteConfig.releaseDate || "(발매일 설정 필요)"}
                </div>
              </div>
            </div>

            <YouTubeStatsCards />

            <div className="mt-5 overflow-hidden rounded-xl border border-foreground/10 bg-foreground/5">
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
          </div>

          <div className="rounded-2xl border border-foreground/10 p-5">
            <div className="text-sm font-semibold">음원사이트 바로가기</div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {siteConfig.streamingLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 items-center justify-center rounded-xl border border-foreground/15 text-sm transition-colors hover:bg-foreground/5"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-base font-semibold">실시간 차트 현황</h2>
            <a
              href="#"
              className="text-sm text-foreground/70 underline underline-offset-4 hover:text-foreground"
            >
              투표/이벤트 링크 (옵션)
            </a>
          </div>

          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {charts.items.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-xl border border-foreground/10 px-4 py-3"
              >
                <div className="text-sm font-medium">{item.label}</div>
                <div className="text-sm text-foreground/70">{item.status} ❌</div>
              </div>
            ))}
          </div>
        </section>

        <footer className="mt-10 border-t border-foreground/10 pt-6 text-sm text-foreground/70">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              <a
                href={siteConfig.contacts.twitterUrl}
                className="underline underline-offset-4 hover:text-foreground"
              >
                팀 트위터
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
  );
}
