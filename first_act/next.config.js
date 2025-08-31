/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    API_LINK: process.env.API_LINK,
  },
}

module.exports = nextConfig