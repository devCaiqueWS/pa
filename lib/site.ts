// Caminho base onde a aplicação é servida.
// Na Vercel (domínio raiz) é vazio. Mantido como helper para não precisar
// alterar todas as chamadas <img src={asset(...)} /> caso volte a haver basePath.
export const BASE_PATH = "";

// Prefixa um caminho de asset estático (public/) com o basePath.
export function asset(path: string): string {
  return `${BASE_PATH}${path}`;
}
