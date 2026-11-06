import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

export const ASSET = (name) => `/assets/${name}`;

const reduced = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/* ---------- Ícones ---------- */
const ICONS = {
  arrow: (<><path d="M4 12h16" /><path d="m10 6-6 6 6 6" /></>),
  arrowRight: (<><path d="M4 12h16" /><path d="m14 6 6 6-6 6" /></>),
  pin: (<><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>),
  search: (<><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></>),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  check: <path d="m5 12 4 4L19 6" />,
  leaf: (<><path d="M20 4C11 4 5 8 5 15c0 2.2 1.8 4 4 4 7 0 11-6 11-15Z" /><path d="M4 20c3-4 6-7 11-10" /></>),
  heart: <path d="M20.8 8.8c0 5.5-8.8 10.7-8.8 10.7S3.2 14.3 3.2 8.8A4.6 4.6 0 0 1 12 6.6a4.6 4.6 0 0 1 8.8 2.2Z" />,
  comment: <path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4.1A8 8 0 1 1 20 12Z" />,
  bookmark: <path d="M6 4h12v17l-6-4-6 4Z" />,
  image: (<><rect x="3.5" y="4.5" width="17" height="15" rx="3" /><circle cx="9" cy="10" r="1.6" /><path d="m5 18 5-5 3 3 2-2 4 4" /></>),
  hash: <path d="M9 4 7 20M17 4l-2 16M4.5 9h16M3.5 15h16" />,
  sun: (<><circle cx="12" cy="12" r="4" /><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6" /></>),
  moon: <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z" />,
  eye: (<><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" /><circle cx="12" cy="12" r="2.8" /></>),
  eyeOff: (<><path d="M3 3l18 18" /><path d="M10.6 5.7A9.7 9.7 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a16 16 0 0 1-2.6 3.3M6.6 6.9A16 16 0 0 0 2.5 12S6 18.5 12 18.5a9.6 9.6 0 0 0 4-.9" /><path d="M9.9 9.9a2.8 2.8 0 0 0 4 4" /></>),
  clock: (<><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>),
  instagram: (<><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="3.8" /><circle cx="17" cy="7" r=".6" fill="currentColor" /></>),
  facebook: <path d="M14 8.5h2.5V5H14c-2.2 0-3.5 1.5-3.5 3.5V11H8v3.5h2.5V21H14v-6.5h2.4l.6-3.5H14V9a.5.5 0 0 1 .5-.5Z" />,
  youtube: (<><rect x="2.5" y="5.5" width="19" height="13" rx="4" /><path d="m10.5 9.5 4 2.5-4 2.5Z" /></>),
};

export function Icon({ name, size = 20 }) {
  return (
    <svg aria-hidden="true" focusable="false" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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
