import { searchableContactRegions, regionPath } from "@/lib/contact-regions";
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
    "/areas",
    ...searchableContactRegions.map(regionPath),
  ].map((path) => ({
    url: new URL(path, origin).href,
  }));
}
