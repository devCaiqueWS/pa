"use client";

import { useRef, useState } from "react";
import type { TopStripItem } from "@/lib/site-config";

type Linha = { id: number; texto: string; link: string };

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: 8,
  border: "1px solid #ddd",
  borderRadius: 6,
  fontFamily: "inherit",
  fontSize: 14,
};
const labelStyle: React.CSSProperties = { fontWeight: 600, fontSize: 13 };

export default function FaixaTopoEditor({ initial }: { initial: TopStripItem[] }) {
  const base = initial.length ? initial : [{ texto: "", link: "" }];
  const [linhas, setLinhas] = useState<Linha[]>(() =>
    base.map((t, i) => ({ id: i + 1, texto: t.texto, link: t.link }))
  );
  const nextId = useRef(base.length + 1);
  const dragId = useRef<number | null>(null);
  const [draggingId, setDraggingId] = useState<number | null>(null);

  function liveMove(fromId: number, toId: number) {
    if (fromId === toId) return;
    setLinhas((prev) => {
      const arr = [...prev];
      const from = arr.findIndex((x) => x.id === fromId);
      const to = arr.findIndex((x) => x.id === toId);
      if (from < 0 || to < 0 || from === to) return prev;
      const [it] = arr.splice(from, 1);
      const dest = arr.findIndex((x) => x.id === toId);
      arr.splice(dest, 0, it);
      return arr;
    });
  }

  function add() {
    setLinhas((l) => [...l, { id: nextId.current++, texto: "", link: "" }]);
  }
  function remove(id: number) {
    setLinhas((l) => (l.length > 1 ? l.filter((x) => x.id !== id) : l));
  }

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "24px 2fr 1fr 28px", gap: ".5rem", margin: "0 0 .35rem" }}>
        <span />
        <span style={labelStyle}>Frase</span>
        <span style={labelStyle}>Link (opcional)</span>
        <span />
      </div>

      {linhas.map((ln, i) => (
        <div
          key={ln.id}
          draggable
          onDragStart={(e) => {
            dragId.current = ln.id;
            setDraggingId(ln.id);
            e.dataTransfer.effectAllowed = "move";
            e.dataTransfer.setData("text/plain", String(ln.id));
          }}
          onDragEnter={() => {
            if (dragId.current != null && dragId.current !== ln.id) liveMove(dragId.current, ln.id);
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => e.preventDefault()}
          onDragEnd={() => {
            setDraggingId(null);
            dragId.current = null;
          }}
          style={{
            display: "grid",
            gridTemplateColumns: "24px 2fr 1fr 28px",
            gap: ".5rem",
            alignItems: "center",
            marginBottom: ".5rem",
            opacity: draggingId === ln.id ? 0.4 : 1,
          }}
        >
          <span aria-hidden="true" title="Arraste para reordenar" style={{ color: "#bbb", fontSize: 16, cursor: "grab", textAlign: "center" }}>
            ⠿
          </span>
          <input name={`faixa${i + 1}_texto`} defaultValue={ln.texto} placeholder={`Frase ${i + 1}`} style={inputStyle} />
          <input name={`faixa${i + 1}_link`} defaultValue={ln.link} placeholder="/pagina ou https://…" style={inputStyle} />
          <button
            type="button"
            onClick={() => remove(ln.id)}
            title="Remover frase"
            aria-label="Remover frase"
            style={{ border: "1px solid #eee", background: "#fff", borderRadius: 6, cursor: "pointer", color: "#b00020", height: 32 }}
          >
            ✕
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={add}
        style={{ marginTop: ".25rem", border: "1px dashed #ccc", background: "#fff", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 13, color: "#555" }}
      >
        + Adicionar frase
      </button>
    </div>
  );
}
