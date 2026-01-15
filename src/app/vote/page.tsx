import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function VotePage() {
  return (
    <div className="min-h-screen bg-transparent text-foreground">
      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">투표</h1>
          <Badge variant="default">준비중</Badge>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>투표 안내 / 바로가기</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>여기에 문자투표/앱투표/사전투표 안내와 링크를 넣을 수 있어요.</p>
            <p className="text-foreground/70">(원하시면 버튼/카드 UI로 바로 구성해둘게요)</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
