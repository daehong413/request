const serviceAreas = require("./lib/data/service-areas.json");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      ...serviceAreas.map((area) => ({
        source: `/contact/${encodeURIComponent(area.slug)}`,
        destination: `/contact/${area.urlSlug}`,
        permanent: true,
      })),
      {
        source: `/contact/${encodeURIComponent("부산광역시")}`,
        destination: "/contact/busan",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
