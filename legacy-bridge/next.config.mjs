/** @type {import('next').NextConfig} */
const apiOrigin = process.env.NEXT_PUBLIC_LEGACY_BRIDGE_API_BASE_URL
  ? new URL(process.env.NEXT_PUBLIC_LEGACY_BRIDGE_API_BASE_URL).origin
  : "";

const nextConfig = {
  productionBrowserSourceMaps: false,
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              `"default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self' http://localhost:8000 https://localhost:8000 ${apiOrigin}; frame-ancestors 'none'; base-uri 'self'; form-action 'self'`,
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;




