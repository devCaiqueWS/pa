import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifyToken } from "@/lib/session";

// Convenção do Next 16 (substitui middleware.ts): protege as rotas internas
// verificando o JWT de sessão. Só roda em /painel (e futuras rotas internas).
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifyToken(token) : null;

  if (!session) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Protege apenas as áreas internas. O site público fica livre.
  matcher: ["/painel/:path*"],
};
