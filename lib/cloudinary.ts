// =============================================================================
// CLOUDINARY — armazém das imagens enviadas pelo painel. As credenciais vêm de
// variáveis de ambiente (.env.local em dev, Settings→Environment Variables na
// Vercel). Sem elas, `cloudinaryConfigurado` é false e o upload responde erro
// amigável (mas continua dando pra colar caminho/URL manualmente).
// =============================================================================
import { v2 as cloudinary } from "cloudinary";

export const cloudinaryConfigurado =
  !!process.env.CLOUDINARY_CLOUD_NAME &&
  !!process.env.CLOUDINARY_API_KEY &&
  !!process.env.CLOUDINARY_API_SECRET;

if (cloudinaryConfigurado) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export { cloudinary };
