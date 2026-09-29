import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import AboutScope from "@/components/AboutScope";
import Reveal from "@/components/Reveal";
import { Arrow, WindowMark } from "@/components/Icons";
import { siteConfig } from "@/lib/site-config";
import "./about.css";
export const metadata: Metadata = {
  title: "회사소개 | 국민창호",
  description:
    "국민창호가 하는 일과 고객과 함께 결정하는 시공 범위, 상담과 현장에서 정보를 나누는 방식을 소개합니다.",
};
const work = [
  [
    "교체 상담",
    "불편한 점을 먼저 듣습니다.",
    "창을 교체하려는 이유가 무엇인지, 지금 가장 불편한 공간은 어디인지부터 묻습니다. 단열, 환기, 여닫는 움직임처럼 실제 생활에서 느끼는 문제를 상담의 출발점으로 삼습니다.",
  ],
  [
    "사양과 범위 정리",
    "선택에 필요한 정보를 정리합니다.",
    "창틀과 유리의 사양, 교체할 창의 수량, 철거와 마감 범위를 구분합니다. 필요한 공사와 선택 가능한 항목을 이해한 뒤 결정할 수 있도록 설명합니다.",
  ],
  [
    "현장과 고객 연결",
    "결정한 내용이 현장으로 이어지도록.",
    "상담에서 정한 내용과 현장의 조건을 함께 확인합니다. 작업 일정과 생활 공간에 미치는 영향을 안내하고, 변경이 필요한 부분은 진행 전에 확인합니다.",
  ],
];
export default function AboutPage() {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="about-hero-copy">
          <p className="about-hero-eyebrow">
            국민창호 <span>회사소개</span>
          </p>
          <h1>
            창을 고치는 일.
            <br />
            <span>
              생활을
              <br />
              이해하는 일.
            </span>
          </h1>
          <p className="about-hero-lead">
            집마다 다른 이야기에서 시작해,
            <br />그 집에 맞는 창을 생각합니다.
          </p>
          <a href="#about-work" className="about-hero-link">
            국민창호 알아보기 <Arrow />
          </a>
        </div>
        <figure className="about-workshop">
          <Image
            src="/images/generated/about-workshop.png"
            alt="창틀 단면과 도면, 측정 도구가 놓인 작업대 이미지"
            fill
            priority
            sizes="(max-width: 767px) 100vw, 60vw"
          />
          <figcaption>
            <span>
              창 하나를 결정하기까지,
              <br />
              살펴야 할 것들.
            </span>
            <small>이미지 연출</small>
          </figcaption>
        </figure>
      </section>
      <nav
        className="about-chapters container-content"
        aria-label="회사소개 페이지 목차"
      >
        <a href="#about-work">우리가 하는 일</a>
        <a href="#about-scope">시공의 범위</a>
        <a href="#about-record">소통의 방식</a>
      </nav>
      <section className="about-work container-content" id="about-work">
        <Reveal>
          <div className="about-section-top">
            <span>우리가 하는 일</span>
            <h2>
              국민창호는
              <br />
              이런 일을 합니다.
            </h2>
          </div>
          <div className="about-work-list">
            {work.map(([tag, title, body]) => (
              <article key={tag}>
                <div>
                  <p>{tag}</p>
                  <h3>{title}</h3>
                </div>
                <p className="about-work-body">{body}</p>
              </article>
            ))}
          </div>
        </Reveal>
      </section>
      <section className="about-scope" id="about-scope">
        <div className="container-content">
          <Reveal>
            <div className="about-section-top">
              <span>시공 범위</span>
              <h2>
                어디까지 바꿀지,
                <br />
                함께 정합니다.
              </h2>
            </div>
            <AboutScope />
          </Reveal>
        </div>
      </section>
      <section className="about-record container-content" id="about-record">
        <Reveal>
          <div className="about-section-top">
            <span>소통 방식</span>
            <h2>
              말로만 지나가지 않도록,
              <br />
              함께 확인할 내용을 남깁니다.
            </h2>
          </div>
          <div className="about-record-grid">
            {[
              [
                "상담할 때",
                "불편한 공간과 희망 일정",
                "시공 주소, 교체 목적, 원하는 범위를 정리합니다.",
              ],
              [
                "결정할 때",
                "사용 자재와 견적의 범위",
                "사양과 수량, 포함 항목을 함께 확인합니다.",
              ],
              [
                "마무리할 때",
                "사용 방법과 확인 사항",
                "여닫는 방법과 관리 시 알아둘 점을 안내합니다.",
              ],
            ].map(([a, b, c]) => (
              <article key={a}>
                <span>{a}</span>
                <h3>{b}</h3>
                <p>{c}</p>
              </article>
            ))}
          </div>
        </Reveal>
      </section>
      <section className="about-contact">
        <div className="container-content about-contact-layout">
          <div className="about-signature">
            <WindowMark />
            <span>국민창호</span>
            <p>우리 집 이야기를 들려주세요.</p>
          </div>
          <div>
            <dl>
              <div>
                <dt>전화 상담</dt>
                <dd>
                  <a href={siteConfig.phoneHref}>{siteConfig.phone}</a>
                </dd>
              </div>
              <div>
                <dt>상담 시간</dt>
                <dd>{siteConfig.businessHours}</dd>
              </div>
              <div>
                <dt>이메일</dt>
                <dd>
                  <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
                </dd>
              </div>
            </dl>
            <Link href="/contact" className="about-inquiry">
              견적 상담 페이지로 <Arrow />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
