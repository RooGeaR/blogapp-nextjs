/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "*.googleusercontent.com",
      "platform-lookaside.fbsbx.com",
      "firebasestorage.googleapis.com",
    ],
  },
};

module.exports = nextConfig
