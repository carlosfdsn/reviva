import { useState } from "react";
import { Link, navigate, usePageTitle } from "../lib/router.jsx";
import { KEYS, write } from "../lib/storage.js";
import { ASSET, Icon, Reveal, SectionKicker } from "../components/ui.jsx";

const makeHandle = (name) => {
  const first = name.trim().split(/\s+/)[0] || "";
  const slug = first.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");
  return `@${slug || "membro"}`;
};

export default function SignupPage() {
  usePageTitle("Criar conta · REVIVA");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [terms, setTerms] = useState(false);
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState(null);
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = (event) => {
    event.preventDefault();
    if (form.password.length < 8) return setMessage({ type: "error", text: "Crie uma senha com pelo menos 8 caracteres." });
    if (form.password !== form.confirm) return setMessage({ type: "error", text: "As senhas precisam ser iguais." });
    if (!terms) return setMessage({ type: "error", text: "Leia e concorde com os Termos de Serviço para continuar." });
    write(KEYS.member, { name: form.name.trim(), email: form.email.trim(), handle: makeHandle(form.name) });
    navigate("/comunidade");
  };

  return (
    <div className="signup-page">
      <div className="signup-layout page-shell">
        <Reveal as="form" className="signup-card" onSubmit={submit} noValidate={false}>
          <div className="signup-heading">
            <SectionKicker>Faça parte da mudança</SectionKicker>
            <h1>Crie sua conta no REVIVA</h1>
            <p>Cadastre-se para encontrar pontos de descarte inteligentes, acompanhar seu impacto positivo e aprender com nossa comunidade criativa de upcycling.</p>
          </div>
          <div className="field">
            <label htmlFor="f-name">Nome completo</label>
            <input id="f-name" required autoComplete="name" value={form.name} onChange={set("name")} placeholder="Ex: Ana Silva Santos" />
          </div>
          <div className="field">
            <label htmlFor="f-email">E-mail</label>
            <input id="f-email" required type="email" autoComplete="email" value={form.email} onChange={set("email")} placeholder="ana@exemplo.com" />
          </div>
          <div className="field">
            <label htmlFor="f-pass">Senha</label>
            <div className="password-field">
              <input id="f-pass" required type={show ? "text" : "password"} autoComplete="new-password" value={form.password} onChange={set("password")} placeholder="Crie uma senha forte (mín. 8 caracteres)" />
              <button type="button" onClick={() => setShow(!show)} aria-label={show ? "Ocultar senha" : "Mostrar senha"}>
                <Icon name={show ? "eyeOff" : "eye"} size={18} />
              </button>
            </div>
          </div>
          <div className="field">
            <label htmlFor="f-confirm">Confirmar senha</label>
            <input id="f-confirm" required type={show ? "text" : "password"} autoComplete="new-password" value={form.confirm} onChange={set("confirm")} placeholder="Digite a senha novamente" />
          </div>
          <label className="terms-check">
            <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} />
            <span>Li e concordo com os Termos de Serviço e a Política de Privacidade da plataforma.</span>
          </label>
          {message && (
            <div className={`form-message ${message.type}`} role={message.type === "error" ? "alert" : "status"} key={message.text}>
              {message.text}
            </div>
          )}
          <button className="primary-button signup-submit" type="submit">Fazer cadastro</button>
          <div className="signup-divider"><span /> ou <span /></div>
          <button
            type="button"
            className="google-button"
            onClick={() => {
              setForm({ name: "Membro Google", email: "membro@google.com", password: "reviva123", confirm: "reviva123" });
              setTerms(true);
              setMessage({ type: "info", text: "Confira os dados preenchidos e finalize seu cadastro." });
            }}
          >
            <b>G</b> Cadastrar com o Google
          </button>
          <p className="login-redirect">
            Já tem uma conta? <Link to="/comunidade">Fazer login</Link>
          </p>
        </Reveal>
        <Reveal className="signup-image" delay={150}>
          <img src={ASSET("14-63.webp")} alt="Pessoa transformando materiais em novos objetos" />
          <div>
            <strong>Uma pequena gestão do lixo transforma o gesto em futuro.</strong>
            <span>Faça parte de uma comunidade que cria, compartilha e cuida.</span>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
