import Link from "next/link";
import { requireAuth } from "@/lib/guard";
import { getCategorias } from "@/lib/categorias";
import { getPaginas } from "@/lib/cms";
import { urlPublicaDaPagina } from "@/lib/site";

export const dynamic = "force-dynamic";

// Rotas fixas puramente funcionais/institucionais SEM página no CMS ficam aqui.
// (As institucionais que têm página no CMS aparecem em "Páginas de conteúdo".)
const ROTAS_FIXAS: { label: string; href: string; slug: string }[] = [
  { label: "Busca", href: "/busca", slug: "busca" },
];

const card: React.CSSProperties = { background: "#fff", border: "1px solid #eee", borderRadius: 10, padding: "1.25rem", marginBottom: "1rem" };
const url: React.CSSProperties = { color: "#999", fontSize: 12, fontFamily: "ui-monospace, monospace" };
const verLink: React.CSSProperties = { fontSize: 12, color: "#2b6cb0", textDecoration: "none", whiteSpace: "nowrap" };
const linha: React.CSSProperties = { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "8px 0", borderBottom: "1px solid #f2efea" };

function Item({ titulo, href, extra, badge, acao }: { titulo: React.ReactNode; href: string; extra?: React.ReactNode; badge?: React.ReactNode; acao?: React.ReactNode }) {
  return (
    <div style={linha}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 14 }}>
          {titulo} {badge}
        </div>
        <div style={url}>{href}</div>
        {extra}
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "center", whiteSpace: "nowrap" }}>
        {acao}
        <Link href={href} target="_blank" style={verLink}>
          ver no site ↗
        </Link>
      </div>
    </div>
  );
}

export default async function MapaPage() {
  await requireAuth("/painel/mapa");
  const paginas = await getPaginas();
  const categorias = await getCategorias();

  return (
    <>
      <h1 style={{ margin: "0 0 .25rem" }}>Mapa do site</h1>
      <p style={{ color: "#888", margin: "0 0 1.5rem", fontSize: 14, lineHeight: 1.6 }}>
        Todas as páginas do site em um só lugar. As <strong>Páginas de conteúdo</strong> são editáveis pelo painel; as
        <strong> Categorias</strong> e as poucas <strong>rotas fixas</strong> ainda vêm do código (por ora).
      </p>

      {/* Páginas de conteúdo (CMS) */}
      <div style={card}>
        <h2 style={{ margin: "0 0 .25rem", fontSize: 18 }}>Páginas de conteúdo (editáveis)</h2>
        <p style={{ color: "#999", fontSize: 12, margin: "0 0 .5rem" }}>
          Cada uma tem um endereço público próprio e é montada por blocos no CMS. Edite em{" "}
          <Link href="/painel/paginas">Páginas do site</Link>.
        </p>
        {paginas.length === 0 ? (
          <p style={{ color: "#a15c00", fontSize: 13 }}>Nenhuma página criada ainda.</p>
        ) : (
          paginas.map((p) => {
            const publica = urlPublicaDaPagina(p.slug);
            const temRotaLimpa = publica !== `/pagina/${p.slug}`;
            return (
              <Item
                key={p.id}
                titulo={p.titulo}
                href={publica}
                badge={
                  <span
                    style={{
                      fontSize: 11,
                      borderRadius: 999,
                      padding: "1px 8px",
                      background: p.status === "publicado" ? "#e6f4ea" : "#fff0e0",
                      color: p.status === "publicado" ? "#1e7e34" : "#a15c00",
                    }}
                  >
                    {p.status}
                  </span>
                }
                extra={
                  temRotaLimpa ? (
                    <div style={{ color: "#bbb", fontSize: 11 }}>também acessível em /pagina/{p.slug}</div>
                  ) : null
                }
                acao={
                  <Link href={`/painel/paginas/${p.id}`} style={{ ...verLink, color: "#7a5c1e" }}>
                    editar
                  </Link>
                }
              />
            );
          })
        )}
      </div>

      {/* Categorias */}
      <div style={card}>
        <h2 style={{ margin: "0 0 .25rem", fontSize: 18 }}>Categorias do catálogo</h2>
        <p style={{ color: "#999", fontSize: 12, margin: "0 0 .5rem" }}>
          Fixas no código por ora. Endereço: <code>/c/…</code>. (Gerenciáveis pelo painel numa fase futura.)
        </p>
        {categorias.map((c) => (
          <Item
            key={c.slug}
            titulo={<strong>{c.name}</strong>}
            href={`/c/${c.slug}`}
            extra={
              c.subcategories.length ? (
                <div style={{ marginTop: 4, display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {c.subcategories.map((s) => (
                    <Link
                      key={s.slug}
                      href={`/c/${c.slug}?sub=${s.slug}`}
                      target="_blank"
                      style={{ fontSize: 11, color: "#666", background: "#f4f1ec", borderRadius: 999, padding: "1px 8px", textDecoration: "none" }}
                    >
                      {s.name}
                    </Link>
                  ))}
                </div>
              ) : null
            }
          />
        ))}
      </div>

      {/* Rotas fixas restantes */}
      <div style={card}>
        <h2 style={{ margin: "0 0 .25rem", fontSize: 18 }}>Outras rotas fixas</h2>
        <p style={{ color: "#999", fontSize: 12, margin: "0 0 .5rem" }}>Páginas funcionais do código, não editáveis pelo painel.</p>
        {ROTAS_FIXAS.map((r) => (
          <Item key={r.href} titulo={r.label} href={r.href} />
        ))}
      </div>
    </>
  );
}
