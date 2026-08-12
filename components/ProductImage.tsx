"use client";

import { useState } from "react";
import { imagemSrc } from "@/lib/site";

// Imagem do produto com degradação graciosa: se a URL estiver vazia OU falhar ao
// carregar (link do Bling expirado, Cloudinary removido, URL errada), mostra o
// placeholder "Pierre" em vez do ícone de imagem quebrada. Assim o site nunca
// depende de a foto do ERP estar viva.
export default function ProductImage({ src, alt }: { src: string; alt: string }) {
  const [broken, setBroken] = useState(false);

  if (!src || broken) {
    return (
      <div className="pcard-noimg" aria-hidden="true">
        <span>Pierre</span>
      </div>
    );
  }

  return (
    <img
      src={imagemSrc(src)}
      alt={alt}
      loading="lazy"
      onError={() => setBroken(true)}
    />
  );
}
