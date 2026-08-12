import Link from "next/link";
import { requireRole } from "@/lib/guard";
import { getCategorias } from "@/lib/categorias";
import CategoriasEditor from "./CategoriasEditor";
import { salvarCategoriasAction } from "./actions";

export const dynamic = "force-dynamic";

const EDIT_ROLES = ["admin", "admin_ti"];

export default async function CategoriasPage() {
  await requireRole(EDIT_ROLES, "/painel/categorias");
  const categorias = await getCategorias();

  return (
    <>
      <h1 style={{ margin: "0 0 .25rem" }}>Categorias</h1>
      <p style={{ color: "#888", margin: "0 0 1.5rem", fontSize: 14, lineHeight: 1.6 }}>
        As categorias do catálogo (endereço <code>/c/…</code>). Elas aparecem no <Link href="/painel/menu">Menu</Link>, nos
        atalhos da home e nas páginas de listagem. Arraste pela alça <strong>⠿</strong> para reordenar.
      </p>

      <form action={salvarCategoriasAction}>
        <CategoriasEditor initial={categorias} />
        <div style={{ textAlign: "right", marginTop: "1rem" }}>
          <button className="btn btn-primary" type="submit">
            Salvar categorias
          </button>
        </div>
      </form>
    </>
  );
}
