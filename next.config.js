/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',   // 👈 ESTO es lo que te falta

  images: {
    unoptimized: true  // necesario para export estático
  },

  trailingSlash: true  // evita errores en Cloudflare
};

module.exports = nextConfig;
