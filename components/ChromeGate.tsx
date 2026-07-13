"use client";

import { usePathname } from "next/navigation";
import TopStrip from "@/components/TopStrip";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingBits from "@/components/FloatingBits";
import type { FooterData } from "@/lib/footer";
import type { MenuItem } from "@/lib/menu";
import type { TopStripItem } from "@/lib/site-config";

// Mostra a "chrome" do site público (top strip, header, footer, WhatsApp)
// em todas as rotas, exceto nas áreas internas (painel, login, recuperação de
// senha) — que têm layout próprio.
const BARE_PREFIXES = [
  "/painel",
  "/login",
  "/recuperar-senha",
  "/redefinir-senha",
  "/sem-acesso",
];

export default function ChromeGate({
  children,
  footer,
  headerLogo,
  menu,
  topStrip,
}: {
  children: React.ReactNode;
  footer: FooterData;
  headerLogo: string;
  menu: MenuItem[];
  topStrip: TopStripItem[];
}) {
  const pathname = usePathname();
  const bare = BARE_PREFIXES.some((p) => pathname.startsWith(p));

  if (bare) return <>{children}</>;

  return (
    <>
      <TopStrip mensagens={topStrip} />
      <Header logoUrl={headerLogo} menu={menu} />
      {children}
      <Footer data={footer} />
      <FloatingBits />
    </>
  );
}
