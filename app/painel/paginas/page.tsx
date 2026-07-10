import { requireRole } from "@/lib/guard";
import { getPaginas } from "@/lib/cms";
import { criarPaginaAction } from "./actions";
import PaginaLista, { type PaginaNode } from "./PaginaLista";

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

  // Monta a árvore (2 níveis): páginas principais + suas páginas-filhas.
  const tops = paginas.filter((p) => !p.parent_id);
  const arvore: PaginaNode[] = tops.map((t) => ({
    id: t.id,
    titulo: t.titulo,
    slug: t.slug,
    status: t.status,
    children: paginas
      .filter((c) => c.parent_id === t.id)
      .map((c) => ({ id: c.id, titulo: c.titulo, slug: c.slug, status: c.status })),
  }));
  const opcoesPai = tops.map((t) => ({ id: t.id, titulo: t.titulo }));
  const chave = paginas.map((p) => `${p.id}.${p.parent_id ?? 0}.${p.status}`).sort().join("|");

  return (
    <>
      <h1 style={{ marginTop: 0 }}>Páginas do site</h1>
      <p style={{ color: "#666" }}>
        Cada página é montada por blocos. Arraste pela alça <strong>⠿</strong> para reordenar, e use
        “Dentro de” para aninhar uma página sob outra.
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

      <PaginaLista key={chave} arvore={arvore} opcoesPai={opcoesPai} />
    </>
  );
}
