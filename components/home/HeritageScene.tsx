"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// Cena controlada pelo scroll: enquanto a seção fica "presa" na tela, o
// progresso (0→1) vira a variável CSS --p, que revela a foto "presente" sobre
// a "tradição". Só transform/opacity/clip-path; nada de scroll hijacking.
// Sem JS ou com prefers-reduced-motion, as duas fotos aparecem lado a lado.
export default function HeritageScene({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [estatico, setEstatico] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setEstatico(true);
      return;
    }

    let ativo = false;
    let raf = 0;

    const medir = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
      el.style.setProperty("--p", p.toFixed(4));
    };
    const onScroll = () => {
      if (!ativo || raf) return;
      raf = requestAnimationFrame(medir);
    };

    // Só escuta o scroll enquanto a cena está perto da tela.
    const io = new IntersectionObserver(
      (entries) => {
        ativo = entries.some((e) => e.isIntersecting);
        if (ativo) medir();
      },
      { rootMargin: "20% 0px 20% 0px" }
    );
    io.observe(el);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    medir();

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className={`her-scene${estatico ? " is-static" : ""}`}>
      <div className="her-sticky">{children}</div>
    </div>
  );
}
