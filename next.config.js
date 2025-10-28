/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV !== "production";

// адреса сервисов
const USER_API_BASE_URL = isDev
  ? "http://localhost:8080" // твой локальный порт user-service
  : "https://upgrowplan-user-service-3b483837144a.herokuapp.com";

const BLOG_API_BASE_URL = isDev
  ? "http://localhost:8082"
  : "https://blog-service-14ba37a6adc0.herokuapp.com";

// WebSocket (если нужно)
const WS_BLOG_URL = isDev
  ? "http://localhost:8082/ws"
  : "https://blog-service-14ba37a6adc0.herokuapp.com/ws";

// Solutions Backend Services (запускаются через D:\UpgrowPlan\solutions-backend\start_services.py)
const OPEN_ABROAD_API_URL = isDev
  ? "http://localhost:8001" // open-abroad service
  : "https://open-abroad-production.herokuapp.com"; // TODO: добавить продакшн URL

const CLICK_ANALYTICS_API_URL = isDev
  ? "http://localhost:8002" // click-analytics service
  : "https://click-analytics-production.herokuapp.com"; // TODO: добавить продакшн URL

const nextConfig = {
  env: {
    NEXT_PUBLIC_API_USER_URL: USER_API_BASE_URL,
    NEXT_PUBLIC_API_BLOG_URL: BLOG_API_BASE_URL,
    NEXT_PUBLIC_WS_BLOG_URL: WS_BLOG_URL,
    NEXT_PUBLIC_OPEN_ABROAD_API_URL: OPEN_ABROAD_API_URL,
    NEXT_PUBLIC_CLICK_ANALYTICS_API_URL: CLICK_ANALYTICS_API_URL,
  },
  async rewrites() {
    return [
      {
        source: "/api/blog/:path*",
        destination: `${BLOG_API_BASE_URL}/api/:path*`,
      },
      {
        source: "/api/user/:path*",
        destination: `${USER_API_BASE_URL}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
