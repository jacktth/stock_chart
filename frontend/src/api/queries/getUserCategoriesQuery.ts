import { SupabaseClient } from "@supabase/supabase-js";

export function getUserCategoriesQuery(client: SupabaseClient, userId: string) {
  return client.from("categories").select().eq("user_id", userId);
}
