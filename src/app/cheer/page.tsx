import { FanchantSongGrid } from "@/components/FanchantSongGrid";

export default function CheerPage() {
  return (
    <div className="min-h-screen bg-transparent text-foreground">
      <main className="mx-auto w-full max-w-6xl px-3 py-10 sm:px-6 sm:py-14">
        <h1 className="text-2xl font-bold">응원법</h1>
        <p className="mt-2 text-sm text-foreground/80">
          곡별 응원법 가이드를 확인하세요.
        </p>

        <div className="mt-6">
          <FanchantSongGrid />
        </div>
      </main>
    </div>
  );
}
