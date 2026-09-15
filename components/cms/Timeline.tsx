import type { CSSProperties } from "react";
import ScrollProgress, { LEITURA } from "@/components/ui/ScrollProgress";
import SplitWords from "@/components/ui/SplitWords";
import Reveal from "@/components/ui/Reveal";

export type Marco = { ano?: string; rotulo?: string; titulo?: string; texto?: string };

type Props = { eyebrow?: string; titulo?: string; aviso?: string; marcos: Marco[]; id?: string };

// Linha do tempo: um fio de ouro que se preenche conforme a leitura avança
// (--p da faixa LEITURA). O `aviso` fica visível — é onde se diz, por exemplo,
// que os marcos ainda são ilustrativos.
export default function Timeline({ eyebrow, titulo, aviso, marcos, id }: Props) {
  const lista = marcos.filter((m) => m.ano || m.titulo || m.texto);
  if (lista.length === 0) return null;
  return (
    <section className="tline" id={id}>
      <div className="container">
        <Reveal className="tline-head">
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          {titulo && (
            <h2>
              <SplitWords texto={titulo} />
            </h2>
          )}
          {aviso && <p className="tline-aviso">{aviso}</p>}
        </Reveal>

        <ScrollProgress as="ol" className="tline-list" faixa={LEITURA}>
          {lista.map((m, i) => (
            <li key={i} className="tline-item" style={{ "--i": i } as CSSProperties}>
              {m.ano && <span className="tline-ano">{m.ano}</span>}
              <div className="tline-corpo">
                {m.rotulo && <span className="tline-rotulo">{m.rotulo}</span>}
                {m.titulo && <h3>{m.titulo}</h3>}
                {m.texto && <p>{m.texto}</p>}
              </div>
            </li>
          ))}
        </ScrollProgress>
      </div>
    </section>
  );
}
