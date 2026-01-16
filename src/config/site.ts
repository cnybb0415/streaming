export const siteConfig = {
  title: "EXO 스트리밍",
  description: "원클릭 링크, 바로가기, 차트 현황을 한 화면에.",
  artistName: "EXO",
  trackTitle: "첫 눈",
  tagline: "EXO SUPPORTING FANBASE",
  releaseDate: "",

  links: {
    guideUrl: "/guide",
    streamingUrl: "/streaming",
    voteUrl: "/vote",
    // Backward compatibility (older nav/pages may still link here)
    linksUrl: "/links",
  },

  assets: {
    // Fill these later with your images (leave empty to use placeholders)
    cover: {
      src: "",
      alt: "Track cover",
    },
    // Optional: full-page background wallpaper
    wallpaper: {
      // Example: "/images/wallpaper/main.jpg"
      src: "",
      // 0~1, higher = more white overlay (better readability)
      overlayOpacity: 0.2,
    },
    // Optional: 1~2 banner images linking to tweets/announcements
    heroBanners: [] as Array<{ href: string; src: string; alt: string }>,
  },

  youtube: {
    videoId: "3CwaYYUMikw",
    url: "https://youtu.be/3CwaYYUMikw?si=t8Q3rLAd3daMZJrB",
    embedUrl: "https://www.youtube.com/embed/3CwaYYUMikw",
  },

  actions: [
    { label: "멜론x 스트리밍", href: "#", kind: "streamingModal" },
    { label: "REVERXE 앨범구매", href: "#", kind: "albumModal" },
    { label: "라디오 신청하기", href: "#" },
    { label: "생방송 문자투표", href: "sms:%230505?body=VOTE_TEXT" },
    { label: "응원 가이드", href: "/guide" },
    { label: "응원법", href: "/links" },
  ] as const,

  streamingLinks: [
    {
      label: "멜론",
      pcHref: "https://www.melon.com/artist/timeline.htm?artistId=724619",
      mobileHref: "https://m2.melon.com/artist/song.htm?artistId=724619",
    },
    {
      label: "지니",
      pcHref: "https://www.genie.co.kr/detail/artistInfo?xxnm=80220847",
      mobileHref: "https://mw.genie.co.kr/detail/artistInfo?xxnm=80220847",
    },
    {
      label: "벅스",
      pcHref: "https://music.bugs.co.kr/artist/80155940?wl_ref=M_Search_01_01",
      mobileHref: "https://m.bugs.co.kr/artist/80155940?_redir=n",
    },
    {
      label: "플로",
      pcHref: "https://www.music-flo.com/detail/artist/80155940/track?sortType=POPULARITY&roleType=ALL",
      mobileHref: "https://m.music-flo.com/detail/artist/80155940",
    },
    {
      label: "바이브",
      pcHref: "https://vibe.naver.com/artist/272211",
      mobileHref: "https://vibe.naver.com/artist/272211",
    },
  ] as const,

  albumPurchaseLinks: [
    { label: "메이크스타", href: "https://www.makestar.com/product/14849" },
    { label: "뮤브", href: "https://www.muvve.co.kr/surl/P/158" },
    {
      label: "애플뮤직",
      href: "https://www.applemusic.co.kr/board/board.html?code=applemusic_board2&type=v&num1=997382&num2=00000&lock=",
    },
    { label: "위드뮤", href: "https://withmuu.com/goods/goods_view.php?goodsNo=1000013450" },
    { label: "케이타운포유", href: "https://kr.ktown4u.com/eventsub?eve_no=43931709&biz_no=967" },
    { label: "YES24", href: "https://event.yes24.com/detail?eventNo=265748" },
  ] as const,

  contacts: {
    twitterUrl: "#",
    instagramUrl: "#",
    devEmail: "dev@example.com",
    teamEmail: "team@example.com",
  },
} as const;
