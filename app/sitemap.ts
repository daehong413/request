import type { MetadataRoute } from "next";
import { getSiteOrigin, isSearchIndexable } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = getSiteOrigin();
  if (!origin || !isSearchIndexable()) return [];
  return [
    "/",
    "/about",
    "/services",
    "/contact",
  ].map((path) => ({
    url: new URL(path, origin).href,
  }));
}
