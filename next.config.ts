import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React strict mode for performance best practices
  reactStrictMode: true,

  // Compress responses
  compress: true,

  // Allow Supabase Storage images
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },

  // Set caching headers for static assets (enables bfcache + CDN caching)
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=3600, stale-while-revalidate=86400",
        },
      ],
    },
    {
      source: "/_next/static/(.*)",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=31536000, immutable",
        },
      ],
    },
  ],

  // Reduce JS bundle by removing React devtools info in production
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Optimize font & asset loading
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;
