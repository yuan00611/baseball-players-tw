import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "midfield.mlbstatic.com",
        pathname: "/v1/people/**",
      },
    ],
  },
};

export default nextConfig;
