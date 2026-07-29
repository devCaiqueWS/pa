import Link from "next/link";
import { requireRole } from "@/lib/guard";
import { getBannersTodos, TAMANHO_BANNER } from "@/lib/banners";
import { getOpcoesLinkInterno } from "@/lib/menu";
import BannersEditor from "./BannersEditor";
import { salvarBannersAction } from "./actions";

export const dynamic = "force-dynamic";

const EDIT_ROLES = ["admin", "admin_ti"];

export default async function BannersPage() {
  await requireRole(EDIT_ROLES, "/painel/banners");
  const [banners, opcoesLink] = await Promise.all([getBannersTodos(), getOpcoesLinkInterno()]);

  return (
    <>
      <h1 style={{ margin: "0 0 .25rem" }}>Banners do carrossel</h1>
      <p style={{ color: "#888", margin: "0 0 1rem", fontSize: 14, lineHeight: 1.6 }}>
        Os slides grandes do topo da home. Arraste pela alça <strong>⠿</strong> para mudar a ordem — eles
        giram sozinhos a cada 6 segundos, na ordem desta lista. O carrossel aparece na home pelo bloco
        <strong> Carrossel de topo</strong> em <Link href="/painel/paginas">Páginas do site</Link>.
      </p>

      <p
        style={{
          background: "#faf7f2",
          border: "1px solid #eee3d4",
          borderRadius: 8,
          padding: ".7rem .9rem",
          fontSize: 13,
          color: "#7a6a58",
          lineHeight: 1.6,
          margin: "0 0 1.5rem",
        }}
      >
        📐 <strong>Tamanho da imagem: {TAMANHO_BANNER.largura}×{TAMANHO_BANNER.altura}px</strong> (horizontal
        largo). O próprio campo confere as dimensões do arquivo antes de enviar e avisa se estiver fora.
        Lembre que no celular as laterais são cortadas — mantenha o essencial no centro.
      </p>

      <form action={salvarBannersAction}>
        <BannersEditor initial={banners} opcoesLink={opcoesLink} />
        <div style={{ textAlign: "right", marginTop: "1rem" }}>
          <button className="btn btn-primary" type="submit">
            Salvar banners
          </button>
        </div>
      </form>
    </>
  );
}
