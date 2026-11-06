import { useMemo, useState } from "react";
import { postTags, seedPosts } from "../data/content.js";
import { navigate, usePageTitle } from "../lib/router.jsx";
import { KEYS, read, write } from "../lib/storage.js";
import { resizeImage, timeAgo } from "../lib/image.js";
import { ASSET, Icon, Reveal, SectionKicker, useToast } from "../components/ui.jsx";

const SEED_AVATARS = { "seed-1": "8-973.webp", "seed-2": "8-992.webp" };
const FILTERS = ["Todos", ...postTags];

export default function CommunityPage() {
  usePageTitle("Comunidade · REVIVA");
  const toast = useToast();
  const [member] = useState(() => read(KEYS.member, null));
  const [posts, setPosts] = useState(() => read(KEYS.posts, seedPosts));
  const [saved, setSaved] = useState(() => read(KEYS.saved, []));
  const [draft, setDraft] = useState("");
  const [tag, setTag] = useState(postTags[0]);
  const [photo, setPhoto] = useState(null);
  const [filter, setFilter] = useState("Todos");
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter(
      (p) =>
        (filter === "Todos" || p.tag === filter) &&
        `${p.text} ${p.author} ${p.tag}`.toLowerCase().includes(q),
    );
  }, [posts, filter, query]);

  const updatePosts = (next) => {
    setPosts(next);
    if (!write(KEYS.posts, next)) setNotice("Seu navegador está sem espaço: a publicação não ficará salva após recarregar.");
  };

  const selectPhoto = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      setPhoto({ name: file.name, data: await resizeImage(file) });
    } catch {
      setNotice("Não foi possível ler essa imagem. Tente outro arquivo.");
    }
  };

  const publish = () => {
    if (!member) return navigate("/cadastro");
    if (!draft.trim() && !photo) return setNotice("Escreva uma ideia ou escolha uma foto para publicar.");
    const post = {
      id: `post-${Date.now()}`,
      author: member.name,
      handle: member.handle,
      role: "Membro REVIVA",
      tag,
      text: draft.trim() || "Compartilhei uma nova inspiração de upcycling com a comunidade.",
      image: photo?.data || null,
      createdAt: Date.now(),
      likes: 0,
      comments: 0,
      liked: false,
    };
    updatePosts([post, ...posts]);
    setDraft("");
    setPhoto(null);
    setFilter("Todos");
    setQuery("");
    setNotice("Publicado! Sua ideia já está no mural da comunidade.");
  };

  const toggleLike = (id) =>
    updatePosts(posts.map((p) => (p.id === id ? { ...p, liked: !p.liked, likes: p.likes + (p.liked ? -1 : 1) } : p)));

  const toggleSave = (id) => {
    const next = saved.includes(id) ? saved.filter((s) => s !== id) : [...saved, id];
    setSaved(next);
    write(KEYS.saved, next);
    toast(next.includes(id) ? "Post salvo no seu perfil." : "Post removido dos salvos.");
  };

  const myPosts = member ? posts.filter((p) => p.author === member.name).length : 14;

  return (
    <div className="page-shell community-page">
      <div className="community-heading">
        <Reveal><SectionKicker>Conexão circular</SectionKicker></Reveal>
        <Reveal as="h1" delay={70}>Nossa Comunidade <em>Circular</em></Reveal>
        <Reveal as="p" delay={140}>Compartilhe suas ideias de upcycling, tire dúvidas sobre descarte e inspire outras pessoas.</Reveal>
      </div>
      <div className="community-grid">
        <section className="community-feed" aria-label="Publicações">
          <Reveal className="composer-card" delay={100}>
            <div className="composer-top">
              <img src={ASSET(member ? "8-1326.webp" : "8-957.webp")} alt="" />
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={2}
                placeholder={member ? `No que você está trabalhando hoje, ${member.name.split(" ")[0]}? Compartilhe um projeto de Upcycling...` : "No que você está trabalhando hoje? Crie uma conta para publicar..."}
                aria-label="Escreva uma publicação"
              />
            </div>
            {photo && (
              <div className="photo-preview">
                <img src={photo.data} alt="Prévia da foto escolhida" />
                <button type="button" onClick={() => setPhoto(null)} aria-label="Remover foto"><Icon name="close" size={16} /></button>
              </div>
            )}
            <div className="composer-actions">
              <div className="composer-tools">
                <label className="tool-button">
                  <Icon name="image" size={18} /> Foto
                  <input type="file" accept="image/*" onChange={selectPhoto} />
                </label>
                <label className="tool-button">
                  <Icon name="hash" size={17} /> Material
                  <select value={tag} onChange={(e) => setTag(e.target.value)} aria-label="Escolher material">
                    {postTags.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </label>
              </div>
              <button type="button" className="primary-button" onClick={publish}>Publicar</button>
            </div>
            {notice && <div className="inline-notice" role="status" key={notice}>{notice}</div>}
          </Reveal>

          {visible.map((post, i) => (
            <Reveal as="article" delay={(i % 2) * 70} className="social-post" key={post.id}>
              <div className="post-header">
                <div className="post-author">
                  <img src={ASSET(post.avatar || SEED_AVATARS[post.id] || "8-1326.webp")} alt="" />
                  <span>
                    <b>{post.author}</b>
                    <small>{post.handle} • {post.role}{post.createdAt ? ` • ${timeAgo(post.createdAt)}` : ""}</small>
                  </span>
                </div>
                <span className="post-tag">{post.tag}</span>
              </div>
              <p className="post-text">{post.text}</p>
              {post.image && (
                <img className="post-image" loading="lazy" src={post.image.startsWith("data:") ? post.image : ASSET(post.image)} alt={`Publicação de ${post.author}`} />
              )}
              <div className="post-footer">
                <button type="button" className={`post-action ${post.liked ? "liked" : ""}`} onClick={() => toggleLike(post.id)} aria-pressed={post.liked}>
                  <Icon name="heart" size={18} /> {post.likes} Curtidas
                </button>
                <button type="button" className="post-action" onClick={() => toast("Comentários serão liberados nesta publicação em breve.")}>
                  <Icon name="comment" size={18} /> {post.comments} Comentários
                </button>
                <button type="button" className={`post-action save-action ${saved.includes(post.id) ? "saved" : ""}`} onClick={() => toggleSave(post.id)} aria-pressed={saved.includes(post.id)}>
                  <Icon name="bookmark" size={17} /> {saved.includes(post.id) ? "Salvo" : "Salvar"}
                </button>
              </div>
            </Reveal>
          ))}
          {visible.length === 0 && <div className="empty-state">Nenhuma publicação encontrada para esse filtro.</div>}
        </section>

        <aside className="community-sidebar">
          <Reveal className="user-summary" delay={120}>
            <div className="summary-top">
              <img src={ASSET(member ? "8-1326.webp" : "8-1010.webp")} alt="" />
              <div>
                <h3>{member ? member.name : "Marina Silva"}</h3>
                <p>{member ? `${member.handle} • Membro REVIVA` : "Artesã iniciante • São Paulo"}</p>
              </div>
            </div>
            <div className="summary-stats">
              <span><b>{myPosts}</b>Posts</span>
              <span><b>340</b>Impacto (kg)</span>
              <span><b>{member ? "0" : "1.2k"}</b>Pontos</span>
            </div>
            {member ? (
              <button type="button" className="outline-button full" onClick={() => navigate("/perfil")}>Ver meu perfil</button>
            ) : (
              <button type="button" className="primary-button full" onClick={() => navigate("/cadastro")}>Criar minha conta</button>
            )}
          </Reveal>
          <Reveal className="filter-widget" delay={180}>
            <h3>Filtrar Discussões</h3>
            <div className="search-field">
              <Icon name="search" size={16} />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar palavras-chave..." aria-label="Buscar palavras-chave" type="search" />
            </div>
            <div className="filter-pills social-filters" role="group" aria-label="Filtrar por material">
              {FILTERS.map((item) => (
                <button type="button" key={item} className={filter === item ? "selected" : ""} aria-pressed={filter === item} onClick={() => setFilter(item)}>{item}</button>
              ))}
            </div>
          </Reveal>
          <Reveal className="groups-widget" delay={240}>
            <h3>Grupos Circulares</h3>
            <p>Participe ou crie um grupo focado em materiais específicos ou regiões próximas para potencializar a reciclagem coletiva.</p>
            <div>
              <button type="button" className="light-button" onClick={() => toast("Seu grupo circular está sendo preparado.")}>Criar Novo Grupo</button>
              <button type="button" className="dark-outline-button" onClick={() => toast("Em breve você poderá explorar todos os grupos.")}>Explorar Todos</button>
            </div>
          </Reveal>
        </aside>
      </div>
    </div>
  );
}
