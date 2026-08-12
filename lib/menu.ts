// =============================================================================
// MENU DE NAVEGAÇÃO — lista de itens no banco (tabela site_menu), com dois
// níveis: itens principais (parent_id NULL) e submenus (parent_id = id do pai).
// Cada item tem um TIPO: link (item normal), botao (destacado) ou busca (caixa
// de procurar). Sem itens no banco, cai no menu padrão (o cabeçalho atual).
// =============================================================================
import { query } from "@/lib/db";
import { navEntries } from "@/lib/nav";
import { getCategorias } from "@/lib/categorias";
import { getPaginas } from "@/lib/cms";

export type MenuTipo = "link" | "botao" | "busca";
export type MenuItem = { id?: number; label: string; href: string; tipo: MenuTipo; children: MenuItem[] };

// Uma página do site que pode ser escolhida como destino de um link interno.
export type OpcaoLink = { grupo: string; label: string; href: string };

// Monta a lista de páginas internas para o seletor de link do menu:
// rotas fixas do site + categorias do catálogo + páginas do CMS.
export async function getOpcoesLinkInterno(): Promise<OpcaoLink[]> {
  const opcoes: OpcaoLink[] = [];

  const fixas: [string, string][] = [
    ["Início", "/"],
    ["A Pierre (sobre)", "/sobre"],
    ["Onde comprar", "/onde-comprar"],
    ["Seja consultora", "/consultora"],
    ["Fragrâncias", "/fragrancias"],
    ["Kits", "/kits"],
    ["Maison", "/maison"],
    ["Tratamentos", "/tratamentos"],
    ["Original", "/original"],
    ["Buscar", "/busca"],
  ];
  for (const [label, href] of fixas) opcoes.push({ grupo: "Páginas do site", label, href });

  try {
    const cats = await getCategorias();
    for (const c of cats) opcoes.push({ grupo: "Categorias", label: c.name, href: `/c/${c.slug}` });
  } catch {
    /* catálogo indisponível: segue sem categorias */
  }

  try {
    const paginas = await getPaginas();
    for (const p of paginas) {
      opcoes.push({
        grupo: "Páginas do CMS",
        label: p.status === "publicado" ? p.titulo : `${p.titulo} (rascunho)`,
        href: `/pagina/${p.slug}`,
      });
    }
  } catch {
    /* banco indisponível: segue sem páginas do CMS */
  }

  return opcoes;
}

// Menu atual (categorias do catálogo + institucionais + busca + botão CTA).
export function menuPadrao(): MenuItem[] {
  const links: MenuItem[] = navEntries.map((e) =>
    e.type === "mega"
      ? {
          label: e.label,
          href: e.href,
          tipo: "link",
          children: e.columns.map((c) => ({ label: c.label, href: c.href, tipo: "link" as MenuTipo, children: [] })),
        }
      : { label: e.label, href: e.href, tipo: "link", children: [] }
  );
  return [
    ...links,
    { label: "Buscar", href: "/busca", tipo: "busca", children: [] },
    { label: "Seja consultora", href: "/consultora", tipo: "botao", children: [] },
  ];
}

export type MenuRow = {
  id: number;
  label: string;
  href: string;
  tipo: MenuTipo;
  parent_id: number | null;
  ordem: number;
};

// Todas as linhas (para o editor do painel).
export async function getMenuRows(): Promise<MenuRow[]> {
  try {
    return await query<MenuRow>(
      "SELECT id, label, href, tipo, parent_id, ordem FROM site_menu ORDER BY ordem, id"
    );
  } catch {
    return [];
  }
}

// Monta a árvore (2 níveis) a partir das linhas.
export function montarArvore(rows: MenuRow[]): MenuItem[] {
  const tops = rows.filter((r) => r.parent_id == null);
  return tops.map((t) => ({
    id: t.id,
    label: t.label,
    href: t.href,
    tipo: t.tipo,
    children: rows
      .filter((c) => c.parent_id === t.id)
      .map((c) => ({ id: c.id, label: c.label, href: c.href, tipo: c.tipo, children: [] })),
  }));
}

// Menu para o site público: do banco, ou o padrão se vazio.
export async function getMenu(): Promise<MenuItem[]> {
  const rows = await getMenuRows();
  if (!rows.length) return menuPadrao();
  return montarArvore(rows);
}
