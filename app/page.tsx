import Link from "next/link";
import HeroCarousel from "@/components/HeroCarousel";
import CategoryShortcuts from "@/components/CategoryShortcuts";
import ProductRail from "@/components/ProductRail";
import Newsletter from "@/components/Newsletter";
import BlockRenderer from "@/components/cms/BlockRenderer";
import { asset, imagemSrc } from "@/lib/site";
import { categories, featuredProducts, newProducts } from "@/lib/catalog-source";
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
      return <BlockRenderer blocos={blocos} />;
    }
  }
  return <HomeClassica />;
}

async function HomeClassica() {
  const [destaques, novos, t] = await Promise.all([
    featuredProducts(8),
    newProducts(8),
    getTextosMap(),
  ]);

  return (
    <>
      <HeroCarousel />

      {/* Atalhos de categoria — padrão Natura/Boticário */}
      <CategoryShortcuts />

      {/* Vitrine: mais vendidos */}
      <ProductRail
        title={t.home_destaques_titulo ?? "Mais vendidos"}
        subtitle={t.home_destaques_subtitulo ?? "Os favoritos que conquistaram o Brasil."}
        products={destaques}
        seeAllHref="/c/desodorantes"
      />

      {/* Faixa de marca */}
      <section className="section section-soft">
        <div className="container splitf">
          <div className="splitf-img">
            <img
              src={asset("/assets/img/desodorantes-varios.jpg")}
              alt="Linha de desodorantes Pierre"
            />
          </div>
          <div className="splitf-copy">
            <span className="eyebrow">{t.home_marca_eyebrow ?? "Confiança diária"}</span>
            <h2>
              {t.home_marca_titulo ??
                "A Pierre começa no desodorante. Mas não termina nele."}
            </h2>
            <p>
              {t.home_marca_texto ??
                "O desodorante abriu caminho porque resolve uma necessidade real. A partir dessa confiança, a marca cresce para fragrâncias, cuidado facial, banho, casa e muito mais."}
            </p>
            <Link className="btn btn-primary" href="/c/desodorantes">
              Conhecer a linha
            </Link>
          </div>
        </div>
      </section>

      {/* Vitrine: novidades */}
      <ProductRail
        title={t.home_novidades_titulo ?? "Novidades & Lançamentos"}
        subtitle={t.home_novidades_subtitulo ?? "O que está chegando na Pierre."}
        products={novos}
        seeAllHref="/c/cuidado-facial"
      />

      {/* Coleções por categoria */}
      <section className="section section-soft">
        <div className="container">
          <div className="sec-head">
            <h2>{t.home_categorias_titulo ?? "Explore por categoria"}</h2>
            <p>{t.home_categorias_subtitulo ?? "Escolha pelo momento, pelo cuidado ou pelo desejo."}</p>
          </div>
          <div className="coll-grid">
            {categories.map((c) => (
              <Link key={c.slug} className="coll-card" href={`/c/${c.slug}`}>
                <div className="coll-media">
                  <img src={imagemSrc(c.image)} alt={c.name} loading="lazy" />
                </div>
                <div className="coll-body">
                  <h3>{c.name}</h3>
                  <p>{c.tagline}</p>
                  <span className="coll-link">Ver produtos →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Faixa consultora */}
      <section className="section">
        <div className="container consultband">
          <div className="consultband-copy">
            <span className="eyebrow">{t.home_consultora_eyebrow ?? "Pierre Business"}</span>
            <h2>
              {t.home_consultora_titulo ??
                "Venda Pierre. Cresça com uma marca reconhecida."}
            </h2>
            <p>
              {t.home_consultora_texto ??
                "Treinamento, campanhas prontas, metas, níveis e acompanhamento. Aqui a Pierre compartilha o sucesso com você."}
            </p>
            <Link className="btn btn-light" href="/consultora">
              Quero ser consultora
            </Link>
          </div>
        </div>
      </section>

      <Newsletter />
    </>
  );
}
