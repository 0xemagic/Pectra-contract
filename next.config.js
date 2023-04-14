/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/sale',
        destination: '/sales',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
