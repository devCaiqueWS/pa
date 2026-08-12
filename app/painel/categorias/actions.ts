"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/guard";
import { getPool } from "@/lib/db";
import { slugify } from "@/lib/cms";
import type { Category, Subcategory } from "@/lib/catalog";

const EDIT_ROLES = ["admin", "admin_ti"];

// Garante um slug único dentro de um conjunto já usado.
function slugUnico(base: string, usados: Set<string>): string {
  let s = base;
  let i = 2;
  while (usados.has(s)) s = `${base}-${i++}`;
  usados.add(s);
  return s;
}

function normalizar(raw: string): Category[] {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(data)) return [];

  const usados = new Set<string>();
  const cats: Category[] = [];

  for (const c of data) {
    const o = (c && typeof c === "object" ? c : {}) as Record<string, unknown>;
    const name = String(o.name ?? "").trim();
    if (!name) continue;
    const base = slugify(String(o.slug ?? "").trim() || name);
    if (!base) continue;
    const slug = slugUnico(base, usados);

    const subsRaw = Array.isArray(o.subcategories) ? o.subcategories : [];
    const usadosSub = new Set<string>();
    const subcategories: Subcategory[] = [];
    for (const sc of subsRaw) {
      const so = (sc && typeof sc === "object" ? sc : {}) as Record<string, unknown>;
      const sn = String(so.name ?? "").trim();
      if (!sn) continue;
      const sbase = slugify(String(so.slug ?? "").trim() || sn);
      if (!sbase) continue;
      subcategories.push({ slug: slugUnico(sbase, usadosSub), name: sn });
    }

    cats.push({
      slug,
      name,
      tagline: String(o.tagline ?? "").trim(),
      image: String(o.image ?? "").trim(),
      subcategories,
    });
  }

  return cats;
}

export async function salvarCategoriasAction(formData: FormData) {
  await requireRole(EDIT_ROLES, "/painel/categorias");

  const cats = normalizar(String(formData.get("categorias_json") || ""));

  await getPool().execute(
    "INSERT INTO site_categorias (id, config) VALUES (1, ?) ON DUPLICATE KEY UPDATE config = VALUES(config)",
    [JSON.stringify(cats)]
  );

  // Categorias afetam menu, atalhos e páginas /c -> revalida tudo.
  revalidatePath("/", "layout");
  revalidatePath("/painel/categorias");
}
