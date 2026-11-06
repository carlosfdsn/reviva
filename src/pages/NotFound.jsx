import { Link, usePageTitle } from "../lib/router.jsx";
import { Icon, Reveal, SectionKicker } from "../components/ui.jsx";

export default function NotFoundPage() {
  usePageTitle("Página não encontrada · REVIVA");
  return (
    <div className="page-shell not-found">
      <Reveal>
        <SectionKicker>Erro 404</SectionKicker>
        <h1>Esse caminho <em>ainda não existe.</em></h1>
        <p>A página que você procura foi movida ou nunca existiu. Que tal recomeçar pelo início?</p>
        <Link to="/" className="primary-button">Voltar ao início <Icon name="arrowRight" size={16} /></Link>
      </Reveal>
    </div>
  );
}
