"use client";

import Link from "next/link";
import { useRef, useState, useTransition } from "react";
import { urlPublicaDaPagina } from "@/lib/site";
import { reordenarPaginasAction, definirPaiPaginaAction, duplicarPaginaAction, excluirPaginaAction } from "./actions";

export type PaginaItem = { id: number; titulo: string; slug: string; status: string };
export type PaginaNode = PaginaItem & { children: PaginaItem[] };

const card: React.CSSProperties = { background: "#fff", border: "1px solid #eee", borderRadius: 10, padding: ".75rem 1rem" };
const selStyle: React.CSSProperties = { padding: "4px 6px", border: "1px solid #ddd", borderRadius: 6, fontSize: 12, fontFamily: "inherit" };

export default function PaginaLista({
  arvore,
  opcoesPai,
}: {
  arvore: PaginaNode[];
  opcoesPai: { id: number; titulo: string }[];
}) {
  const [tops, setTops] = useState<PaginaNode[]>(arvore);
  const [, startTransition] = useTransition();
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const drag = useRef<{ id: number; parentId: number | null } | null>(null);
  const topsRef = useRef(tops);
  topsRef.current = tops;

  function mover<T extends { id: number }>(list: T[], fromId: number, toId: number): T[] {
    const arr = [...list];
    const from = arr.findIndex((x) => x.id === fromId);
    const to = arr.findIndex((x) => x.id === toId);
    if (from < 0 || to < 0 || from === to) return list;
    const [it] = arr.splice(from, 1);
    const dest = arr.findIndex((x) => x.id === toId);
    arr.splice(dest, 0, it);
    return arr;
  }

  function liveMove(fromId: number, toId: number, parentId: number | null) {
    if (fromId === toId) return;
    setTops((prev) =>
      parentId == null
        ? mover(prev, fromId, toId)
        : prev.map((t) => (t.id === parentId ? { ...t, children: mover(t.children, fromId, toId) } : t))
    );
  }

  function fimDoArraste() {
    const d = drag.current;
    setDraggingId(null);
    drag.current = null;
    if (!d) return;
    if (d.parentId == null) {
      startTransition(() => reordenarPaginasAction({ parentId: null, orderedIds: topsRef.current.map((t) => t.id) }));
    } else {
      const pai = topsRef.current.find((t) => t.id === d.parentId);
      if (pai) startTransition(() => reordenarPaginasAction({ parentId: d.parentId, orderedIds: pai.children.map((c) => c.id) }));
    }
  }

  function aninhar(id: number, parentId: number | null) {
    startTransition(() => definirPaiPaginaAction({ id, parentId }));
  }

  // IMPORTANTE: função que RETORNA JSX (não um componente <Row/>), para não
  // recriar/remontar as linhas a cada render — o que cancelaria o arraste.
  function renderRow(p: PaginaItem, parentId: number | null) {
    return (
      <div
        key={p.id}
        draggable
        onDragStart={(e) => {
          drag.current = { id: p.id, parentId };
          setDraggingId(p.id);
          e.dataTransfer.effectAllowed = "move";
          e.dataTransfer.setData("text/plain", String(p.id));
        }}
        onDragEnter={() => {
          const d = drag.current;
          if (d && d.parentId === parentId && d.id !== p.id) liveMove(d.id, p.id, parentId);
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => e.preventDefault()}
        onDragEnd={fimDoArraste}
        style={{ ...card, display: "flex", alignItems: "center", gap: 10, opacity: draggingId === p.id ? 0.4 : 1, flexWrap: "wrap" }}
      >
        <span aria-hidden="true" title="Arraste para reordenar" style={{ color: "#bbb", fontSize: 16, cursor: "grab" }}>
          ⠿
        </span>
        <div style={{ flex: "1 1 200px", minWidth: 0 }}>
          <Link href={`/painel/paginas/${p.id}`} draggable={false} style={{ fontWeight: 600, fontSize: 15 }}>
            {p.titulo}
          </Link>
          <div style={{ color: "#888", fontSize: 13, marginTop: 2 }}>
            /pagina/{p.slug}
            <span
              style={{
                marginLeft: 8,
                padding: "1px 8px",
                borderRadius: 999,
                fontSize: 12,
                background: p.status === "publicado" ? "#e6f4ea" : "#fff0e0",
                color: p.status === "publicado" ? "#1e7e34" : "#a15c00",
              }}
            >
              {p.status}
            </span>
          </div>
        </div>

        {/* Aninhar em (página-mãe) */}
        <label style={{ fontSize: 12, color: "#888", display: "flex", alignItems: "center", gap: 4 }}>
          Dentro de:
          <select
            value={parentId ?? ""}
            style={selStyle}
            onChange={(e) => aninhar(p.id, e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">— Principal —</option>
            {opcoesPai
              .filter((o) => o.id !== p.id)
              .map((o) => (
                <option key={o.id} value={o.id}>
                  {o.titulo}
                </option>
              ))}
          </select>
        </label>

        <div style={{ display: "flex", gap: ".4rem", alignItems: "center" }}>
          {p.status === "publicado" && (
            <Link className="btn" href={urlPublicaDaPagina(p.slug)} draggable={false} target="_blank">
              Ver
            </Link>
          )}
          <Link className="btn" href={`/painel/paginas/${p.id}`} draggable={false}>
            Editar
          </Link>
          <form action={duplicarPaginaAction}>
            <input type="hidden" name="id" value={p.id} />
            <button className="btn" type="submit" title="Cria uma cópia (rascunho) com os mesmos blocos">
              Duplicar
            </button>
          </form>
          <form action={excluirPaginaAction}>
            <input type="hidden" name="id" value={p.id} />
            <button className="btn" type="submit" style={{ color: "#b00020" }}>
              Excluir
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (tops.length === 0) {
    return (
      <div style={{ ...card, background: "#fff8e1", border: "1px solid #ffe082" }}>
        Nenhuma página ainda. Crie a primeira acima.
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: ".75rem" }}>
      {tops.map((t) => (
        <div key={t.id}>
          {renderRow(t, null)}
          {t.children.length > 0 && (
            <div style={{ display: "grid", gap: ".5rem", margin: ".5rem 0 0 32px", paddingLeft: 12, borderLeft: "2px solid #eee" }}>
              {t.children.map((c) => renderRow(c, t.id))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
