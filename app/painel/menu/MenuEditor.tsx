"use client";

import { useRef, useState, useTransition } from "react";
import type { MenuItem, MenuTipo } from "@/lib/menu";
import { adicionarItemMenu, salvarItemMenu, excluirItemMenu, reordenarMenu } from "./actions";

type Node = { id: number; label: string; href: string; tipo: MenuTipo; children: Leaf[] };
type Leaf = { id: number; label: string; href: string; tipo: MenuTipo };

const TIPOS: { valor: MenuTipo; label: string }[] = [
  { valor: "link", label: "Link (item normal)" },
  { valor: "botao", label: "Botão (destacado)" },
  { valor: "busca", label: "Busca (caixa de procurar)" },
];

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: 7,
  border: "1px solid #ddd",
  borderRadius: 6,
  fontFamily: "inherit",
  fontSize: 14,
};
const btnMini: React.CSSProperties = {
  fontSize: 12,
  padding: "3px 8px",
  borderRadius: 6,
  border: "1px solid #ddd",
  background: "#fff",
  cursor: "pointer",
  color: "#555",
};

function badgeTipo(tipo: MenuTipo) {
  const txt = tipo === "botao" ? "Botão" : tipo === "busca" ? "Busca" : "Link";
  const cor = tipo === "botao" ? "#b94b3a" : tipo === "busca" ? "#2b6cb0" : "#8a7f72";
  return (
    <span style={{ fontSize: 11, color: "#fff", background: cor, borderRadius: 999, padding: "1px 8px" }}>{txt}</span>
  );
}

function paraNodes(inicial: MenuItem[]): Node[] {
  return inicial.map((t) => ({
    id: t.id!,
    label: t.label,
    href: t.href,
    tipo: t.tipo,
    children: t.children.map((c) => ({ id: c.id!, label: c.label, href: c.href, tipo: c.tipo })),
  }));
}

export default function MenuEditor({ inicial }: { inicial: MenuItem[] }) {
  const [tops, setTops] = useState<Node[]>(() => paraNodes(inicial));
  const [pending, startTransition] = useTransition();
  const [editId, setEditId] = useState<number | null>(null);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const drag = useRef<{ id: number; parentId: number | null } | null>(null);
  const topsRef = useRef(tops);
  topsRef.current = tops;

  // ---- formulários de adicionar ----
  const [novo, setNovo] = useState({ label: "", href: "", tipo: "link" as MenuTipo });
  const [novoSub, setNovoSub] = useState<{ parentId: number | null; label: string; href: string }>({
    parentId: null,
    label: "",
    href: "",
  });

  function reordenar<T extends { id: number }>(list: T[], fromId: number, toId: number): T[] {
    const arr = [...list];
    const from = arr.findIndex((x) => x.id === fromId);
    if (from < 0) return list;
    const [item] = arr.splice(from, 1);
    const to = arr.findIndex((x) => x.id === toId);
    arr.splice(to < 0 ? arr.length : to, 0, item);
    return arr;
  }

  // Move ao vivo o item arrastado para a posição do item sob o cursor.
  function liveMove(fromId: number, toId: number, parentId: number | null) {
    if (fromId === toId) return;
    setTops((prev) =>
      parentId == null
        ? reordenar(prev, fromId, toId)
        : prev.map((t) => (t.id === parentId ? { ...t, children: reordenar(t.children, fromId, toId) } : t))
    );
  }

  function fimDoArraste() {
    const d = drag.current;
    setDraggingId(null);
    drag.current = null;
    if (!d) return;
    if (d.parentId == null) {
      startTransition(() => reordenarMenu({ parentId: null, orderedIds: topsRef.current.map((t) => t.id) }));
    } else {
      const pai = topsRef.current.find((t) => t.id === d.parentId);
      if (pai) startTransition(() => reordenarMenu({ parentId: d.parentId, orderedIds: pai.children.map((c) => c.id) }));
    }
  }

  // ---- adicionar / salvar / excluir ----
  function addTop(e: React.FormEvent) {
    e.preventDefault();
    if (!novo.label.trim()) return;
    startTransition(async () => {
      const { id } = await adicionarItemMenu({ ...novo, parentId: null });
      setTops((p) => [...p, { id, label: novo.label.trim(), href: novo.href.trim() || "#", tipo: novo.tipo, children: [] }]);
      setNovo({ label: "", href: "", tipo: "link" });
    });
  }

  function addSub(e: React.FormEvent, parentId: number) {
    e.preventDefault();
    if (!novoSub.label.trim() || novoSub.parentId !== parentId) return;
    startTransition(async () => {
      const { id } = await adicionarItemMenu({ label: novoSub.label, href: novoSub.href, tipo: "link", parentId });
      setTops((p) =>
        p.map((t) =>
          t.id === parentId
            ? { ...t, children: [...t.children, { id, label: novoSub.label.trim(), href: novoSub.href.trim() || "#", tipo: "link" }] }
            : t
        )
      );
      setNovoSub({ parentId: null, label: "", href: "" });
    });
  }

  function salvar(item: Node | Leaf, isTop: boolean, parentId: number | null) {
    startTransition(async () => {
      await salvarItemMenu({ id: item.id, label: item.label, href: item.href, tipo: item.tipo });
      setEditId(null);
    });
  }

  function excluir(id: number, parentId: number | null) {
    startTransition(async () => {
      await excluirItemMenu({ id });
      if (parentId == null) setTops((p) => p.filter((t) => t.id !== id));
      else setTops((p) => p.map((t) => (t.id === parentId ? { ...t, children: t.children.filter((c) => c.id !== id) } : t)));
    });
  }

  // Atualiza um campo de um item no estado (edição inline).
  function setCampo(id: number, parentId: number | null, campo: "label" | "href" | "tipo", valor: string) {
    if (parentId == null) {
      setTops((p) => p.map((t) => (t.id === id ? { ...t, [campo]: valor } : t)));
    } else {
      setTops((p) =>
        p.map((t) =>
          t.id === parentId ? { ...t, children: t.children.map((c) => (c.id === id ? { ...c, [campo]: valor } : c)) } : t
        )
      );
    }
  }

  const rowBase: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "#fff",
    border: "1px solid #e7e2da",
    borderRadius: 8,
    padding: "8px 10px",
  };

  // Função que RETORNA JSX (não um componente <Linha/>): evita remontar as
  // linhas a cada render, o que cancelaria o arraste.
  function renderLinha(item: Node | Leaf, isTop: boolean, parentId: number | null) {
    const editando = editId === item.id;
    return (
      <div
        key={item.id}
        draggable={!editando}
        onDragStart={(e) => {
          drag.current = { id: item.id, parentId };
          setDraggingId(item.id);
          e.dataTransfer.effectAllowed = "move";
          e.dataTransfer.setData("text/plain", String(item.id));
        }}
        onDragEnter={() => {
          const d = drag.current;
          if (d && d.parentId === parentId && d.id !== item.id) liveMove(d.id, item.id, parentId);
        }}
        onDragEnd={fimDoArraste}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => e.preventDefault()}
        style={{ ...rowBase, opacity: draggingId === item.id ? 0.4 : 1, cursor: editando ? "default" : "grab" }}
      >
        <span aria-hidden="true" style={{ color: "#bbb", fontSize: 18, lineHeight: 1 }}>
          ⠿
        </span>
        {editando ? (
          <div style={{ flex: 1, display: "grid", gap: 6 }}>
            <input
              style={inputStyle}
              value={item.label}
              placeholder="Texto"
              onChange={(e) => setCampo(item.id, parentId, "label", e.target.value)}
            />
            <input
              style={inputStyle}
              value={item.href}
              placeholder="Link (ex.: /sobre, /busca, https://...)"
              onChange={(e) => setCampo(item.id, parentId, "href", e.target.value)}
            />
            {isTop && (
              <select
                style={inputStyle}
                value={item.tipo}
                onChange={(e) => setCampo(item.id, parentId, "tipo", e.target.value)}
              >
                {TIPOS.map((t) => (
                  <option key={t.valor} value={t.valor}>
                    {t.label}
                  </option>
                ))}
              </select>
            )}
            <div style={{ display: "flex", gap: 6 }}>
              <button type="button" style={{ ...btnMini, borderColor: "#b08d57", color: "#7a5c1e" }} onClick={() => salvar(item, isTop, parentId)}>
                Salvar
              </button>
              <button type="button" style={btnMini} onClick={() => setEditId(null)}>
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <>
            <span style={{ flex: 1, fontWeight: isTop ? 600 : 400 }}>
              {item.label} <span style={{ color: "#aaa", fontSize: 12 }}>· {item.href}</span>
            </span>
            {isTop && badgeTipo(item.tipo)}
            <button type="button" style={btnMini} onClick={() => setEditId(item.id)}>
              Editar
            </button>
            <button type="button" style={{ ...btnMini, color: "#b00020" }} onClick={() => excluir(item.id, parentId)}>
              Excluir
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div style={{ opacity: pending ? 0.7 : 1 }}>
      <p style={{ color: "#888", fontSize: 13, margin: "0 0 1rem" }}>
        Arraste os itens pela alça <strong>⠿</strong> para reordenar. Itens principais reordenam entre si; subitens
        reordenam dentro do seu item. Links no centro do site; <strong>Botão</strong> e <strong>Busca</strong> aparecem à direita.
      </p>

      <div style={{ display: "grid", gap: 12 }}>
        {tops.map((top) => (
          <div key={top.id} style={{ border: "1px solid #eee", borderRadius: 10, padding: 10, background: "#faf9f7" }}>
            {renderLinha(top, true, null)}

            {/* subitens */}
            {top.children.length > 0 && (
              <div style={{ display: "grid", gap: 8, margin: "8px 0 0 28px" }}>
                {top.children.map((c) => renderLinha(c, false, top.id))}
              </div>
            )}

            {/* adicionar subitem */}
            <form onSubmit={(e) => addSub(e, top.id)} style={{ display: "flex", gap: 6, margin: "8px 0 0 28px", flexWrap: "wrap" }}>
              <input
                style={{ ...inputStyle, flex: "1 1 140px" }}
                placeholder="Texto do subitem"
                value={novoSub.parentId === top.id ? novoSub.label : ""}
                onChange={(e) => setNovoSub({ parentId: top.id, label: e.target.value, href: novoSub.parentId === top.id ? novoSub.href : "" })}
              />
              <input
                style={{ ...inputStyle, flex: "1 1 140px" }}
                placeholder="Link"
                value={novoSub.parentId === top.id ? novoSub.href : ""}
                onChange={(e) => setNovoSub({ parentId: top.id, label: novoSub.parentId === top.id ? novoSub.label : "", href: e.target.value })}
              />
              <button type="submit" style={btnMini}>
                + Subitem
              </button>
            </form>
          </div>
        ))}
      </div>

      {/* adicionar item principal */}
      <form onSubmit={addTop} style={{ marginTop: 16, padding: 12, border: "1px dashed #ccc", borderRadius: 10, display: "grid", gap: 8, maxWidth: 520 }}>
        <strong style={{ fontSize: 14 }}>Adicionar item principal</strong>
        <input style={inputStyle} placeholder="Texto (ex.: A Pierre)" value={novo.label} onChange={(e) => setNovo({ ...novo, label: e.target.value })} />
        <input style={inputStyle} placeholder="Link (ex.: /sobre, /busca, /consultora)" value={novo.href} onChange={(e) => setNovo({ ...novo, href: e.target.value })} />
        <select style={inputStyle} value={novo.tipo} onChange={(e) => setNovo({ ...novo, tipo: e.target.value as MenuTipo })}>
          {TIPOS.map((t) => (
            <option key={t.valor} value={t.valor}>
              {t.label}
            </option>
          ))}
        </select>
        <button type="submit" className="btn btn-primary" style={{ justifySelf: "start" }}>
          + Adicionar item
        </button>
      </form>
    </div>
  );
}
