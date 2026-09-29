// ────────────────────────────────────────────────────────────
// 이 파일 하나만 수정하면 사이트 전체의 회사 정보가 바뀝니다.
// 실제 상호, 연락처, 주소, SNS 링크로 교체해주세요.
// ────────────────────────────────────────────────────────────

export const siteConfig = {
  name: "국민창호",
  tagline: "여닫을 때마다, 한결같이",
  phone: "010-2594-1794",
  phoneHref: "tel:01025941794",
  // kakaoUrl: "https://pf.kakao.com/_xxxxxx",
  email: "dh@kmwindow.com",
  address: "", // 실제 사업장 주소가 준비되면 입력해주세요.
  businessHours: "평일 09:00 – 18:00 (토요일 상담 가능)",
  regNumber: "사업자등록번호 000-00-00000",
  social: {
    // blog: "https://blog.naver.com/hangyeolsash",
    // instagram: "https://www.instagram.com/hangyeolsash",
    // youtube: "https://www.youtube.com/@hangyeolsash",
  },
  nav: [
    { href: "/", label: "홈" },
    { href: "/services", label: "시공 서비스" },
    { href: "/about", label: "회사 소개" },
    { href: "/contact", label: "견적 문의" },
  ],
};

export type SiteConfig = typeof siteConfig;
