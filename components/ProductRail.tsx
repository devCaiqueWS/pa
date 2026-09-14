import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import ProductRing from "@/components/home/ProductRing";
import Reveal from "@/components/ui/Reveal";
import SplitWords from "@/components/ui/SplitWords";
import type { Product } from "@/lib/catalog";

type Props = {
  title: string;
  subtitle?: string;
  products: Product[];
  seeAllHref?: string;
  /** "grade" (padrão): grade com entrada 3D. "anel": cilindro 3D girado pelo scroll (home). */
  apresentacao?: "grade" | "anel";
};

// Vitrine de produtos: grade editorial (entrada 3D) ou anel 3D preso na tela.
export default function ProductRail({ title, subtitle, products, seeAllHref, apresentacao = "grade" }: Props) {
  if (products.length === 0) return null;
  const head = (
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
  );

  if (apresentacao === "anel" && products.length >= 4) {
    return (
      <section className="section ring-section">
        <ProductRing cabecalho={head}>
          {products.slice(0, 8).map((p, i) => (
            <ProductCard key={p.slug} product={p} index={i} />
          ))}
        </ProductRing>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        {head}
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
