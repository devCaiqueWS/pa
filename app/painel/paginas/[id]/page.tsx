import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/guard";
import { getPagina, getBlocos, CATALOGO, defDoTipo, type Campo, type Bloco } from "@/lib/cms";
import { salvarPaginaAction, salvarBlocoAction } from "./actions";
import BlocoLista, { type BlocoItem } from "./BlocoLista";

export const dynamic = "force-dynamic";

const EDIT_ROLES = ["admin", "admin_ti"];

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: 8,
  border: "1px solid #ddd",
  borderRadius: 6,
  fontFamily: "inherit",
  fontSize: 14,
  resize: "vertical",
};
const card: React.CSSProperties = { background: "#fff", border: "1px solid #eee", borderRadius: 10, padding: "1rem" };
const labelStyle: React.CSSProperties = { display: "block", fontWeight: 600, marginBottom: 4, fontSize: 13 };

// Renderiza um campo do catálogo (input/textarea/select) com valor atual.
function CampoInput({ campo, valor, name }: { campo: Campo; valor: string; name: string }) {
  return (
    <div style={{ marginBottom: ".75rem" }}>
      <label htmlFor={name} style={labelStyle}>
        {campo.label}
      </label>
      {campo.tipo === "textarea" ? (
        <textarea id={name} name={name} defaultValue={valor} rows={3} style={inputStyle} />
      ) : campo.tipo === "select" ? (
        <select id={name} name={name} defaultValue={valor} style={inputStyle}>
          {campo.opcoes?.map((o) => (
            <option key={o.valor} value={o.valor}>
              {o.label}
            </option>
          ))}
        </select>
      ) : (
        <input id={name} name={name} type={campo.tipo === "url" ? "url" : "text"} defaultValue={valor} style={inputStyle} />
      )}
      {campo.ajuda && <p style={{ margin: "3px 0 0", fontSize: 12, color: "#999" }}>{campo.ajuda}</p>}
    </div>
  );
}

// Formulário de edição do bloco selecionado.
function EditorBloco({ paginaId, bloco }: { paginaId: number; bloco: Bloco }) {
  const def = defDoTipo(bloco.tipo);
  if (!def) return <div style={card}>Tipo de bloco desconhecido: {bloco.tipo}</div>;
  const c = bloco.config;

  return (
    <form action={salvarBlocoAction} style={card}>
      <input type="hidden" name="paginaId" value={paginaId} />
      <input type="hidden" name="blocoId" value={bloco.id} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: ".75rem", gap: "1rem", flexWrap: "wrap" }}>
        <div>
          <span style={{ fontSize: 12, color: "#999", textTransform: "uppercase", letterSpacing: 1 }}>{def.label}</span>
          <h2 style={{ margin: "2px 0 0", fontSize: 18 }}>Editando bloco</h2>
        </div>
        <button className="btn btn-primary" type="submit">
          Salvar bloco
        </button>
      </div>
      <p style={{ margin: "0 0 1rem", color: "#888", fontSize: 13 }}>{def.descricao}</p>

      <CampoInput campo={{ name: "nome", label: "Nome interno do bloco (só no painel)", tipo: "text" }} name="nome" valor={bloco.nome} />

      <hr style={{ border: 0, borderTop: "1px solid #eee", margin: "1rem 0" }} />

      {def.campos.map((campo) => (
        <CampoInput key={campo.name} campo={campo} name={campo.name} valor={c[campo.name] ?? ""} />
      ))}

      {/* Blocos com colunas repetidas (ex.: tipo "colunas") */}
      {def.colunas &&
        Array.from({ length: def.colunas.max }, (_, i) => i + 1).map((n) => (
          <fieldset key={n} style={{ border: "1px solid #eee", borderRadius: 8, padding: ".75rem", marginBottom: ".75rem" }}>
            <legend style={{ fontSize: 13, fontWeight: 700, color: "#555", padding: "0 .4rem" }}>Coluna {n}</legend>
            {def.colunas!.campos.map((campo) => {
              const name = `col${n}_${campo.name}`;
              return <CampoInput key={name} campo={campo} name={name} valor={c[name] ?? ""} />;
            })}
          </fieldset>
        ))}

      <div style={{ textAlign: "right" }}>
        <button className="btn btn-primary" type="submit">
          Salvar bloco
        </button>
      </div>
    </form>
  );
}

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ bloco?: string }>;
};

export default async function EditorPaginaPage({ params, searchParams }: Props) {
  await requireRole(EDIT_ROLES, "/painel/paginas");
  const { id } = await params;
  const paginaId = Number(id);
  const pagina = await getPagina(paginaId);
  if (!pagina) notFound();

  const blocos = await getBlocos(paginaId);
  const { bloco: blocoParam } = await searchParams;
  const selecionadoId = Number(blocoParam) || blocos[0]?.id || 0;
  const selecionado = blocos.find((b) => b.id === selecionadoId) ?? null;

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
        <div>
          <Link href="/painel/paginas" style={{ fontSize: 13, color: "#888" }}>
            ← Páginas
          </Link>
          <h1 style={{ margin: ".25rem 0 0" }}>{pagina.titulo}</h1>
        </div>
        {pagina.status === "publicado" && (
          <Link className="btn" href={`/pagina/${pagina.slug}`} target="_blank">
            Ver página no site
          </Link>
        )}
      </div>

      {/* Configurações da página */}
      <details style={{ ...card, marginTop: "1rem" }}>
        <summary style={{ cursor: "pointer", fontWeight: 600 }}>Configurações da página (título, endereço, publicação, SEO)</summary>
        <form action={salvarPaginaAction} style={{ marginTop: "1rem" }}>
          <input type="hidden" name="paginaId" value={pagina.id} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".75rem" }}>
            <div>
              <label style={labelStyle}>Título</label>
              <input name="titulo" defaultValue={pagina.titulo} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Endereço (slug)</label>
              <input name="slug" defaultValue={pagina.slug} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Publicação</label>
              <select name="status" defaultValue={pagina.status} style={inputStyle}>
                <option value="rascunho">Rascunho (oculto)</option>
                <option value="publicado">Publicado (visível)</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Título para o Google (SEO)</label>
              <input name="seo_titulo" defaultValue={pagina.seo_titulo ?? ""} style={inputStyle} />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Descrição para o Google (SEO)</label>
              <input name="seo_descricao" defaultValue={pagina.seo_descricao ?? ""} style={inputStyle} />
            </div>
          </div>
          <div style={{ textAlign: "right", marginTop: ".75rem" }}>
            <button className="btn btn-primary" type="submit">
              Salvar configurações
            </button>
          </div>
        </form>
      </details>

      {/* Editor: lista à esquerda, edição à direita */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(240px, 300px) 1fr", gap: "1.25rem", marginTop: "1.25rem", alignItems: "start" }}>
        {/* ESQUERDA — lista de blocos (arrastar-e-soltar) + adicionar */}
        <BlocoLista
          key={blocos.map((b) => `${b.id}:${b.ativo}`).join("-")}
          paginaId={paginaId}
          selecionadoId={selecionadoId}
          itens={blocos.map<BlocoItem>((b) => ({
            id: b.id,
            tipo: b.tipo,
            nome: b.nome,
            ativo: b.ativo,
            tipoLabel: defDoTipo(b.tipo)?.label ?? b.tipo,
          }))}
          tipos={CATALOGO.map((d) => ({ tipo: d.tipo, label: d.label }))}
        />

        {/* DIREITA — edição do bloco selecionado */}
        <div>
          {selecionado ? (
            <EditorBloco paginaId={paginaId} bloco={selecionado} />
          ) : (
            <div style={{ ...card, color: "#888" }}>Selecione um bloco à esquerda ou adicione o primeiro.</div>
          )}
        </div>
      </div>
    </>
  );
}
