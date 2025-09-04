/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*", // все запросы на /api/...
        destination: "http://localhost:9090/api/:path*", // твой бэкенд
      },
    ];
  },
};

module.exports = nextConfig;
