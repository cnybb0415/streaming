"use client";

import * as React from "react";
import { formatCompactNumber } from "@/lib/format";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

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

export function YouTubeStatsCards({
  variant = "cards",
}: {
  variant?: "cards" | "inline";
}) {
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

  const ready = state.status === "ready";
  const errored = state.status === "error";

  if (variant === "inline") {
    return (
      <div className="flex items-center justify-between gap-6 border-t border-foreground/10 px-1 pt-3 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-foreground/60">조회수</span>
          <span className="font-semibold">
            {ready ? (
              formatCompactNumber(state.data.viewCount)
            ) : errored ? (
              "불러오기 실패"
            ) : (
              <Skeleton className="h-5 w-16" />
            )}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-foreground/60">좋아요</span>
          <span className="font-semibold">
            {ready ? (
              formatCompactNumber(state.data.likeCount)
            ) : errored ? (
              "불러오기 실패"
            ) : (
              <Skeleton className="h-5 w-16" />
            )}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-5 grid gap-3 sm:grid-cols-2">
      <Card>
        <CardContent className="p-4">
          <div className="text-sm text-foreground">조회수</div>
          <div className="mt-1 text-xl font-semibold">
            {ready ? (
              formatCompactNumber(state.data.viewCount)
            ) : errored ? (
              "불러오기 실패"
            ) : (
              <Skeleton className="mt-1 h-7 w-28" />
            )}
          </div>
          {errored && (
            <div className="mt-2 text-xs text-foreground">{state.message}</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="text-sm text-foreground">좋아요</div>
          <div className="mt-1 text-xl font-semibold">
            {ready ? (
              formatCompactNumber(state.data.likeCount)
            ) : errored ? (
              "불러오기 실패"
            ) : (
              <Skeleton className="mt-1 h-7 w-24" />
            )}
          </div>
          {errored && (
            <div className="mt-2 text-xs text-foreground">{state.message}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
