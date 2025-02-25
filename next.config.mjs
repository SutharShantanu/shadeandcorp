/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    turbo: false,
  },
  images: {
    domains: [
      "picsum.photos",
      "img.freepik.com",
      "via.placeholder.com",
      "image.hm.com",
      "upload.wikimedia.org",
    ],
  },
};

export default nextConfig;
