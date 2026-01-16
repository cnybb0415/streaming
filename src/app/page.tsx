import { siteConfig } from "@/config/site";
import { getChartsData } from "@/lib/charts";
import { YouTubeStatsCards } from "@/components/YouTubeStatsCards";
import { QuickActionsBar } from "@/components/QuickActionsBar";
import Image from "next/image";
import type { ReactNode } from "react";

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

function SocialIcon({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-foreground/15 bg-white shadow-sm">
      {children}
    </span>
  );
}

function InstagramIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M17.5 6.6h.01"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M21.6 7.2a2.6 2.6 0 0 0-1.8-1.9C18.2 5 12 5 12 5s-6.2 0-7.8.3A2.6 2.6 0 0 0 2.4 7.2 27 27 0 0 0 2 12c0 1.6.2 3.2.4 4.8a2.6 2.6 0 0 0 1.8 1.9C5.8 19 12 19 12 19s6.2 0 7.8-.3a2.6 2.6 0 0 0 1.8-1.9c.2-1.6.4-3.2.4-4.8s-.2-3.2-.4-4.8Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path d="M10 15V9l5 3-5 3Z" fill="currentColor" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M7 3h4.3l3.2 4.3L18.7 3H22l-5.6 7.1L22 21h-4.3l-3.7-5-3.9 5H2l6.6-8.3L3 3h4.3l3.5 4.7L14.3 3"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function providerDot(label: string) {
  const text = label.trim();
  const color =
    text.includes("멜론")
      ? "bg-emerald-500"
      : text.includes("지니")
        ? "bg-sky-500"
        : text.includes("벅스")
          ? "bg-rose-500"
          : text.includes("바이브")
            ? "bg-fuchsia-500"
            : text.includes("플로")
              ? "bg-indigo-500"
              : "bg-zinc-400";
  return <span className={`h-2.5 w-2.5 rounded-full ${color}`} aria-hidden />;
}

export default async function Home() {
  const charts = await getChartsData();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <section className="grid gap-10 lg:grid-cols-2 lg:items-start">
          {/* Left: video (replaces photo) */}
          <div className="overflow-hidden rounded-2xl border border-foreground/10 bg-white shadow-sm">
            <div className="flex h-9 items-center gap-2 bg-[#ff4b4b] px-3">
              <span className="h-2.5 w-2.5 rounded-full bg-white/90" aria-hidden />
              <span className="h-2.5 w-2.5 rounded-full bg-white/90" aria-hidden />
              <span className="h-2.5 w-2.5 rounded-full bg-white/90" aria-hidden />
            </div>
            <div className="aspect-video w-full bg-black">
              <iframe
                className="h-full w-full"
                src={siteConfig.youtube.embedUrl}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
            <div className="px-4 pb-4">
              <YouTubeStatsCards variant="inline" />
            </div>
          </div>

          {/* Right: logo + actions */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <Image
              src="/images/logo.png"
              alt={siteConfig.title}
              width={520}
              height={150}
              priority
              className="h-auto w-[min(460px,100%)]"
            />
            <div className="mt-2 text-[11px] tracking-[0.35em] text-foreground/60">
              {siteConfig.tagline}
            </div>

            <div className="mt-8 w-full max-w-md">
              <QuickActionsBar
                actions={siteConfig.actions}
                albumLinks={siteConfig.albumPurchaseLinks}
                containerVariant="none"
                gridClassName="grid-cols-2 gap-3"
                buttonVariant="outline"
                buttonSize="lg"
                buttonClassName="h-12 rounded-full border-foreground/20 bg-[var(--surface-90)] text-foreground shadow-sm hover:bg-[var(--surface-80)]"
              />
            </div>

            <div className="mt-7 flex items-center justify-center gap-5 lg:justify-start">
              <a
                href={siteConfig.contacts.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-foreground/80 hover:text-foreground"
              >
                <SocialIcon>
                  <InstagramIcon />
                </SocialIcon>
              </a>
              <a
                href={siteConfig.youtube.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="text-foreground/80 hover:text-foreground"
              >
                <SocialIcon>
                  <YouTubeIcon />
                </SocialIcon>
              </a>
              <a
                href={siteConfig.contacts.twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
                className="text-foreground/80 hover:text-foreground"
              >
                <SocialIcon>
                  <XIcon />
                </SocialIcon>
              </a>
            </div>
          </div>
        </section>

        <div className="mt-10 border-t border-foreground/10" />

        <section className="mt-8 rounded-2xl border border-foreground/10 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-sky-500/10 text-sky-700" aria-hidden>
              ▣
            </span>
            <h2 className="text-base font-semibold">실시간 차트 현황</h2>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {charts.items.map((item) => {
              const display = formatChartDisplay(item);
              const meta = getStatusMeta(display.badgeText);

              return (
                <div
                  key={item.label}
                  className="rounded-xl border border-foreground/10 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    {providerDot(item.label)}
                    <span className="truncate">{item.label}</span>
                  </div>

                  <div className="mt-4 flex items-center justify-center gap-2 text-sm text-foreground/70">
                    <span>{display.detailText}</span>
                    <span
                      className={
                        meta.variant === "danger"
                          ? "text-rose-600"
                          : meta.variant === "success"
                            ? "text-emerald-600"
                            : "text-foreground/50"
                      }
                      aria-hidden
                    >
                      {meta.icon}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
