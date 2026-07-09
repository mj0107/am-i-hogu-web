import type { NextConfig } from "next";

// IMAGE_REMOTE_HOST는 백엔드 AWS_CLOUDFRONT_DOMAIN에서 protocol을 제외한 CloudFront hostname이다.
// 예: AWS_CLOUDFRONT_DOMAIN=https://example.cloudfront.net -> IMAGE_REMOTE_HOST=example.cloudfront.net
const imageRemoteHost = process.env.IMAGE_REMOTE_HOST;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: imageRemoteHost
      ? [
          {
            protocol: "https",
            hostname: imageRemoteHost,
            pathname: "/images/**",
          },
        ]
      : [],
  },
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
};

export default nextConfig;
