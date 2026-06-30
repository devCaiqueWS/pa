"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navEntries } from "@/lib/nav";
import { asset } from "@/lib/site";

export default function Header() {
  const pathname = usePathname();
  const [navOpen, setNavOpen] = useState(false);
  const [openMega, setOpenMega] = useState<string | null>(null);

  const close = () => {
    setNavOpen(false);
    setOpenMega(null);
  };

  const isActive = (href: string) =>
    href !== "/" && pathname.startsWith(href.split("?")[0]);

  // No mobile, o clique no item de categoria abre o megamenu em vez de navegar.
  const handleMegaClick = (e: React.MouseEvent, key: string) => {
    if (typeof window !== "undefined" && window.innerWidth <= 1080) {
      e.preventDefault();
      setOpenMega((cur) => (cur === key ? null : key));
    } else {
      close();
    }
  };

  return (
    <header className="hdr">
      <div className="container hdr-bar">
        <Link className="hdr-brand" href="/" aria-label="Pierre Alexander" onClick={close}>
          <img src={asset("/assets/img/logo-pierre.png")} alt="Pierre Alexander" />
        </Link>

        <nav className={`hdr-nav${navOpen ? " open" : ""}`} aria-label="Categorias">
          {navEntries.map((entry) => {
            if (entry.type === "link") {
              return (
                <Link
                  key={entry.key}
                  href={entry.href}
                  className={`hdr-navitem${isActive(entry.href) ? " active" : ""}`}
                  onClick={close}
                >
                  {entry.label}
                </Link>
              );
            }
            const open = openMega === entry.key;
            return (
              <div key={entry.key} className={`hdr-mega${open ? " open" : ""}`}>
                <Link
                  href={entry.href}
                  className={`hdr-navitem${isActive(entry.href) ? " active" : ""}`}
                  aria-haspopup="true"
                  onClick={(e) => handleMegaClick(e, entry.key)}
                >
                  {entry.label}
                </Link>
                <div className="hdr-mega-panel">
                  <div className="hdr-mega-cols">
                    {entry.columns.map((col) => (
                      <Link key={col.href} href={col.href} onClick={close}>
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
          <button className="hdr-icon" aria-label="Buscar" type="button">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="M20 20l-3.2-3.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <Link className="btn btn-primary hdr-cta" href="/consultora" onClick={close}>
            Seja consultora
          </Link>
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
