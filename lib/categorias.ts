// =============================================================================
// CATEGORIAS GERENCIÁVEIS — lidas da tabela site_categorias (linha única id=1,
// lista em JSON). Sem a linha, cai nas categorias PADRÃO (lib/catalog.ts), então
// o site nunca fica sem categorias. Mesmo padrão de site_config / site_footer.
// As páginas do site devem ler daqui (getCategorias), não do array estático.
// =============================================================================
import { query } from "@/lib/db";
import { categories as CATEGORIAS_PADRAO, type Category, type Subcategory } from "@/lib/catalog";

export type { Category, Subcategory };
export { CATEGORIAS_PADRAO };

function normSub(x: unknown): Subcategory | null {
  if (!x || typeof x !== "object") return null;
  const o = x as Record<string, unknown>;
  const name = String(o.name ?? "").trim();
  const slug = String(o.slug ?? "").trim();
  return name && slug ? { slug, name } : null;
}

function normCat(x: unknown): Category | null {
  if (!x || typeof x !== "object") return null;
  const o = x as Record<string, unknown>;
  const name = String(o.name ?? "").trim();
  const slug = String(o.slug ?? "").trim();
  if (!name || !slug) return null;
  const subs = Array.isArray(o.subcategories)
    ? o.subcategories.map(normSub).filter((s): s is Subcategory => !!s)
    : [];
  return {
    slug,
    name,
    tagline: String(o.tagline ?? "").trim(),
    image: String(o.image ?? "").trim(),
    subcategories: subs,
  };
}

// Lista de categorias efetiva (banco ou padrão).
export async function getCategorias(): Promise<Category[]> {
  try {
    const rows = await query<{ config: string | null }>("SELECT config FROM site_categorias WHERE id = 1");
    const raw = rows[0]?.config;
    if (!raw) return CATEGORIAS_PADRAO;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return CATEGORIAS_PADRAO;
    const list = parsed.map(normCat).filter((c): c is Category => !!c);
    return list.length ? list : CATEGORIAS_PADRAO;
  } catch {
    return CATEGORIAS_PADRAO;
  }
}

export async function getCategoriaBySlug(slug: string): Promise<Category | undefined> {
  const all = await getCategorias();
  return all.find((c) => c.slug === slug);
}
