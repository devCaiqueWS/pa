"use client";

import { useState } from "react";

export default function ConsultoraForm() {
  const [sent, setSent] = useState(false);

  return (
    <form className="form-box" onSubmit={(e) => e.preventDefault()}>
      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="nome">Nome completo</label>
          <input id="nome" name="nome" placeholder="Seu nome" />
        </div>
        <div className="form-field">
          <label htmlFor="whatsapp">WhatsApp</label>
          <input id="whatsapp" name="whatsapp" placeholder="(00) 00000-0000" />
        </div>
        <div className="form-field">
          <label htmlFor="cidade">Cidade</label>
          <input id="cidade" name="cidade" placeholder="Sua cidade" />
        </div>
        <div className="form-field">
          <label htmlFor="estado">Estado</label>
          <select id="estado" name="estado" defaultValue="">
            <option value="" disabled>
              Selecione
            </option>
            <option>SP</option>
            <option>RS</option>
            <option>SC</option>
            <option>MG</option>
          </select>
        </div>
        <div className="form-field full">
          <label htmlFor="experiencia">Você já vende cosméticos?</label>
          <select id="experiencia" name="experiencia" defaultValue="">
            <option value="" disabled>
              Selecione
            </option>
            <option>Sim</option>
            <option>Não</option>
            <option>Já vendi antes</option>
          </select>
        </div>
        <div className="form-field full">
          <label htmlFor="mensagem">Mensagem</label>
          <textarea
            id="mensagem"
            name="mensagem"
            rows={4}
            placeholder="Conte como quer começar"
          />
        </div>
        <div className="form-field full">
          <button
            className="btn btn-primary"
            type="submit"
            onClick={() => setSent(true)}
          >
            {sent
              ? "Recebido! Em breve entraremos em contato."
              : "Quero ser consultora"}
          </button>
        </div>
      </div>
    </form>
  );
}
