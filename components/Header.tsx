"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { asset, BASE_PATH } from "@/lib/site";
import type { MenuItem } from "@/lib/menu";

// Resolve o logo: URL completa passa direto; caminho local ganha o basePath.
function logoSrc(url: string): string {
  if (!url) return asset("/assets/img/logo-pierre.png");
  if (/^https?:\/\//i.test(url) || url.startsWith(BASE_PATH)) return url;
  if (url.startsWith("/")) return asset(url);
  return url;
}

function IconeLupa() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M20 20l-3.2-3.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function Header({
  logoUrl,
  menu,
}: {
  logoUrl: string;
  menu: MenuItem[];
}) {
  const pathname = usePathname();
  const [navOpen, setNavOpen] = useState(false);
  const [openMega, setOpenMega] = useState<string | null>(null);

  const close = () => {
    setNavOpen(false);
    setOpenMega(null);
  };

  const isActive = (href: string) => href !== "/" && pathname.startsWith(href.split("?")[0]);

  // No mobile, o clique no item com submenu abre o submenu em vez de navegar.
  const handleMegaClick = (e: React.MouseEvent, key: string) => {
    if (typeof window !== "undefined" && window.innerWidth <= 1080) {
      e.preventDefault();
      setOpenMega((cur) => (cur === key ? null : key));
    } else {
      close();
    }
  };

  const links = menu.filter((m) => m.tipo === "link");
  const acoes = menu.filter((m) => m.tipo === "botao" || m.tipo === "busca");

  return (
    <header className="hdr">
      <div className="container hdr-bar">
        <Link className="hdr-brand" href="/" aria-label="Pierre Alexander" onClick={close}>
          <img src={logoSrc(logoUrl)} alt="Pierre Alexander" />
        </Link>

        <nav className={`hdr-nav${navOpen ? " open" : ""}`} aria-label="Menu">
          {links.map((entry, idx) => {
            const key = `${entry.label}-${idx}`;
            if (!entry.children || entry.children.length === 0) {
              return (
                <Link
                  key={key}
                  href={entry.href}
                  className={`hdr-navitem${isActive(entry.href) ? " active" : ""}`}
                  onClick={close}
                >
                  {entry.label}
                </Link>
              );
            }
            const open = openMega === key;
            return (
              <div key={key} className={`hdr-mega${open ? " open" : ""}`}>
                <Link
                  href={entry.href}
                  className={`hdr-navitem${isActive(entry.href) ? " active" : ""}`}
                  aria-haspopup="true"
                  onClick={(e) => handleMegaClick(e, key)}
                >
                  {entry.label}
                </Link>
                <div className="hdr-mega-panel">
                  <div className="hdr-mega-cols">
                    {entry.children.map((col, j) => (
                      <Link key={`${col.href}-${j}`} href={col.href} onClick={close}>
                        {col.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

        <div className="hdr-actions">
          {acoes.map((it, idx) => {
            if (it.tipo === "busca") {
              // Busca funcional: form GET para a página de resultados.
              const alvo = `${BASE_PATH}${it.href || "/busca"}`;
              return (
                <form key={`busca-${idx}`} action={alvo} method="get" className="hdr-search" role="search">
                  <input type="search" name="q" placeholder={it.label || "Buscar"} aria-label="Buscar" className="hdr-search-input" />
                  <button type="submit" className="hdr-icon" aria-label="Buscar">
                    <IconeLupa />
                  </button>
                </form>
              );
            }
            // Botão destacado (CTA).
            return (
              <Link key={`botao-${idx}`} className="btn btn-primary hdr-cta" href={it.href} onClick={close}>
                {it.label}
              </Link>
            );
          })}
          <button
            className="hdr-toggle"
            aria-label="Abrir menu"
            aria-expanded={navOpen}
            type="button"
            onClick={() => setNavOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
