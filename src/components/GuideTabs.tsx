"use client";

import * as React from "react";

import {
  streamingGuideServices,
  type GuideAsset,
  type StreamingGuideService,
  voteGuides,
  type VoteGuide,
} from "@/data/guides";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { MusicServiceIcon, resolveMusicServiceIdFromLabel } from "@/components/MusicServiceIcon";

function uniqueStrings(values: string[]) {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const v of values) {
    if (!v) continue;
    if (seen.has(v)) continue;
    seen.add(v);
    out.push(v);
  }
  return out;
}

function expandExtensionCandidates(url: string) {
  const m = url.match(/^(.*)\.(png|jpg|jpeg|webp)$/i);
  if (!m) return [url];
  const base = m[1];
  const original = m[2].toLowerCase();
  const order = ["png", "jpg", "jpeg", "webp"].filter((ext) => ext !== original);
  return [`${base}.${original}`, ...order.map((ext) => `${base}.${ext}`)];
}

function GuideImage({
  src,
  fallbackSrcs,
  alt,
  missingLines,
}: {
  src: string;
  fallbackSrcs?: string[];
  alt: string;
  missingLines: string[];
}) {
  const candidates = React.useMemo(() => {
    const raw = [src, ...(fallbackSrcs ?? [])];
    return uniqueStrings(raw.flatMap(expandExtensionCandidates));
  }, [src, fallbackSrcs]);

  const [index, setIndex] = React.useState(0);
  const current = candidates[index];

  if (!current) {
    return (
      <div className="rounded-2xl border border-foreground/10 bg-white p-4 text-sm text-foreground/80">
        <div className="font-semibold">가이드 이미지를 찾을 수 없어요.</div>
        <div className="mt-2 space-y-1 text-xs">
          {missingLines.map((line, idx) => (
            <div key={idx}>{line}</div>
          ))}
        </div>
      </div>
    );
  }

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={current}
      alt={alt}
      className="h-auto w-full"
      loading="lazy"
      onError={() => setIndex((prev) => prev + 1)}
    />
  );
}

function EmptyState({
  title,
  lines,
}: {
  title: string;
  lines: string[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-foreground/80">
          아직 업로드된 가이드가 없어요.
        </p>
        <div className="rounded-xl border border-foreground/10 bg-white p-3 text-xs text-foreground/80 shadow-sm">
          <div className="font-semibold">업로드 방법</div>
          <div className="mt-1 space-y-1">
            {lines.map((line, idx) => (
              <div key={idx}>{line}</div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Assets({
  title,
  idKey,
  assets,
  emptyLines,
  action,
}: {
  title: string;
  idKey: string;
  assets: GuideAsset[];
  emptyLines: string[];
  action?: React.ReactNode;
}) {
  if (!assets.length) return <EmptyState title={title} lines={emptyLines} />;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle>{title}</CardTitle>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {assets.map((asset, idx) => {
          if (asset.type === "pdf") {
            return (
              <a
                key={`${idKey}-pdf-${idx}`}
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
              key={`${idKey}-img-${idx}`}
              className="overflow-hidden rounded-2xl border border-foreground/10 bg-white"
            >
              <GuideImage
                src={asset.src}
                fallbackSrcs={asset.fallbackSrcs}
                alt={asset.alt ?? `${title} 이미지 ${idx + 1}`}
                missingLines={emptyLines}
              />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function StreamingServiceTabs({ service }: { service: StreamingGuideService }) {
  const defaultPart = service.parts[0]?.id ?? "streaming";
  const titleBase = `${service.label} 스트리밍 가이드`;

  return (
    <Tabs defaultValue={defaultPart}>
      <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-start">
        <div className="md:w-[220px] md:shrink-0 md:self-stretch">
          <Card>
            <CardContent className="pt-0">
              <TabsList
                aria-label={`${service.label} 항목`}
                className="flex flex-nowrap items-center gap-1 overflow-x-auto rounded-none border-0 bg-transparent p-0 pt-4 shadow-none md:flex-col md:items-stretch md:overflow-visible"
              >
                {service.parts.map((part) => (
                  <TabsTrigger
                    key={part.id}
                    value={part.id}
                    variant="sidebar"
                    className="w-auto whitespace-nowrap md:w-full"
                  >
                    {part.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </CardContent>
          </Card>
        </div>

        <div className="min-w-0 md:flex-1">
          {service.parts.map((part) => (
            <TabsContent key={part.id} value={part.id} className="mt-0">
              <Assets
                title={`${titleBase} · ${part.label}`}
                idKey={`streaming-${service.id}-${part.id}`}
                assets={part.assets}
                emptyLines={[
                  `1) 파일을 public/images/guides/${service.id}/${part.id === "signup" ? "idcreate" : part.id}/ 아래에 넣기`,
                  `2) src/data/guides.ts 에서 ${service.label} > ${part.label} assets에 경로 추가`,
                  `파일명 규칙: ${service.id}_${part.id === "signup" ? "idcreate" : part.id}.png (또는 .jpg)`,
                  `예시: /images/guides/${service.id}/${part.id === "signup" ? "idcreate" : part.id}/${service.id}_${part.id === "signup" ? "idcreate" : part.id}.png`,
                ]}
              />
            </TabsContent>
          ))}
        </div>
      </div>
    </Tabs>
  );
}

function StreamingTabs() {
  const services = streamingGuideServices;
  const defaultService = services[0]?.id ?? "";

  if (!services.length) {
    return (
      <EmptyState
        title="스트리밍 가이드"
        lines={["src/data/guides.ts 에 streamingGuideServices를 추가해 주세요."]}
      />
    );
  }

  return (
    <Tabs defaultValue={defaultService}>
      <div className="border-b border-foreground/10 pb-2">
        <TabsList
          aria-label="스트리밍 사이트"
          className="w-full flex-nowrap justify-start gap-6 overflow-x-auto rounded-none border-0 bg-transparent p-0 shadow-none"
        >
          {services.map((service) => (
            <TabsTrigger key={service.id} value={service.id} variant="underline">
              <span className="inline-flex items-center gap-2 whitespace-nowrap">
                {resolveMusicServiceIdFromLabel(service.label) ? (
                  <MusicServiceIcon label={service.label} size={16} className="h-4 w-4" />
                ) : null}
                <span>{service.label}</span>
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {services.map((service) => (
        <TabsContent key={service.id} value={service.id}>
          <StreamingServiceTabs service={service} />
        </TabsContent>
      ))}
    </Tabs>
  );
}

function VoteTabs() {
  const guides = voteGuides;
  const defaultGuide = guides[0]?.id ?? "";
  if (!guides.length) {
    return (
      <EmptyState
        title="사전투표 가이드"
        lines={["src/data/guides.ts 에 voteGuides를 추가해 주세요."]}
      />
    );
  }
  return (
    <Tabs defaultValue={defaultGuide}>
      <div className="border-b border-foreground/10 pb-2">
        <TabsList
          aria-label="사전투표 방송"
          className="w-full flex-nowrap justify-start gap-6 overflow-x-auto rounded-none border-0 bg-transparent p-0 shadow-none"
        >
          {guides.map((guide) => (
            <TabsTrigger key={guide.id} value={guide.id} variant="underline">
              <span className="inline-flex items-center gap-2 whitespace-nowrap leading-none">
                <span className="leading-none">{guide.label}</span>
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {guides.map((guide) => (
        <TabsContent key={guide.id} value={guide.id}>
          <Assets
            title={`사전투표 가이드 · ${guide.label}`}
            idKey={`vote-${guide.id}`}
            assets={guide.assets}
            emptyLines={[
              `1) 파일을 public/images/vote/${guide.label}/guide/ 아래에 넣기`,
              `2) src/data/guides.ts 에서 voteGuides > ${guide.label} assets에 경로 추가`,
              `파일명 예시: /images/vote/${guide.label}/guide/guide.png`,
            ]}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}



export function VoteTabsWithSidebar() {
  // 프로그램별 로고 경로 매핑
  const logoMap: Record<string, string> = {
    musicbank: "/images/vote/뮤직뱅크/logo/뮤직뱅크_logo.png",
    showchampion: "/images/vote/쇼챔피언/logo/쇼챔피언_logo.png",
    mcountdown: "/images/vote/엠카운트다운/logo/엠카운트다운_logo.png",
    musiccore: "/images/vote/음악중심/logo/음악중심_logo.png",
    inkigayo: "/images/vote/인기가요/logo/인기가요_logo.png",
  };
  const guides = voteGuides;
  const defaultGuide = guides[0]?.id ?? "";
  const inkigayoVoteHref = "https://app.linc.fan/31TL/01KF9VV0VVE7GNAN51SAWHRTT6";
  if (!guides.length) {
    return (
      <EmptyState
        title="사전투표 가이드"
        lines={["src/data/guides.ts 에 voteGuides를 추가해 주세요."]}
      />
    );
  }
  return (
    <Tabs defaultValue={defaultGuide}>
      <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-start">
        <div className="md:w-[220px] md:shrink-0 md:self-stretch">
          <Card>
            <CardContent className="pt-0">
              <TabsList
                aria-label="사전투표 프로그램"
                className="flex flex-nowrap items-center gap-1 overflow-x-auto rounded-none border-0 bg-transparent p-0 pt-4 shadow-none md:flex-col md:items-stretch md:overflow-visible"
              >
                {guides.map((guide) => (
                  <TabsTrigger
                    key={guide.id}
                    value={guide.id}
                    variant="sidebar"
                    className="w-auto whitespace-nowrap md:w-full"
                  >
                    {guide.id !== "common" ? (
                      <span className="inline-flex h-full items-center gap-2 leading-none">
                        <img
                          src={logoMap[guide.id]}
                          alt={guide.label + " 로고"}
                          className="h-5 w-5 shrink-0 block"
                        />
                        <span className="block leading-none">{guide.label}</span>
                      </span>
                    ) : (
                      <span className="inline-flex h-full items-center leading-none">{guide.label}</span>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>
            </CardContent>
          </Card>
        </div>
        <div className="min-w-0 md:flex-1">
          {guides.map((guide) => (
            <TabsContent key={guide.id} value={guide.id} className="mt-0">
              <Assets
                title={`사전투표 가이드 · ${guide.label}`}
                idKey={`vote-${guide.id}`}
                assets={guide.assets}
                emptyLines={[
                  `1) 파일을 public/images/vote/${guide.label}/guide/ 아래에 넣기`,
                  `2) src/data/guides.ts 에서 voteGuides > ${guide.label} assets에 경로 추가`,
                  `파일명 예시: /images/vote/${guide.label}/guide/guide.png`,
                ]}
              />
            </TabsContent>
          ))}
        </div>
      </div>
    </Tabs>
  );
}

export function GuideTabs() {
  // Move 뮤직비디오 to the end
  const streamingTabs = streamingGuideServices.map((service) => ({
    id: service.id,
    label: service.label,
    type: "streaming" as const,
    service,
  }));
  // Find 뮤직비디오 and move to end
  const mvIndex = streamingTabs.findIndex((t) => t.id === "mv");
  let orderedStreamingTabs = streamingTabs;
  if (mvIndex !== -1) {
    const [mvTab] = orderedStreamingTabs.splice(mvIndex, 1);
    orderedStreamingTabs = [...orderedStreamingTabs, mvTab];
  }
  const allTabs = orderedStreamingTabs;
  const defaultTab = allTabs[0]?.id ?? "";

  return (
    <Tabs defaultValue={defaultTab}>
      <div className="border-b border-foreground/10 pb-2">
        <TabsList
          aria-label="가이드 탭"
          className="w-full flex-nowrap justify-start gap-6 overflow-x-auto rounded-none border-0 bg-transparent p-0 shadow-none"
        >
          {allTabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} variant="underline">
              <span className="inline-flex items-center gap-2 whitespace-nowrap">
                {tab.type === "streaming" && resolveMusicServiceIdFromLabel(tab.label) ? (
                  <MusicServiceIcon label={tab.label} size={16} className="h-4 w-4" />
                ) : null}
                <span>{tab.label}</span>
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {allTabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id}>
          <StreamingServiceTabs service={tab.service} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
