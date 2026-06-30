import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ChromeGate from "@/components/ChromeGate";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "Pierre Alexander · Beleza que funciona há décadas",
    template: "%s · Pierre Alexander",
  },
  description:
    "Pierre Alexander: perfumaria, cuidado facial, corpo, banho e casa. Charme francês, alegria brasileira.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ChromeGate>{children}</ChromeGate>
      </body>
    </html>
  );
}
