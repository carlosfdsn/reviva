// localStorage com proteção: modo privado ou cota cheia não derrubam o app.
export function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw == null ? fallback : (JSON.parse(raw) ?? fallback);
  } catch {
    return fallback;
  }
}

export function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function remove(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    /* ignora */
  }
}

export const KEYS = {
  member: "reviva-member",
  posts: "reviva-posts",
  saved: "reviva-saved-posts",
  theme: "reviva-theme",
  steps: (slug) => `reviva-steps-${slug}`,
};
