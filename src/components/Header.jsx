import { useEffect, useState } from "react";
import { navItems } from "../data/content.js";
import { Link } from "../lib/router.jsx";
import { useTheme } from "../lib/theme.jsx";
import { Icon } from "./ui.jsx";

export function Logo({ light = false }) {
  return (
    <Link to="/" className={`logo ${light ? "logo-light" : ""}`} aria-label="REVIVA — ir para o início">
      <span className="logo-mark">R</span>
      <span>REVIVA</span>
    </Link>
  );
}

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const dark = theme === "dark";
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={dark ? "Ativar modo claro" : "Ativar modo escuro"}
      title={dark ? "Modo claro" : "Modo escuro"}
    >
      <span className="theme-toggle-icons" data-dark={dark}>
        <Icon name="sun" size={18} />
        <Icon name="moon" size={18} />
      </span>
    </button>
  );
}

export default function Header({ path }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const active = path.startsWith("/tutorial/") ? "/tutoriais-upcycling" : path;

  useEffect(() => setOpen(false), [path]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""} ${open ? "menu-open" : ""}`}>
      <div className="header-inner">
        <Logo />
        <nav className={`desktop-nav ${open ? "is-open" : ""}`} id="menu-principal" aria-label="Navegação principal">
          {navItems.map(([label, to]) => (
            <Link key={to} to={to} className={`nav-link ${active === to ? "active" : ""}`} aria-current={active === to ? "page" : undefined}>
              {label}
            </Link>
          ))}
          <Link to="/pontos-de-coleta" className="header-cta nav-cta">Quero Descartar</Link>
        </nav>
        <Link to="/pontos-de-coleta" className="header-cta">Quero Descartar</Link>
        <ThemeToggle />
        <button type="button" className="menu-toggle" onClick={() => setOpen(!open)} aria-label={open ? "Fechar menu" : "Abrir menu"} aria-expanded={open} aria-controls="menu-principal">
          <Icon name={open ? "close" : "menu"} />
        </button>
      </div>
      {open && <button type="button" className="menu-scrim" aria-label="Fechar menu" onClick={() => setOpen(false)} />}
    </header>
  );
}
