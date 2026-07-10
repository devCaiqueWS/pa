import type { Metadata } from "next";
import CtaBand from "@/components/CtaBand";
import { asset } from "@/lib/site";

export const metadata: Metadata = { title: "Sobre" };

import { cmsBlocos } from "@/lib/cms-render";

export default async function SobrePage() {
  const cms = await cmsBlocos("sobre");
  if (cms) return cms;
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">Sobre</div>
          <h1>Sobre a Pierre Alexander</h1>
          <p>História, qualidade, cuidado e beleza que funciona há décadas.</p>
        </div>
      </section>

      <section className="section">
        <div className="container split-feature">
          <div className="big-copy">
            <div className="eyebrow">história e confiança</div>
            <h2>Uma marca brasileira com charme francês.</h2>
            <p>
              A Pierre Alexander nasceu no Brasil e cresceu acompanhando a rotina
              de milhares de pessoas.
            </p>
            <p>
              Ao longo da sua história, construiu uma relação de confiança com
              consumidores e consultoras, unindo qualidade, alegria, cuidado e
              sofisticação.
            </p>
            <p>
              Somos uma marca de beleza eficiente: beleza que funciona no corpo,
              na pele, no perfume, na casa e na vida real.
            </p>
          </div>
          <div className="feature-img">
            <img src={asset("/assets/img/hero-mural.jpg")} alt="Pierre Alexander" />
          </div>
        </div>
      </section>

      <section className="section section-paper">
        <div className="container">
          <div className="section-title">
            <h2>O que nos guia.</h2>
            <p>
              Quatro pilares guiam tudo que a Pierre faz — do produto na
              prateleira ao atendimento na sua porta.
            </p>
          </div>
          <div className="grid-4">
            <div className="panel">
              <h3>História</h3>
              <p>Honramos a caminhada da marca e das consultoras.</p>
            </div>
            <div className="panel">
              <h3>Qualidade</h3>
              <p>Produto precisa funcionar antes de prometer.</p>
            </div>
            <div className="panel">
              <h3>Cuidado</h3>
              <p>Corpo, rosto, casa, rotina e autoestima.</p>
            </div>
            <div className="panel">
              <h3>Força coletiva</h3>
              <p>A Pierre cresce com quem vende, compra e indica.</p>
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
