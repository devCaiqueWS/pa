import Link from "next/link";
import Picture from "@/components/ui/Picture";
import ScrollProgress from "@/components/ui/ScrollProgress";
import SplitWords from "@/components/ui/SplitWords";
import Reveal from "@/components/ui/Reveal";
import { IMAGENS } from "@/lib/imagens";
import { imagemSrc } from "@/lib/site";

type Props = { titulo?: string; texto?: string; botaoTexto?: string; botaoLink?: string; imagem?: string };

// Faixa Original: a arte "Original de Vivre" em bleed total, inclinada em
// perspectiva conforme a seção atravessa a tela (--p), com a chamada sobre um
// véu vinho-noir à esquerda. Imagem do painel substitui a arte local.
export default function OriginalBand({ titulo, texto, botaoTexto, botaoLink, imagem }: Props) {
  return (
    <ScrollProgress as="section" className="orig" id="original">
      <div className="orig-stage" aria-hidden="true">
        {imagem ? (
          <img className="orig-img" src={imagemSrc(imagem)} alt="" loading="lazy" decoding="async" />
        ) : (
          <Picture img={IMAGENS.original} alt="" sizes="100vw" className="orig-img" />
        )}
      </div>
      <div className="orig-veil" aria-hidden="true" />
      <div className="container orig-body">
        <Reveal className="orig-copy">
          <span className="orig-kicker">Desde o primeiro pote</span>
          <h2>
            <SplitWords texto={titulo || "O Original."} />
          </h2>
          <p>{texto || "O desodorante em creme que abriu caminho para tudo o que a Pierre faz hoje. Simples de entender, fácil de indicar, difícil de largar."}</p>
          <Link className="btn btn-light" href={botaoLink || "/original"}>
            {botaoTexto || "Conhecer o Original"}
          </Link>
        </Reveal>
      </div>
    </ScrollProgress>
  );
}
