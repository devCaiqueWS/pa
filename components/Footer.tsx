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
  return <Link href={link.href || "/"}>{renderRich(link.label)}</Link>;
}

export default function Footer({ data }: { data: FooterData }) {
  const ano = new Date().getFullYear();
  const rodape = (data.rodapeTexto || "").replace(/\{ano\}/g, String(ano));
  const cols = data.colunas ?? [];
  // Redes sociais só com URL real (um "#" não vira link).
  const social = data.social.filter((s) => s.href && s.href !== "#");

  return (
    <footer className="ftr">
      {/* Marca em grande escala, quase invisível: assinatura de fundo. */}
      <img className="ftr-mark" src={asset("/assets/img/logo-pierre-gold.png")} alt="" aria-hidden="true" width={256} height={160} />

      <div className="container ftr-top" style={{ ["--ftr-cols" as string]: cols.length } as React.CSSProperties}>
        <div className="ftr-brand-col">
          <img src={logoSrc(data.logoUrl)} alt="Pierre Alexander" className="ftr-logo" width={256} height={160} />
          {data.marcaTexto && <p>{renderRich(data.marcaTexto)}</p>}
          {data.sacTexto && <p className="ftr-sac">{renderRich(data.sacTexto)}</p>}
        </div>

        {cols.map((col, i) => (
          <nav className="ftr-col" key={i} aria-label={col.titulo || `Links ${i + 1}`}>
            {col.titulo && <h4>{renderRich(col.titulo)}</h4>}
            {col.links.map((l, j) => (
              <FLink key={j} link={l} />
            ))}
          </nav>
        ))}
      </div>

      <div className="container ftr-bottom">
        <span>{renderRich(rodape)}</span>
        {social.length > 0 && (
          <nav className="ftr-social" aria-label="Redes sociais">
            {social.map((s, i) => {
              const externo = /^https?:\/\//i.test(s.href);
              return (
                <a key={i} href={s.href} {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                  {renderRich(s.label)}
                </a>
              );
            })}
          </nav>
        )}
      </div>
    </footer>
  );
}
