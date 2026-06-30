# Fase 2 — Supabase + Vercel (passo a passo)

Esta fase liga o site a um **CMS** (painel `/admin` para gerenciar a vitrine:
produtos em destaque, textos, imagens). **Não é um CRM** — pedidos/clientes/estoque
continuam no seu ERP/Bling. O **código já está pronto**; faltam só os passos
externos abaixo (criar contas e colar chaves).

> Enquanto o Supabase não estiver configurado, o site público funciona normal
> (catálogo estático) e o `/admin` mostra um aviso de "configuração pendente".

---

## 1. Criar o projeto no Supabase

1. Acesse https://supabase.com → **New project** (plano free serve).
2. Defina nome (ex.: `pierre-alexander`) e uma senha de banco (guarde).
3. Região: escolha **South America (São Paulo)** para menor latência.
4. Aguarde provisionar (~2 min).

## 2. Rodar o schema do banco

1. No projeto, vá em **SQL Editor → New query**.
2. Cole **todo** o conteúdo de [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql) → **Run**.
3. Repita com [`supabase/migrations/0002_seed_catalog.sql`](supabase/migrations/0002_seed_catalog.sql) (popula o catálogo) → **Run**.

## 3. Pegar as chaves de API

1. **Project Settings → API**.
2. Copie:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (secreta!)
3. Localmente: copie `.env.example` para `.env.local` e cole os valores.
   - ⚠️ Rode o projeto pela **cópia local** (`C:\node_local\pa-run`), não pelo
     Google Drive (`npm` não funciona no Drive). Coloque o `.env.local` lá.

## 4. Criar o usuário admin

1. No Supabase: **Authentication → Users → Add user** (e-mail + senha).
   - Marque "Auto confirm" para já poder logar.
2. O perfil é criado automaticamente com papel `cliente`. Promova para admin:
   **SQL Editor**, rode (troque o e-mail):
   ```sql
   update public.profiles set role = 'admin'
   where email = 'seu-email@exemplo.com';
   ```
3. Agora `/login` → entra → cai no `/admin`. ✅

## 5. Deploy na Vercel

1. Suba o repositório no GitHub (se ainda não estiver).
2. https://vercel.com → **Add New → Project** → importe o repo.
3. Em **Environment Variables**, adicione as 3 do `.env.local`.
4. **Deploy**. A Vercel detecta Next.js sozinha (sem `output: export`).
5. Domínio: aponte `pierrealexander.com.br` para a Vercel (ou use o domínio
   `.vercel.app` para testar primeiro).

---

## Observações

- **FTP antigo:** o workflow `.github/workflows/deploy-ftp.yml` (deploy estático
  por FTP) ficou **obsoleto** — não use mais, pois removemos o `output: export`.
  Pode apagá-lo quando o deploy na Vercel estiver no ar.
- **basePath:** removido. O site agora roda na raiz (`/`), não em `/preview-site`.
- **Segurança:** as tabelas têm RLS. Catálogo e banners são leitura pública (o
  site lê deles); a escrita (edição no CMS) exige login de admin/editor.
- **O site lê do CMS:** os produtos exibidos vêm do banco (Supabase). Sem o banco
  configurado, o site usa o catálogo estático de `lib/catalog.ts` como fallback.
