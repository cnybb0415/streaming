import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import logoPng from "@/../public/images/logo.png";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-foreground/10 bg-white shadow-sm">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center">
          <Image
            src={logoPng}
            alt={`${siteConfig.artistName} 스트리밍`}
            width={220}
            height={56}
            priority
            className="h-9 w-auto"
          />
          <span className="sr-only">{siteConfig.artistName} 스트리밍</span>
        </Link>

        <nav className="flex items-center gap-1">
          <Link href="/">
            <Button size="sm" variant="ghost">
              메인
            </Button>
          </Link>
          <Link href={siteConfig.links.guideUrl}>
            <Button size="sm" variant="ghost">
              가이드
            </Button>
          </Link>
          <Link href={siteConfig.links.voteUrl}>
            <Button size="sm" variant="ghost">
              투표
            </Button>
          </Link>
          <Link href={siteConfig.links.streamingUrl}>
            <Button size="sm" variant="ghost">
              스트리밍
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
