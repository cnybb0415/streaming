"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export type QuickAction = {
  label: string;
  href: string;
};

export type QuickLink = {
  label: string;
  href: string;
};

type ModalType = "streaming" | "album";

export function QuickActionsBar({
  actions,
  albumLinks,
}: {
  actions: ReadonlyArray<QuickAction>;
  albumLinks?: ReadonlyArray<QuickLink>;
}) {
  const [openModal, setOpenModal] = React.useState<ModalType | null>(null);

  React.useEffect(() => {
    if (!openModal) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenModal(null);
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [openModal]);

  const openStreamingModal = () => setOpenModal("streaming");
  const openAlbumModal = () => setOpenModal("album");
  const closeModal = () => setOpenModal(null);

  return (
    <>
      <Card className="rounded-2xl">
        <CardContent className="p-3">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {actions.map((action) => {
              const isStreaming = action.label.trim() === "원클릭 스트리밍";
              const isAlbum = action.label.trim() === "REVERXE 앨범구매";

              if (isStreaming) {
                return (
                  <Button
                    key={action.label}
                    variant="outline"
                    className="w-full rounded-xl"
                    onClick={openStreamingModal}
                  >
                    {action.label}
                  </Button>
                );
              }

              if (isAlbum) {
                return (
                  <Button
                    key={action.label}
                    variant="outline"
                    className="w-full rounded-xl"
                    onClick={openAlbumModal}
                  >
                    {action.label}
                  </Button>
                );
              }

              const isExternal = action.href.startsWith("http") || action.href.startsWith("sms:");

              return (
                <a
                  key={action.label}
                  href={action.href}
                  target={isExternal && action.href.startsWith("http") ? "_blank" : undefined}
                  rel={isExternal && action.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="w-full"
                >
                  <Button variant="outline" className="w-full rounded-xl">
                    {action.label}
                  </Button>
                </a>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {openModal ? (
        <div className="fixed inset-0 z-50">
          <button
            aria-label="닫기"
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeModal}
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-label={openModal === "streaming" ? "스트리밍 리스트" : "앨범 구매"}
            className="relative mx-auto mt-24 w-[min(520px,calc(100%-2rem))] rounded-2xl border border-foreground/10 bg-background p-4 shadow-xl"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="text-base font-semibold">
                {openModal === "streaming" ? "스트리밍 리스트" : "앨범 구매"}
              </div>
              <Button size="sm" variant="ghost" onClick={closeModal}>
                닫기
              </Button>
            </div>

            {openModal === "streaming" ? (
              <>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Button
                      key={i}
                      variant="secondary"
                      className="h-11"
                      onClick={closeModal}
                    >
                      스트리밍{i + 1}
                    </Button>
                  ))}
                </div>

                <div className="mt-4 text-xs text-foreground/70">
                  예시용 모달
                </div>
              </>
            ) : (
              <>

                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {(albumLinks ?? []).map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full"
                    >
                      <Button variant="secondary" className="h-11 w-full">
                        {link.label}
                      </Button>
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
