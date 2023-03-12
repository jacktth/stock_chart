import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase";
import type { PostgrestFilterBuilder } from "@supabase/postgrest-js";
export async function   getUserCategoriesQuery(client:SupabaseClient<Database>, userId: string) {
  const {data} =  await client.from('categories').select().eq("user_id", userId)

  return data
}
