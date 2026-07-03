import { requireRole } from "@/lib/guard";
import { getTextos, type Texto } from "@/lib/content";
import { saveTextoAction } from "./actions";

export const dynamic = "force-dynamic";

const EDIT_ROLES = ["admin", "admin_ti"];

export default async function TextosPage() {
  await requireRole(EDIT_ROLES, "/painel/textos");
  const textos = await getTextos();

  if (!textos.length) {
    return (
      <>
        <h1 style={{ marginTop: 0 }}>Textos do site</h1>
        <div
          style={{
            background: "#fff8e1",
            border: "1px solid #ffe082",
            borderRadius: 8,
            padding: "1rem",
          }}
        >
          <p style={{ margin: 0 }}>
            A tabela <code>site_textos</code> ainda não foi criada (ou está vazia).
            Rode o script <code>db/site_textos.sql</code> no banco para habilitar a
            edição de textos.
          </p>
        </div>
      </>
    );
  }

  // Agrupa por "grupo" para exibir em seções.
  const grupos = textos.reduce<Record<string, Texto[]>>((acc, t) => {
    (acc[t.grupo] ??= []).push(t);
    return acc;
  }, {});

  return (
    <>
      <h1 style={{ marginTop: 0 }}>Textos do site</h1>
      <p style={{ color: "#666" }}>
        Edite os textos abaixo. As alterações aparecem no site em alguns segundos.
      </p>

      {Object.entries(grupos).map(([grupo, itens]) => (
        <section key={grupo} style={{ marginTop: "1.5rem" }}>
          <h2 style={{ borderBottom: "2px solid #eee", paddingBottom: 6 }}>{grupo}</h2>
          {itens.map((t) => (
            <form
              key={t.chave}
              action={saveTextoAction}
              style={{
                background: "#fff",
                border: "1px solid #eee",
                borderRadius: 8,
                padding: "1rem",
                marginBottom: "0.75rem",
              }}
            >
              <input type="hidden" name="chave" value={t.chave} />
              <label
                htmlFor={`t_${t.chave}`}
                style={{ display: "block", fontWeight: 600, marginBottom: 6 }}
              >
                {t.titulo}
              </label>
              <textarea
                id={`t_${t.chave}`}
                name="valor"
                defaultValue={t.valor ?? ""}
                rows={t.tipo === "html" || (t.valor ?? "").length > 80 ? 3 : 2}
                style={{
                  width: "100%",
                  padding: 8,
                  border: "1px solid #ddd",
                  borderRadius: 6,
                  fontFamily: "inherit",
                  fontSize: 14,
                  resize: "vertical",
                }}
              />
              <div style={{ marginTop: 8, textAlign: "right" }}>
                <button className="btn btn-primary" type="submit">
                  Salvar
                </button>
              </div>
            </form>
          ))}
        </section>
      ))}
    </>
  );
}
