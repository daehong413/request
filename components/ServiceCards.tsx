import Link from "next/link";

const services = [
  {
    title: "샤시 교체",
    desc: "노후 창틀을 철거하고 단열 등급이 높은 시스템 샤시로 교체합니다.",
    href: "/services#replace",
  },
  {
    title: "이중창 · 단열 시공",
    desc: "겨울철 결로와 웃풍을 잡는 이중창 및 로이유리 시공을 진행합니다.",
    href: "/services#insulation",
  },
  {
    title: "방범창 · 방충망",
    desc: "1층·저층 세대를 위한 방범창과 안전한 스텐 방충망을 제작합니다.",
    href: "/services#safety",
  },
];

export default function ServiceCards() {
  return (
    <section className="bg-paper border-b border-line">
      <div className="container-content py-16 md:py-20">
        <h2 className="text-[26px] md:text-[30px] font-bold text-ink tracking-tight2 mb-10">
          국민창호가 하는 일
        </h2>
        <div className="grid sm:grid-cols-3 gap-px bg-line">
          {services.map((s) => (
            <Link
              key={s.title}
              href={s.href}
              className="bg-paper p-8 hover:bg-white transition-colors group"
            >
              <div className="w-10 h-10 border-2 border-brass mb-6" aria-hidden="true" />
              <h3 className="text-[19px] font-bold text-ink mb-2.5">{s.title}</h3>
              <p className="text-[14.5px] leading-6 text-graphite">{s.desc}</p>
              <span className="mt-4 inline-block text-[14px] font-semibold text-brass-dark">
                자세히 보기
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
