/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // App full-stack hospedada na Vercel (site público + /admin no mesmo projeto).
  // O modo estático (output: "export" + basePath /preview-site) foi removido na
  // Fase 2 da migração — ver memória projeto-pa-arquitetura.
  images: { unoptimized: true },
};

export default nextConfig;
