import { useState } from "react";
import { guideItems } from "../data/content.js";
import { Link, usePageTitle } from "../lib/router.jsx";
import { ASSET, Icon, Reveal, SectionKicker } from "../components/ui.jsx";

export default function GuidePage() {
  usePageTitle("Guia de Reciclagem · REVIVA");
  const [open, setOpen] = useState(0);
  return (
    <div className="page-shell guide-page">
      <div className="guide-hero">
        <div>
          <Reveal><SectionKicker>Antes de criar</SectionKicker></Reveal>
          <Reveal as="h1" delay={70}>Um bom descarte<br /><em>também é cuidado.</em></Reveal>
          <Reveal as="p" delay={140}>
            Separar corretamente é o primeiro gesto de uma economia circular.
            Aprenda o básico e encontre o destino certo para cada material.
          </Reveal>
        </div>
        <Reveal delay={160} className="guide-hero-img">
          <img src={ASSET("8-482.webp")} alt="Espaço de triagem de materiais recicláveis" />
        </Reveal>
      </div>
      <div className="guide-content">
        <div className="accordion-list">
          <Reveal as="h2">Guia de Separação</Reveal>
          {guideItems.map(([title, text], i) => (
            <Reveal delay={i * 70} className={`accordion-item ${open === i ? "open" : ""}`} key={title}>
              <h3>
                <button type="button" id={`acc-btn-${i}`} onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i} aria-controls={`acc-panel-${i}`}>
                  <span className="accordion-number">0{i + 1}</span>
                  <b>{title}</b>
                  <span className="accordion-plus" aria-hidden="true" />
                </button>
              </h3>
              <div className="accordion-panel" id={`acc-panel-${i}`} role="region" aria-labelledby={`acc-btn-${i}`}>
                <div><p>{text}</p></div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal as="aside" className="guide-tip" delay={150}>
          <span className="tip-icon"><Icon name="leaf" size={24} /></span>
          <h3>Regra de ouro</h3>
          <p>Material limpo, seco e separado tem muito mais chance de voltar para a cadeia produtiva.</p>
          <Link to="/pontos-de-coleta" className="outline-button">
            Encontrar um ponto <Icon name="arrowRight" size={16} />
          </Link>
        </Reveal>
      </div>
    </div>
  );
}
