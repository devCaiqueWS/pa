"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/guard";
import { getPool } from "@/lib/db";
import type { SiteConfig } from "@/lib/site-config";

const EDIT_ROLES = ["admin", "admin_ti"];

export async function salvarCabecalhoAction(formData: FormData) {
  await requireRole(EDIT_ROLES, "/painel/cabecalho");

  // Faixa do topo: pares de campos faixa{i}_texto / faixa{i}_link (na ordem
  // em que o editor arrastável enviou).
  const topStrip: { texto: string; link: string }[] = [];
  for (let i = 1; i <= 30; i++) {
    const texto = String(formData.get(`faixa${i}_texto`) || "").trim();
    if (!texto) continue;
    const link = String(formData.get(`faixa${i}_link`) || "").trim();
    topStrip.push({ texto, link });
  }

  const data: SiteConfig = {
    headerLogoUrl: String(formData.get("header_logo_url") || "").trim(),
    faviconUrl: String(formData.get("favicon_url") || "").trim(),
    topStrip,
  };

  await getPool().execute(
    "INSERT INTO site_config (id, config) VALUES (1, ?) ON DUPLICATE KEY UPDATE config = VALUES(config)",
    [JSON.stringify(data)]
  );

  // Logo, favicon e faixa do topo aparecem em todas as páginas -> revalida layout.
  revalidatePath("/", "layout");
  revalidatePath("/painel/cabecalho");
}
