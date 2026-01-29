import Link from "next/link";
import { FanchantSongGrid } from "@/components/FanchantSongGrid";

export default function CheerPage() {
  return (
    <div className="min-h-screen bg-transparent text-foreground">
      <main className="mx-auto w-full max-w-6xl px-3 py-10 sm:px-6 sm:py-14">
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold">응원법</h1>
            <p className="mt-2 text-sm text-foreground/80">
              곡별 응원법 가이드를 확인하세요.
            </p>
          </div>

          <Link
            href="/tour"
            className="inline-flex items-center justify-center rounded-2xl border border-foreground/15 bg-white px-4 py-2 text-sm font-semibold text-foreground shadow-sm transition hover:border-foreground/35 hover:shadow-md"
          >
            투어일정 보기
          </Link>
        </div>

        <div className="mt-6">
          <FanchantSongGrid />
        </div>
      </main>
    </div>
  );
}
