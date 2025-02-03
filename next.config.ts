import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["i.ibb.co", "via.placeholder.com", "placehold.co","lh3.googleusercontent.com","res.cloudinary.com", "d8it4huxumps7.cloudfront.net", "thebrandhopper.com","github.com"
      ,"i.pinimg.com"
    ], 
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
