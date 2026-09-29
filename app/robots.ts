import type { MetadataRoute } from "next";
import { getSiteOrigin, isSearchIndexable } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const origin = getSiteOrigin();
  return {
    rules: isSearchIndexable()
      ? { userAgent: "*", allow: "/", disallow: "/api/" }
      : { userAgent: "*", disallow: "/" },
    sitemap: origin && isSearchIndexable() ? `${origin}/sitemap.xml` : undefined,
  };
}
