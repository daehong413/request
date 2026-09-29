import type { MetadataRoute } from "next";
import { contactRegions, regionPath } from "@/lib/contact-regions";
import { getSiteOrigin, isSearchIndexable } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = getSiteOrigin();
  if (!origin || !isSearchIndexable()) return [];
  return [
    "/",
    "/about",
    "/services",
    "/contact",
    ...contactRegions.map(regionPath),
  ].map((path) => ({
    url: new URL(path, origin).href,
  }));
}
