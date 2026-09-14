import Link from "next/link";
import { imagemSrc } from "@/lib/site";
import { srcSetDeCaminho } from "@/lib/imagens";
import { getCategorias } from "@/lib/categorias";

// Índice de universos: uma linha tipográfica com as categorias do catálogo
// (mesma fonte do menu e do painel). Substitui a faixa de "atalhos" redondos.
export default async function UniverseIndex() {
  const categorias = await getCategorias();
  if (categorias.length === 0) return null;
  return (
    <nav className="uidx" aria-label="Universos Pierre">
      <div className="container uidx-inner">
        <span className="uidx-intro" aria-hidden="true">
          Explore por universo
        </span>
        <ul className="uidx-list">
          {categorias.map((c) => (
            <li key={c.slug} className="uidx-item">
              <Link className="uidx-link" href={`/c/${c.slug}`}>
                <span className="uidx-thumb">
                  {c.image && (
                    <img src={imagemSrc(c.image)} srcSet={srcSetDeCaminho(c.image)} sizes="46px" alt="" width={46} height={46} loading="lazy" decoding="async" />
                  )}
                </span>
                <span className="uidx-name">{c.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
