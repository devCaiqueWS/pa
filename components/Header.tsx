"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
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
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
      <path d="M20 20l-3.2-3.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

const MOBILE_QUERY = "(max-width: 1080px)";
const NAV_ID = "menu-principal";

export default function Header({
  logoUrl,
  menu,
  transparent = false,
}: {
  logoUrl: string;
  menu: MenuItem[];
  /** Começa transparente (sobre o hero) e ganha fundo após o scroll. */
  transparent?: boolean;
}) {
  const pathname = usePathname();
  const [navOpen, setNavOpen] = useState(false);
  const [openMega, setOpenMega] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);

  const close = useCallback(() => {
    setNavOpen(false);
    setOpenMega(null);
  }, []);

  // Fecha o menu ao trocar de rota.
  useEffect(() => {
    close();
  }, [pathname, close]);

  // Estado "scrolled": muda fundo/contraste depois de rolar um pouco.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Menu mobile aberto: trava o scroll do fundo, fecha com Esc, foca o 1º link.
  useEffect(() => {
    if (!navOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // O painel entra com transição (visibility): foca o 1º link logo depois.
    const foco = window.setTimeout(() => {
      navRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    }, 80);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(foco);
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [navOpen, close]);

  const isActive = (href: string) => href !== "/" && pathname.startsWith(href.split("?")[0]);

  // No mobile, o clique no item com submenu abre o submenu em vez de navegar.
  const handleMegaClick = (e: React.MouseEvent, key: string) => {
    if (window.matchMedia(MOBILE_QUERY).matches) {
      e.preventDefault();
      setOpenMega((cur) => (cur === key ? null : key));
    } else {
      close();
    }
  };

  const links = menu.filter((m) => m.tipo === "link");
  const acoes = menu.filter((m) => m.tipo === "botao" || m.tipo === "busca");
  const botao = acoes.find((a) => a.tipo === "botao");

  const cls = ["hdr", scrolled ? "is-scrolled" : "", navOpen ? "is-nav-open" : ""].filter(Boolean).join(" ");

  return (
    <header className={cls} data-transparent={transparent ? "true" : "false"}>
      <div className="container hdr-bar">
        <Link className="hdr-brand" href="/" aria-label="Pierre Alexander — início" onClick={close}>
          <img src={logoSrc(logoUrl)} alt="Pierre Alexander" width={256} height={160} />
        </Link>

        <nav
          id={NAV_ID}
          ref={navRef}
          className={`hdr-nav${navOpen ? " open" : ""}`}
          aria-label="Menu principal"
        >
          {links.map((entry, idx) => {
            const key = `${entry.label}-${idx}`;
            if (!entry.children || entry.children.length === 0) {
              return (
                <Link
                  key={key}
                  href={entry.href}
                  className={`hdr-navitem${isActive(entry.href) ? " active" : ""}`}
                  aria-current={isActive(entry.href) ? "page" : undefined}
                  onClick={close}
                >
                  {entry.label}
                </Link>
              );
            }
            const open = openMega === key;
            const panelId = `submenu-${idx}`;
            return (
              <div key={key} className={`hdr-mega${open ? " open" : ""}`}>
                <Link
                  href={entry.href}
                  className={`hdr-navitem${isActive(entry.href) ? " active" : ""}`}
                  aria-haspopup="true"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={(e) => handleMegaClick(e, key)}
                >
                  {entry.label}
                </Link>
                <div className="hdr-mega-panel" id={panelId}>
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

          {/* Rodapé do menu mobile: o CTA comercial que no desktop fica na barra. */}
          {botao && (
            <div className="hdr-nav-foot">
              <Link className="btn btn-primary" href={botao.href} onClick={close}>
                {botao.label}
              </Link>
            </div>
          )}
        </nav>

        <div className="hdr-actions">
          {acoes.map((it, idx) => {
            if (it.tipo === "busca") {
              // Busca funcional: form GET para a página de resultados.
              const alvo = `${BASE_PATH}${it.href || "/busca"}`;
              return (
                <form key={`busca-${idx}`} action={alvo} method="get" className="hdr-search" role="search">
                  <label className="sr-only" htmlFor="busca-topo">
                    {it.label || "Buscar"}
                  </label>
                  <input
                    id="busca-topo"
                    type="search"
                    name="q"
                    placeholder={it.label || "Buscar"}
                    className="hdr-search-input"
                  />
                  <button type="submit" className="hdr-icon" aria-label="Buscar">
                    <IconeLupa />
                  </button>
                </form>
              );
            }
            return (
              <Link key={`botao-${idx}`} className="btn btn-primary hdr-cta" href={it.href} onClick={close}>
                {it.label}
              </Link>
            );
          })}
          <button
            ref={toggleRef}
            className="hdr-toggle"
            aria-label={navOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={navOpen}
            aria-controls={NAV_ID}
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
