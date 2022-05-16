/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    BACKEND_URL: process.env.BACKEND_URL,
  },
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
  },
}

// module.exports = nextConfig
const withPWA = require('next-pwa')

module.exports = withPWA(nextConfig)
