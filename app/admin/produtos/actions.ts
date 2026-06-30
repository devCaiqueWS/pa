"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function parseBadges(raw: string): string[] {
  return raw
    .split(",")
    .map((b) => b.trim())
    .filter(Boolean);
}

// Cria ou atualiza um produto (a partir do formulário do CMS).
export async function upsertProduct(formData: FormData) {
  const supabase = await createClient();
  if (!supabase) redirect("/admin/produtos");

  const id = (formData.get("id") as string) || null;

  const payload = {
    slug: String(formData.get("slug") || "").trim(),
    name: String(formData.get("name") || "").trim(),
    category_id: (formData.get("category_id") as string) || null,
    subcategory_id: (formData.get("subcategory_id") as string) || null,
    line: (String(formData.get("line") || "").trim()) || null,
    gender: (String(formData.get("gender") || "").trim()) || null,
    family: (String(formData.get("family") || "").trim()) || null,
    short_desc: String(formData.get("short_desc") || "").trim(),
    image: String(formData.get("image") || "").trim(),
    badges: parseBadges(String(formData.get("badges") || "")),
    featured: formData.get("featured") === "on",
    is_new: formData.get("is_new") === "on",
    active: formData.get("active") === "on",
    position: Number(formData.get("position") || 0),
    updated_at: new Date().toISOString(),
  };

  if (id) {
    await supabase.from("products").update(payload).eq("id", id);
  } else {
    await supabase.from("products").insert(payload);
  }

  // Atualiza site + listagem do admin.
  revalidatePath("/", "layout");
  revalidatePath("/admin/produtos");
  redirect("/admin/produtos");
}

// Liga/desliga a visibilidade do produto no site.
export async function toggleActive(formData: FormData) {
  const supabase = await createClient();
  if (!supabase) return;
  const id = String(formData.get("id"));
  const active = formData.get("active") === "true";
  await supabase.from("products").update({ active: !active }).eq("id", id);
  revalidatePath("/", "layout");
  revalidatePath("/admin/produtos");
}

export async function deleteProduct(formData: FormData) {
  const supabase = await createClient();
  if (!supabase) return;
  const id = String(formData.get("id"));
  await supabase.from("products").delete().eq("id", id);
  revalidatePath("/", "layout");
  revalidatePath("/admin/produtos");
}
