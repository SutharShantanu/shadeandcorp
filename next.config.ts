import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow next/image to load images from these external hosts used across the app
  images: {
    domains: [
      "cdn-icons-png.flaticon.com",
      "avatars.githubusercontent.com",
      "lh3.googleusercontent.com",
      "images.unsplash.com",
      "plus.unsplash.com",
      "picsum.photos"
    ],
  },
};

export default nextConfig;
