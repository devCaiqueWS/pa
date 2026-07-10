import Link from "next/link";
import type { Metadata } from "next";
import CtaBand from "@/components/CtaBand";
import { asset } from "@/lib/site";

export const metadata: Metadata = { title: "Fragrâncias & Expressão" };

import { cmsBlocos } from "@/lib/cms-render";

export default async function FragranciasPage() {
  const cms = await cmsBlocos("fragrancias");
  if (cms) return cms;
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">Fragrâncias &amp; Expressão</div>
          <h1>Fragrâncias &amp; Expressão</h1>
          <p>
            Uma fragrância para cada presença. Body splashes e deo colônias para
            acompanhar estilos, estados de espírito e momentos da rotina.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container split-feature">
          <div className="feature-img">
            <img src={asset("/assets/img/body-splash.jpg")} alt="Body splash Pierre" />
          </div>
          <div className="big-copy">
            <div className="eyebrow">expressão brasileira</div>
            <h2>Uma fragrância para cada presença.</h2>
            <p>
              Fragrância é memória. É presença. É a forma como o cuidado fica no
              ar depois que a pessoa passa.
            </p>
            <p>
              Da frescura cítrica ao floral marcante, da memória frutal
              brasileira ao perfume masculino sofisticado. A Pierre tem
              fragrância para cada momento, cada pessoa e cada ambiente.
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
            <div className="pill-list">
              <span className="pill">Jabuticaba</span>
              <span className="pill">Vert</span>
              <span className="pill">Lavande</span>
              <span className="pill">D’Azur</span>
              <span className="pill">Laura Um</span>
              <span className="pill">Secrets</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-paper">
        <div className="container">
          <div className="section-title">
            <h2>Famílias olfativas.</h2>
            <p>Uma forma mais comercial de organizar a descoberta.</p>
          </div>
          <div className="grid-3">
            <div className="panel">
              <h3>Frescas e verdes</h3>
              <p>Vert, D’Azur, águas aromáticas e body splash para rotina.</p>
            </div>
            <div className="panel">
              <h3>Florais e elegantes</h3>
              <p>Lavande, Laura Um, Aura Única, Amarílis e linhas femininas.</p>
            </div>
            <div className="panel">
              <h3>Frutais brasileiras</h3>
              <p>Jabuticaba e futuras fragrâncias com memória brasileira.</p>
            </div>
            <div className="panel">
              <h3>Masculinas marcantes</h3>
              <p>Secrets Pour Homme, Secrets Black, Mykonos, Álamo e Vingt Homme.</p>
            </div>
            <div className="panel">
              <h3>Compartilháveis</h3>
              <p>Fragrâncias leves, modernas e de uso livre.</p>
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
