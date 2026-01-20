"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { openSms } from "@/lib/sms";

type ScheduleItem = { name: string; src: string };

const SMS_BODY = "엑소의 Crown 신청합니다!";

const STATIONS = [
  { name: "SBS 파워FM", to: "#1077" },
  { name: "SBS 러브FM", to: "#1035" },
  { name: "KBS COOL FM", to: "#8910" },
  { name: "MBC FM4U", to: "#8000" },
  { name: "MBC 표준FM", to: "#8001" },
] as const;

export default function RadioPage() {
  const fileNames = [
    "01.라디오 신청 가이드.png",
    "02.KBS.png",
    "03.MBC.png",
    "04.SBS.png",
  ].sort((a, b) => a.localeCompare(b, "ko", { numeric: true }));
  const items: ScheduleItem[] = fileNames.map((name) => ({
    name,
    src: `/images/radio/schedule/${encodeURIComponent(name)}`,
  }));

  return (
    <div className="min-h-screen bg-transparent text-foreground">
      <main className="mx-auto w-full max-w-6xl px-3 py-10 sm:px-6 sm:py-14">
        <h1 className="text-xl font-semibold">라디오 신청하기</h1>

        <Card className="mt-6 rounded-2xl">
          <CardContent className="p-4">
            <div className="text-sm font-semibold">원클릭 문자신청</div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {STATIONS.map((s) => (
                <Button
                  key={s.to}
                  type="button"
                  variant="secondary"
                  className="h-14 w-full justify-start rounded-2xl border border-foreground/15 bg-white px-4 text-left shadow-sm hover:bg-foreground/5"
                  onClick={() => openSms({ to: s.to, body: SMS_BODY })}
                >
                  {s.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6 rounded-2xl">
          <CardContent className="p-4">
            <div className="text-sm font-semibold">라디오 스케줄</div>

            {items.length === 0 ? (
              <div className="mt-3 rounded-xl border border-foreground/10 bg-white p-3 text-sm text-foreground/70">
                스케줄 이미지 준비중
              </div>
            ) : (
              <div className="mt-3 grid gap-3">
                {items.map((it) => (
                  <div key={it.src} className="overflow-hidden rounded-xl border border-foreground/10 bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={it.src} alt={it.name} className="h-auto w-full" loading="lazy" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
