"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Atraso em passos (0-3) para escalonar itens vizinhos. */
  delay?: 0 | 1 | 2 | 3;
  id?: string;
  /** Só marca `is-in` ao entrar; o efeito fica no CSS da própria seção. */
  plain?: boolean;
  style?: CSSProperties;
};

// Revela o conteúdo (opacidade + leve subida) quando entra na tela. Uma vez só.
// Sem JavaScript ou com prefers-reduced-motion, o CSS já mostra tudo.
export default function Reveal({ children, as: Tag = "div", className = "", delay = 0, id, plain = false, style }: Props) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-in");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.classList.add("is-in");
            io.disconnect();
          }
        }
      },
      // threshold 0: dispara ao primeiro pixel dentro da faixa (um elemento
      // mais alto que a tela nunca chegaria a 12% visível).
      { rootMargin: "0px 0px -10% 0px", threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const cls = [plain ? "reveal-plain" : "reveal", delay ? `reveal-delay-${delay}` : "", className].filter(Boolean).join(" ");
  return (
    <Tag ref={ref} className={cls} id={id} style={style}>
      {children}
    </Tag>
  );
}
