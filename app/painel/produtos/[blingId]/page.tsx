import { notFound } from "next/navigation";
import { requireRole } from "@/lib/guard";
import { getProdutoEdit } from "@/lib/produtos";
import { getCategorias } from "@/lib/categorias";
import ProdutoForm from "./ProdutoForm";

export const dynamic = "force-dynamic";

const EDIT_ROLES = ["admin", "admin_ti"];

export default async function EditarProdutoPage({ params }: { params: Promise<{ blingId: string }> }) {
  await requireRole(EDIT_ROLES, "/painel/produtos");
  const { blingId } = await params;
  const [produto, categorias] = await Promise.all([getProdutoEdit(Number(blingId)), getCategorias()]);
  if (!produto) notFound();

  return (
    <>
      <h1 style={{ margin: "0 0 1rem" }}>Editar produto</h1>
      <ProdutoForm produto={produto} categorias={categorias} />
    </>
  );
}
