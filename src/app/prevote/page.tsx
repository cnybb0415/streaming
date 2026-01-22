import { VoteTabsWithSidebar } from "@/components/GuideTabs";
import { voteAppLinks } from "@/data/guides";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrevotePage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="text-2xl font-bold">음악방송 사전투표</h1>

      <Card className="mt-2">
        <CardContent className="pt-3">
          <div className="grid gap-1.5 grid-cols-3 lg:grid-cols-3">
            {voteAppLinks.map((link) => (
              <div key={link.id} className="rounded-md border border-foreground/10 bg-white p-1">
                <div className="flex items-center gap-1">
                  {link.logoSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={link.logoSrc} alt={link.label} className="h-3 w-auto" />
                  ) : null}
                  <span className="text-[10px] font-semibold text-foreground">{link.label}</span>
                </div>
                <div className="mt-1 grid grid-cols-2 gap-1">
                  {link.actions.map((action) => {
                    const hasHref = Boolean(action.href);
                    const className =
                      "inline-flex h-6 items-center justify-center gap-1 whitespace-nowrap rounded-md border border-foreground/15 bg-white px-1.5 text-[10px] font-medium text-foreground shadow-sm transition-[background-color,border-color,box-shadow,color,transform] hover:border-foreground/35 hover:shadow-md" +
                      (hasHref ? "" : " pointer-events-none opacity-50");

                    const content = (
                      <span className="inline-flex items-center gap-1">
                        <span>{action.label}</span>
                        <span className="text-[10px]">-&gt;</span>
                      </span>
                    );

                    return hasHref ? (
                      <a
                        key={`${link.id}-${action.id}`}
                        href={action.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={className}
                      >
                        {content}
                      </a>
                    ) : (
                      <span key={`${link.id}-${action.id}`} className={className}>
                        {content}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="mt-6">
        <VoteTabsWithSidebar />
      </div>
    </main>
  );
}
