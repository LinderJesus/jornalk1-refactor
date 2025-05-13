/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
  // Configuração de reescrita para permitir que detail-news.tsx seja usado para a rota dinâmica [slug]
  async rewrites() {
    return [
      {
        source: '/noticia/:slug',
        destination: '/noticia/detail-news',
      },
    ];
  },
};

module.exports = nextConfig;