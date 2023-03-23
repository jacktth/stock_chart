import { Database } from "src/api/types/supabase";

export type Categories = Database["public"]["Tables"]["categories"]["Row"]["name"][]