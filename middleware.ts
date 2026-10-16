import { NextResponse, type NextRequest } from "next/server";
import regionData from "@/lib/data/contact-regions.json";
import serviceAreas from "@/lib/data/service-areas.json";

const currentSlugs = new Set(regionData.regions.map((region) => region.slug));
const regionsByCode = new Map(regionData.regions.map((region) => [region.code, region.slug]));
const englishSlugs = new Map(serviceAreas.map((area) => [area.slug, area.urlSlug]));
const legacyTargets = new Map(regionData.legacySlugs.map(({ slug, code }) => {
  const target = regionsByCode.get(code);
  return [slug, target ? englishSlugs.get(target) ?? target : undefined];
}));

// Resolve retired aliases before the page cache, so every 308 includes Location.
export function middleware(request: NextRequest) {
  const parts = request.nextUrl.pathname.split("/").filter(Boolean);
  if (parts.length !== 2) return NextResponse.next();
  let slug: string;
  try {
    slug = decodeURIComponent(parts[1]).normalize("NFC");
  } catch {
    return NextResponse.next();
  }
  if (currentSlugs.has(slug) || englishSlugs.has(slug)) return NextResponse.next();
  const target = legacyTargets.get(slug);
  if (!target || target === slug) return NextResponse.next();
  const url = request.nextUrl.clone();
  url.pathname = `/contact/${encodeURIComponent(target)}`;
  return NextResponse.redirect(url, 308);
}

export const config = { matcher: ["/contact/:path*"] };
