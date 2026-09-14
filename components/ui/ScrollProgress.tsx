"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode, type RefObject } from "react";

// Faixa da tela usada para medir o progresso, em frações da altura da janela:
// p = 0 quando o topo do elemento está em `inicio` × altura da janela;
// p = 1 quando a base do elemento chega em `fim` × altura da janela.
export type Faixa = { inicio: number; fim: number };

/** Do topo entrando por baixo até a base sair por cima (viagem completa). */
export const VIAGEM: Faixa = { inicio: 1, fim: 0 };
/** Do elemento colado no topo até ele sair da tela (saída). */
export const SAIDA: Faixa = { inicio: 0, fim: 0 };
/** Faixa de leitura: entra a 85% da tela e termina quando a base passa de 35%. */
export const LEITURA: Faixa = { inicio: 0.85, fim: 0.35 };
/** Seção presa (sticky): 0 com o topo colado no topo da tela, 1 com a base colada na base. */
export const PRESO: Faixa = { inicio: 0, fim: 1 };

// Escreve --p (0→1) no elemento conforme ele atravessa a faixa. Só escuta o
// scroll enquanto o elemento está perto da tela; mede em requestAnimationFrame.
// Com prefers-reduced-motion não faz nada (o CSS já trata --p ausente como 0
// e/ou desliga o efeito).
// `onChange` (opcional) recebe o mesmo p a cada medição — útil quando um
// componente precisa reagir em JS (ex.: escolher o card da frente no anel).
export function useScrollProgress(ref: RefObject<HTMLElement | null>, faixa: Faixa = VIAGEM, onChange?: (p: number) => void) {
  const { inicio, fim } = faixa;
  const cb = useRef(onChange);
  cb.current = onChange;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ativo = false;
    let raf = 0;

    const medir = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = r.height + (inicio - fim) * vh;
      const andado = inicio * vh - r.top;
      const p = total > 0 ? Math.min(1, Math.max(0, andado / total)) : 0;
      el.style.setProperty("--p", p.toFixed(4));
      cb.current?.(p);
    };
    const onScroll = () => {
      if (!ativo || raf) return;
      raf = requestAnimationFrame(medir);
    };

    const io = new IntersectionObserver(
      (entries) => {
        ativo = entries.some((e) => e.isIntersecting);
        if (ativo) medir();
      },
      { rootMargin: "25% 0px 25% 0px" }
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
  }, [ref, inicio, fim]);
}

type Props = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  faixa?: Faixa;
  style?: CSSProperties;
  id?: string;
};

// Versão em componente: envolve o conteúdo e expõe --p para o CSS dos filhos.
export default function ScrollProgress({ children, as: Tag = "div", className, faixa = VIAGEM, style, id }: Props) {
  const ref = useRef<HTMLElement | null>(null);
  useScrollProgress(ref, faixa);
  return (
    <Tag ref={ref} className={className} style={style} id={id}>
      {children}
    </Tag>
  );
}
