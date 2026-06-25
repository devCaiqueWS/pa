"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navEntries, activeKeyByPath } from "@/lib/nav";
import { asset } from "@/lib/site";

export default function Header() {
  const pathname = usePathname();
  const [navOpen, setNavOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const activeKey = activeKeyByPath[pathname] ?? "";

  const close = () => {
    setNavOpen(false);
    setOpenDropdown(null);
  };

  // No mobile (<=1060px) o clique no gatilho do dropdown alterna o submenu
  // em vez de navegar; no desktop o hover (CSS) cuida da abertura.
  const handleTriggerClick = (
    e: React.MouseEvent,
    entry: { key: string; href: string },
  ) => {
    const isMobile =
      typeof window !== "undefined" && window.innerWidth <= 1060;
    if (isMobile) {
      e.preventDefault();
      setOpenDropdown((cur) => (cur === entry.key ? null : entry.key));
    } else if (entry.href === "#") {
      e.preventDefault();
    } else {
      close();
    }
  };

  return (
    <header className="header">
      <div className="container navbar">
        <Link className="brand" href="/" aria-label="Pierre Alexander" onClick={close}>
          <img
            src={asset("/assets/img/logo-pierre.png")}
            alt="Pierre Alexander"
            className="brand-logo"
          />
        </Link>
        <nav className={`navlinks${navOpen ? " open" : ""}`}>
          {navEntries.map((entry) => {
            if (entry.type === "link") {
              return (
                <Link
                  key={entry.key}
                  className={activeKey === entry.key ? "active" : ""}
                  href={entry.href}
                  onClick={close}
                >
                  {entry.label}
                </Link>
              );
            }
            const isActive = activeKey === entry.key;
            const isOpen = openDropdown === entry.key;
            return (
              <div
                key={entry.key}
                className={`dropdown${isOpen ? " open" : ""}`}
              >
                <Link
                  href={entry.href}
                  className={`dropdown-trigger ${isActive ? "active" : ""}`}
                  aria-haspopup="true"
                  onClick={(e) => handleTriggerClick(e, entry)}
                >
                  {entry.label} <span className="dd-caret">▾</span>
                </Link>
                <div className="dropdown-menu">
                  {entry.items.map((item) => (
                    <Link key={item.href} href={item.href} onClick={close}>
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>
        <div className="actions">
          <Link className="btn btn-ghost" href="/onde-comprar" onClick={close}>
            Comprar
          </Link>
          <Link className="btn btn-primary" href="/consultora" onClick={close}>
            Quero ser consultora
          </Link>
          <button
            className="menu-toggle"
            aria-label="abrir menu"
            aria-expanded={navOpen}
            onClick={() => setNavOpen((v) => !v)}
          >
            ☰
          </button>
        </div>
      </div>
    </header>
  );
}
