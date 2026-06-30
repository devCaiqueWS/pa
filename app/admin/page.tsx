import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

async function count(table: string, filter?: (q: any) => any) {
  const supabase = await createClient();
  if (!supabase) return 0;
  let q = supabase.from(table).select("*", { count: "exact", head: true });
  if (filter) q = filter(q);
  const { count } = await q;
  return count ?? 0;
}

export default async function AdminDashboard() {
  const [produtos, destaques, categorias, banners] = await Promise.all([
    count("products"),
    count("products", (q) => q.eq("featured", true)),
    count("categories"),
    count("banners"),
  ]);

  const stats = [
    { label: "Produtos no catálogo", value: produtos, href: "/admin/produtos" },
    { label: "Em destaque", value: destaques, href: "/admin/produtos" },
    { label: "Categorias", value: categorias, href: "/admin/produtos" },
    { label: "Banners", value: banners, href: "/admin/banners" },
  ];

  return (
    <>
      <header className="admin-head">
        <h1>Visão geral</h1>
        <p>Gerencie o conteúdo do site Pierre Alexander.</p>
      </header>

      <div className="admin-stats">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="admin-stat">
            <span className="admin-stat-value">{s.value}</span>
            <span className="admin-stat-label">{s.label}</span>
          </Link>
        ))}
      </div>

      <section className="admin-panel">
        <h2>Como funciona</h2>
        <ul className="admin-steps">
          <li>
            Este é o <strong>CMS do site</strong> (a vitrine). Edite os produtos em
            destaque, textos e imagens em <Link href="/admin/produtos">Catálogo</Link>.
          </li>
          <li>
            O que você publica aqui aparece no site em até 1 minuto.
          </li>
          <li>
            Pedidos, estoque e clientes continuam no seu ERP/Bling — este painel não
            mexe na operação.
          </li>
        </ul>
      </section>
    </>
  );
}
