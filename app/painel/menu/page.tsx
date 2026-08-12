import { requireRole } from "@/lib/guard";
import { getMenuRows, montarArvore, getOpcoesLinkInterno } from "@/lib/menu";
import MenuEditor from "./MenuEditor";

export const dynamic = "force-dynamic";

const EDIT_ROLES = ["admin", "admin_ti"];

export default async function MenuPage() {
  await requireRole(EDIT_ROLES, "/painel/menu");
  const rows = await getMenuRows();
  const arvore = montarArvore(rows);
  const opcoes = await getOpcoesLinkInterno();

  return (
    <>
      <h1 style={{ margin: "0 0 .25rem" }}>Menu do site</h1>
      <p style={{ color: "#888", margin: "0 0 1.5rem", fontSize: 14 }}>
        Monte o menu do topo arrastando os itens. Cada item pode ser um <strong>link</strong>, um{" "}
        <strong>botão</strong> destacado ou uma <strong>busca</strong>.
      </p>
      {rows.length === 0 && (
        <p style={{ color: "#a15c00", fontSize: 13, marginBottom: "1rem" }}>
          Ainda não há itens salvos — o site mostra o menu padrão. Adicione itens abaixo para assumir o controle.
        </p>
      )}
      <MenuEditor inicial={arvore} opcoes={opcoes} />
    </>
  );
}
