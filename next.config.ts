import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/commercial",
        destination: "/commercialhome",
        permanent: true,
      },
      {
        source: "/zh/commercial",
        destination: "/zh/commercialhome",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
