import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

export const ASSET = (name) => `/assets/${name}`;

const reduced = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/* ---------- Ícones ---------- */
const ICONS = {
  arrow: <path d="m14.5 5-7 7 7 7" />,
  arrowRight: <path d="m9.5 5 7 7-7 7" />,
  chevronRight: <path d="m9.5 5 7 7-7 7" />,
  chevronLeft: <path d="m14.5 5-7 7 7 7" />,
  pin: (<><path d="M12 21.2c-1-.9-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-5.5 10.1-6.5 11Z" /><circle cx="12" cy="10.2" r="2.4" /></>),
  search: (<><circle cx="10.8" cy="10.8" r="6.3" /><path d="m15.5 15.5 4.7 4.7" /></>),
  menu: <path d="M4.5 7.5h15M4.5 12h15M4.5 16.5h15" />,
  close: <path d="m6.5 6.5 11 11M17.5 6.5l-11 11" />,
  check: <path d="m5.5 12.5 4.2 4.2L18.5 7.5" />,
  leaf: (<><path d="M19.5 4.5C11 4.5 5.5 8.6 5.5 14.8c0 2.4 1.9 4.2 4.2 4.2 6.2 0 9.8-5.4 9.8-14.5Z" /><path d="M4.5 20c2.6-4 5.6-6.6 10-9" /></>),
  heart: <path d="M12 20.2S3.6 15.2 3.6 9.2A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8.4 2.2c0 6-8.4 11-8.4 11Z" />,
  comment: <path d="M12 4.5c4.7 0 8.3 3 8.3 7s-3.6 7-8.3 7c-.9 0-1.8-.1-2.6-.3L5.2 20l1-3.5C4.7 15.3 3.7 13.8 3.7 11.5c0-4 3.6-7 8.3-7Z" />,
  bookmark: <path d="M7 4.5h10a1 1 0 0 1 1 1V20l-6-4.2L6 20V5.5a1 1 0 0 1 1-1Z" />,
  image: (<><rect x="3.5" y="5" width="17" height="14" rx="3" /><circle cx="9" cy="10" r="1.6" /><path d="m4.5 17.5 4.7-4.7 3.3 3.3 2.2-2.2 4.8 4.6" /></>),
  hash: <path d="M9.5 4.5 8 19.5M16 4.5l-1.5 15M4.5 9h15M4 15h15" />,
  sun: (<><circle cx="12" cy="12" r="4" /><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" /></>),
  moon: <path d="M19.5 14.4A8 8 0 0 1 9.6 4.5a8 8 0 1 0 9.9 9.9Z" />,
  eye: (<><path d="M2.8 12S6.2 6 12 6s9.2 6 9.2 6-3.4 6-9.2 6S2.8 12 2.8 12Z" /><circle cx="12" cy="12" r="2.6" /></>),
  eyeOff: (<><path d="m4 4 16 16" /><path d="M10.3 6.2A9 9 0 0 1 12 6c5.8 0 9.2 6 9.2 6a15 15 0 0 1-2.8 3.4M6.5 7.5A15 15 0 0 0 2.8 12S6.2 18 12 18a9 9 0 0 0 3.7-.8" /><path d="M9.9 9.9a2.6 2.6 0 0 0 3.6 3.6" /></>),
  clock: (<><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 1.8" /></>),
  home: (<><path d="m3.8 11.2 8.2-7 8.2 7" /><path d="M6 9.6v8.7c0 .9.8 1.7 1.7 1.7H10v-5h4v5h2.3c.9 0 1.7-.8 1.7-1.7V9.6" /></>),
  book: (<><path d="M12 6.4C10.3 5.2 7.9 4.8 4.8 5v12.8c3.1-.2 5.5.2 7.2 1.4 1.7-1.2 4.1-1.6 7.2-1.4V5c-3.1-.2-5.5.2-7.2 1.4Z" /><path d="M12 6.4v12.8" /></>),
  scissors: (<><circle cx="6.2" cy="7" r="2.4" /><circle cx="6.2" cy="17" r="2.4" /><path d="m8 8.6 11.5 8M8 15.4l11.5-8" /></>),
  people: (<><circle cx="9" cy="8.4" r="3" /><path d="M3.4 19.2c.5-3.3 2.8-5.1 5.6-5.1s5.1 1.8 5.6 5.1" /><circle cx="17" cy="9.4" r="2.4" /><path d="M16.2 14.3c2.6-.2 4.2 1.2 4.6 3.9" /></>),
  person: (<><circle cx="12" cy="12" r="8.8" /><circle cx="12" cy="10.2" r="2.9" /><path d="M6.4 18c1.2-2.3 3.1-3.3 5.6-3.3s4.4 1 5.6 3.3" /></>),
  swap: (<><path d="M4.5 8h14m-3.6-3.6L18.5 8l-3.6 3.6" /><path d="M19.5 16h-14m3.6-3.6L5.5 16l3.6 3.6" /></>),
  doc: (<><path d="M7.2 3.8h6.3l4.5 4.5v10.5a1.9 1.9 0 0 1-1.9 1.9H7.2a1.9 1.9 0 0 1-1.9-1.9V5.7a1.9 1.9 0 0 1 1.9-1.9Z" /><path d="M13.5 3.8v4.5H18M8.6 13h6.8M8.6 16.4h4.6" /></>),
  cube: (<><path d="M12 3.4 4.2 7.6v8.8l7.8 4.2 7.8-4.2V7.6Z" /><path d="m4.2 7.6 7.8 4.2 7.8-4.2M12 11.8v8.8" /></>),
  instagram: (<><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="3.8" /><circle cx="17" cy="7" r=".6" fill="currentColor" /></>),
  facebook: <path d="M14 8.5h2.5V5H14c-2.2 0-3.5 1.5-3.5 3.5V11H8v3.5h2.5V21H14v-6.5h2.4l.6-3.5H14V9a.5.5 0 0 1 .5-.5Z" />,
  youtube: (<><rect x="2.5" y="5.5" width="19" height="13" rx="4" /><path d="m10.5 9.5 4 2.5-4 2.5Z" /></>),
};

export function Icon({ name, size = 20 }) {
  return (
    <svg aria-hidden="true" focusable="false" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {ICONS[name]}
    </svg>
  );
}

/* ---------- Revelar ao rolar ---------- */
export function useInView(options = { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    if (!("IntersectionObserver" in window) || reduced()) return setSeen(true);
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setSeen(true);
        io.disconnect();
      }
    }, options);
    io.observe(el);
    return () => io.disconnect();
  }, [seen]);
  return [ref, seen];
}

export function Reveal({ as: Tag = "div", delay = 0, className = "", children, ...rest }) {
  const [ref, seen] = useInView();
  return (
    <Tag ref={ref} className={`reveal ${seen ? "in" : ""} ${className}`} style={{ "--d": `${delay}ms` }} {...rest}>
      {children}
    </Tag>
  );
}

/* ---------- Contador animado ---------- */
export function CountUp({ to, duration = 1400 }) {
  const [ref, seen] = useInView({ threshold: 0.6 });
  const [value, setValue] = useState(reduced() ? to : 0);
  useEffect(() => {
    if (!seen || reduced()) return setValue(to);
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      setValue(Math.round(to * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, to, duration]);
  return <span ref={ref}>{value}</span>;
}

export function SectionKicker({ children }) {
  return (
    <div className="section-kicker">
      <span />
      {children}
    </div>
  );
}

/* ---------- Toast (substitui alert()) ---------- */
const ToastContext = createContext(() => {});
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const timer = useRef();
  const show = useCallback((message) => {
    clearTimeout(timer.current);
    setToast({ message, id: Date.now() });
    timer.current = setTimeout(() => setToast(null), 3400);
  }, []);
  useEffect(() => () => clearTimeout(timer.current), []);
  return (
    <ToastContext.Provider value={show}>
      {children}
      <div className="toast-region" role="status" aria-live="polite">
        {toast && (
          <div className="toast" key={toast.id}>
            <Icon name="leaf" size={18} />
            {toast.message}
          </div>
        )}
      </div>
    </ToastContext.Provider>
  );
}
