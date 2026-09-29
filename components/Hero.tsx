import Image from "next/image";
import Link from "next/link";
import { Arrow, WindowIllustration } from "./Icons";
const services = [
  {
    title: "샤시 교체",
    desc: "노후 창틀과 유리 교체",
    href: "/services#replace",
  },
  {
    title: "이중창 · 단열 시공",
    desc: "유리와 창틀의 단열 개선",
    href: "/services#insulation",
  },
  {
    title: "방범창 · 방충망",
    desc: "환기와 안전을 위한 시공",
    href: "/services#safety",
  },
];
export default function Hero() {
  return (
    <section className="hero-section" aria-labelledby="hero-title">
      <div className="container-content">
        <div className="hero-banner">
          <Image
            src="/images/living-room.jpg"
            alt="큰 창으로 햇살이 들어오는 편안한 거실"
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="hero-photo"
          />
          <div className="hero-shade" />
          <div className="hero-copy">
            <p className="eyebrow light">주거 공간에 맞는 창호 시공</p>
            <h1 id="hero-title">
              좋은 창이 만드는
              <br />더 좋은 일상.
            </h1>
            <p className="hero-description">
              여닫을 때마다 느껴지는 차이.
              <br />
              실측부터 마감까지, 한결같은 마음으로.
            </p>
            <Link href="/services" className="hero-link">
              우리 집에 맞는 창호 찾기
              <Arrow />
            </Link>
          </div>
          <div className="hero-caption">
            <span className="status-dot" />
            기본을 지키는 시공, 국민창호
          </div>
          <a
            href="#services"
            className="scroll-hint"
            aria-label="시공 서비스 바로가기"
          >
            <span>시공 서비스 살펴보기</span>
            <span>↓</span>
          </a>
        </div>
        <div className="service-shortcuts" id="services">
          {services.map((service, i) => (
            <Link
              key={service.href}
              href={service.href}
              className="service-tile"
            >
              <div className="service-tile-copy">
                <h2>{service.title}</h2>
                <p>{service.desc}</p>
                <span className="tile-arrow">
                  <Arrow />
                </span>
              </div>
              <WindowIllustration variant={i} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
