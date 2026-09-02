import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // Legacy routes → new two-pillar structure
      // Old "worlds/films" pillars → IP Universe
      { source: "/worlds", destination: "/universe/worlds", permanent: true },
      { source: "/world", destination: "/universe/worlds", permanent: true },
      { source: "/world/:slug", destination: "/universe/worlds", permanent: true },
      { source: "/cinema", destination: "/universe/stories", permanent: true },
      { source: "/studio", destination: "/universe/stories", permanent: true },
      { source: "/films", destination: "/universe/stories", permanent: true },
      { source: "/films/:slug", destination: "/universe/stories", permanent: true },
      { source: "/publishing", destination: "/universe/stories", permanent: true },
      // Old "artifacts/lab" pillars → Technology
      { source: "/work", destination: "/technology", permanent: true },
      { source: "/artifacts", destination: "/technology", permanent: true },
      { source: "/artifacts/:slug", destination: "/technology", permanent: true },
      { source: "/lab", destination: "/technology", permanent: true },
      { source: "/lab/:slug", destination: "/technology", permanent: true },
      { source: "/games", destination: "/technology", permanent: true },
      { source: "/services", destination: "/technology", permanent: true },
      // Old utility routes
      { source: "/contact", destination: "/book-demo", permanent: true },
      { source: "/team", destination: "/about/team", permanent: true },
      { source: "/news", destination: "/about", permanent: true },
      { source: "/press", destination: "/about", permanent: true },
      { source: "/civilian", destination: "/about", permanent: true },
    ];
  },
};

export default nextConfig;
