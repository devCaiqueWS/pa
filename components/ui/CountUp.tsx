"use client";

import { useEffect, useRef } from "react";

type Props = { ate: number; duracao?: number; className?: string };

// Conta de 0 até `ate` quando o número entra na tela (uma vez). Sem JS ou com
// prefers-reduced-motion, o valor final já está no HTML.
export default function CountUp({ ate, duracao = 1600, className }: Props) {
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const animar = () => {
      const t0 = performance.now();
      const passo = (agora: number) => {
        const t = Math.min(1, (agora - t0) / duracao);
        const e = 1 - Math.pow(1 - t, 4); // ease-out forte: acelera no início, assenta no fim
        el.textContent = String(Math.round(e * ate));
        if (t < 1) raf = requestAnimationFrame(passo);
      };
      el.textContent = "0";
      raf = requestAnimationFrame(passo);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          animar();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ate, duracao]);

  return (
    <span ref={ref} className={className}>
      {ate}
    </span>
  );
}
