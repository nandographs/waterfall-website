const FORM_ENDPOINT = "https://api.web3forms.com/submit";

// As chaves ficam em variáveis de ambiente (.env.local). Os valores de fallback
// mantêm o site funcionando em builds antigos que ainda não têm o .env definido.
const ACCESS_KEYS = {
  contato: import.meta.env.VITE_WEB3FORMS_KEY_CONTATO ?? "8994e420-29d7-4bce-b0e8-a5c5fb4b0ccb",
  consultor: import.meta.env.VITE_WEB3FORMS_KEY_CONSULTOR ?? "68c4bc60-1148-48f3-b2c4-612ea537bafb",
  fitacademia: import.meta.env.VITE_WEB3FORMS_KEY_FITACADEMIA ?? "1bae73ea-953d-4c39-b6ad-00dc0f92848c",
} as const;

export type FormKind = keyof typeof ACCESS_KEYS;

type SubmitOptions = {
  kind: FormKind;
  subject: string;
  fromName: string;
  /** Campos extras que não estão no <form>, como o produto de origem do lead. */
  extraFields?: Record<string, string>;
};

/**
 * Envia um formulário para o Web3Forms e normaliza a resposta de erro.
 * Lança um Error com mensagem legível quando o envio falha.
 */
export async function submitWeb3Form(form: HTMLFormElement, options: SubmitOptions) {
  const payload = new FormData(form);
  payload.append("access_key", ACCESS_KEYS[options.kind]);
  payload.append("subject", options.subject);
  payload.append("from_name", options.fromName);

  for (const [name, value] of Object.entries(options.extraFields ?? {})) {
    payload.append(name, value);
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
    throw new Error(result.message || "Não foi possível enviar sua solicitação. Tente novamente.");
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
