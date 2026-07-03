// =============================================================================
// CMS DE BLOCOS — camada de leitura e catálogo de tipos de bloco.
//
// Uma PÁGINA é montada por uma lista ordenada de BLOCOS. Cada bloco tem um
// `tipo` (hero, texto, cta, colunas, produtos) e uma `config` (JSON) com os
// campos daquele tipo. O "catálogo" abaixo define, num único lugar, quais
// campos cada tipo tem — o editor do painel e o renderizador do site leem daqui,
// então basta mexer aqui para os dois lados ficarem em sincronia.
//
// Leituras resilientes: se a tabela ainda não existir, retornam vazio/null e o
// site segue funcionando (mesmo padrão de lib/content.ts).
// =============================================================================
import { query } from "@/lib/db";

// ----------------------------------------------------------------------------
// Tipos
// ----------------------------------------------------------------------------
export type BlocoTipo = "hero" | "texto" | "cta" | "colunas" | "produtos" | "destaque";

export type Pagina = {
  id: number;
  slug: string;
  titulo: string;
  status: "rascunho" | "publicado";
  seo_titulo: string | null;
  seo_descricao: string | null;
};

export type Bloco = {
  id: number;
  pagina_id: number;
  tipo: BlocoTipo;
  nome: string;
  ordem: number;
  ativo: number;
  config: Record<string, string>;
};

// ----------------------------------------------------------------------------
// Catálogo de blocos — a definição de cada tipo e seus campos editáveis.
// `campos` é a lista de campos simples; `colunas` marca blocos com N colunas
// repetidas (o editor gera os campos col1_*, col2_* ... automaticamente).
// ----------------------------------------------------------------------------
export type Campo = {
  name: string;
  label: string;
  tipo: "text" | "textarea" | "url" | "select";
  opcoes?: { valor: string; label: string }[];
  ajuda?: string;
};

export type DefBloco = {
  tipo: BlocoTipo;
  label: string;
  descricao: string;
  campos: Campo[];
  colunas?: { max: number; campos: Campo[] }; // blocos com colunas repetidas
};

const alinhamento: Campo = {
  name: "alinhamento",
  label: "Alinhamento",
  tipo: "select",
  opcoes: [
    { valor: "esquerda", label: "À esquerda" },
    { valor: "centro", label: "Centralizado" },
  ],
};

const botaoEstilo: Campo = {
  name: "botao_estilo",
  label: "Estilo do botão",
  tipo: "select",
  opcoes: [
    { valor: "primario", label: "Primário (preenchido)" },
    { valor: "secundario", label: "Secundário (contorno)" },
  ],
};

export const CATALOGO: DefBloco[] = [
  {
    tipo: "hero",
    label: "Banner de topo (hero)",
    descricao: "Bloco grande de destaque: imagem, chamada e botão. Ideal para o topo da página.",
    campos: [
      { name: "eyebrow", label: "Selo (linha pequena acima do título)", tipo: "text" },
      { name: "titulo", label: "Título", tipo: "text" },
      { name: "subtitulo", label: "Subtítulo", tipo: "textarea" },
      { name: "imagem_url", label: "Imagem de fundo (URL)", tipo: "url", ajuda: "Cole o endereço de uma imagem. O upload direto entra na próxima etapa." },
      { name: "botao_texto", label: "Texto do botão", tipo: "text" },
      { name: "botao_link", label: "Link do botão", tipo: "text", ajuda: "Ex.: /p/produtos, https://... ou #ancora" },
      botaoEstilo,
      alinhamento,
    ],
  },
  {
    tipo: "destaque",
    label: "Destaque com imagem",
    descricao:
      "Imagem ao lado de um texto com título, parágrafos e até 3 botões. É o bloco 'produto/linha' clássico (Comprar / Encontrar consultora / Quero vender).",
    campos: [
      { name: "eyebrow", label: "Selo (linha pequena acima do título)", tipo: "text" },
      { name: "titulo", label: "Título", tipo: "text" },
      { name: "corpo", label: "Texto (uma linha em branco separa parágrafos)", tipo: "textarea" },
      { name: "imagem_url", label: "Imagem (URL)", tipo: "url", ajuda: "Ex.: /assets/img/desodorante-original.jpg" },
      {
        name: "imagem_lado",
        label: "Lado da imagem",
        tipo: "select",
        opcoes: [
          { valor: "direita", label: "À direita" },
          { valor: "esquerda", label: "À esquerda" },
        ],
      },
      { name: "tags", label: "Etiquetas (separadas por vírgula)", tipo: "text", ajuda: "Ex.: Uso diário, Creme, Recompra" },
      { name: "botao1_texto", label: "Botão 1 — texto", tipo: "text" },
      { name: "botao1_link", label: "Botão 1 — link", tipo: "text" },
      { name: "botao2_texto", label: "Botão 2 — texto", tipo: "text" },
      { name: "botao2_link", label: "Botão 2 — link", tipo: "text" },
      { name: "botao3_texto", label: "Botão 3 — texto", tipo: "text" },
      { name: "botao3_link", label: "Botão 3 — link", tipo: "text" },
    ],
  },
  {
    tipo: "texto",
    label: "Texto",
    descricao: "Um título e um parágrafo. Para conteúdo institucional e explicações.",
    campos: [
      { name: "titulo", label: "Título", tipo: "text" },
      { name: "corpo", label: "Texto", tipo: "textarea" },
      alinhamento,
    ],
  },
  {
    tipo: "cta",
    label: "Chamada com botão (CTA)",
    descricao: "Faixa de destaque com uma frase e um botão de ação. Ex.: 'Seja consultor(a)'.",
    campos: [
      { name: "titulo", label: "Título", tipo: "text" },
      { name: "texto", label: "Texto", tipo: "textarea" },
      { name: "botao_texto", label: "Texto do botão", tipo: "text" },
      { name: "botao_link", label: "Link do botão", tipo: "text" },
    ],
  },
  {
    tipo: "colunas",
    label: "Colunas",
    descricao: "2 a 4 colunas lado a lado, cada uma com título, texto e link. Bom para benefícios e destaques.",
    campos: [
      { name: "titulo", label: "Título da seção (opcional)", tipo: "text" },
      {
        name: "qtd",
        label: "Quantas colunas",
        tipo: "select",
        opcoes: [
          { valor: "2", label: "2 colunas" },
          { valor: "3", label: "3 colunas" },
          { valor: "4", label: "4 colunas" },
          { valor: "5", label: "5 colunas" },
          { valor: "6", label: "6 colunas" },
        ],
      },
    ],
    colunas: {
      max: 6,
      campos: [
        { name: "titulo", label: "Título", tipo: "text" },
        { name: "texto", label: "Texto", tipo: "textarea" },
        { name: "link", label: "Link (opcional)", tipo: "text" },
      ],
    },
  },
  {
    tipo: "produtos",
    label: "Vitrine de produtos",
    descricao: "Exibe produtos em destaque. (Conecta ao módulo de Produtos, que entra em breve.)",
    campos: [
      { name: "titulo", label: "Título", tipo: "text" },
      { name: "subtitulo", label: "Subtítulo", tipo: "text" },
    ],
  },
];

export function defDoTipo(tipo: string): DefBloco | undefined {
  return CATALOGO.find((d) => d.tipo === tipo);
}

// Transforma um título em slug: "Nossa História" -> "nossa-historia".
export function slugify(txt: string): string {
  return txt
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 150);
}

// ----------------------------------------------------------------------------
// Leituras
// ----------------------------------------------------------------------------
function parseConfig(raw: unknown): Record<string, string> {
  if (typeof raw !== "string" || !raw) return {};
  try {
    const o = JSON.parse(raw);
    return o && typeof o === "object" ? (o as Record<string, string>) : {};
  } catch {
    return {};
  }
}

type BlocoRow = Omit<Bloco, "config"> & { config: string | null };

// Lista de páginas para o painel.
export async function getPaginas(): Promise<Pagina[]> {
  try {
    return await query<Pagina>(
      "SELECT id, slug, titulo, status, seo_titulo, seo_descricao FROM site_paginas ORDER BY titulo"
    );
  } catch {
    return [];
  }
}

// Uma página pelo id (para o editor), sem os blocos.
export async function getPagina(id: number): Promise<Pagina | null> {
  try {
    const rows = await query<Pagina>(
      "SELECT id, slug, titulo, status, seo_titulo, seo_descricao FROM site_paginas WHERE id = ?",
      [id]
    );
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

// Uma página publicada pelo slug (para o site público).
export async function getPaginaPublicada(slug: string): Promise<Pagina | null> {
  try {
    const rows = await query<Pagina>(
      "SELECT id, slug, titulo, status, seo_titulo, seo_descricao FROM site_paginas WHERE slug = ? AND status = 'publicado'",
      [slug]
    );
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

// Blocos de uma página, em ordem. `somenteAtivos` para o site público.
export async function getBlocos(paginaId: number, somenteAtivos = false): Promise<Bloco[]> {
  try {
    const sql =
      "SELECT id, pagina_id, tipo, nome, ordem, ativo, config FROM site_blocos WHERE pagina_id = ?" +
      (somenteAtivos ? " AND ativo = 1" : "") +
      " ORDER BY ordem, id";
    const rows = await query<BlocoRow>(sql, [paginaId]);
    return rows.map((r) => ({ ...r, config: parseConfig(r.config) }));
  } catch {
    return [];
  }
}
