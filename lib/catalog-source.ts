// =============================================================================
// FONTE DE CATÁLOGO DO SITE (fachada)
// Os PRODUTOS agora vêm do ERP/Bling via lib/produtos (com fallback estático).
// As CATEGORIAS vêm de lib/categorias. Este arquivo é mantido só como ponte para
// os imports existentes continuarem funcionando.
// =============================================================================
export {
  getProducts,
  productsByCategory,
  getProduct,
  featuredProducts,
  newProducts,
  relatedProducts,
} from "@/lib/produtos";

export type { Product } from "@/lib/catalog";
