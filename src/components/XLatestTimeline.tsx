"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";

const SCRIPT_SRC = "https://platform.twitter.com/widgets.js";

export function XLatestTimeline({ handle = "weareoneEXO" }: { handle?: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const hasRenderedRef = useRef(false);

  const loadWidgets = useCallback(() => {
    const twttr = (window as Window & {
      twttr?: {
        widgets?: {
          load?: (el?: Element) => void;
          createTimeline?: (
            source: { sourceType: "profile"; screenName: string },
            element: HTMLElement,
            options?: Record<string, string | number | boolean>
          ) => Promise<void>;
        };
      };
    }).twttr;

    if (!containerRef.current || !twttr?.widgets) return;
    if (hasRenderedRef.current) return;
    if (containerRef.current.querySelector("iframe")) {
      hasRenderedRef.current = true;
      return;
    }

    // Prefer explicit createTimeline for reliability
    if (twttr.widgets.createTimeline) {
      hasRenderedRef.current = true;
      containerRef.current.innerHTML = "";
      void twttr.widgets.createTimeline(
        { sourceType: "profile", screenName: handle },
        containerRef.current,
        {
          tweetLimit: 1,
          chrome: "noheader nofooter noborders",
          theme: "light",
          height: 560,
          width: "100%",
        }
      );
      return;
    }

    // Fallback: parse anchor tags
    if (twttr.widgets.load) {
      hasRenderedRef.current = true;
      twttr.widgets.load(containerRef.current);
    }
  }, [handle]);

  useEffect(() => {
    if (!scriptReady) return;
    hasRenderedRef.current = false;
    const timer = window.setTimeout(loadWidgets, 0);
    return () => window.clearTimeout(timer);
  }, [handle, scriptReady, loadWidgets]);

  const href = `https://x.com/${handle}`;

  return (
    <div ref={containerRef} className="w-full">
      <Script
        src={SCRIPT_SRC}
        strategy="lazyOnload"
        onLoad={() => {
          setScriptReady(true);
          loadWidgets();
        }}
      />
      <a
        className="twitter-timeline"
        href={href}
        data-tweet-limit="1"
        data-show-replies="false"
        data-chrome="noborders"
        data-theme="light"
        data-height="560"
        data-width="100%"
      >
        X @{handle}
      </a>
    </div>
  );
}
