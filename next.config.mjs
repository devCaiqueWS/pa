/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Gera site 100% estático em out/ (npm run build) para deploy via FTP.
  output: "export",
  // App servida sob /preview-site (ex.: pierrealexander.com.br/preview-site).
  // Mantenha em sincronia com BASE_PATH em lib/site.ts.
  basePath: "/preview-site",
  // Hospedagem estática não tem o otimizador de imagens do Next.
  images: { unoptimized: true },
  // URLs como /sobre/ -> /sobre/index.html, evita 404 em servidor estático.
  trailingSlash: true,
};

export default nextConfig;
