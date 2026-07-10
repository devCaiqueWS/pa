// =============================================================================
// PONTE ROTA-FIXA -> CMS. Se existir uma página publicada no CMS com este slug
// (e com blocos ativos), devolve o conteúdo em blocos. Senão, devolve null e a
// rota renderiza o seu conteúdo fixo (fallback). Mesmo padrão da home.
// =============================================================================
import { getPaginaPublicada, getBlocos } from "@/lib/cms";
import BlockRenderer from "@/components/cms/BlockRenderer";

export async function cmsBlocos(slug: string) {
  const pagina = await getPaginaPublicada(slug);
  if (!pagina) return null;
  const blocos = await getBlocos(pagina.id, true);
  return blocos.length ? <BlockRenderer blocos={blocos} /> : null;
}
