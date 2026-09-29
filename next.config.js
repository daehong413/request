/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: `/contact/${encodeURIComponent("부산광역시")}`,
        destination: `/contact/${encodeURIComponent("부산")}`,
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
