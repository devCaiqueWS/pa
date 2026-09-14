import Link from "next/link";
import type { CSSProperties } from "react";
import { imagemSrc } from "@/lib/site";
import { srcSetDeCaminho } from "@/lib/imagens";
import { getCategorias } from "@/lib/categorias";
import ScrollProgress, { PRESO } from "@/components/ui/ScrollProgress";

// Universos em scroll lateral: a seção fica presa na tela e, conforme o scroll
// vertical avança (--p), a fila de categorias desliza para o lado. O CSS faz o
// deslocamento com translateX(calc(--p * (100vw - 100%))) — a porcentagem é
// relativa à própria fila, então não precisa medir nada. No celular e com
// reduced-motion vira um trilho nativo com snap.
export default async function UniverseStrip() {
  const categorias = await getCategorias();
  if (categorias.length === 0) return null;
  return (
    <ScrollProgress as="section" className="ustrip" id="universos" faixa={PRESO}>
      <div className="ustrip-sticky">
        <header className="ustrip-head container">
          <p className="ustrip-intro">Explore por universo</p>
          <span className="ustrip-bar" aria-hidden="true" />
        </header>
        <ul className="ustrip-track" aria-label="Universos Pierre">
          {categorias.map((c, i) => (
            <li key={c.slug} className="ustrip-item" style={{ "--i": i } as CSSProperties}>
              <Link className="ustrip-card" href={`/c/${c.slug}`}>
                {c.image && (
                  <img src={imagemSrc(c.image)} srcSet={srcSetDeCaminho(c.image)} sizes="(min-width: 900px) 30vw, 72vw" alt="" loading="lazy" decoding="async" />
                )}
                <span className="ustrip-cap">
                  <strong>{c.name}</strong>
                  {c.tagline && <small>{c.tagline}</small>}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </ScrollProgress>
  );
}
