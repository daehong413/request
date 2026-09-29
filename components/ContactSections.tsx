import Image from "next/image";
import Link from "next/link";
import CountUp from "./CountUp";
import ContactCases from "./ContactCases";
import ContactHowTo from "./ContactHowTo";
import Reveal from "./Reveal";
import { Arrow } from "./Icons";
const standards = [
  [
    "정확한 현장 실측",
    "집의 구조와 기존 창틀 상태부터 확인합니다.",
    "M4 5h16v14H4zM8 5v4m4-4v3m4-3v4",
  ],
  [
    "분명한 자재 안내",
    "창틀과 유리 사양을 견적에 함께 담습니다.",
    "m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5",
  ],
  [
    "생활 공간 보호",
    "철거와 설치 전 작업 공간을 정리합니다.",
    "m3 11 9-8 9 8M5 9v12h14V9M9 21v-8h6v8",
  ],
  [
    "마감까지 점검",
    "틈새 마감과 여닫는 움직임을 살핍니다.",
    "M4 4h16v16H4zM8 12l3 3 6-7",
  ],
  [
    "시공 후 상담",
    "사용 방법과 관리에 필요한 내용을 안내합니다.",
    "M4 4h16v12H9l-5 5V4Zm4 5h8M8 12h5",
  ],
];
export default function ContactSections() {
  return (
    <>
      <section className="contact-comparison contact-section">
        <div className="container-content">
          <Reveal>
            <div className="contact-section-heading">
              <p className="contact-section-label">
                왜 꼼꼼히 비교해야 할까요?
              </p>
              <h2>
                가격만큼 중요한 건,
                <br />
                우리 집에 맞는 시공 조건입니다.
              </h2>
              <p>
                같은 창호라도 자재와 교체 범위, 마감에 따라 견적이 달라집니다.
              </p>
            </div>
            <div className="contact-compare-grid">
              <div className="contact-compare-basic">
                <span>가격만 확인한 견적</span>
                <h3>
                  무엇이 포함됐는지
                  <br />
                  알기 어렵다면?
                </h3>
                <ul>
                  {[
                    "유리와 창틀 사양이 불분명해요",
                    "철거·마감 비용을 알기 어려워요",
                    "추가로 확인할 조건이 남아 있어요",
                  ].map((t) => (
                    <li key={t}>
                      <span aria-hidden="true">−</span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="contact-compare-detail">
                <span>국민창호 견적 상담</span>
                <h3>
                  하나씩 확인하고,
                  <br />
                  충분히 알아본 뒤 결정하세요.
                </h3>
                <div className="contact-check-grid">
                  {[
                    ["창틀 소재", "제품과 프로파일 사양"],
                    ["유리 구성", "두께와 단열 사양"],
                    ["교체 범위", "전체 또는 부분 교체"],
                    ["시공 조건", "철거·운반·마감"],
                    ["시공 일정", "작업 시간과 준비 사항"],
                    ["사용·관리", "작동 점검과 관리 안내"],
                  ].map(([a, b]) => (
                    <div key={a}>
                      <span aria-hidden="true">✓</span>
                      <strong>{a}</strong>
                      <p>{b}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
      <ContactHowTo />
      <section className="contact-mid-banner">
        <div className="container-content">
          <span>우리 집 창호 교체, 어디서부터 시작할까요?</span>
          <h2>
            주소 하나로 시작하는
            <br className="mobile-break" /> 간편한 견적 상담
          </h2>
          <a href="#estimate-form">
            우리 집 상담 시작하기 <Arrow />
          </a>
        </div>
      </section>
      <section className="contact-campaign">
        <div className="container-content contact-campaign-layout">
          <div>
            <p className="contact-section-label">매일 머무는 집을 위한 변화</p>
            <h2>
              바람이 드는 창에서,
              <br />
              온기가 머무는 창으로.
            </h2>
            <p>
              웃풍, 결로, 뻑뻑한 움직임이 고민이라면
              <br />
              지금 우리 집 창의 상태부터 살펴보세요.
            </p>
            <a href="#estimate-form" className="contact-blue-link">
              우리 집 창호 상담하기 <Arrow />
            </a>
          </div>
          <div className="contact-campaign-photo">
            <Image
              src="/images/generated/contact-room.png"
              alt="햇살이 들어오는 넓은 창과 밝은 거실의 공간 예시"
              fill
              sizes="(max-width: 767px) 100vw, 720px"
            />
          </div>
        </div>
      </section>
      <section className="contact-assurance contact-section">
        <div className="container-content">
          <div className="contact-section-heading">
            <p className="contact-section-label">견적을 결정하기 전에</p>
            <h2>
              확인할 내용이 분명해야,
              <br />
              선택도 편안해집니다.
            </h2>
          </div>
          <div className="contact-document-display" aria-label="견적 확인 항목">
            <article>
              <h3>자재 사양</h3>
              <p>
                창틀 소재 · 유리 구성
                <br />
                제품 사양과 수량
              </p>
            </article>
            <article>
              <h3>시공 범위</h3>
              <ul>
                <li>교체할 창과 공간</li>
                <li>철거와 설치 범위</li>
                <li>운반과 마감 조건</li>
              </ul>
              <p>포함 항목을 함께 확인합니다.</p>
            </article>
            <article>
              <h3>마무리 확인</h3>
              <p>
                개폐 상태 · 잠금 장치
                <br />
                사용 방법과 관리 안내
              </p>
            </article>
          </div>
        </div>
      </section>
      <section className="contact-standards contact-section">
        <div className="container-content">
          <Reveal>
            <div className="contact-section-heading">
              <p className="contact-section-label">상담부터 마무리까지</p>
              <h2>
                작은 차이가 만드는
                <br />
                오래도록 편안한 창.
              </h2>
            </div>
            <div className="contact-standard-figures">
              <div>
                <span>고객 만족도</span>
                <CountUp value={96.4} decimals={1} unit="%" />
              </div>
              <div>
                <span>누적 시공</span>
                <CountUp value={4200} unit="+" />
              </div>
              <div>
                <span>직영 시공팀 운영</span>
                <CountUp value={100} unit="%" />
              </div>
            </div>
            <div className="contact-standard-grid">
              {standards.map(([title, description, path]) => (
                <article key={title}>
                  <svg
                    width="42"
                    height="42"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d={path}
                      stroke="currentColor"
                      strokeWidth="1.15"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />
                  </svg>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </article>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
      <section className="contact-system contact-section">
        <div className="container-content">
          <div className="contact-system-top">
            <div className="contact-system-copy">
              <p className="contact-section-label">우리 집에 맞는 시공</p>
              <h2>
                우리 집 조건에 맞춘
                <br />
                창호 시공과 관리.
              </h2>
              <p>주소와 평형, 필요한 시공부터 확인합니다.</p>
              <ul>
                <li>생활 속 불편과 교체 목적 확인</li>
                <li>현장의 구조와 자재 사양 검토</li>
                <li>작업 범위와 일정 안내</li>
                <li>설치 후 작동과 마감 상태 점검</li>
              </ul>
              <Link href="/services" className="contact-blue-link">
                시공 서비스 자세히 보기 <Arrow />
              </Link>
            </div>
            <figure className="contact-system-photo">
              <Image
                src="/images/generated/contact-team.png"
                alt="창틀 설치 상태를 점검하는 시공 장면 예시"
                fill
                sizes="(max-width:767px) 100vw, 650px"
              />
              <figcaption>
                창의 상태부터, 마감의 작은 틈까지.
                <small>시공 과정을 표현한 생성 이미지</small>
              </figcaption>
            </figure>
          </div>
          <div className="contact-system-bottom">
            <div className="contact-system-copy">
              <p className="contact-section-label">상담에서 마무리까지</p>
              <h3>
                처음 상담한 내용이
                <br />
                현장의 기준이 됩니다.
              </h3>
              <dl>
                <div>
                  <dt>상담</dt>
                  <dd>요구 사항과 교체 범위 정리</dd>
                </div>
                <div>
                  <dt>현장</dt>
                  <dd>치수와 설치 조건 확인</dd>
                </div>
                <div>
                  <dt>마무리</dt>
                  <dd>작동 점검과 사용 안내</dd>
                </div>
              </dl>
            </div>
            <figure className="contact-system-diagram">
              <div className="contact-system-image">
                <Image
                  src="/images/generated/installation-journey.png"
                  alt="현장 치수 기록, 창틀 수평 확인, 창문 손잡이 작동 점검을 보여주는 세 장면"
                  fill
                  sizes="(max-width:767px) 100vw, 650px"
                />
              </div>
              <figcaption>
                <span>현장 실측</span>
                <span>설치 확인</span>
                <span>작동 점검</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>
      <ContactCases />
    </>
  );
}
