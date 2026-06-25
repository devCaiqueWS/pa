"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { asset } from "@/lib/site";

const INTERVAL = 6000;
const SLIDES = 2;

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback((idx: number) => {
    setCurrent(((idx % SLIDES) + SLIDES) % SLIDES);
  }, []);

  const start = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => {
      setCurrent((c) => (c + 1) % SLIDES);
    }, INTERVAL);
  }, []);

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
          {/* SLIDE 1: Original e Inigualável */}
          <figure
            className={`hc-slide${current === 0 ? " hc-slide-active" : ""}`}
            data-slide="0"
          >
            <img
              src={asset("/assets/img/inigualavel-hero.jpg")}
              alt="Original e Inigualável — A tradição Pierre Alexander que passa de geração em geração"
              loading="eager"
            />
            <figcaption className="hc-caption">
              <div className="container hc-caption-container">
                <div className="hc-caption-inner">
                  <div className="eyebrow">Original e Inigualável</div>
                  <h1>A tradição que passa de geração em geração.</h1>
                  <p>
                    O desodorante em creme que une mães, filhas e avós há
                    décadas.
                  </p>
                  <div className="hero-actions">
                    <Link className="btn btn-carbon" href="/original">
                      Conhecer o Inigualável
                    </Link>
                    <Link className="btn btn-ghost-light" href="/onde-comprar">
                      Onde comprar
                    </Link>
                  </div>
                </div>
              </div>
            </figcaption>
          </figure>

          {/* SLIDE 2: Radicaline teaser (vídeo) */}
          <figure
            className={`hc-slide${current === 1 ? " hc-slide-active" : ""}`}
            data-slide="1"
          >
            <video
              className="hc-video"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={asset("/assets/img/teaser-radicaline-poster.jpg")}
            >
              <source
                src={asset("/assets/video/teaser-radicaline.mp4")}
                type="video/mp4"
              />
            </video>
            <figcaption className="hc-caption hc-caption-radicaline">
              <div className="container hc-caption-container">
                <div className="hc-caption-inner">
                  <img
                    src={asset("/assets/img/logo-pierre-white.png")}
                    alt="Pierre"
                    className="rad-logo-img"
                  />
                  <p className="rad-tagline">
                    Um novo cuidado facial está chegando.
                  </p>
                  <h2 className="rad-title">Em breve.</h2>
                </div>
              </div>
            </figcaption>
          </figure>
        </div>

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
          {Array.from({ length: SLIDES }).map((_, i) => (
            <button
              key={i}
              className={`hc-dot${current === i ? " hc-dot-active" : ""}`}
              data-slide={i}
              aria-label={i === 0 ? "Original e Inigualável" : "Lançamento Radicaline"}
              onClick={() => {
                go(i);
                start();
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
