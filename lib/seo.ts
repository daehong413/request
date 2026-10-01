import type { Metadata } from "next";
import { siteConfig } from "./site-config";

export function getSiteOrigin(): string | undefined {
  const value = process.env.SITE_URL?.trim();
  if (!value) return undefined;
  const url = new URL(value);
  if (
    !["https:", "http:"].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  ) {
    throw new Error(
      "SITE_URL에는 경로 없는 실제 사이트 주소를 입력하세요. 예: https://your-domain.kr",
    );
  }
  // 운영 도메인은 Vercel에서 www로 이동하므로 기존 환경 변수 값도 같은 주소로 정규화합니다.
  if (url.origin === "https://kmwindow.com") return "https://www.kmwindow.com";
  return url.origin;
}

export function isSearchIndexable(): boolean {
  return (
    Boolean(getSiteOrigin()) &&
    !["preview", "development"].includes(process.env.VERCEL_ENV ?? "")
  );
}

export function pageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  const origin = getSiteOrigin();
  const url = origin ? new URL(path, origin).href : undefined;
  const image = origin ? new URL("/og-image.png", origin).href : undefined;
  return {
    title,
    description,
    alternates: url ? { canonical: url } : undefined,
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      locale: "ko_KR",
      type: "website",
      images: image ? [{ url: image, width: 1200, height: 630, alt: "국민창호 · 전국 샤시 교체와 창호 견적 상담" }] : [],
    },
    twitter: { card: "summary_large_image", title, description, images: image ? [image] : [] },
    robots: {
      index: isSearchIndexable(),
      follow: true,
      googleBot: { index: isSearchIndexable(), follow: true, "max-image-preview": "large" },
    },
  };
}
