import type { CSSProperties } from "react";

type Props = { texto: string; className?: string };

// Divide um texto em palavras, cada uma num <span> com --i (posição) e --n
// (total), para o CSS escalonar entradas ou preencher palavra a palavra no
// scroll. Leitores de tela leem o texto normalmente (não há aria-hidden).
export default function SplitWords({ texto, className }: Props) {
  const palavras = texto.split(/\s+/).filter(Boolean);
  const n = palavras.length;
  return (
    <span className={["split", className].filter(Boolean).join(" ")} style={{ "--n": n } as CSSProperties}>
      {palavras.map((w, i) => (
        <span key={i}>
          <span className="split-w" style={{ "--i": i } as CSSProperties}>
            <span>{w}</span>
          </span>
          {i < n - 1 ? " " : null}
        </span>
      ))}
    </span>
  );
}
