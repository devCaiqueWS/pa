"use client";

import { useState } from "react";

type Props = {
  eyebrow?: string;
  titulo?: string;
  texto?: string;
  placeholder?: string;
  botaoTexto?: string;
  aviso?: string;
};

const AVISO_PADRAO = "Cadastro de novidades disponível em breve.";

// Novidades por e-mail. O cadastro ainda NÃO existe (não há backend), e a
// seção diz isso na cara: o aviso fica sempre visível e o envio não finge que
// deu certo — repete o aviso. Quando houver backend, trocar o onSubmit.
export default function Novidades({ eyebrow, titulo, texto, placeholder, botaoTexto, aviso }: Props) {
  const [tentou, setTentou] = useState(false);
  const nota = aviso || AVISO_PADRAO;

  return (
    <section className="novid" aria-labelledby="novid-titulo">
      <div className="container novid-inner">
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2 id="novid-titulo">{titulo || "Uma boa novidade sempre faz bem."}</h2>
        {texto && <p className="lead">{texto}</p>}

        <form
          className="novid-form"
          onSubmit={(e) => {
            e.preventDefault();
            setTentou(true);
          }}
        >
          <label className="sr-only" htmlFor="novid-email">
            {placeholder || "Seu melhor e-mail"}
          </label>
          <input id="novid-email" type="email" name="email" placeholder={placeholder || "Seu melhor e-mail"} autoComplete="email" />
          <button className="btn btn-primary" type="submit">
            {botaoTexto || "Quero receber"}
          </button>
        </form>

        <p className="novid-aviso" role={tentou ? "status" : undefined}>
          {nota}
        </p>
      </div>
    </section>
  );
}
