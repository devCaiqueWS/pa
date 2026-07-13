// =============================================================================
// CONFIG DO CABEÇALHO — logo do topo, ícone (favicon) e as frases da faixa do
// topo (TopStrip), cada uma com link opcional. Guardado na tabela site_config
// (linha única id=1, JSON). O MENU fica na tabela própria site_menu.
// Sem a linha id=1, cai no PADRAO (o cabeçalho atual).
// =============================================================================
import { query } from "@/lib/db";

export type TopStripItem = { texto: string; link: string };
export type SiteConfig = {
  headerLogoUrl: string; // caminho local (/assets/...) ou URL completa
  faviconUrl: string; // ícone da aba do navegador
  topStrip: TopStripItem[]; // frases da faixa acima do cabeçalho (link opcional)
};

export function padraoSiteConfig(): SiteConfig {
  return {
    headerLogoUrl: "/assets/img/logo-pierre.png",
    faviconUrl: "/assets/img/logo-pierre.png",
    topStrip: [
      { texto: "Encontre uma consultora Pierre perto de você", link: "" },
      { texto: "Beleza que funciona. Há décadas.", link: "" },
      { texto: "Novas fragrâncias chegando — fique por dentro", link: "" },
    ],
  };
}

// Normaliza a faixa do topo: aceita formato novo ({texto,link}) e o antigo
// (lista de strings), pra não quebrar configs já salvas.
function normTopStrip(arr: unknown, padrao: TopStripItem[]): TopStripItem[] {
  if (!Array.isArray(arr)) return padrao;
  const items = arr
    .map((x): TopStripItem | null => {
      if (typeof x === "string") return { texto: x, link: "" };
      if (x && typeof x === "object") {
        const o = x as Record<string, unknown>;
        return { texto: String(o.texto ?? ""), link: String(o.link ?? "") };
      }
      return null;
    })
    .filter((x): x is TopStripItem => !!x && !!x.texto);
  return items.length ? items : padrao;
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
      topStrip: normTopStrip(parsed.topStrip, padrao.topStrip),
    };
  } catch {
    return padrao;
  }
}
