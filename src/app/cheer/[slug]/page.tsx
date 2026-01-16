import Link from "next/link";
import { notFound } from "next/navigation";
import { getCheeringGuideSong } from "@/data/guides";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function CheerDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const song = getCheeringGuideSong(slug);
  if (!song) notFound();

  const hasAssets = song.assets.length > 0;

  return (
    <div className="min-h-screen bg-transparent text-foreground">
      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs text-foreground/70">응원법</div>
            <h1 className="mt-1 text-2xl font-bold">{song.label}</h1>
            {song.artist ? (
              <p className="mt-1 text-sm text-foreground/80">{song.artist}</p>
            ) : null}
          </div>
          <Link href="/cheer">
            <Button variant="outline">목록</Button>
          </Link>
        </div>

        <div className="mt-6">
          <Card>
            <CardContent className="space-y-3">
              {hasAssets ? (
                song.assets.map((asset, idx) => {
                  if (asset.type === "pdf") {
                    return (
                      <a
                        key={`pdf-${idx}`}
                        href={asset.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <Button variant="secondary" className="w-full justify-between">
                          <span>{asset.label ?? "PDF 열기"}</span>
                          <span className="text-xs text-foreground/70">새 탭</span>
                        </Button>
                      </a>
                    );
                  }

                  return (
                    <div
                      key={`img-${idx}`}
                      className="overflow-hidden rounded-2xl border border-foreground/10 bg-white"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={asset.src}
                        alt={asset.alt ?? `${song.label} 응원법 이미지 ${idx + 1}`}
                        className="h-auto w-full"
                        loading="lazy"
                      />
                    </div>
                  );
                })
              ) : (
                <div className="rounded-xl border border-foreground/10 bg-white p-3 text-sm text-foreground/80 shadow-sm">
                  아직 업로드된 응원법 이미지가 없어요.
                  <div className="mt-2 text-xs text-foreground/70">
                    public/images/cheering/{slug}/guide/ 아래에 이미지를 넣고,
                    src/data/guides.ts 의 assets에 경로를 추가해 주세요.
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
