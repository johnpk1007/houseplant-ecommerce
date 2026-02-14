import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL('http://minio:9000/**')],
  },
};

export default nextConfig;
