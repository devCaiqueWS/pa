import Link from "next/link";
import { asset } from "@/lib/site";
import { getCategorias } from "@/lib/categorias";

// Faixa de atalhos de categoria (tiles redondos), padrão Natura/Boticário.
export default async function CategoryShortcuts() {
  const categorias = await getCategorias();
  return (
    <section className="section section-tight">
      <div className="container">
        <div className="catshort">
          {categorias.map((c) => (
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
