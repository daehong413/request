import Link from "next/link";
import { PageBreadcrumb } from "@/components/SeoData";
import { Arrow } from "@/components/Icons";
import { serviceAreas, regionPath, searchableContactRegions, regionAncestors } from "@/lib/contact-regions";
import { pageMetadata } from "@/lib/seo";
import "./areas.css";

export const metadata = pageMetadata(
  "시공 가능 지역·전국 창호 상담 안내 | 국민창호",
  "서울·경기·인천부터 제주까지 지역별 샤시 교체 상담 안내. 현장 주소와 교체 범위를 접수하고 방문·시공 가능 여부를 확인하세요.",
  "/areas",
);

export default function AreasPage() {
  const groups = new Map<string, typeof searchableContactRegions>();
  for (const region of searchableContactRegions) {
    if (!region.parentSlug) continue;
    const root = regionAncestors(region)[0];
    if (!root) continue;
    const group = groups.get(root.fullName) ?? [];
    group.push(region);
    groups.set(root.fullName, group);
  }
  return (
    <div className="areas-page container-content">
      <PageBreadcrumb items={[{ name: "시공 가능 지역", path: "/areas" }]} />
      <p className="eyebrow">시공 가능 지역</p>
      <h1>우리 집이 있는 곳에서,<br />창호 상담을 시작하세요.</h1>
      <p className="areas-intro">지역을 선택해 샤시 교체 상담에 필요한 정보를 확인하세요. 정확한 주소와 작업 조건을 확인한 뒤 방문·시공 가능 여부와 일정을 안내합니다.</p>
      <nav className="areas-grid" aria-label="지역별 창호 상담">
        {serviceAreas.map(({ name, heading, region }) => (
          <Link key={region.slug} href={regionPath(region)} prefetch={false}>
            <span className="areas-name">{name}<Arrow diagonal /></span>
            <span className="areas-service">샤시 교체·창호 상담</span>
            <span className="areas-detail">{heading}</span>
          </Link>
        ))}
      </nav>
      <section className="areas-districts" aria-labelledby="districts-heading">
        <h2 id="districts-heading">시·군·구별 창호 상담</h2>
        <p>권역을 펼쳐 우리 집이 있는 시·군·구를 선택하세요.</p>
        {Array.from(groups, ([name, regions]) => (
          <details key={name}>
            <summary>{name}<span>{regions.length}개 지역</span></summary>
            <nav aria-label={`${name} 시·군·구별 상담`}>
              <Link href={regionPath(regionAncestors(regions[0])[0])} prefetch={false}>
                {name} 전체 상담
              </Link>
              {regions.map((region) => (
                <Link key={region.slug} href={regionPath(region)} prefetch={false}>
                  {region.fullName} 샤시 교체
                </Link>
              ))}
            </nav>
          </details>
        ))}
      </section>
      <section className="areas-note">
        <h2>방문 전에 먼저 확인해요</h2>
        <p>이 목록은 지역별 상담 안내이며 지역 지점 목록이 아닙니다. 도서·산간, 자재 운반이나 장비 접근에 제약이 있는 현장은 진행 가능 여부와 추가 비용을 별도로 확인합니다.</p>
        <Link href="/contact">주소로 견적 상담하기 <Arrow /></Link>
      </section>
    </div>
  );
}
