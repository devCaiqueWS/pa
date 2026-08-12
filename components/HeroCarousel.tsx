"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { asset, imagemSrc } from "@/lib/site";
import type { Banner } from "@/lib/banners";

const INTERVAL = 6000;

// Carrossel de topo da home. Os slides vêm do painel (/painel/banners) — este
// componente é só a apresentação, não sabe de onde os dados vieram.
export default function HeroCarousel({ slides }: { slides: Banner[] }) {
  const total = slides.length;
  const [current, setCurrent] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback(
    (idx: number) => {
      if (total === 0) return;
      setCurrent(((idx % total) + total) % total);
    },
    [total]
  );

  const start = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    if (total < 2) return; // um slide só não gira
    timer.current = setInterval(() => {
      setCurrent((c) => (c + 1) % total);
    }, INTERVAL);
  }, [total]);

  const stop = useCallback(() => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  }, []);

  useEffect(() => {
    start();
    return stop;
  }, [start, stop]);

  // Se o slide atual sumir (edição no painel reduziu a lista), volta pro primeiro.
  useEffect(() => {
    setCurrent((c) => (c >= total ? 0 : c));
  }, [total]);

  if (total === 0) return null;

  return (
    <section className="hero-fw">
      <div
        className="hero-fw-carousel"
        id="heroCarousel"
        aria-roledescription="carrossel"
        aria-label="Banners Pierre Alexander"
        onMouseEnter={stop}
        onMouseLeave={start}
      >
        <div className="hc-track">
          {slides.map((s, i) => (
            <figure
              key={i}
              className={`hc-slide${current === i ? " hc-slide-active" : ""}`}
              data-slide={i}
            >
              {s.tipo === "video" && s.video ? (
                <video
                  className="hc-video"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  poster={s.imagem ? imagemSrc(s.imagem) : undefined}
                >
                  <source src={imagemSrc(s.video)} type="video/mp4" />
                </video>
              ) : (
                s.imagem && (
                  <img
                    src={imagemSrc(s.imagem)}
                    alt={s.alt || s.titulo}
                    loading={i === 0 ? "eager" : "lazy"}
                  />
                )
              )}

              <figcaption
                className={`hc-caption${
                  s.estilo === "lancamento" ? " hc-caption-radicaline" : ""
                }`}
              >
                <div className="container hc-caption-container">
                  <div className="hc-caption-inner">
                    {s.mostrarLogo && (
                      <img
                        src={asset("/assets/img/logo-pierre-white.png")}
                        alt="Pierre"
                        className="rad-logo-img"
                      />
                    )}

                    {s.estilo === "lancamento" ? (
                      <>
                        {s.subtitulo && <p className="rad-tagline">{s.subtitulo}</p>}
                        {s.titulo && <h2 className="rad-title">{s.titulo}</h2>}
                      </>
                    ) : (
                      <>
                        {s.eyebrow && <div className="eyebrow">{s.eyebrow}</div>}
                        {s.titulo && (i === 0 ? <h1>{s.titulo}</h1> : <h2>{s.titulo}</h2>)}
                        {s.subtitulo && <p>{s.subtitulo}</p>}
                      </>
                    )}

                    {(s.botao1Texto || s.botao2Texto) && (
                      <div className="hero-actions">
                        {s.botao1Texto && (
                          <Link className="btn btn-carbon" href={s.botao1Link || "#"}>
                            {s.botao1Texto}
                          </Link>
                        )}
                        {s.botao2Texto && (
                          <Link className="btn btn-ghost-light" href={s.botao2Link || "#"}>
                            {s.botao2Texto}
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>

        {total > 1 && (
          <>
            <button
              className="hc-arrow hc-prev"
              aria-label="Slide anterior"
              type="button"
              onClick={() => {
                go(current - 1);
                start();
              }}
            >
              ‹
            </button>
            <button
              className="hc-arrow hc-next"
              aria-label="Próximo slide"
              type="button"
              onClick={() => {
                go(current + 1);
                start();
              }}
            >
              ›
            </button>
            <div className="hc-dots" role="tablist" aria-label="Selecionar slide">
              {slides.map((s, i) => (
                <button
                  key={i}
                  className={`hc-dot${current === i ? " hc-dot-active" : ""}`}
                  data-slide={i}
                  aria-label={s.eyebrow || s.titulo || `Slide ${i + 1}`}
                  onClick={() => {
                    go(i);
                    start();
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
