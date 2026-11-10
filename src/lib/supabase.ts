import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** A anon key é pública por design: quem protege os dados é o RLS (ver supabase/migrations). */
export const supabase = url && anonKey ? createClient(url, anonKey) : null;
