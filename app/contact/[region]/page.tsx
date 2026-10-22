import { notFound } from "next/navigation";
import ContactPageContent from "@/components/ContactPageContent";
import {
  contactRegions,
  getServiceArea,
  getContactRegion,
  regionPath,
  regionUrlSlug,
  isRegionSearchTarget,
} from "@/lib/contact-regions";
import { pageMetadata } from "@/lib/seo";
import "../contact.css";

type Props = { params: { region: string } };

export const dynamicParams = false;

function resolveRegion(slug: string) {
  const region = getContactRegion(slug);
  if (region && isRegionSearchTarget(region)) return region;
  notFound();
}

export function generateStaticParams() {
  // 도·시·군·구의 영문 지역명 주소만 제공합니다.
  return contactRegions
    .filter(isRegionSearchTarget)
    .map((region) => ({ region: regionUrlSlug(region) }));
}

export function generateMetadata({ params }: Props) {
  const region = resolveRegion(params.region);
  const area = getServiceArea(region.slug);
  return pageMetadata(
    area ? `${region.name} 샤시 교체·창호 견적 상담 | 국민창호` : `${region.fullName} 샤시 교체·창호 견적 상담 | 국민창호`,
    area ? `${region.name} 샤시·창호 교체 상담. ${area.advice}` : region.description,
    regionPath(region),
  );
}

export default function RegionContactPage({ params }: Props) {
  const region = resolveRegion(params.region);
  return <ContactPageContent region={region} />;
}
