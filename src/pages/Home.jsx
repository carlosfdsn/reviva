import { materialGroups, materials, tutorials } from "../data/content.js";
import { Link, navigate, usePageTitle } from "../lib/router.jsx";
import TutorialCard from "../components/TutorialCard.jsx";
import { ASSET, CountUp, Icon, Reveal, SectionKicker } from "../components/ui.jsx";

const count = (list) => tutorials.filter((t) => list.includes(t.material)).length;

export default function HomePage() {
  usePageTitle("REVIVA — Reciclagem Circular");
  const marquee = [...materials, "Vidro", ...materials, "Vidro"];

  return (
    <>
      <section className="hero-home">
        <div className="hero-copy">
          <Reveal delay={0}><SectionKicker>Reciclagem circular</SectionKicker></Reveal>
          <Reveal as="h1" delay={80}>
            Um novo começo,
            <br />
            <em>feito por você.</em>
          </Reveal>
          <Reveal as="p" delay={160} className="hero-lead">
            O que seria descarte pode virar cuidado, beleza e utilidade.
            Encontre ideias simples para transformar materiais do dia a dia.
          </Reveal>
          <Reveal className="hero-actions" delay={240}>
            <button type="button" className="primary-button" onClick={() => document.getElementById("ideias")?.scrollIntoView({ behavior: "smooth" })}>
              Explorar ideias <Icon name="arrowRight" size={17} />
            </button>
            <Link to="/guia-de-reciclagem" className="secondary-button">Como separar materiais</Link>
          </Reveal>
          <Reveal className="hero-proof" delay={320}>
            <span className="proof-avatars">
              <img src={ASSET("8-1010.webp")} alt="" />
              <img src={ASSET("8-1044.webp")} alt="" />
              <img src={ASSET("8-1052.webp")} alt="" />
            </span>
            <span>+2.400 pessoas criando novos destinos</span>
          </Reveal>
        </div>
        <div className="hero-visual">
          <span className="orb orb-a" aria-hidden="true" />
          <span className="orb orb-b" aria-hidden="true" />
          <div className="hero-visual-card">
            <img src={ASSET("8-36.webp")} alt="ReViva — dar nova vida ao que importa" />
            <div className="hero-note">
              <Icon name="leaf" size={18} />
              <span>
                <b>Menos descarte.</b>
                <br />
                Mais possibilidades.
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {marquee.map((m, i) => (
            <span key={i}><Icon name="leaf" size={16} />{m}</span>
          ))}
        </div>
      </div>

      <section className="impact-strip">
        <div><b><CountUp to={8} /></b><span>materiais com novos destinos</span></div>
        <div><b><CountUp to={42} /> mil</b><span>kg desviados do descarte</span></div>
        <div><b><CountUp to={1} /> ideia</b><span>pode começar hoje</span></div>
      </section>

      <section className="ideas-section page-shell" id="ideias">
        <Reveal className="section-heading">
          <div>
            <SectionKicker>Faça você mesmo</SectionKicker>
            <h2>
              Ideias para uma vida
              <br />
              <em>mais circular.</em>
            </h2>
          </div>
          <Link to="/tutoriais-upcycling" className="outline-button">
            Ver todos os tutoriais <Icon name="arrowRight" size={16} />
          </Link>
        </Reveal>
        <div className="tutorial-grid bento">
          {tutorials.slice(0, 4).map((item, i) => (
            <Reveal key={item.slug} delay={i * 90} className="bento-cell">
              <TutorialCard item={item} featured={i === 0} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="quote-section page-shell">
        <Reveal>
          <div className="quote-mark">“</div>
          <blockquote>
            Reaproveitar não é fazer menos. É imaginar mais caminhos para o que já existe.
          </blockquote>
          <span>— comunidade REVIVA</span>
        </Reveal>
      </section>

      <section className="materials-section page-shell">
        <Reveal className="materials-intro">
          <SectionKicker>Comece pelo que você tem</SectionKicker>
          <h2>
            Todo material
            <br />
            <em>tem uma história.</em>
          </h2>
          <p>
            Escolha uma categoria e encontre um projeto que cabe na sua rotina,
            no seu espaço e no seu jeito de criar.
          </p>
        </Reveal>
        <div className="material-list">
          {Object.entries(materialGroups).map(([key, group], i) => (
            <Reveal key={key} delay={i * 100}>
              <Link to={`/tutoriais-upcycling?grupo=${key}`} className="material-link">
                <span className="material-icon">{i === 0 ? "▱" : "◌"}</span>
                <span>
                  <b>{group.label}</b>
                  <small>{count(group.materials)} tutoriais</small>
                </span>
                <Icon name="arrowRight" size={18} />
              </Link>
            </Reveal>
          ))}
          <Reveal delay={200}>
            <Link to="/pontos-de-coleta" className="material-link">
              <span className="material-icon"><Icon name="pin" size={20} /></span>
              <span>
                <b>Quero descartar</b>
                <small>Encontre um ponto perto de você</small>
              </span>
              <Icon name="arrowRight" size={18} />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
