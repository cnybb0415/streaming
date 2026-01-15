import { GuideTabs } from "@/components/GuideTabs";

export default function GuidePage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-bold">가이드</h1>
      <p className="mt-2 text-sm text-foreground/80">탭에서 음원사이트별 가이드를 확인하세요.</p>

      <div className="mt-6">
        <GuideTabs />
      </div>
    </div>
  );
}
