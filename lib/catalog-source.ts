// =============================================================================
// FONTE DE CATÁLOGO DO SITE
// O site lê PRODUTOS do CMS (Supabase). Se o Supabase não estiver configurado
// (ou vazio), cai no catálogo estático de lib/catalog.ts — assim o site roda
// em qualquer ambiente. As CATEGORIAS seguem estáticas (taxonomia estável que
// alimenta menu/atalhos); só os produtos são gerenciáveis pelo CMS por ora.
// =============================================================================
import { createClient } from "@/lib/supabase/server";
import {
  products as staticProducts,
  type Product,
} from "@/lib/catalog";

// Reexporta tudo de categorias (estático) para um import único nas páginas.
export {
  categories,
  getCategory,
  type Category,
  type Product,
} from "@/lib/catalog";

type Row = {
  slug: string;
  name: string;
  line: string | null;
  gender: string | null;
  family: string | null;
  short_desc: string | null;
  image: string | null;
  badges: string[] | null;
  featured: boolean;
  is_new: boolean;
  position: number;
  categories: { slug: string } | null;
  subcategories: { slug: string } | null;
};

function mapRow(r: Row): Product {
  return {
    slug: r.slug,
    name: r.name,
    categorySlug: r.categories?.slug ?? "",
    subcategorySlug: r.subcategories?.slug ?? undefined,
    line: r.line ?? undefined,
    gender: (r.gender as Product["gender"]) ?? undefined,
    family: r.family ?? undefined,
    shortDesc: r.short_desc ?? "",
    image: r.image ?? "",
    badges: r.badges ?? [],
    featured: r.featured,
    isNew: r.is_new,
  };
}

const SELECT =
  "slug,name,line,gender,family,short_desc,image,badges,featured,is_new,position,categories(slug),subcategories(slug)";

// Busca todos os produtos ativos. Fallback: catálogo estático.
export async function getProducts(): Promise<Product[]> {
  const supabase = await createClient();
  if (!supabase) return staticProducts;
  const { data, error } = await supabase
    .from("products")
    .select(SELECT)
    .eq("active", true)
    .order("position", { ascending: true });
  if (error || !data || data.length === 0) return staticProducts;
  return (data as unknown as Row[]).map(mapRow);
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
  return all.filter((p) => p.featured).slice(0, limit);
}

export async function newProducts(limit = 8): Promise<Product[]> {
  const all = await getProducts();
  return all.filter((p) => p.isNew).slice(0, limit);
}

export async function relatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const all = await getProducts();
  return all
    .filter((p) => p.categorySlug === product.categorySlug && p.slug !== product.slug)
    .slice(0, limit);
}
