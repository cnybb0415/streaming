import { StreamingMenu } from "@/app/streaming/StreamingMenu";

export default function StreamingPage() {
  return (
    <div className="min-h-screen bg-transparent text-foreground">
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <h1 className="text-xl font-semibold">스트리밍</h1>

        <StreamingMenu />
      </main>
    </div>
  );
}
