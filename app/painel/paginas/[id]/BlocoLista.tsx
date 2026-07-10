"use client";

import Link from "next/link";
import { useRef, useState, useTransition } from "react";
import { adicionarBlocoAction, alternarBlocoAction, excluirBlocoAction, reordenarBlocosAction } from "./actions";

export type BlocoItem = { id: number; tipo: string; nome: string; ativo: number; tipoLabel: string };

const card: React.CSSProperties = { background: "#fff", border: "1px solid #eee", borderRadius: 10, padding: ".5rem" };
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: 8,
  border: "1px solid #ddd",
  borderRadius: 6,
  fontFamily: "inherit",
  fontSize: 14,
};
const labelStyle: React.CSSProperties = { display: "block", fontWeight: 600, marginBottom: 4, fontSize: 13 };
const btnMini: React.CSSProperties = {
  fontSize: 11,
  padding: "2px 6px",
  borderRadius: 5,
  border: "1px solid #ddd",
  background: "#fff",
  cursor: "pointer",
  color: "#555",
};

export default function BlocoLista({
  paginaId,
  selecionadoId,
  itens,
  tipos,
}: {
  paginaId: number;
  selecionadoId: number;
  itens: BlocoItem[];
  tipos: { tipo: string; label: string }[];
}) {
  const [lista, setLista] = useState<BlocoItem[]>(itens);
  const [, startTransition] = useTransition();
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const dragId = useRef<number | null>(null);
  const listaRef = useRef(lista);
  listaRef.current = lista;

  // Move o item arrastado para a posição do item sob o cursor (ao vivo).
  function liveMove(fromId: number, toId: number) {
    if (fromId === toId) return;
    setLista((prev) => {
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

  function fimDoArraste() {
    setDraggingId(null);
    const id = dragId.current;
    dragId.current = null;
    if (id == null) return;
    startTransition(() => reordenarBlocosAction({ paginaId, orderedIds: listaRef.current.map((b) => b.id) }));
  }

  return (
    <div>
      <div style={card}>
        {lista.length === 0 ? (
          <p style={{ color: "#888", fontSize: 14, padding: ".5rem" }}>Nenhum bloco ainda. Adicione o primeiro abaixo.</p>
        ) : (
          lista.map((b) => {
            const ativo = b.id === selecionadoId;
            return (
              <div
                key={b.id}
                draggable
                onDragStart={(e) => {
                  dragId.current = b.id;
                  setDraggingId(b.id);
                  e.dataTransfer.effectAllowed = "move";
                  e.dataTransfer.setData("text/plain", String(b.id));
                }}
                onDragEnter={() => {
                  if (dragId.current != null && dragId.current !== b.id) liveMove(dragId.current, b.id);
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => e.preventDefault()}
                onDragEnd={fimDoArraste}
                style={{
                  border: ativo ? "2px solid #b08d57" : "1px solid #eee",
                  borderRadius: 8,
                  padding: ".5rem .6rem",
                  marginBottom: ".4rem",
                  background: ativo ? "#fbf7f0" : "#fff",
                  opacity: draggingId === b.id ? 0.4 : 1,
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 8,
                }}
              >
                <span aria-hidden="true" title="Arraste para reordenar" style={{ color: "#bbb", fontSize: 16, cursor: "grab", lineHeight: 1.4 }}>
                  ⠿
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Link
                    href={`/painel/paginas/${paginaId}?bloco=${b.id}`}
                    draggable={false}
                    style={{ display: "block", textDecoration: "none", color: "inherit" }}
                  >
                    <div style={{ fontWeight: 600, fontSize: 14 }}>
                      {b.nome || b.tipoLabel}
                      {!b.ativo && <span style={{ color: "#a15c00", fontSize: 11, marginLeft: 6 }}>(oculto)</span>}
                    </div>
                    <div style={{ fontSize: 12, color: "#999" }}>{b.tipoLabel}</div>
                  </Link>
                  <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
                    <form action={alternarBlocoAction} style={{ display: "inline" }}>
                      <input type="hidden" name="paginaId" value={paginaId} />
                      <input type="hidden" name="blocoId" value={b.id} />
                      <button type="submit" style={btnMini}>
                        {b.ativo ? "Ocultar" : "Mostrar"}
                      </button>
                    </form>
                    <form action={excluirBlocoAction} style={{ display: "inline" }}>
                      <input type="hidden" name="paginaId" value={paginaId} />
                      <input type="hidden" name="blocoId" value={b.id} />
                      <button type="submit" style={{ ...btnMini, color: "#b00020" }}>
                        Excluir
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Adicionar bloco */}
      <form action={adicionarBlocoAction} style={{ ...card, padding: "1rem", marginTop: ".75rem" }}>
        <input type="hidden" name="paginaId" value={paginaId} />
        <label style={labelStyle}>Adicionar bloco</label>
        <select name="tipo" defaultValue="hero" style={{ ...inputStyle, marginBottom: ".5rem" }}>
          {tipos.map((d) => (
            <option key={d.tipo} value={d.tipo}>
              {d.label}
            </option>
          ))}
        </select>
        <button className="btn btn-primary" type="submit" style={{ width: "100%" }}>
          + Adicionar
        </button>
      </form>
    </div>
  );
}
