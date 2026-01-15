export const siteConfig = {
  title: "EXO 스트리밍",
  description: "원클릭 링크, 바로가기, 차트 현황을 한 화면에.",
  artistName: "EXO",
  trackTitle: "I'm Home",
  releaseDate: "",

  youtube: {
    videoId: "7hTbNeHqGD8",
    url: "https://www.youtube.com/watch?v=7hTbNeHqGD8",
    embedUrl: "https://www.youtube.com/embed/7hTbNeHqGD8",
  },

  actions: [
    { label: "원클릭 스트리밍", href: "#" },
    { label: "원클릭 라디오", href: "#" },
    { label: "원클릭 문자투표", href: "sms:%230505?body=VOTE_TEXT" },
    { label: "충전/결제 바로가기", href: "#" },
  ] as const,

  streamingLinks: [
    { label: "멜론", href: "https://www.melon.com/" },
    { label: "지니", href: "https://www.genie.co.kr/" },
    { label: "벅스", href: "https://music.bugs.co.kr/" },
    { label: "플로", href: "https://www.music-flo.com/" },
    { label: "바이브", href: "https://vibe.naver.com/" },
    { label: "유튜브", href: "https://www.youtube.com/watch?v=7hTbNeHqGD8" },
  ] as const,

  contacts: {
    twitterUrl: "#",
    devEmail: "dev@example.com",
    teamEmail: "team@example.com",
  },
} as const;
