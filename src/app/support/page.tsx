"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useRef, useState } from "react";

type SupportTile = {
  id: string;
  label: string;
  description: string;
  noticeSrc: string;
  icon: "gift" | "money";
  iconBgClassName: string;
};

const tiles: SupportTile[] = [
  {
    id: "team",
    label: "서포트 팀원 지원",
    description: "",
    noticeSrc: "/images/support/team/신규%20팀원%20모집.png",
    icon: "gift",
    iconBgClassName: "bg-yellow-100",
  },
  {
    id: "fund",
    label: "모금 공지",
    description: "",
    noticeSrc: "/images/support/fund/모금공지.png",
    icon: "money",
    iconBgClassName: "bg-lime-100",
  },
];

function GiftIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 text-foreground/80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M22 7H2v5h20V7Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M12 7v15"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M12 7c-1.5 0-3.5-.5-3.5-2.2C8.5 3.3 9.7 2 11.4 2c1.2 0 2.2.8 2.6 1.9C14.4 2.8 15.4 2 16.6 2c1.7 0 2.9 1.3 2.9 2.8C19.5 6.5 17.5 7 16 7H12Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MoneyIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 text-foreground/80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 7.5h16a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M6 10c1.2 0 2-.8 2-2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M18 10c-1.2 0-2-.8-2-2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M6 16c1.2 0 2 .8 2 2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M18 16c-1.2 0-2 .8-2 2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M12 15.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M4.5 5.5h15"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}

function TileIcon({ icon, label, bgClassName }: { icon: SupportTile["icon"]; label: string; bgClassName: string }) {
  return (
    <div className={`grid h-10 w-10 place-items-center rounded-xl ${bgClassName}`} aria-hidden>
      {icon === "gift" ? <GiftIcon /> : <MoneyIcon />}
      <span className="sr-only">{label}</span>
    </div>
  );
}

function SupportActionTile({ tile, isActive, onClick }: { tile: SupportTile; isActive: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={
        "flex w-full items-center gap-3 rounded-2xl border border-foreground/15 bg-white px-4 py-4 text-left shadow-sm transition hover:border-foreground/35 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/25 " +
        (isActive ? "border-foreground/35" : "")
      }
    >
      <TileIcon icon={tile.icon} label={tile.label} bgClassName={tile.iconBgClassName} />
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold">{tile.label}</div>
        <div className="truncate text-xs text-foreground/70">{tile.description}</div>
      </div>
    </button>
  );
}

export default function SupportPage() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const noticeRef = useRef<HTMLDivElement | null>(null);

  const activeTile = useMemo(() => tiles.find((t) => t.id === activeId) ?? null, [activeId]);

  useEffect(() => {
    if (!activeTile) return;
    noticeRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [activeTile]);

  return (
    <div className="min-h-screen bg-transparent text-foreground">
      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <h1 className="text-xl font-semibold">서포트</h1>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>서포트</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {tiles.map((tile) => (
                <SupportActionTile
                  key={tile.id}
                  tile={tile}
                  isActive={tile.id === activeId}
                  onClick={() => setActiveId((prev) => (prev === tile.id ? null : tile.id))}
                />
              ))}
            </div>

            {activeTile ? (
              <div ref={noticeRef} className="mt-4 rounded-2xl border border-foreground/15 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{activeTile.label}</div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setActiveId(null)}>
                    닫기
                  </Button>
                </div>

                <div className="mt-3 overflow-hidden rounded-xl border border-foreground/15 bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activeTile.noticeSrc}
                    alt={`${activeTile.label} 공지`}
                    className="h-auto w-full"
                    loading="lazy"
                  />
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
