import Link from "next/link";
import { requireRole } from "@/lib/guard";
import { getPaginas } from "@/lib/cms";
import { criarPaginaAction, excluirPaginaAction, duplicarPaginaAction } from "./actions";

export const dynamic = "force-dynamic";

const EDIT_ROLES = ["admin", "admin_ti"];

const card: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #eee",
  borderRadius: 10,
  padding: "1rem 1.25rem",
};

export default async function PaginasPage() {
  await requireRole(EDIT_ROLES, "/painel/paginas");
  const paginas = await getPaginas();

  return (
    <>
      <h1 style={{ marginTop: 0 }}>Páginas do site</h1>
      <p style={{ color: "#666" }}>
        Cada página é montada por blocos (banner, texto, colunas, chamada...). Crie uma
        página e depois adicione os blocos.
      </p>

      {/* Criar nova página */}
      <form
        action={criarPaginaAction}
        style={{ ...card, display: "flex", gap: ".75rem", alignItems: "flex-end", flexWrap: "wrap", marginBottom: "1.5rem" }}
      >
        <div style={{ flex: "1 1 240px" }}>
          <label style={{ display: "block", fontWeight: 600, marginBottom: 4, fontSize: 14 }}>
            Título da nova página
          </label>
          <input
            name="titulo"
            required
            placeholder="Ex.: Nossa História"
            style={{ width: "100%", padding: 8, border: "1px solid #ddd", borderRadius: 6, fontSize: 14 }}
          />
        </div>
        <div style={{ flex: "1 1 200px" }}>
          <label style={{ display: "block", fontWeight: 600, marginBottom: 4, fontSize: 14 }}>
            Endereço (opcional)
          </label>
          <input
            name="slug"
            placeholder="gerado do título"
            style={{ width: "100%", padding: 8, border: "1px solid #ddd", borderRadius: 6, fontSize: 14 }}
          />
        </div>
        <button className="btn btn-primary" type="submit">
          Criar página
        </button>
      </form>

      {paginas.length === 0 ? (
        <div style={{ ...card, background: "#fff8e1", border: "1px solid #ffe082" }}>
          Nenhuma página ainda. Se acabou de configurar o banco, rode{" "}
          <code>db/site_cms.sql</code> e crie a primeira página acima.
        </div>
      ) : (
        <div style={{ display: "grid", gap: ".75rem" }}>
          {paginas.map((p) => (
            <div key={p.id} style={{ ...card, display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
              <div>
                <Link href={`/painel/paginas/${p.id}`} style={{ fontWeight: 600, fontSize: 16 }}>
                  {p.titulo}
                </Link>
                <div style={{ color: "#888", fontSize: 13, marginTop: 2 }}>
                  /pagina/{p.slug}
                  <span
                    style={{
                      marginLeft: 8,
                      padding: "1px 8px",
                      borderRadius: 999,
                      fontSize: 12,
                      background: p.status === "publicado" ? "#e6f4ea" : "#fff0e0",
                      color: p.status === "publicado" ? "#1e7e34" : "#a15c00",
                    }}
                  >
                    {p.status}
                  </span>
                </div>
              </div>
              <div style={{ display: "flex", gap: ".5rem", alignItems: "center" }}>
                {p.status === "publicado" && (
                  <Link className="btn" href={`/pagina/${p.slug}`} target="_blank">
                    Ver
                  </Link>
                )}
                <Link className="btn" href={`/painel/paginas/${p.id}`}>
                  Editar
                </Link>
                <form action={duplicarPaginaAction}>
                  <input type="hidden" name="id" value={p.id} />
                  <button className="btn" type="submit" title="Cria uma cópia (rascunho) com os mesmos blocos">
                    Duplicar
                  </button>
                </form>
                <form action={excluirPaginaAction}>
                  <input type="hidden" name="id" value={p.id} />
                  <button className="btn" type="submit" style={{ color: "#b00020" }}>
                    Excluir
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
