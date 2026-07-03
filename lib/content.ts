// =============================================================================
// CONTEÚDO EDITÁVEL DO SITE (CMS)
// Textos gerenciados no /painel e guardados na tabela site_textos.
// As leituras são resilientes: se a tabela ainda não existir (ou der erro),
// retornam vazio e as páginas usam seus textos-padrão (fallback).
// =============================================================================
import { query } from "@/lib/db";

export type Texto = {
  chave: string;
  titulo: string;
  grupo: string;
  tipo: string;
  valor: string | null;
};

// Mapa chave -> valor, para uso nas páginas públicas: t.chave ?? "padrão".
export async function getTextosMap(): Promise<Record<string, string>> {
  try {
    const rows = await query<{ chave: string; valor: string | null }>(
      "SELECT chave, valor FROM site_textos"
    );
    const map: Record<string, string> = {};
    for (const r of rows) if (r.valor != null) map[r.chave] = r.valor;
    return map;
  } catch {
    return {};
  }
}

// Lista completa (com rótulos e grupos) para a tela de edição do painel.
export async function getTextos(): Promise<Texto[]> {
  try {
    return await query<Texto>(
      "SELECT chave, titulo, grupo, tipo, valor FROM site_textos ORDER BY grupo, chave"
    );
  } catch {
    return [];
  }
}
