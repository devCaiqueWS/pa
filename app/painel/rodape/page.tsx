import { requireRole } from "@/lib/guard";
import { getFooter } from "@/lib/footer";
import { getOpcoesLinkInterno } from "@/lib/menu";
import ImagemCampo from "@/components/painel/ImagemCampo";
import { ColunasEditor, SociaisEditor } from "./RodapeEditors";
import { salvarRodapeAction } from "./actions";

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
const card: React.CSSProperties = { background: "#fff", border: "1px solid #eee", borderRadius: 10, padding: "1.25rem" };
const labelStyle: React.CSSProperties = { display: "block", fontWeight: 600, marginBottom: 4, fontSize: 13 };
const ajuda: React.CSSProperties = { margin: "3px 0 0", fontSize: 12, color: "#999" };

export default async function RodapePage() {
  await requireRole(EDIT_ROLES, "/painel/rodape");
  const f = await getFooter();
  const opcoes = await getOpcoesLinkInterno();

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
          <div style={{ marginBottom: "1rem" }}>
            <ImagemCampo
              name="logo_url"
              label="Logo do rodapé"
              defaultValue={f.logoUrl}
              formato="wide"
              ajuda={
                <>
                  Caminho de uma imagem do site (ex.: <strong>/assets/img/logo-pierre-white.png</strong>) ou uma URL completa (https://…). O upload direto entra numa próxima etapa.
                </>
              }
            />
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
          <h2 style={{ margin: "0 0 .25rem", fontSize: 18 }}>Colunas de links</h2>
          <p style={{ ...ajuda, margin: "0 0 .75rem" }}>
            Cada coluna tem um título e uma lista de links. Em cada link escolha <strong>interno</strong> (uma página do
            site) ou <strong>externo</strong> (URL). Arraste pela alça <strong>⠿</strong> para reordenar.
          </p>
          <ColunasEditor initial={f.colunas} opcoes={opcoes} />
        </div>

        {/* Redes sociais */}
        <div style={{ ...card, marginBottom: "1rem" }}>
          <h2 style={{ margin: "0 0 .25rem", fontSize: 18 }}>Redes sociais</h2>
          <p style={{ ...ajuda, margin: "0 0 .75rem" }}>
            O nome da rede e o link (geralmente externo, ex.: <strong>https://instagram.com/…</strong>).
          </p>
          <SociaisEditor initial={f.social} opcoes={opcoes} />
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
