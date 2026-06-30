import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Convenção do Next 16 (substitui middleware.ts): renova a sessão do Supabase
// e protege as rotas /admin.
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // Roda em todas as rotas exceto assets estáticos e imagens.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|assets|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4)$).*)",
  ],
};
