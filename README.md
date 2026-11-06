# REVIVA — frontend (React + Vite)

## Executar

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # gera a versão de produção
```

## Estrutura

- `index.html` — aplica o tema (claro/escuro) antes da primeira pintura.
- `src/App.jsx` — layout e tabela de rotas.
- `src/pages/` — uma página por arquivo (Home, Tutorials, Tutorial, Collection, Guide, Community, Signup, Profile, SwitchAccount, NotFound).
- `src/components/` — Header, Footer, TutorialCard e `ui.jsx` (ícones, Reveal, CountUp, Toast).
- `src/lib/` — roteador (`router.jsx`), tema (`theme.jsx`), `storage.js` (localStorage seguro) e `image.js`.
- `src/data/content.js` — tutoriais, pontos de coleta, guia e posts de exemplo.
- `src/styles.css` — tokens de cor (`:root` e `:root[data-theme="dark"]`), componentes, animações e responsivo.
- `public/assets/` — imagens e ícones locais.

## Tema claro/escuro

Segue o tema do sistema na primeira visita; o botão no cabeçalho alterna e guarda a escolha (`reviva-theme`). Para mudar cores, edite as variáveis no topo de `styles.css`.
