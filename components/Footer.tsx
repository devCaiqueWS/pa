import Link from "next/link";
import { asset } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="brand brand-footer">
            <img
              src={asset("/assets/img/logo-pierre-white.png")}
              alt="Pierre Alexander"
              className="brand-logo"
            />
          </div>
          <p>
            Marca brasileira com charme francês, sofisticação, confiança de
            geração em geração e produtos para corpo, rosto, banho, fragrâncias e
            casa.
            <br />
            Atendimento Pierre · Segunda a sexta, 8h às 18h.
          </p>
        </div>
        <div>
          <h4>Comprar</h4>
          <Link href="/original">O Original</Link>
          <Link href="/produtos">Produtos</Link>
          <Link href="/fragrancias">Fragrâncias</Link>
          <Link href="/tratamentos">Cuidado Facial</Link>
        </div>
        <div>
          <h4>Marca</h4>
          <Link href="/sobre">Sobre</Link>
          <Link href="/onde-comprar">Onde comprar</Link>
        </div>
        <div>
          <h4>Consultoras</h4>
          <Link href="/consultora">Seja consultora</Link>
          <Link href="/consultora#universidade">Universidade Pierre</Link>
          <Link href="/consultora#conquistas">Conquistas</Link>
          <Link href="/consultora#lead-consultora">Cadastro</Link>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>
          Protótipo visual para aprovação. Textos, preços e integrações ainda
          entram na próxima etapa.
        </span>
        <span>Pierre Alexander · 2026</span>
      </div>
    </footer>
  );
}
