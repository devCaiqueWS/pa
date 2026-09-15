import type { CSSProperties } from "react";
import Reveal from "@/components/ui/Reveal";
import BotaoLink from "@/components/ui/BotaoLink";
import { getSiteConfig } from "@/lib/site-config";
import { acharWhatsApp } from "@/lib/links";

export type Canal = {
  rotulo?: string;
  titulo?: string;
  texto?: string;
  botao_texto?: string;
  link?: string;
  botao_estilo?: string;
};

type Props = { titulo?: string; subtitulo?: string; canais: Canal[] };

// Canais de compra: cada cartão leva a um destino REAL. No campo de link do
// painel, a palavra "whatsapp" vira o número cadastrado em Configurações;
// endereços http abrem em nova aba; o resto navega dentro do site.
export default async function Canais({ titulo, subtitulo, canais }: Props) {
  const cfg = await getSiteConfig();
  const whats = acharWhatsApp(cfg.topStrip);

  // O destino é resolvido pelo BotaoLink; aqui só decidimos se mostramos o
  // número embaixo do botão (quando o canal é o WhatsApp da marca).
  const lista = canais
    .filter((c) => c.titulo || c.texto)
    .map((c) => ({ ...c, detalhe: /^whatsapp(:|$)/i.test((c.link || "").trim()) ? whats.label : "" }));

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
                {c.botao_texto && (
                  <p className="canal-acao">
                    <BotaoLink className={classeBotao} href={c.link}>
                      {c.botao_texto}
                    </BotaoLink>
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
