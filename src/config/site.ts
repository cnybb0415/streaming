export const siteConfig = {
  title: "EXO FANBASE",
  artistName: "EXO",
  trackTitle: "Crown",
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
    videoId: "lpHyoTXgCRk",
    url: "https://youtu.be/lpHyoTXgCRk?si=caVrqz49QnGYVs_r",
    embedUrl: "https://www.youtube.com/embed/lpHyoTXgCRk",
  },

  actions: [
    { label: "원클릭 스트리밍", href: "#", kind: "streamingModal" },
    { label: "REVERXE 앨범구매", href: "#", kind: "albumModal" },
    { label: "라디오 신청하기", href: "/radio" },
    // Opens the SMS app directly with OS-specific sms: URI format.
    { label: "생방송 문자투표", href: "#", kind: "smsVote", smsTo: "#0505", smsBody: "EXO" },
    { label: "가이드", href: "/guide" },
    { label: "응원법", href: "/cheer" },
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

  // 원클릭 스트리밍(앱 딥링크/유니버설 링크)을 서비스별 + OS별로 설정합니다.
  // iosHref / androidHref / webHref 중 필요한 것만 채우면 됩니다.
  oneClickStreamingLinks: [
    // 멜론: 안드로이드 전용 링크 4개를 각각 별도 버튼으로 노출
    { id: "melon", label: "멜론 1", androidHref: "https://1xoxo1248.qaa.kr" },
    { id: "melon", label: "멜론 2", androidHref: "https://2xoxo1248.qaa.kr" },
    { id: "melon", label: "멜론 3", androidHref: "https://3xoxo1248.qaa.kr" },
    { id: "melon", label: "멜론 4", androidHref: "https://4xoxo1248.qaa.kr" },

    // 멜론: iOS 전용 링크
    { id: "melon", label: "멜론 iOS", iosHref: "https://xoxo1248.enn.kr" },

    // 지니: OS별 링크
    { id: "genie", label: "지니", iosHref: "https://1xoxo1248.enn.kr", androidHref: "https://1xoxo1248.uzu.kr" },

    { id: "bugs", label: "벅스", iosHref: "", androidHref: "", webHref: "" },
    { id: "flo", label: "플로", iosHref: "", androidHref: "", webHref: "" },
    { id: "vibe", label: "바이브", iosHref: "", androidHref: "", webHref: "" },
  ] as const,

  albumPurchaseLinks: [
    { label: "메이크스타", href: "https://www.makestar.com/product/14849" },
    { label: "뮤브", href: "https://www.muvve.co.kr/surl/P/158" },
    { label: "베리즈", href: "https://shop.berriz.in/ko/product/?productId=246447171123648" },
    { label: "알라딘", href: "https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=380802354&start=pcsearch_auto" },
    {
      label: "애플뮤직",
      href: "https://www.applemusic.co.kr/board/board.html?code=applemusic_board2&type=v&num1=997382&num2=00000&lock=",
    },
    { label: "위드뮤", href: "https://withmuu.com/goods/goods_view.php?goodsNo=1000013450" },
    { label: "YES24", href: "https://event.yes24.com/detail?eventNo=265748" },
    { label: "케이타운포유", href: "https://kr.ktown4u.com/eventsub?eve_no=43931709&biz_no=967" },
    { label: "핫트랙스", href: "https://hottracks.kyobobook.co.kr/media/music/detail/S000218796429" },
  ] as const,

  contacts: {
    twitterUrl: "https://x.com/weareoneEXO",
    instagramUrl: "https://www.instagram.com/weareone.exo?igsh=c2tybXIybHpmcmly",
    devEmail: "dev@example.com",
    teamEmail: "team@example.com",
  },
} as const;
