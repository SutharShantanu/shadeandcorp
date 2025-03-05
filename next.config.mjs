/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "picsum.photos",
      "img.freepik.com",
      "via.placeholder.com",
      "image.hm.com",
      "upload.wikimedia.org",
      "cdn-icons-png.flaticon.com",
      "images.unsplash.com",
      "plus.unsplash.com",
    ],
  },
};

export default nextConfig;
