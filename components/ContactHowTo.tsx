"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { Arrow } from "./Icons";
const steps = [
  [
    "우리 집 주소를 입력해주세요.",
    "도로명이나 아파트명으로 검색하고, 검색되지 않으면 직접 입력하세요.",
  ],
  [
    "평형과 교체 범위를 선택하세요.",
    "전체 교체부터 필요한 공간의 부분 교체까지, 우리 집 조건을 알려주세요.",
  ],
  [
    "상담받으실 정보를 남겨주세요.",
    "성함과 연락처를 입력하고 궁금한 점을 함께 적어주세요.",
  ],
  [
    "내용을 확인하고 문의를 보내세요.",
    "입력 내용을 확인한 뒤 상담 문의 버튼을 눌러 전송해주세요.",
  ],
];
export default function ContactHowTo() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  return (
    <section className="contact-howto contact-section">
      <div className="container-content contact-howto-layout">
        <div>
          <p className="contact-section-label">간단한 견적 상담 방법</p>
          <h2>
            우리 집 정보 입력,
            <br />
            이렇게 하시면 돼요.
          </h2>
          <div
            className="contact-step-tabs"
            role="tablist"
            aria-label="견적 상담 방법"
          >
            {steps.map(([title], i) => (
              <button
                key={title}
                ref={(node) => {
                  tabs.current[i] = node;
                }}
                id={`howto-tab-${i}`}
                type="button"
                role="tab"
                aria-selected={active === i}
                aria-controls="howto-panel"
                tabIndex={active === i ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={(e) => {
                  let next = i;
                  if (e.key === "ArrowRight") next = (i + 1) % 4;
                  else if (e.key === "ArrowLeft") next = (i + 3) % 4;
                  else if (e.key === "Home") next = 0;
                  else if (e.key === "End") next = 3;
                  else return;
                  e.preventDefault();
                  setActive(next);
                  tabs.current[next]?.focus();
                }}
              >
                {i + 1}단계
              </button>
            ))}
          </div>
          <div
            id="howto-panel"
            role="tabpanel"
            aria-labelledby={`howto-tab-${active}`}
            tabIndex={0}
            className="contact-howto-copy"
          >
            <h3>{steps[active][0]}</h3>
            <p>{steps[active][1]}</p>
          </div>
          <a href="#estimate-form" className="contact-blue-link">
            실제 견적 상담 작성하러 가기 <Arrow />
          </a>
        </div>
        <figure className="contact-howto-example">
          <div className="howto-example-image">
            <Image
              src={`/images/generated/${["guide-address", "guide-scope", "guide-contact", "guide-review"][active]}.png`}
              alt={
                [
                  "휴대폰 화면에서 시공 주소 검색 위치를 확대한 예시",
                  "휴대폰 화면에서 30평대와 외부창 전체를 선택한 예시",
                  "휴대폰 화면에서 이름과 연락처 입력 위치를 확대한 예시",
                  "상담 내용을 확인하고 이메일 문의로 이어지는 화면 예시",
                ][active]
              }
              fill
              sizes="(max-width:767px) 100vw, 620px"
            />
          </div>
          <figcaption>
            이용 방법을 설명하는 화면 예시입니다. 실제 입력은 상단 견적 상담에서
            진행해주세요.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
