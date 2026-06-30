import Link from "next/link";
import { asset } from "@/lib/site";
import { categories } from "@/lib/catalog";

export default function Footer() {
  return (
    <footer className="ftr">
      <div className="container ftr-grid">
        <div className="ftr-brand-col">
          <img
            src={asset("/assets/img/logo-pierre-white.png")}
            alt="Pierre Alexander"
            className="ftr-logo"
          />
          <p>
            Marca brasileira com charme francês: perfumaria, cuidado facial, corpo,
            banho e casa. Sofisticação e confiança de geração em geração.
          </p>
          <p className="ftr-sac">Atendimento Pierre · Seg a sex, 8h às 18h</p>
        </div>

        <div className="ftr-col">
          <h4>Produtos</h4>
          {categories.map((c) => (
            <Link key={c.slug} href={`/c/${c.slug}`}>
              {c.name}
            </Link>
          ))}
        </div>

        <div className="ftr-col">
          <h4>A Marca</h4>
          <Link href="/sobre">Sobre a Pierre</Link>
          <Link href="/onde-comprar">Onde comprar</Link>
          <Link href="/sobre#sustentabilidade">Sustentabilidade</Link>
        </div>

        <div className="ftr-col">
          <h4>Consultoras</h4>
          <Link href="/consultora">Seja consultora</Link>
          <Link href="/consultora#universidade">Universidade Pierre</Link>
          <Link href="/consultora#conquistas">Conquistas</Link>
        </div>

        <div className="ftr-col">
          <h4>Atendimento</h4>
          <Link href="/onde-comprar">Fale conosco</Link>
          <Link href="/onde-comprar">Perguntas frequentes</Link>
          <Link href="/onde-comprar">WhatsApp</Link>
        </div>
      </div>

      <div className="container ftr-bottom">
        <span>Pierre Alexander · {new Date().getFullYear()}</span>
        <div className="ftr-social" aria-label="Redes sociais">
          <a href="#" aria-label="Instagram">Instagram</a>
          <a href="#" aria-label="Facebook">Facebook</a>
          <a href="#" aria-label="YouTube">YouTube</a>
        </div>
      </div>
    </footer>
  );
}
