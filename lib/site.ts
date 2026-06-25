// Caminho base onde a aplicação é servida (ex.: pierrealexander.com.br/preview-site).
// Mantenha em sincronia com `basePath` em next.config.mjs.
export const BASE_PATH = "/preview-site";

// Prefixa um caminho de asset estático (public/) com o basePath.
// Necessário porque <img>/<video> simples não recebem o basePath automaticamente
// (apenas next/link e next/image fazem isso).
export function asset(path: string): string {
  return `${BASE_PATH}${path}`;
}
