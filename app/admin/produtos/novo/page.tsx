import ProductForm from "@/components/admin/ProductForm";
import { loadCategoryOptions } from "../data";

export default async function NovoProdutoPage() {
  const categories = await loadCategoryOptions();
  return (
    <>
      <header className="admin-head">
        <h1>Novo produto</h1>
        <p>Adicione um produto à vitrine do site.</p>
      </header>
      <ProductForm categories={categories} />
    </>
  );
}
