import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase";

export type Clip = Database["public"]["Tables"]["clip"]["Row"]

export async function getUserClipQuery(
  client: SupabaseClient<Database>,
  userId: string
) {
  const { data }:{data:Clip[]} = await client.from("clip").select().eq("user_id", userId);

  return data;
}
