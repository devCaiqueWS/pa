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
        <Link href="/painel/cabecalho" style={cardStyle}>
          <h3 style={{ margin: "0 0 .25rem" }}>Cabeçalho</h3>
          <p style={{ margin: 0, color: "#666", fontSize: 14 }}>
            Logo do topo, ícone da aba (favicon) e as frases da faixa do topo.
          </p>
        </Link>
        <Link href="/painel/menu" style={cardStyle}>
          <h3 style={{ margin: "0 0 .25rem" }}>Menu</h3>
          <p style={{ margin: 0, color: "#666", fontSize: 14 }}>
            Monte o menu do topo arrastando itens: links, botão e busca.
          </p>
        </Link>
        <Link href="/painel/categorias" style={cardStyle}>
          <h3 style={{ margin: "0 0 .25rem" }}>Categorias</h3>
          <p style={{ margin: 0, color: "#666", fontSize: 14 }}>
            Categorias e subcategorias do catálogo: nome, capa, frase e ordem.
          </p>
        </Link>
        <Link href="/painel/produtos" style={cardStyle}>
          <h3 style={{ margin: "0 0 .25rem" }}>Produtos</h3>
          <p style={{ margin: 0, color: "#666", fontSize: 14 }}>
            Curadoria dos produtos do ERP: categoria-de-vitrine, foto, destaque e visibilidade.
          </p>
        </Link>
        <Link href="/painel/paginas" style={cardStyle}>
          <h3 style={{ margin: "0 0 .25rem" }}>Páginas do site</h3>
          <p style={{ margin: 0, color: "#666", fontSize: 14 }}>
            Monte páginas com blocos: banner, texto, colunas, chamadas e mais.
          </p>
        </Link>
        <Link href="/painel/rodape" style={cardStyle}>
          <h3 style={{ margin: "0 0 .25rem" }}>Rodapé</h3>
          <p style={{ margin: 0, color: "#666", fontSize: 14 }}>
            Colunas de links, textos e redes sociais do rodapé do site.
          </p>
        </Link>
        <Link href="/painel/mapa" style={cardStyle}>
          <h3 style={{ margin: "0 0 .25rem" }}>Mapa do site</h3>
          <p style={{ margin: 0, color: "#666", fontSize: 14 }}>
            Visão geral de todas as páginas: conteúdo, categorias e rotas fixas.
          </p>
        </Link>
      </div>
    </>
  );
}
