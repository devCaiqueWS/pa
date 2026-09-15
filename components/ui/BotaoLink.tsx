import Link from "next/link";
import { cache } from "react";
import { getSiteConfig } from "@/lib/site-config";
import { acharWhatsApp, resolverHref } from "@/lib/links";

// Uma leitura de configuração por requisição, não uma por botão.
const configDaRequisicao = cache(getSiteConfig);

type Props = {
  /** Destino como veio do painel: URL, caminho, âncora ou "whatsapp[:mensagem]". */
  href?: string;
  className?: string;
  children: React.ReactNode;
};

// Botão/link de bloco do CMS. Resolve o destino (lib/links) e escolhe a tag:
// endereço externo abre em nova aba; caminho interno usa o roteador. Sem
// destino, NÃO vira botão — link morto ("#") não chega ao ar.
export default async function BotaoLink({ href, className, children }: Props) {
  const cfg = await configDaRequisicao();
  const { href: url, externo } = resolverHref(href, acharWhatsApp(cfg.topStrip));
  if (!url) return null;
  if (externo) {
    return (
      <a className={className} href={url} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link className={className} href={url}>
      {children}
    </Link>
  );
}
