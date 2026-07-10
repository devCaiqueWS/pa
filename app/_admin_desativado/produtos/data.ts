import { createClient } from "@/lib/supabase/server";
import type { CategoryOption, ProductInput } from "@/components/admin/ProductForm";

// Categorias + subcategorias (do banco) para os selects do formulário.
export async function loadCategoryOptions(): Promise<CategoryOption[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("categories")
    .select("id, name, position, subcategories(id, name, position)")
    .order("position", { ascending: true });
  return (
    (data as any[])?.map((c) => ({
      id: c.id,
      name: c.name,
      subcategories: (c.subcategories ?? []).sort(
        (a: any, b: any) => a.position - b.position,
      ),
    })) ?? []
  );
}

export async function loadProduct(id: string): Promise<ProductInput | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from("products")
    .select(
      "id, slug, name, category_id, subcategory_id, line, gender, family, short_desc, image, badges, featured, is_new, active, position",
    )
    .eq("id", id)
    .single();
  return (data as ProductInput) ?? null;
}
