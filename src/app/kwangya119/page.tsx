"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const kwangyaIosImages = [
  "/images/119/ios/01.모바일.jpg",
  "/images/119/ios/02.모바일.jpg",
  "/images/119/ios/03.모바일.jpg",
  "/images/119/ios/04.모바일.jpg",
  "/images/119/ios/05.모바일.jpg",
];

const kwangyaAndroidImages = [
  "/images/119/android/01.모바일.jpg",
  "/images/119/android/02.모바일.jpg",
  "/images/119/android/03.모바일.jpg",
];

const kwangyaPcImages = [
  "/images/119/PC/01.PC.jpg",
  "/images/119/PC/02.PC.jpg",
  "/images/119/PC/03.PC.jpg",
  "/images/119/PC/04.PC.jpg",
  "/images/119/PC/05.PC.jpg",
  "/images/119/PC/06.PC.jpg",
];

const kwangyaReportImages = [
  "/images/119/KWANGYA/01.광야.jpg",
  "/images/119/KWANGYA/02.광야.jpg",
  "/images/119/KWANGYA/03.광야.jpg",
  "/images/119/KWANGYA/04.광야.jpg",
];

function ImageCarousel({ images }: { images: string[] }) {
  const [index, setIndex] = React.useState(0);
  const total = images.length;

  React.useEffect(() => {
    setIndex(0);
  }, [images]);

  const goPrev = React.useCallback(() => {
    if (!total) return;
    setIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const goNext = React.useCallback(() => {
    if (!total) return;
    setIndex((prev) => (prev + 1) % total);
  }, [total]);

  if (!images.length) {
    return (
      <div className="flex h-56 items-center justify-center rounded-2xl border border-foreground/10 bg-white text-sm text-foreground/60">
        준비중입니다.
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-black/80">
      <div
        className="flex transition-transform duration-300 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {images.map((src) => (
          <div key={src} className="min-w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt="광야119 안내"
              className="mx-auto h-auto w-full max-w-[88%] object-contain"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={goPrev}
        aria-label="이전 이미지"
        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-white/15 bg-black/40 p-2 text-white/80 backdrop-blur hover:bg-black/60"
      >
        <span className="block text-sm">‹</span>
      </button>
      <button
        type="button"
        onClick={goNext}
        aria-label="다음 이미지"
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/15 bg-black/40 p-2 text-white/80 backdrop-blur hover:bg-black/60"
      >
        <span className="block text-sm">›</span>
      </button>

      <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2">
        {images.map((_, i) => (
          <button
            key={`dot-${i}`}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`이미지 ${i + 1} 보기`}
            className={
              "h-2 w-2 rounded-full border border-white/40 transition" +
              (i === index ? " bg-white" : " bg-transparent")
            }
          />
        ))}
      </div>
    </div>
  );
}

export default function Kwangya119Page() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">광야 119 신고하기</h1>
          <p className="mt-2 text-sm text-foreground/70">
            허위정보/악성 게시물 신고는 아래 버튼을 눌러 진행해주세요.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <a
          href="https://kwangya119.smtown.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-foreground/15 bg-white px-4 py-2 text-sm font-semibold text-foreground shadow-sm hover:border-foreground/35 hover:shadow-md"
        >
          <img src="/images/icon/siren.png" alt="" className="h-4 w-4" />
          <span>광야119 신고하러 가기</span>
        </a>
      </div>

      <Tabs defaultValue="report">
        <div className="mt-8 mb-6">
          <TabsList aria-label="광야119 탭" className="justify-center">
            <TabsTrigger value="pdf" variant="pill">
              PDF 따기
            </TabsTrigger>
            <TabsTrigger value="report" variant="pill">
              KWANGYA 119 신고하기
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="pdf" className="mt-0">
          <section className="rounded-2xl border border-foreground/10 bg-[#0b0d12] p-4 shadow-sm">
            <Tabs defaultValue="ios">
              <div className="mb-4">
                <TabsList aria-label="PDF 이미지 탭" className="justify-center">
                  <TabsTrigger value="ios" variant="pill">
                    iOS
                  </TabsTrigger>
                  <TabsTrigger value="android" variant="pill">
                    Android
                  </TabsTrigger>
                  <TabsTrigger value="pc" variant="pill">
                    PC
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="ios" className="mt-0">
                <ImageCarousel images={kwangyaIosImages} />
                <div className="mt-6 rounded-2xl border border-foreground/10 bg-white p-6 text-sm text-foreground/70">
                  사파리 ➡️ 오른쪽 하단 점세개 ➡️ 공유 ➡️ 옵션 ➡️ PDF ➡️ 파일저장 ➡️ 저장
                </div>
              </TabsContent>
              <TabsContent value="android" className="mt-0">
                <ImageCarousel images={kwangyaAndroidImages} />
                <div className="mt-6 rounded-2xl border border-foreground/10 bg-white p-6 text-sm text-foreground/70">
                  삼성 인터넷 ➡️ 오른쪽 하단 줄 세 개 ➡️ 인쇄/PDF ➡️ 노란색 PDF 클릭 ➡️ 파일 저장
                </div>
              </TabsContent>
              <TabsContent value="pc" className="mt-0">
                <ImageCarousel images={kwangyaPcImages} />
                <div className="mt-6 rounded-2xl border border-foreground/10 bg-white p-6 text-sm text-foreground/70">
                  크롬 ➡️ 오른쪽 상단 점 세개 ➡️ 인쇄 ➡️ PDF로 저장 ➡️ 가로모드 ➡️ 설정더보기 - 배경그래픽 체크 ➡️ 준비한 파일에 저장
                </div>
              </TabsContent>
            </Tabs>
          </section>
        </TabsContent>

        <TabsContent value="report" className="mt-0">
          <section className="rounded-2xl border border-foreground/10 bg-[#0b0d12] p-4 shadow-sm">
            <ImageCarousel images={kwangyaReportImages} />
          </section>

          <section className="mt-6 rounded-2xl border border-foreground/10 bg-white p-6 shadow-sm">
            <div className="text-base font-semibold">광야 신고 방법</div>
            <div className="mt-2 text-sm text-foreground/70">
              광야 접속 ➡️ SM아이디 로그인 ➡️ 제보,신고센터 ➡️ 아티스트 선택, 내용 작성 ➡️ 준비한 자료들 업로드(링크, PDF 등) ➡️ 제출
            </div>
          </section>
        </TabsContent>
      </Tabs>
    </main>
  );
}
