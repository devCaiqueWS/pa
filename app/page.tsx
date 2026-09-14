import HeroEditorial from "@/components/home/HeroEditorial";
import UniverseIndex from "@/components/home/UniverseIndex";
import UniverseMosaic from "@/components/home/UniverseMosaic";
import Heritage from "@/components/home/Heritage";
import EditorialFeature from "@/components/home/EditorialFeature";
import Manifesto from "@/components/home/Manifesto";
import Closing from "@/components/home/Closing";
import ProductRail from "@/components/ProductRail";
import BlockRenderer from "@/components/cms/BlockRenderer";
import { featuredProducts, newProducts } from "@/lib/catalog-source";
import { getBanners } from "@/lib/banners";
import { getTextosMap } from "@/lib/content";
import { getPaginaPublicada, getBlocos } from "@/lib/cms";

// Revalida do CMS a cada 60s (edições no /painel refletem no site).
export const revalidate = 60;

// A home é montada por blocos do CMS (página com slug "home"). Se essa página
// ainda não existir/estiver vazia, cai na home clássica abaixo — assim nada
// quebra enquanto o conteúdo não é semeado no banco.
export default async function HomePage() {
  const pagina = await getPaginaPublicada("home");
  if (pagina) {
    const blocos = await getBlocos(pagina.id, true);
    if (blocos.length > 0) {
      return <BlockRenderer blocos={blocos} home />;
    }
  }
  return <HomeClassica />;
}

// Mesma narrativa da home do CMS, com os textos editáveis de site_textos:
// hero → universos → história → mais vendidos → destaque → categorias →
// novidades → manifesto → encerramento.
async function HomeClassica() {
  const [destaques, novos, t, banners] = await Promise.all([featuredProducts(8), newProducts(8), getTextosMap(), getBanners()]);

  return (
    <>
      <HeroEditorial slides={banners} />
      <UniverseIndex />
      <Heritage />
      <ProductRail
        title={t.home_destaques_titulo ?? "Mais vendidos"}
        subtitle={t.home_destaques_subtitulo ?? "Os favoritos que conquistaram o Brasil."}
        products={destaques}
        seeAllHref="/c/desodorantes"
      />
      <EditorialFeature
        eyebrow={t.home_marca_eyebrow ?? "Confiança diária"}
        titulo={t.home_marca_titulo ?? "A Pierre começa no desodorante. Mas não termina nele."}
        corpo={
          t.home_marca_texto ??
          "O desodorante abriu caminho porque resolve uma necessidade real. A partir dessa confiança, a marca cresce para fragrâncias, cuidado facial, banho, casa e muito mais."
        }
        imagem="/assets/img/desodorantes-varios.jpg"
        imagemAlt="Linha de desodorantes Pierre"
        botoes={[{ texto: "Conhecer a linha", link: "/c/desodorantes", estilo: "primario" }]}
      />
      <UniverseMosaic titulo={t.home_categorias_titulo ?? "Explore por categoria"} subtitulo={t.home_categorias_subtitulo ?? "Escolha pelo momento, pelo cuidado ou pelo desejo."} />
      <ProductRail
        title={t.home_novidades_titulo ?? "Novidades & Lançamentos"}
        subtitle={t.home_novidades_subtitulo ?? "O que está chegando na Pierre."}
        products={novos}
        seeAllHref="/c/cuidado-facial"
      />
      <Manifesto
        titulo={t.home_consultora_titulo ?? "Venda Pierre. Cresça com uma marca reconhecida."}
        texto={t.home_consultora_texto ?? "Treinamento, campanhas prontas, metas, níveis e acompanhamento. Aqui a Pierre compartilha o sucesso com você."}
        botaoTexto="Quero ser consultora"
        botaoLink="/consultora"
      />
      <Closing />
    </>
  );
}
