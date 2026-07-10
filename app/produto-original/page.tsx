import Link from "next/link";
import type { Metadata } from "next";
import CtaBand from "@/components/CtaBand";
import { asset } from "@/lib/site";

export const metadata: Metadata = { title: "Desodorante em Creme Original" };

import { cmsBlocos } from "@/lib/cms-render";

export default async function ProdutoOriginalPage() {
  const cms = await cmsBlocos("produto-original");
  if (cms) return cms;
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">Produto</div>
          <h1>Desodorante em Creme Original</h1>
          <p>
            Conheça o Original em detalhes — e descubra por que ele é o ponto de
            partida de tantas histórias com a Pierre.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container grid-2">
          <div className="feature-img">
            <img
              src={asset("/assets/img/desodorante-original.jpg")}
              alt="Desodorante em Creme Original"
            />
          </div>
          <div className="big-copy">
            <div className="eyebrow">produto</div>
            <h2>Desodorante em Creme Original 50g</h2>
            <p>
              Proteção diária em creme. Um clássico Pierre Alexander para quem
              busca cuidado simples, direto e confiável.
            </p>
            <div className="pill-list">
              <span className="pill">Uso diário</span>
              <span className="pill">Creme</span>
              <span className="pill">Recompra</span>
              <span className="pill">Clássico Pierre</span>
            </div>
            <div className="hero-actions">
              <a
                className="btn btn-primary"
                href="https://www.pierrecosmeticos.com.br/desodorante-em-creme-50g-original-pierre-alexander"
                target="_blank"
                rel="noopener"
              >
                Comprar agora
              </a>
              <Link className="btn btn-orange" href="/onde-comprar">
                Encontrar uma consultora
              </Link>
              <Link className="btn btn-ghost" href="/consultora">
                Quero vender este produto
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-paper">
        <div className="container">
          <div className="section-title">
            <h2>Como apresentar.</h2>
            <p>
              Estrutura de página de produto pensada para consumidor e
              consultora.
            </p>
          </div>
          <div className="table-like">
            <div className="table-row">
              <b>Para quem é</b>
              <span>
                Para quem busca proteção diária em creme e quer um produto com
                tradição na marca.
              </span>
            </div>
            <div className="table-row">
              <b>Como usar</b>
              <span>
                Aplicar pequena quantidade sobre a pele limpa e seca. Reaplicar
                se necessário.
              </span>
            </div>
            <div className="table-row">
              <b>Combine com</b>
              <span>
                Deo Colônia, Body Splash, sabonete, hidratante, casa ou kit de
                recompra.
              </span>
            </div>
            <div className="table-row">
              <b>Para consultoras</b>
              <span>
                Produto ideal para primeira venda, combos e clientes que já
                conhecem a Pierre.
              </span>
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
