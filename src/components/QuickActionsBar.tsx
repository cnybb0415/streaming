"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { OneClickStreamingGrid, type OneClickStreamingLink } from "@/components/OneClickStreamingGrid";
import { buildSmsHref, detectSmsPlatform } from "@/lib/sms";

export type QuickAction = {
  label: string;
  href: string;
  kind?: "streamingModal" | "albumModal" | "smsVote";
  smsTo?: string;
  smsBody?: string;
};

export type QuickLink = {
  label: string;
  href: string;
};

type ModalType = "streaming" | "album";

export function QuickActionsBar({
  actions,
  albumLinks,
  oneClickStreamingLinks,
  containerVariant = "card",
  containerClassName,
  gridClassName,
  buttonVariant = "outline",
  buttonSize,
  buttonClassName,
}: {
  actions: ReadonlyArray<QuickAction>;
  albumLinks?: ReadonlyArray<QuickLink>;
  oneClickStreamingLinks?: ReadonlyArray<OneClickStreamingLink>;
  containerVariant?: "card" | "none";
  containerClassName?: string;
  gridClassName?: string;
  buttonVariant?: React.ComponentProps<typeof Button>["variant"];
  buttonSize?: React.ComponentProps<typeof Button>["size"];
  buttonClassName?: string;
}) {
  const [openModal, setOpenModal] = React.useState<ModalType | null>(null);

  const openSmsVote = React.useCallback((action: QuickAction) => {
    const smsTo = (action.smsTo ?? "0505").trim();
    const bodyText = action.smsBody ?? "";
    const platform = detectSmsPlatform();
    const href = buildSmsHref({ to: smsTo, body: bodyText, platform });
    window.location.href = href;
  }, []);

  React.useLayoutEffect(() => {
    if (!openModal) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenModal(null);
    };

    document.addEventListener("keydown", onKeyDown);
    const root = document.documentElement;
    const previousOverflow = document.body.style.overflow;
    const previousRootOverflow = root.style.overflow;
    const previousData = root.getAttribute("data-scroll-locked");
    const previousVar = root.style.getPropertyValue("--scrollbar-width");

    // Compute compensation BEFORE locking scroll so layout doesn't jump.
    // If `scrollbar-gutter: stable` is supported, the gutter already prevents width shifts,
    // so applying extra padding can cause a noticeable jitter.
    const hasStableScrollbarGutter =
      typeof CSS !== "undefined" &&
      typeof CSS.supports === "function" &&
      CSS.supports("scrollbar-gutter: stable");

    const scrollbarWidth = hasStableScrollbarGutter
      ? 0
      : Math.max(0, window.innerWidth - root.clientWidth);

    root.style.setProperty("--scrollbar-width", `${scrollbarWidth}px`);
    root.setAttribute("data-scroll-locked", "true");

    root.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      root.style.overflow = previousRootOverflow;
      if (previousData === null) root.removeAttribute("data-scroll-locked");
      else root.setAttribute("data-scroll-locked", previousData);
      if (previousVar) root.style.setProperty("--scrollbar-width", previousVar);
      else root.style.removeProperty("--scrollbar-width");
    };
  }, [openModal]);

  const openStreamingModal = () => setOpenModal("streaming");
  const openAlbumModal = () => setOpenModal("album");
  const closeModal = () => setOpenModal(null);

  const gridClasses = cn(
    "grid",
    gridClassName ?? "grid-cols-2 gap-2 sm:grid-cols-4"
  );

  const buttons = (
    <div className={gridClasses}>
      {actions.map((action) => {
        const legacyStreaming = action.label.trim() === "원클릭 스트리밍";
        const legacyAlbum = action.label.trim() === "REVERXE 앨범구매";
        const isStreaming = action.kind === "streamingModal" || legacyStreaming;
        const isAlbum = action.kind === "albumModal" || legacyAlbum;
        const isSmsVote = action.kind === "smsVote";

        const shared = {
          variant: buttonVariant,
          size: buttonSize,
          className: cn("w-full", buttonClassName),
        } as const;

        if (isStreaming) {
          return (
            <Button
              key={action.label}
              {...shared}
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
              {...shared}
              onClick={openAlbumModal}
            >
              {action.label}
            </Button>
          );
        }

        if (isSmsVote) {
          return (
            <Button key={action.label} {...shared} onClick={() => openSmsVote(action)}>
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
            <Button {...shared}>{action.label}</Button>
          </a>
        );
      })}
    </div>
  );

  return (
    <>
      {containerVariant === "card" ? (
        <Card className={cn("rounded-2xl", containerClassName)}>
          <CardContent className="p-3">{buttons}</CardContent>
        </Card>
      ) : (
        <div className={containerClassName}>{buttons}</div>
      )}

      {openModal ? (
        <div className="fixed inset-0 z-40">
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
                {oneClickStreamingLinks && oneClickStreamingLinks.length > 0 ? (
                  <div className="mt-4">
                    <OneClickStreamingGrid
                      links={oneClickStreamingLinks}
                      columnsClassName="grid-cols-2 gap-2 sm:grid-cols-3"
                      buttonVariant="secondary"
                    />
                  </div>
                ) : (
                  <div className="mt-4 rounded-xl border border-foreground/10 bg-white p-3 text-sm text-foreground/70">
                    원클릭 스트리밍 링크 준비중
                  </div>
                )}
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
