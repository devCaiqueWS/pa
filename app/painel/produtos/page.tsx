import Link from "next/link";
import { requireRole } from "@/lib/guard";
import { getProdutosAdmin, getCfgProdutos } from "@/lib/produtos";
import { getCategorias } from "@/lib/categorias";
import { imagemSrc } from "@/lib/site";
import { salvarCfgProdutosAction } from "./actions";

export const dynamic = "force-dynamic";

const EDIT_ROLES = ["admin", "admin_ti"];

const card: React.CSSProperties = { background: "#fff", border: "1px solid #eee", borderRadius: 10, padding: "1.25rem", marginBottom: "1rem" };
const inputStyle: React.CSSProperties = { padding: 8, border: "1px solid #ddd", borderRadius: 6, fontFamily: "inherit", fontSize: 14 };

function precoBR(n?: number): string {
  if (n == null) return "—";
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default async function ProdutosPage() {
  await requireRole(EDIT_ROLES, "/painel/produtos");
  const [produtos, cfg, categorias] = await Promise.all([getProdutosAdmin(), getCfgProdutos(), getCategorias()]);
  const nomeCategoria = (slug: string) => categorias.find((c) => c.slug === slug)?.name || slug;

  const semCategoria = produtos.filter((p) => !p.categorySlug).length;

  return (
    <>
      <h1 style={{ margin: "0 0 .25rem" }}>Produtos</h1>
      <p style={{ color: "#888", margin: "0 0 1.25rem", fontSize: 14, lineHeight: 1.6 }}>
        A origem é o <strong>ERP (Bling)</strong>. Entram no site os produtos com a <strong>tag</strong> abaixo. Aqui você
        faz a <strong>curadoria</strong>: categoria-de-vitrine, foto, destaque e visibilidade. Nome e preço vêm do ERP.
      </p>

      {/* Config da tag */}
      <form action={salvarCfgProdutosAction} style={{ ...card, display: "flex", gap: ".75rem", alignItems: "flex-end", flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 320px" }}>
          <label style={{ display: "block", fontWeight: 600, marginBottom: 4, fontSize: 13 }}>
            Tag(s) que marcam um produto como “do site”
          </label>
          <input name="tags" defaultValue={cfg.tags.join(", ")} style={{ ...inputStyle, width: "100%" }} />
          <p style={{ margin: "3px 0 0", fontSize: 12, color: "#999" }}>
            Separadas por vírgula. Padrão: <code>Agrupamento:Origem</code>.
          </p>
        </div>
        <button className="btn btn-primary" type="submit">Salvar tag</button>
      </form>

      {/* Resumo */}
      <p style={{ fontSize: 13, color: "#666", margin: "0 0 .75rem" }}>
        <strong>{produtos.length}</strong> produtos do ERP entram no site.
        {semCategoria > 0 && (
          <span style={{ color: "#a15c00" }}> {" "}⚠ {semCategoria} sem categoria-de-vitrine (não aparecem em /c/… até você definir).</span>
        )}
      </p>

      {/* Lista */}
      <div style={card}>
        {produtos.length === 0 ? (
          <p style={{ color: "#a15c00", fontSize: 14 }}>
            Nenhum produto encontrado com a tag configurada. Confira a tag acima e se o ERP tem produtos com ela.
          </p>
        ) : (
          produtos.map((p) => (
            <div
              key={p.blingId}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid #f2efea", opacity: p.visivel ? 1 : 0.5 }}
            >
              <div style={{ width: 48, height: 48, flex: "none", borderRadius: 6, border: "1px solid #eee", overflow: "hidden", background: "#faf7f2", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {p.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imagemSrc(p.image)} alt="" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                ) : (
                  <span style={{ fontSize: 9, color: "#bbb", textAlign: "center" }}>sem foto</span>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{p.name}</div>
                <div style={{ fontSize: 12, color: "#999" }}>
                  {precoBR(p.preco)} · ERP: {p.categoriaErp || "—"}
                  {" · "}
                  {p.categorySlug ? (
                    <span style={{ color: "#1e7e34" }}>vitrine: {nomeCategoria(p.categorySlug)}</span>
                  ) : (
                    <span style={{ color: "#b00020" }}>sem categoria-de-vitrine</span>
                  )}
                </div>
              </div>
              {p.featured && <span style={badge("#b94b3a")}>destaque</span>}
              {p.isNew && <span style={badge("#2b6cb0")}>novo</span>}
              {!p.visivel && <span style={badge("#888")}>oculto</span>}
              <Link className="btn" href={`/painel/produtos/${p.blingId}`} style={{ fontSize: 13 }}>
                Editar
              </Link>
            </div>
          ))
        )}
      </div>
    </>
  );
}

function badge(cor: string): React.CSSProperties {
  return { fontSize: 11, color: "#fff", background: cor, borderRadius: 999, padding: "1px 8px", whiteSpace: "nowrap" };
}
