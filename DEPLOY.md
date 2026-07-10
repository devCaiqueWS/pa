# Deploy — Pierre Alexander

O site roda na **Vercel**, publicando automaticamente da branch **`main`** do GitHub
(`github.com/devCaiqueWS/pa`). URL: `https://www.pierrealexander.com.br/preview-site`.

## Fluxo automático (depois do setup inicial)

- **Conteúdo** (páginas, menu, rodapé, cabeçalho): editado pelo painel em
  `/preview-site/painel`. Reflete no site **na hora** (não depende de deploy).
- **Código**: todo `push` na branch `main` dispara um **deploy automático** na Vercel.
  Não precisa apertar nada.

Para levar o trabalho de uma branch de desenvolvimento para produção:

```bash
git checkout main
git merge preview-site-basepath   # (fast-forward, sem divergência)
git push origin main              # -> Vercel publica sozinho
```

## Setup inicial na Vercel (uma vez) — necessário para o app dinâmico

O app usa **MySQL (Locaweb DBaaS)**. Antes do primeiro deploy da versão nova,
configurar no painel da Vercel (**Settings → Environment Variables**, em
*Production* e *Preview*) — chaves listadas em `.env.example`, valores reais em
`.env.local`:

- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `SESSION_SECRET` (gere: `openssl rand -hex 32`)
- `APP_URL` = `https://www.pierrealexander.com.br`
- (opcional) `SMTP_*` para o "esqueci minha senha"

### ⚠️ Ponto crítico: acesso externo ao MySQL

A Vercel roda na nuvem, então o **MySQL da Locaweb precisa aceitar conexão
externa** (remota). Se a DBaaS só aceitar conexão interna, o CMS/login quebram no
ar. Confirmar/habilitar acesso remoto na Locaweb — ou, como plano B, rodar o app
na própria Locaweb (Node + PM2), onde ele alcança o banco localmente.

## Pendências de segurança (recomendado)

- Trocar a senha do banco (a atual é fraca/exposta).
- Criar um usuário MySQL **restrito** (só as tabelas do site), em vez do usuário
  geral compartilhado.

## Observações

- O deploy por **FTP** (`.github/workflows/deploy-ftp.yml`) é de uma fase antiga
  (site estático) e **não** é o que serve o site hoje. Pode ser removido no futuro.
