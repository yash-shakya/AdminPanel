import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["i.ibb.co", "via.placeholder.com", "placehold.co"], // Add all allowed domains here
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
