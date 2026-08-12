"use client";

import { useRef, useState } from "react";
import type { OpcaoLink } from "@/lib/menu";
import LinkField from "@/components/painel/LinkField";

export type LinkRow = { id: number; label: string; href: string };

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: 8,
  border: "1px solid #ddd",
  borderRadius: 6,
  fontFamily: "inherit",
  fontSize: 14,
};

function proximoId(rows: LinkRow[]): number {
  return rows.reduce((m, r) => Math.max(m, r.id), 0) + 1;
}

// Editor controlado de uma lista de links {label, href}. O estado (com ids
// estáveis para o arraste) vive no componente pai, que persiste os dados.
export default function LinksEditor({
  rows,
  setRows,
  opcoes,
  rotuloLabel = "Rótulo",
  rotuloPlaceholder = "Texto do link",
}: {
  rows: LinkRow[];
  setRows: (updater: (prev: LinkRow[]) => LinkRow[]) => void;
  opcoes: OpcaoLink[];
  rotuloLabel?: string;
  rotuloPlaceholder?: string;
}) {
  const dragId = useRef<number | null>(null);
  const [draggingId, setDraggingId] = useState<number | null>(null);

  function liveMove(fromId: number, toId: number) {
    if (fromId === toId) return;
    setRows((prev) => {
      const arr = [...prev];
      const from = arr.findIndex((x) => x.id === fromId);
      if (from < 0) return prev;
      const [it] = arr.splice(from, 1);
      const to = arr.findIndex((x) => x.id === toId);
      arr.splice(to < 0 ? arr.length : to, 0, it);
      return arr;
    });
  }
  const add = () => setRows((prev) => [...prev, { id: proximoId(prev), label: "", href: "" }]);
  const remove = (id: number) => setRows((prev) => prev.filter((x) => x.id !== id));
  const setLabel = (id: number, v: string) => setRows((prev) => prev.map((x) => (x.id === id ? { ...x, label: v } : x)));
  const setHref = (id: number, v: string) => setRows((prev) => prev.map((x) => (x.id === id ? { ...x, href: v } : x)));

  return (
    <div>
      {rows.map((r) => (
        <div
          key={r.id}
          draggable
          onDragStart={(e) => {
            dragId.current = r.id;
            setDraggingId(r.id);
            e.dataTransfer.effectAllowed = "move";
            e.dataTransfer.setData("text/plain", String(r.id));
          }}
          onDragEnter={() => {
            if (dragId.current != null && dragId.current !== r.id) liveMove(dragId.current, r.id);
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => e.preventDefault()}
          onDragEnd={() => {
            setDraggingId(null);
            dragId.current = null;
          }}
          style={{
            display: "flex",
            gap: 8,
            alignItems: "flex-start",
            marginBottom: 8,
            padding: 8,
            border: "1px solid #eee",
            borderRadius: 8,
            background: "#fff",
            opacity: draggingId === r.id ? 0.4 : 1,
          }}
        >
          <span aria-hidden="true" title="Arraste para reordenar" style={{ color: "#bbb", fontSize: 16, cursor: "grab", lineHeight: "34px" }}>
            ⠿
          </span>
          <div style={{ flex: 1, minWidth: 0, display: "grid", gap: 6 }}>
            <input
              style={inputStyle}
              value={r.label}
              placeholder={rotuloPlaceholder}
              aria-label={rotuloLabel}
              onChange={(e) => setLabel(r.id, e.target.value)}
            />
            <LinkField style={inputStyle} value={r.href} opcoes={opcoes} onChange={(v) => setHref(r.id, v)} />
          </div>
          <button
            type="button"
            onClick={() => remove(r.id)}
            title="Remover link"
            aria-label="Remover link"
            style={{ border: "1px solid #eee", background: "#fff", borderRadius: 6, cursor: "pointer", color: "#b00020", height: 34, flex: "none" }}
          >
            ✕
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={add}
        style={{ marginTop: 2, border: "1px dashed #ccc", background: "#fff", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 13, color: "#555" }}
      >
        + Adicionar link
      </button>
    </div>
  );
}
