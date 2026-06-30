import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/catalog";

type Props = {
  title: string;
  subtitle?: string;
  products: Product[];
  seeAllHref?: string;
};

// Vitrine horizontal de produtos (estilo carrossel "Mais vendidos / Lançamentos").
export default function ProductRail({ title, subtitle, products, seeAllHref }: Props) {
  if (products.length === 0) return null;
  return (
    <section className="section">
      <div className="container">
        <div className="rail-head">
          <div>
            <h2 className="rail-title">{title}</h2>
            {subtitle && <p className="rail-sub">{subtitle}</p>}
          </div>
          {seeAllHref && (
            <Link className="rail-seeall" href={seeAllHref}>
              Ver tudo →
            </Link>
          )}
        </div>
        <div className="rail-track">
          {products.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
