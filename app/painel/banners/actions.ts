"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/guard";
import { getPool } from "@/lib/db";
import { normalizarLista } from "@/lib/banners";

const EDIT_ROLES = ["admin", "admin_ti"];

export async function salvarBannersAction(formData: FormData) {
  await requireRole(EDIT_ROLES, "/painel/banners");

  const banners = normalizarLista(String(formData.get("banners_json") || ""));

  await getPool().execute(
    "INSERT INTO site_banners (id, config) VALUES (1, ?) ON DUPLICATE KEY UPDATE config = VALUES(config)",
    [JSON.stringify(banners)]
  );

  // O carrossel aparece na home (bloco do CMS) — revalida o site inteiro.
  revalidatePath("/", "layout");
  revalidatePath("/painel/banners");
}
