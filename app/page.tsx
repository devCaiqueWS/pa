import Link from "next/link";
import HeroCarousel from "@/components/HeroCarousel";
import CategoryShortcuts from "@/components/CategoryShortcuts";
import ProductRail from "@/components/ProductRail";
import Newsletter from "@/components/Newsletter";
import { asset } from "@/lib/site";
import { categories, featuredProducts, newProducts } from "@/lib/catalog-source";

// Revalida do CMS a cada 60s (edições no /admin refletem no site).
export const revalidate = 60;

export default async function HomePage() {
  const [destaques, novos] = await Promise.all([
    featuredProducts(8),
    newProducts(8),
  ]);

  return (
    <>
      <HeroCarousel />

      {/* Atalhos de categoria — padrão Natura/Boticário */}
      <CategoryShortcuts />

      {/* Vitrine: mais vendidos */}
      <ProductRail
        title="Mais vendidos"
        subtitle="Os favoritos que conquistaram o Brasil."
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
            <span className="eyebrow">Confiança diária</span>
            <h2>A Pierre começa no desodorante. Mas não termina nele.</h2>
            <p>
              O desodorante abriu caminho porque resolve uma necessidade real. A
              partir dessa confiança, a marca cresce para fragrâncias, cuidado
              facial, banho, casa e muito mais.
            </p>
            <Link className="btn btn-primary" href="/c/desodorantes">
              Conhecer a linha
            </Link>
          </div>
        </div>
      </section>

      {/* Vitrine: novidades */}
      <ProductRail
        title="Novidades & Lançamentos"
        subtitle="O que está chegando na Pierre."
        products={novos}
        seeAllHref="/c/cuidado-facial"
      />

      {/* Coleções por categoria */}
      <section className="section section-soft">
        <div className="container">
          <div className="sec-head">
            <h2>Explore por categoria</h2>
            <p>Escolha pelo momento, pelo cuidado ou pelo desejo.</p>
          </div>
          <div className="coll-grid">
            {categories.map((c) => (
              <Link key={c.slug} className="coll-card" href={`/c/${c.slug}`}>
                <div className="coll-media">
                  <img src={asset(c.image)} alt={c.name} loading="lazy" />
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
            <span className="eyebrow">Pierre Business</span>
            <h2>Venda Pierre. Cresça com uma marca reconhecida.</h2>
            <p>
              Treinamento, campanhas prontas, metas, níveis e acompanhamento.
              Aqui a Pierre compartilha o sucesso com você.
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
