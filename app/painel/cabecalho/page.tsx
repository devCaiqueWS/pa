import Link from "next/link";
import { requireRole } from "@/lib/guard";
import { getSiteConfig } from "@/lib/site-config";
import { salvarCabecalhoAction } from "./actions";
import FaixaTopoEditor from "./FaixaTopoEditor";
import ImagemCampo from "@/components/painel/ImagemCampo";

export const dynamic = "force-dynamic";

const EDIT_ROLES = ["admin", "admin_ti"];

const card: React.CSSProperties = { background: "#fff", border: "1px solid #eee", borderRadius: 10, padding: "1.25rem" };
const ajuda: React.CSSProperties = { margin: "3px 0 0", fontSize: 12, color: "#999" };

export default async function CabecalhoPage() {
  await requireRole(EDIT_ROLES, "/painel/cabecalho");
  const cfg = await getSiteConfig();

  return (
    <>
      <h1 style={{ margin: "0 0 .25rem" }}>Cabeçalho do site</h1>
      <p style={{ color: "#888", margin: "0 0 1.5rem", fontSize: 14 }}>
        Logo do topo, ícone da aba (favicon) e as frases da faixa acima do cabeçalho. O menu de navegação fica em{" "}
        <Link href="/painel/menu">Menu</Link>.
      </p>

      <form action={salvarCabecalhoAction}>
        {/* Logo e ícone */}
        <div style={{ ...card, marginBottom: "1rem" }}>
          <h2 style={{ margin: "0 0 1rem", fontSize: 18 }}>Logo e ícone</h2>
          <div style={{ marginBottom: "1rem" }}>
            <ImagemCampo
              name="header_logo_url"
              label="Logo do topo"
              defaultValue={cfg.headerLogoUrl}
              formato="wide"
              preset="logo"
              ajuda={
                <>
                  Caminho de imagem do site (ex.: <strong>/assets/img/logo-pierre.png</strong>) ou URL completa (https://…).
                </>
              }
            />
          </div>
          <div>
            <ImagemCampo
              name="favicon_url"
              label="Ícone da aba (favicon)"
              defaultValue={cfg.faviconUrl}
              formato="square"
              preset="favicon"
              ajuda="Imagem pequena que aparece na aba do navegador. Ideal um PNG quadrado."
            />
          </div>
        </div>

        {/* Faixa do topo */}
        <div style={{ ...card, marginBottom: "1rem" }}>
          <h2 style={{ margin: "0 0 .5rem", fontSize: 18 }}>Faixa do topo</h2>
          <p style={{ ...ajuda, margin: "0 0 .75rem", fontSize: 13, lineHeight: 1.6 }}>
            As frases que passam na faixa fininha acima do cabeçalho. Escreva a <strong>frase</strong> e,
            se quiser que ela seja clicável, o <strong>link</strong>. Dicas:
            <br />• <strong>Negrito:</strong> coloque <code>**</code> antes e depois do trecho. Ex.:{" "}
            <code>Fale no **WhatsApp**</code>.
            <br />• <strong>Ícone do WhatsApp:</strong> escreva <code>:whatsapp:</code> onde quiser o ícone.
            <br />• <strong>Link do WhatsApp:</strong> no link use <code>https://wa.me/55SEUNUMERO</code> (só números).
            <br />• <strong>Página do site:</strong> no link use <code>/onde-comprar</code>, <code>/consultora</code> etc.
            <br />• <strong>Ordem:</strong> arraste pela alça <strong>⠿</strong> para reordenar as frases.
          </p>
          <FaixaTopoEditor initial={cfg.topStrip} />
        </div>

        <div style={{ textAlign: "right" }}>
          <button className="btn btn-primary" type="submit">
            Salvar cabeçalho
          </button>
        </div>
      </form>
    </>
  );
}
