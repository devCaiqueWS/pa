"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Props = { nome: string; preco?: number };

// Barra fixa no rodapé do celular: aparece quando os botões da página de
// produto (.pdp-actions) já rolaram para cima da tela. Lê a posição a cada
// scroll (rAF) em vez de IntersectionObserver, para funcionar também em
// saltos (âncoras, flicks). Marca o <body> com has-pdp-bar para o WhatsApp
// flutuante subir.
export default function PdpBar({ nome, preco }: Props) {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const alvo = document.querySelector(".pdp-actions");
    if (!alvo) return;
    let raf = 0;
    const medir = () => {
      raf = 0;
      setVisivel(alvo.getBoundingClientRect().bottom < 0);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(medir);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    medir();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("has-pdp-bar", visivel);
    return () => document.body.classList.remove("has-pdp-bar");
  }, [visivel]);

  return (
    <div className={`pdp-bar${visivel ? " is-on" : ""}`} aria-hidden={!visivel}>
      <div className="pdp-bar-info">
        <strong>{nome}</strong>
        {preco != null && <span>{preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>}
      </div>
      <Link className="btn btn-primary btn-sm" href="/onde-comprar" tabIndex={visivel ? 0 : -1}>
        Encontrar consultora
      </Link>
    </div>
  );
}
