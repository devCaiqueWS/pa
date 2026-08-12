"use client";

import { useState } from "react";
import Link from "next/link";
import type { Category } from "@/lib/catalog";
import type { ProdutoAdmin } from "@/lib/produtos";
import ImagemCampo from "@/components/painel/ImagemCampo";
import { salvarProdutoCuradoriaAction } from "../actions";

const label: React.CSSProperties = { display: "block", fontWeight: 600, marginBottom: 4, fontSize: 13 };
const input: React.CSSProperties = { width: "100%", padding: 8, border: "1px solid #ddd", borderRadius: 6, fontFamily: "inherit", fontSize: 14 };
const card: React.CSSProperties = { background: "#fff", border: "1px solid #eee", borderRadius: 10, padding: "1.25rem", marginBottom: "1rem" };

function precoBR(n?: number) {
  return n == null ? "—" : n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function ProdutoForm({ produto, categorias }: { produto: ProdutoAdmin; categorias: Category[] }) {
  const [categoria, setCategoria] = useState(produto.categorySlug);
  const subs = categorias.find((c) => c.slug === categoria)?.subcategories ?? [];

  return (
    <form action={salvarProdutoCuradoriaAction}>
      <input type="hidden" name="bling_id" value={produto.blingId} />

      {/* Dados do ERP (só leitura) */}
      <div style={{ ...card, background: "#faf9f7" }}>
        <div style={{ fontSize: 12, color: "#999", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>Do ERP (Bling) — não editável aqui</div>
        <div style={{ fontSize: 18, fontWeight: 600 }}>{produto.name}</div>
        <div style={{ fontSize: 14, color: "#555", marginTop: 4 }}>
          {precoBR(produto.preco)} · categoria ERP: <strong>{produto.categoriaErp || "—"}</strong> · código: {produto.codigo || "—"}
        </div>
        {produto.shortDesc && <p style={{ fontSize: 13, color: "#777", margin: "8px 0 0" }}>{produto.shortDesc}</p>}
      </div>

      {/* Curadoria do site */}
      <div style={card}>
        <h2 style={{ margin: "0 0 1rem", fontSize: 16 }}>Curadoria do site</h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".75rem", marginBottom: ".75rem" }}>
          <div>
            <label style={label}>Categoria de vitrine</label>
            <select name="categoria_slug" value={categoria} onChange={(e) => setCategoria(e.target.value)} style={input}>
              <option value="">— sem categoria (não aparece em /c/…) —</option>
              {categorias.map((c) => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={label}>Subcategoria</label>
            <select name="subcategoria_slug" defaultValue={produto.subcategorySlug ?? ""} key={categoria} style={input}>
              <option value="">(nenhuma)</option>
              {subs.map((s) => (
                <option key={s.slug} value={s.slug}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ marginBottom: ".75rem" }}>
          <ImagemCampo name="imagem" label="Foto do produto" defaultValue={produto.image} preset="produto" formato="square" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".75rem", marginBottom: ".75rem" }}>
          <div>
            <label style={label}>Endereço (slug)</label>
            <input name="slug" defaultValue={produto.slug} style={input} />
            <p style={{ margin: "3px 0 0", fontSize: 12, color: "#999" }}>Fica em /p/{produto.slug || "…"}.</p>
          </div>
          <div>
            <label style={label}>Ordem</label>
            <input name="ordem" type="number" defaultValue={0} style={input} />
          </div>
        </div>

        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", fontSize: 14 }}>
          <label style={{ display: "flex", gap: 6, alignItems: "center", cursor: "pointer" }}>
            <input type="checkbox" name="visivel" defaultChecked={produto.visivel} /> Visível no site
          </label>
          <label style={{ display: "flex", gap: 6, alignItems: "center", cursor: "pointer" }}>
            <input type="checkbox" name="destaque" defaultChecked={produto.featured} /> Destaque (mais vendidos)
          </label>
          <label style={{ display: "flex", gap: 6, alignItems: "center", cursor: "pointer" }}>
            <input type="checkbox" name="novo" defaultChecked={produto.isNew} /> Novidade
          </label>
        </div>
      </div>

      <div style={{ display: "flex", gap: ".5rem", justifyContent: "flex-end" }}>
        <Link className="btn" href="/painel/produtos">Voltar</Link>
        <button className="btn btn-primary" type="submit">Salvar produto</button>
      </div>
    </form>
  );
}
