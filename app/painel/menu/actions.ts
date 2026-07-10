"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/guard";
import { getPool, query } from "@/lib/db";
import type { MenuTipo } from "@/lib/menu";

const EDIT_ROLES = ["admin", "admin_ti"];
const TIPOS: MenuTipo[] = ["link", "botao", "busca"];

function normalizaTipo(t: unknown): MenuTipo {
  return TIPOS.includes(t as MenuTipo) ? (t as MenuTipo) : "link";
}

function revalida() {
  // O menu aparece em todas as páginas -> revalida o layout inteiro.
  revalidatePath("/", "layout");
  revalidatePath("/painel/menu");
}

// Adiciona um item (principal se parentId=null, senão submenu). Retorna o id.
export async function adicionarItemMenu(input: {
  label: string;
  href: string;
  tipo: string;
  parentId: number | null;
}): Promise<{ id: number }> {
  await requireRole(EDIT_ROLES, "/painel/menu");

  const label = String(input.label || "").trim() || "Novo item";
  const href = String(input.href || "").trim() || "#";
  const tipo = normalizaTipo(input.tipo);
  const parentId = input.parentId ?? null;

  const [max] = await query<{ m: number | null }>(
    "SELECT MAX(ordem) AS m FROM site_menu WHERE " + (parentId == null ? "parent_id IS NULL" : "parent_id = ?"),
    parentId == null ? [] : [parentId]
  );
  const ordem = (max?.m ?? 0) + 1;

  const [res] = await getPool().execute(
    "INSERT INTO site_menu (label, href, tipo, parent_id, ordem, ativo) VALUES (?, ?, ?, ?, ?, 1)",
    [label, href, tipo, parentId, ordem]
  );
  revalida();
  return { id: (res as { insertId: number }).insertId };
}

// Salva o conteúdo de um item.
export async function salvarItemMenu(input: {
  id: number;
  label: string;
  href: string;
  tipo: string;
}): Promise<void> {
  await requireRole(EDIT_ROLES, "/painel/menu");
  const id = Number(input.id);
  if (!id) return;
  const label = String(input.label || "").trim() || "Item";
  const href = String(input.href || "").trim() || "#";
  const tipo = normalizaTipo(input.tipo);

  await query("UPDATE site_menu SET label = ?, href = ?, tipo = ? WHERE id = ?", [label, href, tipo, id]);
  revalida();
}

// Exclui um item (e seus submenus, por cascata).
export async function excluirItemMenu(input: { id: number }): Promise<void> {
  await requireRole(EDIT_ROLES, "/painel/menu");
  const id = Number(input.id);
  if (!id) return;
  await query("DELETE FROM site_menu WHERE id = ?", [id]);
  revalida();
}

// Reordena os itens de um nível (parent_id) conforme a lista de ids recebida.
export async function reordenarMenu(input: {
  parentId: number | null;
  orderedIds: number[];
}): Promise<void> {
  await requireRole(EDIT_ROLES, "/painel/menu");
  const ids = (input.orderedIds || []).map(Number).filter(Boolean);
  for (let i = 0; i < ids.length; i++) {
    await query("UPDATE site_menu SET ordem = ? WHERE id = ?", [i + 1, ids[i]]);
  }
  revalida();
}
