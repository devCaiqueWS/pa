"use client";

import { useState } from "react";
import Link from "next/link";
import { upsertProduct } from "@/app/admin/produtos/actions";

export type CategoryOption = {
  id: string;
  name: string;
  subcategories: { id: string; name: string }[];
};

export type ProductInput = {
  id?: string;
  slug?: string;
  name?: string;
  category_id?: string | null;
  subcategory_id?: string | null;
  line?: string | null;
  gender?: string | null;
  family?: string | null;
  short_desc?: string | null;
  image?: string | null;
  badges?: string[] | null;
  featured?: boolean;
  is_new?: boolean;
  active?: boolean;
  position?: number;
};

export default function ProductForm({
  categories,
  product,
}: {
  categories: CategoryOption[];
  product?: ProductInput;
}) {
  const [categoryId, setCategoryId] = useState(product?.category_id ?? "");
  const subs = categories.find((c) => c.id === categoryId)?.subcategories ?? [];

  return (
    <form action={upsertProduct} className="cms-form">
      {product?.id && <input type="hidden" name="id" value={product.id} />}

      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="name">Nome</label>
          <input id="name" name="name" defaultValue={product?.name ?? ""} required />
        </div>
        <div className="form-field">
          <label htmlFor="slug">Slug (URL)</label>
          <input id="slug" name="slug" defaultValue={product?.slug ?? ""} required
            placeholder="ex: deo-colonia-laura" />
        </div>

        <div className="form-field">
          <label htmlFor="category_id">Categoria</label>
          <select
            id="category_id"
            name="category_id"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            <option value="">Selecione…</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="subcategory_id">Subcategoria</label>
          <select
            id="subcategory_id"
            name="subcategory_id"
            defaultValue={product?.subcategory_id ?? ""}
            key={categoryId}
          >
            <option value="">(nenhuma)</option>
            {subs.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="line">Linha</label>
          <input id="line" name="line" defaultValue={product?.line ?? ""}
            placeholder="ex: Secrets" />
        </div>
        <div className="form-field">
          <label htmlFor="gender">Indicado para</label>
          <select id="gender" name="gender" defaultValue={product?.gender ?? ""}>
            <option value="">—</option>
            <option value="feminino">Feminino</option>
            <option value="masculino">Masculino</option>
            <option value="unissex">Unissex</option>
            <option value="infantil">Infantil</option>
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="family">Família olfativa</label>
          <input id="family" name="family" defaultValue={product?.family ?? ""}
            placeholder="ex: Floral elegante" />
        </div>
        <div className="form-field">
          <label htmlFor="image">Imagem (caminho)</label>
          <input id="image" name="image" defaultValue={product?.image ?? ""}
            placeholder="/assets/img/arquivo.jpg" />
        </div>

        <div className="form-field full">
          <label htmlFor="short_desc">Descrição curta</label>
          <textarea id="short_desc" name="short_desc" rows={3}
            defaultValue={product?.short_desc ?? ""} />
        </div>

        <div className="form-field">
          <label htmlFor="badges">Selos (separados por vírgula)</label>
          <input id="badges" name="badges"
            defaultValue={(product?.badges ?? []).join(", ")}
            placeholder="Mais vendido, Novo" />
        </div>
        <div className="form-field">
          <label htmlFor="position">Ordem</label>
          <input id="position" name="position" type="number"
            defaultValue={product?.position ?? 0} />
        </div>

        <div className="form-field full cms-checks">
          <label className="cms-check">
            <input type="checkbox" name="featured" defaultChecked={product?.featured ?? false} />
            Em destaque (vitrine "Mais vendidos")
          </label>
          <label className="cms-check">
            <input type="checkbox" name="is_new" defaultChecked={product?.is_new ?? false} />
            Novidade / lançamento
          </label>
          <label className="cms-check">
            <input type="checkbox" name="active" defaultChecked={product?.active ?? true} />
            Visível no site
          </label>
        </div>
      </div>

      <div className="cms-form-actions">
        <button type="submit" className="btn btn-primary">
          Salvar produto
        </button>
        <Link href="/admin/produtos" className="btn btn-outline">
          Cancelar
        </Link>
      </div>
    </form>
  );
}
