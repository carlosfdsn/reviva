import { useEffect, useRef } from "react";
import { tutorials } from "./data/content.js";
import { useRoute } from "./lib/router.jsx";
import { ThemeProvider } from "./lib/theme.jsx";
import { ToastProvider } from "./components/ui.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import HomePage from "./pages/Home.jsx";
import TutorialsPage from "./pages/Tutorials.jsx";
import TutorialPage from "./pages/Tutorial.jsx";
import CollectionPage from "./pages/Collection.jsx";
import GuidePage from "./pages/Guide.jsx";
import CommunityPage from "./pages/Community.jsx";
import SignupPage from "./pages/Signup.jsx";
import ProfilePage from "./pages/Profile.jsx";
import SwitchAccountPage from "./pages/SwitchAccount.jsx";
import NotFoundPage from "./pages/NotFound.jsx";

function renderRoute(path, search) {
  if (path.startsWith("/tutorial/")) {
    const item = tutorials.find((t) => t.slug === path.split("/")[2]);
    return item ? <TutorialPage key={item.slug} item={item} /> : <NotFoundPage />;
  }
  switch (path) {
    case "/": return <HomePage />;
    case "/comunidade": return <CommunityPage />;
    case "/cadastro": return <SignupPage />;
    case "/perfil": return <ProfilePage />;
    case "/trocar-conta": return <SwitchAccountPage />;
    case "/tutoriais-upcycling": return <TutorialsPage search={search} />;
    case "/pontos-de-coleta": return <CollectionPage />;
    case "/guia-de-reciclagem": return <GuidePage />;
    default: return <NotFoundPage />;
  }
}

function Shell() {
  const { path, search } = useRoute();
  const main = useRef(null);
  const first = useRef(true);

  // Depois de trocar de página, leva o foco ao conteúdo (leitores de tela e teclado).
  useEffect(() => {
    if (first.current) first.current = false;
    else main.current?.focus({ preventScroll: true });
  }, [path]);

  return (
    <>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <Header path={path} />
      <main id="conteudo" ref={main} tabIndex={-1} className="page" key={path + search}>
        {renderRoute(path, search)}
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <Shell />
      </ToastProvider>
    </ThemeProvider>
  );
}

export { tutorials };
