import regionData from "./data/contact-regions.json";

export type ContactRegion = {
  slug: string;
  name: string;
  fullName: string;
  level: "도" | "시" | "군" | "구" | "읍" | "면" | "동";
  code?: string;
  parentSlug?: string;
  description: string;
  guide: string;
};

// 지역 등록과 URL은 data/contact-regions.json만 기준으로 사용합니다.
export const contactRegions: ContactRegion[] = regionData.regions.map(
  (region) => ({
    ...region,
    level: region.level as ContactRegion["level"],
    description: `${region.fullName} 샤시 교체·단열 이중창·베란다 창호 견적 상담. 주소와 평형, 교체할 공간을 입력하고 실측과 견적에 필요한 항목을 확인하세요.`,
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
  return regionsBySlug.get(name);
}

export function regionPath(region: ContactRegion) {
  return `/contact/${encodeURIComponent(region.slug)}`;
}

export function regionAncestors(region: ContactRegion): ContactRegion[] {
  const parent = region.parentSlug && getContactRegion(region.parentSlug);
  return parent ? [...regionAncestors(parent), parent] : [];
}
