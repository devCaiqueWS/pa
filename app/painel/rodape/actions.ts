"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/guard";
import { getPool } from "@/lib/db";
import type { FooterColumn, FooterData, FooterLink } from "@/lib/footer";

const EDIT_ROLES = ["admin", "admin_ti"];
const MAX_COLUNAS = 6;

// Normaliza uma lista de links vinda do editor (array {label, href}).
function normLinks(arr: unknown): FooterLink[] {
  if (!Array.isArray(arr)) return [];
  return arr
    .map((x): FooterLink | null => {
      if (!x || typeof x !== "object") return null;
      const o = x as Record<string, unknown>;
      const label = String(o.label ?? "").trim();
      const href = String(o.href ?? "").trim() || "#";
      return label ? { label, href } : null;
    })
    .filter((x): x is FooterLink => !!x);
}

// Lê um campo JSON do formulário com segurança (nunca lança).
function parseJson(raw: FormDataEntryValue | null): unknown {
  try {
    return JSON.parse(String(raw || ""));
  } catch {
    return null;
  }
}

function parseColunas(raw: FormDataEntryValue | null): FooterColumn[] {
  const data = parseJson(raw);
  if (!Array.isArray(data)) return [];
  return data.slice(0, MAX_COLUNAS).map((c) => {
    const o = (c && typeof c === "object" ? c : {}) as Record<string, unknown>;
    return { titulo: String(o.titulo ?? "").trim(), links: normLinks(o.links) };
  });
}

export async function salvarRodapeAction(formData: FormData) {
  await requireRole(EDIT_ROLES, "/painel/rodape");

  const data: FooterData = {
    logoUrl: String(formData.get("logo_url") || "").trim(),
    marcaTexto: String(formData.get("marca_texto") || "").trim(),
    sacTexto: String(formData.get("sac_texto") || "").trim(),
    colunas: parseColunas(formData.get("colunas_json")),
    rodapeTexto: String(formData.get("rodape_texto") || "").trim(),
    social: normLinks(parseJson(formData.get("social_json"))),
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
