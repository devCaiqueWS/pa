import Link from "next/link";
import type { Metadata } from "next";
import CtaBand from "@/components/CtaBand";

export const metadata: Metadata = { title: "Cuidado Facial" };

import { cmsBlocos } from "@/lib/cms-render";

export default async function TratamentosPage() {
  const cms = await cmsBlocos("tratamentos");
  if (cms) return cms;
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">Cuidado Facial</div>
          <h1>Cuidado Facial Pierre</h1>
          <p>
            Seu cuidado, no seu tempo. Comece pelo que sua pele precisa hoje:
            limpar, hidratar, equilibrar ou intensificar o cuidado. Um produto
            para começar. Uma rotina para evoluir no seu ritmo.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container grid-2">
          <div className="big-copy">
            <div className="eyebrow">cuidado facial</div>
            <h2>Sua pele, sua rotina, seu tempo.</h2>
            <p>
              Da limpeza diária ao cuidado intensivo, a Pierre tem o cuidado para
              cada momento da sua pele.
            </p>
            <p>
              Aparência saudável, viço, conforto, hidratação e luminosidade — no
              seu ritmo.
            </p>
            <div className="hero-actions">
              <a
                className="btn btn-primary"
                href="https://www.pierrecosmeticos.com.br"
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
            <Link className="btn btn-primary" href="/consultora#universidade">
              Treinamento para consultoras
            </Link>
          </div>
          <div className="panel" id="radicaline">
            <h3>Radicaline</h3>
            <p>Em breve. A nova era do cuidado facial Pierre.</p>
            <div className="pill-list">
              <span className="pill">Sabonete</span>
              <span className="pill">Tônico</span>
              <span className="pill">Sérum</span>
              <span className="pill">Dia e noite</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-paper" id="cuidados-especiais">
        <div className="container">
          <div className="section-title">
            <h2>Linhas de Cuidado Facial.</h2>
            <p>Organização para o site e para as campanhas.</p>
          </div>
          <div className="grid-3">
            <div className="panel">
              <h3>Aloe Vera</h3>
              <p>Hidratação, frescor e cuidado versátil.</p>
            </div>
            <div className="panel">
              <h3>Rosa Mosqueta</h3>
              <p>Nutrição, reparação e cuidado especial.</p>
            </div>
            <div className="panel">
              <h3>Nutri</h3>
              <p>Nutrição e conforto para pele ressecada.</p>
            </div>
            <div className="panel">
              <h3>Água Micelar</h3>
              <p>Limpeza, rotina facial e entrada para Radicaline.</p>
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
