// =============================================================================
// IMAGENS RESPONSIVAS — variantes WebP geradas por scripts/optimize-images.mjs
// em public/assets/img/opt/<nome>-<largura>.webp. O JPG original continua sendo
// o fallback, então nada quebra se a pasta opt/ não existir.
// =============================================================================
import { asset } from "@/lib/site";

export type ImagemLocal = {
  /** Nome do arquivo em public/assets/img, sem extensão (ex.: "hero-mural"). */
  nome: string;
  /** Larguras geradas em opt/ (as mesmas do script). */
  larguras: number[];
  /** Dimensões do original, para reservar espaço e evitar CLS. */
  largura: number;
  altura: number;
  /** Extensão do original. */
  ext?: "jpg" | "png";
};

// Catálogo das imagens locais usadas na home (dimensões reais dos arquivos).
export const IMAGENS = {
  heroCampanha: { nome: "inigualavel-hero", larguras: [640, 960, 1280, 1672], largura: 1672, altura: 941 },
  muralClassico: { nome: "hero-mural", larguras: [640, 960, 1280, 1600], largura: 1600, altura: 893 },
  radicaline: { nome: "teaser-radicaline", larguras: [640, 960, 1280, 1600], largura: 1600, altura: 900 },
  radicalinePoster: { nome: "teaser-radicaline-poster", larguras: [640, 960, 1280, 1920], largura: 1920, altura: 1080 },
  original: { nome: "desodorante-original", larguras: [640, 960, 1280], largura: 2464, altura: 1728 },
  desodorantes: { nome: "desodorantes-varios", larguras: [640, 960, 1280], largura: 1600, altura: 893 },
  colecao: { nome: "social-cards", larguras: [640, 960, 1280, 1600], largura: 1600, altura: 893 },
  consultoras: { nome: "consultoras", larguras: [640, 960, 1280], largura: 1600, altura: 1000 },
} as const satisfies Record<string, ImagemLocal>;

export function srcOriginal(img: ImagemLocal): string {
  return asset(`/assets/img/${img.nome}.${img.ext ?? "jpg"}`);
}

export function srcSetWebp(img: ImagemLocal): string {
  return img.larguras.map((w) => `${asset(`/assets/img/opt/${img.nome}-${w}.webp`)} ${w}w`).join(", ");
}

// Dado um caminho qualquer vindo do CMS ("/assets/img/body-splash.jpg" ou URL),
// devolve o srcset WebP quando a imagem for uma das locais otimizadas.
const OTIMIZADAS: Record<string, number[]> = {
  "body-splash": [480, 800, 1200],
  "banhos-aromaticos": [480, 800, 1200],
  "fragrancia-secrets": [480, 800, 1200],
  "maison-sacola": [480, 800, 1200],
  "bag-colorida": [480, 800, 1200],
  "teaser-shampoo": [480, 800],
  "desodorante-original": [640, 960, 1280],
  "desodorantes-varios": [640, 960, 1280],
  "teaser-radicaline-poster": [640, 960, 1280, 1920],
};

export function srcSetDeCaminho(caminho: string | undefined | null): string | undefined {
  const m = /^\/assets\/img\/([a-z0-9-]+)\.(jpg|png)$/i.exec((caminho || "").trim());
  const larguras = m ? OTIMIZADAS[m[1]] : undefined;
  if (!m || !larguras) return undefined;
  return larguras.map((w) => `${asset(`/assets/img/opt/${m[1]}-${w}.webp`)} ${w}w`).join(", ");
}

// --- Packshots dos produtos (gerados por scripts/produtos-imagens.mjs) --------
// Convenção: public/assets/img/produtos/<codigo>-960.webp e <codigo>-480.webp
// (4:5, fundo branco). O manifesto lista os códigos que têm arquivo.
import manifesto from "@/lib/produtos-imagens.json";

const PRODUTOS_DIR = "/assets/img/produtos";
const LARGURAS_PRODUTO = [480, 960];
const CODIGOS_COM_IMAGEM = new Set<string>(manifesto.codigos);

/** Caminho local do packshot de um produto do ERP, ou "" se não houver. */
export function imagemLocalProduto(codigo: string | null | undefined): string {
  const c = (codigo || "").trim();
  return c && CODIGOS_COM_IMAGEM.has(c) ? `${PRODUTOS_DIR}/${c}-960.webp` : "";
}

/** srcset (480w/960w) quando a imagem for um packshot local; senão undefined. */
export function srcSetProduto(caminho: string | undefined | null): string | undefined {
  const m = new RegExp(`^${PRODUTOS_DIR}/([A-Za-z0-9_-]+)-960\.webp$`).exec((caminho || "").trim());
  if (!m) return undefined;
  return LARGURAS_PRODUTO.map((w) => `${asset(`${PRODUTOS_DIR}/${m[1]}-${w}.webp`)} ${w}w`).join(", ");
}
