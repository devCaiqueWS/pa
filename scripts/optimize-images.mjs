// =============================================================================
// GERA VARIANTES RESPONSIVAS (WebP) das imagens usadas na home.
// Saída: public/assets/img/opt/<nome>-<largura>.webp
// Uso: node scripts/optimize-images.mjs   (rodar no espelho local com node_modules)
// O site continua funcionando com os JPG originais caso a pasta opt/ não exista
// (os componentes usam <picture> com fallback).
// =============================================================================
import sharp from "sharp";
import { mkdir, stat } from "node:fs/promises";
import path from "node:path";

const RAIZ = path.resolve(process.cwd(), "public/assets/img");
const SAIDA = path.join(RAIZ, "opt");

// nome do arquivo (sem extensão) -> larguras a gerar
const IMAGENS = {
  "inigualavel-hero": [640, 960, 1280, 1672],
  "hero-mural": [640, 960, 1280, 1600],
  "teaser-radicaline": [640, 960, 1280, 1600],
  "teaser-radicaline-poster": [640, 960, 1280, 1920],
  "desodorante-original": [640, 960, 1280],
  "desodorantes-varios": [640, 960, 1280],
  "social-cards": [640, 960, 1280, 1600],
  "body-splash": [480, 800, 1200],
  "banhos-aromaticos": [480, 800, 1200],
  "fragrancia-secrets": [480, 800, 1200],
  "maison-sacola": [480, 800, 1200],
  "bag-colorida": [480, 800, 1200],
  "teaser-shampoo": [480, 800],
  "consultoras": [640, 960, 1280],
};

async function existe(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

await mkdir(SAIDA, { recursive: true });
let gerados = 0;
for (const [nome, larguras] of Object.entries(IMAGENS)) {
  const origem = (await existe(path.join(RAIZ, `${nome}.jpg`)))
    ? path.join(RAIZ, `${nome}.jpg`)
    : path.join(RAIZ, `${nome}.png`);
  if (!(await existe(origem))) {
    console.warn(`(pulado) ${nome}: original não encontrado`);
    continue;
  }
  const meta = await sharp(origem).metadata();
  for (const w of larguras) {
    if (meta.width && w > meta.width) continue; // nunca aumenta
    const destino = path.join(SAIDA, `${nome}-${w}.webp`);
    await sharp(origem)
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: 78, effort: 5 })
      .toFile(destino);
    gerados++;
  }
}
console.log(`ok: ${gerados} variante(s) em public/assets/img/opt`);
