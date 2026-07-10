export default function AdminBannersPage() {
  return (
    <>
      <header className="admin-head">
        <h1>Banners</h1>
        <p>Slides do carrossel principal (hero) do site.</p>
      </header>
      <div className="admin-empty">
        Em breve a edição dos banners pelo painel. A tabela <code>banners</code> já
        existe no banco — o próximo passo é conectar o hero da home a ela. Por ora,
        o carrossel usa as imagens fixas em <code>public/assets</code>.
      </div>
    </>
  );
}
