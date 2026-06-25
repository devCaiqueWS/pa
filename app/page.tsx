import Link from "next/link";
import CtaBand from "@/components/CtaBand";
import HeroCarousel from "@/components/HeroCarousel";
import { asset } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      <HeroCarousel />

      <div className="container quick-cards">
        <Link className="quick-card" href="/original">
          <b>Original e Inigualável</b>
          <p>Um clássico Pierre de alta recompra.</p>
        </Link>
        <Link className="quick-card" href="/fragrancias">
          <b>Fragrâncias</b>
          <p>Deo Colônia e Body Splash, presença marcante para cada momento.</p>
        </Link>
        <Link className="quick-card" href="/tratamentos">
          <b>Cuidado Facial</b>
          <p>Seu cuidado, no seu tempo.</p>
        </Link>
        <Link className="quick-card" href="/consultora">
          <b>Seja Consultora</b>
          <p>
            Treinamento, campanhas, evolução e conquistas. Aqui a Pierre
            compartilha o sucesso.
          </p>
        </Link>
      </div>

      <section className="section">
        <div className="container split-feature">
          <div className="feature-img">
            <img
              src={asset("/assets/img/desodorantes-varios.jpg")}
              alt="Linha de desodorantes Pierre"
            />
          </div>
          <div className="big-copy">
            <div className="eyebrow">confiança diária</div>
            <h2>A Pierre começa no desodorante. Mas não termina nele.</h2>
            <p>
              O desodorante abriu caminho porque resolve uma necessidade real. A
              partir dessa confiança, a marca cresce para fragrâncias,
              tratamentos, banho, casa e muito mais.
            </p>
            <div className="pill-list">
              <span className="pill">Recompra</span>
              <span className="pill">Rotina</span>
              <span className="pill">Indicação fácil</span>
              <span className="pill">Venda consultiva</span>
            </div>
            <br />
            <Link className="btn btn-primary" href="/original">
              Ver linha de desodorantes
            </Link>
          </div>
        </div>
      </section>

      <section className="section section-paper teaser-section">
        <div className="container">
          <div className="section-title">
            <h2>Territórios Pierre.</h2>
            <p>
              Escolha pelo momento, pelo cuidado ou pelo desejo. A Pierre
              acompanha sua rotina, sua casa e suas presenças.
            </p>
          </div>
          <div className="teaser-grid teaser-grid-territories">
            <Link className="teaser-card" href="/tratamentos">
              <div className="teaser-body">
                <span className="teaser-tag">Para você</span>
                <h3>Cuidado Facial</h3>
                <p>
                  Limpar, equilibrar, hidratar, proteger e revitalizar. Descubra
                  uma rotina em que cada produto trabalha em harmonia para cuidar
                  da sua pele todos os dias.
                </p>
              </div>
            </Link>
            <Link className="teaser-card" href="/fragrancias#banho">
              <div className="teaser-body">
                <span className="teaser-tag">Para você</span>
                <h3>Banho &amp; Frescor</h3>
                <p>Aromas que renovam o dia.</p>
              </div>
            </Link>
            <Link className="teaser-card" href="/fragrancias">
              <div className="teaser-body">
                <span className="teaser-tag">Para você</span>
                <h3>Fragrâncias &amp; Expressão Brasileira</h3>
                <p>Uma fragrância para cada presença.</p>
              </div>
            </Link>
            <Link className="teaser-card" href="/maison">
              <div className="teaser-body">
                <span className="teaser-tag">Para sua casa</span>
                <h3>Bem-estar em Casa</h3>
                <p>O cuidado que também perfuma o seu lar.</p>
              </div>
            </Link>
            <Link className="teaser-card" href="/original">
              <div className="teaser-body">
                <span className="teaser-tag">Clássico</span>
                <h3>Proteção Diária</h3>
                <p>O Original Pierre, que atravessa gerações.</p>
              </div>
            </Link>
            <Link className="teaser-card" href="/produtos#presentes">
              <div className="teaser-body">
                <span className="teaser-tag">Surpresa</span>
                <h3>Para Presentear</h3>
                <p>Kits e combinações para cada ocasião.</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>Fragrâncias &amp; Expressão.</h2>
            <p>
              Charme francês sem perder a alegria brasileira: Jabuticaba, Vert,
              Lavande, D’Azur, Laura Um, Secrets e outras linhas olfativas.
            </p>
          </div>
          <div className="grid-3">
            <article className="product-card">
              <img
                src={asset("/assets/img/deo-colonias-laura.jpg")}
                alt="Deo Colônia Pierre - Laura Um"
              />
              <div className="pc-body">
                <h3>Deo Colônia</h3>
                <p>
                  Laura, Aura Única, Excitée Pour La Vie e For Life, Vingt,
                  Secrets Black e Homme.
                </p>
                <Link className="pc-link" href="/fragrancias">
                  Explorar →
                </Link>
              </div>
            </article>
            <article className="product-card">
              <img
                src={asset("/assets/img/banhos-aromaticos.jpg")}
                alt="Banhos Aromáticos e Body Splash Pierre"
              />
              <div className="pc-body">
                <h3>Banhos Aromáticos e Body Splash</h3>
                <p>
                  Lavande, Vert, D’Azur, Jabuticaba e Águas Virtuosas. Frescor e
                  perfume para todos os dias.
                </p>
                <Link className="pc-link" href="/fragrancias">
                  Explorar →
                </Link>
              </div>
            </article>
            <article className="product-card">
              <img
                src={asset("/assets/img/maison-sacola.jpg")}
                alt="Acessórios, Brindes e Prêmios Pierre"
              />
              <div className="pc-body">
                <h3>Acessórios, Brindes e Prêmios</h3>
                <p>A Pierre leva até você algo a mais, muito além de produtos.</p>
                <Link className="pc-link" href="/maison">
                  Explorar →
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section section-red">
        <div className="container grid-2">
          <div className="big-copy">
            <div className="eyebrow">Pierre Business</div>
            <h2>Venda Pierre. Cresça com uma marca reconhecida.</h2>
            <p>
              Área de captação para consultoras: treinamento, campanhas prontas,
              metas, níveis, conquistas e acompanhamento por executiva.
            </p>
            <br />
            <Link className="btn btn-carbon" href="/consultora">
              Conhecer a área da consultora
            </Link>
          </div>
          <div className="panel dark">
            <h3>O que ofereceremos nesta área</h3>
            <p>
              Universidade Pierre, trilhas de treinamento, campanhas, scripts
              para WhatsApp, evolução por níveis, ranking, conquistas e
              formulário de captação.
            </p>
            <div className="pill-list">
              <span className="pill">Treinamento</span>
              <span className="pill">Evolução</span>
              <span className="pill">Reconhecimento</span>
              <span className="pill">Captação</span>
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
