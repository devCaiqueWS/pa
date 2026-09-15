// =============================================================================
// RENDERIZADOR DE BLOCOS — transforma cada bloco do CMS no visual do site.
// Recebe a lista de blocos (já lidos do banco) e desenha um por um conforme o
// tipo. Os blocos "ricos" da home reaproveitam os componentes editoriais; os
// genéricos (hero, texto, cta, colunas) usam as classes .cms-* do globals.css.
// =============================================================================
import type { Bloco } from "@/lib/cms";
import type { CSSProperties } from "react";
import BotaoLink from "@/components/ui/BotaoLink";
import Reveal from "@/components/ui/Reveal";
import { imagemSrc } from "@/lib/site";
import HeroEditorial from "@/components/home/HeroEditorial";
import UniverseStrip from "@/components/home/UniverseStrip";
import UniverseMosaic from "@/components/home/UniverseMosaic";
import Heritage, { parseMarcos } from "@/components/home/Heritage";
import EditorialFeature from "@/components/home/EditorialFeature";
import Manifesto from "@/components/home/Manifesto";
import OriginalBand from "@/components/home/OriginalBand";
import Canais from "@/components/cms/Canais";
import Valores from "@/components/cms/Valores";
import Timeline from "@/components/cms/Timeline";
import Novidades from "@/components/cms/Novidades";
import Closing from "@/components/home/Closing";
import ProductRail from "@/components/ProductRail";
import { featuredProducts, newProducts } from "@/lib/catalog-source";
import { getBanners } from "@/lib/banners";
import { getSiteConfig } from "@/lib/site-config";
import { acharWhatsApp, resolverHref } from "@/lib/links";

type Cfg = Record<string, string>;

function Botao({ texto, link, estilo = "primario", claro = false }: { texto?: string; link?: string; estilo?: string; claro?: boolean }) {
  if (!texto) return null;
  const primario = estilo !== "secundario";
  const cls = claro ? (primario ? "btn btn-light" : "btn btn-ghost-light") : primario ? "btn btn-primary" : "btn btn-outline";
  // Sem destino no painel, o botão não aparece (nada de "#" levando a lugar nenhum).
  return (
    <BotaoLink href={link || ""} className={cls}>
      {texto}
    </BotaoLink>
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
        {c.eyebrow && <span className="eyebrow">{c.eyebrow}</span>}
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

// Variantes de desenho do bloco de colunas. O conteúdo é o mesmo; muda a
// forma de ler: percurso numerado, catálogo em cartões ou escada de níveis.
const VARIANTES = ["padrao", "passos", "cards", "niveis"] as const;
type Variante = (typeof VARIANTES)[number];

function Colunas({ c }: { c: Cfg }) {
  const qtd = Math.min(Math.max(Number(c.qtd) || 3, 2), 6);
  const cols = Array.from({ length: qtd }, (_, i) => i + 1)
    .map((n) => ({ titulo: c[`col${n}_titulo`], texto: c[`col${n}_texto`], link: c[`col${n}_link`] }))
    .filter((col) => col.titulo || col.texto);

  const variante = (VARIANTES as readonly string[]).includes(c.variante) ? (c.variante as Variante) : "padrao";
  const total = cols.length;
  // Cartões: escolhe o número de colunas que fecha as linhas (6 -> 3+3, 4 -> 4).
  const colunasCards = total % 3 === 0 ? 3 : total % 4 === 0 ? 4 : Math.min(total, 3);

  return (
    <section className={`cms-colunas v-${variante}`} id={c.ancora || undefined}>
      <div className="container" style={{ "--cols": colunasCards } as CSSProperties}>
        {(c.titulo || c.subtitulo) && (
          <Reveal className="cms-colunas-head">
            {c.titulo && <h2>{c.titulo}</h2>}
            {c.subtitulo && <p className="lead">{c.subtitulo}</p>}
          </Reveal>
        )}
        <Reveal className="cms-colunas-grid" plain>
          {cols.map((col, i) => (
            <div key={i} className="cms-col" style={{ "--i": i, "--n": total } as CSSProperties}>
              {variante === "passos" && (
                <span className="cms-col-num" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
              )}
              {variante === "niveis" && <span className="cms-col-bar" aria-hidden="true" />}
              {col.titulo && <h3>{col.titulo}</h3>}
              {col.texto && <p>{col.texto}</p>}
              {col.link && (
                <BotaoLink href={col.link} className="link-line">
                  Saiba mais
                </BotaoLink>
              )}
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

// Lê os campos repetidos (col1_*, col2_*, ...) de um bloco com colunas.
function repetidos<T extends Record<string, string | undefined>>(c: Cfg, campos: (keyof T & string)[], max = 6): T[] {
  const qtd = Math.min(Math.max(Number(c.qtd) || max, 1), max);
  return Array.from({ length: qtd }, (_, i) => {
    const n = i + 1;
    return Object.fromEntries(campos.map((campo) => [campo, c[`col${n}_${campo}`]])) as T;
  });
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

// Hero de topo: os slides vêm do painel (/painel/banners). Os destinos dos
// botões são resolvidos aqui (servidor) porque o hero é componente de cliente.
async function Carrossel() {
  const [slides, cfg] = await Promise.all([getBanners(), getSiteConfig()]);
  const whats = acharWhatsApp(cfg.topStrip);
  const resolvidos = slides.map((s) => ({
    ...s,
    botao1Link: resolverHref(s.botao1Link, whats).href,
    botao2Link: resolverHref(s.botao2Link, whats).href,
  }));
  return <HeroEditorial slides={resolvidos} />;
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
    case "canais":
      return (
        <Canais
          titulo={c.titulo}
          subtitulo={c.subtitulo}
          canais={repetidos(c, ["rotulo", "titulo", "texto", "botao_texto", "link", "botao_estilo"], 4)}
        />
      );
    case "valores":
      return <Valores titulo={c.titulo} subtitulo={c.subtitulo} valores={repetidos(c, ["rotulo", "titulo", "texto"])} />;
    case "timeline":
      return (
        <Timeline
          id="timeline"
          eyebrow={c.eyebrow}
          titulo={c.titulo}
          aviso={c.aviso}
          marcos={repetidos(c, ["ano", "rotulo", "titulo", "texto"])}
        />
      );
    case "novidades":
      return (
        <Novidades
          eyebrow={c.eyebrow}
          titulo={c.titulo}
          texto={c.texto}
          placeholder={c.placeholder}
          botaoTexto={c.botao_texto}
          aviso={c.aviso}
        />
      );
    case "original":
      return <OriginalBand titulo={c.titulo} texto={c.texto} botaoTexto={c.botao_texto} botaoLink={c.botao_link} imagem={c.imagem_url} />;
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
