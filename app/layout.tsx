import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingConsult from "@/components/FloatingConsult";
import { siteConfig } from "@/lib/site-config";
import { getSiteOrigin, isSearchIndexable } from "@/lib/seo";

const siteOrigin = getSiteOrigin();
const googleVerification = process.env.GOOGLE_SITE_VERIFICATION?.trim();
const naverVerification = process.env.NAVER_SITE_VERIFICATION?.trim();

export const metadata: Metadata = {
  metadataBase: siteOrigin ? new URL(siteOrigin) : undefined,
  title: `${siteConfig.name} | 전국 샤시 교체·창호 견적 상담`,
  applicationName: siteConfig.name,
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon.png", type: "image/png", sizes: "192x192" },
    ],
    apple: "/apple-icon.png",
  },
  description:
    "전국 샤시 교체, 이중창 단열 시공, 방범창·방충망 상담. 우리 집 주소와 교체 범위를 알려주시면 실측과 견적을 안내합니다.",
  robots: { index: isSearchIndexable(), follow: true },
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
