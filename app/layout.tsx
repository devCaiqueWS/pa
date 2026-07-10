import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ChromeGate from "@/components/ChromeGate";
import { getFooter } from "@/lib/footer";
import { getSiteConfig } from "@/lib/site-config";
import { getMenu } from "@/lib/menu";
import { asset, BASE_PATH } from "@/lib/site";

const inter = Inter({ subsets: ["latin"], display: "swap" });

// Resolve caminho local (/assets/...) ou URL completa para o favicon.
function resolveIcon(url: string): string {
  if (!url) return asset("/assets/img/logo-pierre.png");
  if (/^https?:\/\//i.test(url) || url.startsWith(BASE_PATH)) return url;
  if (url.startsWith("/")) return asset(url);
  return url;
}

export async function generateMetadata(): Promise<Metadata> {
  const cfg = await getSiteConfig();
  return {
    title: {
      default: "Pierre Alexander · Beleza que funciona há décadas",
      template: "%s · Pierre Alexander",
    },
    description:
      "Pierre Alexander: perfumaria, cuidado facial, corpo, banho e casa. Charme francês, alegria brasileira.",
    icons: { icon: resolveIcon(cfg.faviconUrl) },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [footer, cfg, menu] = await Promise.all([getFooter(), getSiteConfig(), getMenu()]);
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ChromeGate
          footer={footer}
          headerLogo={cfg.headerLogoUrl}
          menu={menu}
          topStrip={cfg.topStrip}
        >
          {children}
        </ChromeGate>
      </body>
    </html>
  );
}
