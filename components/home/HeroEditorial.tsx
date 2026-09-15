"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { asset, imagemSrc } from "@/lib/site";
import HeroVideo from "@/components/home/HeroVideo";
import { IMAGENS, srcSetWebp } from "@/lib/imagens";
import type { Banner } from "@/lib/banners";

const INTERVALO = 7000;

// Hero editorial da home. Os slides vêm do painel (/painel/banners): este
// componente só apresenta. Estilo "padrao" = composição editorial (texto sobre
// marfim + foto em bloco arredondado); estilo "lancamento" = cena cinematográfica
// em tela cheia (vídeo/poster com legenda).
export default function HeroEditorial({ slides }: { slides: Banner[] }) {
  const total = slides.length;
  const [atual, setAtual] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const reduzido = useRef(false);
  // Cortina: o hero fica preso (sticky) no topo enquanto o resto da página
  // desliza por cima. Como ele não sai do lugar, o progresso é o scroll da
  // página dividido pela altura do hero (--p 0→1); o CSS encolhe a foto e
  // leva o texto para cima. Com prefers-reduced-motion não faz nada.
  const secao = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = secao.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const medir = () => {
      raf = 0;
      const h = el.offsetHeight || 1;
      el.style.setProperty("--p", Math.min(1, Math.max(0, window.scrollY / h)).toFixed(4));
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

  const ir = useCallback(
    (idx: number) => {
      if (total === 0) return;
      setAtual(((idx % total) + total) % total);
    },
    [total]
  );

  const parar = useCallback(() => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  }, []);

  const iniciar = useCallback(() => {
    parar();
    if (total < 2 || reduzido.current || document.hidden) return;
    timer.current = setInterval(() => setAtual((c) => (c + 1) % total), INTERVALO);
  }, [total, parar]);

  useEffect(() => {
    reduzido.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    iniciar();
    const onVis = () => (document.hidden ? parar() : iniciar());
    document.addEventListener("visibilitychange", onVis);
    return () => {
      parar();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [iniciar, parar]);

  // Se o slide atual sumir (edição no painel reduziu a lista), volta pro primeiro.
  useEffect(() => {
    setAtual((c) => (c >= total ? 0 : c));
  }, [total]);

  if (total === 0) return null;
  const s = slides[atual];
  const lancamento = s.estilo === "lancamento";

  const nav =
    total > 1 ? (
      <div className="hero-nav" role="group" aria-label="Trocar destaque">
        <button
          type="button"
          aria-label="Destaque anterior"
          onClick={() => {
            ir(atual - 1);
            iniciar();
          }}
        >
          <Seta dir="esq" />
        </button>
        <button
          type="button"
          aria-label="Próximo destaque"
          onClick={() => {
            ir(atual + 1);
            iniciar();
          }}
        >
          <Seta dir="dir" />
        </button>
        <span className="hero-nav-count" aria-live="polite">
          {atual + 1} / {total}
        </span>
        {/* Linha de progresso do slide: recomeça a cada troca (key). */}
        <span className="hero-progress" key={`p-${atual}`} aria-hidden="true" style={{ animationDuration: `${INTERVALO}ms` }} />
      </div>
    ) : null;

  const acoes = (s.botao1Texto || s.botao2Texto) && (
    <div className="hero-cta">
      {s.botao1Texto && (
        <Acao className="btn btn-primary" href={s.botao1Link}>
          {s.botao1Texto}
        </Acao>
      )}
      {s.botao2Texto && (
        <Acao className={s.tom === "claro" ? "link-line" : "btn btn-ghost-light"} href={s.botao2Link}>
          {s.botao2Texto}
        </Acao>
      )}
    </div>
  );

  // Mídia em bleed total; o texto fica do lado oposto ao assunto (data-foco) e
  // o véu só do lado do texto (data-tom). Estilo "lancamento" = logo + frase +
  // título, sem botões.
  return (
    <section
      ref={secao}
      className={`hero${lancamento ? " hero-cine" : ""}`}
      data-foco={s.foco}
      data-tom={s.tom}
      aria-roledescription="carrossel"
      aria-label="Destaques Pierre Alexander"
      onMouseEnter={parar}
      onMouseLeave={iniciar}
      onFocus={parar}
      onBlur={iniciar}
    >
      <div className="hero-media" key={`m-${atual}`}>
        <Midia s={s} prioridade={atual === 0} />
      </div>
      <div className="hero-veil" aria-hidden="true" />
      <div className="container hero-inner">
        <div className="hero-copy" key={`c-${atual}`}>
          {s.mostrarLogo && (
            <img className="hero-logo" src={asset("/assets/img/logo-pierre-white.png")} alt="Pierre" width={256} height={160} />
          )}
          {lancamento
            ? s.subtitulo && <span className="hero-kicker">{s.subtitulo}</span>
            : s.eyebrow && <span className="hero-kicker">{s.eyebrow}</span>}
          {s.titulo && (atual === 0 ? <h1 className="hero-title">{s.titulo}</h1> : <h2 className="hero-title">{s.titulo}</h2>)}
          {!lancamento && s.subtitulo && <p className="hero-lead">{s.subtitulo}</p>}
          {!lancamento && acoes}
          {nav}
        </div>
      </div>
    </section>
  );
}

// Mídia do slide em bleed total. Vídeo só carrega no desktop (HeroVideo); a
// foto da campanha usa as variantes WebP; imagens do painel vão como vieram.
// object-position vem do CSS por data-foco.
function Midia({ s, prioridade }: { s: Banner; prioridade: boolean }) {
  if (s.tipo === "video" && s.video) {
    return <HeroVideo src={imagemSrc(s.video)} poster={s.imagem ? imagemSrc(s.imagem) : undefined} label={s.alt || s.titulo} />;
  }
  if (!s.imagem) return null;
  const campanha = s.imagem === `/assets/img/${IMAGENS.heroCampanha.nome}.jpg`;
  if (campanha) {
    const img = IMAGENS.heroCampanha;
    return (
      <picture>
        <source type="image/webp" srcSet={srcSetWebp(img)} sizes="100vw" />
        <img
          src={imagemSrc(s.imagem)}
          alt={s.alt || s.titulo}
          width={img.largura}
          height={img.altura}
          loading={prioridade ? "eager" : "lazy"}
          fetchPriority={prioridade ? "high" : undefined}
          decoding={prioridade ? "sync" : "async"}
        />
      </picture>
    );
  }
  return <img src={imagemSrc(s.imagem)} alt={s.alt || s.titulo} loading={prioridade ? "eager" : "lazy"} fetchPriority={prioridade ? "high" : undefined} />;
}

// Botão do slide: endereço externo (loja, WhatsApp) abre em nova aba; caminho
// interno usa o roteador. Os destinos já chegam resolvidos do servidor.
function Acao({ href, className, children }: { href?: string; className: string; children: React.ReactNode }) {
  const url = (href || "").trim();
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) {
    return (
      <a className={className} href={url} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link className={className} href={url}>
      {children}
    </Link>
  );
}

function Seta({ dir }: { dir: "esq" | "dir" }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true" style={dir === "esq" ? { transform: "scaleX(-1)" } : undefined}>
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
