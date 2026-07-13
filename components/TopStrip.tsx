import Link from "next/link";
import type { TopStripItem } from "@/lib/site-config";
import { renderRich } from "@/components/rich-text";

export default function TopStrip({ mensagens }: { mensagens: TopStripItem[] }) {
  if (!mensagens || mensagens.length === 0) return null;
  return (
    <div className="topstrip">
      <div className="container topstrip-inner">
        {mensagens.map((m, i) => {
          const cls = i === 0 ? "" : "topstrip-extra";
          const conteudo = renderRich(m.texto);
          if (!m.link) {
            return (
              <span key={i} className={cls}>
                {conteudo}
              </span>
            );
          }
          const externo = /^https?:\/\//i.test(m.link);
          if (externo) {
            return (
              <a key={i} className={cls} href={m.link} target="_blank" rel="noopener noreferrer">
                {conteudo}
              </a>
            );
          }
          return (
            <Link key={i} className={cls} href={m.link}>
              {conteudo}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
