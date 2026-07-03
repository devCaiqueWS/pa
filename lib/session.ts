// =============================================================================
// SESSÃO (JWT assinado em cookie httpOnly)
// Usa `jose` (compatível com o middleware/edge). Este arquivo NÃO importa
// next/headers nem mysql, para poder rodar tanto no servidor quanto no proxy.
// =============================================================================
import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "pa_session";

export type Session = {
  uid: number;
  nome: string;
  email: string;
  perfil: string; // código do perfil (admin, operador, consulta…)
  perfilId: number;
};

function secret(): Uint8Array {
  const s = process.env.SESSION_SECRET;
  if (!s) throw new Error("SESSION_SECRET não definido");
  return new TextEncoder().encode(s);
}

export async function createToken(session: Session): Promise<string> {
  return new SignJWT({ ...session })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(secret());
}

export async function verifyToken(token: string): Promise<Session | null> {
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload as unknown as Session;
  } catch {
    return null;
  }
}
