"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { WindowMark } from "./Icons";
import { getBrandStepCount } from "@/lib/motion";

export default function BrandStatement() {
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = stage.current;
    if (!node) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let previous = -1;
    const update = () => {
      frame = 0;
      const bounds = node.getBoundingClientRect();
      const count = preference.matches
        ? 4
        : getBrandStepCount(bounds.top, bounds.height, window.innerHeight);
      if (count !== previous) {
        node.dataset.visibleSteps = String(count);
        previous = count;
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    preference.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      preference.removeEventListener("change", schedule);
    };
  }, []);

  return (
    <section className="brand-statement" aria-labelledby="brand-title">
      <Image
        src="/images/generated/brand-daylight.png"
        alt=""
        fill
        sizes="100vw"
        className="brand-backdrop"
      />
      <div className="brand-backdrop-overlay" aria-hidden="true" />
      <div className="container-content">
        <div ref={stage} className="brand-stage">
          <h2 id="brand-title">
            <span className="brand-step" data-step="1">
              오늘의 선택이
            </span>
            <span className="brand-step" data-step="2">
              오래도록 편안하도록.
            </span>
          </h2>
          <p className="brand-step brand-lead" data-step="3">
            여닫을 때마다, 한결같이.
          </p>
          <div className="brand statement-logo brand-step" data-step="4">
            <WindowMark />
            <span>국민창호</span>
          </div>
        </div>
      </div>
    </section>
  );
}
