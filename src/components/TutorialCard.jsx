import { Link } from "../lib/router.jsx";
import { ASSET, Icon } from "./ui.jsx";

export default function TutorialCard({ item, featured = false }) {
  const to = `/tutorial/${item.slug}`;
  return (
    <article className={`tutorial-card ${featured ? "featured" : ""}`}>
      <Link to={to} className="card-image-link" aria-label={`Abrir tutorial ${item.title}`} tabIndex={-1}>
        <img src={ASSET(item.image)} alt="" loading="lazy" decoding="async" />
        <span className="card-level">{item.level}</span>
      </Link>
      <div className="card-body">
        <div className="card-meta">
          <span>{item.material}</span>
          <span><Icon name="clock" size={13} /> {item.duration}</span>
        </div>
        <h3>{item.title}</h3>
        <p>{item.summary}</p>
        <Link to={to} className="text-link">
          Ver tutorial <Icon name="arrowRight" size={16} />
        </Link>
      </div>
    </article>
  );
}
