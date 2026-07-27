import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import CategoryListing from "@/components/CategoryListing";
import ProductRail from "@/components/ProductRail";
import { productsByCategory } from "@/lib/catalog-source";
import { getCategorias, getCategoriaBySlug } from "@/lib/categorias";

export const revalidate = 60;

export async function generateStaticParams() {
  const categorias = await getCategorias();
  return categorias.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoriaBySlug(slug);
  return { title: category ? category.name : "Categoria" };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategoriaBySlug(slug);
  if (!category) notFound();

  const products = await productsByCategory(slug);
  const destaques = products.filter((p) => p.featured);
  // Vitrine de destaques só quando há o suficiente E ainda sobra produto fora
  // dela — evita repetir a grade inteira em categorias pequenas.
  const mostrarDestaques = destaques.length >= 3 && products.length > destaques.length;

  return (
    <>
      <section className="cat-hero">
        <div className="container">
          <nav className="crumbs" aria-label="Caminho">
            <Link href="/">Início</Link>
            <span>/</span>
            <span>{category.name}</span>
          </nav>
          <h1>{category.name}</h1>
          <p>{category.tagline}</p>
        </div>
      </section>

      {mostrarDestaques && (
        <ProductRail
          title={`Destaques em ${category.name}`}
          products={destaques.slice(0, 8)}
        />
      )}

      <CategoryListing category={category} products={products} />
    </>
  );
}
