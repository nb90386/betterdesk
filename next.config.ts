import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    // Retired V3 routes point to their V4 equivalents (temporary while V4 is a preview).
    return [
      // Product pages moved under /product in the November rebuild.
      { source: "/scout", destination: "/product/scout", permanent: true },
      { source: "/presence", destination: "/product/presence", permanent: true },
      { source: "/desk", destination: "/product/desk", permanent: true },
      { source: "/platform", destination: "/product", permanent: false },
      { source: "/roi", destination: "/pricing", permanent: false },
      { source: "/solutions", destination: "/solutions/commercial-cleaning", permanent: false },
      { source: "/solutions/home-services", destination: "/solutions/commercial-cleaning", permanent: false },
      { source: "/solutions/beauty-wellness", destination: "/solutions/commercial-cleaning", permanent: false },
    ];
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
