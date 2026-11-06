import { useEffect, useState } from "react";
import { tutorials } from "../data/content.js";
import { Link, usePageTitle } from "../lib/router.jsx";
import { KEYS, read, write } from "../lib/storage.js";
import TutorialCard from "../components/TutorialCard.jsx";
import { ASSET, Icon, Reveal, useToast } from "../components/ui.jsx";

export const savedKey = (slug) => `tutorial:${slug}`;

export default function TutorialPage({ item }) {
  usePageTitle(`${item.title} · Tutoriais REVIVA`);
  const toast = useToast();
  const [completed, setCompleted] = useState(() => read(KEYS.steps(item.slug), []));
  const [saved, setSaved] = useState(() => read(KEYS.saved, []).includes(savedKey(item.slug)));
  const total = item.steps.length;
  const done = completed.length === total;

  useEffect(() => {
    write(KEYS.steps(item.slug), completed);
  }, [completed, item.slug]);

  const toggle = (i) => setCompleted((prev) => (prev.includes(i) ? prev.filter((n) => n !== i) : [...prev, i]));
  const toggleSave = () => {
    const list = read(KEYS.saved, []);
    const key = savedKey(item.slug);
    const next = list.includes(key) ? list.filter((k) => k !== key) : [...list, key];
    write(KEYS.saved, next);
    setSaved(next.includes(key));
    toast(next.includes(key) ? "Tutorial salvo no seu perfil." : "Tutorial removido dos salvos.");
  };

  const related = [
    ...tutorials.filter((t) => t.slug !== item.slug && t.material === item.material),
    ...tutorials.filter((t) => t.slug !== item.slug && t.material !== item.material),
  ].slice(0, 3);

  return (
    <div className="tutorial-page">
      <div className="tutorial-layout page-shell">
        <div className="tutorial-main">
          <Link to="/tutoriais-upcycling" className="back-link">
            <Icon name="arrow" size={16} /> Voltar aos tutoriais
          </Link>
          <div className="tutorial-intro">
            <span className="material-badge">{item.material}</span>
            <h1>{item.title}</h1>
            <p>{item.summary}</p>
          </div>
          <figure className="project-photo">
            <img src={ASSET(item.image)} alt={`Projeto pronto: ${item.title}`} />
            <figcaption>Uma transformação simples, feita para continuar a história do material.</figcaption>
          </figure>
          <div className="steps-heading">
            <div>
              <h2>Instruções Passo a Passo</h2>
              <span>{total} etapas • do início ao acabamento</span>
            </div>
            <span className="progress-count" aria-label={`${completed.length} de ${total} etapas concluídas`}>
              {completed.length}/{total}
            </span>
          </div>
          <div className="progress-bar" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={completed.length}>
            <span style={{ width: `${(completed.length / total) * 100}%` }} />
          </div>
          <div className="steps-list">
            {item.steps.map(([title, text], i) => {
              const isDone = completed.includes(i);
              return (
                <Reveal as="article" delay={(i % 3) * 60} className={`step-card ${isDone ? "done" : ""}`} key={title}>
                  <button type="button" className="step-number" onClick={() => toggle(i)} aria-pressed={isDone} aria-label={isDone ? `Desmarcar etapa ${i + 1}` : `Marcar etapa ${i + 1} como concluída`}>
                    <span>{isDone ? <Icon name="check" size={20} /> : String(i + 1).padStart(2, "0")}</span>
                  </button>
                  <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
          <div className={`result-callout ${done ? "complete" : ""}`}>
            <Icon name="leaf" size={26} />
            <div>
              <strong>{done ? "Projeto concluído! Parabéns." : "Um novo começo, feito por você."}</strong>
              <span>Quando terminar, compartilhe o resultado e inspire alguém a olhar diferente para o descarte.</span>
            </div>
            <Link to="/comunidade" className="outline-button">Compartilhar</Link>
          </div>
        </div>
        <aside className="tutorial-aside">
          <div className="aside-card">
            <h3>Ficha Técnica</h3>
            <div className="spec-row"><span>Material principal</span><b>{item.material}</b></div>
            <div className="spec-row"><span>Nível</span><b>{item.level}</b></div>
            <div className="spec-row"><span>Duração</span><b>{item.duration}</b></div>
            <div className="spec-row"><span>Impacto</span><b>{item.impact}</b></div>
            <p>Tempo de trabalho manual. Secagem extra: pelo menos 2 horas, ou o prazo informado no rótulo.</p>
            <button type="button" className={`save-tutorial ${saved ? "saved" : ""}`} onClick={toggleSave} aria-pressed={saved}>
              <Icon name="bookmark" size={17} /> {saved ? "Tutorial salvo" : "Salvar tutorial"}
            </button>
          </div>
          <div className="aside-card materials-card">
            <h3>Materiais Necessários</h3>
            <ul>
              <li>Material reaproveitado limpo</li>
              <li>Cola branca ou adesivo adequado</li>
              <li>Tesoura e estilete</li>
              <li>Régua e lápis</li>
              <li>Acabamento à sua escolha</li>
            </ul>
          </div>
          <div className="aside-card safety-card">
            <h3>Segurança primeiro</h3>
            <p>Use base de corte, proteja as mãos e peça ajuda de um adulto ao usar ferramentas de corte, perfuração ou elétrica.</p>
          </div>
        </aside>
      </div>
      <section className="related page-shell">
        <Reveal as="h2">Continue criando</Reveal>
        <div className="tutorial-grid listing-grid">
          {related.map((t, i) => (
            <Reveal key={t.slug} delay={i * 80}><TutorialCard item={t} /></Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
