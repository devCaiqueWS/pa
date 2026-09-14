// scripts/logo-ouro.mjs — gera public/assets/img/logo-pierre-gold.png a partir
// do PNG branco: mantém o alpha e pinta os pixels com o ouro do design system.
// Rodar no espelho local (o Drive não roda npm): node scripts/logo-ouro.mjs
import sharp from "sharp";
import { resolve } from "node:path";

const ORIGEM = resolve("public/assets/img/logo-pierre-white.png");
const DESTINO = resolve("public/assets/img/logo-pierre-gold.png");
const OURO = { r: 0xb9, g: 0x9a, b: 0x68 };

const { data, info } = await sharp(ORIGEM).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
for (let i = 0; i < data.length; i += 4) {
  data[i] = OURO.r;
  data[i + 1] = OURO.g;
  data[i + 2] = OURO.b;
  // alpha (data[i+3]) fica como está
}
await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toFile(DESTINO);
console.log(`ok: ${DESTINO} (${info.width}x${info.height})`);
