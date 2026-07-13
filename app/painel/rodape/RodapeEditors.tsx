"use client";

import { useState } from "react";
import type { OpcaoLink } from "@/lib/menu";
import type { FooterColumn, FooterLink } from "@/lib/footer";
import LinksEditor, { type LinkRow } from "@/components/painel/LinksEditor";

const MAX_COLUNAS = 6;

const labelStyle: React.CSSProperties = { display: "block", fontWeight: 600, marginBottom: 4, fontSize: 13 };
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: 8,
  border: "1px solid #ddd",
  borderRadius: 6,
  fontFamily: "inherit",
  fontSize: 14,
};

function comIds(links: FooterLink[]): LinkRow[] {
  return links.map((l, i) => ({ id: i + 1, label: l.label, href: l.href }));
}
function semIds(rows: LinkRow[]): FooterLink[] {
  return rows.map((r) => ({ label: r.label, href: r.href }));
}

// -------- Colunas de links --------
type Col = { id: number; titulo: string; links: LinkRow[] };

export function ColunasEditor({ initial, opcoes }: { initial: FooterColumn[]; opcoes: OpcaoLink[] }) {
  const base = initial.length ? initial : [{ titulo: "", links: [] }];
  const [cols, setCols] = useState<Col[]>(() =>
    base.map((c, i) => ({ id: i + 1, titulo: c.titulo, links: comIds(c.links) }))
  );

  const jsonValue = JSON.stringify(cols.map((c) => ({ titulo: c.titulo, links: semIds(c.links) })));

  const proximoId = () => cols.reduce((m, c) => Math.max(m, c.id), 0) + 1;
  const addCol = () => setCols((p) => (p.length >= MAX_COLUNAS ? p : [...p, { id: proximoId(), titulo: "", links: [] }]));
  const removeCol = (id: number) => setCols((p) => p.filter((c) => c.id !== id));
  const setTitulo = (id: number, v: string) => setCols((p) => p.map((c) => (c.id === id ? { ...c, titulo: v } : c)));
  const setLinks = (id: number, updater: (prev: LinkRow[]) => LinkRow[]) =>
    setCols((p) => p.map((c) => (c.id === id ? { ...c, links: updater(c.links) } : c)));

  return (
    <div>
      <input type="hidden" name="colunas_json" value={jsonValue} readOnly />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
        {cols.map((col, i) => (
          <fieldset key={col.id} style={{ border: "1px solid #eee", borderRadius: 8, padding: ".75rem" }}>
            <legend style={{ fontSize: 13, fontWeight: 700, color: "#555", padding: "0 .4rem" }}>Coluna {i + 1}</legend>
            <div style={{ display: "flex", gap: 6, alignItems: "flex-end", marginBottom: ".6rem" }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Título</label>
                <input style={inputStyle} value={col.titulo} placeholder="Ex.: Produtos" onChange={(e) => setTitulo(col.id, e.target.value)} />
              </div>
              <button
                type="button"
                onClick={() => removeCol(col.id)}
                title="Remover coluna"
                style={{ border: "1px solid #eee", background: "#fff", borderRadius: 6, cursor: "pointer", color: "#b00020", fontSize: 12, padding: "8px 10px" }}
              >
                Remover coluna
              </button>
            </div>
            <label style={labelStyle}>Links</label>
            <LinksEditor rows={col.links} setRows={(u) => setLinks(col.id, u)} opcoes={opcoes} />
          </fieldset>
        ))}
      </div>

      {cols.length < MAX_COLUNAS && (
        <button
          type="button"
          onClick={addCol}
          style={{ marginTop: ".75rem", border: "1px dashed #ccc", background: "#fff", borderRadius: 8, padding: "8px 14px", cursor: "pointer", fontSize: 13, color: "#555" }}
        >
          + Adicionar coluna
        </button>
      )}
    </div>
  );
}

// -------- Redes sociais --------
export function SociaisEditor({ initial, opcoes }: { initial: FooterLink[]; opcoes: OpcaoLink[] }) {
  const base = initial.length ? initial : [{ label: "", href: "" }];
  const [rows, setRows] = useState<LinkRow[]>(() => comIds(base));
  const jsonValue = JSON.stringify(semIds(rows));

  return (
    <div>
      <input type="hidden" name="social_json" value={jsonValue} readOnly />
      <LinksEditor rows={rows} setRows={setRows} opcoes={opcoes} rotuloLabel="Nome da rede" rotuloPlaceholder="Ex.: Instagram" />
    </div>
  );
}
