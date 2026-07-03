/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Site ainda em desenvolvimento: todo o projeto é servido sob /preview-site
  // (a raiz do domínio não expõe nada). Ao entrar em produção, remova o basePath.
  basePath: "/preview-site",
  images: { unoptimized: true },
};

export default nextConfig;
