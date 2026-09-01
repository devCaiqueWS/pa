// =============================================================================
// CASCA ADMINISTRATIVA DOS DASHBOARDS DE RESPOSTAS
// Mesmo visual do /painel (cabeçalho branco, fundo suave), com o caminho de
// volta para o painel e o logout. As páginas que a usam já chegaram aqui
// autenticadas (requireRole roda ANTES, na própria página).
// =============================================================================
import Link from "next/link";
import { logoutAction } from "@/app/login/actions";
import type { Session } from "@/lib/session";

export default function AdminShell({
  session,
  children,
}: {
  session: Session;
  children: React.ReactNode;
}) {
  return (
    <div style={{ minHeight: "100vh", background: "#faf9f7" }}>
      <header
        style={{
          background: "#fff",
          borderBottom: "1px solid #eee",
          padding: "0.75rem 1rem",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <nav style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <Link href="/painel" style={{ fontWeight: 700 }}>
              Painel Pierre
            </Link>
            <Link href="/forms/respostas">Formulários</Link>
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ color: "#666", fontSize: 13 }}>
              {session.nome} · {session.perfil}
            </span>
            <form action={logoutAction}>
              <button className="btn" type="submit">
                Sair
              </button>
            </form>
          </div>
        </div>
      </header>
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "1.5rem 1rem 3rem" }}>
        {children}
      </main>
    </div>
  );
}
