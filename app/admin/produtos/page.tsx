import Link from "next/link";
import { asset } from "@/lib/site";
import { createClient } from "@/lib/supabase/server";

type Row = {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  line: string | null;
  featured: boolean;
  is_new: boolean;
  active: boolean;
  badges: string[];
  categories: { name: string } | null;
};

export default async function AdminProdutosPage() {
  const supabase = await createClient();
  const { data } = supabase
    ? await supabase
        .from("products")
        .select(
          "id, name, slug, image, line, featured, is_new, active, badges, categories(name)",
        )
        .order("position", { ascending: true })
    : { data: [] as Row[] };

  const rows = (data as unknown as Row[]) ?? [];

  return (
    <>
      <header className="admin-head admin-head-row">
        <div>
          <h1>Catálogo</h1>
          <p>{rows.length} produtos na vitrine do site.</p>
        </div>
        <Link href="/admin/produtos/novo" className="btn btn-primary">
          + Novo produto
        </Link>
      </header>

      {rows.length === 0 ? (
        <div className="admin-empty">
          Catálogo vazio. Rode <code>0002_seed_catalog.sql</code> no Supabase para
          importar os produtos do site, ou clique em “Novo produto”.
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th></th>
                <th>Produto</th>
                <th>Categoria</th>
                <th>Selos</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id}>
                  <td>
                    {p.image && (
                      <img className="admin-thumb" src={asset(p.image)} alt="" />
                    )}
                  </td>
                  <td>
                    <strong>{p.name}</strong>
                    {p.line && <div className="muted">{p.line}</div>}
                  </td>
                  <td>{p.categories?.name || "—"}</td>
                  <td>
                    {[
                      ...(p.badges || []),
                      ...(p.featured ? ["Destaque"] : []),
                      ...(p.is_new ? ["Novo"] : []),
                    ].map((b) => (
                      <span key={b} className="tag">
                        {b}
                      </span>
                    ))}
                  </td>
                  <td>
                    <span className={`tag tag-${p.active ? "ativo" : "inativo"}`}>
                      {p.active ? "visível" : "oculto"}
                    </span>
                  </td>
                  <td>
                    <Link href={`/admin/produtos/${p.id}`} className="admin-edit">
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
