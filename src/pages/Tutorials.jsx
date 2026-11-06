import { useMemo, useState } from "react";
import { materialGroups, materials, tutorials } from "../data/content.js";
import { usePageTitle } from "../lib/router.jsx";
import TutorialCard from "../components/TutorialCard.jsx";
import { Icon, Reveal, SectionKicker } from "../components/ui.jsx";

export default function TutorialsPage({ search }) {
  usePageTitle("Tutoriais de Upcycling · REVIVA");
  const params = new URLSearchParams(search);
  const group = materialGroups[params.get("grupo")];
  const initial = group ? group.label : materials.includes(params.get("material")) ? params.get("material") : "Todos";

  const [filter, setFilter] = useState(initial);
  const [query, setQuery] = useState("");
  const pills = ["Todos", ...(group ? [group.label] : []), ...materials];

  const filtered = useMemo(() => {
    const allowed = group && filter === group.label ? group.materials : null;
    const q = query.trim().toLowerCase();
    return tutorials.filter(
      (t) =>
        (filter === "Todos" || (allowed ? allowed.includes(t.material) : t.material === filter)) &&
        `${t.title} ${t.summary} ${t.material}`.toLowerCase().includes(q),
    );
  }, [filter, query, group]);

  return (
    <div className="page-shell listing-page">
      <div className="listing-heading">
        <Reveal><SectionKicker>Faça com o que existe</SectionKicker></Reveal>
        <Reveal as="h1" delay={70}>Tutoriais de <em>Upcycling.</em></Reveal>
        <Reveal as="p" delay={140}>
          Ideias acessíveis para transformar materiais descartáveis em objetos que você quer manter por perto.
        </Reveal>
      </div>
      <Reveal className="filter-bar" delay={200}>
        <div className="search-field">
          <Icon name="search" size={17} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar por projeto ou material" aria-label="Buscar tutoriais" type="search" />
        </div>
        <div className="filter-pills" role="group" aria-label="Filtrar por material">
          {pills.map((name) => (
            <button type="button" className={filter === name ? "selected" : ""} aria-pressed={filter === name} key={name} onClick={() => setFilter(name)}>
              {name}
            </button>
          ))}
        </div>
      </Reveal>
      <p className="result-count" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "tutorial" : "tutoriais"}
      </p>
      <div className="tutorial-grid listing-grid">
        {filtered.map((item, i) => (
          <Reveal key={item.slug} delay={(i % 3) * 80}>
            <TutorialCard item={item} />
          </Reveal>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="empty-state">Nenhum tutorial encontrado. Tente outro material ou palavra.</div>
      )}
    </div>
  );
}
