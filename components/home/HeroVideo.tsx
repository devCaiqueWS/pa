"use client";

import { useEffect, useRef } from "react";

type Props = { src: string; poster?: string; label: string };

// Vídeo do hero: nasce só com o poster (preload="none", sem <source>). No
// desktop, depois do primeiro paint, anexa a fonte e dá play. Celular e
// prefers-reduced-motion ficam com o poster (o mp4 da marca tem 15 MB).
export default function HeroVideo({ src, poster, label }: Props) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const desktop = window.matchMedia("(min-width: 900px)").matches;
    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!desktop || reduzido) return;
    const t = window.setTimeout(() => {
      const source = document.createElement("source");
      source.src = src;
      source.type = "video/mp4";
      v.appendChild(source);
      v.load();
      v.play().catch(() => {});
    }, 400);
    return () => window.clearTimeout(t);
  }, [src]);

  return <video ref={ref} muted loop playsInline preload="none" poster={poster} aria-label={label} />;
}
