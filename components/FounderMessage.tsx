import Image from "next/image";
import Link from "next/link";
import Reveal from "./Reveal";
import { Arrow } from "./Icons";
export default function FounderMessage() {
  return (
    <section className="section-space">
      <div className="container-content">
        <Reveal className="story-grid">
          <div className="story-image">
            <Image
              src="/images/window-interior.jpg"
              alt="창문과 밝은 벽면이 조화를 이루는 실내 공간"
              fill
              sizes="(max-width: 767px) 100vw, 600px"
            />
            <span className="photo-note">공간의 시작은, 좋은 창에서.</span>
          </div>
          <div className="story-copy">
            <p className="eyebrow">국민창호의 시공 기준</p>
            <h2 className="section-title">
              눈에 보이지 않는 곳에
              <br />
              우리의 기준이 있습니다.
            </h2>
            <p className="story-lead">
              창호는 마감재이기 전에,
              <br />
              우리 집을 지켜주는 단열재입니다.
            </p>
            <p className="body-copy">
              창틀의 작은 틈, 유리의 두께, 마지막 실리콘 마감까지.
              <br className="desktop-break" />
              매일 사용하는 창이기에 어느 하나 가볍게 생각하지 않습니다. 처음
              상담한 마음 그대로, 오래 편안한 공간을 만듭니다.
            </p>
            <Link href="/about" className="text-link">
              국민창호의 이야기
              <Arrow diagonal />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
