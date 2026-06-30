import Link from "next/link";
import { asset } from "@/lib/site";
import { categories } from "@/lib/catalog";

// Faixa de atalhos de categoria (tiles redondos), padrão Natura/Boticário.
export default function CategoryShortcuts() {
  return (
    <section className="section section-tight">
      <div className="container">
        <div className="catshort">
          {categories.map((c) => (
            <Link key={c.slug} className="catshort-item" href={`/c/${c.slug}`}>
              <span className="catshort-thumb">
                <img src={asset(c.image)} alt={c.name} loading="lazy" />
              </span>
              <span className="catshort-label">{c.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
