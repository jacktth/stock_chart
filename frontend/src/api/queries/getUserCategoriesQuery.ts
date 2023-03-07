import { SupabaseClient } from "@supabase/supabase-js";

export function getUserCategoriesQuery(client: SupabaseClient, userId: string) {
  console.log("userId getting",userId);
  
  return client.from("categories").select().eq("user_id", userId);
}
