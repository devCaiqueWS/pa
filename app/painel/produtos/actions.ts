"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/guard";
import { getPool } from "@/lib/db";
import { slugify } from "@/lib/cms";
import { getCfgProdutos } from "@/lib/produtos";

const EDIT_ROLES = ["admin", "admin_ti"];

// Salva a curadoria de um produto (linha em site_produtos, chave = bling_id).
export async function salvarProdutoCuradoriaAction(formData: FormData) {
  await requireRole(EDIT_ROLES, "/painel/produtos");

  const blingId = Number(formData.get("bling_id"));
  if (!blingId) return;

  const slug = slugify(String(formData.get("slug") || "").trim());
  const categoria = String(formData.get("categoria_slug") || "").trim();
  const sub = String(formData.get("subcategoria_slug") || "").trim();
  const imagem = String(formData.get("imagem") || "").trim();
  const destaque = formData.get("destaque") ? 1 : 0;
  const novo = formData.get("novo") ? 1 : 0;
  const visivel = formData.get("visivel") ? 1 : 0;
  const ordem = Number(formData.get("ordem")) || 0;

  await getPool().execute(
    `INSERT INTO site_produtos (bling_id, slug, categoria_slug, subcategoria_slug, imagem, destaque, novo, visivel, ordem)
     VALUES (?,?,?,?,?,?,?,?,?)
     ON DUPLICATE KEY UPDATE slug=VALUES(slug), categoria_slug=VALUES(categoria_slug),
       subcategoria_slug=VALUES(subcategoria_slug), imagem=VALUES(imagem), destaque=VALUES(destaque),
       novo=VALUES(novo), visivel=VALUES(visivel), ordem=VALUES(ordem)`,
    [blingId, slug, categoria, sub, imagem, destaque, novo, visivel, ordem]
  );

  revalidatePath("/", "layout");
  revalidatePath("/painel/produtos");
}

// Salva a configuração: quais tags marcam um produto como "do site".
export async function salvarCfgProdutosAction(formData: FormData) {
  await requireRole(EDIT_ROLES, "/painel/produtos");

  const tags = String(formData.get("tags") || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const atual = await getCfgProdutos();
  const cfg = { tags: tags.length ? tags : atual.tags, mapa: atual.mapa };

  await getPool().execute(
    "INSERT INTO site_produtos_cfg (id, config) VALUES (1, ?) ON DUPLICATE KEY UPDATE config = VALUES(config)",
    [JSON.stringify(cfg)]
  );

  revalidatePath("/", "layout");
  revalidatePath("/painel/produtos");
}
