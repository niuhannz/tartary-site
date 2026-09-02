import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // Legacy routes → new pillar structure
      { source: "/worlds", destination: "/world", permanent: true },
      { source: "/universe", destination: "/world", permanent: true },
      { source: "/cinema", destination: "/films", permanent: true },
      { source: "/studio", destination: "/films", permanent: true },
      { source: "/work", destination: "/artifacts", permanent: true },
      { source: "/publishing", destination: "/artifacts/publishing", permanent: true },
      { source: "/games", destination: "/lab/games", permanent: true },
    ];
  },
};

export default nextConfig;
