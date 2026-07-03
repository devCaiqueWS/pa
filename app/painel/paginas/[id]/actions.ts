"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/guard";
import { getPool, query } from "@/lib/db";
import { defDoTipo, slugify } from "@/lib/cms";

const EDIT_ROLES = ["admin", "admin_ti"];

// Campos do formulário que NÃO fazem parte da config do bloco.
const RESERVADOS = new Set(["paginaId", "blocoId", "nome", "tipo"]);

// --- Configurações da página (título, endereço, status, SEO) ------------------
export async function salvarPaginaAction(formData: FormData) {
  await requireRole(EDIT_ROLES, "/painel/paginas");

  const id = Number(formData.get("paginaId"));
  if (!id) return;
  const titulo = String(formData.get("titulo") || "").trim() || "Sem título";
  const slug = slugify(String(formData.get("slug") || "")) || `pagina-${id}`;
  const status = formData.get("status") === "publicado" ? "publicado" : "rascunho";
  const seoTitulo = String(formData.get("seo_titulo") || "").trim() || null;
  const seoDesc = String(formData.get("seo_descricao") || "").trim() || null;

  try {
    await query(
      "UPDATE site_paginas SET titulo = ?, slug = ?, status = ?, seo_titulo = ?, seo_descricao = ? WHERE id = ?",
      [titulo, slug, status, seoTitulo, seoDesc, id]
    );
  } catch {
    // Slug duplicado (chave única) — ignora a troca de slug e mantém o resto.
    await query(
      "UPDATE site_paginas SET titulo = ?, status = ?, seo_titulo = ?, seo_descricao = ? WHERE id = ?",
      [titulo, status, seoTitulo, seoDesc, id]
    );
  }

  revalidatePath(`/painel/paginas/${id}`);
  revalidatePath("/painel/paginas");
}

// --- Adicionar bloco ao final -------------------------------------------------
export async function adicionarBlocoAction(formData: FormData) {
  await requireRole(EDIT_ROLES, "/painel/paginas");

  const paginaId = Number(formData.get("paginaId"));
  const tipo = String(formData.get("tipo") || "");
  if (!paginaId || !defDoTipo(tipo)) return;
  const nome = String(formData.get("nome") || "").trim() || defDoTipo(tipo)!.label;

  const [max] = await query<{ m: number | null }>(
    "SELECT MAX(ordem) AS m FROM site_blocos WHERE pagina_id = ?",
    [paginaId]
  );
  const ordem = (max?.m ?? 0) + 1;

  const [res] = await getPool().execute(
    "INSERT INTO site_blocos (pagina_id, tipo, nome, ordem, config, ativo) VALUES (?, ?, ?, ?, '{}', 1)",
    [paginaId, tipo, nome, ordem]
  );
  const blocoId = (res as { insertId: number }).insertId;

  revalidatePath(`/painel/paginas/${paginaId}`);
  redirect(`/painel/paginas/${paginaId}?bloco=${blocoId}`);
}

// --- Salvar conteúdo de um bloco (nome + config genérica) ---------------------
export async function salvarBlocoAction(formData: FormData) {
  await requireRole(EDIT_ROLES, "/painel/paginas");

  const paginaId = Number(formData.get("paginaId"));
  const blocoId = Number(formData.get("blocoId"));
  if (!paginaId || !blocoId) return;
  const nome = String(formData.get("nome") || "").trim();

  // Tudo que não for reservado vira config. Como o formulário só mostra os
  // campos do tipo do bloco, a config sai coerente com o catálogo.
  const config: Record<string, string> = {};
  for (const [k, v] of formData.entries()) {
    if (RESERVADOS.has(k)) continue;
    config[k] = typeof v === "string" ? v : "";
  }

  await query("UPDATE site_blocos SET nome = ?, config = ? WHERE id = ? AND pagina_id = ?", [
    nome,
    JSON.stringify(config),
    blocoId,
    paginaId,
  ]);

  revalidatePath(`/painel/paginas/${paginaId}`);
  redirect(`/painel/paginas/${paginaId}?bloco=${blocoId}`);
}

// --- Mover bloco para cima/baixo ---------------------------------------------
export async function moverBlocoAction(formData: FormData) {
  await requireRole(EDIT_ROLES, "/painel/paginas");

  const paginaId = Number(formData.get("paginaId"));
  const blocoId = Number(formData.get("blocoId"));
  const dir = String(formData.get("dir")); // "cima" | "baixo"
  if (!paginaId || !blocoId) return;

  const blocos = await query<{ id: number }>(
    "SELECT id FROM site_blocos WHERE pagina_id = ? ORDER BY ordem, id",
    [paginaId]
  );
  const ids = blocos.map((b) => b.id);
  const i = ids.indexOf(blocoId);
  const j = dir === "cima" ? i - 1 : i + 1;
  if (i < 0 || j < 0 || j >= ids.length) return;

  [ids[i], ids[j]] = [ids[j], ids[i]];
  // Reescreve a ordem sequencial (1..n) conforme a nova posição.
  for (let k = 0; k < ids.length; k++) {
    await query("UPDATE site_blocos SET ordem = ? WHERE id = ?", [k + 1, ids[k]]);
  }

  revalidatePath(`/painel/paginas/${paginaId}`);
  redirect(`/painel/paginas/${paginaId}?bloco=${blocoId}`);
}

// --- Mostrar/ocultar bloco no site -------------------------------------------
export async function alternarBlocoAction(formData: FormData) {
  await requireRole(EDIT_ROLES, "/painel/paginas");

  const paginaId = Number(formData.get("paginaId"));
  const blocoId = Number(formData.get("blocoId"));
  if (!paginaId || !blocoId) return;

  await query(
    "UPDATE site_blocos SET ativo = 1 - ativo WHERE id = ? AND pagina_id = ?",
    [blocoId, paginaId]
  );

  revalidatePath(`/painel/paginas/${paginaId}`);
  redirect(`/painel/paginas/${paginaId}?bloco=${blocoId}`);
}

// --- Excluir bloco ------------------------------------------------------------
export async function excluirBlocoAction(formData: FormData) {
  await requireRole(EDIT_ROLES, "/painel/paginas");

  const paginaId = Number(formData.get("paginaId"));
  const blocoId = Number(formData.get("blocoId"));
  if (!paginaId || !blocoId) return;

  await query("DELETE FROM site_blocos WHERE id = ? AND pagina_id = ?", [blocoId, paginaId]);

  revalidatePath(`/painel/paginas/${paginaId}`);
  redirect(`/painel/paginas/${paginaId}`);
}
