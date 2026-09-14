"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";

type Props = { children: ReactNode; className?: string; /** inclinação máxima em graus */ max?: number };

// Inclinação que segue o ponteiro (até `max` graus em cada eixo) e um reflexo
// radial em ouro na posição do ponteiro. Só escreve variáveis CSS; o CSS
// (.tilt) aplica a transformação e desliga sem hover ou com reduced-motion.
export default function Tilt({ children, className = "", max = 6 }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--rx", `${((0.5 - y) * max * 2).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${((x - 0.5) * max * 2).toFixed(2)}deg`);
    el.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
    el.classList.add("is-tilt");
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    for (const v of ["--rx", "--ry", "--mx", "--my"]) el.style.removeProperty(v);
    el.classList.remove("is-tilt");
  };

  return (
    <div ref={ref} className={`tilt ${className}`.trim()} onPointerMove={onMove} onPointerLeave={onLeave}>
      {children}
    </div>
  );
}
