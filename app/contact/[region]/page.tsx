import { notFound, permanentRedirect } from "next/navigation";
import ContactPageContent from "@/components/ContactPageContent";
import {
  contactRegions,
  getContactRegion,
  getLegacyContactRegion,
  regionPath,
} from "@/lib/contact-regions";
import { pageMetadata } from "@/lib/seo";
import "../contact.css";

type Props = { params: { region: string } };

function resolveRegion(slug: string) {
  const region = getContactRegion(slug);
  if (region) return region;
  const legacyRegion = getLegacyContactRegion(slug);
  if (legacyRegion) permanentRedirect(regionPath(legacyRegion));
  notFound();
}

export function generateStaticParams() {
  // 광역·시·군·구는 미리 생성하고 읍·면·동은 첫 요청 시 생성해 캐시합니다.
  return contactRegions
    .filter(({ level }) => !["읍", "면", "동"].includes(level))
    .map(({ slug }) => ({ region: slug }));
}

export function generateMetadata({ params }: Props) {
  const region = resolveRegion(params.region);
  return pageMetadata(
    region.title,
    region.description,
    regionPath(region),
  );
}

export default function RegionContactPage({ params }: Props) {
  const region = resolveRegion(params.region);
  return <ContactPageContent region={region} />;
}
