// =============================================================================
// RENDERIZADOR DE BLOCOS — transforma cada bloco do CMS no visual do site.
// Recebe a lista de blocos (já lidos do banco) e desenha um por um conforme o
// tipo. Estilo comercial (venda direta), consistente com o restante do site.
// =============================================================================
import Link from "next/link";
import type { Bloco } from "@/lib/cms";
import { asset, BASE_PATH } from "@/lib/site";
import HeroCarousel from "@/components/HeroCarousel";
import CategoryShortcuts from "@/components/CategoryShortcuts";
import Newsletter from "@/components/Newsletter";
import ProductRail from "@/components/ProductRail";
import { featuredProducts, newProducts } from "@/lib/catalog-source";
import { getCategorias } from "@/lib/categorias";

const MARROM = "#3a2a1e";
const AREIA = "#faf9f7";
const DOURADO = "#b08d57";

// Resolve o caminho de uma imagem: paths locais ("/assets/...") ganham o
// basePath; URLs completas (http...) e paths já prefixados passam intactos.
function img(url?: string): string | undefined {
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url) || url.startsWith(BASE_PATH)) return url;
  if (url.startsWith("/")) return asset(url);
  return url;
}

function Botao({
  texto,
  link,
  estilo = "primario",
}: {
  texto?: string;
  link?: string;
  estilo?: string;
}) {
  if (!texto) return null;
  const href = link || "#";
  const primario = estilo !== "secundario";
  const style: React.CSSProperties = {
    display: "inline-block",
    padding: "0.75rem 1.5rem",
    borderRadius: 999,
    fontWeight: 600,
    textDecoration: "none",
    fontSize: 15,
    border: `2px solid ${DOURADO}`,
    background: primario ? DOURADO : "transparent",
    color: primario ? "#fff" : DOURADO,
  };
  return (
    <Link href={href} style={style}>
      {texto}
    </Link>
  );
}

const container: React.CSSProperties = {
  maxWidth: 1100,
  margin: "0 auto",
  padding: "0 1.25rem",
};

function Hero({ c }: { c: Record<string, string> }) {
  const centro = c.alinhamento !== "esquerda";
  const imagem = img(c.imagem_url);
  return (
    <section
      style={{
        background: imagem
          ? `linear-gradient(rgba(30,20,12,0.45), rgba(30,20,12,0.45)), url(${imagem}) center/cover`
          : `linear-gradient(135deg, ${MARROM}, #6b4b32)`,
        color: "#fff",
        padding: "5rem 0",
      }}
    >
      <div style={{ ...container, textAlign: centro ? "center" : "left", maxWidth: 820 }}>
        {c.eyebrow && (
          <p style={{ letterSpacing: 2, textTransform: "uppercase", fontSize: 13, color: "#e9d9c3", margin: "0 0 .75rem" }}>
            {c.eyebrow}
          </p>
        )}
        {c.titulo && <h1 style={{ fontSize: "2.6rem", margin: "0 0 1rem", lineHeight: 1.15 }}>{c.titulo}</h1>}
        {c.subtitulo && <p style={{ fontSize: "1.15rem", color: "#f0e7db", margin: "0 0 1.75rem" }}>{c.subtitulo}</p>}
        <Botao texto={c.botao_texto} link={c.botao_link} estilo={c.botao_estilo} />
      </div>
    </section>
  );
}

function Texto({ c }: { c: Record<string, string> }) {
  const centro = c.alinhamento === "centro";
  return (
    <section style={{ padding: "3.5rem 0" }}>
      <div style={{ ...container, maxWidth: 760, textAlign: centro ? "center" : "left" }}>
        {c.titulo && <h2 style={{ fontSize: "1.9rem", margin: "0 0 1rem", color: MARROM }}>{c.titulo}</h2>}
        {c.corpo &&
          c.corpo.split("\n").filter(Boolean).map((par, i) => (
            <p key={i} style={{ fontSize: "1.05rem", lineHeight: 1.7, color: "#4a4038", margin: "0 0 1rem" }}>
              {par}
            </p>
          ))}
      </div>
    </section>
  );
}

function Cta({ c }: { c: Record<string, string> }) {
  return (
    <section style={{ background: MARROM, color: "#fff", padding: "3.5rem 0" }}>
      <div style={{ ...container, textAlign: "center", maxWidth: 760 }}>
        {c.titulo && <h2 style={{ fontSize: "2rem", margin: "0 0 .75rem" }}>{c.titulo}</h2>}
        {c.texto && <p style={{ fontSize: "1.1rem", color: "#f0e7db", margin: "0 0 1.75rem" }}>{c.texto}</p>}
        <Botao texto={c.botao_texto} link={c.botao_link} estilo="primario" />
      </div>
    </section>
  );
}

function Destaque({ c }: { c: Record<string, string> }) {
  const imgEsquerda = c.imagem_lado === "esquerda";
  const tags = (c.tags || "").split(",").map((t) => t.trim()).filter(Boolean);
  const botoes: { texto?: string; link?: string; estilo: string }[] = [
    { texto: c.botao1_texto, link: c.botao1_link, estilo: "primario" },
    { texto: c.botao2_texto, link: c.botao2_link, estilo: "secundario" },
    { texto: c.botao3_texto, link: c.botao3_link, estilo: "secundario" },
  ].filter((b) => b.texto);

  const Imagem = c.imagem_url ? (
    <div style={{ flex: "1 1 320px" }}>
      <img
        src={img(c.imagem_url)}
        alt={c.titulo || ""}
        style={{ width: "100%", borderRadius: 14, display: "block", objectFit: "cover" }}
      />
    </div>
  ) : null;

  const Texto = (
    <div style={{ flex: "1 1 340px" }}>
      {c.eyebrow && (
        <p style={{ letterSpacing: 2, textTransform: "uppercase", fontSize: 13, color: DOURADO, margin: "0 0 .75rem" }}>
          {c.eyebrow}
        </p>
      )}
      {c.titulo && <h2 style={{ fontSize: "1.9rem", margin: "0 0 1rem", color: MARROM, lineHeight: 1.2 }}>{c.titulo}</h2>}
      {c.corpo &&
        c.corpo.split("\n").filter(Boolean).map((par, i) => (
          <p key={i} style={{ fontSize: "1.05rem", lineHeight: 1.7, color: "#4a4038", margin: "0 0 1rem" }}>
            {par}
          </p>
        ))}
      {tags.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem", margin: "0 0 1.25rem" }}>
          {tags.map((t, i) => (
            <span key={i} style={{ border: `1px solid ${DOURADO}`, color: MARROM, borderRadius: 999, padding: "3px 12px", fontSize: 13 }}>
              {t}
            </span>
          ))}
        </div>
      )}
      {botoes.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: ".75rem" }}>
          {botoes.map((b, i) => (
            <Botao key={i} texto={b.texto} link={b.link} estilo={b.estilo} />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <section style={{ padding: "3.5rem 0" }}>
      <div style={{ ...container, display: "flex", gap: "2.5rem", alignItems: "center", flexWrap: "wrap" }}>
        {imgEsquerda ? (
          <>
            {Imagem}
            {Texto}
          </>
        ) : (
          <>
            {Texto}
            {Imagem}
          </>
        )}
      </div>
    </section>
  );
}

function Colunas({ c }: { c: Record<string, string> }) {
  const qtd = Math.min(Math.max(Number(c.qtd) || 3, 2), 6);
  const cols = Array.from({ length: qtd }, (_, i) => i + 1)
    .map((n) => ({
      titulo: c[`col${n}_titulo`],
      texto: c[`col${n}_texto`],
      link: c[`col${n}_link`],
    }))
    .filter((col) => col.titulo || col.texto);

  return (
    <section style={{ padding: "3.5rem 0", background: AREIA }}>
      <div style={container}>
        {c.titulo && (
          <h2 style={{ fontSize: "1.9rem", margin: "0 0 2rem", color: MARROM, textAlign: "center" }}>{c.titulo}</h2>
        )}
        <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fit, minmax(220px, 1fr))`, gap: "1.5rem" }}>
          {cols.map((col, i) => (
            <div key={i} style={{ background: "#fff", border: "1px solid #eee", borderRadius: 12, padding: "1.5rem" }}>
              {col.titulo && <h3 style={{ margin: "0 0 .5rem", color: MARROM }}>{col.titulo}</h3>}
              {col.texto && <p style={{ margin: "0 0 .75rem", color: "#5a5048", lineHeight: 1.6 }}>{col.texto}</p>}
              {col.link && (
                <Link href={col.link} style={{ color: DOURADO, fontWeight: 600, textDecoration: "none" }}>
                  Saiba mais →
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Produtos({ c }: { c: Record<string, string> }) {
  return (
    <section style={{ padding: "3.5rem 0" }}>
      <div style={{ ...container, textAlign: "center" }}>
        {c.titulo && <h2 style={{ fontSize: "1.9rem", margin: "0 0 .5rem", color: MARROM }}>{c.titulo}</h2>}
        {c.subtitulo && <p style={{ color: "#7a6f64", margin: "0 0 2rem" }}>{c.subtitulo}</p>}
        <div
          style={{
            border: `2px dashed ${DOURADO}`,
            borderRadius: 12,
            padding: "2.5rem",
            color: "#7a6f64",
            maxWidth: 600,
            margin: "0 auto",
          }}
        >
          Vitrine de produtos — conecta ao módulo de <strong>Produtos</strong>, que entra na próxima etapa.
        </div>
      </div>
    </section>
  );
}

// --- Blocos "ricos" da home: reaproveitam componentes prontos do site --------

// Vitrine automática: puxa produtos do catálogo (destaques ou novidades).
async function Vitrine({ c }: { c: Record<string, string> }) {
  const fonte = c.fonte === "novos" ? "novos" : "destaques";
  const produtos = fonte === "novos" ? await newProducts(8) : await featuredProducts(8);
  return (
    <ProductRail
      title={c.titulo || (fonte === "novos" ? "Novidades & Lançamentos" : "Mais vendidos")}
      subtitle={c.subtitulo || undefined}
      products={produtos}
      seeAllHref={c.ver_todos_link || undefined}
    />
  );
}

// Grade de coleções por categoria (mesma taxonomia do menu/atalhos).
async function Colecoes({ c }: { c: Record<string, string> }) {
  const categorias = await getCategorias();
  return (
    <section className="section section-soft">
      <div className="container">
        <div className="sec-head">
          <h2>{c.titulo || "Explore por categoria"}</h2>
          {c.subtitulo && <p>{c.subtitulo}</p>}
        </div>
        <div className="coll-grid">
          {categorias.map((cat) => (
            <Link key={cat.slug} className="coll-card" href={`/c/${cat.slug}`}>
              <div className="coll-media">
                <img src={asset(cat.image)} alt={cat.name} loading="lazy" />
              </div>
              <div className="coll-body">
                <h3>{cat.name}</h3>
                <p>{cat.tagline}</p>
                <span className="coll-link">Ver produtos →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function RenderBloco({ bloco }: { bloco: Bloco }) {
  switch (bloco.tipo) {
    case "hero":
      return <Hero c={bloco.config} />;
    case "texto":
      return <Texto c={bloco.config} />;
    case "destaque":
      return <Destaque c={bloco.config} />;
    case "cta":
      return <Cta c={bloco.config} />;
    case "colunas":
      return <Colunas c={bloco.config} />;
    case "produtos":
      return <Produtos c={bloco.config} />;
    case "carrossel":
      return <HeroCarousel />;
    case "vitrine":
      return <Vitrine c={bloco.config} />;
    case "atalhos":
      return <CategoryShortcuts />;
    case "colecoes":
      return <Colecoes c={bloco.config} />;
    case "newsletter":
      return <Newsletter />;
    default:
      return null;
  }
}

export default function BlockRenderer({ blocos }: { blocos: Bloco[] }) {
  return (
    <>
      {blocos.map((b) => (
        <RenderBloco key={b.id} bloco={b} />
      ))}
    </>
  );
}
