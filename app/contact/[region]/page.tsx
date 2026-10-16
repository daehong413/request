import { notFound, permanentRedirect } from "next/navigation";
import ContactPageContent from "@/components/ContactPageContent";
import {
  contactRegions,
  getServiceArea,
  getContactRegion,
  getLegacyContactRegion,
  regionPath,
} from "@/lib/contact-regions";
import { pageMetadata } from "@/lib/seo";
import "../contact.css";

type Props = { params: { region: string } };

function resolveRegion(slug: string) {
  const region = getContactRegion(slug);
  if (region) {
    const area = getServiceArea(region.slug);
    if (area && slug !== area.urlSlug) permanentRedirect(regionPath(region));
    return region;
  }
  const legacyRegion = getLegacyContactRegion(slug);
  if (legacyRegion) permanentRedirect(regionPath(legacyRegion));
  notFound();
}

export function generateStaticParams() {
  // 광역·시·군·구는 미리 생성하고 읍·면·동은 첫 요청 시 생성해 캐시합니다.
  return contactRegions
    .filter(({ level }) => !["읍", "면", "동"].includes(level))
    .map((region) => ({ region: getServiceArea(region.slug)?.urlSlug ?? region.slug }));
}

export function generateMetadata({ params }: Props) {
  const region = resolveRegion(params.region);
  const area = getServiceArea(region.slug);
  if (area) {
    return pageMetadata(
      `${region.name} 샤시 교체·창호 견적 상담 | 국민창호`,
      `${region.name} 샤시·창호 교체 상담. ${area.advice}`,
      regionPath(region),
    );
  }
  return {
    ...pageMetadata(region.title, region.description, regionPath(region)),
    // 지역별 고유 콘텐츠가 준비되기 전까지 상담용으로만 유지합니다.
    robots: {
      index: false,
      follow: true,
      googleBot: { index: false, follow: true },
    },
  };
}

export default function RegionContactPage({ params }: Props) {
  const region = resolveRegion(params.region);
  return <ContactPageContent region={region} />;
}
