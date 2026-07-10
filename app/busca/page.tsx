// =============================================================================
// BUSCA — /busca?q=termo. Procura nos produtos do catálogo (nome, linha,
// família e descrição). Funcional já com o catálogo atual.
// =============================================================================
import type { Metadata } from "next";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/catalog-source";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ q?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return { title: q ? `Busca: ${q}` : "Busca" };
}

export default async function BuscaPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const termo = (q || "").trim().toLowerCase();

  const todos = await getProducts();
  const resultados = termo
    ? todos.filter((p) =>
        [p.name, p.line, p.family, p.shortDesc, p.gender]
          .filter(Boolean)
          .some((campo) => String(campo).toLowerCase().includes(termo))
      )
    : [];

  return (
    <section className="section">
      <div className="container">
        <div className="sec-head" style={{ textAlign: "left" }}>
          <h1>Busca</h1>
          {termo ? (
            <p>
              {resultados.length} resultado{resultados.length === 1 ? "" : "s"} para <strong>“{q}”</strong>.
            </p>
          ) : (
            <p>Digite algo na busca do topo para encontrar produtos.</p>
          )}
        </div>

        {termo && resultados.length === 0 && (
          <p style={{ color: "#7a6f64" }}>
            Nenhum produto encontrado. Tente outro termo (ex.: “desodorante”, “radicaline”, “perfume”).
          </p>
        )}

        {resultados.length > 0 && (
          <div className="rail-track" style={{ flexWrap: "wrap" }}>
            {resultados.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
