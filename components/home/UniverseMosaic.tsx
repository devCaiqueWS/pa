import Link from "next/link";
import { imagemSrc } from "@/lib/site";
import { srcSetDeCaminho } from "@/lib/imagens";
import { getCategorias } from "@/lib/categorias";
import Reveal from "@/components/ui/Reveal";
import ScrollProgress from "@/components/ui/ScrollProgress";
import type { CSSProperties } from "react";

type Props = { titulo?: string; subtitulo?: string };

// Mosaico editorial das categorias (bloco "colecoes"): o primeiro universo em
// destaque maior, os demais compondo a grade. Nome e frase sempre visíveis.
export default async function UniverseMosaic({ titulo, subtitulo }: Props) {
  const categorias = await getCategorias();
  if (categorias.length === 0) return null;
  return (
    <section className="mosaic">
      <div className="container">
        <Reveal className="sec-head-row">
          <div>
            <h2>{titulo || "Explore por categoria"}</h2>
            {subtitulo && <p className="lead">{subtitulo}</p>}
          </div>
        </Reveal>
        {/* --p na grade: tiles alternados deslizam em velocidades diferentes (parallax em colunas). */}
        <ScrollProgress className="mosaic-grid">
          {categorias.map((c, i) => {
            const srcSet = srcSetDeCaminho(c.image);
            const grande = i === 0;
            return (
              <Link key={c.slug} className="mosaic-tile" href={`/c/${c.slug}`} style={{ "--i": i } as CSSProperties}>
                {c.image && (
                  <img
                    src={imagemSrc(c.image)}
                    srcSet={srcSet}
                    sizes={grande ? "(min-width: 900px) 50vw, 100vw" : "(min-width: 900px) 25vw, 50vw"}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                )}
                <div className="mosaic-cap">
                  <h3>{c.name}</h3>
                  {c.tagline && <p>{c.tagline}</p>}
                  <span className="mosaic-cap-link">Ver {c.name}</span>
                </div>
              </Link>
            );
          })}
        </ScrollProgress>
      </div>
    </section>
  );
}
