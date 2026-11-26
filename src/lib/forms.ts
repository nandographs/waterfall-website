import { EMAIL_RE, NAME_RE, isPhone } from "./validation";

const FORM_ENDPOINT = "https://api.web3forms.com/submit";

// As chaves ficam em variáveis de ambiente (.env.local). Os valores de fallback
// mantêm o site funcionando em builds antigos que ainda não têm o .env definido.
const ACCESS_KEYS = {
  contato: import.meta.env.VITE_WEB3FORMS_KEY_CONTATO || "8994e420-29d7-4bce-b0e8-a5c5fb4b0ccb",
  consultor: import.meta.env.VITE_WEB3FORMS_KEY_CONSULTOR || "68c4bc60-1148-48f3-b2c4-612ea537bafb",
  fitacademia: import.meta.env.VITE_WEB3FORMS_KEY_FITACADEMIA || "1bae73ea-953d-4c39-b6ad-00dc0f92848c",
} as const;

export type FormKind = keyof typeof ACCESS_KEYS;

type SubmitOptions = {
  kind: FormKind;
  subject: string;
  fromName: string;
  /** Campos extras que não estão no <form>, como o produto de origem do lead. */
  extraFields?: Record<string, string>;
};

const MAX_FIELD = 500;

/** Campos com regra própria, pelo `name` do input. Os demais só têm limite de tamanho. */
const RULES: Record<string, (v: string) => string | null> = {
  name: (v) => (NAME_RE.test(v) ? null : "Confira o nome: use só letras, com pelo menos 2."),
  nome: (v) => (NAME_RE.test(v) ? null : "Confira o nome: use só letras, com pelo menos 2."),
  email: (v) => (!v || (v.length <= 254 && EMAIL_RE.test(v)) ? null : "Confira o e-mail."),
  phone: (v) => (isPhone(v) ? null : "Confira o telefone com DDD."),
  whatsapp: (v) => (isPhone(v) ? null : "Confira o WhatsApp com DDD."),
};

/** Valida e limpa os campos antes do envio. Lança Error com a primeira mensagem de problema. */
function cleanFormData(form: HTMLFormElement) {
  const raw = new FormData(form);
  // Honeypot marcado: é robô. Finge sucesso para não ensinar o bot a contornar.
  if (raw.get("botcheck")) return null;
  const clean = new FormData();
  for (const [key, value] of raw.entries()) {
    if (typeof value !== "string" || key === "botcheck") continue;
    const v = value.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "").trim();
    if (v.length > MAX_FIELD) throw new Error("Um dos campos está longo demais.");
    const problem = RULES[key]?.(v);
    if (problem) throw new Error(problem);
    clean.append(key, v);
  }
  return clean;
}

// Formulários com envio em andamento: impede envio duplicado por clique duplo ou Enter repetido.
const inFlight = new WeakSet<HTMLFormElement>();

/**
 * Envia um formulário para o Web3Forms e normaliza a resposta de erro.
 * Lança um Error com mensagem legível quando o envio falha.
 */
export async function submitWeb3Form(form: HTMLFormElement, options: SubmitOptions) {
  if (inFlight.has(form)) throw new Error("Seu envio já está em andamento.");
  const payload = cleanFormData(form);
  if (!payload) return { success: true };
  inFlight.add(form);
  try {
    return await send(payload, options);
  } finally {
    inFlight.delete(form);
  }
}

async function send(payload: FormData, options: SubmitOptions) {
  payload.append("access_key", ACCESS_KEYS[options.kind]);
  payload.append("subject", options.subject);
  payload.append("from_name", options.fromName);

  for (const [name, value] of Object.entries(options.extraFields ?? {})) {
    payload.append(name, value.slice(0, MAX_FIELD));
  }

  // Sem timeout o botão pode ficar em "Enviando..." para sempre numa rede ruim.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  let response: Response;
  try {
    response = await fetch(FORM_ENDPOINT, {
      method: "POST",
      body: payload,
      headers: { Accept: "application/json" },
      signal: controller.signal,
      referrerPolicy: "no-referrer",
      mode: "cors",
    });
  } catch (error) {
    throw new Error(
      (error as Error)?.name === "AbortError"
        ? "O envio demorou demais. Verifique sua conexão e tente novamente."
        : "Não foi possível enviar sua solicitação. Tente novamente.",
    );
  } finally {
    clearTimeout(timeout);
  }

  const result = await response.json().catch(() => ({}));

  if (!response.ok || result.success === false) {
    // A mensagem do serviço fica só no console; o visitante vê um texto nosso.
    console.error("[forms] envio recusado:", response.status, result.message);
    throw new Error(
      response.status === 429
        ? "Muitos envios seguidos. Aguarde um minuto e tente de novo."
        : "Não foi possível enviar sua solicitação. Tente novamente.",
    );
  }

  return result;
}

const WHATSAPP_NUMBER = "5547992828752";

export const whatsappLink = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

/** Conversa iniciada direto pelo botão flutuante, sem passar por formulário. */
export const WHATSAPP_DIRECT_URL = whatsappLink(
  "Olá! Vim pelo site da Water Diamond Ion Center e quero falar com um consultor.",
);

/** Conversa iniciada depois que o lead já preencheu o formulário. */
export const WHATSAPP_AFTER_FORM_URL = whatsappLink(
  "Olá, acabei de enviar meus dados pelo site Water Diamond Ion Center e quero falar com um consultor.",
);

/**
 * Página /fitacademia (QR code na Fit Academia, Joinville).
 * A mensagem cita a academia para atribuir a origem do lead sem perguntar nada.
 */
export const WHATSAPP_FIT_URL = whatsappLink(
  "Olá! Vim pelo QR code da Fit Academia e quero conhecer a linha Water Diamond Ion Center.",
);
