import Link from "next/link";
import { asset, BASE_PATH } from "@/lib/site";
import type { FooterData } from "@/lib/footer";
import { renderRich } from "@/components/rich-text";

// Resolve o caminho do logo: URL completa passa direto; caminho local
// ("/assets/...") ganha o basePath.
function logoSrc(url: string): string {
  if (!url) return asset("/assets/img/logo-pierre-white.png");
  if (/^https?:\/\//i.test(url) || url.startsWith(BASE_PATH)) return url;
  if (url.startsWith("/")) return asset(url);
  return url;
}

// Link do rodapé: interno usa <Link>; externo (http...) usa <a> comum.
function FLink({ link }: { link: FooterData["colunas"][number]["links"][number] }) {
  const externo = /^https?:\/\//i.test(link.href);
  if (externo) {
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer">
        {renderRich(link.label)}
      </a>
    );
  }
  return <Link href={link.href || "#"}>{renderRich(link.label)}</Link>;
}

export default function Footer({ data }: { data: FooterData }) {
  const ano = new Date().getFullYear();
  const rodape = (data.rodapeTexto || "").replace(/\{ano\}/g, String(ano));
  const cols = data.colunas ?? [];

  return (
    <footer className="ftr">
      <div
        className="container ftr-grid"
        style={{ ["--ftr-cols" as string]: cols.length } as React.CSSProperties}
      >
        <div className="ftr-brand-col">
          <img
            src={logoSrc(data.logoUrl)}
            alt="Pierre Alexander"
            className="ftr-logo"
          />
          {data.marcaTexto && <p>{renderRich(data.marcaTexto)}</p>}
          {data.sacTexto && <p className="ftr-sac">{renderRich(data.sacTexto)}</p>}
        </div>

        {cols.map((col, i) => (
          <div className="ftr-col" key={i}>
            {col.titulo && <h4>{renderRich(col.titulo)}</h4>}
            {col.links.map((l, j) => (
              <FLink key={j} link={l} />
            ))}
          </div>
        ))}
      </div>

      <div className="container ftr-bottom">
        <span>{renderRich(rodape)}</span>
        <div className="ftr-social" aria-label="Redes sociais">
          {data.social.map((s, i) => {
            const externo = /^https?:\/\//i.test(s.href);
            return (
              <a
                key={i}
                href={s.href || "#"}
                aria-label={s.label}
                {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {renderRich(s.label)}
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
