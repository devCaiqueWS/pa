"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/guard";
import { query } from "@/lib/db";

// Perfis que podem editar conteúdo do site.
const EDIT_ROLES = ["admin", "admin_ti"];

export async function saveTextoAction(formData: FormData) {
  await requireRole(EDIT_ROLES, "/painel/textos");

  const chave = String(formData.get("chave") || "");
  const valor = String(formData.get("valor") || "");
  if (!chave) return;

  await query("UPDATE site_textos SET valor = ? WHERE chave = ?", [valor, chave]);

  // Reflete a edição no painel e no site público.
  revalidatePath("/painel/textos");
  revalidatePath("/");
}
