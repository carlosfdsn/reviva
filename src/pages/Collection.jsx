import { useState } from "react";
import { collectionPoints } from "../data/content.js";
import { Link, usePageTitle } from "../lib/router.jsx";
import { ASSET, Icon, Reveal, SectionKicker } from "../components/ui.jsx";

export default function CollectionPage() {
  usePageTitle("Pontos de Coleta · REVIVA");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const q = query.trim().toLowerCase();
  const points = collectionPoints.filter((p) => `${p.name} ${p.address} ${p.accepts}`.toLowerCase().includes(q));
  const current = collectionPoints.find((p) => p.name === selected);

  return (
    <div className="page-shell collection-page">
      <div className="listing-heading">
        <Reveal><SectionKicker>Descarte consciente</SectionKicker></Reveal>
        <Reveal as="h1" delay={70}>Pontos de <em>Coleta.</em></Reveal>
        <Reveal as="p" delay={140}>Encontre um destino seguro para o que não pode virar projeto — perto de você.</Reveal>
      </div>
      <div className="collection-grid">
        <Reveal className="map-card" delay={120}>
          <img src={ASSET("8-312.webp")} alt="Mapa ilustrado de pontos de coleta" />
          <div className="map-overlay" key={selected || "default"}>
            <span className="map-status"><i /> {current ? current.distance + " de você" : "Localização aproximada"}</span>
            <strong>{current ? current.name : "Recife e região"}</strong>
            <span>{current ? `${current.address} • ${current.accepts}` : "24 pontos parceiros encontrados"}</span>
          </div>
        </Reveal>
        <Reveal className="points-panel" delay={220}>
          <div className="search-field">
            <Icon name="search" size={17} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Busque por bairro ou material" aria-label="Buscar ponto de coleta" type="search" />
          </div>
          {points.map((p) => (
            <button type="button" className={`point-row ${selected === p.name ? "selected" : ""}`} key={p.name} onClick={() => setSelected(p.name)} aria-pressed={selected === p.name}>
              <span className="point-icon"><Icon name="pin" size={18} /></span>
              <span>
                <b>{p.name}</b>
                <small>{p.address} • {p.accepts}</small>
              </span>
              <em>{p.distance}</em>
            </button>
          ))}
          {points.length === 0 && <div className="empty-state compact">Nenhum ponto encontrado para “{query}”.</div>}
          <Link to="/guia-de-reciclagem" className="primary-button full">
            Ver guia de separação <Icon name="arrowRight" size={16} />
          </Link>
        </Reveal>
      </div>
    </div>
  );
}
