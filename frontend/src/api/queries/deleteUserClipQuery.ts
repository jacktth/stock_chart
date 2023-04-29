import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase";

export async function deleteUserClipQuery(
  client: SupabaseClient<Database>,
  id: number,
  userId: string
) {
  const { status: clipStatus } = await client
    .from("clip")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  return { clipStatus: clipStatus };
}
