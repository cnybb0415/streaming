import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { siteConfig } from "@/config/site";
import { SiteFooterNav } from "@/components/SiteFooterNav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: siteConfig.title,
  description: "원클릭 링크, 바로가기, 차트 현황을 한 화면에.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const wallpaperSrc = siteConfig.assets.wallpaper.src?.trim();
  const overlayOpacity = siteConfig.assets.wallpaper.overlayOpacity;

  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://hangeul.pstatic.net" />
        <link
          href="https://hangeul.pstatic.net/hangeul_static/css/nanum-barun-gothic.css"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {wallpaperSrc ? (
          <>
            <div
              aria-hidden
              className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${wallpaperSrc})` }}
            />
            <div
              aria-hidden
              className="fixed inset-0 z-0 bg-background"
              style={{
                opacity:
                  typeof overlayOpacity === "number" ? overlayOpacity : 0.9,
              }}
            />
          </>
        ) : null}
        <div
          className={
            wallpaperSrc
              ? "relative z-10 min-h-screen bg-transparent"
              : "min-h-screen bg-transparent"
          }
        >
          <div className="pb-24">{children}</div>
          <SiteFooterNav />
        </div>
      </body>
    </html>
  );
}
