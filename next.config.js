/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'robohash.org',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
      },
      {
        protocol: 'https',
        hostname: 'imgur.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'media.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'pbs.twimg.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.discordapp.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '**', // Permitir cualquier dominio HTTPS
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self' https: data: 'unsafe-inline' 'unsafe-eval'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https: http: https://www.google.com https://www.gstatic.com https://unpkg.com https://bitflow.site",
              "style-src 'self' 'unsafe-inline' https: http:",
              "img-src 'self' data: https: http:",
              "frame-src 'self' https://www.google.com",
              "worker-src 'self' blob: https://www.google.com",
              "connect-src 'self' https: http:",
              "frame-ancestors *"
            ].join('; ')
          },
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL'
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'
          }
        ],
      },
    ]
  },
}

module.exports = nextConfig 