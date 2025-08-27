import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseUrl.startsWith("http")) {
  throw new Error("VITE_SUPABASE_URL is missing or invalid.");
}
if (!supabaseAnonKey) {
  throw new Error("VITE_SUPABASE_ANON_KEY is missing.");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default supabase;
