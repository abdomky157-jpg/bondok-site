import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  reactStrictMode: true,
  allowedDevOrigins: [
    "https://preview-chat-d92b45bc-cdd9-4afd-aba7-b1ca059ccaf0.space-z.ai",
    "*.space-z.ai",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "z-cdn-media.chatglm.cn",
      },
    ],
  },
};

export default nextConfig;
