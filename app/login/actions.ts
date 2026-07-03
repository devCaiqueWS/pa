"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { query } from "@/lib/db";
import { createToken, SESSION_COOKIE } from "@/lib/session";
import type { LoginState } from "./types";

type UserRow = {
  id: number;
  nome: string;
  email: string;
  password_hash: string;
  ativo: number;
  perfil_id: number;
  perfil_codigo: string | null;
};

export async function loginAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const senha = String(formData.get("password") || "");
  const nextRaw = String(formData.get("next") || "/painel");
  const next = nextRaw.startsWith("/") ? nextRaw : "/painel";

  if (!email || !senha) return { error: "Preencha e-mail e senha." };

  const rows = await query<UserRow>(
    `SELECT u.id, u.nome, u.email, u.password_hash, u.ativo, u.perfil_id,
            p.codigo AS perfil_codigo
       FROM ofc_auth_usuarios u
       LEFT JOIN ofc_auth_perfis p ON p.id = u.perfil_id
      WHERE u.email = ?
      LIMIT 1`,
    [email]
  );

  const user = rows[0];
  if (!user || !user.ativo) return { error: "E-mail ou senha inválidos." };

  // Hashes do PHP usam o prefixo $2y$; o bcryptjs valida como $2b$ (mesmo algoritmo).
  const hash = user.password_hash.replace(/^\$2y\$/, "$2b$");
  const ok = await bcrypt.compare(senha, hash);
  if (!ok) return { error: "E-mail ou senha inválidos." };

  const token = await createToken({
    uid: user.id,
    nome: user.nome,
    email: user.email,
    perfil: user.perfil_codigo ?? String(user.perfil_id),
    perfilId: user.perfil_id,
  });

  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  // Registro de último login (best-effort — não bloqueia o login se falhar).
  try {
    await query("UPDATE ofc_auth_usuarios SET last_login_at = NOW() WHERE id = ?", [
      user.id,
    ]);
  } catch {
    /* ignora */
  }

  redirect(next);
}

export async function logoutAction() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/login");
}
