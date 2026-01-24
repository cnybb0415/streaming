"use client";

import { VoteTabsWithSidebar } from "@/components/GuideTabs";
import { voteAppLinks } from "@/data/guides";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

type Platform = "ios" | "android" | "other";

function detectPlatform(): Platform {
  const ua = navigator.userAgent ?? "";
  if (/Android/i.test(ua)) return "android";
  if (/iPhone|iPad|iPod/i.test(ua)) return "ios";
  return "other";
}

function resolveVoteHref(
  action: { href?: string; iosHref?: string; androidHref?: string; webHref?: string },
  platform: Platform
) {
  if (platform === "android" && action.androidHref) return action.androidHref;
  if (platform === "ios" && action.iosHref) return action.iosHref;
  return action.webHref ?? action.href;
}

export default function PrevotePage() {
  const [platform, setPlatform] = useState<Platform>("other");

  useEffect(() => {
    setPlatform(detectPlatform());
  }, []);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="text-2xl font-bold">음악방송 사전투표</h1>

      <Card className="mt-2">
        <CardContent className="pt-3">
          <div className="grid gap-1.5 grid-cols-3 lg:grid-cols-3">
            {voteAppLinks.map((link) => (
              <div key={link.id} className="rounded-md border border-foreground/10 bg-white p-1">
                <div className="flex items-center gap-1">
                  {link.logoSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={link.logoSrc} alt={link.label} className="h-3 w-auto" />
                  ) : null}
                  <span className="text-[10px] font-semibold text-foreground">{link.label}</span>
                </div>
                <div className="mt-1 grid grid-cols-2 gap-1">
                  {link.actions.map((action) => {
                    const resolvedHref = resolveVoteHref(action, platform);
                    const hasHref = Boolean(resolvedHref);
                    const className =
                      "inline-flex h-6 items-center justify-center gap-1 whitespace-nowrap rounded-md border border-foreground/15 bg-white px-1.5 text-[10px] font-medium text-foreground shadow-sm transition-[background-color,border-color,box-shadow,color,transform] hover:border-foreground/35 hover:shadow-md" +
                      (hasHref ? "" : " pointer-events-none opacity-50");

                    const content = <span>{action.label}</span>;

                    return hasHref ? (
                      <a
                        key={`${link.id}-${action.id}`}
                        href={resolvedHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={className}
                      >
                        {content}
                      </a>
                    ) : (
                      <span key={`${link.id}-${action.id}`} className={className}>
                        {content}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="mt-6">
        <VoteTabsWithSidebar />
      </div>
    </main>
  );
}
