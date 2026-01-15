"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

export type StreamingLink = {
  label: string;
  pcHref: string;
  mobileHref: string;
};

function detectMobile(): boolean {
  // Prefer UA-CH when available
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navAny = navigator as any;
  const uaDataMobile: boolean | undefined = navAny?.userAgentData?.mobile;
  if (typeof uaDataMobile === "boolean") return uaDataMobile;

  const ua = navigator.userAgent ?? "";
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobi/i.test(ua);
}

export function StreamingLinksGrid({
  links,
  youtubeUrl,
  columnsClassName = "grid-cols-2 gap-2 sm:grid-cols-3",
  buttonVariant = "secondary",
}: {
  links: ReadonlyArray<StreamingLink>;
  youtubeUrl?: string;
  columnsClassName?: string;
  buttonVariant?: "secondary" | "outline" | "default" | "ghost" | "link";
}) {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    setIsMobile(detectMobile());
  }, []);

  const normalizedYoutubeUrl = youtubeUrl?.trim();
  const effectiveLinks = React.useMemo(() => {
    if (!normalizedYoutubeUrl) return links;
    return [
      ...links,
      { label: "유튜브", pcHref: normalizedYoutubeUrl, mobileHref: normalizedYoutubeUrl },
    ];
  }, [links, normalizedYoutubeUrl]);

  return (
    <div className={`grid ${columnsClassName}`}>
      {effectiveLinks.map((linkItem) => {
        const href = isMobile ? linkItem.mobileHref : linkItem.pcHref;
        return (
          <a
            key={linkItem.label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
          >
            <Button variant={buttonVariant} className="w-full">
              {linkItem.label}
            </Button>
          </a>
        );
      })}
    </div>
  );
}
