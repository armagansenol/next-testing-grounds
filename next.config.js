/** @type {import('next').NextConfig} */
const path = require("path")

const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
    prependData: `@import 'styles/_functions';`,
  },
  headers: async () => {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ]
  },
  redirects: async () => {
    return [
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
