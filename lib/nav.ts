// =============================================================================
// NAVEGAÇÃO — megamenu por categoria, no padrão Natura/Boticário.
// Derivado do catálogo: cada categoria vira um item de menu com megamenu de
// subcategorias. Itens institucionais entram à parte.
// =============================================================================
import { categories } from "@/lib/catalog";

export type MegaColumn = { label: string; href: string };

export type NavEntry =
  | { type: "link"; key: string; label: string; href: string; highlight?: boolean }
  | {
      type: "mega";
      key: string;
      label: string;
      href: string;
      columns: MegaColumn[];
    };

// Itens de categoria gerados a partir do catálogo (fonte única de verdade).
const categoryEntries: NavEntry[] = categories.map((cat) => ({
  type: "mega",
  key: cat.slug,
  label: cat.name,
  href: `/c/${cat.slug}`,
  columns: [
    { label: `Ver tudo em ${cat.name}`, href: `/c/${cat.slug}` },
    ...cat.subcategories.map((sub) => ({
      label: sub.name,
      href: `/c/${cat.slug}?sub=${sub.slug}`,
    })),
  ],
}));

export const navEntries: NavEntry[] = [
  ...categoryEntries,
  { type: "link", key: "sobre", label: "A Pierre", href: "/sobre" },
  { type: "link", key: "onde-comprar", label: "Onde Comprar", href: "/onde-comprar" },
];
