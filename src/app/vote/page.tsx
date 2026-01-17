import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type VotePageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

function getSingleParam(value: string | string[] | undefined): string | undefined {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value[0];
  return undefined;
}

export default function VotePage({ searchParams }: VotePageProps) {
  const smsToRaw = getSingleParam(searchParams?.to) ?? "0505";
  const smsTo = smsToRaw.startsWith("#") ? smsToRaw.slice(1) : smsToRaw;

  const bodyText = getSingleParam(searchParams?.body) ?? "엑소";
  const encodedBody = encodeURIComponent(bodyText);

  // Platform quirks:
  // - Android commonly supports: sms:0505?body=...
  // - iOS commonly supports: sms:0505&body=...
  const androidSmsHref = `sms:${smsTo}?body=${encodedBody}`;
  const iosSmsHref = `sms:${smsTo}&body=${encodedBody}`;

  return (
    <div className="min-h-screen bg-transparent text-foreground">
      <main className="mx-auto w-full max-w-6xl px-3 py-10 sm:px-6 sm:py-14">
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

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>생방송 문자투표</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="space-y-1">
              <p>
                받는 사람: <span className="font-semibold">{smsTo}</span>
              </p>
              <p>
                내용: <span className="font-semibold">{bodyText}</span>
              </p>
              <p className="text-foreground/70">기기별로 `sms:` 링크 형식이 달라서 아래를 따로 제공해요.</p>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <a
                href={androidSmsHref}
                className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-foreground px-4 text-sm font-medium text-background transition-[background-color,border-color,box-shadow,color,transform] hover:bg-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/25"
              >
                Android 문자앱 열기
              </a>
              <a
                href={iosSmsHref}
                className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-foreground/15 bg-white px-4 text-sm font-medium text-foreground shadow-sm transition-[background-color,border-color,box-shadow,color,transform] hover:border-foreground/35 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/25"
              >
                iPhone(iOS) 문자앱 열기
              </a>
            </div>

            <div className="rounded-xl border border-foreground/15 bg-white p-3 text-xs text-foreground/70">
              <p>
                참고: 링크에 <span className="font-semibold">#</span> (예: #0505) 를 붙이면 대부분의 기기에서 받는 번호로
                인식이 안 됩니다. 보통은 <span className="font-semibold">0505</span>처럼 숫자만 써야 해요.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
