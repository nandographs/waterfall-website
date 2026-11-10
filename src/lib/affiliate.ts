const KEY = "wd_ref";
const DAYS = 30;

export const FUNCTIONS_URL = import.meta.env.VITE_SUPABASE_URL
  ? `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`
  : null;

/** Conta o clique 1x por sessão e por código (recarregar a página não infla o número). */
function trackClick(ref: string) {
  if (!FUNCTIONS_URL) return;
  try {
    if (sessionStorage.getItem(`wd_click_${ref}`)) return;
    sessionStorage.setItem(`wd_click_${ref}`, "1");
  } catch {
    return;
  }
  fetch(`${FUNCTIONS_URL}/track-click`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: import.meta.env.VITE_SUPABASE_ANON_KEY },
    body: JSON.stringify({ code: ref, path: window.location.pathname }),
    keepalive: true,
  }).catch(() => {});
}

/** Guarda ?ref=CODIGO por 30 dias (último clique vale). O checkout lê com getAffiliateRef(). */
export function captureAffiliateRef() {
  try {
    const ref = new URLSearchParams(window.location.search).get("ref")?.toLowerCase();
    if (ref && /^[a-z0-9_-]{3,30}$/.test(ref)) {
      localStorage.setItem(KEY, JSON.stringify({ ref, exp: Date.now() + DAYS * 864e5 }));
      trackClick(ref);
    }
  } catch {
    /* localStorage bloqueado: segue sem afiliado */
  }
}

export function getAffiliateRef(): string | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const { ref, exp } = JSON.parse(raw) as { ref: string; exp: number };
    if (Date.now() > exp) {
      localStorage.removeItem(KEY);
      return null;
    }
    return ref;
  } catch {
    return null;
  }
}
