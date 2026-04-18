import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: {
    SITE_PASSWORD: process.env.SITE_PASSWORD,
  },
};

export default nextConfig;
