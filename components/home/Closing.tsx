import Link from "next/link";
import { getFooter } from "@/lib/footer";
import { getSiteConfig } from "@/lib/site-config";
import { renderRich } from "@/components/rich-text";
import Reveal from "@/components/ui/Reveal";
import SplitWords from "@/components/ui/SplitWords";
import type { CSSProperties } from "react";

type Canal = { nome: string; detalhe: string; href: string; externo: boolean };

// Encerramento da home (bloco "newsletter"): em vez de um formulário sem
// backend, os canais reais da marca — WhatsApp (da faixa do topo), redes
// sociais (do rodapé) e o caminho para ser consultora. Tudo vem do painel.
export default async function Closing() {
  const [footer, cfg] = await Promise.all([getFooter(), getSiteConfig()]);

  const canais: Canal[] = [];
  const whats = cfg.topStrip.find((m) => /whatsapp|wa\.me/i.test(m.link) || /:whatsapp:/.test(m.texto));
  if (whats?.link) {
    canais.push({
      nome: "WhatsApp",
      detalhe: whats.texto.replace(/:whatsapp:/g, "").replace(/\*\*/g, "").trim(),
      href: whats.link,
      externo: true,
    });
  }
  for (const s of footer.social) {
    if (/^https?:\/\//i.test(s.href)) canais.push({ nome: s.label, detalhe: "Acompanhe a Pierre", href: s.href, externo: true });
  }
  canais.push({ nome: "Onde comprar", detalhe: "Loja oficial, WhatsApp ou consultora", href: "/onde-comprar", externo: false });
  canais.push({ nome: "Seja consultora", detalhe: "Venda Pierre e cresça com a marca", href: "/consultora", externo: false });

  return (
    <section className="close" aria-labelledby="close-titulo">
      <div className="container close-grid">
        <Reveal className="close-copy">
          <h2 id="close-titulo">
            <SplitWords texto="Fique perto da Pierre." />
          </h2>
          <p className="lead">Lançamentos, campanhas e atendimento pelos canais oficiais da marca.</p>
        </Reveal>
        <Reveal plain>
          <ul className="close-list">
            {canais.map((c, i) => (
              <li key={c.href} className="close-item" style={{ "--i": i } as CSSProperties}>
                {c.externo ? (
                  <a href={c.href} target="_blank" rel="noopener noreferrer">
                    <strong>{c.nome}</strong>
                    <span>{renderRich(c.detalhe)}</span>
                  </a>
                ) : (
                  <Link href={c.href}>
                    <strong>{c.nome}</strong>
                    <span>{c.detalhe}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
