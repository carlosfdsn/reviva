import { Link } from "../lib/router.jsx";
import { Logo } from "./Header.jsx";
import { Icon } from "./ui.jsx";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <Logo light />
          <p>
            Transformando o descarte em novos começos. Conectando cidadãos,
            cooperativas e artesãos em prol de uma economia verdadeiramente
            circular no Brasil.
          </p>
        </div>
        <div className="footer-col">
          <strong>Plataforma</strong>
          <Link to="/">Início</Link>
          <Link to="/pontos-de-coleta">Pontos de Coleta</Link>
          <Link to="/guia-de-reciclagem">Guia de Reciclagem</Link>
          <Link to="/comunidade">Comunidade</Link>
          <Link to="/trocar-conta">Trocar conta</Link>
        </div>
        <div className="footer-col">
          <strong>Upcycling</strong>
          <Link to="/tutoriais-upcycling">Tutoriais Criativos</Link>
          <Link to="/guia-de-reciclagem">Guia de Separação</Link>
          <Link to="/tutoriais-upcycling">Projetos DIY</Link>
        </div>
        <div className="footer-col contact">
          <strong>Contato e Redes</strong>
          <a href="mailto:contato@reviva.com.br">contato@reviva.com.br</a>
          <span>Recife, Pernambuco — Brasil</span>
          <div className="socials">
            <button type="button" aria-label="Instagram"><Icon name="instagram" size={18} /></button>
            <button type="button" aria-label="Facebook"><Icon name="facebook" size={18} /></button>
            <button type="button" aria-label="YouTube"><Icon name="youtube" size={18} /></button>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 REVIVA Reciclagem Circular. Todos os direitos reservados.</span>
        <span>Feito em Recife, Pernambuco, pela sustentabilidade.</span>
      </div>
    </footer>
  );
}
