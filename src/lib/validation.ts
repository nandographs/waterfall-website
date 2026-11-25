/**
 * Regras de validação dos formulários. O servidor (create-checkout) repete as mesmas regras:
 * aqui elas só evitam ida e volta e mostram o erro na hora.
 */

export const EMAIL_RE = /^[^\s@]{1,64}@[^\s@.]+(\.[^\s@.]+)+$/;
export const NAME_RE = /^[\p{L}\p{M}' .-]{2,120}$/u;

export const onlyDigits = (v: string) => v.replace(/\D/g, "");

/** Telefone brasileiro com DDD (10 ou 11 dígitos), aceitando o +55 na frente. */
export const isPhone = (v: string) => /^(55)?\d{10,11}$/.test(onlyDigits(v));

export function isValidCpf(value: string) {
  const cpf = onlyDigits(value);
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  for (const len of [9, 10]) {
    let sum = 0;
    for (let i = 0; i < len; i++) sum += Number(cpf[i]) * (len + 1 - i);
    if (((sum * 10) % 11) % 10 !== Number(cpf[len])) return false;
  }
  return true;
}

export const UFS = new Set("AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO".split(" "));

/** A fatura do pagamento só pode abrir no domínio do Asaas (evita redirecionar o cliente para outro site). */
export function isAsaasUrl(url: unknown) {
  if (typeof url !== "string") return false;
  try {
    const u = new URL(url);
    return u.protocol === "https:" && (u.hostname === "asaas.com" || u.hostname.endsWith(".asaas.com"));
  } catch {
    return false;
  }
}
