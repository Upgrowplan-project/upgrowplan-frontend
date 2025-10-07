/** @type {import('next').NextConfig} */
const dotenv = require("dotenv");
dotenv.config();

const isDev = process.env.NODE_ENV !== "production";

// базовые адреса
const API_BASE_URL = isDev
  ? "http://localhost:8082"
  : "https://upgrowplan-user-service-3b483837144a.herokuapp.com";

const WS_BASE_URL = isDev
  ? "http://localhost:8082/ws"
  : "https://upgrowplan-user-service-3b483837144a.herokuapp.com/ws";

process.env.NEXT_PUBLIC_API_BASE_URL = API_BASE_URL;
process.env.NEXT_PUBLIC_WS_BASE_URL = WS_BASE_URL;

const nextConfig = {
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
