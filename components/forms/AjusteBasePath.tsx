// =============================================================================
// AJUSTE DE basePath PARA AS URLs LIMPAS (/forms/... na raiz do domínio)
// O vercel.json faz rewrite de /forms/* para /preview-site/forms/*: o HTML
// chega, mas o runtime do Next SÓ hidrata quando location.pathname começa com
// o basePath. Este <script> inline roda ANTES do runtime (os chunks do Next são
// deferred) e prefixa o caminho via history.replaceState — sem recarregar e sem
// tocar na querystring. O caminho original fica em window.__urlLimpa para a
// página pública devolver a URL limpa à barra depois de hidratar.
// =============================================================================
import { BASE_PATH } from "@/lib/site";

const CODIGO =
  `(function(){var b=${JSON.stringify(BASE_PATH)};` +
  `if(b&&location.pathname.indexOf(b)!==0){` +
  `window.__urlLimpa=location.pathname+location.search;` +
  `history.replaceState(null,"",b+window.__urlLimpa);}})();`;

export default function AjusteBasePath() {
  // eslint-disable-next-line react/no-danger -- código constante, sem dado de usuário
  return <script dangerouslySetInnerHTML={{ __html: CODIGO }} />;
}
