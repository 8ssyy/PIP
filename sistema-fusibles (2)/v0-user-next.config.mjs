/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Asegúrate de que las rutas dinámicas se generen correctamente
  trailingSlash: true,
};

export default nextConfig;

