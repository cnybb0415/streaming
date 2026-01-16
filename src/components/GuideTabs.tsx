"use client";

import * as React from "react";

import {
  streamingGuideServices,
  type GuideAsset,
  type StreamingGuideService,
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
  return [
    `${base}.png`,
    `${base}.jpg`,
    `${base}.jpeg`,
    `${base}.webp`,
  ];
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
}: {
  title: string;
  idKey: string;
  assets: GuideAsset[];
  emptyLines: string[];
}) {
  if (!assets.length) return <EmptyState title={title} lines={emptyLines} />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
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
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-semibold text-foreground/80">항목</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <TabsList
                aria-label={`${service.label} 항목`}
                className="flex flex-nowrap items-center gap-1 overflow-x-auto rounded-none border-0 bg-transparent p-0 shadow-none md:flex-col md:items-stretch md:overflow-visible"
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

export function GuideTabs() {
  return (
    <div className="space-y-6">
      <StreamingTabs />
    </div>
  );
}
