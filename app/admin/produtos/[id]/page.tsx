import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { loadCategoryOptions, loadProduct } from "../data";

export default async function EditarProdutoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [categories, product] = await Promise.all([
    loadCategoryOptions(),
    loadProduct(id),
  ]);
  if (!product) notFound();

  return (
    <>
      <header className="admin-head">
        <h1>Editar produto</h1>
        <p>{product.name}</p>
      </header>
      <ProductForm categories={categories} product={product} />
    </>
  );
}
