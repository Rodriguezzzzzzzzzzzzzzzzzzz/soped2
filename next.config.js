/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },

  trailingSlash: true,

  // 🔥 FIX CLAVE PARA CLOUDFLARE (evita el archivo de 25MB)
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.cache = false
    }
    return config
  },
}

module.exports = nextConfig