// 사전투표 가이드 타입
export type VoteGuide = {
  id: string;
  label: string;
  assets: GuideAsset[];
};

export const voteGuides: VoteGuide[] = [
  {
    id: "musicbank",
    label: "뮤직뱅크",
    assets: [
      { type: "image", src: "/images/vote/뮤직뱅크/guide/팬캐스트.png", alt: "뮤직뱅크 팬캐스트 사전투표 가이드" },
    ],
  },
  {
    id: "showchampion",
    label: "쇼챔피언",
    assets: [
      { type: "image", src: "/images/vote/쇼챔피언/guide/아이돌챔프.png", alt: "쇼챔피언 아이돌챔프 사전투표 가이드" },
    ],
  },
  {
    id: "mcountdown",
    label: "엠카운트다운",
    assets: [
      { type: "image", src: "/images/vote/엠카운트다운/guide/엠넷플러스.png", alt: "엠카운트다운 엠넷플러스 사전투표 가이드" },
    ],
  },
  {
    id: "musiccore",
    label: "음악중심",
    assets: [
      { type: "image", src: "/images/vote/음악중심/guide/뮤빗.png", alt: "음악중심 뮤빗 사전투표 가이드" },
    ],
  },
  {
    id: "inkigayo",
    label: "인기가요",
    assets: [
      { type: "image", src: "/images/vote/인기가요/guide/링크.png", alt: "인기가요 링크 사전투표 가이드" },
      { type: "image", src: "/images/vote/인기가요/guide/하이어.png", alt: "인기가요 하이어 사전투표 가이드" },
    ],
  },
];
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
  // 멜론, 지니, 벅스: 다운로드/기프트/ID생성 등 전체 가이드
  {
    id: "melon",
    label: "멜론",
    parts: buildStreamingParts("melon", "멜론").filter((part) => part.id !== "gift"),
  },
  {
    id: "genie",
    label: "지니",
    parts: buildStreamingParts("genie", "지니").filter((part) => part.id !== "gift"),
  },
  {
    id: "bugs",
    label: "벅스",
    parts: buildStreamingParts("bugs", "벅스").filter((part) => part.id !== "gift"),
  },
  // 플로, 바이브: 스트리밍만 남김
  { id: "flo", label: "플로", parts: [buildStreamingParts("flo", "플로")[0]] },
  { id: "vibe", label: "바이브", parts: [buildStreamingParts("vibe", "바이브")[0]] },
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
