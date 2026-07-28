import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8089",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8089",
      },
    ],
  },
};

export default nextConfig;
