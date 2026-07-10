import type { Metadata } from "next";
import CtaBand from "@/components/CtaBand";
import { asset } from "@/lib/site";

export const metadata: Metadata = { title: "Kits e Presentes" };

import { cmsBlocos } from "@/lib/cms-render";

export default async function KitsPage() {
  const cms = await cmsBlocos("kits");
  if (cms) return cms;
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">Kits</div>
          <h1>Kits e Presentes</h1>
          <p>Combinações para usar, vender, presentear e aumentar recompra.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>Combinações prontas para vender.</h2>
            <p>
              Kits ajudam a aumentar ticket, simplificar escolha e criar
              campanhas mensais.
            </p>
          </div>
          <div className="grid-3">
            <div className="panel">
              <h3>Kit Original</h3>
              <p>Desodorantes e variações para recompra.</p>
            </div>
            <div className="panel">
              <h3>Kit Fragrâncias</h3>
              <p>Body splash, deo colônia e presentes.</p>
            </div>
            <div className="panel">
              <h3>Kit Tratamento</h3>
              <p>Radicaline, aloe, rosa mosqueta e cuidados especiais.</p>
            </div>
            <div className="panel">
              <h3>Kit Maison</h3>
              <p>Casa, ambiente, tecidos e sabonetes.</p>
            </div>
            <div className="panel">
              <h3>Kit Primeira Compra</h3>
              <p>Entrada para quem quer conhecer a marca.</p>
            </div>
            <div className="panel">
              <h3>Kit Consultora</h3>
              <p>Produtos para começar a vender com confiança.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-red">
        <div className="container grid-2">
          <div className="big-copy">
            <h2>Calendário comercial.</h2>
            <p>
              Dia das Mães, Namorados, inverno, verão, Black Pierre, Natal,
              aniversário da marca e campanhas de reativação.
            </p>
          </div>
          <div className="feature-img">
            <img src={asset("/assets/img/bag-colorida.jpg")} alt="Kits Pierre" />
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
