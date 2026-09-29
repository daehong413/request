import { pageMetadata } from "@/lib/seo";
import { BusinessSeoData } from "@/components/SeoData";

import Hero from "@/components/Hero";
import FounderMessage from "@/components/FounderMessage";
import TeamPromise from "@/components/TeamPromise";
import Stats from "@/components/Stats";
import Testimonials from "@/components/Testimonials";
import BrandStatement from "@/components/BrandStatement";
import CTASection from "@/components/CTASection";

export const metadata = pageMetadata(
  "국민창호 | 전국 샤시 교체·창호 견적 상담",
  "전국 아파트·주택 샤시 교체, 이중창 단열, 베란다 창호, 방범창·방충망 상담. 주소와 평형, 교체 범위에 맞춰 실측과 견적을 안내합니다.",
  "/",
);

export default function HomePage() {
  return (
    <>
      <BusinessSeoData />
      <Hero />
      <FounderMessage />
      <TeamPromise />
      <Stats />
      <Testimonials />
      <BrandStatement />
      <CTASection />
    </>
  );
}
