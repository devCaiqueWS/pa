import Link from "next/link";
import type { Metadata } from "next";
import Canais from "@/components/cms/Canais";
import { cmsBlocos } from "@/lib/cms-render";

export const metadata: Metadata = { title: "Onde Comprar" };

// Mesmos canais publicados no CMS (db/site_onde_comprar.sql). O destino
// "whatsapp" é resolvido pelo componente a partir de Configurações.
const CANAIS = [
  {
    rotulo: "Compra online",
    titulo: "Loja oficial",
    texto: "Para quem quer comprar direto e receber em casa, com o catálogo da marca.",
    botao_texto: "Comprar na loja oficial",
    link: "https://www.pierrecosmeticos.com.br",
    botao_estilo: "secundario",
  },
  {
    rotulo: "Atendimento pessoal",
    titulo: "Consultora Pierre",
    texto: "Atendimento próximo, indicação personalizada e acompanhamento pelo WhatsApp.",
    botao_texto: "Falar no WhatsApp",
    link: "whatsapp",
    botao_estilo: "primario",
  },
];

export default async function OndeComprarPage() {
  const cms = await cmsBlocos("onde-comprar");
  if (cms) return cms;
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">Onde comprar</div>
          <h1>Onde comprar Pierre Alexander</h1>
          <p>Compre na loja oficial ou fale com uma consultora pelo WhatsApp.</p>
        </div>
      </section>

      <Canais
        titulo="Escolha como prefere comprar."
        subtitulo="A loja entrega praticidade. A consultora entrega proximidade. A Pierre entrega confiança."
        canais={CANAIS}
      />

      <section className="cms-cta">
        <div className="container">
          <h2>Valorize a rede Pierre.</h2>
          <p>
            Sempre que possível, compre com uma consultora próxima e fortaleça
            quem leva a Pierre para mais pessoas.
          </p>
          <Link className="btn btn-light" href="/consultora">
            Quero vender também
          </Link>
        </div>
      </section>
    </>
  );
}
