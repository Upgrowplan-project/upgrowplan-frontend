/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV !== "production";

// базовые адреса
const API_BASE_URL = isDev
  ? "http://localhost:8082"
  : "https://blog-service-14ba37a6adc0.herokuapp.com";

const WS_BASE_URL = isDev
  ? "http://localhost:8082/ws"
  : "https://blog-service-14ba37a6adc0.herokuapp.com/ws";

const nextConfig = {
  env: {
    NEXT_PUBLIC_API_BLOG_URL: API_BASE_URL,
    NEXT_PUBLIC_WS_BLOG_URL: WS_BASE_URL,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_BASE_URL}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
