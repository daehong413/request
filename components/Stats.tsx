import CountUp from "./CountUp";

// Preserve the pre-existing project figures; verify operational values before launch.
const stats = [
  {
    value: 96.4,
    decimals: 1,
    unit: "%",
    label: "고객 만족도",
  },
  {
    value: 4200,
    decimals: 0,
    unit: "+",
    label: "누적 시공 건수",
  },
  {
    value: 100,
    decimals: 0,
    unit: "%",
    label: "직영 시공팀 운영",
  },
];

export default function Stats() {
  return (
    <section className="stats-section" aria-label="숫자로 보는 국민창호">
      <div className="container-content stats-layout">
        <div className="stats-intro">
          <p className="stats-kicker">국민창호가 쌓아온 기록</p>
          <h2 className="stats-heading">
            한 집, 한 집.
            <br />
            꾸준히 쌓아온 신뢰.
          </h2>
        </div>
        <div className="stats-grid">
          {stats.map((stat) => (
            <div className="stat-item" key={stat.label}>
              <p>{stat.label}</p>
              <CountUp
                value={stat.value}
                decimals={stat.decimals}
                unit={stat.unit}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
