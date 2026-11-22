import { useMemo, useState } from "react";
import { postTags, seedPosts } from "../data/content.js";
import { navigate, usePageTitle } from "../lib/router.jsx";
import { KEYS, read, write } from "../lib/storage.js";
import { resizeImage, timeAgo } from "../lib/image.js";
import { ASSET, Icon, Reveal, SectionKicker, useToast } from "../components/ui.jsx";

const SEED_AVATARS = { "seed-1": "8-973.webp", "seed-2": "8-992.webp" };
const FILTERS = ["Todos", ...postTags];
const COMMENTS_KEY = "reviva-comments";

const H = 3600 * 1000;
const now = Date.now();

// Comentários de exemplo (só aparecem enquanto o usuário não mexer em nenhum).
const SEED_COMMENTS = {
  "seed-1": [
    { id: "c-s1-1", author: "Marina Silva", handle: "@marinasilva", avatar: "8-1010.webp", text: "Ficou lindo demais! Qual grana de lixa você usou no acabamento?", createdAt: now - 5 * H },
    { id: "c-s1-2", author: "Felipe Neto", handle: "@felipeneto", avatar: "8-992.webp", text: "Vou tentar com as garrafas aqui de casa 🙌", createdAt: now - 3 * H },
    { id: "c-s1-3", author: "Ana Beatriz", handle: "@anabeatriz", avatar: "8-957.webp", text: "Salvei o tutorial, obrigada por compartilhar!", createdAt: now - 1 * H },
  ],
  "seed-2": [
    { id: "c-s2-1", author: "Carlos Eduardo", handle: "@carloseduardo", avatar: "8-973.webp", text: "Parabéns pela iniciativa, 50kg é bastante coisa!", createdAt: now - 8 * H },
    { id: "c-s2-2", author: "Marina Silva", handle: "@marinasilva", avatar: "8-1010.webp", text: "A próxima coleta vai ser quando? Quero ajudar.", createdAt: now - 2 * H },
    { id: "c-s2-3", author: "Ana Beatriz", handle: "@anabeatriz", avatar: "8-957.webp", text: "Muito bom ver a comunidade se mobilizando 🌱", createdAt: now - 40 * 60 * 1000 },
  ],
};

function ago(ts) {
  if (!ts) return "";
  const s = Math.max(0, (Date.now() - ts) / 1000);
  if (s < 60) return "agora";
  if (s < 3600) return `${Math.floor(s / 60)} min`;
  if (s < 86400) return `${Math.floor(s / 3600)} h`;
  return `${Math.floor(s / 86400)} d`;
}

export default function CommunityPage() {
  usePageTitle("Comunidade · REVIVA");
  const toast = useToast();
  const [member] = useState(() => read(KEYS.member, null));
  const [posts, setPosts] = useState(() => read(KEYS.posts, seedPosts));
  const [saved, setSaved] = useState(() => read(KEYS.saved, []));
  const [comments, setComments] = useState(() => read(COMMENTS_KEY, SEED_COMMENTS));
  const [draft, setDraft] = useState("");
  const [tag, setTag] = useState(postTags[0]);
  const [photo, setPhoto] = useState(null);
  const [filter, setFilter] = useState("Todos");
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");

  // posts: edição / exclusão
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [confirmId, setConfirmId] = useState(null);

  // comentários
  const [openId, setOpenId] = useState(null); // post com comentários abertos
  const [commentDraft, setCommentDraft] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [confirmCommentId, setConfirmCommentId] = useState(null);

  const isOwner = (item) => !!member && item.handle === member.handle;

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

  const updateComments = (next) => {
    setComments(next);
    if (!write(COMMENTS_KEY, next)) setNotice("Seu navegador está sem espaço: o comentário não ficará salvo após recarregar.");
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
      liked: false,
    };
    updatePosts([post, ...posts]);
    setDraft("");
    setPhoto(null);
    setFilter("Todos");
    setQuery("");
    setNotice("Publicado! Sua ideia já está no mural da comunidade.");
  };

  /* ---------- posts: editar / excluir ---------- */
  const startEdit = (post) => {
    setConfirmId(null);
    setEditingId(post.id);
    setEditText(post.text);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const saveEdit = (post) => {
    if (!isOwner(post)) return;
    const text = editText.trim();
    if (!text && !post.image) return setNotice("O texto não pode ficar vazio.");
    updatePosts(posts.map((p) => (p.id === post.id ? { ...p, text: text || p.text, editedAt: Date.now() } : p)));
    cancelEdit();
    toast("Publicação atualizada.");
  };

  const deletePost = (post) => {
    if (!isOwner(post)) return;
    updatePosts(posts.filter((p) => p.id !== post.id));
    if (saved.includes(post.id)) {
      const nextSaved = saved.filter((s) => s !== post.id);
      setSaved(nextSaved);
      write(KEYS.saved, nextSaved);
    }
    // apaga os comentários do post junto
    if (comments[post.id]) {
      const { [post.id]: _removed, ...rest } = comments;
      updateComments(rest);
    }
    setConfirmId(null);
    if (editingId === post.id) cancelEdit();
    if (openId === post.id) setOpenId(null);
    toast("Publicação excluída.");
  };

  /* ---------- comentários ---------- */
  const toggleComments = (postId) => {
    setOpenId((cur) => (cur === postId ? null : postId));
    setCommentDraft("");
    setEditingCommentId(null);
    setConfirmCommentId(null);
  };

  const addComment = (postId) => {
    if (!member) return navigate("/cadastro");
    const text = commentDraft.trim();
    if (!text) return;
    const comment = {
      id: `c-${Date.now()}`,
      author: member.name,
      handle: member.handle,
      text,
      createdAt: Date.now(),
    };
    updateComments({ ...comments, [postId]: [...(comments[postId] || []), comment] });
    setCommentDraft("");
  };

  const startEditComment = (c) => {
    setConfirmCommentId(null);
    setEditingCommentId(c.id);
    setEditCommentText(c.text);
  };

  const saveComment = (postId, c) => {
    if (!isOwner(c)) return;
    const text = editCommentText.trim();
    if (!text) return;
    updateComments({
      ...comments,
      [postId]: comments[postId].map((x) => (x.id === c.id ? { ...x, text, editedAt: Date.now() } : x)),
    });
    setEditingCommentId(null);
    setEditCommentText("");
  };

  const deleteComment = (postId, c) => {
    if (!isOwner(c)) return;
    updateComments({ ...comments, [postId]: comments[postId].filter((x) => x.id !== c.id) });
    setConfirmCommentId(null);
    toast("Comentário excluído.");
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

          {visible.map((post, i) => {
            const owner = isOwner(post);
            const editing = editingId === post.id;
            const list = comments[post.id] || [];
            const open = openId === post.id;
            return (
              <Reveal as="article" delay={(i % 2) * 70} className="social-post" key={post.id}>
                <div className="post-header">
                  <div className="post-author">
                    <img src={ASSET(post.avatar || SEED_AVATARS[post.id] || "8-1326.webp")} alt="" />
                    <span>
                      <b>{post.author}</b>
                      <small>
                        {post.handle} • {post.role}
                        {post.createdAt ? ` • ${timeAgo(post.createdAt)}` : ""}
                        {post.editedAt ? " • editado" : ""}
                      </small>
                    </span>
                  </div>
                  <span className="post-tag">{post.tag}</span>
                </div>

                {editing ? (
                  <div className="post-edit">
                    <textarea value={editText} onChange={(e) => setEditText(e.target.value)} rows={3} autoFocus aria-label="Editar publicação" />
                    <div className="post-edit-actions">
                      <button type="button" className="outline-button" onClick={cancelEdit}>Cancelar</button>
                      <button type="button" className="primary-button" onClick={() => saveEdit(post)}>Salvar</button>
                    </div>
                  </div>
                ) : (
                  <p className="post-text">{post.text}</p>
                )}

                {post.image && (
                  <img className="post-image" loading="lazy" src={post.image.startsWith("data:") ? post.image : ASSET(post.image)} alt={`Publicação de ${post.author}`} />
                )}

                <div className="post-footer">
                  <button type="button" className={`post-action ${post.liked ? "liked" : ""}`} onClick={() => toggleLike(post.id)} aria-pressed={post.liked}>
                    <Icon name="heart" size={18} /> {post.likes} Curtidas
                  </button>
                  <button type="button" className={`post-action ${open ? "liked" : ""}`} onClick={() => toggleComments(post.id)} aria-expanded={open}>
                    <Icon name="comment" size={18} /> {list.length} Comentários
                  </button>
                  <button type="button" className={`post-action save-action ${saved.includes(post.id) ? "saved" : ""}`} onClick={() => toggleSave(post.id)} aria-pressed={saved.includes(post.id)}>
                    <Icon name="bookmark" size={17} /> {saved.includes(post.id) ? "Salvo" : "Salvar"}
                  </button>

                  {owner && !editing && (
                    <span className="post-owner-actions">
                      {confirmId === post.id ? (
                        <>
                          <button type="button" className="post-action danger" onClick={() => deletePost(post)}>Confirmar exclusão</button>
                          <button type="button" className="post-action" onClick={() => setConfirmId(null)}>Cancelar</button>
                        </>
                      ) : (
                        <>
                          <button type="button" className="post-action" onClick={() => startEdit(post)}>Editar</button>
                          <button type="button" className="post-action danger" onClick={() => setConfirmId(post.id)}>Excluir</button>
                        </>
                      )}
                    </span>
                  )}
                </div>

                {open && (
                  <div className="comments">
                    {list.length === 0 && <p className="comments-empty">Ainda sem comentários. Seja a primeira pessoa a comentar!</p>}

                    {list.map((c) => {
                      const mine = isOwner(c);
                      const editingC = editingCommentId === c.id;
                      return (
                        <div className="comment" key={c.id}>
                          <img src={ASSET(c.avatar || "8-1326.webp")} alt="" />
                          <div className="comment-body">
                            <div className="comment-head">
                              <b>{c.author}</b>
                              <small>{c.handle} • {ago(c.createdAt)}{c.editedAt ? " • editado" : ""}</small>
                            </div>

                            {editingC ? (
                              <div className="comment-edit">
                                <textarea value={editCommentText} onChange={(e) => setEditCommentText(e.target.value)} rows={2} autoFocus aria-label="Editar comentário" />
                                <div className="post-edit-actions">
                                  <button type="button" className="outline-button" onClick={() => setEditingCommentId(null)}>Cancelar</button>
                                  <button type="button" className="primary-button" onClick={() => saveComment(post.id, c)}>Salvar</button>
                                </div>
                              </div>
                            ) : (
                              <p>{c.text}</p>
                            )}

                            {mine && !editingC && (
                              <div className="comment-actions">
                                {confirmCommentId === c.id ? (
                                  <>
                                    <button type="button" className="danger" onClick={() => deleteComment(post.id, c)}>Confirmar exclusão</button>
                                    <button type="button" onClick={() => setConfirmCommentId(null)}>Cancelar</button>
                                  </>
                                ) : (
                                  <>
                                    <button type="button" onClick={() => startEditComment(c)}>Editar</button>
                                    <button type="button" className="danger" onClick={() => setConfirmCommentId(c.id)}>Excluir</button>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {member ? (
                      <div className="comment-form">
                        <img src={ASSET("8-1326.webp")} alt="" />
                        <textarea
                          value={commentDraft}
                          onChange={(e) => setCommentDraft(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              addComment(post.id);
                            }
                          }}
                          rows={1}
                          placeholder="Escreva um comentário..."
                          aria-label="Escreva um comentário"
                        />
                        <button type="button" className="primary-button" onClick={() => addComment(post.id)} disabled={!commentDraft.trim()}>Enviar</button>
                      </div>
                    ) : (
                      <button type="button" className="outline-button comment-login" onClick={() => navigate("/cadastro")}>
                        Crie uma conta para comentar
                      </button>
                    )}
                  </div>
                )}
              </Reveal>
            );
          })}
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