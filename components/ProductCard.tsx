import Link from "next/link";
import ProductImage from "@/components/ProductImage";
import type { Product } from "@/lib/catalog";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link className="pcard" href={`/p/${product.slug}`}>
      <div className="pcard-media">
        {product.badges && product.badges.length > 0 && (
          <div className="pcard-badges">
            {product.badges.map((b) => (
              <span key={b} className="pcard-badge">
                {b}
              </span>
            ))}
          </div>
        )}
        <ProductImage src={product.image} alt={product.name} />
      </div>
      <div className="pcard-body">
        {product.line && <span className="pcard-eyebrow">{product.line}</span>}
        <h3 className="pcard-name">{product.name}</h3>
        <p className="pcard-desc">{product.shortDesc}</p>
        {product.preco != null && (
          <span className="pcard-price">{product.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
        )}
        <span className="pcard-cta">Consulte uma consultora →</span>
      </div>
    </Link>
  );
}
