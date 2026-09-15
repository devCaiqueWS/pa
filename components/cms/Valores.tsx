import type { CSSProperties } from "react";
import Reveal from "@/components/ui/Reveal";

export type Valor = { rotulo?: string; titulo?: string; texto?: string };

type Props = { titulo?: string; subtitulo?: string; valores: Valor[] };

// Valores numerados (01 / 02 / 03): o numeral é gerado pela posição — o painel
// guarda só rótulo, título e texto. É uma tríade, por isso a numeração ajuda a
// ler como sequência.
export default function Valores({ titulo, subtitulo, valores }: Props) {
  const lista = valores.filter((v) => v.titulo || v.texto);
  if (lista.length === 0) return null;
  return (
    <section className="svalues">
      <div className="container">
        {(titulo || subtitulo) && (
          <Reveal className="svalues-head">
            {titulo && <h2>{titulo}</h2>}
            {subtitulo && <p className="lead">{subtitulo}</p>}
          </Reveal>
        )}
        <Reveal className="svalues-grid" plain>
          {lista.map((v, i) => (
            <article key={i} className="svalue" style={{ "--i": i } as CSSProperties}>
              <span className="svalue-num" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              {v.rotulo && <span className="svalue-rotulo">{v.rotulo}</span>}
              {v.titulo && <h3>{v.titulo}</h3>}
              {v.texto && <p>{v.texto}</p>}
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
