import Link from "next/link";
import type { Metadata } from "next";
import CtaBand from "@/components/CtaBand";
import { asset } from "@/lib/site";

export const metadata: Metadata = { title: "Produtos" };

export default function ProdutosPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">Catálogo</div>
          <h1>Produtos Pierre Alexander</h1>
          <p>Cuidado para corpo, rosto, banho, fragrâncias, casa e rotina.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>Escolha por necessidade.</h2>
            <p>
              Menos vitrine confusa. Mais prateleira inteligente para compra e
              venda.
            </p>
          </div>
          <div className="grid-3">
            <article className="product-card">
              <img
                src={asset("/assets/img/desodorantes-varios.jpg")}
                alt="Desodorantes Pierre"
              />
              <div className="pc-body">
                <h3>Desodorantes</h3>
                <p>
                  Creme Original, roll-on, toque seco, bloqueador, pump, aerossol
                  e combos.
                </p>
                <Link className="pc-link" href="/original">
                  Ver categoria →
                </Link>
              </div>
            </article>
            <article className="product-card">
              <img src={asset("/assets/img/body-splash.jpg")} alt="Fragrâncias Pierre" />
              <div className="pc-body">
                <h3>Fragrâncias</h3>
                <p>Body splash, deo colônia, body spray e famílias olfativas.</p>
                <Link className="pc-link" href="/fragrancias">
                  Ver categoria →
                </Link>
              </div>
            </article>
            <article className="product-card">
              <img src={asset("/assets/img/social-cards.jpg")} alt="Tratamentos Pierre" />
              <div className="pc-body">
                <h3>Tratamentos</h3>
                <p>
                  Radicaline, água micelar, sérum, aloe, rosa mosqueta e
                  nutrição.
                </p>
                <Link className="pc-link" href="/tratamentos">
                  Ver categoria →
                </Link>
              </div>
            </article>
            <article className="product-card">
              <img src={asset("/assets/img/maison-sacola.jpg")} alt="Maison Pierre" />
              <div className="pc-body">
                <h3>Maison</h3>
                <p>Aromatizador, água de rouparia e perfume de ambiente.</p>
                <Link className="pc-link" href="/maison">
                  Ver categoria →
                </Link>
              </div>
            </article>
            <article className="product-card">
              <img
                src={asset("/assets/img/fragrancia-secrets.jpg")}
                alt="Masculino Pierre"
              />
              <div className="pc-body">
                <h3>Masculino</h3>
                <p>Secrets, Mykonos, Álamo, Vingt, pós-barba e desodorantes.</p>
                <Link className="pc-link" href="/fragrancias">
                  Ver categoria →
                </Link>
              </div>
            </article>
            <article className="product-card">
              <img src={asset("/assets/img/bag-colorida.jpg")} alt="Kits e presentes" />
              <div className="pc-body">
                <h3>Kits e Presentes</h3>
                <p>Combinações para datas, começo de consultora e recompra.</p>
                <Link className="pc-link" href="/kits">
                  Ver categoria →
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section section-black">
        <div className="container grid-2">
          <div className="big-copy">
            <h2>Uma categoria puxa a outra.</h2>
            <p>
              O desodorante abre a conversa. A fragrância aumenta o desejo. O
              tratamento aumenta o valor do pedido. Acessórios, brindes e prêmios
              criam presente, casa e recompra.
            </p>
          </div>
          <div className="panel red">
            <h3>Original e Inigualável abre o caminho.</h3>
            <p>
              Do desodorante que todo mundo conhece para o tratamento diário, o
              seu bem-estar e de sua casa e muito mais.
            </p>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
