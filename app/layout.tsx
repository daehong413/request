import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingConsult from "@/components/FloatingConsult";
import { siteConfig } from "@/lib/site-config";
import { getSiteOrigin } from "@/lib/seo";

const googleVerification = process.env.GOOGLE_SITE_VERIFICATION?.trim();
const naverVerification = process.env.NAVER_SITE_VERIFICATION?.trim();

export const metadata: Metadata = {
  title: `${siteConfig.name} | ${siteConfig.tagline}`,
  description:
    "샤시 교체, 이중창 단열 시공, 방범창 제작까지 직영팀이 책임 시공합니다.",
  robots: { index: Boolean(getSiteOrigin()), follow: true },
  verification: {
    ...(googleVerification ? { google: googleVerification } : {}),
    ...(naverVerification
      ? { other: { "naver-site-verification": naverVerification } }
      : {}),
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="font-sans">
        <a className="skip-link" href="#main-content">
          본문으로 바로가기
        </a>
        <Header />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <FloatingConsult />
      </body>
    </html>
  );
}
