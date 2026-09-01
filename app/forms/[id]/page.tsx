// =============================================================================
// PÁGINA PÚBLICA DO FORMULÁRIO — /forms/[id]
// Genérica: resolve a definição pelo id e entrega o renderizador. Não exige
// login. Formulário desconhecido -> 404; inativo -> aviso de encerrado.
// =============================================================================
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AjusteBasePath from "@/components/forms/AjusteBasePath";
import FormularioCliente from "@/components/forms/FormularioCliente";
import {
  AVISO_PRIVACIDADE,
  FORMULARIOS,
  getFormulario,
} from "@/lib/forms/definicoes";
import { asset, imagemSrc } from "@/lib/site";
import { getSiteConfig } from "@/lib/site-config";

type Props = { params: Promise<{ id: string }> };

// Pré-renderiza os formulários conhecidos (a página em si é estática; o envio
// é uma server action).
export function generateStaticParams() {
  return FORMULARIOS.map((f) => ({ id: String(f.id) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const def = getFormulario(id);
  if (!def) return { title: "Formulário não encontrado" };
  return {
    title: def.titulo,
    description: def.descricao.slice(0, 160),
    robots: { index: false }, // página de pesquisa não precisa ranquear
  };
}

export default async function PaginaFormulario({ params }: Props) {
  const { id } = await params;
  const def = getFormulario(id);
  if (!def) notFound();

  // Página "escondida" (acesso só pelo link): sem menu e sem rodapé do site —
  // o ChromeGate deixa /forms sem chrome e este topo mostra só a logo.
  const cfg = await getSiteConfig();

  return (
    <main>
      <AjusteBasePath />
      <header className="frm-topo">
        <Link href="/" aria-label="Ir para o site Pierre Alexander">
          <img src={imagemSrc(cfg.headerLogoUrl)} alt="Pierre Alexander" />
        </Link>
      </header>
      {/* Banner da linha Radicaline (mesmo nos dois formulários do evento). */}
      <div className="frm-banner">
        <img
          src={asset("/assets/img/banner-radicaline.jpg")}
          alt="Linha Radicaline: sérum facial, resveratrol sérum facial, sabonete facial, loção tônica e creme facial"
        />
      </div>
      <section className="frm-hero">
        <div className="container frm-wrap">
          <span className="eyebrow">Eventos Pierre</span>
          <h1>{def.titulo}</h1>
          <p>{def.descricao}</p>
          <div className="frm-privacidade">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M12 3 5 6v5c0 4.4 3 8.1 7 9 4-0.9 7-4.6 7-9V6l-7-3Z" strokeLinejoin="round" />
              <path d="m9.2 12 2 2 3.6-3.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p>{AVISO_PRIVACIDADE}</p>
          </div>
        </div>
      </section>

      {def.ativo ? (
        <FormularioCliente def={def} />
      ) : (
        <div className="container frm-wrap">
          <section className="frm-encerrado" role="status">
            <h2>Formulário encerrado</h2>
            <p>Este formulário não está mais recebendo respostas. Obrigado pelo interesse!</p>
            <p>
              <Link className="btn btn-outline" href="/">
                Voltar ao site
              </Link>
            </p>
          </section>
        </div>
      )}
    </main>
  );
}
