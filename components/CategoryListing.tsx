"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import type { Category, Product } from "@/lib/catalog";

type SortKey = "destaque" | "az" | "za" | "novidades";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "destaque", label: "Destaques" },
  { key: "novidades", label: "Novidades" },
  { key: "az", label: "Nome: A-Z" },
  { key: "za", label: "Nome: Z-A" },
];

export default function CategoryListing({
  category,
  products,
}: {
  category: Category;
  products: Product[];
}) {
  const [sub, setSub] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>("destaque");
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Lê ?sub= da URL no cliente (mantém o build estático compatível).
  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("sub");
    if (param && category.subcategories.some((s) => s.slug === param)) {
      setSub(param);
    }
  }, [category]);

  const filtered = useMemo(() => {
    let list = sub ? products.filter((p) => p.subcategorySlug === sub) : products.slice();
    switch (sort) {
      case "az":
        list.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
        break;
      case "za":
        list.sort((a, b) => b.name.localeCompare(a.name, "pt-BR"));
        break;
      case "novidades":
        list.sort((a, b) => Number(b.isNew ?? false) - Number(a.isNew ?? false));
        break;
      default:
        list.sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false));
    }
    return list;
  }, [products, sub, sort]);

  return (
    <section className="section">
      <div className="container listing">
        <aside className={`listing-filters${filtersOpen ? " open" : ""}`}>
          <h4>Filtrar</h4>
          <ul className="filter-group">
            <li>
              <button
                className={sub === null ? "active" : ""}
                onClick={() => setSub(null)}
                type="button"
              >
                Todos
              </button>
            </li>
            {category.subcategories.map((s) => (
              <li key={s.slug}>
                <button
                  className={sub === s.slug ? "active" : ""}
                  onClick={() => setSub(s.slug)}
                  type="button"
                >
                  {s.name}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <div className="listing-main">
          <div className="listing-bar">
            <button
              className="listing-filter-toggle"
              type="button"
              onClick={() => setFiltersOpen((v) => !v)}
            >
              Filtros
            </button>
            <span className="listing-count">{filtered.length} produtos</span>
            <label className="listing-sort">
              Ordenar por
              <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
                {SORTS.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {filtered.length === 0 ? (
            <p className="listing-empty">Nenhum produto nesta seleção ainda.</p>
          ) : (
            <div className="listing-grid">
              {filtered.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
