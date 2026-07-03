// =============================================================================
// PÁGINA PÚBLICA DINÂMICA DO CMS — /pagina/<slug>
// Carrega uma página publicada e renderiza seus blocos (na ordem, só os ativos).
// Páginas não publicadas ou inexistentes -> 404.
// (Obs.: /p/ e /c/ já são usados pelo catálogo de produtos/categorias.)
// =============================================================================
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPaginaPublicada, getBlocos } from "@/lib/cms";
import BlockRenderer from "@/components/cms/BlockRenderer";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pagina = await getPaginaPublicada(slug);
  if (!pagina) return { title: "Página não encontrada" };
  return {
    title: pagina.seo_titulo || pagina.titulo,
    description: pagina.seo_descricao || undefined,
  };
}

export default async function PaginaDinamica({ params }: Props) {
  const { slug } = await params;
  const pagina = await getPaginaPublicada(slug);
  if (!pagina) notFound();

  const blocos = await getBlocos(pagina.id, true);
  return <BlockRenderer blocos={blocos} />;
}
