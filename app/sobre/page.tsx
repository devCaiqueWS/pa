import type { Metadata } from "next";
import Link from "next/link";
import { asset } from "@/lib/site";
import { cmsBlocos } from "@/lib/cms-render";
import Valores from "@/components/cms/Valores";
import Timeline from "@/components/cms/Timeline";
import Novidades from "@/components/cms/Novidades";

export const metadata: Metadata = { title: "Sobre" };

// Mesma narrativa dos blocos publicados no CMS (db/site_sobre_conteudo.sql),
// para a página não empobrecer caso a página do painel seja despublicada.
// ⚠️ A linha do tempo é ILUSTRATIVA — ver o aviso exibido na própria seção.
const MARCOS = [
  {
    ano: "1981",
    rotulo: "Marco ilustrativo",
    titulo: "Uma ideia começa a ganhar forma",
    texto:
      "Na história que imaginamos para esta apresentação, a Pierre nasce do encontro entre o conhecimento das fórmulas e a vontade de aproximar a beleza das pessoas.",
  },
  {
    ano: "1990",
    rotulo: "Marco ilustrativo",
    titulo: "A beleza encontra novos caminhos",
    texto:
      "O segundo capítulo simulado representa a ampliação das conversas e a chegada da marca a novas rotinas, com pessoas que compartilham descobertas e cuidado.",
  },
  {
    ano: "2005",
    rotulo: "Marco ilustrativo",
    titulo: "Uma história feita de conexões",
    texto:
      "Neste marco ilustrativo, a rede de consultoras ganha destaque como parte da relação entre a marca e quem escolhe seus produtos.",
  },
  {
    ano: "2015",
    rotulo: "Marco ilustrativo",
    titulo: "Curiosidade para continuar criando",
    texto:
      "A evolução do portfólio e novas possibilidades de cuidado entram em cena. Este capítulo será substituído pelos lançamentos e acontecimentos reais da Pierre.",
  },
  {
    ano: "2026",
    rotulo: "Marco ilustrativo",
    titulo: "O próximo capítulo começa agora",
    texto:
      "A linha do tempo chega ao presente com uma proposta de marca mais próxima: conhecimento, escolhas e novas conversas sobre beleza. Os acontecimentos reais serão confirmados pela Pierre.",
  },
];

const VALORES = [
  {
    rotulo: "Conhecer",
    titulo: "Experiência que inspira",
    texto: "Uma história que olha para o que aprendeu e mantém espaço para novas perguntas.",
  },
  {
    rotulo: "Criar",
    titulo: "Curiosidade que move",
    texto: "Novas ideias para acompanhar os diferentes jeitos de viver e de se cuidar.",
  },
  {
    rotulo: "Conectar",
    titulo: "Beleza que aproxima",
    texto: "Relações, encontros e pessoas que ajudam a escrever os próximos capítulos.",
  },
];

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

      <section className="cms-texto">
        <div className="container">
          <span className="eyebrow">Beleza que tem história</span>
          <h2>Conhecimento nas fórmulas. Sensibilidade nas relações.</h2>
          <p>
            A Pierre encontra inspiração na vida real: nas escolhas de todos os
            dias, nas conversas que aproximam e na vontade de experimentar algo
            novo.
          </p>
          <p>
            É assim que imaginamos esta história sendo contada: com o olhar de
            quem entende de beleza e a atenção de quem sabe que, por trás de cada
            escolha, existe uma pessoa.
          </p>
        </div>
      </section>

      <Valores valores={VALORES} />

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

      <Timeline
        id="timeline"
        eyebrow="Do primeiro capítulo ao agora"
        titulo="Uma história que segue em movimento."
        aviso="Linha do tempo ilustrativa: as datas e os marcos abaixo são uma proposta para esta apresentação e serão substituídos pela história oficial da Pierre."
        marcos={MARCOS}
      />

      <section className="cms-cta">
        <div className="container">
          <h2>A próxima história também pode ser sua.</h2>
          <Link className="btn btn-primary" href="/onde-comprar">
            Encontre a Pierre
          </Link>
        </div>
      </section>

      <Novidades
        eyebrow="Continue por perto"
        titulo="Uma boa novidade sempre faz bem."
        texto="Conteúdos, lançamentos e novas conversas sobre beleza. Receba o universo Pierre no seu e-mail."
        placeholder="Seu melhor e-mail"
        botaoTexto="Quero receber"
        aviso="Cadastro de novidades disponível em breve."
      />
    </>
  );
}
