import Link from "next/link";
import { asset } from "@/lib/site";
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
        <img src={asset(product.image)} alt={product.name} loading="lazy" />
      </div>
      <div className="pcard-body">
        {product.line && <span className="pcard-eyebrow">{product.line}</span>}
        <h3 className="pcard-name">{product.name}</h3>
        <p className="pcard-desc">{product.shortDesc}</p>
        <span className="pcard-cta">Consulte uma consultora →</span>
      </div>
    </Link>
  );
}
