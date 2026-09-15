// =============================================================================
// DESTINO DOS BOTÕES — um lugar só para resolver para onde um botão leva.
//
// No painel, o campo de link aceita:
//   https://...                      endereço externo (abre em nova aba)
//   /consultora, #universidade       navegação dentro do site
//   whatsapp                         o número cadastrado em Configurações
//   whatsapp:Quero ser consultora    o mesmo número, com a mensagem já escrita
//
// Assim o telefone da marca vive num lugar só (a faixa do topo) e qualquer
// bloco pode mandar a pessoa para o WhatsApp sem alguém digitar URL.
// =============================================================================
import type { TopStripItem } from "@/lib/site-config";

export type Whats = { href: string; label: string; telefone: string };

export function acharWhatsApp(topStrip: TopStripItem[]): Whats {
  const item = topStrip.find((m) => /whatsapp|wa\.me/i.test(m.link) || /:whatsapp:/.test(m.texto));
  const href = item?.link || "";
  // phone=5511999999999 (api.whatsapp.com) ou wa.me/5511999999999
  const tel = /[?&]phone=(\d+)/.exec(href)?.[1] || /wa\.me\/(\d+)/.exec(href)?.[1] || "";
  return {
    href,
    // ":whatsapp: **(11) 93810-1888**" -> "(11) 93810-1888"
    label: (item?.texto || "").replace(/:whatsapp:/g, "").replace(/\*\*/g, "").trim(),
    telefone: tel,
  };
}

export type Destino = { href: string; externo: boolean; ehWhats: boolean };

export function resolverHref(bruto: string | undefined | null, whats: Whats): Destino {
  const valor = (bruto || "").trim();
  const m = /^whatsapp(?::(.*))?$/i.exec(valor);
  if (m) {
    const mensagem = (m[1] || "").trim();
    if (!whats.href) return { href: "", externo: false, ehWhats: true };
    if (!mensagem || !whats.telefone) return { href: whats.href, externo: true, ehWhats: true };
    return {
      href: `https://api.whatsapp.com/send/?phone=${whats.telefone}&text=${encodeURIComponent(mensagem)}`,
      externo: true,
      ehWhats: true,
    };
  }
  return { href: valor, externo: /^https?:\/\//i.test(valor), ehWhats: false };
}
