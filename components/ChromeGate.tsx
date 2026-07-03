"use client";

import { usePathname } from "next/navigation";
import TopStrip from "@/components/TopStrip";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingBits from "@/components/FloatingBits";

// Mostra a "chrome" do site público (top strip, header, footer, WhatsApp)
// em todas as rotas, exceto nas áreas internas (painel, login, recuperação de
// senha) — que têm layout próprio.
const BARE_PREFIXES = [
  "/painel",
  "/admin",
  "/login",
  "/recuperar-senha",
  "/redefinir-senha",
  "/sem-acesso",
];

export default function ChromeGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const bare = BARE_PREFIXES.some((p) => pathname.startsWith(p));

  if (bare) return <>{children}</>;

  return (
    <>
      <TopStrip />
      <Header />
      {children}
      <Footer />
      <FloatingBits />
    </>
  );
}
