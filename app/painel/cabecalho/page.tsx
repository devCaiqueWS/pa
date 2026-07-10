import Link from "next/link";
import { requireRole } from "@/lib/guard";
import { getSiteConfig } from "@/lib/site-config";
import { salvarCabecalhoAction } from "./actions";

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
          <div style={{ marginBottom: ".75rem" }}>
            <label style={labelStyle}>Logo do topo</label>
            <input name="header_logo_url" defaultValue={cfg.headerLogoUrl} style={inputStyle} />
            <p style={ajuda}>
              Caminho de imagem do site (ex.: <strong>/assets/img/logo-pierre.png</strong>) ou URL completa (https://…).
            </p>
          </div>
          <div>
            <label style={labelStyle}>Ícone da aba (favicon)</label>
            <input name="favicon_url" defaultValue={cfg.faviconUrl} style={inputStyle} />
            <p style={ajuda}>Imagem pequena que aparece na aba do navegador. Ideal um PNG quadrado.</p>
          </div>
        </div>

        {/* Faixa do topo */}
        <div style={{ ...card, marginBottom: "1rem" }}>
          <h2 style={{ margin: "0 0 .5rem", fontSize: 18 }}>Faixa do topo</h2>
          <p style={{ ...ajuda, margin: "0 0 .5rem", fontSize: 13 }}>
            As frases que passam na faixa fininha acima do cabeçalho. Uma frase por linha.
          </p>
          <textarea name="top_strip" defaultValue={cfg.topStrip.join("\n")} rows={4} style={inputStyle} />
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
