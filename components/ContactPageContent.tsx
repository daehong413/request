import { PageBreadcrumb, RegionServiceSeoData } from "@/components/SeoData";
import ContactSections from "@/components/ContactSections";
import ContactForm from "@/components/ContactForm";
import CountUp from "@/components/CountUp";
import Reveal from "@/components/Reveal";
import { Arrow } from "@/components/Icons";
import { siteConfig } from "@/lib/site-config";
import Link from "next/link";
import {
  contactRegionChildren,
  regionAncestors,
  regionPath,
  type ContactRegion,
} from "@/lib/contact-regions";

const services = [
  ["샤시 교체", "오래된 창을 새롭게"],
  ["단열 이중창", "온기를 지키는 창"],
  ["베란다 창호", "넓은 공간도 꼼꼼하게"],
  ["부분 교체", "필요한 곳만 알맞게"],
  ["방범창", "안전을 생각하는 선택"],
  ["방충망", "편안한 환기의 시작"],
];
const steps = [
  ["우리 집 정보 입력", "주소와 평형, 교체할 창을 알려주세요."],
  ["맞춤 상담", "집의 조건과 원하시는 시공을 확인합니다."],
  ["방문 실측 · 견적", "직접 측정하고 자재와 비용을 안내합니다."],
  ["시공 진행", "약속한 일정에 맞춰 꼼꼼하게 설치합니다."],
  ["마무리 · 사후 상담", "작동 확인과 사용 안내까지 함께합니다."],
];
export default function ContactPageContent({
  region,
}: {
  region?: ContactRegion;
}) {
  const directory = contactRegionChildren(region?.slug);
  return (
    <div className="estimate-page">
      {region && <RegionServiceSeoData region={region} />}
      <PageBreadcrumb items={[
        { name: "전국 견적 문의", path: "/contact" },
        ...(region ? [...regionAncestors(region), region].map((item) => ({ name: item.name, path: regionPath(item) })) : []),
      ]} />
      <section className="estimate-hero" aria-labelledby="estimate-title">
        <div className="estimate-ambient" aria-hidden="true" />
        <div className="estimate-layout">
          <div className="estimate-intro">
            <p className="estimate-kicker">
              {region
                ? `${siteConfig.name} · ${region.fullName} 창호 상담`
                : "전국 창호 시공 · 우리 집 주소로 시작하는 상담"}
            </p>
            <h1 id="estimate-title">
              {region ? `${region.name} 창호 교체,` : "우리 집 조건에 맞는"}
              <br />
              {region ? `${siteConfig.name}에 상담하세요.` : "창호 견적을 만나보세요!"}
            </h1>
            {region && <p className="body-copy">{region.description}</p>}
            <div
              className="estimate-services"
              aria-label="상담 가능한 시공 서비스"
            >
              {services.map(([title, subtitle]) => (
                <div key={title}>
                  <strong>{title}</strong>
                  <span>{subtitle}</span>
                </div>
              ))}
            </div>
            <div className="estimate-benefits">
              <div>
                <span>고객 만족도</span>
                <CountUp value={96.4} decimals={1} unit="%" />
              </div>
              <div>
                <span>누적 시공</span>
                <CountUp value={4200} unit="+" />
              </div>
              <div>
                <span>직영 시공팀</span>
                <CountUp value={100} unit="%" />
              </div>
            </div>
            <a className="estimate-phone" href={siteConfig.phoneHref}>
              <span>
                전화로 바로 상담하기 <b>{siteConfig.phone}</b>
              </span>
              <Arrow />
            </a>
            <p className="estimate-hours">{siteConfig.businessHours}</p>
          </div>
          <ContactForm regionName={region?.fullName} />
        </div>
      </section>
      {region && (
        <section
          className="contact-region-guide container-content"
          aria-labelledby="region-guide-title"
        >
          <nav aria-label="지역 경로" className="contact-region-breadcrumb">
            <Link href="/contact">견적 문의</Link>
            {regionAncestors(region).map((parent) => (
              <Link key={parent.slug} href={regionPath(parent)}>
                {parent.name}
              </Link>
            ))}
            <span aria-current="page">{region.name}</span>
          </nav>
          <div className="contact-region-panel">
            <div className="contact-region-copy">
              <p className="contact-region-eyebrow">{region.fullName}</p>
              <h2 id="region-guide-title">
                {region.fullName}의 우리 집,
                <br />
                어떤 창을 바꾸시나요?
              </h2>
              <p>{region.guide}</p>
              <a className="contact-region-cta" href="#estimate-form">
                주소 입력하고 상담 시작하기 <Arrow />
              </a>
            </div>
          </div>
        </section>
      )}
      {directory.length > 0 && (
        <nav
          className="contact-region-directory container-content"
          aria-label="지역별 창호 상담"
        >
          <h2>{region ? `${region.name} 세부 지역별 창호 상담` : "전국 지역별 창호 상담"}</h2>
          <div className="contact-region-links">
            {directory.map((item) => (
              <Link key={item.slug} href={regionPath(item)} prefetch={false}>
                {item.name} 창호 교체 상담
              </Link>
            ))}
          </div>
        </nav>
      )}
      <ContactSections />
      <section className="estimate-guide" id="estimate-guide">
        <div className="container-content">
          <Reveal>
            <div className="estimate-guide-heading">
              <p>창호 교체, 이렇게 진행해요</p>
              <h2>
                견적부터 사후 상담까지
                <br />
                5단계로 이어지는 시공 과정.
              </h2>
            </div>
            <ol className="estimate-process">
              {steps.map(([title, text], i) => (
                <li key={title}>
                  <span className="estimate-step-no">0{i + 1}</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                  {i < steps.length - 1 && <Arrow />}
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>
      <section className="estimate-photo-cta container-content">
        <div>
          <p>상담부터 편안하게 시작해보세요</p>
          <h2>우리 집 창호, 충분히 알아보고 결정하세요.</h2>
          <a href="#estimate-form">
            무료 견적 상담하기 <Arrow />
          </a>
        </div>
      </section>
    </div>
  );
}
