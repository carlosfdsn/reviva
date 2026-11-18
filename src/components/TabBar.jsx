import { Link } from "../lib/router.jsx";
import { Icon } from "./ui.jsx";

const tabs = [
  ["Início", "/", "home"],
  ["Coleta", "/pontos-de-coleta", "pin"],
  ["Guia", "/guia-de-reciclagem", "book"],
  ["Tutoriais", "/tutoriais-upcycling", "scissors"],
  ["Comunidade", "/comunidade", "people"],
];

export default function TabBar({ path }) {
  const active = path.startsWith("/tutorial/") ? "/tutoriais-upcycling" : path;
  return (
    <nav className="tab-bar" aria-label="Navegação rápida">
      {tabs.map(([label, to, icon]) => (
        <Link key={to} to={to} className={`tab-item ${active === to ? "active" : ""}`} aria-current={active === to ? "page" : undefined}>
          <Icon name={icon} size={25} />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
}
