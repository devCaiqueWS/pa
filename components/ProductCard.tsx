import Link from "next/link";
import ProductImage from "@/components/ProductImage";
import Tilt from "@/components/ui/Tilt";
import type { Product } from "@/lib/catalog";
import type { CSSProperties } from "react";

// `index` alimenta --i para escalonar a entrada dos cards na vitrine da home.
export default function ProductCard({ product, index }: { product: Product; index?: number }) {
  const style = index == null ? undefined : ({ "--i": index } as CSSProperties);
  return (
    <Link className="pcard" href={`/p/${product.slug}`} style={style}>
      <Tilt className="pcard-media">
        {product.badges && product.badges.length > 0 && (
          <div className="pcard-badges">
            {product.badges.map((b) => (
              <span key={b} className="pcard-badge">
                {b}
              </span>
            ))}
          </div>
        )}
        <ProductImage src={product.image} alt={product.name} sizes="(min-width: 1000px) 25vw, (min-width: 760px) 33vw, 72vw" />
      </Tilt>
      <div className="pcard-body">
        {product.line && <span className="pcard-eyebrow">{product.line}</span>}
        <h3 className="pcard-name">{product.name}</h3>
        <p className="pcard-desc">{product.shortDesc}</p>
        {product.preco != null && (
          <span className="pcard-price">{product.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
        )}
        <span className="pcard-cta">Consulte uma consultora</span>
      </div>
    </Link>
  );
}
