"use client";

import { usePathname } from "next/navigation";
import TopStrip from "@/components/TopStrip";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingBits from "@/components/FloatingBits";

// Mostra a "chrome" do site público (top strip, header, footer, WhatsApp)
// em todas as rotas, exceto no painel (/admin) e no login.
export default function ChromeGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const bare = pathname.startsWith("/admin") || pathname.startsWith("/login");

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
