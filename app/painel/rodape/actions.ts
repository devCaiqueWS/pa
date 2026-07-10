"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/guard";
import { getPool } from "@/lib/db";
import type { FooterData, FooterLink } from "@/lib/footer";

const EDIT_ROLES = ["admin", "admin_ti"];

// Converte um textarea "Rótulo | /link" (uma linha por link) em lista.
function parseLinks(raw: string): FooterLink[] {
  return raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const [label, href] = l.split("|").map((s) => s.trim());
      return { label: label || "", href: href || "#" };
    })
    .filter((l) => l.label);
}

export async function salvarRodapeAction(formData: FormData) {
  await requireRole(EDIT_ROLES, "/painel/rodape");

  const numColunas = Math.min(Math.max(Number(formData.get("num_colunas")) || 4, 1), 6);
  const colunas = [];
  for (let i = 1; i <= numColunas; i++) {
    colunas.push({
      titulo: String(formData.get(`col${i}_titulo`) || "").trim(),
      links: parseLinks(String(formData.get(`col${i}_links`) || "")),
    });
  }

  const data: FooterData = {
    logoUrl: String(formData.get("logo_url") || "").trim(),
    marcaTexto: String(formData.get("marca_texto") || "").trim(),
    sacTexto: String(formData.get("sac_texto") || "").trim(),
    colunas,
    rodapeTexto: String(formData.get("rodape_texto") || "").trim(),
    social: parseLinks(String(formData.get("social") || "")),
  };

  // Linha única id=1: cria na primeira vez, atualiza nas próximas.
  await getPool().execute(
    "INSERT INTO site_footer (id, config) VALUES (1, ?) ON DUPLICATE KEY UPDATE config = VALUES(config)",
    [JSON.stringify(data)]
  );

  // O rodapé aparece em todas as páginas -> revalida o layout inteiro.
  revalidatePath("/", "layout");
  revalidatePath("/painel/rodape");
}
