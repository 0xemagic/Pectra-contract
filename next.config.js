/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/sale",
        destination: "/sales",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/trade",
        destination: process.env.NODE_ENV === "production" ? "/404" : "/trade",
      },
    ];
  },
};

module.exports = nextConfig;
