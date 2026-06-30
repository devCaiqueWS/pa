import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import CategoryListing from "@/components/CategoryListing";
import { asset } from "@/lib/site";
import { categories, getCategory, productsByCategory } from "@/lib/catalog-source";

export const revalidate = 60;

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  return { title: category ? category.name : "Categoria" };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategory(slug);
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
