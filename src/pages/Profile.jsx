import { useState } from "react";
import { seedPosts, tutorials } from "../data/content.js";
import { Link, navigate, usePageTitle } from "../lib/router.jsx";
import { KEYS, read } from "../lib/storage.js";
import { timeAgo } from "../lib/image.js";
import TutorialCard from "../components/TutorialCard.jsx";
import { ASSET, Icon, Reveal, SectionKicker, useToast } from "../components/ui.jsx";

function PostCard({ post }) {
  return (
    <article className="profile-post">
      <img src={post.image?.startsWith("data:") ? post.image : ASSET(post.image || "8-1359.webp")} alt="" loading="lazy" />
      <div>
        <span>{post.tag}</span>
        <h3>{post.text.slice(0, 54)}{post.text.length > 54 ? "…" : ""}</h3>
        <small>{post.createdAt ? timeAgo(post.createdAt) : post.author}</small>
      </div>
    </article>
  );
}

export default function ProfilePage() {
  usePageTitle("Meu Perfil · REVIVA");
  const toast = useToast();
  const [tab, setTab] = useState("posts");
  const member = read(KEYS.member, null);
  const allPosts = read(KEYS.posts, seedPosts);
  const saved = read(KEYS.saved, []);

  if (!member)
    return (
      <div className="profile-page page-shell">
        <Reveal className="profile-empty">
          <SectionKicker>Seu espaço na comunidade</SectionKicker>
          <h1>Crie um perfil para <em>guardar suas ideias.</em></h1>
          <p>Salve tutoriais, publique fotos dos seus projetos e acompanhe o impacto de cada escolha.</p>
          <Link to="/cadastro" className="primary-button">Criar minha conta <Icon name="arrowRight" size={16} /></Link>
        </Reveal>
      </div>
    );

  const posts = allPosts.filter((p) => p.author === member.name);
  const savedPosts = allPosts.filter((p) => saved.includes(p.id));
  const savedTutorials = tutorials.filter((t) => saved.includes(`tutorial:${t.slug}`));
  const savedCount = savedPosts.length + savedTutorials.length;

  return (
    <div className="profile-page page-shell">
      <Reveal as="section" className="profile-header">
        <div className="profile-top">
          <div className="profile-identity">
            <img src={ASSET("8-1326.webp")} alt="" />
            <div>
              <div className="profile-name-row">
                <h1>{member.name}</h1>
                <span>Membro Ativo</span>
              </div>
              <p>{member.handle} • Comunidade REVIVA</p>
            </div>
          </div>
          <button type="button" className="outline-button" onClick={() => toast("O editor de perfil estará disponível em breve.")}>Editar Perfil</button>
        </div>
        <div className="profile-about">
          <div>
            <SectionKicker>Sobre mim</SectionKicker>
            <p>Estudante de design apaixonada por descobrir novas utilidades para o lixo doméstico. Compartilho aqui cada tentativa, aprendizado e novo começo.</p>
          </div>
          <div className="profile-stats">
            <span><b>{posts.length}</b>Posts</span>
            <span><b>{savedCount}</b>Salvos</span>
          </div>
        </div>
      </Reveal>
      <div className="profile-tabs" role="tablist">
        <button type="button" role="tab" aria-selected={tab === "posts"} className={tab === "posts" ? "active" : ""} onClick={() => setTab("posts")}>Minhas Publicações</button>
        <button type="button" role="tab" aria-selected={tab === "saved"} className={tab === "saved" ? "active" : ""} onClick={() => setTab("saved")}>Tutoriais Salvos ({savedCount})</button>
      </div>
      <div className="profile-grid" key={tab}>
        {tab === "posts" ? (
          posts.length ? posts.map((p, i) => <Reveal key={p.id} delay={i * 60}><PostCard post={p} /></Reveal>) : (
            <div className="profile-empty-card">
              Você ainda não publicou. <button type="button" onClick={() => navigate("/comunidade")}>Compartilhe sua primeira ideia.</button>
            </div>
          )
        ) : savedCount ? (
          <>
            {savedTutorials.map((t, i) => <Reveal key={t.slug} delay={i * 60}><TutorialCard item={t} /></Reveal>)}
            {savedPosts.map((p, i) => <Reveal key={p.id} delay={i * 60}><PostCard post={p} /></Reveal>)}
          </>
        ) : (
          <div className="profile-empty-card">
            Nada salvo ainda. <button type="button" onClick={() => navigate("/tutoriais-upcycling")}>Explore os tutoriais.</button>
          </div>
        )}
      </div>
    </div>
  );
}
