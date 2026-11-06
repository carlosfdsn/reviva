import { useEffect, useState } from "react";

// Roteador mínimo baseado em History API (sem dependências).
const clean = (p) => (p.length > 1 ? p.replace(/\/+$/, "") : p) || "/";

export function navigate(to, { replace = false } = {}) {
  const url = new URL(to, window.location.origin);
  const target = url.pathname + url.search + url.hash;
  const same =
    url.pathname + url.search === window.location.pathname + window.location.search;
  window.history[replace || same ? "replaceState" : "pushState"]({}, "", target);
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
}

export function useRoute() {
  const read = () => ({
    path: clean(window.location.pathname),
    search: window.location.search,
  });
  const [route, setRoute] = useState(read);
  useEffect(() => {
    const onPop = () => setRoute(read());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  return route;
}

// <a> de verdade: funciona com clique do meio, "abrir em nova aba" e leitores de tela.
export function Link({ to, onClick, children, ...rest }) {
  const handle = (e) => {
    onClick?.(e);
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      rest.target === "_blank"
    )
      return;
    e.preventDefault();
    navigate(to);
  };
  return (
    <a href={to} onClick={handle} {...rest}>
      {children}
    </a>
  );
}

export function usePageTitle(title) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
