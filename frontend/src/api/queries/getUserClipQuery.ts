import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase";

export async function getUserClipQuery(
  client: SupabaseClient<Database>,
  userId: string
) {
  const { data } = await client.from("clip").select().eq("user_id", userId);

  return data;
}
