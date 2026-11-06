import { Link, navigate, usePageTitle } from "../lib/router.jsx";
import { KEYS, read, remove } from "../lib/storage.js";
import { ASSET, Icon, Reveal, SectionKicker } from "../components/ui.jsx";

export default function SwitchAccountPage() {
  usePageTitle("Trocar conta · REVIVA");
  const member = read(KEYS.member, null);
  const forgetProfile = () => {
    remove(KEYS.member);
    remove(KEYS.saved);
    navigate("/cadastro");
  };
  return (
    <div className="switch-account-page page-shell">
      <section className="switch-account-card">
        <Reveal className="switch-account-copy">
          <SectionKicker>Privacidade e acesso</SectionKicker>
          <h1>Esquecer perfil e <em>trocar de conta.</em></h1>
          <p>Use esta opção quando quiser sair do perfil salvo neste navegador e conectar outra conta ao REVIVA.</p>
          {member ? (
            <div className="connected-account">
              <img src={ASSET("8-1326.webp")} alt="" />
              <div>
                <small>Perfil conectado</small>
                <strong>{member.name}</strong>
                <span>{member.email}</span>
              </div>
            </div>
          ) : (
            <div className="disconnected-account">Nenhum perfil está conectado neste navegador.</div>
          )}
          <div className="switch-account-actions">
            {member ? (
              <button type="button" className="primary-button" onClick={forgetProfile}>Esquecer este perfil <Icon name="arrowRight" size={16} /></button>
            ) : (
              <Link to="/cadastro" className="primary-button">Conectar uma conta <Icon name="arrowRight" size={16} /></Link>
            )}
            <Link to={member ? "/perfil" : "/comunidade"} className="outline-button">Voltar</Link>
          </div>
          <small className="switch-account-note">Seus posts públicos continuam na comunidade. Apenas o acesso e os itens salvos desta sessão são removidos deste navegador.</small>
        </Reveal>
        <Reveal className="switch-account-art" delay={150}>
          <img src={ASSET("14-63.webp")} alt="Materiais organizados para uma nova etapa" />
          <div>
            <strong>Um espaço para cada história.</strong>
            <span>Troque de conta sem perder o cuidado com o que já foi compartilhado.</span>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
