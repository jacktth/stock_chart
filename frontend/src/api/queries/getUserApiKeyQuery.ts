import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase";
import type { PostgrestFilterBuilder } from "@supabase/postgrest-js";
export async function getUserApiKeyQuery(
  client: SupabaseClient<Database>,
  userId: string
) {
    
  const { data,error } = await client
    .from("apikeys")
    .select()
    .eq("user_id", userId);

  return data;
}
