// =============================================================================
// PRODUTOS DO SITE — camada sobre o catálogo do ERP (Bling).
//
// Origem: ofc_pierre_produto_bling_espelho (base: bling_id, código, nome, preço)
// enriquecida por ofc_pc_produtos (descrição, categoria do ERP, tags, imagem).
// Um produto entra no site quando carrega a TAG configurada (padrão
// "Agrupamento:Origem"). A tabela site_produtos guarda a CURADORIA (categoria-de-
// vitrine, destaque, ordem, visível, imagem caprichada), ligada por bling_id.
//
// Se o ERP estiver indisponível, cai no catálogo estático (lib/catalog).
// =============================================================================
import { query } from "@/lib/db";
import { slugify } from "@/lib/cms";
import { products as PRODUTOS_ESTATICOS, type Product } from "@/lib/catalog";

export type ProdutoAdmin = Product & {
  blingId: number;
  codigo: string;
  visivel: boolean;
  categoriaErp: string; // categoria original do ERP (para referência/mapa)
  temCuradoria: boolean;
};

// ---- Configuração (tag que marca o produto + mapa categoria ERP->site) ----
type MapaItem = { categoria: string; sub?: string };
export type CfgProdutos = { tags: string[]; mapa: Record<string, MapaItem> };

export const CFG_PADRAO: CfgProdutos = {
  tags: ["Agrupamento:Origem"],
  mapa: {
    Desodorante: { categoria: "desodorantes" },
    Perfumaria: { categoria: "perfumaria" },
    "Águas Virtuosas": { categoria: "perfumaria", sub: "aguas-virtuosas" },
    "Body Splash": { categoria: "perfumaria", sub: "body-splash" },
    "Body Spray": { categoria: "perfumaria" },
    "Cuidados Especiais": { categoria: "cuidado-facial" },
    "Sabonete Líquido": { categoria: "corpo-banho", sub: "sabonetes" },
    "Sabonete em Barra": { categoria: "corpo-banho", sub: "sabonetes" },
    "Hidratante Corporal": { categoria: "corpo-banho", sub: "hidratantes" },
    "Oleo Corporal": { categoria: "corpo-banho" },
    "Talco Liquido": { categoria: "corpo-banho" },
    Bronzeador: { categoria: "corpo-banho" },
    "Creme Mãos": { categoria: "corpo-banho" },
    Barba: { categoria: "corpo-banho" },
    Shampoos: { categoria: "cabelos" },
    Aromatizador: { categoria: "casa" },
    "Roupa e Lençol": { categoria: "casa" },
  },
};

export async function getCfgProdutos(): Promise<CfgProdutos> {
  try {
    const rows = await query<{ config: string | null }>("SELECT config FROM site_produtos_cfg WHERE id = 1");
    const raw = rows[0]?.config;
    if (!raw) return CFG_PADRAO;
    const p = JSON.parse(raw) as Partial<CfgProdutos>;
    return {
      tags: Array.isArray(p.tags) && p.tags.length ? p.tags.map(String) : CFG_PADRAO.tags,
      mapa: p.mapa && typeof p.mapa === "object" ? (p.mapa as CfgProdutos["mapa"]) : CFG_PADRAO.mapa,
    };
  } catch {
    return CFG_PADRAO;
  }
}

// ---- Helpers ----
function textoLimpo(html: string | null): string {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 180);
}

function imagemDoBling(midia: unknown): string {
  let m = midia;
  if (typeof m === "string") {
    try {
      m = JSON.parse(m);
    } catch {
      return "";
    }
  }
  const im = (m as { imagens?: { internas?: { link?: string }[]; externas?: { link?: string }[] } })?.imagens;
  if (!im) return "";
  const arr = (im.internas && im.internas.length ? im.internas : im.externas) || [];
  return arr[0]?.link || "";
}

type Row = {
  bling_id: number;
  codigo: string | null;
  nome: string;
  preco: string | number | null;
  descricao_curta: string | null;
  categoria_erp: string | null;
  midia_json: string | null;
  s_slug: string | null;
  s_cat: string | null;
  s_sub: string | null;
  s_imagem: string | null;
  s_destaque: number | null;
  s_novo: number | null;
  s_visivel: number | null;
  s_ordem: number | null;
};

// Carrega TODOS os produtos elegíveis (com a tag), já mapeados e com slug único.
// `incluirOcultos`: admin (true) vê inclusive os marcados como não-visíveis.
async function carregarElegiveis(incluirOcultos: boolean): Promise<ProdutoAdmin[]> {
  const cfg = await getCfgProdutos();
  const tags = cfg.tags.length ? cfg.tags : CFG_PADRAO.tags;
  const cond = tags.map(() => "JSON_SEARCH(p.tags, 'one', ?) IS NOT NULL").join(" OR ");

  const rows = await query<Row>(
    `SELECT e.produto_bling_id AS bling_id, e.codigo, e.nome, e.preco,
            p.descricao_curta, p.categoria AS categoria_erp, p.midia_json,
            s.slug AS s_slug, s.categoria_slug AS s_cat, s.subcategoria_slug AS s_sub,
            s.imagem AS s_imagem, s.destaque AS s_destaque, s.novo AS s_novo,
            s.visivel AS s_visivel, s.ordem AS s_ordem
       FROM ofc_pierre_produto_bling_espelho e
       JOIN ofc_pc_produtos p ON p.bling_id = e.produto_bling_id
       LEFT JOIN site_produtos s ON s.bling_id = e.produto_bling_id
      WHERE p.ativo = 1 AND (${cond})
      ORDER BY COALESCE(s.ordem, 9999), e.nome`,
    tags
  );

  const vistos = new Set<string>();
  const lista: ProdutoAdmin[] = [];
  for (const r of rows) {
    const visivel = r.s_visivel == null ? true : r.s_visivel === 1;
    if (!incluirOcultos && !visivel) continue;

    const mapa = cfg.mapa[r.categoria_erp || ""] || undefined;
    const categoria = (r.s_cat || mapa?.categoria || "").trim();
    const sub = (r.s_sub || mapa?.sub || "").trim();

    let slug = (r.s_slug || slugify(r.nome) || `produto-${r.bling_id}`).trim();
    if (vistos.has(slug)) slug = `${slug}-${String(r.bling_id).slice(-4)}`;
    vistos.add(slug);

    const preco = r.preco == null ? undefined : Number(r.preco);

    lista.push({
      slug,
      name: r.nome,
      categorySlug: categoria,
      subcategorySlug: sub || undefined,
      shortDesc: textoLimpo(r.descricao_curta),
      image: r.s_imagem || imagemDoBling(r.midia_json) || "",
      preco: Number.isFinite(preco) ? preco : undefined,
      featured: r.s_destaque === 1,
      isNew: r.s_novo === 1,
      blingId: r.bling_id,
      codigo: r.codigo || "",
      visivel,
      categoriaErp: r.categoria_erp || "",
      temCuradoria: r.s_slug != null || r.s_cat != null || r.s_imagem != null,
    });
  }
  return lista;
}

// ---- API pública (site) — mesmas assinaturas que o catalog-source antigo ----
export async function getProducts(): Promise<Product[]> {
  try {
    const list = await carregarElegiveis(false);
    return list.length ? list : PRODUTOS_ESTATICOS;
  } catch {
    return PRODUTOS_ESTATICOS;
  }
}

export async function productsByCategory(slug: string): Promise<Product[]> {
  const all = await getProducts();
  return all.filter((p) => p.categorySlug === slug);
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  const all = await getProducts();
  return all.find((p) => p.slug === slug);
}

export async function featuredProducts(limit = 8): Promise<Product[]> {
  const all = await getProducts();
  const dest = all.filter((p) => p.featured);
  return (dest.length ? dest : all).slice(0, limit);
}

export async function newProducts(limit = 8): Promise<Product[]> {
  const all = await getProducts();
  return all.filter((p) => p.isNew).slice(0, limit);
}

export async function relatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const all = await getProducts();
  return all.filter((p) => p.categorySlug === product.categorySlug && p.slug !== product.slug).slice(0, limit);
}

// ---- API do painel (curadoria) ----
export async function getProdutosAdmin(): Promise<ProdutoAdmin[]> {
  try {
    return await carregarElegiveis(true);
  } catch {
    return [];
  }
}

export async function getProdutoEdit(blingId: number): Promise<ProdutoAdmin | undefined> {
  const all = await getProdutosAdmin();
  return all.find((p) => p.blingId === blingId);
}
