import Link from "next/link";
import type { Metadata } from "next";
import CtaBand from "@/components/CtaBand";
import { asset } from "@/lib/site";

export const metadata: Metadata = { title: "Maison" };

export default function MaisonPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">Maison</div>
          <h1>Maison · Bem-estar em Casa</h1>
          <p>
            A linha Pierre para perfumar ambientes e tecidos, criando
            acolhimento, frescor e personalidade no lar.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container split-feature">
          <div className="big-copy">
            <div className="eyebrow">linha de casa</div>
            <h2>A Pierre também mora na sua casa.</h2>
            <p>
              Maison é a linha Pierre para perfumar ambientes e tecidos, criando
              uma sensação de acolhimento, frescor e personalidade no lar.
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
          </div>
          <div className="feature-img">
            <img src={asset("/assets/img/maison-sacola.jpg")} alt="Maison Pierre" />
          </div>
        </div>
      </section>

      <section className="section section-paper">
        <div className="container">
          <div className="section-title">
            <h2>Como organizar Maison.</h2>
            <p>
              A Pierre que perfuma sua casa — escolha por ambiente, ocasião ou
              presente.
            </p>
          </div>
          <div className="grid-2">
            <div className="panel">
              <h3>Ambientes</h3>
              <p>Aromatizadores para deixar a casa acolhedora.</p>
            </div>
            <div className="panel">
              <h3>Tecidos</h3>
              <p>Água de rouparia para lençóis, toalhas, roupas e armários.</p>
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
