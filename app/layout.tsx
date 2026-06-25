import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import TopStrip from "@/components/TopStrip";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingBits from "@/components/FloatingBits";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "Pierre Alexander · Layout de aprovação",
    template: "%s · Pierre Alexander",
  },
  description:
    "Protótipo de site Pierre Alexander: beleza que funciona há décadas.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <TopStrip />
        <Header />
        {children}
        <Footer />
        <FloatingBits />
      </body>
    </html>
  );
}
