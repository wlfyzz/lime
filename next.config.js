/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
  }
  
  
  module.exports = {
    ...nextConfig,
    experimental: {
      missingSuspenseWithCSRBailout: false,
    },
    async rewrites() {
      
      return [
        {
          source: '/api/auth/:path*',
          destination: '/api/auth/:path*',
        },
      ]
    },
  }