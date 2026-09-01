// =============================================================================
// ÍNDICE ADMINISTRATIVO DOS FORMULÁRIOS — /forms/respostas (SÓ ADMIN)
// Lista todos os formulários cadastrados em lib/forms/definicoes.ts com o
// estado de cada um (respostas, primeira/última) e o caminho para o dashboard.
// =============================================================================
import type { Metadata } from "next";
import Link from "next/link";
import AdminShell from "@/components/forms/AdminShell";
import AjusteBasePath from "@/components/forms/AjusteBasePath";
import { requireRole } from "@/lib/guard";
import { PAPEIS_RESPOSTAS } from "@/lib/forms/permissoes";
import { FORMULARIOS } from "@/lib/forms/definicoes";
import { resumoDeTodos, type ResumoFormulario } from "@/lib/forms/repositorio";
import { formatarDataHora } from "@/lib/forms/datas";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Formulários — respostas",
  robots: { index: false },
};

export default async function IndiceFormularios() {
  const session = await requireRole(PAPEIS_RESPOSTAS, "/forms/respostas");

  let resumos = new Map<number, ResumoFormulario>();
  let erroCarga = false;
  try {
    resumos = await resumoDeTodos(FORMULARIOS.map((f) => f.id));
  } catch {
    erroCarga = true;
  }

  return (
    <AdminShell session={session}>
      <AjusteBasePath />
      <div className="fdash-topo">
        <div>
          <h1>Formulários</h1>
          <p className="muted" style={{ margin: 0 }}>
            Pesquisas publicadas no site e suas respostas. Para criar um novo,
            adicione a definição em <code>lib/forms/definicoes.ts</code>.
          </p>
        </div>
      </div>

      {erroCarga && (
        <div className="fdash-vazio" role="alert" style={{ marginBottom: 18 }}>
          Não foi possível consultar o banco agora — os contadores podem estar
          zerados. Recarregue a página.
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "1rem",
        }}
      >
        {FORMULARIOS.map((f) => {
          const r = resumos.get(f.id) ?? { total: 0, primeira: null, ultima: null };
          return (
            <article
              key={f.id}
              style={{
                background: "#fff",
                border: "1px solid #eee",
                borderRadius: 14,
                padding: "1.4rem",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <header>
                <p className="muted" style={{ margin: "0 0 4px", fontSize: 12.5 }}>
                  Formulário {f.id} · versão {f.versao} · criado em{" "}
                  {f.criadoEm.split("-").reverse().join("/")}
                </p>
                <h2 style={{ margin: 0, fontSize: 19 }}>{f.titulo}</h2>
              </header>
              <p className="muted" style={{ margin: 0, fontSize: 14 }}>
                {f.resumo}
              </p>
              <p style={{ margin: 0 }}>
                {f.ativo ? (
                  <span className="tag tag-ativo">Ativo</span>
                ) : (
                  <span className="tag tag-inativo">Inativo</span>
                )}{" "}
                <span className="tag">
                  {r.total} resposta{r.total === 1 ? "" : "s"}
                </span>
              </p>
              <dl style={{ margin: 0, fontSize: 13, color: "#666" }}>
                <div style={{ display: "flex", gap: 6 }}>
                  <dt style={{ fontWeight: 600 }}>Primeira:</dt>
                  <dd style={{ margin: 0 }}>{formatarDataHora(r.primeira)}</dd>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <dt style={{ fontWeight: 600 }}>Última:</dt>
                  <dd style={{ margin: 0 }}>{formatarDataHora(r.ultima)}</dd>
                </div>
              </dl>
              <div style={{ display: "flex", gap: 8, marginTop: "auto", flexWrap: "wrap" }}>
                <Link className="btn btn-primary" href={`/forms/${f.id}/respostas`}>
                  Abrir dashboard
                </Link>
                <Link className="btn btn-outline" href={`/forms/${f.id}`}>
                  Página pública
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </AdminShell>
  );
}
