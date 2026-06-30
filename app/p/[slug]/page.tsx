import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductRail from "@/components/ProductRail";
import { asset } from "@/lib/site";
import { getProduct, getCategory, relatedProducts } from "@/lib/catalog-source";
import { products } from "@/lib/catalog";

export const revalidate = 60;

// Baseline de slugs para o build; produtos novos no CMS renderizam sob demanda.
export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  return { title: product ? product.name : "Produto" };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const category = getCategory(product.categorySlug);
  const related = await relatedProducts(product);

  return (
    <>
      <section className="section pdp">
        <div className="container">
          <nav className="crumbs" aria-label="Caminho">
            <Link href="/">Início</Link>
            <span>/</span>
            {category && <Link href={`/c/${category.slug}`}>{category.name}</Link>}
            <span>/</span>
            <span>{product.name}</span>
          </nav>

          <div className="pdp-grid">
            <div className="pdp-gallery">
              {product.badges && product.badges.length > 0 && (
                <div className="pcard-badges">
                  {product.badges.map((b) => (
                    <span key={b} className="pcard-badge">
                      {b}
                    </span>
                  ))}
                </div>
              )}
              <img src={asset(product.image)} alt={product.name} />
            </div>

            <div className="pdp-info">
              {product.line && <span className="eyebrow">{product.line}</span>}
              <h1>{product.name}</h1>
              <div className="pdp-rating" aria-label="Avaliação">
                <span className="stars">★★★★★</span>
                <span className="pdp-rating-count">Avaliado por clientes Pierre</span>
              </div>
              <p className="pdp-lead">{product.shortDesc}</p>

              <dl className="pdp-attrs">
                {category && (
                  <div>
                    <dt>Categoria</dt>
                    <dd>{category.name}</dd>
                  </div>
                )}
                {product.family && (
                  <div>
                    <dt>Família olfativa</dt>
                    <dd>{product.family}</dd>
                  </div>
                )}
                {product.gender && (
                  <div>
                    <dt>Indicado para</dt>
                    <dd className="cap">{product.gender}</dd>
                  </div>
                )}
              </dl>

              <div className="pdp-actions">
                <Link className="btn btn-primary" href="/onde-comprar">
                  Encontrar uma consultora
                </Link>
                <Link className="btn btn-outline" href="/consultora">
                  Quero vender este produto
                </Link>
              </div>
              <p className="pdp-note">
                Venda Pierre é feita por consultoras. Fale com a consultora mais
                próxima para preço e disponibilidade.
              </p>
            </div>
          </div>

          <div className="pdp-desc">
            <h2>Sobre o produto</h2>
            <p>{product.shortDesc}</p>
            <p>
              A linha Pierre Alexander une charme francês e alegria brasileira em
              produtos pensados para a sua rotina. Qualidade que conquista pela
              recompra e pela indicação fácil.
            </p>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <div className="section-soft-wrap">
          <ProductRail
            title="Você também pode gostar"
            products={related}
            seeAllHref={category ? `/c/${category.slug}` : undefined}
          />
        </div>
      )}
    </>
  );
}
