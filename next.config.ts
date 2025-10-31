import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cjkjgblyzgtcdhnycrdj.supabase.co',
        port: '',
        pathname: "/**"
      }
    ]
  },
};

export default nextConfig;
