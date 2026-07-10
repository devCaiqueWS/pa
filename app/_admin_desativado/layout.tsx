import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { requireAdmin } from "@/lib/auth";
import { signOut } from "./actions";

const NAV = [
  { href: "/admin", label: "Visão geral" },
  { href: "/admin/produtos", label: "Catálogo" },
  { href: "/admin/banners", label: "Banners" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Sem Supabase configurado: mostra aviso de setup em vez de derrubar para login.
  if (!isSupabaseConfigured) {
    return (
      <main className="admin-setup">
        <div className="admin-setup-card">
          <h1>Painel Pierre · configuração pendente</h1>
          <p>
            O painel administrativo está pronto, mas o Supabase ainda não foi
            conectado. Siga o passo a passo em <code>SETUP-FASE2.md</code> para
            definir as variáveis de ambiente e habilitar login e dados.
          </p>
          <Link className="btn btn-primary" href="/">
            Voltar ao site
          </Link>
        </div>
      </main>
    );
  }

  const profile = await requireAdmin();

  return (
    <div className="admin">
      <aside className="admin-side">
        <Link href="/" className="admin-logo">
          Pierre<span>Admin</span>
        </Link>
        <nav className="admin-nav">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <form action={signOut} className="admin-signout">
          <div className="admin-user">
            <strong>{profile.full_name || profile.email}</strong>
            <span>Administrador</span>
          </div>
          <button type="submit" className="btn btn-outline">
            Sair
          </button>
        </form>
      </aside>
      <div className="admin-main">{children}</div>
    </div>
  );
}
