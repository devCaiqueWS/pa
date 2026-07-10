import Link from "next/link";
import { requireAuth } from "@/lib/guard";
import { logoutAction } from "@/app/login/actions";

export default async function PainelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAuth("/painel");

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
            maxWidth: 1000,
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
            <Link href="/painel/paginas">Páginas do site</Link>
            <Link href="/painel/cabecalho">Cabeçalho</Link>
            <Link href="/painel/menu">Menu</Link>
            <Link href="/painel/rodape">Rodapé</Link>
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
      <main style={{ maxWidth: 1000, margin: "0 auto", padding: "1.5rem 1rem" }}>
        {children}
      </main>
    </div>
  );
}
