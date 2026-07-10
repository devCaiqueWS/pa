// =============================================================================
// CONFIG DO CABEÇALHO — logo do topo, ícone (favicon) e as frases da faixa do
// topo (TopStrip). Guardado na tabela site_config (linha única id=1, JSON).
// O MENU fica na tabela própria site_menu (ver lib/menu.ts).
// Sem a linha id=1, cai no PADRAO (o cabeçalho atual).
// =============================================================================
import { query } from "@/lib/db";

export type SiteConfig = {
  headerLogoUrl: string; // caminho local (/assets/...) ou URL completa
  faviconUrl: string; // ícone da aba do navegador
  topStrip: string[]; // frases da faixa acima do cabeçalho
};

export function padraoSiteConfig(): SiteConfig {
  return {
    headerLogoUrl: "/assets/img/logo-pierre.png",
    faviconUrl: "/assets/img/logo-pierre.png",
    topStrip: [
      "Encontre uma consultora Pierre perto de você",
      "Beleza que funciona. Há décadas.",
      "Novas fragrâncias chegando — fique por dentro",
    ],
  };
}

export async function getSiteConfig(): Promise<SiteConfig> {
  const padrao = padraoSiteConfig();
  try {
    const rows = await query<{ config: string | null }>(
      "SELECT config FROM site_config WHERE id = 1"
    );
    const raw = rows[0]?.config;
    if (!raw) return padrao;
    const parsed = JSON.parse(raw) as Partial<SiteConfig>;
    return {
      headerLogoUrl: parsed.headerLogoUrl || padrao.headerLogoUrl,
      faviconUrl: parsed.faviconUrl || padrao.faviconUrl,
      topStrip:
        Array.isArray(parsed.topStrip) && parsed.topStrip.length ? parsed.topStrip : padrao.topStrip,
    };
  } catch {
    return padrao;
  }
}
