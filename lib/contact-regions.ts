import serviceAreaData from "./data/service-areas.json";
import regionData from "./data/contact-regions.json";
import { siteConfig } from "./site-config";

export type ContactRegion = {
  slug: string;
  name: string;
  fullName: string;
  level: "도" | "시" | "군" | "구" | "읍" | "면" | "동";
  code?: string;
  parentSlug?: string;
  title: string;
  description: string;
  guide: string;
};

const regionNameCounts = new Map<string, number>();
for (const region of regionData.regions) {
  regionNameCounts.set(region.name, (regionNameCounts.get(region.name) ?? 0) + 1);
}

// 기존 행정구역 URL을 보존하고 별도 상담 권역에 필요한 주소만 추가합니다.
export const contactRegions: ContactRegion[] = [
  ...regionData.regions,
  ...serviceAreaData
    .filter((area) => !regionData.regions.some((region) => region.slug === area.slug))
    .map((area) => ({ ...area, level: "시" as const, parentSlug: undefined, code: undefined })),
].map(
  (region) => ({
    ...region,
    level: region.level as ContactRegion["level"],
    title: `${siteConfig.name} ${region.name} 창호 교체·샤시 견적${(regionNameCounts.get(region.name) ?? 0) > 1 ? ` | ${region.fullName}` : ""}`,
    description: `${siteConfig.name} ${region.name} 창호 교체 상담. ${region.fullName} 아파트·주택의 샤시(샷시), 베란다 창호, 단열 이중창, 방충망 교체를 상담하고 실측과 견적에 필요한 항목을 안내합니다.`,
    guide: `${region.fullName}의 시공할 도로명 주소 또는 건물명을 검색해주세요. 교체할 창의 위치와 수량, 전체 교체 또는 부분 교체 여부를 알려주시면 상담 범위를 확인할 수 있습니다. 공사 일정과 비용은 건물 조건 및 실측 결과를 확인한 뒤 안내합니다.`,
    parentSlug: region.parentSlug,
  }),
);
const regionsBySlug = new Map(
  contactRegions.map((region) => [region.slug, region]),
);
const regionsByCode = new Map(contactRegions.map((region) => [region.code, region]));
const legacyRegionsBySlug = new Map(
  regionData.legacySlugs.map(({ slug, code }) => [slug, regionsByCode.get(code)]),
);

export function getLegacyContactRegion(slug: string) {
  try {
    return legacyRegionsBySlug.get(decodeURIComponent(slug).normalize("NFC"));
  } catch {
    return undefined;
  }
}

// 모든 페이지에 전체 목록을 반복하지 않고, 상위 → 하위 지역으로 탐색합니다.
export function contactRegionChildren(parentSlug?: string) {
  return contactRegions.filter((region) => region.parentSlug === parentSlug);
}

export function getContactRegion(slug: string) {
  // 한글 URL은 라우터/요청 경로에 따라 퍼센트 인코딩된 상태로 전달될 수 있습니다.
  let name: string;
  try {
    name = decodeURIComponent(slug).normalize("NFC");
  } catch {
    return undefined;
  }
  const area = serviceAreaData.find((item) => item.urlSlug === name);
  return regionsBySlug.get(area?.slug ?? name);
}

export function regionPath(region: ContactRegion) {
  const area = serviceAreaData.find((item) => item.slug === region.slug);
  return `/contact/${area?.urlSlug ?? encodeURIComponent(region.slug)}`;
}

export function regionAncestors(region: ContactRegion): ContactRegion[] {
  const parent = region.parentSlug && getContactRegion(region.parentSlug);
  return parent ? [...regionAncestors(parent), parent] : [];
}

// Consultation areas are curated separately from administrative subdivisions.
export const serviceAreas = serviceAreaData.map((area) => ({
  ...area,
  region: regionsBySlug.get(area.slug)!,
}));
export function getServiceArea(slug: string) {
  return serviceAreas.find((area) => area.slug === slug);
}
