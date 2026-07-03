import Link from "next/link";
import { getSession } from "@/lib/guard";

export const dynamic = "force-dynamic";

const cardStyle: React.CSSProperties = {
  display: "block",
  background: "#fff",
  border: "1px solid #eee",
  borderRadius: 10,
  padding: "1.25rem",
  textDecoration: "none",
  color: "inherit",
};

export default async function PainelHome() {
  const session = await getSession();

  return (
    <>
      <h1 style={{ marginTop: 0 }}>Bem-vindo(a), {session?.nome?.split(" ")[0]}</h1>
      <p style={{ color: "#666" }}>Escolha o que deseja gerenciar:</p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1rem",
          marginTop: "1rem",
        }}
      >
        <Link href="/painel/paginas" style={cardStyle}>
          <h3 style={{ margin: "0 0 .25rem" }}>Páginas do site</h3>
          <p style={{ margin: 0, color: "#666", fontSize: 14 }}>
            Monte páginas com blocos: banner, texto, colunas, chamadas e mais.
          </p>
        </Link>
        <Link href="/painel/textos" style={cardStyle}>
          <h3 style={{ margin: "0 0 .25rem" }}>Textos do site</h3>
          <p style={{ margin: 0, color: "#666", fontSize: 14 }}>
            Edite títulos e chamadas exibidos no site público.
          </p>
        </Link>
      </div>
    </>
  );
}
