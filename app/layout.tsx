import type { Metadata } from "next";
import { Bodoni_Moda, Manrope } from "next/font/google";
import "./globals.css";
import "@/components/home/home.css";
import ChromeGate from "@/components/ChromeGate";
import { getFooter } from "@/lib/footer";
import { getSiteConfig } from "@/lib/site-config";
import { getMenu } from "@/lib/menu";
import { asset, BASE_PATH } from "@/lib/site";

// Tipografia editorial: Bodoni Moda (Didone de alto contraste, com tamanhos
// ópticos) nos títulos; Manrope na interface. Poucos pesos; font-display swap.
const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  weight: "variable",
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
  variable: "--font-bodoni",
});
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-manrope",
});

const SITE_URL = "https://www.pierrealexander.com.br";
const DESCRICAO =
  "Pierre Alexander: marca brasileira de cosméticos, perfumaria e cuidados pessoais há mais de 45 anos. Perfumaria, cuidado facial, corpo, banho e casa.";

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
    metadataBase: new URL(SITE_URL),
    title: {
      default: "Pierre Alexander · Beleza que atravessa gerações",
      template: "%s · Pierre Alexander",
    },
    description: DESCRICAO,
    icons: { icon: resolveIcon(cfg.faviconUrl) },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      siteName: "Pierre Alexander",
      title: "Pierre Alexander · Beleza que atravessa gerações",
      description: DESCRICAO,
      url: `${SITE_URL}${BASE_PATH}`,
      images: [
        {
          url: asset("/assets/img/inigualavel-hero.jpg"),
          width: 1672,
          height: 941,
          alt: "Três gerações com o desodorante em creme Pierre Alexander",
        },
      ],
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [footer, cfg, menu] = await Promise.all([getFooter(), getSiteConfig(), getMenu()]);

  // Dados estruturados apenas com o que é verdadeiro: nome, site, logo e redes
  // sociais cadastradas no painel (só URLs reais).
  const sameAs = footer.social.map((s) => s.href).filter((h) => /^https?:\/\//i.test(h));
  const organizacao = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Pierre Alexander",
    url: `${SITE_URL}${BASE_PATH}`,
    logo: `${SITE_URL}${asset("/assets/img/logo-pierre.png")}`,
    ...(sameAs.length ? { sameAs } : {}),
  };

  return (
    <html lang="pt-BR" className={`${bodoni.variable} ${manrope.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizacao) }}
        />
        <ChromeGate footer={footer} headerLogo={cfg.headerLogoUrl} menu={menu} topStrip={cfg.topStrip}>
          {children}
        </ChromeGate>
      </body>
    </html>
  );
}
