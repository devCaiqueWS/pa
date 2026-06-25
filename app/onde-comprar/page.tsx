import Link from "next/link";
import type { Metadata } from "next";
import CtaBand from "@/components/CtaBand";

export const metadata: Metadata = { title: "Onde Comprar" };

export default function OndeComprarPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">Onde comprar</div>
          <h1>Onde comprar Pierre Alexander</h1>
          <p>
            Loja oficial, WhatsApp ou consultora: escolha como prefere comprar.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>Escolha seu canal.</h2>
            <p>
              A loja entrega praticidade. A consultora entrega proximidade. A
              Pierre entrega confiança.
            </p>
          </div>
          <div className="grid-3">
            <div className="panel">
              <h3>Loja oficial</h3>
              <p>Para quem quer comprar direto e receber em casa.</p>
              <br />
              <Link className="btn btn-primary" href="#">
                Comprar na loja
              </Link>
            </div>
            <div className="panel">
              <h3>Consultora</h3>
              <p>
                Atendimento próximo, indicação personalizada e acompanhamento.
              </p>
              <br />
              <Link className="btn btn-primary" href="#">
                Encontrar consultora
              </Link>
            </div>
            <div className="panel">
              <h3>WhatsApp</h3>
              <p>Pedido, dúvidas e orientação pelo canal de atendimento.</p>
              <br />
              <Link className="btn btn-primary" href="#">
                Falar no WhatsApp
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-paper">
        <div className="container cta-band">
          <div>
            <h2>Valorize a rede Pierre.</h2>
            <p>
              Sempre que possível, compre com uma consultora próxima e fortaleça
              quem leva a Pierre para mais pessoas.
            </p>
          </div>
          <Link className="btn btn-carbon" href="/consultora">
            Quero vender também
          </Link>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
