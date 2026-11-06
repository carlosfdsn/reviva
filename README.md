# REVIVA — Reciclagem Circular

## O que é

REVIVA é um frontend de reciclagem circular e upcycling. O projeto apresenta ideias para transformar materiais descartáveis em objetos úteis, orienta a separação de resíduos, lista pontos de coleta e oferece uma área comunitária para compartilhar ideias e fotos.

A aplicação resolve um problema de descoberta e orientação: ajuda a pessoa a decidir o que fazer com um material, encontrar um tutorial passo a passo ou encaminhar o descarte para um ponto apresentado na interface.

## Tecnologias utilizadas

| Tecnologia | Uso no projeto |
| --- | --- |
| React | Componentes, páginas e gerenciamento de estado local. |
| React DOM | Montagem do componente `App` no elemento `#root`, em `src/main.jsx`. |
| Vite | Servidor de desenvolvimento, build e preview. |
| Framer Motion | Transição de entrada e saída entre páginas em `src/App.jsx`. |
| CSS | Design system, responsividade, modo claro/escuro, estados e animações CSS em `src/styles.css`. |
| History API | Roteamento próprio por `window.history.pushState` e evento `popstate`. |
| `localStorage` | Persistência local de tema, membro, posts e posts salvos. |

As fontes `DM Sans` e `Newsreader` são carregadas em `index.html` por links do Google Fonts. Os ícones principais são SVGs renderizados pelo componente `Icon`; as imagens usadas na aplicação ficam em `public/assets`.

## Pré-requisitos

- Node.js com npm.

- Acesso ao diretório do projeto.

- Porta local `3000` disponível, pois os scripts usam essa porta.

As versões das dependências são controladas por `package-lock.json`. Algumas dependências do `package.json` estão declaradas como `latest`; portanto, para reproduzir exatamente a instalação registrada, prefira `npm ci`.

## Instalação e execução

```bash
npm ci
npm run dev
```

O servidor de desenvolvimento é iniciado pelo script `dev` com Vite, escutando em `0.0.0.0:3000`. Acesse `http://localhost:3000`.

Para gerar a versão de produção:

```bash
npm run build
```

Para servir a build gerada em modo de preview:

```bash
npm run preview
```

Os scripts estão definidos em `package.json`:

| Script | Comando | Finalidade |
| --- | --- | --- |
| `dev` | `vite --host 0.0.0.0 --port 3000` | Desenvolvimento. |
| `build` | `vite build` | Geração dos arquivos de produção em `dist/`. |
| `preview` | `vite preview --host 0.0.0.0 --port 3000` | Visualização local da build. |

## Estrutura de pastas

```
.
├── index.html                 # HTML base, metadata, fontes e ponto de montagem
├── package.json               # Scripts e dependências
├── package-lock.json          # Instalação registrada do npm
├── vite.config.js             # Plugin React e configuração do servidor Vite
├── app.config.ts              # Logo do projeto no ambiente WebDev
├── public/
│   ├── assets/                # Imagens e SVGs locais usados pela interface
│   └── manus-routes.json      # Manifesto das rotas declaradas
├── src/
│   ├── App.jsx                # Dados, componentes, páginas, roteamento e estados
│   ├── FigmaSource.jsx        # Código convertido do design original; não é importado por main.jsx
│   ├── FigmaSocialSource.jsx  # Código convertido da referência social; não é importado por main.jsx
│   ├── main.jsx               # Inicialização do React
│   └── styles.css             # Estilos globais e responsivos
├── docs/                      # Documentação técnica
└── dist/                      # Saída gerada por `npm run build`; não é fonte
```

## Principais funcionalidades

- Página inicial com hero, indicadores, ideias em destaque e categorias de materiais.

- Listagem de tutoriais com busca e filtros por material.

- Tutoriais detalhados com ficha técnica, materiais necessários, instruções e progresso local da página.

- Guia de separação de papel, plástico, vidro, metal e eletrônicos, com acordeão.

- Página de pontos de coleta com busca textual e seleção local de pontos.

- Comunidade com posts iniciais, publicação de texto, seleção de material, upload local de imagem, curtidas e salvamento de posts.

- Cadastro demonstrativo e perfil local.

- Tela para esquecer o perfil salvo e trocar de conta.

- Tema claro/escuro persistido no navegador.

- Layout responsivo e menu móvel.

## Observações

Não há backend, banco de dados, autenticação real, API REST ou armazenamento remoto implementado no código analisado. O cadastro, os posts, as curtidas, os salvos e o upload funcionam no navegador por meio de estado React e `localStorage`.
