import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type Role = "admin" | "editor" | "viewer";

export type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: Role;
};

// Usuário autenticado atual (ou null).
export async function getUser() {
  const supabase = await createClient();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

// Perfil (com papel) do usuário atual.
export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("id, email, full_name, role")
    .eq("id", user.id)
    .single();

  return (data as Profile) ?? null;
}

// Garante que há um admin logado; caso contrário redireciona.
// Retorna o perfil quando autorizado.
export async function requireAdmin(): Promise<Profile> {
  const profile = await getProfile();
  if (!profile) redirect("/login?next=/admin");
  if (profile.role !== "admin" && profile.role !== "editor") redirect("/sem-acesso");
  return profile;
}
