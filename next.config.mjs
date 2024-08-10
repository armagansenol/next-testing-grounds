/** @type {import('next').NextConfig} */
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url) // get the resolved path to the file
const __dirname = path.dirname(__filename) // get the name of the directory

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
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag|glslx)$/,
      use: ["glslify-import-loader", "raw-loader", "glslify-loader"],
    })

    return config
  },
}

export default nextConfig
