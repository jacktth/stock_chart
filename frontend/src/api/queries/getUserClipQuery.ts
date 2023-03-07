import { SupabaseClient } from "@supabase/supabase-js";

export function getUserClipQuery(client: SupabaseClient, userId: string) {
  return client.from("clip").select().eq("user_id", userId);
}
