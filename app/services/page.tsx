import Link from "next/link";
import Image from "next/image";
import { Arrow, WindowIllustration } from "@/components/Icons";
import Reveal from "@/components/Reveal";
import CTASection from "@/components/CTASection";
import ProcessSteps from "@/components/ProcessSteps";
import "./services.css";

export const metadata: Metadata = {
  title: "시공 서비스 | 국민창호",
  description:
    "샤시 교체, 이중창과 단열 시공, 방범창·방충망 등 우리 집에 맞는 창호 시공을 안내합니다.",
};

const details = [
  {
    id: "replace",
    title: "샤시 교체",
    desc: "노후된 알루미늄 창틀을 철거하고 단열 등급이 높은 시스템 샤시로 교체합니다. 벽체 손상을 최소화하는 시공 방식을 사용하며, 창틀 소재와 유리 사양을 선택할 수 있습니다.",
    points: [
      "기존 창틀 철거 및 폐기물 처리 포함",
      "시스템 창호 / 일반 창호 사양 선택 가능",
      "당일 시공 원칙 (대형 세대 제외)",
    ],
  },
  {
    id: "insulation",
    title: "이중창 · 단열 시공",
    desc: "기존 창을 유지한 채 안쪽에 이중창을 추가하거나, 로이(Low-E) 복층유리로 교체해 겨울철 웃풍과 결로를 줄입니다. 소음이 심한 도로변 세대에도 효과적입니다.",
    points: [
      "로이 복층유리 / 삼중유리 옵션",
      "기존 창 철거 없이 시공 가능",
      "방음 성능 상담 후 자재 추천",
    ],
  },
  {
    id: "safety",
    title: "방범창 · 방충망",
    desc: "저층 세대의 침입 방지를 위한 방범창과, 내구성이 강한 스텐 방충망을 제작 시공합니다. 화재 시 신속히 개방할 수 있는 안전 방범창도 취급합니다.",
    points: [
      "일반형 / 화재 대피용 방범창",
      "스텐리스 방충망 (변색·처짐 적음)",
      "베란다, 주방, 각 방 개별 시공 가능",
    ],
  },
];

export default function ServicesPage() {
  return (
    <>
      <section className="page-hero services-hero">
        <div className="container-content services-hero-layout">
          <div className="services-hero-copy">
            <p className="eyebrow">시공 서비스</p>
            <h1>
              필요한 만큼만,
              <br />
              <span>정직하게 시공합니다.</span>
            </h1>
            <p className="body-copy">
              공간도, 생활 방식도 다르니까.
              <br />
              우리 집에 꼭 맞는 창호를 함께 찾아드립니다.
            </p>
            <Link href="/contact" className="services-hero-link">
              우리 집 시공 상담하기 <Arrow />
            </Link>
          </div>
          <figure className="services-hero-photo">
            <Image
              src="/images/generated/services-inspection.png"
              alt="아파트 창틀에 수평계를 대고 설치 상태를 점검하는 작업자의 모습을 표현한 이미지"
              fill
              priority
              sizes="(max-width: 767px) 100vw, 60vw"
            />
            <figcaption>
              창틀의 수평부터 마감까지{" "}
              <small>시공 이해를 돕는 생성 이미지</small>
            </figcaption>
          </figure>
        </div>
      </section>
      <nav
        className="services-jump-nav container-content"
        aria-label="시공 서비스 바로가기"
      >
        {details.map((detail) => (
          <a key={detail.id} href={`#${detail.id}`}>
            <span>{detail.title}</span>
            <Arrow />
          </a>
        ))}
      </nav>
      <div className="container-content">
        {details.map((d, i) => (
          <section key={d.id} id={d.id}>
            <Reveal className="service-detail">
              <div className="service-detail-visual">
                <WindowIllustration variant={i} />
              </div>
              <div>
                <p className="eyebrow">시공 안내</p>
                <h2>{d.title}</h2>
                <p className="body-copy">{d.desc}</p>
                <ul>
                  {d.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
                <Link href="/contact" className="text-link">
                  이 서비스 상담하기
                  <Arrow diagonal />
                </Link>
              </div>
            </Reveal>
          </section>
        ))}
      </div>
      <ProcessSteps />
      <CTASection />
    </>
  );
}
import type { Metadata } from "next";
