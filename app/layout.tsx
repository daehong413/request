import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingConsult from "@/components/FloatingConsult";
import GoogleTagManager, { GoogleTagManagerNoScript } from "@/components/GoogleTagManager";
import { siteConfig } from "@/lib/site-config";
import { getSiteOrigin, isSearchIndexable } from "@/lib/seo";

const siteOrigin = getSiteOrigin();

export const metadata: Metadata = {
  metadataBase: siteOrigin ? new URL(siteOrigin) : undefined,
  title: `${siteConfig.name} | 전국 샤시 교체·창호 견적 상담`,
  applicationName: siteConfig.name,
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon", sizes: "16x16 32x32 48x48 256x256" },
      { url: "/icon.png", type: "image/png", sizes: "192x192" },
      { url: "/icon.svg", type: "image/svg+xml", sizes: "any" },
    ],
    apple: "/apple-icon.png",
  },
  description:
    "전국 샤시 교체, 이중창 단열 시공, 방범창·방충망 상담. 우리 집 주소와 교체 범위를 알려주시면 실측과 견적을 안내합니다.",
  robots: { index: isSearchIndexable(), follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <GoogleTagManager />
      </head>
      <body className="font-sans">
        <GoogleTagManagerNoScript />
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
