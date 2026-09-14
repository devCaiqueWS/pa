import Link from "next/link";
import { imagemSrc } from "@/lib/site";
import { srcSetDeCaminho } from "@/lib/imagens";
import Reveal from "@/components/ui/Reveal";
import ScrollProgress from "@/components/ui/ScrollProgress";
import SplitWords from "@/components/ui/SplitWords";

export type Botao = { texto?: string; link?: string; estilo?: "primario" | "secundario" };

type Props = {
  eyebrow?: string;
  titulo?: string;
  /** Parágrafos separados por linha. */
  corpo?: string;
  imagem?: string;
  imagemAlt?: string;
  imagemLado?: "esquerda" | "direita";
  tags?: string[];
  botoes?: Botao[];
};

// Destaque editorial (bloco "destaque" do CMS): foto em bloco arredondado ao
// lado de um título serifado, parágrafos, etiquetas e até três ações.
export default function EditorialFeature({ eyebrow, titulo, corpo, imagem, imagemAlt, imagemLado = "esquerda", tags = [], botoes = [] }: Props) {
  const paragrafos = (corpo || "").split("\n").map((p) => p.trim()).filter(Boolean);
  const acoes = botoes.filter((b) => b.texto);
  const srcSet = srcSetDeCaminho(imagem);

  return (
    // --p (0→1) na seção inteira: a foto inclina em perspectiva e a imagem
    // desliza dentro do quadro (parallax) enquanto a seção atravessa a tela.
    <ScrollProgress as="section" className={`feat${imagemLado === "direita" ? " img-right" : ""}`}>
      <div className="container feat-grid">
        {imagem && (
          <Reveal className="feat-media" plain>
            <div className="feat-media-frame">
              <img src={imagemSrc(imagem)} srcSet={srcSet} sizes="(min-width: 900px) 50vw, 100vw" alt={imagemAlt || titulo || ""} loading="lazy" decoding="async" />
            </div>
          </Reveal>
        )}
        <Reveal className="feat-copy" delay={1}>
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          {titulo && (
            <h2>
              <SplitWords texto={titulo} />
            </h2>
          )}
          {paragrafos.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          {tags.length > 0 && (
            <ul className="feat-tags">
              {tags.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          )}
          {acoes.length > 0 && (
            <div className="feat-actions">
              {acoes.map((b, i) =>
                b.estilo === "secundario" || i > 0 ? (
                  <Link key={i} className="link-line" href={b.link || "/onde-comprar"}>
                    {b.texto}
                  </Link>
                ) : (
                  <Link key={i} className="btn btn-primary" href={b.link || "/onde-comprar"}>
                    {b.texto}
                  </Link>
                )
              )}
            </div>
          )}
        </Reveal>
      </div>
    </ScrollProgress>
  );
}
