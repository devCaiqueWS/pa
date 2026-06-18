# Pierre Alexander - Layout de Aprovacao

Repositorio do prototipo visual do site Pierre Alexander. O projeto e um site estatico em HTML, CSS e JavaScript, criado para aprovacao de layout, navegacao, arquitetura de conteudo e direcionamento comercial da marca.

> Status atual: prototipo v1. Textos, precos, integracoes, formularios reais e regras finais de publicacao ainda devem ser validados antes de producao.

## Sumario

- [Sobre o projeto](#sobre-o-projeto)
- [Tecnologias](#tecnologias)
- [Estrutura de arquivos](#estrutura-de-arquivos)
- [Mapa de paginas](#mapa-de-paginas)
- [Como rodar localmente](#como-rodar-localmente)
- [Como editar conteudo](#como-editar-conteudo)
- [Como editar estilos](#como-editar-estilos)
- [JavaScript](#javascript)
- [Imagens](#imagens)
- [Deploy](#deploy)
- [Checklist antes de publicar](#checklist-antes-de-publicar)
- [Pontos conhecidos](#pontos-conhecidos)
- [Proximos passos sugeridos](#proximos-passos-sugeridos)

## Sobre o projeto

O site apresenta a Pierre Alexander como uma marca de beleza, cuidado pessoal, fragrancias, produtos para casa e oportunidade de venda por consultoras.

A proposta principal do layout e organizar a marca em frentes comerciais claras:

- **O Original**: destaque para o desodorante em creme e a confianca historica da marca.
- **Produtos**: vitrine geral de linhas e categorias.
- **Fragrancias**: body splash, deo colonia e aromas relacionados.
- **Tratamentos**: linhas de cuidado para rosto, corpo e rotina.
- **Maison**: produtos voltados para casa, tecidos e ambiente.
- **Kits**: combinacoes para presente, recompra e venda consultiva.
- **Consultoras**: captacao, treinamento, evolucao e reconhecimento.
- **Onde Comprar**: direcionamento para compra direta, WhatsApp ou consultora.

O projeto ainda nao usa backend, CMS, framework JavaScript ou gerenciador de pacotes. Tudo esta concentrado em arquivos estaticos.

## Tecnologias

- **HTML5** para estrutura das paginas.
- **CSS3** para layout, responsividade, identidade visual e componentes.
- **JavaScript puro** para interacao do menu mobile.
- **GitHub Actions** para deploy via FTP.
- **FTP Deploy Action** (`SamKirkland/FTP-Deploy-Action`) para envio dos arquivos ao servidor.

Nao ha dependencias instalaveis via `npm`, `yarn`, `pnpm` ou `composer`.

## Estrutura de arquivos

```text
.
|-- .github/
|   `-- workflows/
|       `-- deploy-ftp.yml
|-- assets/
|   |-- css/
|   |   `-- style.css
|   |-- img/
|   |   |-- bag-colorida.jpg
|   |   |-- body-splash.jpg
|   |   |-- consultoras.jpg
|   |   |-- desodorante-original.jpg
|   |   |-- desodorantes-varios.jpg
|   |   |-- fragrancia-secrets.jpg
|   |   |-- hero-mural.jpg
|   |   |-- maison-sacola.jpg
|   |   `-- social-cards.jpg
|   `-- js/
|       `-- main.js
|-- consultora.html
|-- fragrancias.html
|-- index.html
|-- kits.html
|-- maison.html
|-- onde-comprar.html
|-- original.html
|-- produto-original.html
|-- produtos.html
|-- sobre.html
|-- tratamentos.html
`-- README.md
```

## Mapa de paginas

### `index.html`

Pagina inicial do prototipo. Apresenta o conceito "Beleza que funciona. Ha decadas.", CTAs principais, cards de acesso rapido, destaque para o produto original, categorias, fragrancias, area de consultoras e chamada final.

### `original.html`

Pagina dedicada ao "Original Pierre Alexander", com foco no desodorante em creme e na forca historica do produto.

### `produtos.html`

Pagina de catalogo geral. Serve como entrada para as principais linhas da marca.

### `produto-original.html`

Modelo de pagina de produto. Pode ser usado como referencia para futuras paginas individuais com detalhes, beneficios, preco, CTA e recompra.

### `fragrancias.html`

Pagina para body splash, deo colonias e linhas olfativas da marca.

### `tratamentos.html`

Pagina para tratamentos e cuidados especiais, como Radicaline, aloe vera, rosa mosqueta, nutricao, rosto e corpo.

### `maison.html`

Pagina para a linha Maison, com produtos de casa, tecidos, maos e ambiente.

### `kits.html`

Pagina para kits, presentes, combinacoes comerciais e ofertas para consultoras.

### `consultora.html`

Pagina de captacao e relacionamento com consultoras. Inclui:

- chamada para cadastro;
- explicacao da jornada;
- Universidade Pierre;
- niveis de evolucao e conquistas;
- formulario visual de captacao.

No estado atual, o formulario e apenas visual. O botao usa `type="button"` e nao envia dados.

### `onde-comprar.html`

Pagina para orientar o cliente sobre canais de compra, como loja oficial, WhatsApp ou consultora.

### `sobre.html`

Pagina institucional para historia, posicionamento, qualidade e apresentacao da marca.

## Como rodar localmente

Por ser um site estatico, ha algumas formas simples de abrir o projeto.

### Opcao 1: abrir direto no navegador

Abra o arquivo `index.html` no navegador.

No Windows, a partir da pasta do projeto:

```powershell
start index.html
```

### Opcao 2: usar um servidor local simples

Se tiver Python instalado:

```powershell
python -m http.server 8000
```

Depois acesse:

```text
http://localhost:8000
```

Essa opcao costuma ser melhor para simular o comportamento de hospedagem e evitar problemas com caminhos relativos.

## Como editar conteudo

Cada pagina e independente e possui uma estrutura semelhante:

1. `head` com titulo, descricao e CSS.
2. faixa superior (`top-strip`);
3. cabecalho com navegacao;
4. conteudo principal;
5. CTA final;
6. rodape;
7. botao flutuante de WhatsApp;
8. script `assets/js/main.js`.

Para alterar textos, edite diretamente o arquivo HTML correspondente.

Exemplos:

- texto da home: `index.html`;
- formulario de consultoras: `consultora.html`;
- links do menu: bloco `<nav class="navlinks">` em cada pagina;
- rodape: bloco `<footer class="footer">` em cada pagina;
- chamada fixa do WhatsApp: `<a class="whatsapp-float" href="onde-comprar.html">WhatsApp</a>`.

Como o cabecalho e o rodape estao repetidos em varias paginas, qualquer alteracao estrutural neles precisa ser replicada manualmente em todos os arquivos HTML.

## Como editar estilos

Os estilos ficam em:

```text
assets/css/style.css
```

O CSS usa variaveis no `:root` para controlar cores, largura maxima, raio de borda e sombra.

Principais variaveis:

```css
:root {
  --rouge: #e23319;
  --rouge-dark: #b72514;
  --carbon: #0a0a0a;
  --ink: #1e1714;
  --paper: #faf7f2;
  --cream: #ffe3a8;
  --gold: #dd9735;
  --pink: #ef167e;
  --wine: #7e0458;
  --green: #427567;
  --mint: #8bc1b0;
  --blue: #12108f;
  --muted: #716661;
  --line: rgba(30, 23, 20, .14);
  --shadow: 0 24px 70px rgba(10, 10, 10, .14);
  --radius: 28px;
  --max: 1200px;
}
```

Componentes principais definidos no CSS:

- `.top-strip`
- `.header`
- `.navbar`
- `.brand`
- `.navlinks`
- `.btn`
- `.hero`
- `.page-hero`
- `.quick-cards`
- `.section`
- `.grid-2`
- `.grid-3`
- `.product-card`
- `.panel`
- `.steps`
- `.levels`
- `.form-box`
- `.footer`
- `.whatsapp-float`

Responsividade:

- abaixo de `1060px`, o menu principal vira menu mobile;
- abaixo de `820px`, grids passam para uma coluna, CTAs sao reorganizados e imagens reduzem altura minima.

## JavaScript

O arquivo:

```text
assets/js/main.js
```

controla apenas a abertura e o fechamento do menu mobile.

Funcionamento:

- procura `.menu-toggle`;
- procura `.navlinks`;
- alterna a classe `.open` no menu;
- atualiza `aria-expanded` no botao.

Nao ha bibliotecas externas nem build step.

## Imagens

As imagens do projeto estao em:

```text
assets/img/
```

Antes de adicionar novas imagens:

- prefira JPG otimizado para fotos;
- use nomes descritivos em minusculo;
- evite espacos no nome do arquivo;
- comprima imagens grandes antes de publicar;
- preencha `alt` quando a imagem transmitir conteudo importante.

Padrao recomendado:

```text
assets/img/nome-descritivo.jpg
```

## Deploy

O deploy esta configurado em:

```text
.github/workflows/deploy-ftp.yml
```

Fluxo atual:

- o workflow roda em push para a branch `main`;
- baixa o codigo com `actions/checkout`;
- envia os arquivos via FTP para `public_html/`;
- ignora `.git`, `node_modules` e `.env`.

Secrets necessarios no GitHub:

```text
FTP_SERVER
FTP_USERNAME
FTP_PASSWORD
```

Configuracao atual do FTP:

```yaml
port: 21
protocol: ftp
server-dir: public_html/
```

Se a hospedagem exigir FTPS ou SFTP, sera necessario ajustar o workflow.

## Checklist antes de publicar

- Revisar todos os textos comerciais.
- Corrigir acentuacao e caracteres especiais onde houver problema de encoding.
- Validar links do menu em todas as paginas.
- Definir URL real do WhatsApp.
- Definir links reais de compra.
- Integrar formulario de consultora com CRM, e-mail, webhook ou backend.
- Ajustar `title` e `meta description` por pagina.
- Revisar imagens finais e direitos de uso.
- Testar mobile, tablet e desktop.
- Testar deploy em ambiente de homologacao antes de producao.
- Confirmar dados de FTP nos secrets do GitHub.

## Pontos conhecidos

### Encoding

Alguns arquivos exibem caracteres com mojibake, ou seja, palavras acentuadas aparecem como sequencias de bytes mal decodificadas. O HTML declara `charset="utf-8"`, entao provavelmente houve salvamento/leitura com encoding incorreto em algum momento.

Recomendacao:

- salvar todos os arquivos como UTF-8;
- revisar acentos manualmente;
- evitar copiar conteudo de editores que mudem encoding sem aviso.

### Repeticao de cabecalho e rodape

Como o site nao usa templates, includes ou componentes, o menu e o rodape estao duplicados nas paginas. Isso facilita a publicacao estatica, mas aumenta o risco de inconsistencia.

Se o projeto crescer, considerar:

- gerador estatico;
- PHP includes;
- componente via framework;
- pipeline simples de build.

### Formularios ainda visuais

O formulario de `consultora.html` nao envia dados. Ele deve ser conectado a uma solucao real antes de uso em producao.

Possiveis caminhos:

- webhook;
- CRM;
- e-mail transacional;
- API propria;
- ferramenta de formularios;
- WhatsApp com mensagem pre-preenchida.

### WhatsApp ainda generico

O botao flutuante aponta para `onde-comprar.html`. Para producao, o ideal e substituir por um link real:

```text
https://wa.me/55DDDNUMERO?text=Mensagem%20inicial
```

## Proximos passos sugeridos

1. Corrigir encoding dos arquivos HTML e do workflow.
2. Definir conteudo final aprovado pela marca.
3. Criar titulos e descricoes unicos para cada pagina.
4. Integrar formulario de consultoras.
5. Configurar link real de WhatsApp.
6. Revisar acessibilidade basica: `alt`, foco, labels e contraste.
7. Otimizar imagens para performance.
8. Criar uma pagina 404 simples.
9. Adicionar favicon e imagens de compartilhamento social.
10. Validar o workflow de deploy em ambiente de teste.

## Licenca e uso

Este repositorio contem materiais de marca e layout relacionados a Pierre Alexander. Antes de reutilizar imagens, textos ou identidade visual em outros projetos, confirme permissao com os responsaveis pela marca.
