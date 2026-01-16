import Link from "next/link";
import { cheeringGuideSongs } from "@/data/guides";
import { Card, CardContent } from "@/components/ui/card";

function getSongCoverSrc(song: (typeof cheeringGuideSongs)[number]) {
  if (song.coverImageSrc) return song.coverImageSrc;

  const firstImage = song.assets.find((a) => a.type === "image");
  return firstImage?.type === "image" ? firstImage.src : null;
}

export function FanchantSongGrid({
  variant = "grid",
  hrefBase = "/cheer",
}: {
  variant?: "grid" | "list";
  hrefBase?: string;
}) {
  const gridClassName =
    variant === "list" ? "grid gap-3" : "grid gap-3 sm:grid-cols-2";

  return (
    <div className={gridClassName}>
      {cheeringGuideSongs.map((song) => {
        const cover = getSongCoverSrc(song);

        return (
          <Link key={song.id} href={`${hrefBase}/${song.id}`} className="block">
            <Card className="group overflow-hidden transition hover:border-foreground/25">
              <CardContent className="p-0">
                <div className="grid grid-cols-[96px_minmax(0,1fr)] gap-4 p-4">
                  <div className="overflow-hidden rounded-xl border border-foreground/10 bg-white">
                    {cover ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={cover}
                        alt={`${song.label} 커버`}
                        className="h-24 w-24 object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-24 w-24 bg-gradient-to-br from-foreground/5 to-foreground/10" />
                    )}
                  </div>

                  <div className="min-w-0">

                    <div className="mt-1 truncate text-base font-semibold">
                      {song.label}
                    </div>
                    {song.artist ? (
                      <div className="mt-1 truncate text-sm text-foreground/80">
                        {song.artist}
                      </div>
                    ) : null}
                    <div className="mt-3 text-sm text-foreground/70">
                      응원법 보러가기 →
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
