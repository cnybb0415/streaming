export type GuideAsset =
  | { type: "image"; src: string; alt?: string; fallbackSrcs?: string[] }
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
  artist?: string;
  coverImageSrc?: string;
  updatedAt?: string;
  assets: GuideAsset[];
};

const defaultStreamingParts = (): StreamingGuidePart[] => [
  { id: "streaming", label: "스트리밍", assets: [] },
  { id: "signup", label: "아이디 생성", assets: [] },
  { id: "download", label: "음원 다운로드", assets: [] },
  { id: "gift", label: "선물하기", assets: [] },
];

const guideImageSrc = (serviceId: string, partFolder: string, filename: string) =>
  `/images/guides/${encodeURIComponent(serviceId)}/${encodeURIComponent(partFolder)}/${encodeURIComponent(filename)}`;

const partFolderById: Record<StreamingGuidePart["id"], string> = {
  streaming: "streaming",
  signup: "idcreate",
  download: "download",
  gift: "gift",
};

function buildStreamingParts(serviceId: string, serviceLabel: string): StreamingGuidePart[] {
  return defaultStreamingParts().map((part) => {
    const partFolder = partFolderById[part.id];
    const baseName = `${serviceId}_${partFolder}`;

    const primary = guideImageSrc(serviceId, partFolder, `${baseName}.png`);
    const fallbackSrcs: string[] = [
      guideImageSrc(serviceId, partFolder, `${baseName}.jpg`),
      guideImageSrc(serviceId, partFolder, `${baseName}.jpeg`),
      guideImageSrc(serviceId, partFolder, `${baseName}.webp`),
    ];

    // Backward compatibility for existing example images like "멜론 예시.png" in streaming/
    if (part.id === "streaming" && serviceId !== "common") {
      fallbackSrcs.push(guideImageSrc(serviceId, "streaming", `${serviceLabel} 예시.png`));
    }

    return {
      ...part,
      assets: [
        {
          type: "image",
          src: primary,
          fallbackSrcs,
          alt: `${serviceLabel} ${part.label} 가이드`,
        },
      ],
    };
  });
}

/**
 * 업로드 규칙
 * - 스트리밍: public/images/guides/<service-id>/<part-folder>/...
 *   파일명 규칙: <service-id>_<part-folder>.png (또는 .jpg)
 *   예) /images/guides/melon/streaming/melon_streaming.png
 * - 응원법: public/images/cheering/<song-id>/{guide,album-art}/...
 *   예) /images/cheering/who-are-you/guide/who-are-you.jpg
 */
export const streamingGuideServices: StreamingGuideService[] = [
  { id: "melon", label: "멜론", parts: buildStreamingParts("melon", "멜론") },
  { id: "genie", label: "지니", parts: buildStreamingParts("genie", "지니") },
  { id: "bugs", label: "벅스", parts: buildStreamingParts("bugs", "벅스") },
  { id: "flo", label: "플로", parts: buildStreamingParts("flo", "플로") },
  { id: "vibe", label: "바이브", parts: buildStreamingParts("vibe", "바이브") },
];

export const cheeringGuideSongs: CheeringGuideSong[] = [
  {
    id: "who-are-you",
    label: "Who Are You",
    artist: "SUHO",
    coverImageSrc: "/images/cheering/who-are-you/album-art/who-are-you.webp",
    updatedAt: undefined,
    assets: [
      { type: "image", src: "/images/cheering/who-are-you/guide/who-are-you.jpg", alt: "Who Are You 응원법" },
    ],
  },
  {
    id: "medicine",
    label: "Medicine",
    artist: "SUHO",
    coverImageSrc: "/images/cheering/medicine/album-art/medicine.jpg",
    updatedAt: undefined,
    assets: [
      { type: "image", src: "/images/cheering/medicine/guide/medicine.jpg", alt: "Medicine 응원법" },
    ],
  },
  {
    id: "cream-soda",
    label: "Cream Soda",
    artist: "EXO",
    coverImageSrc: "/images/cheering/cream-soda/album-art/cream-soda.jpg",
    updatedAt: undefined,
    assets: [
      { type: "image", src: "/images/cheering/cream-soda/guide/cream-soda.jpg", alt: "Cream Soda 응원법" },
    ],
  },
];

export function getCheeringGuideSong(songId: string | undefined | null) {
  if (!songId) return null;
  const normalize = (value: string) =>
    value
      .trim()
      .toLowerCase()
      .replace(/[_\s]+/g, "-")
      .replace(/-+/g, "-");

  const target = normalize(songId);
  return (
    cheeringGuideSongs.find((s) => normalize(s.id) === target) ??
    cheeringGuideSongs.find((s) => normalize(s.label) === target) ??
    null
  );
}

/**
 * 응원법 상세 페이지는 `/cheer/<song-id>` 를 사용합니다.
 */
export function getFanchantPublicHref(songId: string) {
  return `/cheer/${songId}`;
}
