import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/ui/Reveal";
import SplitWords from "@/components/ui/SplitWords";
import type { Product } from "@/lib/catalog";

type Props = {
  title: string;
  subtitle?: string;
  products: Product[];
  seeAllHref?: string;
};

// Vitrine de produtos: grade editorial no desktop, trilho com snap no celular.
export default function ProductRail({ title, subtitle, products, seeAllHref }: Props) {
  if (products.length === 0) return null;
  return (
    <section className="section">
      <div className="container">
        <Reveal className="rail-head">
          <div>
            <h2 className="rail-title">
              <SplitWords texto={title} />
            </h2>
            {subtitle && <p className="rail-sub">{subtitle}</p>}
          </div>
          {seeAllHref && (
            <Link className="link-line rail-seeall" href={seeAllHref}>
              Ver tudo
            </Link>
          )}
        </Reveal>
        {/* Entrada 3D: os cards giram em perspectiva, um após o outro (CSS .rail-3d). */}
        <Reveal className="rail-track rail-3d" plain>
          {products.map((p, i) => (
            <ProductCard key={p.slug} product={p} index={i} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
