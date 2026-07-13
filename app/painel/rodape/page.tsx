import { requireRole } from "@/lib/guard";
import { getFooter, type FooterLink } from "@/lib/footer";
import { salvarRodapeAction } from "./actions";

export const dynamic = "force-dynamic";

const EDIT_ROLES = ["admin", "admin_ti"];
const MAX_COLUNAS = 6;

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: 8,
  border: "1px solid #ddd",
  borderRadius: 6,
  fontFamily: "inherit",
  fontSize: 14,
  resize: "vertical",
};
const card: React.CSSProperties = { background: "#fff", border: "1px solid #eee", borderRadius: 10, padding: "1.25rem" };
const labelStyle: React.CSSProperties = { display: "block", fontWeight: 600, marginBottom: 4, fontSize: 13 };
const ajuda: React.CSSProperties = { margin: "3px 0 0", fontSize: 12, color: "#999" };

// Converte lista de links -> texto "Rótulo | /link" (uma linha por link).
function linksParaTexto(links: FooterLink[]): string {
  return links.map((l) => `${l.label} | ${l.href}`).join("\n");
}

export default async function RodapePage() {
  await requireRole(EDIT_ROLES, "/painel/rodape");
  const f = await getFooter();

  return (
    <>
      <h1 style={{ margin: "0 0 .25rem" }}>Rodapé do site</h1>
      <p style={{ color: "#888", margin: "0 0 1.5rem", fontSize: 14, lineHeight: 1.6 }}>
        Configure as colunas, os textos e as redes sociais do rodapé. As mudanças aparecem em todas as páginas do site.
        <br />
        Nos textos e rótulos você pode usar <code>**negrito**</code> e o ícone <code>:whatsapp:</code> — igual à faixa do topo.
      </p>

      <form action={salvarRodapeAction}>
        {/* Coluna da marca + textos gerais */}
        <div style={{ ...card, marginBottom: "1rem" }}>
          <h2 style={{ margin: "0 0 1rem", fontSize: 18 }}>Marca e textos</h2>
          <div style={{ marginBottom: ".75rem" }}>
            <label style={labelStyle}>Logo do rodapé</label>
            <input name="logo_url" defaultValue={f.logoUrl} style={inputStyle} />
            <p style={ajuda}>
              Caminho de uma imagem do site (ex.: <strong>/assets/img/logo-pierre-white.png</strong>) ou uma URL completa (https://…). O upload direto entra numa próxima etapa.
            </p>
          </div>
          <div style={{ marginBottom: ".75rem" }}>
            <label style={labelStyle}>Texto da marca (parágrafo abaixo do logo)</label>
            <textarea name="marca_texto" defaultValue={f.marcaTexto} rows={3} style={inputStyle} />
          </div>
          <div style={{ marginBottom: ".75rem" }}>
            <label style={labelStyle}>Linha de atendimento (SAC)</label>
            <input name="sac_texto" defaultValue={f.sacTexto} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Texto de rodapé (faixa de baixo)</label>
            <input name="rodape_texto" defaultValue={f.rodapeTexto} style={inputStyle} />
            <p style={ajuda}>
              Use <strong>{"{ano}"}</strong> para inserir o ano atual automaticamente. Ex.: “Pierre Alexander · {"{ano}"}”.
            </p>
          </div>
        </div>

        {/* Colunas de links */}
        <div style={{ ...card, marginBottom: "1rem" }}>
          <h2 style={{ margin: "0 0 .75rem", fontSize: 18 }}>Colunas de links</h2>
          <div style={{ marginBottom: "1rem", maxWidth: 260 }}>
            <label style={labelStyle}>Número de colunas</label>
            <select name="num_colunas" defaultValue={String(f.colunas.length || 4)} style={inputStyle}>
              {Array.from({ length: MAX_COLUNAS }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n} coluna{n > 1 ? "s" : ""}
                </option>
              ))}
            </select>
            <p style={ajuda}>Colunas preenchidas além desse número são ignoradas ao salvar.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem" }}>
            {Array.from({ length: MAX_COLUNAS }, (_, i) => i).map((i) => {
              const col = f.colunas[i];
              return (
                <fieldset key={i} style={{ border: "1px solid #eee", borderRadius: 8, padding: ".75rem" }}>
                  <legend style={{ fontSize: 13, fontWeight: 700, color: "#555", padding: "0 .4rem" }}>Coluna {i + 1}</legend>
                  <div style={{ marginBottom: ".5rem" }}>
                    <label style={labelStyle}>Título</label>
                    <input name={`col${i + 1}_titulo`} defaultValue={col?.titulo ?? ""} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Links</label>
                    <textarea
                      name={`col${i + 1}_links`}
                      defaultValue={col ? linksParaTexto(col.links) : ""}
                      rows={5}
                      style={inputStyle}
                      placeholder={"Sobre a Pierre | /sobre\nOnde comprar | /onde-comprar"}
                    />
                    <p style={ajuda}>Um link por linha, no formato <strong>Texto | endereço</strong>.</p>
                  </div>
                </fieldset>
              );
            })}
          </div>
        </div>

        {/* Redes sociais */}
        <div style={{ ...card, marginBottom: "1rem" }}>
          <h2 style={{ margin: "0 0 .75rem", fontSize: 18 }}>Redes sociais</h2>
          <label style={labelStyle}>Redes</label>
          <textarea
            name="social"
            defaultValue={linksParaTexto(f.social)}
            rows={4}
            style={inputStyle}
            placeholder={"Instagram | https://instagram.com/pierrealexander\nFacebook | https://facebook.com/..."}
          />
          <p style={ajuda}>Uma rede por linha, no formato <strong>Nome | URL completa</strong>.</p>
        </div>

        <div style={{ textAlign: "right" }}>
          <button className="btn btn-primary" type="submit">
            Salvar rodapé
          </button>
        </div>
      </form>
    </>
  );
}
