import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import CategoryListing from "@/components/CategoryListing";
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

      <CategoryListing category={category} products={products} />
    </>
  );
}
