"use client";

import { useRef, useState } from "react";
import type { Category } from "@/lib/catalog";
import ImagemCampo from "@/components/painel/ImagemCampo";

type SubRow = { id: number; name: string; slug: string };
type CatRow = { id: number; name: string; slug: string; tagline: string; image: string; subs: SubRow[] };

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: 8,
  border: "1px solid #ddd",
  borderRadius: 6,
  fontFamily: "inherit",
  fontSize: 14,
};
const labelStyle: React.CSSProperties = { display: "block", fontWeight: 600, marginBottom: 4, fontSize: 13 };
const ajuda: React.CSSProperties = { margin: "3px 0 0", fontSize: 12, color: "#999" };

// Slug simples para sugestão no cliente (o servidor normaliza de novo ao salvar).
function slugSimples(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function proxId<T extends { id: number }>(arr: T[]): number {
  return arr.reduce((m, x) => Math.max(m, x.id), 0) + 1;
}

export default function CategoriasEditor({ initial }: { initial: Category[] }) {
  const [cats, setCats] = useState<CatRow[]>(() =>
    initial.map((c, i) => ({
      id: i + 1,
      name: c.name,
      slug: c.slug,
      tagline: c.tagline,
      image: c.image,
      subs: c.subcategories.map((s, j) => ({ id: j + 1, name: s.name, slug: s.slug })),
    }))
  );
  const dragId = useRef<number | null>(null);
  const [draggingId, setDraggingId] = useState<number | null>(null);

  const jsonValue = JSON.stringify(
    cats.map((c) => ({
      name: c.name,
      slug: c.slug,
      tagline: c.tagline,
      image: c.image,
      subcategories: c.subs.map((s) => ({ name: s.name, slug: s.slug })),
    }))
  );

  // ---- categorias ----
  const addCat = () => setCats((p) => [...p, { id: proxId(p), name: "", slug: "", tagline: "", image: "", subs: [] }]);
  const removeCat = (id: number) => setCats((p) => p.filter((c) => c.id !== id));
  const patchCat = (id: number, campo: keyof CatRow, v: string) =>
    setCats((p) => p.map((c) => (c.id === id ? { ...c, [campo]: v } : c)));
  const setNome = (id: number, v: string) =>
    setCats((p) => p.map((c) => (c.id === id ? { ...c, name: v, slug: c.slug ? c.slug : slugSimples(v) } : c)));

  function liveMove(fromId: number, toId: number) {
    if (fromId === toId) return;
    setCats((prev) => {
      const arr = [...prev];
      const from = arr.findIndex((x) => x.id === fromId);
      if (from < 0) return prev;
      const [it] = arr.splice(from, 1);
      const to = arr.findIndex((x) => x.id === toId);
      arr.splice(to < 0 ? arr.length : to, 0, it);
      return arr;
    });
  }

  // ---- subcategorias ----
  const addSub = (catId: number) =>
    setCats((p) => p.map((c) => (c.id === catId ? { ...c, subs: [...c.subs, { id: proxId(c.subs), name: "", slug: "" }] } : c)));
  const removeSub = (catId: number, subId: number) =>
    setCats((p) => p.map((c) => (c.id === catId ? { ...c, subs: c.subs.filter((s) => s.id !== subId) } : c)));
  const patchSub = (catId: number, subId: number, campo: "name" | "slug", v: string) =>
    setCats((p) =>
      p.map((c) =>
        c.id === catId
          ? {
              ...c,
              subs: c.subs.map((s) =>
                s.id === subId ? { ...s, [campo]: v, slug: campo === "name" && !s.slug ? slugSimples(v) : campo === "slug" ? v : s.slug } : s
              ),
            }
          : c
      )
    );

  return (
    <div>
      <input type="hidden" name="categorias_json" value={jsonValue} readOnly />

      <div style={{ display: "grid", gap: "1rem" }}>
        {cats.map((c, i) => (
          <div
            key={c.id}
            draggable
            onDragStart={(e) => {
              dragId.current = c.id;
              setDraggingId(c.id);
              e.dataTransfer.effectAllowed = "move";
            }}
            onDragEnter={() => {
              if (dragId.current != null && dragId.current !== c.id) liveMove(dragId.current, c.id);
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => e.preventDefault()}
            onDragEnd={() => {
              setDraggingId(null);
              dragId.current = null;
            }}
            style={{
              border: "1px solid #e7e2da",
              borderRadius: 10,
              padding: "1rem",
              background: "#fff",
              opacity: draggingId === c.id ? 0.4 : 1,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: ".75rem" }}>
              <span aria-hidden="true" title="Arraste para reordenar" style={{ color: "#bbb", fontSize: 18, cursor: "grab" }}>
                ⠿
              </span>
              <strong style={{ fontSize: 15, flex: 1 }}>{c.name || "Nova categoria"}</strong>
              <button
                type="button"
                onClick={() => removeCat(c.id)}
                style={{ border: "1px solid #eee", background: "#fff", borderRadius: 6, cursor: "pointer", color: "#b00020", fontSize: 12, padding: "5px 10px" }}
              >
                Remover categoria
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".75rem", marginBottom: ".75rem" }}>
              <div>
                <label style={labelStyle}>Nome</label>
                <input style={inputStyle} value={c.name} placeholder="Ex.: Perfumaria" onChange={(e) => setNome(c.id, e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>Endereço (slug)</label>
                <input style={inputStyle} value={c.slug} placeholder="perfumaria" onChange={(e) => patchCat(c.id, "slug", e.target.value)} />
                <p style={ajuda}>Fica em <code>/c/{c.slug || "…"}</code>. Evite mudar depois de publicado.</p>
              </div>
            </div>

            <div style={{ marginBottom: ".75rem" }}>
              <label style={labelStyle}>Frase (aparece no topo da categoria)</label>
              <input style={inputStyle} value={c.tagline} placeholder="Ex.: Uma fragrância para cada presença." onChange={(e) => patchCat(c.id, "tagline", e.target.value)} />
            </div>

            <div style={{ marginBottom: ".75rem" }}>
              <ImagemCampo
                label="Capa da categoria"
                value={c.image}
                onChange={(v) => patchCat(c.id, "image", v)}
                ajuda={
                  <>
                    Caminho de imagem (ex.: <strong>/assets/img/body-splash.jpg</strong>) ou URL. Upload de arquivo entra numa próxima fase.
                  </>
                }
              />
            </div>

            {/* Subcategorias */}
            <fieldset style={{ border: "1px solid #eee", borderRadius: 8, padding: ".6rem .75rem" }}>
              <legend style={{ fontSize: 12, fontWeight: 700, color: "#666", padding: "0 .4rem" }}>Subcategorias</legend>
              {c.subs.length === 0 && <p style={{ ...ajuda, margin: "0 0 .4rem" }}>Nenhuma ainda.</p>}
              {c.subs.map((s) => (
                <div key={s.id} style={{ display: "flex", gap: 6, marginBottom: 6, alignItems: "center" }}>
                  <input style={{ ...inputStyle, flex: 2 }} value={s.name} placeholder="Nome (ex.: Body Splash)" onChange={(e) => patchSub(c.id, s.id, "name", e.target.value)} />
                  <input style={{ ...inputStyle, flex: 1 }} value={s.slug} placeholder="slug" onChange={(e) => patchSub(c.id, s.id, "slug", e.target.value)} />
                  <button
                    type="button"
                    onClick={() => removeSub(c.id, s.id)}
                    title="Remover subcategoria"
                    style={{ border: "1px solid #eee", background: "#fff", borderRadius: 6, cursor: "pointer", color: "#b00020", height: 34, flex: "none", width: 34 }}
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addSub(c.id)}
                style={{ marginTop: 2, border: "1px dashed #ccc", background: "#fff", borderRadius: 6, padding: "5px 10px", cursor: "pointer", fontSize: 12, color: "#555" }}
              >
                + Subcategoria
              </button>
            </fieldset>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addCat}
        style={{ marginTop: "1rem", border: "1px dashed #ccc", background: "#fff", borderRadius: 8, padding: "8px 14px", cursor: "pointer", fontSize: 14, color: "#555" }}
      >
        + Adicionar categoria
      </button>
    </div>
  );
}
