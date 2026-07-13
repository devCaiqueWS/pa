// Caminho base onde a aplicação é servida.
// Na Vercel (domínio raiz) é vazio. Mantido como helper para não precisar
// alterar todas as chamadas <img src={asset(...)} /> caso volte a haver basePath.
export const BASE_PATH = "/preview-site";

// Prefixa um caminho de asset estático (public/) com o basePath.
export function asset(path: string): string {
  return `${BASE_PATH}${path}`;
}

// Páginas do CMS que têm uma URL LIMPA própria (rota fixa que dá prioridade ao
// CMS via cmsBlocos). Fora desta lista, uma página do CMS vive em /pagina/<slug>.
export const ROTAS_LIMPAS: Record<string, string> = {
  home: "/",
  sobre: "/sobre",
  consultora: "/consultora",
  "onde-comprar": "/onde-comprar",
  maison: "/maison",
  original: "/original",
  "produto-original": "/produto-original",
  fragrancias: "/fragrancias",
  kits: "/kits",
  tratamentos: "/tratamentos",
};

// URL pública canônica de uma página do CMS: a rota limpa se existir, senão /pagina/<slug>.
export function urlPublicaDaPagina(slug: string): string {
  return ROTAS_LIMPAS[slug] ?? `/pagina/${slug}`;
}
