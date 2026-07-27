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

const GENDER_LABELS: Record<string, string> = {
  feminino: "Feminino",
  masculino: "Masculino",
  unissex: "Unissex",
  infantil: "Infantil",
};

// Alterna um valor num Set (imutável), devolvendo um novo Set.
function toggle(set: Set<string>, value: string): Set<string> {
  const next = new Set(set);
  next.has(value) ? next.delete(value) : next.add(value);
  return next;
}

export default function CategoryListing({
  category,
  products,
}: {
  category: Category;
  products: Product[];
}) {
  const [sub, setSub] = useState<string | null>(null);
  const [genders, setGenders] = useState<Set<string>>(new Set());
  const [families, setFamilies] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<SortKey>("destaque");
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Lê ?sub= da URL no cliente (mantém o build estático compatível).
  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("sub");
    if (param && category.subcategories.some((s) => s.slug === param)) {
      setSub(param);
    }
  }, [category]);

  // Facetas DERIVADAS dos produtos: um grupo de filtro só aparece se ao menos
  // um produto da categoria carrega aquele campo. Assim nada fica vazio, e o
  // filtro fica mais rico automaticamente conforme a curadoria do ERP evolui.
  const genderFacets = useMemo(() => {
    const seen = new Set<string>();
    for (const p of products) if (p.gender) seen.add(p.gender);
    return [...seen];
  }, [products]);

  const familyFacets = useMemo(() => {
    const seen = new Set<string>();
    for (const p of products) if (p.family) seen.add(p.family);
    return [...seen].sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [products]);

  const filtered = useMemo(() => {
    const list = products.filter(
      (p) =>
        (!sub || p.subcategorySlug === sub) &&
        (genders.size === 0 || (p.gender != null && genders.has(p.gender))) &&
        (families.size === 0 || (p.family != null && families.has(p.family)))
    );
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
  }, [products, sub, genders, families, sort]);

  const subName = sub ? category.subcategories.find((s) => s.slug === sub)?.name : null;
  const hasFilters = sub !== null || genders.size > 0 || families.size > 0;

  function clearAll() {
    setSub(null);
    setGenders(new Set());
    setFamilies(new Set());
  }

  return (
    <section className="section">
      <div className="container listing">
        <aside className={`listing-filters${filtersOpen ? " open" : ""}`}>
          <div className="filter-block">
            <h4>Subcategorias</h4>
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
          </div>

          {genderFacets.length > 0 && (
            <div className="filter-block">
              <h4>Gênero</h4>
              <ul className="filter-checks">
                {genderFacets.map((g) => (
                  <li key={g}>
                    <label className="filter-check">
                      <input
                        type="checkbox"
                        checked={genders.has(g)}
                        onChange={() => setGenders((prev) => toggle(prev, g))}
                      />
                      {GENDER_LABELS[g] ?? g}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {familyFacets.length > 0 && (
            <div className="filter-block">
              <h4>Família olfativa</h4>
              <ul className="filter-checks">
                {familyFacets.map((f) => (
                  <li key={f}>
                    <label className="filter-check">
                      <input
                        type="checkbox"
                        checked={families.has(f)}
                        onChange={() => setFamilies((prev) => toggle(prev, f))}
                      />
                      {f}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          )}
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

          {hasFilters && (
            <div className="listing-chips">
              {subName && (
                <button className="chip" type="button" onClick={() => setSub(null)}>
                  {subName} <span aria-hidden="true">×</span>
                </button>
              )}
              {[...genders].map((g) => (
                <button
                  key={g}
                  className="chip"
                  type="button"
                  onClick={() => setGenders((prev) => toggle(prev, g))}
                >
                  {GENDER_LABELS[g] ?? g} <span aria-hidden="true">×</span>
                </button>
              ))}
              {[...families].map((f) => (
                <button
                  key={f}
                  className="chip"
                  type="button"
                  onClick={() => setFamilies((prev) => toggle(prev, f))}
                >
                  {f} <span aria-hidden="true">×</span>
                </button>
              ))}
              <button className="listing-clear" type="button" onClick={clearAll}>
                Limpar filtros
              </button>
            </div>
          )}

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
