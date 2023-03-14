import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase";

export async function deleteUserClipQuery(
  client: SupabaseClient<Database>,
  userId: string,
  name: string
) {

  const { status: clipStatus } = await client
    .from("clip")
    .delete()
    .eq("category", name)
    .eq("user_id", userId);
console.log("status ",{ clipStatus: clipStatus});

  return { clipStatus: clipStatus, };
}
