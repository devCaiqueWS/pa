/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Site ainda em desenvolvimento: todo o projeto é servido sob /preview-site
  // (a raiz do domínio não expõe nada). Ao entrar em produção, remova o basePath.
  basePath: "/preview-site",
  images: { unoptimized: true },
  // Nota: /links responde na raiz do domínio via rewrite da Vercel (vercel.json).
  // Não dá para fazer isso aqui: o Next recusa rewrite com `basePath: false`
  // cujo destino não seja uma URL http(s) absoluta.
};

export default nextConfig;
