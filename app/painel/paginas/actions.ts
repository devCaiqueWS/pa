"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/guard";
import { getPool, query } from "@/lib/db";
import { slugify } from "@/lib/cms";

// Perfis que podem editar conteúdo do site (mesmo critério do módulo Textos).
const EDIT_ROLES = ["admin", "admin_ti"];

// Garante um slug único: se "sobre" já existe, tenta "sobre-2", "sobre-3"...
async function slugUnico(base: string): Promise<string> {
  let slug = slugify(base) || "pagina";
  const existentes = await query<{ slug: string }>(
    "SELECT slug FROM site_paginas WHERE slug = ? OR slug LIKE ?",
    [slug, `${slug}-%`]
  );
  const usados = new Set(existentes.map((r) => r.slug));
  if (usados.has(slug)) {
    let n = 2;
    while (usados.has(`${slug}-${n}`)) n++;
    slug = `${slug}-${n}`;
  }
  return slug;
}

export async function criarPaginaAction(formData: FormData) {
  await requireRole(EDIT_ROLES, "/painel/paginas");

  const titulo = String(formData.get("titulo") || "").trim();
  if (!titulo) return;
  const slug = await slugUnico(String(formData.get("slug") || "") || titulo);

  const [res] = await getPool().execute(
    "INSERT INTO site_paginas (slug, titulo, status) VALUES (?, ?, 'rascunho')",
    [slug, titulo]
  );
  const id = (res as { insertId: number }).insertId;

  revalidatePath("/painel/paginas");
  redirect(`/painel/paginas/${id}`);
}

export async function excluirPaginaAction(formData: FormData) {
  await requireRole(EDIT_ROLES, "/painel/paginas");

  const id = Number(formData.get("id"));
  if (!id) return;

  // Os blocos somem junto (ON DELETE CASCADE na tabela).
  await query("DELETE FROM site_paginas WHERE id = ?", [id]);

  revalidatePath("/painel/paginas");
}

// Duplica uma página inteira (com todos os blocos) como um novo RASCUNHO.
// Útil para montar uma estrutura-modelo uma vez e depois só trocar o conteúdo.
export async function duplicarPaginaAction(formData: FormData) {
  await requireRole(EDIT_ROLES, "/painel/paginas");

  const id = Number(formData.get("id"));
  if (!id) return;

  // 1) lê a página de origem
  const origem = await query<{
    titulo: string;
    seo_titulo: string | null;
    seo_descricao: string | null;
  }>("SELECT titulo, seo_titulo, seo_descricao FROM site_paginas WHERE id = ?", [id]);
  if (!origem[0]) return;

  // 2) cria a cópia (sempre rascunho, com slug único)
  const novoTitulo = `${origem[0].titulo} (cópia)`;
  const novoSlug = await slugUnico(novoTitulo);
  const [res] = await getPool().execute(
    "INSERT INTO site_paginas (slug, titulo, status, seo_titulo, seo_descricao) VALUES (?, ?, 'rascunho', ?, ?)",
    [novoSlug, novoTitulo, origem[0].seo_titulo, origem[0].seo_descricao]
  );
  const novoId = (res as { insertId: number }).insertId;

  // 3) copia todos os blocos preservando ordem, config e visibilidade
  await getPool().execute(
    `INSERT INTO site_blocos (pagina_id, tipo, nome, ordem, config, ativo)
     SELECT ?, tipo, nome, ordem, config, ativo FROM site_blocos WHERE pagina_id = ?`,
    [novoId, id]
  );

  revalidatePath("/painel/paginas");
  redirect(`/painel/paginas/${novoId}`);
}
