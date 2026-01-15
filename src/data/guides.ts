export type GuideAsset =
  | { type: "image"; src: string; alt?: string }
  | { type: "pdf"; href: string; label?: string };

export type StreamingGuidePart = {
  id: "streaming" | "signup" | "download" | "gift";
  label: string;
  assets: GuideAsset[];
};

export type StreamingGuideService = {
  id: string;
  label: string;
  parts: StreamingGuidePart[];
};

export type CheeringGuideSong = {
  id: string;
  label: string;
  assets: GuideAsset[];
};

const defaultStreamingParts = (): StreamingGuidePart[] => [
  { id: "streaming", label: "스트리밍", assets: [] },
  { id: "signup", label: "아이디 생성", assets: [] },
  { id: "download", label: "음원 다운로드", assets: [] },
  { id: "gift", label: "선물하기", assets: [] },
];

/**
 * 업로드 규칙
 * - 스트리밍: public/guides/streaming/<service-id>/<part-id>/...
 *   예) /guides/streaming/melon/streaming/guide-1.png
 * - 응원법: public/guides/cheering/<song-id>/...
 *   예) /guides/cheering/first-snow/guide-1.png
 */
export const streamingGuideServices: StreamingGuideService[] = [
  { id: "common", label: "공통", parts: defaultStreamingParts() },
  { id: "melon", label: "멜론", parts: defaultStreamingParts() },
  { id: "genie", label: "지니", parts: defaultStreamingParts() },
  { id: "bugs", label: "벅스", parts: defaultStreamingParts() },
  { id: "flo", label: "플로", parts: defaultStreamingParts() },
  { id: "vibe", label: "바이브", parts: defaultStreamingParts() },
];

export const cheeringGuideSongs: CheeringGuideSong[] = [
  { id: "first-snow", label: "첫 눈", assets: [] },
];
