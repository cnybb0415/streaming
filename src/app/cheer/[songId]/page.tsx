import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCheeringSongById } from "@/lib/cheering";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function CheerDetailPage({
  params,
}: {
  params: Promise<{ songId: string }>;
}) {
  const { songId } = await params;
  const song = await getCheeringSongById(songId);
  if (!song) notFound();

  const hasAssets = song.guideAssets.length > 0;

  return (
    <div className="min-h-screen bg-transparent text-foreground">
      <main className="mx-auto w-full max-w-6xl px-3 py-10 sm:px-6 sm:py-14">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs text-foreground/70">응원법</div>
            <h1 className="mt-1 text-2xl font-bold">{song.label}</h1>
          </div>
          <Link href="/cheer">
            <Button variant="outline">목록</Button>
          </Link>
        </div>

        <div className="mt-6">
          <Card>
            <CardContent className="space-y-3">
              {hasAssets ? (
                song.guideAssets.map((asset, idx) => (
                  <div
                    key={`img-${idx}`}
                    className="overflow-hidden rounded-2xl border border-foreground/10 bg-white"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={asset.src}
                      alt={asset.alt ?? `${song.label} 이미지 ${idx + 1}`}
                      className="h-auto w-full"
                      loading="lazy"
                    />
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-foreground/10 bg-white p-4 text-sm text-foreground/70">
                  준비중
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
