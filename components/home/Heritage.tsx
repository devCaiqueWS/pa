import Picture from "@/components/ui/Picture";
import Reveal from "@/components/ui/Reveal";
import ScrollProgress, { LEITURA, VIAGEM } from "@/components/ui/ScrollProgress";
import SplitWords from "@/components/ui/SplitWords";
import CountUp from "@/components/ui/CountUp";
import type { CSSProperties } from "react";
import HeritageScene from "@/components/home/HeritageScene";
import { IMAGENS } from "@/lib/imagens";

export type Marco = { ano: string; texto: string };

type Props = {
  titulo?: string;
  /** Parágrafos separados por linha em branco. */
  corpo?: string;
  /** Linhas "ano | texto". Vazio = a linha do tempo não aparece. */
  marcos?: Marco[];
};

// Texto institucional padrão = o que já existe na página "Sobre" do site.
const TITULO_PADRAO = "Uma marca brasileira com charme francês.";
const CORPO_PADRAO = [
  "A Pierre Alexander nasceu no Brasil e cresceu acompanhando a rotina de milhares de pessoas.",
  "Ao longo da sua história, construiu uma relação de confiança com consumidores e consultoras, unindo qualidade, alegria, cuidado e sofisticação.",
  "Somos uma marca de beleza eficiente: beleza que funciona no corpo, na pele, no perfume, na casa e na vida real.",
];

// Converte o campo de texto do painel ("1979 | Fundação" por linha) em marcos.
export function parseMarcos(raw: string | undefined): Marco[] {
  if (!raw) return [];
  return raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const [ano, ...resto] = l.split("|");
      return { ano: (ano || "").trim(), texto: resto.join("|").trim() };
    })
    .filter((m) => m.ano && m.texto);
}

// Seção de história: "45+" como elemento gráfico, narrativa institucional e a
// cena tradição → presente controlada pelo scroll.
export default function Heritage({ titulo, corpo, marcos = [] }: Props) {
  const paragrafos = (corpo || "").split("\n").map((p) => p.trim()).filter(Boolean);
  const textos = paragrafos.length ? paragrafos : CORPO_PADRAO;

  return (
    <section className="her" id="historia" aria-labelledby="historia-titulo">
      <div className="container her-head">
        <ScrollProgress className="her-num" faixa={VIAGEM} aria-hidden="true">
          <p className="her-num-big">
            <CountUp ate={45} />
            <sup>+</sup>
          </p>
          <p className="her-num-label">anos de beleza, cuidado e presença</p>
        </ScrollProgress>
        <Reveal className="her-copy" plain>
          <span className="sr-only">Mais de 45 anos de história.</span>
          <h2 id="historia-titulo">
            <SplitWords texto={titulo || TITULO_PADRAO} />
          </h2>
          {/* Os parágrafos "acendem" de cima para baixo conforme a leitura avança. */}
          <ScrollProgress className="her-leitura" faixa={LEITURA} style={{ "--n": textos.length } as CSSProperties}>
            {textos.map((t, i) => (
              <p key={i} style={{ "--i": i } as CSSProperties}>
                {t}
              </p>
            ))}
          </ScrollProgress>
          {marcos.length > 0 && (
            <ol className="her-marcos" aria-label="Linha do tempo">
              {marcos.map((m, i) => (
                <li key={i} className="her-marco">
                  <span className="her-marco-ano">{m.ano}</span>
                  <p>{m.texto}</p>
                </li>
              ))}
            </ol>
          )}
        </Reveal>
      </div>

      <HeritageScene>
        <figure className="her-frame">
          <div className="her-pair">
            <Picture
              img={IMAGENS.muralClassico}
              alt="Pote de creme Pierre Alexander sobre tecidos claros, em luz de fim de tarde"
              sizes="(min-width: 1200px) 1140px, 100vw"
              className="her-img her-img-before"
            />
            <figcaption className="her-cap her-cap-before">
              <small>Tradição</small>
              <span>O cuidado que abriu caminho.</span>
            </figcaption>
          </div>
          <div className="her-pair">
            <Picture
              img={IMAGENS.colecao}
              alt="A coleção Pierre Alexander de hoje: cremes, séruns e frascos dispostos sobre fundo marfim"
              sizes="(min-width: 1200px) 1140px, 100vw"
              className="her-img her-img-after"
            />
            <figcaption className="her-cap her-cap-after">
              <small>Presente</small>
              <span>A tradição que continua se reinventando.</span>
            </figcaption>
          </div>
          <div className="her-progress" aria-hidden="true">
            <i />
          </div>
        </figure>
      </HeritageScene>
    </section>
  );
}
