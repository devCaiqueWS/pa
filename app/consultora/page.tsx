import Link from "next/link";
import type { Metadata } from "next";
import CtaBand from "@/components/CtaBand";
import ConsultoraForm from "@/components/ConsultoraForm";
import { asset } from "@/lib/site";

export const metadata: Metadata = { title: "Seja Consultora" };

export default function ConsultoraPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">Pierre Business</div>
          <h1>Seja Consultora Pierre Alexander</h1>
          <p>
            Venda produtos de recompra, cresça com treinamento e evolua com
            reconhecimento.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container split-feature">
          <div className="big-copy">
            <div className="eyebrow">Pierre Business</div>
            <h2>Você não começa do zero. Começa com Pierre.</h2>
            <p>
              Ser consultora Pierre Alexander é vender produtos conhecidos, com
              recompra, campanha, conteúdo e orientação de executiva.
            </p>
            <p>
              Mais que vender: crescer com uma marca que as pessoas já confiam.
              Treinamento, campanhas, evolução e reconhecimento esperam por você.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-primary" href="#lead-consultora">
                Quero me cadastrar
              </Link>
              <Link className="btn btn-ghost" href="#universidade">
                Ver treinamentos
              </Link>
            </div>
          </div>
          <div className="feature-img">
            <img src={asset("/assets/img/consultoras.jpg")} alt="Consultoras Pierre" />
          </div>
        </div>
      </section>

      <section className="section section-paper">
        <div className="container">
          <div className="section-title">
            <h2>Como funciona.</h2>
            <p>
              Uma jornada clara para tirar a pessoa da curiosidade e levar para o
              primeiro pedido.
            </p>
          </div>
          <div className="steps">
            <div className="step">
              <h3>Cadastro</h3>
              <p>A interessada deixa nome, WhatsApp, cidade e intenção.</p>
            </div>
            <div className="step">
              <h3>Contato</h3>
              <p>Uma executiva chama e orienta o primeiro passo.</p>
            </div>
            <div className="step">
              <h3>Primeiro pedido</h3>
              <p>Começa com produtos fáceis de apresentar.</p>
            </div>
            <div className="step">
              <h3>Evolução</h3>
              <p>Treinamento, campanhas, metas e reconhecimento.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="universidade">
        <div className="container">
          <div className="section-title">
            <h2>Universidade Pierre.</h2>
            <p>Treinamentos curtos, simples e práticos para vender no dia a dia.</p>
          </div>
          <div className="grid-3">
            <div className="panel">
              <h3>Comece Hoje</h3>
              <p>Cadastro, primeira venda, primeiro pedido e postura de consultora.</p>
            </div>
            <div className="panel">
              <h3>Venda o Original</h3>
              <p>Como apresentar desodorante, combos e recompra.</p>
            </div>
            <div className="panel">
              <h3>WhatsApp que vende</h3>
              <p>Scripts, abordagem, follow-up e fechamento.</p>
            </div>
            <div className="panel">
              <h3>Fragrâncias</h3>
              <p>Como vender body splash, deo colônia e presente.</p>
            </div>
            <div className="panel">
              <h3>Radicaline</h3>
              <p>Como vender rotina facial e aumentar ticket.</p>
            </div>
            <div className="panel">
              <h3>Suba de nível</h3>
              <p>Metas, indicações, campanhas e evolução.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-black" id="conquistas">
        <div className="container">
          <div className="section-title">
            <h2>Evolução e conquistas.</h2>
            <p>
              A consultora precisa saber onde está, qual é o próximo passo e o
              que precisa fazer hoje.
            </p>
          </div>
          <div className="levels">
            <div className="level">
              <b>Iniciante</b>
              <span>Cadastro e primeiro pedido.</span>
            </div>
            <div className="level">
              <b>Bronze</b>
              <span>Primeiras vendas e rotina básica.</span>
            </div>
            <div className="level">
              <b>Prata</b>
              <span>Frequência, recompra e campanha.</span>
            </div>
            <div className="level">
              <b>Ouro</b>
              <span>Base ativa e indicações.</span>
            </div>
            <div className="level">
              <b>Executiva</b>
              <span>Equipe, liderança e meta regional.</span>
            </div>
            <div className="level">
              <b>Sênior</b>
              <span>Desenvolve lideranças e representa a Pierre.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="lead-consultora">
        <div className="container grid-2">
          <div className="big-copy">
            <div className="eyebrow">cadastro</div>
            <h2>A próxima consultora Pierre pode ser você.</h2>
            <p>
              Preencha seus dados e uma executiva Pierre entrará em contato em até
              48 horas para apresentar sua primeira oportunidade.
            </p>
          </div>
          <ConsultoraForm />
        </div>
      </section>

      <CtaBand />
    </>
  );
}
