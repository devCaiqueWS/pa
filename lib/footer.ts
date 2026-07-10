// =============================================================================
// RODAPÉ CONFIGURÁVEL — dados do rodapé lidos do banco (tabela site_footer,
// linha única id=1, com a config em JSON). Se a tabela/linha ainda não existir,
// cai no PADRAO abaixo (o rodapé atual), então o site nunca fica sem rodapé.
// =============================================================================
import { query } from "@/lib/db";
import { categories } from "@/lib/catalog";

export type FooterLink = { label: string; href: string };
export type FooterColumn = { titulo: string; links: FooterLink[] };
export type FooterData = {
  logoUrl: string; // caminho local (/assets/...) ou URL completa
  marcaTexto: string;
  sacTexto: string;
  colunas: FooterColumn[];
  rodapeTexto: string; // aceita o token {ano}, trocado pelo ano atual
  social: FooterLink[]; // label = nome da rede, href = URL
};

// Rodapé padrão = exatamente o rodapé fixo de antes (fallback e valor inicial
// que o editor mostra até você salvar a primeira vez).
export const PADRAO: FooterData = {
  logoUrl: "/assets/img/logo-pierre-white.png",
  marcaTexto:
    "Marca brasileira com charme francês: perfumaria, cuidado facial, corpo, banho e casa. Sofisticação e confiança de geração em geração.",
  sacTexto: "Atendimento Pierre · Seg a sex, 8h às 18h",
  colunas: [
    { titulo: "Produtos", links: categories.map((c) => ({ label: c.name, href: `/c/${c.slug}` })) },
    {
      titulo: "A Marca",
      links: [
        { label: "Sobre a Pierre", href: "/sobre" },
        { label: "Onde comprar", href: "/onde-comprar" },
        { label: "Sustentabilidade", href: "/sobre#sustentabilidade" },
      ],
    },
    {
      titulo: "Consultoras",
      links: [
        { label: "Seja consultora", href: "/consultora" },
        { label: "Universidade Pierre", href: "/consultora#universidade" },
        { label: "Conquistas", href: "/consultora#conquistas" },
      ],
    },
    {
      titulo: "Atendimento",
      links: [
        { label: "Fale conosco", href: "/onde-comprar" },
        { label: "Perguntas frequentes", href: "/onde-comprar" },
        { label: "WhatsApp", href: "/onde-comprar" },
      ],
    },
  ],
  rodapeTexto: "Pierre Alexander · {ano}",
  social: [
    { label: "Instagram", href: "#" },
    { label: "Facebook", href: "#" },
    { label: "YouTube", href: "#" },
  ],
};

export async function getFooter(): Promise<FooterData> {
  try {
    const rows = await query<{ config: string | null }>(
      "SELECT config FROM site_footer WHERE id = 1"
    );
    const raw = rows[0]?.config;
    if (!raw) return PADRAO;
    const parsed = JSON.parse(raw) as Partial<FooterData>;
    // Mescla com o padrão para tolerar configs incompletas.
    return {
      logoUrl: parsed.logoUrl || PADRAO.logoUrl,
      marcaTexto: parsed.marcaTexto ?? PADRAO.marcaTexto,
      sacTexto: parsed.sacTexto ?? PADRAO.sacTexto,
      colunas: Array.isArray(parsed.colunas) ? parsed.colunas : PADRAO.colunas,
      rodapeTexto: parsed.rodapeTexto ?? PADRAO.rodapeTexto,
      social: Array.isArray(parsed.social) ? parsed.social : PADRAO.social,
    };
  } catch {
    return PADRAO;
  }
}
