import Link from "next/link";
import type { Metadata } from "next";
import CtaBand from "@/components/CtaBand";
import { asset } from "@/lib/site";

export const metadata: Metadata = { title: "O Original" };

export default function OriginalPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">Desodorantes</div>
          <h1>
            <span className="hero-tag">O Inigualável</span>
            <br />O original da Pierre.
          </h1>
          <p>O clássico que atravessa gerações.</p>
        </div>
      </section>

      <section className="section">
        <div className="container split-feature">
          <div className="big-copy">
            <div className="eyebrow">o cuidado que abriu caminho</div>
            <h2>Um clássico que atravessa gerações.</h2>
            <p>
              Antes de muita promessa bonita, a Pierre Alexander já estava na
              rotina de quem precisava de proteção de verdade.
            </p>
            <p>
              O Original e Inigualável é simples de entender, fácil de indicar e
              forte para recompra. É a melhor porta de entrada para o consumidor
              e para a consultora.
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
            <img
              src={asset("/assets/img/desodorante-original.jpg")}
              alt="Desodorante Original"
            />
          </div>
        </div>
      </section>

      <section className="section section-paper">
        <div className="container">
          <div className="section-title">
            <h2>Por que ele vende?</h2>
            <p>Os 4 motivos pelos quais o Original conquistou o Brasil.</p>
          </div>
          <div className="motivos-list">
            <div className="motivo-row">
              <div className="motivo-icon">
                <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
                  <path
                    d="M32 6L10 16v14c0 14 9 25 22 28 13-3 22-14 22-28V16L32 6z"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22 32l7 7 13-14"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="motivo-text">
                <h3>Resolve</h3>
                <p>
                  Todo mundo entende a necessidade de proteção diária. A Pierre
                  promete e entrega.
                </p>
              </div>
            </div>

            <div className="motivo-row">
              <div className="motivo-icon">
                <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
                  <path
                    d="M12 18a6 6 0 016-6h28a6 6 0 016 6v22a6 6 0 01-6 6H28l-10 8v-8h-0a6 6 0 01-6-6V18z"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22 24h20M22 32h14"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className="motivo-text">
                <h3>Indica</h3>
                <p>
                  É um produto fácil de apresentar em uma conversa comum. Afinal,
                  todo mundo usa.
                </p>
              </div>
            </div>

            <div className="motivo-row motivo-highlight">
              <span className="motivo-badge">★ Dado Pierre</span>
              <div className="motivo-icon">
                <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
                  <path
                    d="M52 16L36 32l-8-8L12 40"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M40 16h12v12"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="motivo-text">
                <h3>Volta</h3>
                <p>
                  <strong>Um clássico Pierre de alta recompra.</strong> Quem
                  experimenta, volta a comprar — o desodorante em creme Pierre é
                  uma das maiores vitrines de fidelidade da marca.
                </p>
              </div>
            </div>

            <div className="motivo-row">
              <div className="motivo-icon">
                <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
                  <rect
                    x="10"
                    y="14"
                    width="20"
                    height="40"
                    rx="3"
                    stroke="currentColor"
                    strokeWidth="3"
                  />
                  <rect
                    x="34"
                    y="22"
                    width="20"
                    height="32"
                    rx="3"
                    stroke="currentColor"
                    strokeWidth="3"
                  />
                  <path
                    d="M20 14V8M44 22v-6"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className="motivo-text">
                <h3>Abre portas</h3>
                <p>
                  Depois dele, entram fragrâncias, tratamentos, casa e muito
                  mais.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>Linha desodorantes.</h2>
            <p>
              Conheça toda a linha de desodorantes Pierre — proteção que cabe em
              cada rotina.
            </p>
          </div>
          <div className="table-like">
            <div className="table-row">
              <b>Creme Original</b>
              <span>
                O desodorante em creme que atravessa gerações. Proteção diária
                com a tradição Pierre.
              </span>
            </div>
            <div className="table-row table-sub">
              <b>Creme Bloqueador de Odores</b>
              <span>
                Para quem busca proteção intensa com bloqueio total de odores. A
                mesma confiança do Original, reforçada.
              </span>
            </div>
            <div className="table-row">
              <b>Roll-on</b>
              <span>
                Cremoso, Toque Seco, <strong className="hl-cinza">Cinza</strong>{" "}
                <span className="top2-badge">TOP 2</span> e Bloqueador de Odores.
              </span>
            </div>
            <div className="table-row">
              <b>Pump / Bisnaga / Aerossol</b>
              <span>Variações por preferência de uso, textura e ocasião.</span>
            </div>
            <div className="table-row">
              <b>Combos</b>
              <span>Entrada ideal para recompra, família e consultoras.</span>
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
