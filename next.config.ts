import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimizaciones de producción
  poweredByHeader: false,
  compress: true,

  // Configuración de imágenes
  images: {
    remotePatterns: [
      // Agregar aquí los dominios de imágenes externas si es necesario
      // {
      //   protocol: 'https',
      //   hostname: 'example.com',
      // },
    ],
  },

  // Headers de seguridad
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
