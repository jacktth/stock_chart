import { createClient } from "@supabase/supabase-js";
console.log(import.meta.env.REACT_APP_SUPABASE_URL)

const supabaseUrl = import.meta.env.VITE_REACT_APP_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
