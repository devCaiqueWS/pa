import Link from "next/link";
import { asset } from "@/lib/site";
import Reveal from "@/components/ui/Reveal";
import ScrollProgress, { LEITURA } from "@/components/ui/ScrollProgress";
import SplitWords from "@/components/ui/SplitWords";

type Props = {
  titulo?: string;
  texto?: string;
  botaoTexto?: string;
  botaoLink?: string;
};

// Os quatro pilares já publicados na página "Sobre" — a essência da marca em
// movimento lento, atrás da chamada comercial.
const PILARES = ["História", "Qualidade", "Cuidado", "Força coletiva"];

// Manifesto em vermelho Pierre (bloco "cta" na home): frase editorial grande,
// texto de apoio e a ação comercial. Marca em grande escala ao fundo.
export default function Manifesto({ titulo, texto, botaoTexto, botaoLink }: Props) {
  // A frase é repetida duas vezes para o deslizamento contínuo (translateX -50%).
  const frase = [...PILARES, ...PILARES];
  return (
    // --p na faixa inteira: a marca ao fundo desliza na vertical e a frase
    // grande vai "acendendo" palavra a palavra conforme a faixa passa.
    <ScrollProgress as="section" className="mani" faixa={LEITURA} id="manifesto">
      <img className="mani-mark" src={asset("/assets/img/logo-pierre-white.png")} alt="" aria-hidden="true" width={256} height={160} loading="lazy" />
      <div className="mani-marquee" aria-hidden="true">
        <div className="mani-marquee-track">
          {frase.map((p, i) => (
            <span key={i}>{p}</span>
          ))}
        </div>
      </div>
      <div className="container mani-body">
        <h2 id="manifesto-titulo" className="mani-scrub">
          <SplitWords texto={titulo || "Venda Pierre. Cresça com uma marca reconhecida."} />
        </h2>
        <Reveal className="mani-side" delay={1}>
          {texto && <p>{texto}</p>}
          {botaoTexto && (
            <Link className="btn btn-light" href={botaoLink || "/consultora"}>
              {botaoTexto}
            </Link>
          )}
        </Reveal>
      </div>
    </ScrollProgress>
  );
}
