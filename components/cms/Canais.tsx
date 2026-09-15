import Link from "next/link";
import type { CSSProperties } from "react";
import Reveal from "@/components/ui/Reveal";
import { getSiteConfig } from "@/lib/site-config";

export type Canal = {
  rotulo?: string;
  titulo?: string;
  texto?: string;
  botao_texto?: string;
  link?: string;
  botao_estilo?: string;
};

type Props = { titulo?: string; subtitulo?: string; canais: Canal[] };

// Extrai o WhatsApp cadastrado na faixa do topo (Configurações): assim o
// número vive num lugar só. Mesma busca usada no encerramento da home.
function acharWhatsApp(topStrip: { texto: string; link: string }[]) {
  const item = topStrip.find((m) => /whatsapp|wa\.me/i.test(m.link) || /:whatsapp:/.test(m.texto));
  return {
    href: item?.link || "",
    // ":whatsapp: **(11) 93810-1888**" -> "(11) 93810-1888"
    label: (item?.texto || "").replace(/:whatsapp:/g, "").replace(/\*\*/g, "").trim(),
  };
}

// Canais de compra: cada cartão leva a um destino REAL. No campo de link do
// painel, a palavra "whatsapp" vira o número cadastrado em Configurações;
// endereços http abrem em nova aba; o resto navega dentro do site.
export default async function Canais({ titulo, subtitulo, canais }: Props) {
  const cfg = await getSiteConfig();
  const whats = acharWhatsApp(cfg.topStrip);

  const lista = canais
    .filter((c) => c.titulo || c.texto)
    .map((c) => {
      const bruto = (c.link || "").trim();
      const ehWhats = /^whatsapp$/i.test(bruto);
      const href = ehWhats ? whats.href : bruto;
      return {
        ...c,
        href,
        detalhe: ehWhats ? whats.label : "",
        externo: /^https?:\/\//i.test(href),
      };
    })
    // Sem destino não vira botão — nada de link morto ("#").
    .filter((c) => c.titulo || c.texto);

  if (lista.length === 0) return null;

  return (
    <section className="canais">
      <div className="container">
        {(titulo || subtitulo) && (
          <Reveal className="canais-head">
            {titulo && <h2>{titulo}</h2>}
            {subtitulo && <p className="lead">{subtitulo}</p>}
          </Reveal>
        )}
        <Reveal className="canais-grid" plain>
          {lista.map((c, i) => {
            const classeBotao = `btn ${c.botao_estilo === "secundario" ? "btn-outline" : "btn-primary"}`;
            return (
              <article key={i} className="canal" style={{ "--i": i } as CSSProperties}>
                {c.rotulo && <span className="canal-rotulo">{c.rotulo}</span>}
                {c.titulo && <h3>{c.titulo}</h3>}
                {c.texto && <p>{c.texto}</p>}
                {c.href && c.botao_texto && (
                  <p className="canal-acao">
                    {c.externo ? (
                      <a className={classeBotao} href={c.href} target="_blank" rel="noopener noreferrer">
                        {c.botao_texto}
                      </a>
                    ) : (
                      <Link className={classeBotao} href={c.href}>
                        {c.botao_texto}
                      </Link>
                    )}
                  </p>
                )}
                {c.detalhe && <span className="canal-detalhe">{c.detalhe}</span>}
              </article>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
