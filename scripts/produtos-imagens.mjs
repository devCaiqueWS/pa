// =============================================================================
// PACKSHOTS DOS PRODUTOS — gera, a partir das fotos brutas da marca
// (fontes/produtos, fora do deploy), uma imagem por produto do ERP, nomeada
// pelo CÓDIGO do produto no Bling:
//   public/assets/img/produtos/<codigo>-960.webp  (960×1200, 4:5, fundo branco)
//   public/assets/img/produtos/<codigo>-480.webp
// e o manifesto lib/produtos-imagens.json com os códigos que têm imagem.
// O site usa isso como fallback quando o painel não definiu uma imagem
// (lib/produtos.ts). Rodar no espelho local (precisa do sharp):
//   FONTE="G:\...\pa\fontes\produtos" node scripts/produtos-imagens.mjs
// =============================================================================
import sharp from "sharp";
import { mkdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const FONTE = process.env.FONTE || path.resolve(process.cwd(), "fontes/produtos");
const SAIDA = process.env.SAIDA || path.resolve(process.cwd(), "public/assets/img/produtos");
const MANIFESTO = process.env.MANIFESTO || path.resolve(process.cwd(), "lib/produtos-imagens.json");

// Código do produto no ERP -> arquivo bruto escolhido (preferência: packshot
// "[Sem Fundo]" ou foto de estúdio sobre branco). Produtos sem foto ficam fora.
const MAPA = {
  // Casa
  "201914": "ÁGUA DE ROUPARIA-ALECRIM-01 [Sem Fundo].png",
  "201913": "ÁGUA DE ROUPARIA-RAMY-01 [Sem Fundo].png",
  "201912": "Marisa-Pereirinha/JPG/Aromatizaddor de ambientes Spray ALECRIM.jpg",
  "201948": "AROMATIZADOR-AMBIENTE-SPRAY-RAMY-PIERRE-02.jpeg",
  "201911": "AROMATIZADOR-AMBIENTE-ALECRIM -VARETAS-PIERRE.jpg",
  "201947": "Marisa-Pereirinha/JPG/Aromatizaddor de ambientes varetas RAMY.jpg",
  // Cuidado facial / especiais
  "4550": "ÁGUA MICELAR-01 [Sem Fundo].png",
  "43001": "GEL ALOE VERA_01 [Sem Fundo].png",
  "27503": "ÓLEO NUTRITIVO ROSA MOSQUETA_01 [Sem Fundo].png",
  "1590": "RADICALINE - SÉRUM FACIAL-01.png",
  "43402": "Marisa-Pereirinha/PNG/Creme Nutrirregenerante Pierre Alexander.png",
  // Águas virtuosas / body splash / body spray
  "4522": "ÁGUA VIRTUOSA CAMOMILA PIERRE ALEXANDER-01.png",
  "4503": "ÁGUA VIRTUOSA HAMAMELIS PIERRE ALEXANDER-01.png",
  "19443": "BANHO AROMÁTICO - D_AZUR ORIGINAL-01 [Sem Fundo].png",
  "19406": "BODY SPLASH - JABUTICABA-01 [Sem fundo].png",
  "19405": "BANHO AROMÁTICO - LAVANDE-01 [Sem Fundo].png",
  "19433": "BANHO AROMÁTICO - VERT-01 [Sem Fundo].png",
  "28703": "BODY SPRAY - FLASH RUBI-01.png",
  "28702": "BODY SPRAY - FLASH SILVER-01 [Sem Fundo].png",
  "28704": "BODY SPRAY - GOLD FLASH.png",
  "28701": "BODY SPRAY - PINK ROSE.png",
  // Perfumaria
  "17024": "KIT DEO COLONIA FOR WOMAN AMARILIS E SANTORINI-01 [Sem Fundo].png",
  "19071": "AURA ÚNICA-01.jpg",
  "10290": "EXCITÉE FOR LIFE-PERFUME-01.png",
  "10291": "EXCITÉE POUR LA VIE-01.png",
  "19032": "LAURA UM - PERFUME-01.png",
  "17023": "KIT DEO COLONIA MYKONOS E ÁLAMO-01.png",
  "10270": "SECRETS BLACK - PERFUME-01.png",
  "10252": "SECRETS POUR HOMME - 100ML-PERFUME-01.png",
  "10283": "VINGT HOMME - PERFUME-100ML-01.png",
  // Desodorantes
  "25001": "DESODORANTE-AEROSOL-01.png",
  "22151": "DÉODORANT CREME - BLOQUEADORA DE ODORES-01 [Sem Fundo].png",
  "22000": "DÉODORANTE CRÈME - CREMOSO-01.png",
  "22022": "DÉODORANT CRÈME PUMP_01 [Sem Fundo].png",
  "23152": "DÉODORANT CRÈME-BLOQUEADORA DE ODORES-ROLL-ON-01.png",
  "22503": "DEODORANT - DESODORANTE ROLL-ON CINZA-01.png",
  "23002": "DÉODORANTE CRÈME - ROLL-ON-01 [Sem Fundo].png",
  "22213": "DESODORANTE ROLL-ON - PROTECTION SEC-01.png",
  "22101": "TALC LIQUIDE-01 [Sem fundo].png",
  // Corpo & banho
  "19033": "LAURA UM - CREME HIDRATANTE PARA AS MÃOS-01 [Sem Fundo].png",
  "81452": "HIDRATANTE CORPORAL - LAVANDE-01 [Sem Fundo].png",
  "81432": "HIDRATANTE CORPORAL - VERT-01 [Sem Fundo].png",
  "81002": "POUR LE BAIN-01 [Sem fundo].png",
  "54050": "SABONETE CORPORAL - LAVENDE [Sem Fundo].png",
  "54540": "SABONETE CORPOTAL - VERT [Sem Fundo].png",
  "40352": "SABONETE LÍQUIDO PEROLADO - LAVANDE-01 [Sem Fundo].png",
  "40432": "SABONETE LÍQUIDO PEROLADO - VERT-01 [Sem Fundo].png",
  "40532": "SABONETE LÍQUIDO PEROLADO - ALLEZ-01 [Sem Fundo].png",
  // Cabelos
  "80902": "SHAMPOO-01 [Sem fundo].png",
};

// Sem foto bruta no material recebido (ficam com o placeholder "Pierre"):
// 1591 Adesivo de Pés, 11501 After Shave, 70541 Caixa de sabonetes,
// 70401 Sabonete em barra Lavande, LOR1245 Parafina Bronzeadora.

const LARGURA = 960;
const ALTURA = 1200;
const MARGEM = 72; // respiro ao redor do produto
const BRANCO = { r: 255, g: 255, b: 255, alpha: 1 };

async function existe(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

// Recorta o produto (remove borda branca/transparente), encaixa com margem em
// um quadro 4:5 branco e grava WebP nas duas larguras.
async function gerar(codigo, arquivo) {
  const origem = path.join(FONTE, arquivo);
  if (!(await existe(origem))) {
    console.warn(`(pulado) ${codigo}: não achei "${arquivo}"`);
    return false;
  }
  const base = sharp(origem, { limitInputPixels: false })
    .rotate()
    .flatten({ background: BRANCO })
    .trim({ background: BRANCO, threshold: 12 });
  // Passo 1: produto recortado e encaixado na área útil (quadro menos margens).
  const { data: miolo, info } = await base
    .resize({ width: LARGURA - 2 * MARGEM, height: ALTURA - 2 * MARGEM, fit: "inside", withoutEnlargement: false })
    .toBuffer({ resolveWithObject: true });
  // Passo 2: centraliza no quadro 960×1200 branco. (Feito em duas etapas porque
  // o sharp sempre aplica resize antes de extend dentro de um mesmo pipeline.)
  const sobraX = LARGURA - info.width;
  const sobraY = ALTURA - info.height;
  const grande = await sharp(miolo)
    .extend({
      left: Math.floor(sobraX / 2),
      right: Math.ceil(sobraX / 2),
      top: Math.floor(sobraY / 2),
      bottom: Math.ceil(sobraY / 2),
      background: BRANCO,
    })
    .toBuffer();
  await sharp(grande).webp({ quality: 82, effort: 5 }).toFile(path.join(SAIDA, `${codigo}-960.webp`));
  await sharp(grande).resize({ width: 480 }).webp({ quality: 80, effort: 5 }).toFile(path.join(SAIDA, `${codigo}-480.webp`));
  return true;
}

await mkdir(SAIDA, { recursive: true });
const codigos = [];
for (const [codigo, arquivo] of Object.entries(MAPA)) {
  if (await gerar(codigo, arquivo)) codigos.push(codigo);
}
codigos.sort();
await writeFile(MANIFESTO, JSON.stringify({ codigos }, null, 2) + "\n");
console.log(`ok: ${codigos.length} produto(s) com packshot em ${path.relative(process.cwd(), SAIDA)}; manifesto em ${path.relative(process.cwd(), MANIFESTO)}`);
