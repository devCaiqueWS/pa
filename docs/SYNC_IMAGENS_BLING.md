# Sincronização de imagens de produto — Bling → site (handoff Syscomai)

**Contexto:** o site (Next.js) **não conversa com o Bling**. Ele só lê as tabelas do banco
compartilhado. Hoje a foto dos produtos **não está no banco** (`ofc_pc_produtos.midia_json`
está vazio em 52 de 54 produtos), por isso o site mostra um placeholder.

Objetivo deste documento: quem já tem a conexão autenticada com o Bling (Syscomai) gravar,
**para cada produto do site**, uma **URL de imagem permanente** onde o site já sabe ler.

---

## Passo 1 — Achar EXATAMENTE os produtos do site

Um produto pertence ao site quando carrega a tag/agrupamento **`Agrupamento:Origem`**
(vem do Bling: é o agrupamento "Origem"). No banco isso está em `ofc_pc_produtos.tags`
(coluna tipo **JSON**, ex.: `["Agrupamento:Origem","Marca:PIERRE ALEXANDER"]`).

Consulta que devolve o mesmo conjunto que o site usa (**54 produtos**):

```sql
SELECT e.produto_bling_id AS bling_id, e.codigo, e.nome
  FROM ofc_pierre_produto_bling_espelho e
  JOIN ofc_pc_produtos p ON p.bling_id = e.produto_bling_id
 WHERE p.ativo = 1
   AND JSON_SEARCH(p.tags, 'one', 'Agrupamento:Origem') IS NOT NULL;
```

> Só pela tabela `ofc_pc_produtos` a tag bate em **56**; o site usa **54** porque cruza com o
> espelho `ofc_pierre_produto_bling_espelho` (situação ativa). Use a query acima para ficar igual.

Equivalente direto no Bling: são os produtos do **Agrupamento "Origem"**.

---

## Passo 2 — Pegar a imagem no Bling

Para cada `bling_id`, chame o endpoint de detalhe do produto que o Syscomai já usa
(Bling API v3: `GET /produtos/{idProduto}`). A imagem vem em:

```
data.midia.imagens.internas[]   → link S3 do Bling (⚠ ASSINADO, EXPIRA em semanas)
data.midia.imagens.externas[]   → URL própria (permanente, se cadastrada)
```

⚠️ **PEGADINHA CRÍTICA:** **nunca** guarde o link de `internas[]`. Ele é uma URL assinada
da Amazon (`...s3.amazonaws.com/...?Expires=...&Signature=...`) que **expira** — depois vira
erro 403 e a imagem some. (Foi o que aconteceu com os 2 únicos produtos que hoje têm foto.)

---

## Passo 3 — Tornar a imagem PERMANENTE

Baixe os bytes da imagem do Bling e **re-hospede num lugar permanente**. O site já usa o
**Cloudinary** (`cloud name: pierrealexander`); pode subir para lá ou para storage próprio.
O resultado é uma URL estável, ex.: `https://res.cloudinary.com/pierrealexander/image/upload/....jpg`.

---

## Passo 4 — Gravar onde o site LÊ

O site resolve a imagem do card nesta ordem (`lib/produtos.ts`):

```
site_produtos.imagem   (curadoria manual — tem prioridade)
   └─ se vazio → ofc_pc_produtos.midia_json → imagens.externas[0].link  (preferido: permanente)
        └─ se vazio → imagens.internas[0].link  (evitar: expira)
        └─ se vazio → placeholder "Pierre"
```

Escolha **uma** das duas formas de gravar (recomendado: **Opção A**):

### Opção A — na própria tabela do ERP (`ofc_pc_produtos.midia_json`)

Guarde a URL permanente no formato que o site já entende (em `externas`):

```sql
UPDATE ofc_pc_produtos
   SET midia_json = JSON_OBJECT(
         'imagens', JSON_OBJECT(
           'externas', JSON_ARRAY(JSON_OBJECT('link', ?))   -- ? = URL permanente
         )
       )
 WHERE bling_id = ?;
```

### Opção B — na tabela de curadoria do site (`site_produtos.imagem`)

`site_produtos` é keyed por `bling_id` (UNIQUE). Este upsert mexe **só** na coluna `imagem`,
sem apagar a curadoria manual das outras colunas:

```sql
INSERT INTO site_produtos (bling_id, imagem) VALUES (?, ?)
ON DUPLICATE KEY UPDATE imagem = VALUES(imagem);
```

> Diferença prática: a Opção B **sobrepõe** qualquer imagem (inclusive uma escolhida à mão no
> painel). A Opção A alimenta a imagem "de fábrica", e o painel ainda pode sobrepor pontualmente.
> Para um sync automático, prefira a **Opção A**.

---

## Exemplo de referência (PHP, pseudo)

```php
$pdo = /* conexão MySQL do Syscomai */;

// 1) produtos do site
$rows = $pdo->query("
  SELECT e.produto_bling_id AS bling_id
    FROM ofc_pierre_produto_bling_espelho e
    JOIN ofc_pc_produtos p ON p.bling_id = e.produto_bling_id
   WHERE p.ativo = 1
     AND JSON_SEARCH(p.tags, 'one', 'Agrupamento:Origem') IS NOT NULL
")->fetchAll(PDO::FETCH_COLUMN);

$up = $pdo->prepare("
  UPDATE ofc_pc_produtos
     SET midia_json = JSON_OBJECT('imagens', JSON_OBJECT('externas', JSON_ARRAY(JSON_OBJECT('link', ?))))
   WHERE bling_id = ?
");

foreach ($rows as $blingId) {
    // 2) detalhe no Bling (usa o token/cliente que o Syscomai já tem)
    $prod   = bling_get("/produtos/{$blingId}");        // sua função existente
    $imgUrl = $prod['data']['midia']['imagens']['internas'][0]['link'] ?? null;
    if (!$imgUrl) continue;                              // produto sem foto no Bling

    // 3) baixar do Bling e re-hospedar permanente (Cloudinary OU storage próprio)
    $permanente = rehospedar_permanente($imgUrl, $blingId);  // -> URL estável

    // 4) gravar onde o site lê
    $up->execute([$permanente, $blingId]);
}
```

`rehospedar_permanente()` = baixar os bytes da URL do Bling **enquanto ela ainda é válida** e
subir para o Cloudinary/storage, devolvendo a URL final permanente. É o passo que resolve a
expiração de vez.

---

## Como validar

Depois de rodar, esta query deve mostrar as URLs permanentes:

```sql
SELECT e.nome,
       JSON_UNQUOTE(JSON_EXTRACT(p.midia_json, '$.imagens.externas[0].link')) AS foto
  FROM ofc_pierre_produto_bling_espelho e
  JOIN ofc_pc_produtos p ON p.bling_id = e.produto_bling_id
 WHERE p.ativo = 1
   AND JSON_SEARCH(p.tags, 'one', 'Agrupamento:Origem') IS NOT NULL;
```

No site, a foto aparece sozinha (cache de até 60s na página de categoria). Se a URL falhar por
qualquer motivo, o site cai no placeholder — nunca mostra imagem quebrada.

## Checklist

- [ ] Encontrar produtos por `Agrupamento:Origem` (query do Passo 1)
- [ ] Buscar a imagem de cada um no Bling
- [ ] **Re-hospedar em URL permanente** (não guardar o link `internas` do Bling)
- [ ] Gravar em `ofc_pc_produtos.midia_json` → `imagens.externas[0].link` (Opção A)
- [ ] Rodar periodicamente (cron) para refletir trocas de foto no Bling
