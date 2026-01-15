"use client";

import * as React from "react";
import { formatCompactNumber } from "@/lib/format";

type YouTubeStats = {
  viewCount: number;
  likeCount: number;
  fetchedAt: string;
};

type YouTubeError = {
  error?: string;
  googleMessage?: string;
  googleReason?: string;
  upstreamStatus?: number;
};

type State =
  | { status: "idle" | "loading" }
  | { status: "ready"; data: YouTubeStats }
  | { status: "error"; message: string };

async function fetchYouTubeStats(signal?: AbortSignal): Promise<YouTubeStats> {
  const response = await fetch("/api/youtube", { signal });
  const json = (await response.json()) as unknown;

  if (!response.ok) {
    const err = json as YouTubeError;
    const message =
      typeof err.googleReason === "string"
        ? `${err.googleReason}${typeof err.googleMessage === "string" ? `: ${err.googleMessage}` : ""}`
        : typeof err.googleMessage === "string"
          ? err.googleMessage
          : typeof err.error === "string"
            ? err.error
            : "Failed";
    throw new Error(message);
  }

  const data = json as Partial<YouTubeStats>;
  return {
    viewCount: Number(data.viewCount ?? 0),
    likeCount: Number(data.likeCount ?? 0),
    fetchedAt: typeof data.fetchedAt === "string" ? data.fetchedAt : "",
  };
}

export function YouTubeStatsCards() {
  const [state, setState] = React.useState<State>({ status: "idle" });

  React.useEffect(() => {
    const controller = new AbortController();

    setState({ status: "loading" });
    fetchYouTubeStats(controller.signal)
      .then((data) => setState({ status: "ready", data }))
      .catch((e: unknown) => {
        const message = e instanceof Error ? e.message : "Failed to load";
        setState({ status: "error", message });
      });

    return () => controller.abort();
  }, []);

  const viewText =
    state.status === "ready"
      ? formatCompactNumber(state.data.viewCount)
      : state.status === "error"
        ? "불러오기 실패"
        : "불러오는 중…";

  const likeText =
    state.status === "ready"
      ? formatCompactNumber(state.data.likeCount)
      : state.status === "error"
        ? "불러오기 실패"
        : "불러오는 중…";

  return (
    <div className="mt-5 grid gap-3 sm:grid-cols-2">
      <div className="rounded-xl bg-foreground/5 p-4">
        <div className="text-sm text-foreground/70">YouTube 조회수</div>
        <div className="mt-1 text-xl font-semibold">{viewText}</div>
        {state.status === "error" && (
          <div className="mt-2 text-xs text-foreground/70">{state.message}</div>
        )}
      </div>
      <div className="rounded-xl bg-foreground/5 p-4">
        <div className="text-sm text-foreground/70">YouTube 좋아요</div>
        <div className="mt-1 text-xl font-semibold">{likeText}</div>
        {state.status === "error" && (
          <div className="mt-2 text-xs text-foreground/70">{state.message}</div>
        )}
      </div>
    </div>
  );
}
