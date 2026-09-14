"use client";

import { Children, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useScrollProgress, PRESO } from "@/components/ui/ScrollProgress";

// Anel 3D: os cards ficam num cilindro (rotateY(i·360/n) translateZ(R)) e o
// palco gira com o scroll (--p, escrito por useScrollProgress no próprio
// elemento). O card mais de frente recebe data-frente para crescer e ganhar o
// reflexo. Celular e reduced-motion: trilho com snap (só CSS).
export default function ProductRing({ children, cabecalho }: { children: ReactNode; cabecalho?: ReactNode }) {
  const itens = Children.toArray(children);
  const n = itens.length;
  const ref = useRef<HTMLDivElement | null>(null);
  const [frente, setFrente] = useState(0);
  // A cada medição do progresso, escolhe o card da frente (só re-renderiza quando muda).
  useScrollProgress(ref, PRESO, (p) => setFrente(Math.min(n - 1, Math.max(0, Math.round(p * (n - 1))))));

  return (
    <div ref={ref} className="ring" style={{ "--n": n } as CSSProperties}>
      <div className="ring-sticky">
        {cabecalho && <div className="ring-head">{cabecalho}</div>}
        <div className="ring-stage">
          {itens.map((child, i) => (
            <div key={i} className="ring-card" data-frente={i === frente ? "true" : undefined} style={{ "--i": i } as CSSProperties}>
              {child}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
