// =============================================================================
// RENDERIZADOR DE BLOCOS — transforma cada bloco do CMS no visual do site.
// Recebe a lista de blocos (já lidos do banco) e desenha um por um conforme o
// tipo. Os blocos "ricos" da home reaproveitam os componentes editoriais; os
// genéricos (hero, texto, cta, colunas) usam as classes .cms-* do globals.css.
// =============================================================================
import Link from "next/link";
import type { Bloco } from "@/lib/cms";
import { imagemSrc } from "@/lib/site";
import HeroEditorial from "@/components/home/HeroEditorial";
import UniverseStrip from "@/components/home/UniverseStrip";
import UniverseMosaic from "@/components/home/UniverseMosaic";
import Heritage, { parseMarcos } from "@/components/home/Heritage";
import EditorialFeature from "@/components/home/EditorialFeature";
import Manifesto from "@/components/home/Manifesto";
import Closing from "@/components/home/Closing";
import ProductRail from "@/components/ProductRail";
import { featuredProducts, newProducts } from "@/lib/catalog-source";
import { getBanners } from "@/lib/banners";

type Cfg = Record<string, string>;

function Botao({ texto, link, estilo = "primario", claro = false }: { texto?: string; link?: string; estilo?: string; claro?: boolean }) {
  if (!texto) return null;
  const href = link || "/onde-comprar";
  const primario = estilo !== "secundario";
  const cls = claro ? (primario ? "btn btn-light" : "btn btn-ghost-light") : primario ? "btn btn-primary" : "btn btn-outline";
  return (
    <Link href={href} className={cls}>
      {texto}
    </Link>
  );
}

function paragrafos(txt?: string) {
  return (txt || "")
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean);
}

function Hero({ c }: { c: Cfg }) {
  const centro = c.alinhamento !== "esquerda";
  const imagem = imagemSrc(c.imagem_url);
  return (
    <section className={`cms-hero${centro ? " center" : ""}`}>
      {imagem && <img className="cms-hero-bg" src={imagem} alt="" aria-hidden="true" />}
      <div className="container">
        {c.eyebrow && <span className="eyebrow">{c.eyebrow}</span>}
        {c.titulo && <h1>{c.titulo}</h1>}
        {c.subtitulo && <p className="lead">{c.subtitulo}</p>}
        <Botao texto={c.botao_texto} link={c.botao_link} estilo={c.botao_estilo} claro />
      </div>
    </section>
  );
}

function Texto({ c }: { c: Cfg }) {
  return (
    <section className={`cms-texto${c.alinhamento === "centro" ? " center" : ""}`}>
      <div className="container">
        {c.titulo && <h2>{c.titulo}</h2>}
        {paragrafos(c.corpo).map((par, i) => (
          <p key={i}>{par}</p>
        ))}
      </div>
    </section>
  );
}

function Cta({ c }: { c: Cfg }) {
  return (
    <section className="cms-cta">
      <div className="container">
        {c.titulo && <h2>{c.titulo}</h2>}
        {c.texto && <p>{c.texto}</p>}
        <Botao texto={c.botao_texto} link={c.botao_link} claro />
      </div>
    </section>
  );
}

function Destaque({ c }: { c: Cfg }) {
  const tags = (c.tags || "").split(",").map((t) => t.trim()).filter(Boolean);
  return (
    <EditorialFeature
      eyebrow={c.eyebrow}
      titulo={c.titulo}
      corpo={c.corpo}
      imagem={c.imagem_url}
      imagemLado={c.imagem_lado === "direita" ? "direita" : "esquerda"}
      tags={tags}
      botoes={[
        { texto: c.botao1_texto, link: c.botao1_link, estilo: "primario" },
        { texto: c.botao2_texto, link: c.botao2_link, estilo: "secundario" },
        { texto: c.botao3_texto, link: c.botao3_link, estilo: "secundario" },
      ]}
    />
  );
}

function Colunas({ c }: { c: Cfg }) {
  const qtd = Math.min(Math.max(Number(c.qtd) || 3, 2), 6);
  const cols = Array.from({ length: qtd }, (_, i) => i + 1)
    .map((n) => ({ titulo: c[`col${n}_titulo`], texto: c[`col${n}_texto`], link: c[`col${n}_link`] }))
    .filter((col) => col.titulo || col.texto);

  return (
    <section className="cms-colunas">
      <div className="container">
        {c.titulo && <h2>{c.titulo}</h2>}
        <div className="cms-colunas-grid">
          {cols.map((col, i) => (
            <div key={i} className="cms-col">
              {col.titulo && <h3>{col.titulo}</h3>}
              {col.texto && <p>{col.texto}</p>}
              {col.link && (
                <Link href={col.link} className="link-line">
                  Saiba mais
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Produtos({ c }: { c: Cfg }) {
  return (
    <section className="cms-produtos">
      <div className="container">
        {c.titulo && <h2>{c.titulo}</h2>}
        {c.subtitulo && <p className="lead" style={{ marginInline: "auto" }}>{c.subtitulo}</p>}
        <div className="cms-produtos-vazio">
          Vitrine de produtos — use o bloco <strong>Vitrine de produtos (automática)</strong> para puxar o catálogo.
        </div>
      </div>
    </section>
  );
}

// --- Blocos "ricos" da home ---------------------------------------------------

// Vitrine automática: puxa produtos do catálogo (destaques ou novidades).
async function Vitrine({ c }: { c: Cfg }) {
  const fonte = c.fonte === "novos" ? "novos" : "destaques";
  const produtos = fonte === "novos" ? await newProducts(8) : await featuredProducts(8);
  return (
    <ProductRail
      title={c.titulo || (fonte === "novos" ? "Novidades & Lançamentos" : "Mais vendidos")}
      subtitle={c.subtitulo || undefined}
      products={produtos}
      seeAllHref={c.ver_todos_link || undefined}
      apresentacao={c.apresentacao === "anel" ? "anel" : "grade"}
    />
  );
}

// Hero de topo: os slides vêm do painel (/painel/banners).
async function Carrossel() {
  const slides = await getBanners();
  return <HeroEditorial slides={slides} />;
}

function RenderBloco({ bloco }: { bloco: Bloco }) {
  const c = bloco.config;
  switch (bloco.tipo) {
    case "hero":
      return <Hero c={c} />;
    case "texto":
      return <Texto c={c} />;
    case "destaque":
      return <Destaque c={c} />;
    case "cta":
      return <Cta c={c} />;
    case "colunas":
      return <Colunas c={c} />;
    case "produtos":
      return <Produtos c={c} />;
    case "carrossel":
      return <Carrossel />;
    case "vitrine":
      return <Vitrine c={c} />;
    case "atalhos":
      return <UniverseStrip />;
    case "colecoes":
      return <UniverseMosaic titulo={c.titulo} subtitulo={c.subtitulo} />;
    case "historia":
      return <Heritage titulo={c.titulo} corpo={c.corpo} marcos={parseMarcos(c.marcos)} />;
    case "manifesto":
      return <Manifesto titulo={c.titulo} texto={c.texto} botaoTexto={c.botao_texto} botaoLink={c.botao_link} />;
    case "newsletter":
      return <Closing />;
    default:
      return null;
  }
}

export default function BlockRenderer({ blocos, home = false }: { blocos: Bloco[]; home?: boolean }) {
  return (
    <>
      {blocos.map((b) => {
        // Na home, a "faixa consultora" (bloco cta) vira o manifesto em vermelho
        // Pierre; nas demais páginas o cta continua sendo a faixa simples.
        if (home && b.tipo === "cta") {
          return <Manifesto key={b.id} titulo={b.config.titulo} texto={b.config.texto} botaoTexto={b.config.botao_texto} botaoLink={b.config.botao_link} />;
        }
        return <RenderBloco key={b.id} bloco={b} />;
      })}
    </>
  );
}
