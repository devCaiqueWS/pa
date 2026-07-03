// =============================================================================
// GUARDAS DE ROTA (server components / server actions)
// Lê a sessão do cookie e, quando exigido, redireciona para /login.
// =============================================================================
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, verifyToken, type Session } from "@/lib/session";

export async function getSession(): Promise<Session | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return token ? verifyToken(token) : null;
}

// Exige usuário logado. Redireciona para /login preservando o destino.
export async function requireAuth(next = "/painel"): Promise<Session> {
  const session = await getSession();
  if (!session) redirect(`/login?next=${encodeURIComponent(next)}`);
  return session;
}

// Exige um dos perfis informados (ex.: requireRole(["admin","admin_ti"])).
export async function requireRole(perfis: string[], next = "/painel"): Promise<Session> {
  const session = await requireAuth(next);
  if (!perfis.includes(session.perfil)) redirect("/sem-acesso");
  return session;
}
