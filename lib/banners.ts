// =============================================================================
// BANNERS DO CARROSSEL — lidos da tabela `site_banners` (linha única id=1, com a
// lista em JSON). Sem a tabela/linha, cai nos banners PADRÃO (exatamente os dois
// slides que antes estavam fixos no código), então a home NUNCA fica sem
// carrossel. Mesmo padrão de site_categorias / site_config / site_footer.
//
// O painel (/painel/banners) grava aqui; o site lê por getBanners().
// =============================================================================
import { query } from "@/lib/db";

// Tamanho esperado da imagem do banner — fonte única da verdade, usada tanto no
// aviso do painel quanto no preset de upload (PRESETS_IMAGEM.banner).
export const TAMANHO_BANNER = { largura: 1920, altura: 720 };

export type Banner = {
  tipo: "imagem" | "video";
  imagem: string; // fundo; quando tipo="video", é o quadro de capa (poster)
  video: string; // arquivo .mp4 quando tipo="video"
  alt: string;
  // "padrao" = selo + título + subtítulo + botões (o slide comercial clássico).
  // "lancamento" = versão centrada/sóbria usada nos teasers (ex.: Radicaline).
  estilo: "padrao" | "lancamento";
  mostrarLogo: boolean; // logo Pierre branca acima do texto
  eyebrow: string;
  titulo: string;
  subtitulo: string;
  botao1Texto: string;
  botao1Link: string;
  botao2Texto: string;
  botao2Link: string;
  ativo: boolean;
};

// Banner em branco (usado pelo editor ao adicionar um slide novo).
export function bannerVazio(): Banner {
  return {
    tipo: "imagem",
    imagem: "",
    video: "",
    alt: "",
    estilo: "padrao",
    mostrarLogo: false,
    eyebrow: "",
    titulo: "",
    subtitulo: "",
    botao1Texto: "",
    botao1Link: "",
    botao2Texto: "",
    botao2Link: "",
    ativo: true,
  };
}

// Os dois slides que o site já exibia fixos no código — viram o fallback.
export const BANNERS_PADRAO: Banner[] = [
  {
    ...bannerVazio(),
    imagem: "/assets/img/inigualavel-hero.jpg",
    alt: "Original e Inigualável — A tradição Pierre Alexander que passa de geração em geração",
    eyebrow: "Original e Inigualável",
    titulo: "A tradição que passa de geração em geração.",
    subtitulo: "O desodorante em creme que une mães, filhas e avós há décadas.",
    botao1Texto: "Conhecer o Inigualável",
    botao1Link: "/original",
    botao2Texto: "Onde comprar",
    botao2Link: "/onde-comprar",
  },
  {
    ...bannerVazio(),
    tipo: "video",
    video: "/assets/video/teaser-radicaline.mp4",
    imagem: "/assets/img/teaser-radicaline-poster.jpg",
    alt: "Radicaline — um novo cuidado facial está chegando",
    estilo: "lancamento",
    mostrarLogo: true,
    subtitulo: "Um novo cuidado facial está chegando.",
    titulo: "Em breve.",
  },
];

function texto(v: unknown): string {
  return String(v ?? "").trim();
}

function normalizar(x: unknown): Banner | null {
  if (!x || typeof x !== "object") return null;
  const o = x as Record<string, unknown>;
  const b: Banner = {
    ...bannerVazio(),
    tipo: o.tipo === "video" ? "video" : "imagem",
    imagem: texto(o.imagem),
    video: texto(o.video),
    alt: texto(o.alt),
    estilo: o.estilo === "lancamento" ? "lancamento" : "padrao",
    mostrarLogo: o.mostrarLogo === true || o.mostrarLogo === "true",
    eyebrow: texto(o.eyebrow),
    titulo: texto(o.titulo),
    subtitulo: texto(o.subtitulo),
    botao1Texto: texto(o.botao1Texto),
    botao1Link: texto(o.botao1Link),
    botao2Texto: texto(o.botao2Texto),
    botao2Link: texto(o.botao2Link),
    ativo: o.ativo !== false,
  };
  // Um slide sem nada para mostrar (nem mídia, nem título) é descartado.
  const temMidia = b.tipo === "video" ? !!b.video : !!b.imagem;
  if (!temMidia && !b.titulo) return null;
  return b;
}

// Lista bruta (inclui os desativados) — é o que o painel edita.
export async function getBannersTodos(): Promise<Banner[]> {
  try {
    const rows = await query<{ config: string | null }>(
      "SELECT config FROM site_banners WHERE id = 1"
    );
    const raw = rows[0]?.config;
    if (!raw) return BANNERS_PADRAO;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return BANNERS_PADRAO;
    const list = parsed.map(normalizar).filter((b): b is Banner => !!b);
    // Lista salva vazia é uma escolha legítima (carrossel desligado) — só caímos
    // no padrão quando a linha não existe/está ilegível, tratado acima.
    return list;
  } catch {
    return BANNERS_PADRAO;
  }
}

// O que o site exibe: apenas os slides ativos, na ordem salva.
export async function getBanners(): Promise<Banner[]> {
  return (await getBannersTodos()).filter((b) => b.ativo);
}

// Usada pela action do painel para gravar a lista já normalizada.
export function normalizarLista(raw: string): Banner[] {
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizar).filter((b): b is Banner => !!b);
  } catch {
    return [];
  }
}
